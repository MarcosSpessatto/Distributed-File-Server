import net from 'net'
import stream from 'stream'

const Readable = stream.Readable;

class NetService {

    static upload(data) {
        return new Promise((resolve, reject) => {
            NetService
                .getConnection()
                .then((client) => {
                    let chunks = [];

                    let s = new Readable();
                    s._read = function (n) {

                    };

                    client.write(`PUT ${data.name} ${data.file}\n`)

                    client.on('data', (data) => {
                        let str = data.toString();
                        if (!str.includes('\n')) {
                            s.push(data)
                        } else {
                            data = data.toString().replace('\n', ' ');
                            s.push(data);
                            s.push(null);
                            client.destroy();
                        }
                    });

                    s.on('data', (data) => {
                        chunks.push(data)
                    });

                    s.on('end', () => {
                        const all = Buffer.concat(chunks);
                        resolve(JSON.parse(all.toString()))
                    })
                })
                .catch((e) => resolve({"codRetorno": 500, "descricaoRetorno": "Nenhum gerenciador ativo"}));
        })
    }

    static getFile(name) {
        return new Promise((resolve, reject) => {
            NetService
                .getConnection()
                .then((client) => {
                    let chunks = [];

                    let s = new Readable();
                    s._read = function (n) {

                    };

                    client.write(`GET ${name}\n`)

                    client.on('data', (data) => {
                        let str = data.toString();
                        if (!str.includes('\n')) {
                            s.push(data)
                        } else {
                            data = data.toString().replace('\n', ' ');
                            s.push(data)
                            s.push(null)
                            client.destroy();
                        }
                    });

                    s.on('data', (data) => {
                        chunks.push(data)
                    });

                    s.on('end', () => {
                        const all = Buffer.concat(chunks);
                        resolve(JSON.parse(all.toString()))
                    })
                }).catch((e) => resolve({"codRetorno": 500, "descricaoRetorno": "Nenhum gerenciador ativo"}));
        })
    }

    static deleteFile(name) {
        return new Promise((resolve, reject) => {
            NetService
                .getConnection()
                .then((client) => {

                    let chunks = [];

                    let s = new Readable();
                    s._read = function (n) {

                    };


                    client.write(`DELETE ${name}\n`);

                    client.on('data', (data) => {
                        let str = data.toString();
                        if (!str.includes('\n')) {
                            s.push(data)
                        } else {
                            data = data.toString().replace('\n', ' ');
                            s.push(data);
                            s.push(null);
                            client.destroy();
                        }
                    });

                    s.on('data', (data) => {
                        chunks.push(data)
                    });

                    s.on('end', () => {
                        const all = Buffer.concat(chunks);
                        resolve(JSON.parse(all.toString()))
                    })
                }).catch((e) => resolve({"codRetorno": 500, "descricaoRetorno": "Nenhum gerenciador ativo"}));
        })
    }

    static getConnection() {
        return new Promise((resolve, reject) => {
            let promises = [];
            for (let manager of global.managers) {
                let host = NetService.getHost(manager);
                promises.push(NetService.connect(host[0], host[1]));
            }
            Promise
                .race(promises)
                .then((value) => resolve(value))
                .catch((err) => reject(err));
        })
    }

    static connect(host, port) {
        return new Promise((resolve, reject) => {
            let client = new net.Socket();
            client.connect(port, host, () => {
                resolve(client);
            });

            client.on('error', (err) => {
            })
        })
    }

    static getHost(manager) {
        let regex = /^(https?):\/\//;
        let host = manager.replace(regex, '');

        return host.split(':');
    }

}


export default NetService