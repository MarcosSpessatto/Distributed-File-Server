
export default function validate(params){
    validateClientPort(params);
    validateServerPort(params);
    validateIp(params);
}

function validateClientPort(params){
    if(!params.includes('--client-port')){
        console.log('\x1b[33m', 'Por favor informe a porta para o cliente conectar' ,'\x1b[0m');
        process.exit(1);
    } else{
        let index = params.findIndex((x) => x.includes('--client-port'));
        if(isNaN(params[index + 1])){
            console.log('\x1b[33m', 'A porta deverá ser um número' ,'\x1b[0m');
            process.exit(1);
        } else {
            global.clientPort = params[index + 1];
        }
    }
}

function validateServerPort(params){
    if(!params.includes('--server-port')){
        console.log('\x1b[33m', 'Por favor informe a porta para os servers conectarem' ,'\x1b[0m');
        process.exit(1);
    } else{
        let index = params.findIndex((x) => x.includes('--server-port'));
        if(isNaN(params[index + 1])){
            console.log('\x1b[33m', 'A porta deverá ser um número' ,'\x1b[0m');
            process.exit(1);
        } else {
            global.serverPort = params[index + 1];
        }
    }
}

function validateIp(params){
    if(!params.includes('--ip')){
        console.log('\x1b[33m', 'Por favor informe o ip da máquina' ,'\x1b[0m');
        process.exit(1);
    } else {
        let index = params.findIndex((x) => x.includes('--ip'));
        let regex = new RegExp('^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
        if(!regex.test(params[index + 1])){
            console.log('\x1b[33m', 'O ip não está no padrão IPV4' ,'\x1b[0m');
            process.exit(1);
        } else {
            global.ip = params[index + 1];
        }
    }
}