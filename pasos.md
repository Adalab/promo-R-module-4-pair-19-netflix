4.2--Node 24.2 Express JS I:

1. Pide todas las películas: 

modificamos el fichero "services/api-movies.js".En este fichero lo que hacemos es modificar la url del fetch(que es el endpoint del back) para que realice la petición a la url del servidor que estamos creando. cambiamos la ruta a localhost:4000/movies. 
Esta petición es get porque sólo estamos pidiendo que nos pinte las peliculas, no nos devuelve nada. 
En el then nos devuelve los datos dentro de data.
Esto se hace en el front, ahora hay que cambiar el back realizando el endpoint. 

                server.get('/movies', (req, res) => {
                res.json(data);
                });
Creamos endpoint get,para que pinte todas las películas. primero la información iba a pincho en el endpoint, luego metemos esa info en un archivo data, creando así un json de dónde recoge los datos este endpoint. 
Ese fichero creado lo importamos en index.json para que pueda ser usado en nuestro servidor. 


4.3 Express JS II:

1. Servidor de estáticos para React: 

CReamos dentro de Node JS un servidor de estáticos, para que el proyecto de Back sea el que muestre a su vez el proyecto de React. 
    
    1-añadimos lo scripts al package.json (los del publish-react)
    2- Abrimos terminal en raiz del proyecto y ejecutamos "npm run publish-react." Con esto actualizamos nuestro localhost 4000 con los cambios modificados en el proyecto de react. copia el proyecto de React en la crpeta public-react.

Luego programamos un servidor de estáticos en Node JS: AL final del index, están las dos líneas de código que han de ponerse para crear un servidor de estáticos. EN este caso primero tenemos el de public-react. Abajo tenemos el estátco de las imágenes y el de los estilos. 

Una vez puestas esas líneas de código, ejecutando npm run dev debemos ver el proyecto de react en localhost:4000.
CON CADA CAMBIO EN EL PROYECTO DE REACT DEBEMOS HACER UN npm run publish-react PARA QUE SE ACTUALICE EN 4000.

2. Servidor de estáticos para las fotos

Creamos la carpeta src/public-movies-images/ y dentro añadimos las imágenes que serán las carátulas de las películas. 
Al final del fichero index, añadimos de nuevo las dos líneas de código, que cargan estos ficheros estáticos de las imágenes. 

Al entrar entrar en http://localhost:4000/gambita-de-dama.jpg y http://localhost:4000/friends.jpg debemos poder ver correctamente estas dos imágenes.

Luego modificamos los datos de las películas para que muestren las imágenes. en fichero data/movies.json.
aquí modificamos la ruta de las imágenes. 

EN ambos proyectos (REACT Y BACK) debemos poder ver las películas con sus imágenes. 

3. Peticiones POST con body params: 

Aquí creamos el endpoint que nos permite hacer login en la web:

Primero modificamos el fetch:

    función sendLoginToApi que está en web/src/services/api-user.js.
    cabiamos ruta del fetch a http://localhost:4000/login.
    hacemos que el fetch sea POST: 
            1.recogemos parámetros en variable bodyParams.
            2.convertimos en string el json del post.
            3.recogemos la respuesta en data. 
            4.EN INDEX, CON EL CODIGO DE LA LINEA 20 server.use(express.json()) TRANSFROMAMOS LOS PARÁMETROS EN JSON.NO HAY QU HACER NADA MAS. 
    
    Esto nos devuelve un 404 porque no tenemos hecho el endpoint aún.

creamos el fichero data/users.json e importamos en index.js. 
Creamos el endpoint del post.       server.post('/login', (req, res) => { }
Dentro de este endpoint buscamos con un find, en el fichero de users.json, la usuaria que tenga el mismo email y contraseña que estás recibiendo por body params:
        si la encuentra retorna un success true y el id
        si no la encuentra retorna un success false y un ususario no encontrado.


 4.4 Express JS III:

 1- consigue el id de la película que se va a renderizar: 


 Primero creamos el endpoint para escuchar las peticiones: 
     1-server.get('/movie/:movieId', (req, res) => { ... });.
     2-entramos en http://localhost:4000/movie/1.
     3-Si todo ha ido bien en la terminal debería mostrar un 1 


ESTE ENDPOINT DEBEMOS PONERLO ANTES DEL CODIGO DE SERVIDOR ESTATICO PARA QUE NO SEAN LO ESTÁTICOS LOS QUE GESTIONEN LA PETICIÓN. 

2-Obtenemos las películas.

buscamos los datos de la película que se va a pintar.
Con un FIND, buscamos en nuestro fichero movies.json , aquella película que tenga el mismo id que el que nos pasan los req.paramns.(url paramns).
el resultado lo guardamos en una constate const foundMovie =.


3- renderizar la película: 

1-En la raíz del proyecto instalamos el motor de plantillas usando ---- npm install ejs.-----
2-en index.js configuramos el motor de plantillas añadiendo la línea server.set('view engine', 'ejs');
3-creamos fichero ./views/movie.ejs  DEBE SER HNA DE SRC EN LA RAIZ DEL RPOYECTO.
4-añadimos al endpoint    server.get('/movie/:movieId'     el código res.render('movie' y foundMOvie), donde movie es el nombre del fichero de la plantilla que hemos creado en el paso anterior, y foundMovie es el objeto de la película que encuentra que tiene el msmo ID. 

4-Renderiza la película: 

en el archivo de movie.ejs introducimos el html que queremos que nos pinte. En este html metemos el código <%= name %>, <%= gender %>  para que se pinten los daTOS. y lo situamos dónde queremos que se pinten éstos datos.

en http://localhost:4000/movie/1; deberíamos ver los datos de la película Gambita de dama.

5- Añade estilos: 

1-creamos servidor de estáticos del css
2- añadimos a ./views/movie.ejs un <link rel="stylesheet" href="aqui-la-ruta-correcta-de-los-estilos.css">.

 4.5 Bases de datos I:

 1. Crea la base de datos:

        1. Creamos la base de datos movies con (id, name, gender, image).
        2- añadimos los datos de las películas que tenemos en movies.json a esta tabla.

2. Configura la base de datos en Node JS:

    1-instalamos better-sqlite3 con       npm install better-sqlite3.
    2-En src/index.js añadimoa const db = new Database('./src/db/database.db', { ... }); para decirle a Node que vamos a usar esa base de datos.

3. Haz un SELECT para obtener todas películas:

    Dentro del endpoint GET:/movies, estamos cogiendo las películas del fichero, movies.json. modificamos esto para que las pille de la bd y la tabla movies. 
        const query = db.prepare('SELECT * FROM movies'); 
        const movies = query.all();

4. Mejora tu SELECT:



4.6 Bases de datos II:

1. Registro de nuevas usuarias en el front: 

    la función sendSingUpToApi de web/src/services/api-user.js ya está recibiendo por parámetros el email y la contraseña que la usuaria haya introducido en el formulario.

    modificamos el fetch para que url sea http://localhost:4000/sign-up.. envía por POST los datos al endpoint /sign-up!!!!!

2. Registro de nuevas usuarias en el back:

    1-Añadimos el endpoint POST:/sign-up.
    2-con    const { email, password } = req.body; recogemos los datos que recibimos por bodyparams.
    3- Creamos  una query para insertar en la tabla users un nuevo registro con el email y la contraseña de la usuaria.     const query = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)')
    * hemos realizado la tabla users en la BD 
    4- La query nos devolverá el id del nuevo registro.
    5-responde con un success true y el id.
    
4.6 Bases de datos III:







