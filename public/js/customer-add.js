$(document).ready(function () {
  // declaring DOM variables
  var firstNameInput = $("#firstNameInput");
  var lastNameInput = $("#lastNameInput");
  var dobInput = $("#dobInput");
  var phoneInput = $("#phoneInput");
  var emailInput = $("#emailInput");
  var mileageInput = $("#mileageInput");

  // click event for submit button
  $(document).on("submit", "#customerAddForm", handleCustomerFormSubmit);

  // function to handle add customer form submission
  function handleCustomerFormSubmit(event) {
    event.preventDefault();
    // if any required field is missing, alert
    if (
      !firstNameInput.val().trim().trim() ||
      !lastNameInput.val().trim().trim() ||
      !dobInput.val().trim().trim() ||
      !phoneInput.val().trim().trim()
    ) {
      alert("You are missing a required field!");
      return;
    } else {
      // make a new customer object
      var newCustomer = {
        firstName: firstNameInput.val().trim(),
        lastName: lastNameInput.val().trim(),
        dob: dobInput.val().trim(),
        phone: phoneInput.val().trim(),
        email: emailInput.val().trim(),
        mileage: mileageInput.val().trim(),
      };

      // send an AJAX POST request with jQuery
      $.post("/customers", newCustomer)
        // on success, run this callback
        .then(function (data) {
          // log the data we found
          // console.log(data);
          // tell user customer was added
          alert("Customer added!");
        });
    }

    // clear form content
    $("#firstNameInput").val("");
    $("#lastNameInput").val("");
    $("#dobInput").val("");
    $("#phoneInput").val("");
    $("#emailInput").val("");
    $("#mileageInput").val("");
  }
});
