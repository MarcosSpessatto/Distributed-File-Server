import config from 'config'
import Messages from '../helpers/Messages.json'
import ResponseFactory from '../helpers/ResponseFactory'
import DatabaseModel from '../models/DatabaseModel'
import  balance  from './BalanceService'

class SocketService {

    static Sockets = [];
    static database = new DatabaseModel();
    static response = new ResponseFactory();

    static init(app) {

        app.io.on('connection', (socket) => {

            SocketService.Sockets.push({
                'id': socket.handshake.query.name,
                'socket': socket
            });

            SocketService.verifyBalance();

            socket.emit('getFileNames', {
                server: socket.handshake.query.name
            }, (response) => {
                let promises = [];
                if (response !== 500) {
                    response.forEach((file) => {
                        promises.push(SocketService.database.updateOne({
                            server: socket.handshake.query.name,
                            online: true
                        }, file));
                    });
                    Promise.all(promises)
                        .then((res) => {
                        })
                        .catch((e) => {
                        })
                }
            });

            socket.on('disconnect', () => {
                let index = SocketService
                    .Sockets
                    .map((e) => e.id)
                    .indexOf(socket.handshake.query.name);
                if (index !== -1) {
                    SocketService.Sockets.splice(index, 1);
                }
                let data = {
                    online: false
                };
                SocketService
                    .database
                    .update(data, socket.handshake.query.name)
                    .then((res) => {
                    })
                    .catch((e) => {
                    })
            })

        });

        balance();

    }

    static verifyBalance() {
        SocketService
            .database
            .updateQueue()
            .then((res) => {
            })
            .catch((e) => {
            })
    }

    static upload(json) {
        return new Promise((resolve, reject) => {
            let socket = null;
            SocketService.database.getBestServer()
                .then((res) => {
                    if (res.length > 0) {
                        if (res.length === SocketService.Sockets.length) {
                            if (res && res.length > 0) {
                                socket = SocketService.compareAndReturnBestSocket(res);
                            }
                        } else {
                            socket = SocketService.getSocketInMemory();
                        }
                    } else {
                        socket = SocketService.getSocketInMemory();
                    }
                    if (socket) {
                        json.server = socket.id;
                        json.online = true;
                        socket.socket.emit('upload', json, (res) => {
                            if (res !== 500) {
                                SocketService.database.insertFile({
                                    'name': json.name,
                                    'server': json.server,
                                    'online': true
                                }, 'files')
                                    .then((response) => resolve(SocketService.response.makeresponse(Messages.ok.code, Messages.ok.status)))
                                    .catch((e) => {
                                    });
                            } else {
                                resolve(SocketService.response.makeresponse(Messages.unavailable.code, Messages.unavailable.status));
                            }
                        });
                    } else {
                        resolve(SocketService.response.makeresponse(Messages.unavailable.code, Messages.unavailable.status));
                    }
                }).catch((e) => resolve(SocketService.response.makeresponse(Messages.unavailable.code, Messages.unavailable.status)));
        });
    }

    static compareAndReturnBestSocket(res) {
        let socket = null;
        for (let j = 0; j < res.length; j++) {
            for (let i = 0; i < SocketService.Sockets.length; i++) {
                if (!socket) {
                    if (SocketService.Sockets[i].id === res[j]._id) {
                        if (SocketService.Sockets[i].socket.connected) {
                            socket = SocketService.Sockets[i];
                            break;
                        }
                    }
                }
            }
        }
        return socket;
    }

    static getSocketInMemory() {
        let socket = null;
        for (let i = 0; i < SocketService.Sockets.length; i++) {
            if (SocketService.Sockets[i].socket.connected) {
                socket = SocketService.Sockets[i];
                let s = SocketService.Sockets.shift();
                SocketService.Sockets.push(s);
                break;
            }
        }
        return socket;
    }

    static getFileFromServer(name) {
        return new Promise((resolve, reject) => {
            SocketService.database.findOne(name)
                .then((res) => res.server)
                .then((server) => SocketService.Sockets.find((x) => x.id === server))
                .then((socket) => {
                    if (socket.socket.connected) {
                        socket.socket.emit('download', {
                            'server': socket.id,
                            'name': name
                        }, (res) => {
                            if (res !== 500) {
                                resolve(res);
                            }
                            resolve(SocketService.response.makeresponse(Messages.unavailable.code, Messages.unavailable.status));
                        })
                    } else {
                        resolve(SocketService.response.makeresponse(Messages.unavailable.code, Messages.unavailable.status));
                    }
                }).catch((e) => resolve(SocketService.response.makeresponse(Messages.unavailable.code, Messages.unavailable.status)));
        });
    }

    static deleteFileOfServer(name) {
        return new Promise((resolve, reject) => {
            SocketService.database.findOne(name)
                .then((res) => res.server)
                .then((server) => SocketService.Sockets.find((x) => x.id === server))
                .then((socket) => {
                    if (socket.socket.connected) {
                        socket.socket.emit('delete', {
                            'server': socket.id,
                            'name': name
                        }, (res) => {
                            if (res !== 500) {
                                resolve(res);
                            }
                            resolve(SocketService.response.makeresponse(Messages.unavailable.code, Messages.unavailable.status));
                        })
                    } else {
                        resolve(SocketService.response.makeresponse(Messages.unavailable.code, Messages.unavailable.status));
                    }
                }).catch((e) => resolve(SocketService.response.makeresponse(Messages.unavailable.code, Messages.unavailable.status)));
        });
    }

    static sendForBalance(json, socket) {
        return new Promise((resolve, reject) => {
            json.server = socket.id;
            socket.socket.emit('upload', json, (res) => {
                if (res !== 500) {
                    SocketService.database.updateOne({
                        'server': json.server,
                        'online': true
                    }, json.name)
                        .then((response) => resolve(SocketService.response.makeresponse(Messages.ok.code, Messages.ok.status)))
                        .catch((e) => {
                        });
                } else {
                    resolve(SocketService.response.makeresponse(Messages.unavailable.code, Messages.unavailable.status));
                }
            });
        })
    }

    static deleteForBalance(name, server) {
        return new Promise((resolve, reject) => {
            let socket = SocketService.Sockets.find((x) => x.id === server);
            socket.socket.emit('delete', {
                'server': socket.id,
                'name': name
            }, (res) => {
                if (res !== 500) {
                    resolve(res);
                }
                resolve(SocketService.response.makeresponse(Messages.unavailable.code, Messages.unavailable.status));
            })
        });
    }
}
export default SocketService;