//Registro del service Worker
if(navigator.serviceWorker){ //si esta disponible en este navegador
    if(window.location.href.includes("localhost")){
        navigator.serviceWorker.register("/sw.js");
    }else
        //esta en un servidor web
        navigator.serviceWorker.register("RickMortinApi/sw.js");
}




window.mostrarPersonaje = function(){
    //1 crear molde
    let molde = document.querySelector(".molde-personaje-sa").cloneNode(true);
    let personaje = this.personaje;
    molde.querySelector(".nombre-per").innerText = personaje.name;
    molde.querySelector(".especie-per").innerText = personaje.species;
    molde.querySelector(".genero-per").innerText = personaje.gender;

    const icono = molde.querySelector(".icono-estado");
    if(personaje.status == "Dead"){
        icono.classList.add("fas","fa-skill-crossbone","text-danger");
    }else if(personaje.status == "Alive"){
        icono.classList.add("fab","fa-odnoklassniki","text-primary");
    }else if(personaje.status == "unknown"){
        icono.classList.add("fas","fa-question","text-success");
    }

    molde.querySelector(".imagen-per").src = personaje.image;

    Swal.fire({
        title: personaje.name,
        html: molde.innerHTML
    });
}


window.mostrar = (personajes)=>{
    const molde = document.querySelector(".molde-personaje");
    const contenedor = document.querySelector(".contenedor");
    for(let i=0; i< personajes.length; ++i){
        let p = personajes[i];
        let copia = molde.cloneNode(true);
        copia.querySelector(".nombre-personaje").innerText = p.name;
        copia.querySelector(".imagen-personaje").src = p.image;
        copia.querySelector(".btn-personaje").personaje = p; //guarda todos los datos del objeto en el un atributo del button
        copia.querySelector(".btn-personaje").addEventListener('click',window.mostrarPersonaje);
        contenedor.appendChild(copia);
    } 
}

//peticion de personajes de una promesa
window.addEventListener('DOMContentLoaded', async()=>{
    //retorna una promesa
    let respuesta = await axios.get("https://rickandmortyapi.com/api/character")
    let personajes = respuesta.data.results;
    console.log(personajes);
    window.mostrar(personajes);
})