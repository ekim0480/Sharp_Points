$(document).ready(function () {
  // declaring DOM variables
  var firstNameInput = $("#firstNameInput");
  var lastNameInput = $("#lastNameInput");
  var dobInput = $("#dobInput");
  var phoneInput = $("#phoneInput");
  var emailInput = $("#emailInput");
  var mileageInput = $("#mileageInput");

  // submit event for submit button
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
      if (emailInput == "") {
        emailInput == null;
      }

      // grabbing selected gender value from checked radio button
      var genderInput = "";
      var selectedGender = $("#genderFieldset input[type='radio']:checked");
      if (selectedGender.length > 0) {
        genderInput = selectedGender.val();
      }

      // make a new customer object
      var newCustomer = {
        firstName: firstNameInput.val().trim(),
        lastName: lastNameInput.val().trim(),
        gender: genderInput,
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
          console.log(data);
          // tell user customer was added
          alert("Customer added!");
          window.location.href = "customerDetails?customer_id=" + data.id;
        });
    }

    // clear form content
    // $("#firstNameInput").val("");
    // $("#lastNameInput").val("");
    // $("#dobInput").val("");
    // $("#phoneInput").val("");
    // $("#emailInput").val("");
    // $("#mileageInput").val("");
  }
});
