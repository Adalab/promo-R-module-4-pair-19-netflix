// login

const sendLoginToApi = (data) => {
  console.log('Se están enviando datos al login:', data);
  const bodyParams = { // recogemos en variable los dos parámetros que recibe ya la función: email y password.
    email: data.email,
    password: data.password,
  };
  return fetch('http://localhost:4000/login`', {
    method: 'POST',
    body: JSON.stringify(bodyParams), //conviertes el objeto en string. siempre se pasa en texto plano. 
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())  // conviertes la respuesta del servidor en json
    .then((data) => {
      return data;
    });
};

// signup

const sendSingUpToApi = (data) => {
  console.log('Se están enviando datos al signup:', data);
  const bodyParams = {  //recibe por prámetros el email y la ocntraseña.
    email: data.email,
    password: data.password,
  };
  return fetch('http://localhost:4000/sign-up', {  //envía los datos al endpoint /sign-up por bodyparamns.
    method: 'POST',
    body: JSON.stringify(bodyParams),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())  //la respuesta la devuvlve en data
    .then((data) => {
      return data;
    });
};

// profile

const sendProfileToApi = (userId, data) => {
  console.log('Se están enviando datos al profile:', userId, data);
  // CAMBIA ESTE FETCH PARA QUE APUNTE A UN ENDPOINT DE TU SERVIDOR, PIENSA SI DEBE SER GET O POST, PIENSA QUÉ DATOS DEBES ENVIAR, ETC
  return fetch(
    '//beta.adalab.es/curso-intensivo-fullstack-recursos/apis/netflix-v1/empty.json'
  );
};

const getProfileFromApi = (userId) => {
  console.log('Se están pidiendo datos del profile del usuario:', userId);
  // CAMBIA ESTE FETCH PARA QUE APUNTE A UN ENDPOINT DE TU SERVIDOR, PIENSA SI DEBE SER GET O POST, PIENSA QUÉ DATOS DEBES ENVIAR, ETC
  return fetch(
    '//beta.adalab.es/curso-intensivo-fullstack-recursos/apis/netflix-v1/empty.json'
  )
    .then((response) => response.json())
    .then(() => {
      // CAMBIA EL CONTENIDO DE ESTE THEN PARA GESTIONAR LA RESPUESTA DEL SERVIDOR Y RETORNAR AL COMPONENTE APP LO QUE NECESITA
      return {
        success: true,
        name: 'Maricarmen',
        email: 'mari@mail.com',
        password: '1234567',
      };
    });
};

// user movies

const getUserMoviesFromApi = (userId) => {
  console.log(
    'Se están pidiendo datos de las películas de la usuaria:',
    userId
  );
  return fetch('http://localhost:4000/user/movies', {
    headers: {
      'user-id' : userId
    }
  })
  .then(response => response.json())
  .then(data => {
     return data;
  });
};

const objToExport = {
  sendLoginToApi: sendLoginToApi,
  sendSingUpToApi: sendSingUpToApi,
  sendProfileToApi: sendProfileToApi,
  getProfileFromApi: getProfileFromApi,
  getUserMoviesFromApi: getUserMoviesFromApi,
};

export default objToExport;
