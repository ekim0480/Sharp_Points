$(document).ready(function () {
  // hide the div that contains input field used to redeem points
  $("#hiddenDiv").hide();

  // set value of redeem input field to 0
  $("#redeemPointsInput").val(0);

  // saleContainer holds all of our sales
  var saleContainer = $(".sale-container");
  var saleList = $("tbody");

  // dom variable to display point total
  var pointTotal = $("#pointTotal");

  // Add events for buttons
  $(document).on("click", "#deleteSale", handleSaleDelete);
  $(document).on("click", "#newSaleBtn", handleNewSale);
  $(document).on("click", "#editDetailsBtn", handleEditDetails);
  $(document).on("click", "#redeemPointsBtn", handleHiddenFormReveal);
  $(document).on("click", "#confirmRedeemBtn", handleConfirmRedeem);
  // $(document).on("click", "#viewSale", handleViewSale)
  // Variable to hold our sales
  var sales;

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

  // function to GET a customer's data
  function getCustomerData(customer) {
    customerId = customer || "";
    if (customerId) {
      customerId = customerId;
    }
    $.get("/customers/" + customerId, function (data) {
      console.log("Customer", data);
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
      var li7 = document.createElement("li");

      // display retrieved total point value
      pointTotal.text(data.totalPoints);

      // set the text content of the list that will be printed
      li1.textContent = "ID: " + data.id;
      li2.textContent = "Name: " + data.lastName + ", " + data.firstName;
      li3.textContent = "Gender: " + data.gender;
      li4.textContent = "Date of Birth: " + data.dob;
      li5.textContent = "Phone: " + data.phone;
      li6.textContent = "E-mail: " + data.email;
      li7.textContent = "Mileage: " + data.mileage;
      // append the list to #customerDetailsRow
      $("#customerDetailsRow").append(listEl);
      // append each list item to the newly appended list
      listEl.appendChild(li1);
      listEl.appendChild(li2);
      listEl.appendChild(li3);
      listEl.appendChild(li4);
      listEl.appendChild(li5);
      listEl.appendChild(li6);
    });
  }

  // This function grabs sales from the database and updates the view
  function getSales(customer) {
    // if customer id is present, print that get and print that customer's sales
    customerId = customer || "";
    if (customerId) {
      customerId = "/?customer_id=" + customerId;
    }
    $.get("/sales" + customerId, function (data) {
      // console.log("Sales", data);
      sales = data;
      // if there are no sales, run displayEmpty
      if (!sales || !sales.length) {
        displayEmpty(customer);
      } else {
        initializeRows();
      }
    });
  }

  // function to create rows for each sale and prepare them to be inserted into the sales table
  function createSaleRow(saleData) {
    // console.log(saleData);
    // console.log(saleData.origin)
    var newTr = $("<tr>");
    newTr.data("sale", saleData);
    newTr.append("<td>" + saleData.type + "</td>");
    newTr.append("<td>" + saleData.origin + "</td>");
    newTr.append("<td>" + saleData.depDetails + "</td>");
    newTr.append("<td>" + saleData.depDate + "</td>");
    newTr.append("<td>" + saleData.destination + "</td>");
    newTr.append("<td>" + saleData.arrivalDetails + "</td>");
    newTr.append("<td>" + saleData.arrivalDate + "</td>");
    newTr.append("<td>" + saleData.saleAmount + "</td>");
    newTr.append("<td>" + saleData.points + "</td>");
    // newTr.append("<td><a id='viewSale' style='cursor:pointer;color:green'>View</a></td>");
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
    saleContainer.empty();
    var salesToAdd = [];
    for (var i = 0; i < sales.length; i++) {
      salesToAdd.push(createSaleRow(sales[i]));
    }
    renderSaleList(salesToAdd);

    $("#saleTable").after('<div id="nav"></div>');
    var rowsShown = 10;
    var rowsTotal = $("#saleTable tbody tr").length;
    var numPages = rowsTotal / rowsShown;
    for (i = 0; i < numPages; i++) {
      var pageNum = i + 1;
      $("#nav").append('<a href="#" rel="' + i + '">' + pageNum + "</a> ");
    }
    $("#saleTable tbody tr").hide();
    $("#saleTable tbody tr").slice(0, rowsShown).show();
    $("#nav a:first").addClass("active");
    $("#nav a").bind("click", function () {
      $("#nav a").removeClass("active");
      $(this).addClass("active");
      var currPage = $(this).attr("rel");
      var startItem = currPage * rowsShown;
      var endItem = startItem + rowsShown;
      $("#saleTable tbody tr")
        .css("opacity", "0.0")
        .hide()
        .slice(startItem, endItem)
        .css("display", "table-row")
        .animate({ opacity: 1 }, 300);
    });
  }

  // function to render sales rows, if present
  function renderSaleList(rows) {
    saleList.children().not(":last").remove();
    saleContainer.children(".alert").remove();
    if (rows.length) {
      //   console.log(rows);
      saleList.prepend(rows);
    } else {
      renderEmpty();
    }
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

    // console.log(pointTotal.text());
    // console.log(parsedRedeemInput);
    // console.log(parsedPointTotal);
    // console.log(finalPointTotal);

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
      console.log(parsedRedeemInput);
      alert("Please enter a valid amount.");
      return;
    } else if (
      // if more points are used than exists,
      // alert and terminate
      finalPointTotal < 0
    ) {
      console.log(finalPointTotal);
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

  // This function handles the sale delete
  function handleSaleDelete() {
    // extracting the data of the corresponding sale
    var listItemData = $(this).parent("td").parent("tr").data("sale");
    console.log(listItemData);
    var customerId = listItemData.Customer.id;
    var saleId = listItemData.id;

    // grabbing values we need to update Customer's total point value after
    // subtracting the current sale's point value from the Customer's
    // original total point value.
    var customerOriginalTotalPoints = parseInt(
      listItemData.Customer.totalPoints
    );
    var salePointValue = parseInt(listItemData.points);

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

  // This function handles the view link
  // function handleViewSale(){
  //   var listItemData = ($(this).parent("td").parent("tr").data("sale"))
  //   console.log(listItemData)
  //   document.write('<html><body><p id="origin"></p><p id="depDetails"></p><p id="depDate"></p></body></html>')
  //   document.getElementById("origin").innerHTML = "Departure City: " + listItemData.origin
  //   document.getElementById("depDetails").innerHTML = "Departing Flight: " + listItemData.depDetails
  //   document.getElementById("depDate").innerHTML = "Departure Date: " + listItemData.depDate
  // }

  // This function displays a message when there are no sales
  function displayEmpty(id) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for Customer #" + id;
    }
    saleContainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html("No sales yet" + partial);
    saleContainer.append(messageH2);
  }
});
