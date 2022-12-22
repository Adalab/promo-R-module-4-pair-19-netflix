const express = require('express');
const cors = require('cors');
const movies = require('./data/movies.json');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

server.set('view engine', 'ejs'); // configuración del motor de plantillas

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});
server.get('/movies', (req, res) => {
  const data = {
    success: true,
    movies: movies,
  };
  res.json(data);
});
//servidor dinámico
server.get('/movie/:movieId', (req, res) => {
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
