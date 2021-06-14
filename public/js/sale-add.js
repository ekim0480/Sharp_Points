$(document).ready(function () {
  // Looks for a query param in the url for customer_id and get's that customer's data
  var url = window.location.search;
  var customerId;
  if (url.indexOf("?customer_id=") !== -1) {
    customerId = url.split("=")[1];
    getCustomerData(customerId);
  }

  // declaring dom variables
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

  // event listener for the submit button
  $(document).on("submit", "#saleAddForm", handleSaleFormSubmit);

  // funcion to retrieve the corresponding customer's data
  function getCustomerData(customer) {
    customerId = customer || "";
    if (customerId) {
      customerId = customerId;
    }
    $.get("/customers/" + customerId, function (data) {
      console.log("Customer", data);
    });
  }

  // function to handle sale form submission
  function handleSaleFormSubmit(event) {
    event.preventDefault();
    // if any of the required fields are missing, alert and terminate function
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
      // set variable for the id of the customer the sale belongs to
      customerId = window.location.search.split("=")[1];
      // console.log(customerId)
      // creating newSale object to be sent
      var newSale = {
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
        customerId: customerId,
      };
      // make post call and send data in newSale object
      $.post("/sales", newSale).then(function (data) {
        // console.log(data)
        // alert user of success and send them to the corresponding customer's details page
        alert("Sale added!");
        window.location.href = "/customerDetails?customer_id=" + customerId;
      });
    }
  }
});
