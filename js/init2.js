//Registro del service Worker
if(navigator.serviceWorker){ //si esta disponible en este navegador
    if(window.location.href.include("localhost")){
        navigator.serviceWorker.register("/sw.js");
    }else
        //esta en un servidor web
        navigator.serviceWorker.register("RickMortinApi/sw.js");
}

//peticion de personajes de una promesa
window.addEventListener('DOMContentLoaded', async()=>{
    //retorna una promesa
    let respuesta = await axios.get("https://rickandmortyapi.com/api/location")
    let location = respuesta.data.results;
    console.log(location);
    window.mostrar(location);
})

window.mostrar = (location)=>{
    const molde = document.querySelector(".molde");
    const contenedor = document.querySelector(".contenedor");

    for (let i=0; i< location.length; ++i){
        let loc = location[i];
        let copia = molde.cloneNode(true);
        copia.querySelector(".tabla-nombre").innerText = loc.name;
        copia.querySelector(".tabla-tipo").innerText = loc.type;
        copia.querySelector(".tabla-dimencion").innerText = loc.dimension;
        copia.querySelector(".tabla-residentes").residente = loc.residents;
        copia.querySelector(".tabla-residentes").addEventListener('click',window.mostrarRecidente);
        contenedor.appendChild(copia);
    }
}

window.mostrarRecidente = function(){
    let residente = this.residente;
    console.log(residente);
}