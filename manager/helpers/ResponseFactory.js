class ResponseFactory {

    makeresponse(code, message, data = undefined){
        let response = {};
        response.codRetorno = code;
        response.descricaoRetorno = message;
        if(data){
            response.conteudo = data;
        }
        return response;
    }
}

export default ResponseFactory