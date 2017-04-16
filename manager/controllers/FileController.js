import Messages from '../helpers/Messages.json'
import SocketService from '../services/SocketService'
import DatabaseModel from '../models/DatabaseModel'
import ResponseFactory from '../helpers/ResponseFactory'

class FileController {

    constructor() {
        this.database = new DatabaseModel();
        this.response = new ResponseFactory();
    }

    upload(name, file) {
        return new Promise((resolve, reject) => {
            let json = {file: file, name: name};
            this.database.findOne(name)
                .then((res) => (res ? false : true))
                .then((res) => (res ? SocketService.upload(json) : this.response.makeresponse(Messages.fileExists.code, Messages.fileExists.status)))
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }

    getAll(request, response, next) {
         this.database.getAll((res) => {})
            .then((res) => response.json(res))
            .catch((e) => next(e));
    }

    getByName(name) {
        return new Promise((resolve, reject) => {
            if (name) {
                SocketService.getFileFromServer(name)
                    .then((res) => resolve(res))
                    .catch((e) => reject(e));
            } else {
                reject(this.response.makeresponse(Messages.parameters.code, Messages.parameters.status));
            }
        })

    }

    delete(name) {
        return new Promise((resolve, reject) => {
            if (name) {
                SocketService.deleteFileOfServer(name)
                    .then((res) => (res.codRetorno === 1 ? resolve(res) : this.database.delete(name)))
                    .then((res) => resolve(this.response.makeresponse(Messages.ok.code, Messages.ok.status)))
                    .catch((e) => reject(e));
            } else {
                reject(this.response.makeresponse(Messages.parameters.code, Messages.parameters.status));
            }
        })
    }
}

export default FileController;