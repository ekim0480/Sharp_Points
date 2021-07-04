$(document).ready(function () {
  // hide the div that contains input field used to redeem points
  $("#hiddenDiv").hide();

  // set value of redeem input field to 0
  $("#redeemPointsInput").val(0);

  // saleContainer holds all of our sales
  var saleContainer = $("#sale-container");
  var saleList = $("#saleTableBody");
  var mileageList = $("#mileageTableBody");

  // dom variable to display point total
  var pointTotal = $("#pointTotal");

  // Add events for buttons
  $(document).on("click", "#deleteSale", handleSaleDelete);
  $(document).on("click", "#newSaleBtn", handleNewSale);
  $(document).on("click", "#editDetailsBtn", handleEditDetails);
  $(document).on("click", "#redeemPointsBtn", handleHiddenFormReveal);
  $(document).on("click", "#confirmRedeemBtn", handleConfirmRedeem);
  $(document).on("click", "#addMileageBtn", handleAddMileage);
  $(document).on("click", "#deleteMileage", handleMileageDelete);
  $(document).on("submit", ".profitForm", handleProfitSubmit);

  // set up global variable to hold user's admin status
  var hasAdmin;

  // Variable to hold our sales
  var sales;

  var mileages;

  // The code below handles the case where we want to get sales for a specific customer
  // Looks for a query param in the url for customer_id
  var url = window.location.search;
  var customerId;
  if (url.indexOf("?customer_id=") !== -1) {
    customerId = url.split("=")[1];
    getCustomerData(customerId);
    getSales(customerId);
  }
  // If there's no customerId we just get all sales as usual
  else {
    getSales();
  }

  // function to get user data, more specifically, see if they have admin
  // we use async function to wait for user data first to see if they have admin
  // so we can render our page accordingly, async would not be necessary if
  // we didn't need to render certain things depending on admin status
  // but here, we do
  async function getUser() {
    $.get("/userData", function (data) {
      // reassign global variable
      hasAdmin = data.hasAdmin;
      // if admin, add profits link to navbar
      if (hasAdmin == true) {
        $("#profitsNav").append(
          '<a class="nav-link" href="/profits">Profits</a>'
        );
      }
    });
    return hasAdmin;
  }

  // function to GET a customer's data
  function getCustomerData(customer) {
    customerId = customer || "";
    if (customerId) {
      customerId = customerId;
    }
    $.get("/customers/" + customerId, function (data) {
      console.log("Customer", data);

      mileages = data.Mileages;
    }).then(function (data) {
      // printing customer data
      // declaring dom variables
      var listEl = document.createElement("ul");
      var li1 = document.createElement("li");
      var li2 = document.createElement("li");
      var li3 = document.createElement("li");
      var li4 = document.createElement("li");
      var li5 = document.createElement("li");
      var li6 = document.createElement("li");

      // display retrieved total point value
      pointTotal.text(data.totalPoints);

      // set the text content of the list that will be printed
      li1.textContent = "ID: " + data.id;
      li2.textContent = "Name: " + data.lastName + ", " + data.firstName;
      li3.textContent = "Gender: " + data.gender;
      li4.textContent = "Date of Birth: " + data.dob;
      li5.textContent = "Phone: " + data.phone;
      li6.textContent = "E-mail: " + data.email;

      // if (data.Mileages[0] == null) {
      //   li7.textContent = "Mileage: " + "";
      // } else {
      //   li7.textContent = "Mileage: " + data.Mileages[0].mileage;
      // }

      // append the list and link
      $("#customerDataCol").append(listEl);
      // append each list item to the newly appended list
      listEl.appendChild(li1);
      listEl.appendChild(li2);
      listEl.appendChild(li3);
      listEl.appendChild(li4);
      listEl.appendChild(li5);
      listEl.appendChild(li6);

      initializeMileageRows();
    });
  }

  // This function grabs sales from the database and updates the view
  function getSales(customer) {
    // retrieve user data to see if they have admin so we can render profits
    // column if true
    getUser().then(function () {
      // if customer id is present, print that get and print that customer's sales
      customerId = customer || "";
      if (customerId) {
        customerId = "/?customer_id=" + customerId;
      }
      $.get("/sales" + customerId, function (data) {
        console.log("Sales", data);
        sales = data;
        // if there are no sales, run displayEmpty
        if (!sales || !sales.length) {
          displayEmpty(customer);
        } else {
          initializeRows();
        }
      });
    });
  }

  // function to create rows for each sale and prepare them to be inserted into the sales table
  function createSaleRow(saleData) {
    // console.log(saleData);
    // console.log(saleData.origin)
    var newTr = $("<tr>");

    // add class for paginating with simplePagination.js
    // newTr.addClass("paginate");

    newTr.data("sale", saleData);
    newTr.append("<td class='tableHeadId'>" + saleData.Customer.id + "</td>");
    newTr.append("<td class='tableHeadId'>" + saleData.id + "</td>");
    newTr.append("<td>" + saleData.type + "</td>");
    newTr.append("<td>" + saleData.origin + "</td>");
    newTr.append("<td>" + saleData.depDetails + "</td>");
    newTr.append("<td>" + saleData.depDate + "</td>");
    newTr.append("<td>" + saleData.destination + "</td>");
    newTr.append("<td>" + saleData.arrivalDetails + "</td>");
    newTr.append("<td>" + saleData.arrivalDate + "</td>");
    newTr.append("<td>" + saleData.saleAmount + "</td>");

    // if admin status is true, add a profits column to table
    if (hasAdmin == true) {
      console.log(saleData.profit);
      $("#profitHeader").text("Profit");
      // create an async function to append the row, with an input field
      // we need async otherwise the next step won't apply properly
      async function newProfitRows() {
        newTr.append(
          `<td id='profitColumn'><form class='profitForm'><input type='number' class='form-control profitInput' step='.01' value='${saleData.profit}'></form></td>`
        );
      }
      // append the row, then...
      newProfitRows().then(function () {
        // function to automatically turn input into one with 2 decimal places
        $(".profitInput").blur(function () {
          var num = parseFloat($(this).val());
          var cleanNum = num.toFixed(2);
          $(this).val(cleanNum);
        });
      });
    }

    newTr.append("<td>" + saleData.points + "</td>");

    // add view/edit link
    newTr.append(
      "<td><a href='/saleUpdate?sale_id=" + saleData.id + "'>View/Edit</a></td>"
    );
    // add delete link
    newTr.append(
      "<td><a style='cursor:pointer;color:red' id='deleteSale'>Delete</a></td>"
    );
    return newTr;
  }

  // InitializeRows handles appending all of our constructed sale HTML inside saleContainer
  // also adds all points and displays total value
  function initializeRows() {
    // saleContainer.empty();
    var salesToAdd = [];
    for (var i = 0; i < sales.length; i++) {
      salesToAdd.push(createSaleRow(sales[i]));
    }
    // console.log(salesToAdd);
    renderSaleList(salesToAdd);
  }

  // function to render sales rows, if present
  function renderSaleList(rows) {
    saleList.children().not(":last").remove();
    saleContainer.children(".alert").remove();
    // console.log(rows.length);
    saleList.prepend(rows);

    // table pagination
    $("#saleTable").fancyTable({
      sortColumn: 1,
      pagination: true,
      paginationClass: "btn btn-link",
      sortable: false,
      perPage: 10,
      globalSearch: true,
      // exclude first 2 columns, which are hidden and hold customer and
      // sale id values, and last 2 columns, which are links to view/delete
      globalSearchExcludeColumns: [1, 2, 12, 13],
      inputPlaceholder: "Search All...",
    });
  }

  // function to handle new sale
  function handleNewSale() {
    // extract customerid from url
    var url = window.location.search;
    var customerId;
    if (url.indexOf("?customer_id=") !== -1) {
      customerId = url.split("=")[1];
    }
    // send user to corresponding customer's add sale page
    window.location.href = "/sale?customer_id=" + customerId;
  }

  // function to handle editing customer's details
  function handleEditDetails() {
    // extract customerid from url
    var url = window.location.search;
    var customerId;
    if (url.indexOf("?customer_id=") !== -1) {
      customerId = url.split("=")[1];
    }
    // send user to corresponding customer's update page
    window.location.href = "/customerUpdate?customer_id=" + customerId;
  }

  // function to reveal hidden form when redeem points button is clicked
  function handleHiddenFormReveal() {
    $("#hiddenDiv").show();
  }

  // function to handle redeeming of points
  function handleConfirmRedeem(event) {
    event.preventDefault();
    customerId = url.split("=")[1];
    // console.log("this is customer id", customerId);

    // setting up a string with today's date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;

    // console.log(today)

    // parsing values we need into numbers for maths
    var parsedPointTotal = parseInt(pointTotal.text().trim());
    var parsedRedeemInput = parseInt($("#redeemPointsInput").val().trim());

    // perform math
    var finalPointTotal = parsedPointTotal - parsedRedeemInput;

    // set up a NEGATIVE points used value to be inserted
    // so that upon deletion of this point redeem "sale"
    // it will refund the points back to the customer
    var pointsUsed = -parsedRedeemInput;

    // string to be inserted into notes section to log when
    // points were used
    var usedPointsOn = "Used " + `${parsedRedeemInput}` + " on " + `${today}`;

    // set up object to be sent to database
    var updatedPoints = {
      type: "Points",
      customerId: customerId,
      pointsUsed: pointsUsed,
      finalPoints: finalPointTotal,
      usedPointsOn: usedPointsOn,
    };

    if (
      // if input field is blank, not a number, or a negative value,
      // alert and terminate function
      parsedRedeemInput == null ||
      isNaN(parsedRedeemInput) ||
      parsedRedeemInput < 0
    ) {
      // console.log(parsedRedeemInput);
      alert("Please enter a valid amount.");
      return;
    } else if (
      // if more points are used than exists,
      // alert and terminate
      finalPointTotal < 0
    ) {
      // console.log(finalPointTotal);
      alert("Point value may not exceed customer's total points!");
      return;
    } else {
      // console.log(parsedRedeemInput);
      // console.log(finalPointTotal);

      // final confirmation prompt
      var finalConfirmation = confirm(
        "WARNING - Redeem " + `${parsedRedeemInput}` + " " + "points?"
      );

      // if user confirms, make PUT call to update customer's remaining points,
      // as well as create a blank sale noting when points were redeemed for
      // tracking purposes
      if (finalConfirmation) {
        $.ajax({
          method: "PUT",
          url: "/addPoints",
          contentType: "application/json",
          data: JSON.stringify(updatedPoints),
          dataType: "json",
        });
        $.post("/usedPoints", updatedPoints).then(function () {
          // if all is good, alert user of success and refresh page
          alert("Points redeemed!");
          location.reload();
        });
      }
    }
  }

  // handles when enter is pressed to submit in profit input
  function handleProfitSubmit(event) {
    event.preventDefault();

    // grab sale id
    var saleId = $(this).closest("tr").children("td:nth-child(2)").text();

    // grab value that was input
    var profitInput = $(this).find(".profitInput").val();

    // create object to send put request
    var updateProfit = {
      id: saleId,
      profit: profitInput,
    };

    $.ajax({
      method: "PUT",
      url: "/profits",
      contentType: "application/json",
      data: JSON.stringify(updateProfit),
      dataType: "json",
    })

    document.activeElement.blur()
    // .then(function () {
    //   // after update, re render table
    //   // not very efficient, needs reworking
    //   $(".fancySearchRow").remove();
    //   $("#saleTableBody").empty();
    //   getSales();
    // });

    // this block performs the query once user moves off of target field
    // $(".profitForm").on("focusout", function(){
    //   let do_query = true;
    //   setTimeout(function(){
    //      $(".profitForm:input").each(function(){
    //        if($(this).is(":focus")){
    //          do_query = false;
    //          return false; //Exit the each loop
    //        }
    //      });

    //      if(do_query){
    //         console.log("I'm going to perform the query");
    //      }

    //   }, 200);
    // });
  }

  // This function handles the sale delete
  function handleSaleDelete() {
    // workaround because fancyTable.js was messing with our jquery data
    // storage.  Included hidden columns containing both customer and
    // sale ids, and referred to text in "nth" columns to retreive the
    // necessary data.
    var customerId = $(this)
      .parent("td")
      .parent("tr")
      .children("td:first")
      .text();
    var saleId = $(this)
      .parent("td")
      .parent("tr")
      .children("td:nth-child(2)")
      .text();

    // grabbing values we need to update Customer's total point value after
    // subtracting the current sale's point value from the Customer's
    // original total point value.
    var customerOriginalTotalPoints = parseInt($("#pointTotal").text());
    var salePointValue = parseInt(
      $(this).parent("td").parent("tr").children("td:nth-child(11)").text()
    );
    // console.log(salePointValue)

    // perform math to subtract this sale's points from the Customer's
    // original total points, and prepare to make put request
    var customerPointTotalAfterDelete = (
      customerOriginalTotalPoints - salePointValue
    ).toString();

    // prepare as object to be sent in ajax put call
    var updatedPoints = {
      customerId: customerId,
      finalPoints: customerPointTotalAfterDelete,
    };

    // show confirm window to ask user to confirm the deletion
    var confirmDelete = confirm("Confirm delete of sale?");
    // if user confirms, make the ajax call to delete the sale
    if (confirmDelete) {
      $.ajax({
        method: "DELETE",
        url: "/sales/" + saleId,
      });
      // make ajax call to update customer's total points value
      // with minus deleted sale
      $.ajax({
        method: "PUT",
        url: "/addPoints",
        contentType: "application/json",
        data: JSON.stringify(updatedPoints),
        dataType: "json",
      }).then(function () {
        // refresh page
        location.reload();
      });
    }
  }

  // This function displays a message when there are no sales
  function displayEmpty() {
    var alertDiv = $("<div>");
    $("#saleTable tbody").empty();
    alertDiv.addClass("alert alert-danger");
    // display this message if no matches are found, includes a link which,
    // if clicked, will lead to the addCustomer page, with the searched
    // phone number in the url so we can pre-insert it into the form.
    alertDiv.html("No Sales Found");
    $("#sale-container").append(alertDiv);
  }

  function handleAddMileage(event) {
    event.preventDefault();
    if (
      $("#addMileageInput").val() == null ||
      $("#addMileageInput").val() == ""
    ) {
      return;
    } else if ($("#addMileageInput").val().length > 15) {
      alert("Mileage number cannot exceed 15 characters.");
      $("#addMileageInput").val("");
      return;
    }
    // set variable for the id of the customer the mileage belongs to
    customerId = window.location.search.split("=")[1];

    var newMileage = {
      mileage: $("#addMileageInput").val().trim(),
      customerId: customerId,
    };

    $.post("/mileages", newMileage).then(function (data) {
      console.log(data);

      var newTr = $("<tr>");

      newTr.append("<td class='tableHeadId'>" + data.id + "</td>");
      newTr.append("<td>" + data.mileage + "</td>");

      // add delete link
      newTr.append(
        "<td><a style='cursor:pointer;color:red' id='deleteMileage'>X</a></td>"
      );
      mileageList.append(newTr);
      $("#addMileageInput").val("");
    });
  }

  function createMileageRow(mileageData) {
    // console.log(saleData);
    // console.log(saleData.origin)
    var newTr = $("<tr>");

    newTr.data("mileage", mileageData);
    newTr.append("<td class='tableHeadId'>" + mileageData.id + "</td>");
    newTr.append("<td>" + mileageData.mileage + "</td>");

    // add delete link
    newTr.append(
      "<td><a style='cursor:pointer;color:red' id='deleteMileage'>X</a></td>"
    );
    return newTr;
  }

  function initializeMileageRows() {
    var mileagesToAdd = [];
    for (var i = 0; i < mileages.length; i++) {
      mileagesToAdd.push(createMileageRow(mileages[i]));
    }
    // console.log(salesToAdd);
    renderMileageList(mileagesToAdd);
  }

  function renderMileageList(rows) {
    mileageList.children().not(":last").remove();

    // console.log(rows.length);
    mileageList.prepend(rows);
  }

  function handleMileageDelete() {
    $(this).closest("tr").remove();
    var mileageId = $(this).closest("tr").children("td:first").text();
    console.log(mileageId);
    $.ajax({
      method: "DELETE",
      url: "/mileages/" + mileageId,
    }).then(function () {});
  }
});
