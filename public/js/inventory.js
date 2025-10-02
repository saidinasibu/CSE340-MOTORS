"use strict"

let classificationList = document.querySelector("#select_classification_id")

classificationList.addEventListener("change", function () {

    console.log("Inside Select  Add Event Listener")

    let classification_id = classificationList.value 

    console.log(`classification id dis: ${classification_id}`)

    let classIdURL = "/inv/getInventory/"+classification_id
    console.log("classIdURL", classIdURL)

    fetch(classIdURL)
        .then(function (response) {
            if (response.ok) {
                console.log("Response:")
                console.log(response)
                return response.json();
            }

            throw Error("Network response was not OK")
        })
        .then(function (data) {
            console.log("Before Build Inventory List");
            buildInventoryList(data);
        })
        .catch(function (error) {
            console.log(error)
            console.log("There was a problem: ", error.message)
        })
})



function buildInventoryList(data) {
    let inventoryDisplay = document.getElementById("inventoryDisplay")

    let dataTable = '<thead>'
    dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'
    dataTable += '</thead>'

    dataTable += '<tbody>'

    data.forEach(function (element) {
        console.log(element.inv_id + ", " + element.inv_model)

        dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`
        dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`
        dataTable += `<td><a href='/inv/delete/${element.inv_id} title='Click to delete'>Delete</a></td></tr>`
    })

    dataTable += '</tbody>'

    inventoryDisplay.innerHTML = dataTable
}