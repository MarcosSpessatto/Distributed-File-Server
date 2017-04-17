import net from 'net'
import SocketService from '../services/SocketService'
import validate from '../helpers/StartHelper'

validate(process.argv);

SocketService.init();
net.createServer((socket) => {}).listen(global.port);
console.log(`Server is running on port ${global.port}...`);
