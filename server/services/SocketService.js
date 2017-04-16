import ResponseFactory from '../helpers/ResponseFactory'
import Messages from '../helpers/Messages.json'
import FileHelper from '../helpers/FileHelper'
import fs from 'fs'
import io from 'socket.io-client'

class SocketService {

    static socketServer;
    static sockets = [];
    static response = new ResponseFactory();

    static init(app) {
        const myAddress = `${global.ip}:${global.port}`;

        let sockets = [];

        for (let manager of global.managers) {
            sockets.push(io.connect(manager, {
                reconnect: true,
                query: `name=${myAddress}`
            }));
        }

        SocketService.connect(sockets, myAddress);
    }

    static connect(sockets, myAddress) {
        for (let socket of sockets) {
            //upload
            socket.on('upload', (data, callback) => {
                if (data.server === myAddress) {
                    let filename = data.name;
                    let bitmap = Buffer.from(data.file, 'base64');
                    let basePath = fs.realpathSync('.') + '/uploads/';
                    if (!fs.existsSync(basePath)) {
                        fs.mkdirSync(basePath, 0o766, (err) => {
                        });
                    }
                    let path = `${basePath}${filename}`;
                    fs.writeFile(path, bitmap, (err) => {
                        if (err) {
                            callback(500);
                        }
                        callback(Messages.ok);
                    });
                }
            });

            //download
            socket.on('download', (data, callback) => {
                if (data.server === myAddress) {
                    let basePath = fs.realpathSync('.') + '/uploads/';
                    let path = `${basePath}${data.name}`;
                    fs.readFile(path, (err, data) => {
                        if (err) {
                            callback(500);
                        }
                        callback(SocketService.response.makeresponse(Messages.ok.code, Messages.ok.status, new Buffer(data).toString('base64')));
                    });
                }
            });

            socket.on('getFileNames', (data, callback) => {
                let files = [];
                if (data.server === myAddress) {
                    let basePath = fs.realpathSync('.') + '/uploads/';
                    if (fs.existsSync(basePath)) {
                        if (fs.statSync(basePath).isDirectory()) {
                            files = FileHelper.walkSync(basePath);
                            callback(files)
                        }
                    }
                    callback(500)
                }
            });


            //delete
            socket.on('delete', (data, callback) => {
                if (data.server === myAddress) {
                    let basePath = fs.realpathSync('.') + '/uploads/';
                    let path = `${basePath}${data.name}`;
                    fs.exists(path, (exists) => {
                        if (exists) {
                            fs.unlinkSync(path);
                            callback(SocketService.response.makeresponse(Messages.ok.code, Messages.ok.status));
                        }
                        callback(500);
                    });
                }
            });
        }
    }
}

export default SocketService;