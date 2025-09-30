const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const messageModel = require("../models/message-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver management view
*  (Assignment 6)
* *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  let unreadMessages = await messageModel.getUnreadMessageCountByAccountId(res.locals.accountData.account_id)

  res.render("./account/account_management", {
    title: "Account Management",
    nav,
    errors: null,
    unreadMessages
  })
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
*  Process Login
* *************************************** */
async function logToAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.
      ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      return res.redirect("/account/")
      }
    } catch (error) {
      return new Error('Access Forbidden')
  }
}


/* ******************************************
 * Deliver Account Update view (Assignment 5)
 *******************************************/
async function buildAccountUpdate(req,res,next) {
  const account_id = req.params.accountId
  let nav = await utilities.getNav()
  const itemData = await accountModel.getAccountById(account_id)
  res.render("./account/update-account", {
    title: "Update Account",
    nav,
    errors: null,
    account_id: itemData.account_id,
    account_firstname: itemData.account_firstname,
    account_lastname: itemData.account_lastname,
    account_email: itemData.account_email,
  })
}

/* ******************************************
 * Process Account Update (Assignment 5)
 *******************************************/
async function processAccountUpdate(req,res,next) {
  let nav = await utilities.getNav()
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  } = req.body
  console.log("processAccountUpdate")
  console.log(account_id)
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  )

  if (updateResult) {
    req.flash("notice", `Your account was successfully updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/account_management", {
    title: "Account Management",
    nav,
    errors: null,
    })
  }
}


/* ******************************************
 * Process Password Update (Assignment 5)
 *******************************************/
async function processPasswordUpdate(req,res,next) {
  console.log("controller - processPasswordUpdate")

  let nav = await utilities.getNav()
  const {
    account_id,
    account_password,
  } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      console.log("Error occurred")
      req.flash("notice", 'Sorry, there was an error processing the update.')
      res.status(500).render("account/account_management", {
        title: "Account Management",
        nav,
        errors: null,
      })
    }

  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword,
  )

  if (updateResult) {
    console.log("Success")
    req.flash("notice", `Your password was successfully updated.`)
    res.redirect("/account/")
  } else {
    console.log("Fail")
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account_management", {
    title: "Account Management",
    nav,
    errors: null,
    })
  }
}

/* ******************************************
 * Deliver Account Logout view (Assignment 5)
 *******************************************/
async function buildLogoutView(req,res,next) {
  res.clearCookie("jwt")
  res.locals.loggedin = 0
  res.redirect("/")
}

/* ******************************************
 * Process Logout (Assignment 5)
 *******************************************/
async function processLogout(req,res,next) {
  return res.redirect("../../")
}


module.exports = { buildLogin, buildRegister, registerAccount, logToAccount, buildManagement, buildAccountUpdate, processAccountUpdate, processPasswordUpdate, buildLogoutView, processLogout }
