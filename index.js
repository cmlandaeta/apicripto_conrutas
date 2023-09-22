const express = require('express');
const app = require('./app'); // crear un protocolo de transferencia
const http = require('http');
const server = http.createServer(app); // se envia por http app que contiene la conexiona mongo
const path = require('path')
server.listen(3000,() => {
   console.log("Servidor corriendo en el puerto 3000");
})

app.use(express.json())

/// definir rutas para el fronend

app.use('/apicripto', express.static(path.resolve('views','home')))

