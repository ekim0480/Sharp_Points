$(document).ready(function () {
  // Looks for a query param in the url for sale_id and gets that sale's data
  var url = window.location.search;
  var saleId;
  if (url.indexOf("?sale_id=") !== -1) {
    saleId = url.split("=")[1];
    // console.log(saleId);
    getSaleData(saleId);
  }

  // variable to hold some information related to the customer the
  // sale belongs to, as an array.
  // We need the customer's id, and how many points they currently have.
  // We will be defining the variable as an **OBJECT**
  var customerData;

  // variable to hold the original point value of the sale for
  // use in calculations later should the user change the sale amount.
  var originalPointValueOfSale;

  // declaring dom variables
  var idInput = $("#idInput");
  var depCityInput = $("#depCityInput");
  var depFlightInput = $("#depFlightInput");
  var depDateInput = $("#depDateInput");
  var desCityInput = $("#desCityInput");
  var retFlightInput = $("#retFlightInput");
  var retDateInput = $("#retDateInput");
  var saleAmountInput = $("#saleAmountInput");
  var pointsInput = $("#pointsInput");
  var notesInput = $("#notesInput");
  var remarksInput = $("#remarksInput");

  // event listener for submit button
  $(document).on("submit", "#saleUpdateForm", handleSaleUpdateFormSubmit);

  // function to get the corresponding sale's data.
  // "get" route also included data of the customer the sale
  // belongs to.
  function getSaleData(sale) {
    saleId = sale || "";
    if (saleId) {
      saleId = saleId;
    }
    $.get("/sales/" + saleId, function (data) {
      console.log("Sale", data);
      console.log("customerid", data.Customer.id);
    }).then(function (data) {
      // pre-insert the sale's data into the corresponding input fields
      idInput.val(data.id);
      depCityInput.val(data.depCity);
      depFlightInput.val(data.depFlight);
      depDateInput.val(data.depDate);
      desCityInput.val(data.desCity);
      retFlightInput.val(data.retFlight);
      retDateInput.val(data.retDate);
      saleAmountInput.val(data.saleAmount);
      pointsInput.val(data.points);
      notesInput.val(data.notes);
      remarksInput.val(data.remarks);

      // setting the value of originalPointsValueOfSale
      originalPointValueOfSale = data.points;

      // setting the variable set at the beginning to be the result
      // returned from performing the storeCustomerData function
      customerData = storeCustomerData(
        data.Customer.id,
        data.Customer.totalPoints
      );

      // function to take the customer's data we want, and turn it
      // into an object of its own.
      function storeCustomerData(customerId, initialPoints) {
        var object = {
          customerId: data.Customer.id,
          initialPoints: data.Customer.totalPoints,
        };
        return object;
      }
    });
  }

  // function to automatically turn input into one with 2 decimal places
  saleAmountInput.blur(function () {
    var num = parseFloat($(this).val());
    var cleanNum = num.toFixed(2);
    $(this).val(cleanNum);
  });

  // Handling the automatic calculation of 1% of the sale value and automatically inputting it into points field.

  // locate corresponding input field, the sale amount.
  saleAmountInput
    // bind to anything change related (down to keyboard changes so the element
    // won't need to lose focus, or the user won't have to press enter)
    .bind("keypress keydown keyup change", function () {
      // retrieve the values of the inputs (we also call parseFloat to confirm
      // we are dealing with numeric values)
      var value = parseFloat(saleAmountInput.val());

      // default the end result to an empty string (you'll see
      // why with the following statement)
      var x = "";

      // confirm that the value that goes in to the equation is
      // a number before we try to perform any math functions. If
      // all goes well, "x" above will have the actual resulting value.
      // if any number is invalid, the "Result" field gets emptied
      if (!isNaN(value)) {
        // the math function
        x = Math.round(value * 0.01);
      }

      // replace the value of points input field with our new calculated value
      pointsInput.val(x.toString());
    });

  // function to handle update form submission
  function handleSaleUpdateFormSubmit(event) {
    event.preventDefault();

    var pointsOfSaleBeforeUpdate = parseInt(originalPointValueOfSale);
    var pointsOfSaleAfterUpdate = parseInt(pointsInput.val().trim());
    var customerPointsBeforeUpdate = parseInt(customerData.initialPoints);

    var customerPointsAfterUpdate = (
      customerPointsBeforeUpdate -
      pointsOfSaleBeforeUpdate +
      pointsOfSaleAfterUpdate
    ).toString();

    // if any required fields are missing, alert user and terminate function
    if (
      !depCityInput.val().trim().trim() ||
      !depFlightInput.val().trim().trim() ||
      !depDateInput.val().trim().trim() ||
      !desCityInput.val().trim().trim() ||
      !retFlightInput.val().trim().trim() ||
      !retDateInput.val().trim().trim()
    ) {
      alert("You are missing a required field!");
      return;
    } else {
      // otherwise...
      // variable for saleId we grab from the url
      saleId = window.location.search.split("=")[1];
      //   console.log(saleId);
      // create object with data to be sent
      var updateSale = {
        id: idInput.val(),
        depCity: depCityInput.val().trim(),
        depFlight: depFlightInput.val().trim(),
        depDate: depDateInput.val().trim(),
        desCity: desCityInput.val().trim(),
        retFlight: retFlightInput.val().trim(),
        retDate: retDateInput.val().trim(),
        saleAmount: saleAmountInput.val().trim(),
        points: pointsInput.val().trim(),
        notes: notesInput.val().trim(),
        remarks: remarksInput.val().trim(),
        finalPoints: customerPointsAfterUpdate,
        customerId: customerData.customerId,
      };

      $.ajax({
        method: "PUT",
        url: "/addPoints",
        contentType: "application/json",
        data: JSON.stringify(updateSale),
        dataType: "json",
      });
      //   console.log(JSON.stringify(updateSale));
      // make ajax call with PUT method to update corresponding sale with dat in updateSale object
      $.ajax({
        method: "PUT",
        url: "/sales",
        contentType: "application/json",
        data: JSON.stringify(updateSale),
        dataType: "json",
      }).then(function () {
        // alert user of success and send them to corresponding customer's details page
        console.log("Customer Data object", customerData);
        console.log("original point value", originalPointValueOfSale);
        alert("Sale Information Updated!");
        window.location.href =
          "/customerDetails?customer_id=" + customerData.customerId;
      });
    }
  }
});
