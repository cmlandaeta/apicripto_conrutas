const modenaSelect = document.querySelector('#moneda');
const criptoSelect = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objCripto = {
    moneda:'',
    criptomoneda:''
}



const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas)
    console.log(criptomonedas)
})



document.addEventListener('DOMContentLoaded',() => {

    consultarCriptomonedas()

    formulario.addEventListener('submit', submitFormulario);

    modenaSelect.addEventListener('change', leerDatos);
    criptoSelect.addEventListener('change', leerDatos)
})

function leerDatos(e){ 
    objCripto[e.target.name] = e.target.value;    // asi agrego datos al objeto  name viene del html y debe colocar el mismo nombre del atributo del objeto

   console.log(objCripto)
}

function submitFormulario(e){

    e.preventDefault();

    const { moneda, criptomoneda} = objCripto;

    if(moneda === ''|| criptomoneda === ''){
        monstrarAlerta('los campos son obligatorios');
        return
    }


   consultarAPI();

}

function consultarAPI(){

    const {moneda, criptomoneda} = objCripto;

    const url = ` https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    spinner()
    fetch(url)
    .then(respuesta => respuesta.json())
    //.then(cotizar => {
       // console.log(cotizar.DISPLAY[criptomoneda][moneda]) //navego por el objeto que da la respuesta del fetch
    //})
   .then(cotizar => {
       mostrarCotizacion(cotizar.DISPLAY[criptomoneda][moneda]) //navego por el objeto que da la respuesta del fetch
    })

    
}

function mostrarCotizacion(cotizacion){

    limpiarHTML()

    const{PRICE, LASTUPDATE, HIGHDAY, LOWDAY,CHANGEPCT24HOUR} = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: ${PRICE}`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `El precio mas alto del dia: ${HIGHDAY}`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `El precio mas Bajo del dia: ${LOWDAY}`;

    const ultimaAct = document.createElement('p');
    ultimaAct.innerHTML = `Ultima Actualizacion: ${LASTUPDATE}`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `Variacion en la ultimas 24 horas: ${CHANGEPCT24HOUR}`


    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimaAct);
    resultado.appendChild(ultimasHoras)


    formulario.appendChild(resultado)

}

function monstrarAlerta(msj){
    const divMensaje = document.createElement('div')
    divMensaje.classList.add('error');
    divMensaje.textContent = msj;
    formulario.appendChild(divMensaje);
    setTimeout(()=>{
        divMensaje.remove()
    },3000)
}

function consultarCriptomonedas(){

    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
    //.then(cripto => console.log(cripto.json()))
    .then(respuesta => respuesta.json())
    
    .then (resultado => obtenerCriptomonedas(resultado.Data))
    .then(cripto=> selectCriptomonedas(cripto))
    //.then(cripto=> console.log(cripto))
    .catch(error=>{
        console.log(error)
    })
}

// Llenar el select de las criptomonedas

function selectCriptomonedas(criptomonedas){

    criptomonedas.forEach(cripto =>{

        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptoSelect.appendChild(option);
    })

}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
 }


 function spinner(){

    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-fading-circle');
    divSpinner.innerHTML = ` <div class="lds-spinner"><div></div><div></div><div></div><div></div><div>`

   resultado.appendChild(divSpinner)
 }