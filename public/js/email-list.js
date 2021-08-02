$(document).ready(function () {
  // event listener to handle when copy button is clicked
  $(document).on("click", "#copyText", handleCopyText);

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

  // run function to get all emails and print
  getEmails();

  // function to get all emails and print
  function getEmails() {
    // request all emails from database
    $.get("/email", function (data) {
      // set up empty array to hold emails
      var emailArr = [];
      // find the value (actual email address) of each email and push to the array
      for (var i = 0; i < data.length; i++) {
        emailArr.push(data[i].email);
      }
      // console.log('"get" array', emailArr)
      // filter the array to get rid of blank emails
      var filteredArr = emailArr.filter((x) => x !== "");
      //   console.log(filteredArr)
      // combine remaining items into one string, separated by ", "
      var joinedArr = filteredArr.join(", ");
      //   console.log(joinedArr)
      // set value of textarea to list all emails
      $("#emailText").val(joinedArr);

      return;
    });
  }

  // function to handle when button is clicked
  function handleCopyText(event) {
    event.preventDefault();
    // setting dom variable
    var text = $("#emailText");
    // selecting all content of "text"
    text.select();
    // execute copy command
    document.execCommand("copy");
    return;
  }
});
