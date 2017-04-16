import app from '../app'

const server = app.listen(global.port, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Server is running on port ' + port + '...');
});
