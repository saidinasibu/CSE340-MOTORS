const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build product page
 * ************************** */
invCont.buildById = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  const data = await invModel.getProductById(inv_id);
  const grid = await utilities.buildProductPage(data);
  let nav = await utilities.getNav();
  const year = data[0].inv_year;
  const make = data[0].inv_make;
  const model = data[0].inv_model;

  res.render("./inventory/classification", {
    title: year + " " + make + " " + model,
    nav,
    grid,
  });
};

/* ***************************
 *  Build Vehicle Management View
 *  Assignment 4, Task 1
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildDropDownForm()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect,
  })
}

/* ***************************
 *  Build add classification page
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()

  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Adding Classifications
* *************************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body

  const classificationResult = await invModel.insertClassification(classification_name)

  if (classificationResult) {
    const classificationSelect = await utilities.buildDropDownForm()
    let nav = await utilities.getNav()
    req.flash(
      "notice",
      `Classification ${classification_name} added.`
    )
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
      classificationSelect,
      errors: null,
    })
  } else {
    let nav = await utilities.getNav()
    req.flash("notice", "Sorry, something failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      classification_name
    })
  }
}

/* ***************************
 *  Build add inventory page
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let   classificationSelect = await utilities.buildDropDownForm()
  res.render("./inventory/add-inventory", {
    title: "Add To Inventory",
    nav,
    errors: null,
    
    classificationSelect
  })
}

/* ****************************************
*  Adding To Inventory
* *************************************** */
invCont.addToInventory = async function (req, res, next) {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  console.log(JSON.stringify(req.body))
  const invResult = await invModel.insertToInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
  const classificationSelect = await utilities.buildDropDownForm()
  if (invResult) {
    req.flash(
      "notice",
      `Vehicle added.`
    )
    let nav = await utilities.getNav()
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
      classificationSelect,
      errors: null,
    })
  } else {
    let nav = await utilities.getNav()
    let dropDown = await utilities.buildDropDownForm(classification_id)
    req.flash("notice", "Sorry, something failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add To Inventory",
      nav,
      dropDown
    })
  }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditIventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getProductById(inv_id)
  const classificationSelect = await utilities.buildDropDownForm(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

/* ***************************
 *  Update Inventory view
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildDropDownForm(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
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
    classification_id
    })
  }
}

/* ***************************
 *  Build confirm delete inventory view
 * ************************** */
invCont.buildDeleteInv = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getProductById(inv_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
  })
}


/* ***************************
 *  Process delete inventory
 * ************************** */
invCont.processDeleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  // Collect the inv_id value from the request.body 
  const inv_id = parseInt(req.body.inv_id)
  
  //Pass the inv_id value to a model-based function to delete the inventory item.
  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    req.flash("notice", "The item was successfully deleted.")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the deletion failed.")
    res.redirect(`/inv/delete/" + ${inv_id}`)
  }
}

module.exports = invCont