const db = require("../../DataBase/db.js");

const getAllClients = async (req, res) => {
  try {
    const [clients] = await db("clients").where({ delected: false });
    res.status(200).send(clients);
  } catch (e) {
    console.log(e);
      return res.status(400).json({
        status: 400,
        error: "Unexpected error",
      });
  }
};

const getClient = async (req, res) => {
  try {
    if (!req.params["id"])
      res.status(404).send("The server has not found ID in URI");

    const { id } = req.params;

    const [client] = await db("clients").where({
      id: id,
      delected: false,
    });

    if (client) {
      res.status(200).send(client);
    } else {
      res.send({ message: "client not found" });
    }
  } catch (e) {
    console.log(e);
      return res.status(400).json({
        status: 400,
        error: "Unexpected error",
      });
  }
};

const insertClient = async (req, res) => {
  let { type_text_id, name, inauguration_date } = req.body;

  type_text_id = type_text_id.replace(/[^\w\s]/gi, "");

  const [verifyClientExist] = await db("clients").where({
    type_text_id,
  });

  if (verifyClientExist) {
    return res.status(203).send({ message: "Customer already registered" });
  }

  let type_text_desc = "";
  type_text_id.length >= 14 ? (type_text_desc = "CNPJ") : (type_text_desc = "CPF");

    try {
      const [ newClientId ] = await db("clients").insert({
        name,
        type_text_desc,
        type_text_id,
        inauguration_date
      });

      const [newCLient] = await db('clients').where({id: newClientId});
      res.status(200).send(newCLient);

    } catch (e) {
      console.log(e);
      return res.status(400).json({
        status: 400,
        error: "Unexpected error",
      });
    }
};

module.exports = {
  getAllClients,
  getClient,
  insertClient,
};
