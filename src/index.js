//importamos los dos módulos de NPM necesarios para trabajar
const express = require('express');  // esta librería sirve para montar el servidor.
const cors = require('cors'); // esta librería sirve para hacer llamadas entre dominios diferentes.
const users = require('./data/users.json');// este es el fichero json que contiene los datos del API usuarios
const movies = require('./data/movies.json'); // este es el fichero json que contiene los datos del API películas

// importar la librería de la base de datos
const Database = require('better-sqlite3');

// importamos la base de datos para decirle a node que ésta es la que vamos a usar.
const db = new Database('./src/db/database.db', {
  // con verbose le decimos que muestre en la consola todas las queries que se ejecuten
  verbose: console.log,
  // así podemos comprobar qué queries estamos haciendo en todo momento
});

// CReamos el servidor.  Sólo está configurado y guardado en la variable server para poder usarlo luego y exponer la API.
const server = express();
server.use(cors()); // config.del servidor. cuando el front está en un dominio distinto al del servidor.
server.use(express.json()); // configuraciones. permite convertir a json los parámetros que yo le pase(body etc).

server.set('view engine', 'ejs'); // configuración del motor de plantillas

// Arrancamos el servidor en el puerto 4000.
const serverPort = 4000;
server.listen(serverPort, () => { // la funcion recibe dos parametros. el primero el puerto en el que esta escuchando 
  console.log(`Server listening at http://localhost:${serverPort}`);  //y el segundo es una función callback que se ejecuta si el servidor se arranca correctamente.
});

server.get('/movies', (req, res) => {  //para pintar y filtrar todas las peliculas
  // const filterGender = req.query.gender;
  // preparamos la query
  const query = db.prepare('SELECT * FROM movies'); // le decimos que pinte las pelis que hay en esta tabla de la BD.
  // ejecutamos la query
  const movies = query.all(); // le pedimos que nos de TODAS las peliculas de la tabla movies. el query.all devuelve un [] que contiene los objetos que coinciden con la búsqueda.

  //pintabamos las peliculas del fichero movies.json
  const data = {
    success: true,
    movies: movies, // movies es el [] que te devuleve la BD
  };
  res.json(data);
});

server.post('/login', (req, res) => {  // petición post para hacer login.
  const userFound = users.find(  //buscamos la usuaria que hay dentro del archivo users.json aquella que tenga
    (user) =>  // el mismo email y password que la que recibimos por queryparams. 
      user.email === req.body.email && user.password === req.body.password
  );
  if (userFound) {  // si encuentra la usuaria devuelve un true y el id de la usuaria.
    res.json({
      success: true,
      userId: userFound.id,
    });
  } else {
    res.json({  //si no encuentra el usuario, devuelve un false y usuario no encontrado.
      success: false,
      errorMessage: 'Usuaria/o no encontrada/o',
    });
  }
});
server.post('/sign-up', (req, res) => {
  const { email, password } = req.body; // haciendo destructuring de los parámetros que nos devuelve la peticion fetch del sing-up , estamos recogiendo éstos para ahora poder usarlos en la query
  const query = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)'); //añidimos y guardamos un nuevo registro a la tabla users con Insert Into en la base de datos
  const result = query.run(email, password); //ejecutamos la query de la base de datos
  res.json({  // responde devolviendo estos datos: 
    success: true,
    userId: result.lastInsertRowid, // nos quedamos con el id del último registro que hemos añadido a la BD
  });
});
//servidor dinámico
server.get('/movies/:movieId', (req, res) => { // endpoint que busca entre todas las pelis la que tenga el id que yo le diga
  const foundMovie = movies.find((movie) => movie.id === req.params.movieId); //buscamos dentro del fichero movies.json
  console.log(foundMovie);// constante donde guardamos la busqueda de la pelicula .
  res.render('movie', foundMovie); //renderizamos la plantilla del html que hemos creado en la carpeta views dónde movie es el nombre del archivo de la carpeta views y foundMovie es un objeto con los datos de la película
});

const staticServerPathWeb = './src/public-react'; // Aquí hemos creado la carpeta public-react (estático)
//esto funciona como el gitHub pages, contiene la última versión hasta que tu actualices con un npm run publish-react
server.use(express.static(staticServerPathWeb));

const staticImages = './src/public-movies-images'; //Creamos servidor de estáticos de las imágenes. 
server.use(express.static(staticImages)); // cuidado con la ruta de esta carpeta para que se visualice bien.

const staticCss = './src/public-movies-css'; //servidor de estáticos del css
server.use(express.static(staticCss));
