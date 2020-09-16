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
    const [contract] = await db('contracts')
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


// ------------------------------------- alterContract -----------------------//
const alterContract = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  }

  try {
    let { filter, data } = req.body;

    filter.id
      ? (filter = { "contracts.id": filter.id })
      : (filter = { "clients.type_text_id": filter.type_text_id.replace(/[^\w\s]/gi, "") });

    const [contract] = await db('contracts')
      .where(filter)

    if (!contract)
      return res.status(202).send({
        status: false,
        message: 'Not found any contract'
      })

    if (data.user_id) {
      const [user_id] = await db('users')
        .where({
          deleted: 0,
          id: data.user_id
        });

      if (!user_id)
        return res.status(202).send({
          status: false,
          message: "User Not Found",
        });
    }

    if (data.client_id || data.type_text_id) {
      let filterContract = {};

      data.client_id ? filterContract = { id: data.client_id } : filterContract = { type_text_id: data.type_text_id.replace(/[^\w\s]/gi, "") }

      const [client] = await db('clients')
        .select('id')
        .where(
          filterContract
        ).where({ deleted: 0 });

      if (!client)
        return res.status(202).send({
          status: false,
          message: "Client Not Found",
        });
      if (moment(client.inauguration_date).add(2, "Y").isSameOrAfter(moment()))
        return res.status(202).send({
          status: false,
          message: "inauguration_date is minor than 2 year, invalid contract term",
        });

      data.type_text_id && delete data.type_text_id
      data.client_id = client.id
    }

    if (data.beginning_date) {
      data.beginning_date = moment(data.beginning_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
      if (
        moment(data.beginning_date).isAfter(contract.final_date) ||
        moment(data.beginning_date).add(1, "Y").isSameOrAfter(contract.final_date)
      )
        return res.status(202).send({
          status: false,
          message: "the dates of contract not correct, invalid contract term",
        });
    }

    if (data.final_date) {
      data.final_date = moment(data.final_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
      if (
        moment(contract.beginning_date).isAfter(data.final_date) ||
        moment(contract.beginning_date).add(1, "Y").isSameOrAfter(data.final_date)
      )
        return res.status(202).send({
          status: false,
          message: "the dates of contract not correct, invalid contract term",
        });
    }

    if (data.deleted && data.deleted == 1) {
      data = {
        ...data,
        deleted: 1,
        deleted_at: moment().format()
      }
    } else {
      data = {
        ...data,
        deleted: 0,
        deleted_at: null
      }
    }

    data.id && delete data.id

    await db('contracts').update(data).where({
      id: contract.id
    })

    return res.status(200).send({
      status: true,
      data: {
        ...contract,
        ...data
      }
    });

  } catch (e) {
    console.log(e);
    return res.status(400).json({
      status: 400,
      error: "Unexpected error",
      message: e.sqlMessage,
    });
  }
}
// ------------------------------------- alterContract -----------------------//

module.exports = {
  getContracts,
  getContract,
  insertContract,
  deleteContract,
  alterContract
};
