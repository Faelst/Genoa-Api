  
const Api = require('../Api');
const { param } = require('express-validator');


module.exports = function (app) {
    app.get('/clients', Api.clients.getAllClients);
    
    app.get('/client/:id', param('id').customSanitizer(id => {
        return id
      }) , Api.clients.getClient);

    app.post('/client' , Api.clients.insertClient)

}