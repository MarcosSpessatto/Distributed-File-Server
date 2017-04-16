import SocketService from './SocketService'
import DatabaseModel from '../models/DatabaseModel'
import async from 'async'

export default function transfer(filesFrom, filesTo, sockets) {
    return new Promise((resolve, reject) => {
        filePromises(filesFrom)
            .then((res) => makePromises(res, filesTo, sockets))
            .then((res) => resolve())
            .catch((e) => reject(e))
    });
}

function filePromises(servers) {
    return new Promise((resolve, reject) => {
        let promises = [];
        let result = [];
        const db = new DatabaseModel();
        for (let server of servers) {
            promises
                .push(db
                    .find({server: server.server}, server.files));
        }
        Promise
            .all(promises)
            .then((res) => {
                for (let file of res) {
                    for (let f of file) {
                        result.push(f)
                    }
                }
                resolve(result);
            })
            .catch((e) => reject(e));
    });
}

function makePromises(files, to, sockets) {
    return new Promise((resolve, reject) => {
        const db = new DatabaseModel();
        let count = 0;
        async.whilst(
            function () {
                if(count === files.length){
                    resolve();
                }
                return count < files.length;
            },
            function (callback) {
                db
                    .getBestServer()
                    .then((res) => {
                        let servers = getServers(res, sockets);
                        let socket = SocketService.compareAndReturnBestSocket(servers);
                        SocketService
                            .getFileFromServer(files[count].name)
                            .then((res) => {
                                if(socket.id !== files[count].server){
                                    let json = {file: res.conteudo, name: files[count].name};
                                    SocketService
                                        .sendForBalance(json, socket)
                                        .then((res) => {
                                            if (res.codRetorno === 0) {
                                                SocketService
                                                    .deleteForBalance(files[count].name, files[count].server)
                                                    .then((res) => {
                                                        count++;
                                                        callback(null, count)
                                                    })
                                                    .catch((e) => reject());
                                            }
                                        }).catch((e) => reject(e))
                                } else {
                                    count++;
                                    callback(null, count)
                                }
                            })
                            .catch((e) => reject(e))
                    })
            },
            function (err, n) {
            }
        );
    })

}

function getServers(servers, sockets) {
    let found = false;
    let array = [];
    for (let i = 0; i < sockets.length; i++) {
        for (let j = 0; j < servers.length; j++) {
            if (servers[j]._id === sockets[i].id) {
                found = true;
                break;
            }
        }
        if (!found) {
            servers.unshift({_id: sockets[i].id, count: 0})
        }
        found = false;
    }
    return servers;
}
