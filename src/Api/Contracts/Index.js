const db = require("../../DataBase/db.js");
const { validationResult } = require("express-validator");
const moment = require("moment");

const getContracts = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  }

  try {
    const contract = await db('contracts')
      .where({
        deleted: 0
      })

    if (!contract.length)
      return res.status(202).send({
        status: false,
        message: 'Not found any contract'
      })

    res.status(200).send({
      status: true,
      data: contract
    })
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      status: 400,
      error: "Unexpected error",
      message: e.sqlMessage,
    });
  }
}

const getContract = async (req, res) => {

  const { id } = req.params

  try {
    const [contract] = await db('contracts')
      .select(
        "contracts.id",
        "users.name",
        "clients.name",
        "clients.type_text_id",
        "clients.type_text_desc",
        "contracts.beginning_date",
        "contracts.final_date",
        "contracts.total_amount_contract",
        "clients.inauguration_date"
      )
      .innerJoin("users", "users.id", "contracts.user_id")
      .innerJoin("clients", "clients.id", "contracts.client_id")
      .where({
        "contracts.id": id,
        "contracts.deleted": 0,
      });

    if (!contract)
      return res.status(202).send({
        status: false,
        message: 'Not found any contract'
      })

    res.status(202).send({
      status: true,
      data: contract
    })
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      status: 400,
      error: "Unexpected error",
      message: e.sqlMessage,
    });
  }

}

const insertContract = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  }

  let {
    user_id,
    client_id,
    beginning_date,
    final_date,
    total_amount_contract,
  } = req.body;

  beginning_date = moment(beginning_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
  final_date = moment(final_date, 'DD/MM/YYYY').format('YYYY-MM-DD')

  if (
    moment(beginning_date).isAfter(final_date) ||
    moment(beginning_date).add(1, "Y").isSameOrAfter(final_date)
  )
    return res.status(202).send({
      status: false,
      message: "the dates of contract not correct, invalid contract term",
    });

  try {
    const [client] = await db("clients").where({
      id: client_id,
      deleted: 0,
    });

    const { inauguration_date } = client;

    if (moment(inauguration_date).add(2, "Y").isSameOrAfter(moment()))
      return res.status(202).send({
        status: false,
        message: "inauguration_date is minor than 2 year, invalid contract term",
      });

    if (!client)
      return res.status(202).send({
        status: false,
        message: "Client Not Found",
      });

    const [user] = await db("users").where({
      id: user_id,
      deleted: 0,
    });

    if (!user)
      return res.status(202).send({
        status: false,
        message: "User Not Found",
      });

    console.log(beginning_date)
    const [id] = await db("contracts").insert({
      user_id,
      client_id,
      beginning_date,
      final_date,
      total_amount_contract,
    });

    const contract = await db("contracts")
      .select(
        "contracts.id",
        "users.name",
        "clients.name",
        "clients.type_text_id",
        "clients.type_text_desc",
        "contracts.beginning_date",
        "contracts.final_date",
        "contracts.total_amount_contract",
        "clients.inauguration_date"
      )
      .innerJoin("users", "users.id", "contracts.user_id")
      .innerJoin("clients", "clients.id", "contracts.client_id")
      .where({
        "contracts.id": id,
        "contracts.deleted": 0,
      });

    res.status(200).send(contract);
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      status: 400,
      error: "Unexpected error",
      message: e.sqlMessage,
    });
  }
};

const deleteContract = async (req, res) => {

  const { id } = req.params

  try {
    const [contract] = await db('contract')
      .where({
        id
      })

    if (!contract)
      res.status(202).send({
        status: false,
        message: 'Not found any contract'
      })

    await db('contracts')
      .where({ id })
      .update({
        deleted: 1,
        deleted_at: moment().format()
      })

    contract.deleted = 1;
    contract.deleted_at = moment().format();

    res.status(200).send({
      status: true,
      data: contract
    })

  } catch (e) {
    console.log(e);
    return res.status(400).json({
      status: 400,
      error: "Unexpected error",
      message: e.sqlMessage,
    });
  }
}

const alterContract = async (req, res) => {

  let { filter, data } = req.body

  try {

  } catch (e) {
    console.log(e);
    return res.status(400).json({
      status: 400,
      error: "Unexpected error",
      message: e.sqlMessage,
    });
  }
}

module.exports = {
  getContracts,
  getContract,
  insertContract,
  deleteContract,
  alterContract
};
