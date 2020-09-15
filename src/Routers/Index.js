const express = require('express');
const router = express.Router();

const Api = require('../Api');
const { param } = require('express-validator');

router.get('/clients', Api.clients.getAllClients);

router.get('/client/:id', param('id').customSanitizer(id => {
  return id
}), Api.clients.getClient);

router.post('/client', Api.clients.insertClient)
