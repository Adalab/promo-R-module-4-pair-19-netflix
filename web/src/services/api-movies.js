// login

const getMoviesFromApi = () => {
  console.log('Se están pidiendo las películas de la app');
  //cambiamos la url del fetch para que realice la petición al servidor que hemos creado.
  return fetch('//localhost:4000/movies')
    .then((response) => response.json())  // estamos pidiendo datos al servidor(GET), y éste nos devuelve los datos dentro de data.
    .then((data) => {
      return data;
    });
};

const objToExport = {
  getMoviesFromApi: getMoviesFromApi,
};

export default objToExport;
