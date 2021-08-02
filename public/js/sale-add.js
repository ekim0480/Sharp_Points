$(document).ready(function () {
  // Looks for a query param in the url for customer_id and get's that customer's data
  var url = window.location.search;
  var customerId;
  if (url.indexOf("?customer_id=") !== -1) {
    customerId = url.split("=")[1];
    getCustomerData(customerId);
  }

  // code block to get user admin status
  var hasAdmin;

  function getUser() {
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
  getUser();

  // declaring dom variables
  var typeInput = $("#typeInput");
  var originInput = $("#originInput");
  var depDetailsInput = $("#depDetailsInput");
  var depDateInput = $("#depDateInput");
  var destinationInput = $("#destinationInput");
  var arrivalDetailsInput = $("#arrivalDetailsInput");
  var arrivalDateInput = $("#arrivalDateInput");
  var saleAmountInput = $("#saleAmountInput");
  var pointsInput = $("#pointsInput");
  var accReceivableInput = $("#accReceivableInput")
  var notesInput = $("#notesInput");
  var remarksInput = $("#remarksInput");

  // event listener for the submit button
  $(document).on("submit", "#saleAddForm", handleSaleFormSubmit);

  // variable to hold customer's initial total points
  var initialPoints;

  // funcion to retrieve the corresponding customer's data
  function getCustomerData(customer) {
    customerId = customer || "";
    if (customerId) {
      customerId = customerId;
    }
    $.get("/customers/" + customerId, function (data) {
      initialPoints = data.totalPoints;
      console.log("Customer", data);
      return initialPoints;
    });
  }

  // function to automatically turn input into one with 2 decimal places
  saleAmountInput.blur(function () {
    var num = parseFloat($(this).val());
    var cleanNum = num.toFixed(2);
    $(this).val(cleanNum);
  });

  accReceivableInput.blur(function() {
    var num = parseFloat($(this).val())
    var cleanNum = num.toFixed(2)
    $(this).val(cleanNum)
  })

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

  // function to handle sale form submission
  function handleSaleFormSubmit(event) {
    event.preventDefault();
    // if any of the required fields are missing, alert and terminate function
    // if (
    //   !originInput.val().trim().trim() ||
    //   !depDetailsInput.val().trim().trim() ||
    //   !depDateInput.val().trim().trim() ||
    //   !destinationInput.val().trim().trim() ||
    //   !arrivalDetailsInput.val().trim().trim() ||
    //   !arrivalDateInput.val().trim().trim()
    // ) {
    //   alert("You are missing a required field!");
    //   return;
    // } else {
    // otherwise...
    // set variable for the id of the customer the sale belongs to
    customerId = window.location.search.split("=")[1];
    // console.log(customerId)

    console.log("customerId", customerId);
    console.log("initial points", initialPoints);

    // convert points data from both the customer's original value
    // we originally got, and the newly added sale's point value
    // to numbers to perform mathmatic equation on them
    var startingPoints = parseInt(initialPoints);
    var earnedPoints = parseInt(pointsInput.val().trim());
    // console.log("old points", startingPoints);
    // console.log("earned points", earnedPoints);

    // perform the addition, and then reconvert the value back
    // to a string to be sent to database.
    var newPoints = (startingPoints + earnedPoints).toString();
    // console.log("final points", newPoints);

    // creating newSale object to be sent
    var newSale = {
      type: typeInput.val().trim(),
      origin: originInput.val().trim(),
      depDetails: depDetailsInput.val().trim(),
      depDate: depDateInput.val().trim(),
      destination: destinationInput.val().trim(),
      arrivalDetails: arrivalDetailsInput.val().trim(),
      arrivalDate: arrivalDateInput.val().trim(),
      saleAmount: saleAmountInput.val().trim(),
      points: pointsInput.val().trim(),
      accountsReceivable: accReceivableInput.val().trim(),
      notes: notesInput.val().trim(),
      remarks: remarksInput.val().trim(),
      finalPoints: newPoints,
      customerId: customerId,
    };

    // make ajax put call to update the customer's total points with
    // new sale included
    $.ajax({
      method: "PUT",
      url: "/addPoints",
      contentType: "application/json",
      data: JSON.stringify(newSale),
      dataType: "json",
    });

    // make post call and send data in newSale object
    $.post("/sales", newSale).then(function (data) {
      // alert user of success and send them to the corresponding customer's details page
      alert("Sale added!");
      window.location.href = "/customerDetails?customer_id=" + customerId;
    });
    // }
  }
});
