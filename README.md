# Distributed-File-Server

## System Premises
- See this [repository](https://github.com/selatotal/SistemasDistribuidos/tree/master/Trabalhos/201701)

### Prerequisites
NodeJS<br/>
MongoDB

### Instalation
- Run MongoDB (port 27017 default)
- Run 'run.sh' to install dependencies

## MANAGERS
#### Example:
 - node -r babel-register -r babel-polyfill <span>bin/www.js</span> --server-port 3000 --client-port 3030 --ip 192.168.50.103 <br/>
Where: <br/>
- --server-port: Port on which the servers will connect via Websockets ([Socket.IO](https://socket.io/))
- --client-port: Port on which the servers will connect via sockets TCP ([NET module](https://nodejs.org/api/net.html))
- --ip: extern IP, to clients and servers connect.

## SERVERS
#### Example: 
node -r babel-register -r babel-polyfill bin/www.js --ip 192.168.50.103 --port 3001 --managers `http://localhost:3000` --name server_name <br/>

Where: <br/>
 - --ip: ip of computer
- --port: port to run
- --managers: active managers list (adress and port)
- --name: server name, to create a folder of files from that server

## CLIENTS
#### Example
node -r babel-register -r babel-polyfill bin/www.js --port 3050 --managers `http://192.168.50.103:3030` <br/>

Where: <br/>
- --port: Port to run
- --managers: active managers list (adress and port)

### Developed only for academic purposes of computer science course.
#### Technologies
- NodeJS
- MongoDB
- TCP sockets (to connect with multiples languages)
- SocketIO
- ES6 features
- AngularJS

### Authors
[@MarcosSpessatto](https://github.com/MarcosSpessatto) <br/>
[@pedrokehl](https://github.com/pedrokehl)
