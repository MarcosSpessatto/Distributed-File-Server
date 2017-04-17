import net from 'net'
import ResponseFactory from '../helpers/ResponseFactory'
import Messages from '../helpers/Messages.json'
import FileController from '../controllers/FileController'
import stream from 'stream'

const Readable = stream.Readable;


class SocketClientServer {

    static init() {

        net.createServer({
            allowHalfOpen: false
        }, (connection) => {

            const Readable = stream.Readable;

            let chunks = [];

            let s = new Readable();
            s._read = function (n) {

            };

            connection.on('data', (data) => {
                let str = data.toString();
                if(!str.includes('\n')){
                    s.push(data)
                } else {
                    s.push(data);
                    s.push(null)
                }
            });

            s.on('data', (chunk) => chunks.push(chunk));

            s.on('end', () => {
                const data = Buffer.concat(chunks);
                let request = data.toString('utf8').replace('\n', ' ');
                chooseOption(request)
                 .then((res) => connection.write(`${JSON.stringify(res)}\n`))
                 .catch((e) => connection.write(`${JSON.stringify(e)}\n`))
            });

            connection.on('end', function () {
            });

            connection.on('close', function () {

            });

            connection.on('error', (error) => {

            })

        }).listen(global.clientPort, global.ip);

    }
}

function chooseOption(data) {
    return new Promise((resolve, reject) => {
        const fileController = new FileController();
        let textData = data;
        if (typeof data === 'object') {
            textData = data.toString('utf8');
        }
        let option = textData.split(' ');
        if (option.length >= 2 && option.length <= 4) {
            if (option[0].includes('GET') || option[0].includes('PUT') || option[0].includes('DELETE')) {
                switch (option[0]) {
                    case 'GET':
                        executeGet(option[1], fileController)
                            .then((res) => resolve(res))
                            .catch((e) => resolve(e));
                        break;
                    case 'PUT':
                        executePut(option[1], option[2], fileController)
                            .then((res) => resolve(res))
                            .catch((e) => resolve(e));
                        break;
                    case 'DELETE':
                        executeDelete(option[1], fileController)
                            .then((res) => resolve(res))
                            .catch((e) => resolve(e));
                        break;
                }
            } else {
                resolve(new ResponseFactory().makeresponse(Messages.wrongCommand.code, Messages.wrongCommand.status))
            }
        } else {
            resolve(new ResponseFactory().makeresponse(Messages.wrongCommand.code, Messages.wrongCommand.status))
        }
    })
}

function executeGet(name, fileController) {
    return new Promise((resolve, reject) => {
        if (name) {
            fileController
                .getByName(name)
                .then((res) => resolve(res))
                .catch((e) => resolve(e));
        } else {
            resolve(new ResponseFactory().makeresponse(Messages.wrongCommand.code, Messages.wrongCommand.status))
        }
    })
}

function executePut(name, file, fileController) {
    return new Promise((resolve, reject) => {
        if (name && file) {
            fileController
                .upload(name, file)
                .then((res) => resolve(res))
                .catch((e) => resolve(e));

        } else {
            resolve(new ResponseFactory().makeresponse(Messages.wrongCommand.code, Messages.wrongCommand.status))
        }
    });
}

function executeDelete(name, fileController) {
    return new Promise((resolve, reject) => {
        if (name) {
            fileController
                .delete(name)
                .then((res) => resolve(res))
                .catch((e) => resolve(e));
        } else {
            resolve(new ResponseFactory().makeresponse(Messages.wrongCommand.code, Messages.wrongCommand.status))
        }
    })
}

export default SocketClientServer
