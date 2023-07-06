// importation des différents modules 
const http = require('http');
const app = require('./app');

// prend la valeur de port en entrée et vérifie si le port et supérieur ou égal à zéro
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
// définition du port  d'écoute du server
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

// Gestionnaire d'erreurs
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// création du serveur HTTP
const server = http.createServer(app);

// gestion des événements du serveur
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// démarrage du serveur 
server.listen(port);
