const app = require('../app');

var server = app.listen(3050, function() {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Client running on port ' + port + '...');
});
