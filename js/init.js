//peticion de personajes de una promesa
window.addEventListener('DOMContentLoaded', async()=>{
    let respuesta = await axios.get("https://rickandmortyapi.com/api/character")
    let personajes = respuesta.data.results;
    console.log(personajes);
})