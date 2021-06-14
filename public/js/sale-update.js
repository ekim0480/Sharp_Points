$(document).ready(function () {
  // Looks for a query param in the url for sale_id and gets that sale's data
  var url = window.location.search;
  var saleId;
  if (url.indexOf("?sale_id=") !== -1) {
    saleId = url.split("=")[1];
    // console.log(saleId);
    getSaleData(saleId);
  }

  // variable to hold the id of the customer this sale belongs to
  var customerId;

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

  // function to get the corresponding sale's data
  function getSaleData(sale) {
    saleId = sale || "";
    if (saleId) {
      saleId = saleId;
    }
    $.get("/sales/" + saleId, function (data) {
      console.log("Sale", data);
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
      // grabbing the corresponding customer's id and sending it up for use later.
      customerId = data.CustomerId;
      return customerId;
    });
  }

  // function to handle update form submission
  function handleSaleUpdateFormSubmit(event) {
    event.preventDefault();
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
      };
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
        alert("Sale Information Updated!");
        window.location.href = "/customerDetails?customer_id=" + customerId;
      });
    }
  }
});
