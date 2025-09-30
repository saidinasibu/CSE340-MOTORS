const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const inventoryModel = require("../models/inventory-model")

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
      // classification_name is required and must be string
      body("classification_name")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a classification name.") // on error this message is sent.
        .custom(async (classification_name) => {
            const classificationExists = await inventoryModel.checkClassification(classification_name)
            if (classificationExists){
              throw new Error("Classification exists.")
            }})
      ]
  }

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // classification_name is required and must be string
    body("inv_make")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide an inventory make."), // on error this message is sent.

      // lastname is required and must be string
    body("inv_model")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Please provide an inventory model."), // on error this message is sent.

    // lastname is required and must be string
    body("inv_year")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide an inventory year."), // on error this message is sent.

      // lastname is required and must be string
    body("inv_description")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Please provide an inventory description."), // on error this message is sent.

    // lastname is required and must be string
    body("inv_image")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide an inventory image."), // on error this message is sent.

          // lastname is required and must be string
    body("inv_thumbnail")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Please provide an inventory thumbnail."), // on error this message is sent.

    // lastname is required and must be string
    body("inv_price")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Please provide a inventory price."), // on error this message is sent.

    // lastname is required and must be string
    body("inv_miles")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Please provide inventory miles."), // on error this message is sent.

    // lastname is required and must be string
    body("inv_color")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Please provide inventory color."), // on error this message is sent.
    ]
}

/* ******************************
 * Check data and return errors 
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles,inv_color, classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const dropdown = await utilities.buildDropDownForm()
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      dropdown,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_name,
    })
    return
  }
  next()
}

/* **********************************
 *  New Inventory Data Validation Rules
 * ********************************* */
validate.newInventoryRules = () => {
  return [
    // classification_name is required and must be string
    body("inv_id")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Inventory ID is not valid."), // on error this message is sent.

    // classification_name is required and must be string
    body("inv_make")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide an inventory make."), // on error this message is sent.

      // lastname is required and must be string
    body("inv_model")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide an inventory model."), // on error this message is sent.

    // lastname is required and must be string
    body("inv_year")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide an inventory year."), // on error this message is sent.

      // lastname is required and must be string
    body("inv_description")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Please provide an inventory description."), // on error this message is sent.

    // lastname is required and must be string
    body("inv_image")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide an inventory image."), // on error this message is sent.

          // lastname is required and must be string
    body("inv_thumbnail")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Please provide an inventory thumbnail."), // on error this message is sent.

    // lastname is required and must be string
    body("inv_price")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Please provide a inventory price."), // on error this message is sent.

    // lastname is required and must be string
    body("inv_miles")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Please provide inventory miles."), // on error this message is sent.

    // lastname is required and must be string
    body("inv_color")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Please provide inventory color."), // on error this message is sent.
    ]
}

/* ******************************
 * Check data and return errors to the edit view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { 
    inv_id, 
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles,
    inv_color, 
    classification_name 
  } = req.body
  const title = `${inv_make} ${inv_model}`
  console.log(title)
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildDropDownForm()
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + title,
      nav,
      classificationSelect,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_name,
      inv_id
    })
    return
  }
  next()
}

  module.exports = validate