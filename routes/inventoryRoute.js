// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

const utilities = require("../utilities")
const validate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inv_id", utilities.handleErrors (invController.buildById));

router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification)); // add classification
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory)); // add inventory
router.get("/", 
    utilities.checkAccountType, 
    utilities.handleErrors(invController.buildManagement));

// Route to process adding a classification to database
router.post('/add-classification', 
    validate.classificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.addClassification));

// Route to process adding inventory to database
router.post('/add-inventory',
    validate.inventoryRules(),
    validate.checkInventoryData,
    utilities.handleErrors(invController.addToInventory));


// Route to build inventory by classification view for management view
router.get("/getInventory/:classification_id", 
    utilities.handleErrors(invController.getInventoryJSON));

// Route to build inventory by classification view for management view
router.get("/edit/:inventory_id", 
    utilities.checkAccountType, 
    utilities.handleErrors(invController.buildEditIventory));

// Route to delete inventory
router.get("/delete/:inventory_id", 
    utilities.checkAccountType, 
    utilities.handleErrors(invController.buildDeleteInv));

// Route to process delete inventory
router.post("/delete/", 
    utilities.handleErrors(invController.processDeleteInventory));

// Route to process Update inventory
router.post("/update/", 
    validate.newInventoryRules(),
    validate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory));

module.exports = router;

