
export default function validate(params){
    validatePort(params);
    validateManagers(params);
}
function validatePort(params){
    if(!params.includes('--port')){
        console.log('\x1b[33m', 'Por favor informe a porta' ,'\x1b[0m');
        process.exit(1);
    } else{
        let index = params.findIndex((x) => x.includes('--port'));
        if(isNaN(params[index + 1])){
            console.log('\x1b[33m', 'A porta deverá ser um número' ,'\x1b[0m');
            process.exit(1);
        } else {
            global.port = params[index + 1];
        }
    }
}

function validateManagers(params){
    global.managers = [];
    if(!params.includes('--managers')){
        console.log('\x1b[33m', 'Por favor informe os gerenciadores para conectar' ,'\x1b[0m');
        process.exit(1);
    } else {
        let index = params.findIndex((x) => x.includes('--managers'));
        if(index === params.length - 1){
            console.log('\x1b[33m', 'Por favor informe os endereços dos gerenciadores' ,'\x1b[0m');
            process.exit(1);
        } else {
            for(let i = index + 1; i < params.length; i++){
                if(params[i].toLowerCase() === '--ip' || params[i].toLowerCase() === '--port'){
                    console.log('\x1b[33m', 'Por favor informe os endereços dos gerenciadores' ,'\x1b[0m');
                    process.exit(1);
                    break;
                } else {
                    global.managers.push(params[i]);
                }
            }
        }
    }
}