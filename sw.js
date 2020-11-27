
//Estrategias de Cache de PWA
//1. Cache Only: la aplicacion se carga siempre de cache, ba una vez a la red y nunca mas
//2. Cache whit Network Fallback: Veo el cache, si no esta, voy a la network
//3. Network whit Cache Fallback: Voy a la red pero si la red no existe, cargo cache
//4. Cache Dinamico: Una combi de las 3 estrategias de cache
    //si un elemento no esta en el cache, lo guarsdo para la proxima peticion
    //no tienes seguridad de los elemetnos que van a ser cargados en cache



//APP SHELL : son los elementos que requiere si o si la web para funcionar
//los recursos
const APP_SHELL =[
    //"/",
    "index.html",
    "vendor/fontawesome-free-5.15.1-web/css/all.min.css",
    "css/style.css",
    "img/Rick_and_Morty.svg",
    "ubicaciones.html",
    "js/init.js",
    "js/init2.js"
]

//Del contenido del app shell, que cosas jamas deberia cambiar
const APP_SHELL_INMUTABLE =[
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-alpha3/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-alpha3/dist/js/bootstrap.bundle.min.js",
    "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
    "https://cdn.jsdelivr.net/npm/sweetalert2@10"
]


const CACHE_ESTATICO = "estativo-v1";
const CACHE_INMUTABLE = "inmutable-v1";
//esto se ejecuta una vez cuando el service worker es isntalado
self.addEventListener('install',e=>{
    console.log("el servisceworker instalado");
    //toma el cache estatico
    const cacheEstatico = caches.open(CACHE_ESTATICO).then(cache=>cache.addAll(APP_SHELL));
    //toma el cache dinamico
    const cacheInmutable = caches.open(CACHE_INMUTABLE).then(cache=>cache.addAll(APP_SHELL_INMUTABLE));

    //esperar hasta que los caches se finalizen
    e.waitUntil(Promise.all([cacheEstatico, cacheInmutable]));
})


//se ejecuta una vez cuando se activa
self.addEventListener('activate',e=>{
    console.log("esta activado");
})

//se ejecuta por cada peticion que haga el navegador
/*
self.addEventListener('fetch',e=>{
    
    if(e.request.url.includes('index.html')){ //si la url incluye algo
        //retornar otra peticion
        let respuesta = new Response("<h1>hola, te hackeamos </h1>",
        {headers:{'Content-Type':'text/html'}});

        //responda el html hacker
        e.respondWith(respuesta);
    }else{
        //responder el original
        e.respondWith(e.request);
    }
})
*/

self.addEventListener('fetch',e=>{
    //preguntarme si la peticion que estoy reciviendo se encuentra dentro de algun cache
    //si esta en el cache la voy a servir desde ahi,sino voy a buscarla a la red
    //Cache network Fallback

    const respuesta = caches.match(e.request).then(res=>{
        //me voy a preguntar si la respuesta esta en el cache
        //voy a hacer esta estrategia exeptuando con la api
        if(res && e.request.url.includes("/api")){
            return res;
        }else{
            //con la api voy a usar la estrategia Network wht Cache Fallback
            //voy a internet, si la internet f, voy al cache
            //hacer peticion a internet
            const petInternet = fetch(e.request).then(newRes=>{
                //si la respuesta es correcta
                if(newRes.ok || newRes.type =='opaque'){
                    //la guardo en el cache dinamico
                    return caches.open("dinamico-v1").then(cache=>{
                        //con esto se guarda en el cache, se debe clonar porque una promesa puede ser resuelta solo una vez
                        cache.put(e.request, newRes.clone());
                        return newRes.clone();
                    });
                }else{
                    //si no funciona el cache, si no funciono la internet, F
                    //retorno la respuesta de error normalmente
                    console.log(newRes);
                    return newRes;
                }
            }).catch(error=>caches.match(e.request));
            return petInternet;
        }
    })
    e.respondWith(respuesta);
});