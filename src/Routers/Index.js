const express = require("express");
const router = express.Router();

const { clients, contracts } = require("../Api");

const {
  postClientValidator,
  putClientValidator,
  postContractValidator,
} = require("../Middleware/Validator");

//------------------ Client Routers ----------------------- //
router.get("/clients", clients.getAllClients);

router.get("/client/:id", clients.getClient);

router.post("/client", postClientValidator, clients.insertClient);

router.put("/client", putClientValidator, clients.alterClient);

router.delete("/client/:id", clients.deleteClient);
//------------------ Client Routers ----------------------- //


//------------------ Contract Routers ----------------------- //

router.get("/Contracts", contracts.getContracts);

router.get("/Contract/:id", contracts.getContract);

router.post("/Contract", postContractValidator, contracts.insertContract);

router.delete("/Contract/:id", contracts.deleteContract);

router.put("/Contract/", contracts.alterContract);

module.exports = router;
