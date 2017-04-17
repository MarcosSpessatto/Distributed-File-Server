import async from 'async'
import SocketService from './SocketService'
import transfer from './TransferService'
import DatabaseModel from '../models/DatabaseModel'

export default function balance() {
    const db = new DatabaseModel();
    async.forever((next) => {
        let files = 0;
        let remaining = [];
        let missing = [];
        db
            .isBalancing()
            .then((res) => {
                if (!res.balancing && res.queue > 0) {
                    db
                        .find()
                        .then((res) => {
                            files = res.length;
                            if (files > 30) {
                                let sockets = SocketService.Sockets;
                                if (sockets.length > 1) {
                                    db
                                        .setBalancing()
                                        .then((res) => {
                                            let array = [];
                                            for (let sct of sockets) {
                                                array.push(sct.id);
                                            }
                                            db
                                                .find({
                                                    online: true,
                                                    server: {$in: array}
                                                })
                                                .then((servers) => {
                                                    let filesFromServer = servers.length;
                                                    let expect = parseInt(filesFromServer / sockets.length, 10);
                                                    let filesByServer = getFilesByServer(servers, sockets);
                                                    let object = {};
                                                    for (let server of filesByServer) {
                                                        if (server.count > expect) {
                                                            object.server = server.id;
                                                            object.files = server.count - expect;
                                                            remaining.push(object)
                                                        } else if (server.count < expect) {
                                                            object.server = server.id;
                                                            object.files = expect - server.count;
                                                            missing.push(object);
                                                        }
                                                        object = {};
                                                    }
                                                    if (remaining.length > 0 && missing.length > 0) {
                                                        transfer(remaining, missing, sockets)
                                                            .then((res) => {
                                                                db
                                                                    .updateBalance()
                                                                    .then((res) => {
                                                                        setTimeout(function () {
                                                                            next()
                                                                        }, 1000);
                                                                    })
                                                                    .catch((e) => console.log(e))
                                                            })
                                                            .catch((e) => {
                                                                db
                                                                    .updateBalance()
                                                                    .then((res) => {
                                                                        setTimeout(function () {
                                                                            next()
                                                                        }, 1000);
                                                                    })
                                                                    .catch((e) => console.log(e))
                                                            })
                                                    } else {
                                                        db
                                                            .updateBalance()
                                                            .then((res) => next())
                                                            .catch((e) => next(e))
                                                    }
                                                })
                                        });
                                } else {
                                    db
                                        .updateBalance()
                                        .then((res) => next())
                                        .catch((e) => next(e))
                                }
                            } else {
                                db
                                    .updateBalance()
                                    .then((res) => next())
                                    .catch((e) => console.log(e))
                            }
                        })
                } else {
                    next();
                }
            });

    });
}

function getFilesByServer(servers, sockets) {
    let array = [];
    let obj = {};
    for (let socket of sockets) {
        obj.id = socket.id;
        obj.count = 0;
        array.push(obj);
        obj = {};
    }
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < servers.length; j++) {
            if (servers[j].server === array[i].id) {
                array[i].count++;
            }
        }
    }
    return array;
}
