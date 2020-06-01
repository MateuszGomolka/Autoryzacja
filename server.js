const http = require('http');
const app = require('./app');

// numer portu
const port = process.env.port || 3000;
// stworzenie servera
const server = http.createServer(app);
// uruchomienie servera na porcie
server.listen(port);