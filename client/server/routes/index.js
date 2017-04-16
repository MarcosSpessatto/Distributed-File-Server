import FileController from '../controllers/FileController'
import multiparty from 'connect-multiparty'

function index(app){

    const fileController = new FileController();
    const multipartyMiddleware = multiparty();

    app
        .post('/api/upload', multipartyMiddleware, fileController.upload)
        .get('/api/files', fileController.getAll)
        .get('/api/file/:name', fileController.getByName)
        .delete('/api/file/delete/:name', fileController.delete);
}

module.exports = index;