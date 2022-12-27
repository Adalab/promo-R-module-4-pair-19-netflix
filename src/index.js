const express = require('express');
const cors = require('cors');
const users = require('./data/users.json');
const movies = require('./data/movies.json'); // descomento porque el movieID no lo tenemos hecho con base de datos, y no funciona el get movieID

// importar la librería de la base de datos
const Database = require('better-sqlite3');

// importamos la base de datos
const db = new Database('./src/db/database.db', {
  // con verbose le decimos que muestre en la consola todas las queries que se ejecuten
  verbose: console.log,
  // así podemos comprobar qué queries estamos haciendo en todo momento
});

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

server.set('view engine', 'ejs'); // configuración del motor de plantillas

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  // console.log(`Server listening at http://localhost:${serverPort}`);
});

server.get('/movies', (req, res) => {
  const filterGender = req.query.gender;
  // preparamos la query
  const query = db.prepare('SELECT * FROM movies');
  // ejecutamos la query
  const movies = query.all();

  //pintabamos las peliculas del fichero movies.json
  const data = {
    success: true,
    movies: movies,
  };
  res.json(data);
});

server.post('/login', (req, res) => {
  const userFound = users.find(
    (user) =>
      user.email === req.body.email && user.password === req.body.password
  );
  if (userFound) {
    res.json({
      success: true,
      userId: userFound.id,
    });
  } else {
    res.json({
      success: false,
      errorMessage: 'Usuaria/o no encontrada/o',
    });
  }
});
server.post('/sign-up', (req, res) => {
  const { email, password } = req.body; // haciendo destructuring de los parámetros que nos devuelve la peticion fetch del sing-up , estamos recogiendo éstos para ahora poder usarlos en la query
  const query = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)'); //añidimos y guardamos un nuevo registro a la tabla users con Insert Into en la base de datos
  const result = query.run(email, password); //ejecutamos la query de la base de datos
  res.json({
    success: true,
    userId: result.lastInsertRowid, // nos quedamos con el id del último registro que hemos añadido a la BD
  });
});
//servidor dinámico
server.get('/movies/:movieId', (req, res) => {
  const foundMovie = movies.find((movie) => movie.id === req.params.movieId);
  console.log(foundMovie);
  res.render('movie', foundMovie); //renderizamos la plantilla del html que hemos creado en la carpeta views dónde movies es el nombre del archivo y foundMovie es un objeto con los datos de la película
});

const staticServerPathWeb = './src/public-react'; // Aquí hemos creado la carpeta public-react (estático)
//esto funciona como el gitHub pages, contiene la última versión hasta que tu actualices con un npm run publish-react
server.use(express.static(staticServerPathWeb));

const staticImages = './src/public-movies-images';
server.use(express.static(staticImages));

const staticCss = './src/public-movies-css';
server.use(express.static(staticCss));
