# Distributed-File-Server

Para rodar o sistema distribuido, siga os seguintes passos:

Com o NODEJS instalado na máquina

RODE O ARQUIVO run.sh para baixar as dependencias do projeto

Faça quantas cópias de cada pasta que achar necessário para o bom funcionamento do sistema.

Rode o MongoDB na porta padrão (27017)

Rode antes todos os gerenciadores do sistema da seguinte forma:

GERENCIADOR

Exemplo:
node -r babel-register -r babel-polyfill bin/www.js --server-port 3000 --client-port 3030 --ip 192.168.50.103

onde: 
 --server-port: porta em que os servers irão se conectar por meio de sockets(socketIO https://socket.io/)
 --client-port: porta em que os clients irão se conectar por meio de sockets TCP (NET module https://nodejs.org/api/net.html)
--ip: é o ip para acesso externo da máquina, onde servers e clients se conectarão

SERVIDOR

Exemplo:
node -r babel-register -r babel-polyfill bin/www.js --ip 192.168.50.103 --port 3001 --managers http://localhost:3000 

onde:

--ip: ip da máquina onde está o server
--port: porta que irá rodar
--managers: lista dos endereços de gerenciadores ativos, (endereço e porta)

CLIENT

Exemplo:
node -r babel-register -r babel-polyfill bin/www.js --port 3050 --managers http://192.168.50.103:3030

onde:
--port: porta onde irá rodar
--managers: lista dos endereços de gerenciadores ativos (endereço e porta)


Caso queira ter uma visão de todos os arquivos disponíveis em lista, rode um gerenciador na porta 3000,
caso contrário para pegar um arquivo é só fazer um GET nomearquivo

O cliente se encarregará de escolher qualquer um dos gerenciadores ativos no momento, caso um caia ele tentará comunicação com qualquer outro automaticamente.