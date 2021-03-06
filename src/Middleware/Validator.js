const { check } = require("express-validator");

/// ------------------- Client Validators ----------------------------- //

module.exports.postClientValidator = [
  check("name")
    .exists()
    .notEmpty()
    .withMessage("Not found/incorrect 'name' in body request"),
  check("type_text_id")
    .exists()
    .withMessage("Not found 'CPF/CNPJ'")
    .isLength({ min: 11, max: 18 })
    .withMessage("Incorrect 'CPF/CNPJ'"),
  check("inauguration_date")
    .exists()
    .withMessage("inauguration_date not found in body request")
    .custom(isValidDate)
    .withMessage("the date must be valid"),
];

module.exports.putClientValidator = [
  check("filter").exists().withMessage("Filter' Not Found"),
  check("data").exists().withMessage("Filter Not Found"),
  check("filter.id").optional(),
  check("filter.type_text_id")
    .optional()
    .isLength({ min: 11, max: 18 })
    .withMessage("Incorrect 'CPF/CNPJ'"),
  check("data.name").optional(),
  check("type_text_id")
    .optional()
    .isLength({ min: 11, max: 18 })
    .withMessage("Incorrect 'CPF/CNPJ'"),
  check("data.inauguration_date")
    .optional()
    .custom(isValidDate)
    .withMessage("the date must be valid"),
  check("data.deleted").optional(),
];

/// ------------------- Client Validators ----------------------------- //

/// ------------------- Contract Validators ----------------------------- //

module.exports.postContractValidator = [
  check("user_id")
    .exists()
    .notEmpty()
    .withMessage("Not found/incorrect 'user_id'"),
  check("client_id")
    .exists()
    .notEmpty()
    .withMessage("Not found/incorrect 'client_id'"),
  check("beginning_date")
    .exists()
    .withMessage("'beginning_date' not found in body request")
    .custom(isValidDate)
    .withMessage("Not found/incorrect 'beginning_date'"),
  check("final_date")
    .exists()
    .withMessage("'final_date' not found in body request")
    .custom(isValidDate)
    .withMessage("Not found/incorrect 'final_date'"),
  check("total_amount_contract")
    .exists()
    .notEmpty()
    .isDecimal()
    .withMessage("Not found/incorrect 'total_amount_contract'")
    .custom(isValidTotalAmount)
    .withMessage(
      "The total contract value does not meet the necessary requirements"
    ),
];

module.exports.putContractValidator = [
  check("filter.id")
    .isInt()
    .withMessage('Invalid Value, filter.id has be type integer'),
  check("data.user_id")
    .optional()
    .isInt()
    .withMessage("data.user_id be incorrect"),
  check("data.client_id")
    .optional()
    .isInt()
    .withMessage("data.client_id be incorrect"),
  check("data.type_text_id")
    .optional()
    .isLength({ min: 11, max: 18 })
    .withMessage("Incorrect 'CPF/CNPJ'"),
  check("data.beginning_date")
    .optional()
    .custom(isValidDate)
    .withMessage("Not found/incorrect 'beginning_date'"),
  check("data.final_date")
    .optional()
    .custom(isValidDate)
    .withMessage("Not found/incorrect 'beginning_date'"),
  check("data.total_amount_contract")
    .optional()
    .isDecimal()
    .withMessage("Not found/incorrect 'total_amount_contract'")
    .custom(isValidTotalAmount)
    .withMessage(
      "The total contract value does not meet the necessary requirements"
    ),
  check("data.deleted")
    .optional()
    .isInt()
    .custom(isValidDelete)
    .whitelist(
      "data.deleted be incorrect, use 1 for deleted or 0 for not deleted"
    ),
];

/// ------------------- Contract Validators ----------------------------- //

function isValidDelete(deleted) {
  return deleted == 0 || deleted == 1 ? true : false;
}

function isValidDate(date) {
  if (!date.match(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/)) return false;
  return date;
}

function isValidTotalAmount(price) {
  if (price < 1000000 || price > 153000000) {
    return false;
  }
  return price;
}
