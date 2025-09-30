/* *************************************
*   Account Routes
************************************* */
// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')



// Route to build Login View
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process Management view
router.get(
    "/", 
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildManagement))

router.get("/update-account/:accountId", 
    utilities.checkLogin, 
    utilities.handleErrors(accountController.buildAccountUpdate))

router.get("/logout",
    utilities.handleErrors(accountController.buildLogoutView)
)



// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login data
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.logToAccount)
)

/* ***********************
 * Route to update account data
 *************************/
router.post(
    "/update/",
    regValidate.accountUpdateRules(),
    regValidate.checkAccountUpdateData,
    utilities.handleErrors(accountController.processAccountUpdate)
)

/* ***********************
 * Route to update account password
 *************************/
router.post(
    "/update-password/",
    regValidate.passwordUpdateRules(),
    regValidate.checkPasswordUpdateData,
    utilities.handleErrors(accountController.processPasswordUpdate)
)

module.exports = router;