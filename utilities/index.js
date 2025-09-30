const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const messageModel = require("../models/message-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'

  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* **************************************
* Build the Car Details Page view HTML
* ************************************ */
Util.buildProductPage = async function(data){
  let grid
  if(data.length > 0){
    grid = '<div id="product-display">'
    data.forEach(vehicle => { 
      grid +=  '<img src="' + vehicle.inv_image 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" />'
      grid += '<div class="details">'
      grid += '<p>'+ vehicle.inv_make + ' ' + vehicle.inv_model + ' Details'
      grid += '</p>'
      grid += '<span><b>Price:</b> $' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '<p><b>Description:</b> ' + vehicle.inv_description
      grid += '</p>'
      grid += '<p><b>Color:</b> '+ vehicle.inv_color
      grid += '</p>'
      grid += '<p><b>Miles:</b> '+ new Intl.NumberFormat('en-US').format(vehicle.inv_miles)
      grid += '</p>'
      grid += '</div>'
    })
    grid += '</div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the add inventory drop down
* ************************************ */
Util.buildDropDownForm = async function(classification_id){
  let data = await invModel.getClassifications()
  let classificationList =
  '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=\"\">Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (classification_id != null && row.classification_id == classification_id) { 
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
    classificationList += '</select>'
  return classificationList
}

/* ****************************************
 *  Check Login
 * ************************************ */


Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ************************
 * Constructs the account HTML select options
 ************************** */
Util.getAccountSelect = async function (selectedOption) {
  let data = await accountModel.getAccounts()
  let options = `<option value="">Select a Recipient</option>`
  data.rows.forEach((row => {
    options += 
      `<option value="${row.account_id}"
      ${row.account_id === Number(selectedOption) ? 'selected': ''}>
      ${row.account_firstname} ${row.account_lastname}
      </option>`
  }))
  return options
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in")
          res.clearCookie("jwt")
        return res.redirect("/account/login")
        }
          res.locals.accountData = accountData
          res.locals.loggedin = 1
        next()
    })
  } else {
  next()
  }
}

/* ****************************************
* Middleware to check user account type
**************************************** */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.loggedin && (res.locals.accountData.account_type == "Employee"|| res.locals.accountData.account_type == "Admin")) { // check if logged in 
    next() //if logged in, allow user to continue
  } else {
    // ask user to log in
    req.flash("notice", "Access restricted. Please log in as an Employee or Admin.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check user authorization, block unauthorized users
 * ************************************ */
Util.checkAuthorization = async (req, res, next) => {
  // auth : 0
  let auth = 0
  // logged in ? next : 0
  if (res.locals.loggedin) {
    const account = res.locals.accountData
    // admin ? 1 : 0
    account.account_type == "Admin" 
      || account.account_type == "Employee" ? auth = 1 : auth = 0 
  }
  // !auth ? 404 : next()
  if (!auth) {
    req.flash("notice", "Please log in")
    res.redirect("/account/login")
    return
  } else {
    next()
  }
}

/* ************************
 * Constructs unarchived messages on account_id
 ************************** */
Util.getAccountMessages = async function (account_id) {
  let data = await messageModel.getMessagesByAccountId(account_id)
  let dataTable
  if (data.rowCount === 0) {
    dataTable = '<h3>No new messages</h3>'
  } else {
    dataTable = '<table id="inboxMessagesDisplay"><thead>'; 
    dataTable += '<tr><th>Read</th><th>Received</th><th>Subject</th><th>From</th></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
    // Iterate over all messages in the array and put each in a row 
    data.rows.forEach((row => { 
      dataTable += `<tr><td>` 
        if (row.message_read) {
          dataTable += ` true`
        } else {
          dataTable += ` false`
        }
      dataTable += `</div></td>`; 
      dataTable += `<td>${row.message_created.toLocaleString('en-US', 'narrow')}</td>`; 
      dataTable += `<td><a href='/inbox/view/${row.message_id}' title='Click to view message'>${row.message_subject}</a></td>`;
      dataTable += `<td>${row.account_firstname} ${row.account_lastname}</td></tr>`;
    })) 
    dataTable += '</tbody></table>'; 
  }
  return dataTable
}

/* ************************
 * Constructs archived messages on account_id
 ************************** */
Util.getArchivedMessages = async function (account_id) {
  let data = await messageModel.getArchivedMessagesByAccountId(account_id)
  let dataTable
  if (data.rowCount === 0) {
    dataTable = '<h3>No archived messages</h3>'
  } else {
    dataTable = '<table id="inboxMessagesDisplay"><thead>'; 
    dataTable += '<tr><th>Read</th><th>Received</th><th>Subject</th><th>From</th></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
    // Iterate over all messages in the array and put each in a row 
    data.rows.forEach((row => {
      dataTable += `<tr><td>` 
        if (row.message_read) {
          dataTable += ` true`
        } else {
          dataTable += ` false`
        }
      dataTable += `</div></td>`; 
      dataTable += `<td>${row.message_created.toLocaleString('en-US', 'narrow')}</td>`;
      dataTable += `<td><a href='/inbox/view/${row.message_id}' title='Click to view message'>${row.message_subject}</a></td>`;
      dataTable += `<td>${row.account_firstname} ${row.account_lastname}</td></tr>`;
    })) 
    dataTable += '</tbody></table>'; 
  }
  return dataTable
}

module.exports = Util