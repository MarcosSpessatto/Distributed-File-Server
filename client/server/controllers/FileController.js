import NetService from '../services/NetService'
import fs from 'fs'
import req from 'request'

class FileController {

    upload(request, response, next) {
        fs.readFile(request.files.file.path, (err, data) => {
            if (err) {
                return next('File Error');
            }
            let json = {file: data.toString('base64'), name: request.body.name};
            NetService
                .execute(json, 'PUT')
                .then((res) => response.json(res))
                .catch((e) => response.json(e));
        });
    }

    getAll(request, response, next) {
        req.get({
            method: 'GET',
            url: `http://localhost:3000/api/files`
        }, (err, res, body) => {
            if (err) {
                req.get({
                    method: 'GET',
                    url: `http://localhost:3000/api/files`
                }, (err, res, body) => {
                    if (err) {
                        response.json({codRetorno: 500, descricaoRetorno: 'No preview available'})
                    } else {
                        response.json(JSON.parse(body))
                    }
                })
            } else {
                response.json(JSON.parse(body))
            }
        })
    }

    getByName(request, response, next) {
        NetService
            .execute({name: request.params.name}, 'GET')
            .then((res) => response.json(res))
            .catch((e) => response.json(e));
    }

    delete(request, response, next) {
        NetService
            .execute({name: request.params.name}, 'DELETE')
            .then((res) => response.json(res))
            .catch((e) => response.json(e));
    }

}

export default FileController;