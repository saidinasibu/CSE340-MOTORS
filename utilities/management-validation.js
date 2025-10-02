const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/**
 * Classification name validation rule
 */
validate.addClassRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage("Classification name must not contain spaces or special characters."),
    ]
}

validate.checkClassData = async (req, res, next) => {
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


/**
 * Insert data rules
 */
validate.insertDataRules = () => {
    return [
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage("The Inventory Make must not be empty and not contain special characters."),

            body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage("The Inventory Model must not be empty and not contain special characters"),

            body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^\d{4}$/)
            .withMessage("The Inventory Year must not be empty and must be 4 digits "),

            body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("The Inventory Description must not be empty and must be alphanumeric"),

            body("inv_image")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("The Inventory Image must not be empty and must be 4 digits "),

            body("inv_thumbnail")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("The Inventory Thumbnail must not be empty and must be 4 digits "),

            body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^\d+$/)
            .withMessage("The Inventory Price must not be empty and must be numerical"),

            body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^\d+$/)
            .withMessage("The Inventory Miles must not be empty and must digits."),

            body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^[a-zA-Z]+$/)
            .withMessage("The Inventory Color must not be alphabet"),


            body("classification_id")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^\d+$/)
            .withMessage("The Classification ID must not be empty and must be digits."),
    ]
}


validate.checkInsertData = async (req, res, next) => {
    
    const {inv_make, inv_model, inv_year, inv_description, inv_image, 
    inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

    let errors = []

    errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const addInvForm = await utilities.buildAddInvForm()

        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            addInvForm,
            inv_make, 
            inv_model,
            inv_year, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_miles, 
            inv_color, 
            classification_id,
        })

        return
    }
    next()


}


validate.checkUpdateData = async (req, res, next) => {
    
    const {inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, 
    inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

    let errors = []

    errors = validationResult(req)

    if (!errors.isEmpty()) {
        // let nav = await utilities.getNav()
        // const addInvForm = await utilities.buildAddInvForm()

        inv_id = parseInt(inv_id)
        const nav = await utilities.getNav()
        const itemData = await invModel.getInventoryByInventoryId(inv_id)
        const editInvForm = await utilities.buildEditInvForm(itemData[0])

        const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`

        res.render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            errors,
            editInvForm: editInvForm,
            inv_make, 
            inv_model,
            inv_year, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_miles, 
            inv_color, 
            classification_id,
        })

        return
    }
    next()


}
 

module.exports = validate