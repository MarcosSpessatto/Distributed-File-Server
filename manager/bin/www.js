import app from '../app'

const server = app.listen(global.serverPort, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Manager is running on port ' + port + '...');
});

app.io.attach(server);