const db = require("../../DataBase/db.js");
const { validationResult } = require("express-validator");
const moment = require("moment");

const getAllClients = async (req, res) => {
  try {
    const clients = await db("clients").where({ deleted: 0 });
    if (!clients.length) {
      return res.status(202).json({
        status: false,
        message: "Not found any client"
      });
    }

    res.status(200).json({
      status: true,
      data: clients
    });
  } catch (e) {
  console.log(e);
  return res.status(400).json({
    status: false,
    error: "Unexpected error",
    message: e.sqlMessage
  });
}
};

const getClient = async (req, res) => {
  try {
    if (!req.params["id"])
      res.status(404).send({
        message: "The server has not found ID in URI",
        status: false,
      });

    const { id } = req.params;

    const [client] = await db("clients").where({
      id: id,
      deleted: false,
    });

    if (client) {
      res.status(200).send({
        status: true,
        data: client
      });
    } else {
      res.status(202).send({
        message: "Client not found",
        status: false,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      status: false,
      error: "Unexpected error",
      message: e.sqlMessage
    });
  }
};

const insertClient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  }

  let { type_text_id, name, inauguration_date } = req.body;

  type_text_id = type_text_id.replace(/[^\w\s]/gi, "");

  let [verifyClientExist] = await db("clients").where({
    type_text_id
  });

  if (verifyClientExist && verifyClientExist.deleted !== 1) {
    return res.status(203).send({
      status: false,
      message: "Client already registered",
    });
  } else if (verifyClientExist && verifyClientExist.deleted == 1) {
    const { id } = verifyClientExist
    await db("clients").where({ id }).update({
      deleted: 0,
      deleted_at: null
    });

    verifyClientExist.deleted = 0;
    verifyClientExist.deleted_at = null;

    return res.status(200).send({
      status: true,
      data: verifyClientExist,
    });
  }

  let type_text_desc = "";
  type_text_id.length >= 14
    ? (type_text_desc = "CNPJ")
    : (type_text_desc = "CPF");

  inauguration_date = moment(inauguration_date, 'DD/MM/YYYY').format('YYYY-MM-DD');

  try {
    const [newClientId] = await db("clients").insert({
      name,
      type_text_desc,
      type_text_id,
      inauguration_date,
    });

    const [newCLient] = await db("clients").where({ id: newClientId });
    res.status(200).send({
      status: true,
      data: newCLient,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      status: false,
      error: "Unexpected error",
      message: e.sqlMessage
    });
  }
};

const alterClient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  }

  try {
    let { filter, data } = req.body;

    filter.id
      ? (filter = { id: filter.id })
      : (filter = { type_text_id: filter.type_text_id.replace(/[^\w\s]/gi, "") });

    const [client] = await db("clients").where(filter);

    if (client) {
      const { id } = client;

      if (data.id) delete data.id;
      if (data.type_text_id) data.type_text_id = data.type_text_id.replace(/[^\w\s]/gi, "")

      if (data.type_text_id) {
        data.type_text_id.length >= 14
          ? (data.type_text_desc = "CNPJ")
          : (data.type_text_desc = "CPF");
      }

      if (data.inauguration_date)
        data.inauguration_date = moment(data.inauguration_date, 'DD/MM/YYYY').format('YYYY-MM-DD')

      data.deleted && data.deleted == 1 ?
        data.deleted_at = moment().format() :
        data.deleted_at = null


      await db("clients").where({ id }).update(data);

      res.status(200).send({
        status: true,
        data: { ...client, ...data },
      });
    } else {
      res.status(202).send({
        message: "Client not found",
        status: false,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      status: false,
      error: "Unexpected error",
      message: e.sqlMessage
    });
  }
};

const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const [client] = await db("clients").where({
      id: id,
    });

    if (client) {
      await db("clients").where({ id }).update({
        deleted: 1,
        deleted_at: moment().format()
      });

      client.deleted = 1;
      client.deleted_at = moment().format();

      res.status(200).send({
        status: true,
        data: client,
      });
    } else {
      res.status(202).send({
        message: "Client not found",
        status: false,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      status: false,
      error: "Unexpected error",
      message: e.sqlMessage
    });
  }
};

module.exports = {
  getAllClients,
  getClient,
  insertClient,
  alterClient,
  deleteClient,
};
