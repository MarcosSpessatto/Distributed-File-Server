import ResponseFactory from '../helpers/ResponseFactory'
import Messages from '../helpers/Messages.json'
import FileHelper from '../helpers/FileHelper'
import io from 'socket.io-client'

class SocketService {

    static response = new ResponseFactory();

    static init() {
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
                    FileHelper
                        .writeFile(filename, bitmap)
                        .then((res) => callback(Messages.ok))
                        .catch((e) => callback(500));
                }
            });

            //download
            socket.on('download', (data, callback) => {
                if (data.server === myAddress) {
                    FileHelper
                        .readFile(data.name)
                        .then((res) =>
                            callback(
                                SocketService
                                    .response
                                    .makeresponse(Messages.ok.code, Messages.ok.status, res)))
                        .catch((e) => callback(500));
                }
            });

            socket.on('getFileNames', (data, callback) => {
                let files = [];
                if (data.server === myAddress) {
                    let files = FileHelper.checkMainDir(global.serverName);
                    callback(files.allFiles);
                }
            });


            //delete
            socket.on('delete', (data, callback) => {
                if (data.server === myAddress) {
                    FileHelper
                        .deleteFile(data.name)
                        .then((res) =>
                            callback(
                                SocketService
                                    .response
                                    .makeresponse(Messages.ok.code, Messages.ok.status)))
                        .catch((e) => callback(500));
                }
            });
        }
    }
}

export default SocketService;
