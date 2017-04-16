import FileController from '../controllers/FileController'

function manager(app){

    const fileController = new FileController();

    app
        .get('/api/files', fileController.getAll.bind(fileController))
}

module.exports = manager;