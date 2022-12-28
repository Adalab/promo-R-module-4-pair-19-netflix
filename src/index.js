//importamos los dos módulos de NPM necesarios para trabajar
const express = require('express');  
const cors = require('cors'); 
const users = require('./data/users.json');
const movies = require('./data/movies.json'); 

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
server.use(cors()); 
server.use(express.json()); 

server.set('view engine', 'ejs'); // configuración del motor de plantillas

// Arrancamos el servidor en el puerto 4000.
const serverPort = 4000;
server.listen(serverPort, () => { // la funcion recibe dos parametros. el primero el puerto en el que esta escuchando 
  console.log(`Server listening at http://localhost:${serverPort}`);  //y el segundo es una función callback que se ejecuta si el servidor se arranca correctamente.
});

server.get('/movies', (req, res) => {  //para pintar y filtrar todas las peliculas
  
  // preparamos la query
  const query = db.prepare('SELECT * FROM movies'); // le decimos que pinte las pelis que hay en esta tabla de la BD.
  // ejecutamos la query
  const movies = query.all(); // 

  //pintabamos las peliculas del fichero movies.json
  const data = {
    success: true,
    movies: movies, 
  };
  res.json(data);
});

server.post('/login', (req, res) => {  // petición post para hacer login. (lo tenemos con el fichero user.json, se saca del servidor estatico. no lo llegamos a hacer con la BD)
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
  const { email, password } = req.body; 
  const query = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)'); //añidimos y guardamos un nuevo registro a la tabla users 
  const result = query.run(email, password); //ejecutamos la query de la base de datos
  res.json({  
    success: true,
    userId: result.lastInsertRowid, 
  });
});
//servidor dinámico
server.get('/movies/:movieId', (req, res) => { // endpoint que busca entre todas las pelis la que tenga el id que yo le diga
  const foundMovie = movies.find((movie) => movie.id === req.params.movieId); //buscamos dentro del fichero movies.json
  console.log(foundMovie);
  res.render('movie', foundMovie); 
});

server.get('/user/movies', (req, res) => {  
  const userId = req.header('user-id'); // recogemos el id que nos pasan por el hearders del fetch 
  const movieIdsQuery = db.prepare( 
    'SELECT movieId FROM rel_movies_users WHERE userId = ?'
  );
  const movieIds = movieIdsQuery.all(userId); //  ejecutamos la query
  console.log (movieIds);

  db.prepare('SELECT * FROM movies WHERE id IN (?, ?)');
  const moviesIdsQuestions = movieIds.map((id) => '?').join(', '); 
  // preparamos la segunda query para obtener todos los datos de las películas
  const moviesQuery = db.prepare(
    `SELECT * FROM movies WHERE id IN (${moviesIdsQuestions})`
  );

  // convertimos el array de objetos de id anterior a un array de números
  const moviesIdsNumbers = movieIds.map((movie) => movie.movieId); 
  // ejecutamos segunda la query
  const movies = moviesQuery.all(moviesIdsNumbers);

  res.json({
    "success": true,
    "movies": movies
  });
});


const staticServerPathWeb = './src/public-react'; // Aquí hemos creado la carpeta public-react (estático)

server.use(express.static(staticServerPathWeb));

const staticImages = './src/public-movies-images'; 
server.use(express.static(staticImages)); 

const staticCss = './src/public-movies-css'; 
server.use(express.static(staticCss));
