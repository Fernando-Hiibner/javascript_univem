async function buscarCep(event) {
    // o target do event é o elemento que está disparando o evento, ou seja, o input
    let input = event.target.value; // 17500-100
    let cep = input.match(/\d+/g).join(''); // 17500100

    let res = await fetch("https://viacep.com.br/ws/" + cep + "/json");
    if (res.status == 200) {
        let endereco = await res.json();

        let cidade = document.querySelector("form input[name=cidade]");
        cidade.value = endereco.localidade;

        let bairro = document.querySelector("form input[name=bairro]");
        bairro.value = endereco.bairro;
        if(endereco.bairro == ""){
            bairro.focus();
        }

        let uf = document.querySelector("form input[name=uf]");
        uf.value = endereco.uf;

        let logradouro = document.querySelector("form input[name=logradouro]");
        logradouro.value = endereco.logradouro;
        if(endereco.bairro != "" && endereco.logradouro == ""){
            logradouro.focus();
        }

        let numero = document.querySelector("form input[name=numero]");
        if(endereco.bairro != "" && endereco.logradouro != ""){
            numero.focus();
        }
    }
}


async function registrar(event) {
    event.preventDefault();
    let form = event.target;

    let jsonBody = formDataToJson(form);
    console.log("jsonbody"+jsonBody);

    let jsonString = JSON.stringify(jsonBody);

    let res = await sendRequest("/api/usuario", {
        method: "POST",
        body: jsonString,
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (res.status == 200) {
        alert("Cadastrado com sucesso! Vá para a pagina de login");
    }else if(res.status == 422){
        let registerError =  await res.json();
        let registerErrorArray = registerError.errors;
        for(var i = 0; i < registerErrorArray.length; i++){
            console.log(registerErrorArray[i]);
            let messageError = registerErrorArray[i].message;
            alert(messageError);
        }
    }else{
        alert("Houve erro na criacao do usuario "+ res.status);
    }
}


window.buscarCep = buscarCep;
window.registrar = registrar;