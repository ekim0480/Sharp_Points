$(document).ready(function () {
  // Getting references to the customer container, as well as the table body
  var customerList = $("tbody");
  var customerContainer = $("#customer-container");

  // Getting initial list of customers
  getCustomers();

  // click event listener for customer delete button
  $(document).on("click", "#deleteCustomer", handleCustomerDelete);

  // Function for creating a new list row for customers
  function createCustomerRow(customerData) {
    // console.log(customerData);
    var newTr = $("<tr>");
    newTr.data("customer", customerData);
    newTr.append(
      "<td>" + customerData.lastName + ", " + customerData.firstName + "</td>"
    );
    newTr.append("<td>" + customerData.phone + "</td>");
    // newTr.append("<td><a href='/customer-add" + customerData.id + "'>Add Sale</a></td>");
    newTr.append(
      "<td><a href='/customerDetails?customer_id=" +
        customerData.id +
        "'>View Details/Sales</a></td>"
    );
    newTr.append(
      "<td><a style='cursor:pointer;color:red' id='deleteCustomer'>Delete Customer</a></td>"
    );
    return newTr;
  }

  // Function for retrieving customers and getting them ready to be rendered to the page
  function getCustomers() {
    $.get("/customers", function (data) {
      var rowsToAdd = [];
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createCustomerRow(data[i]));
      }
      renderCustomerList(rowsToAdd);
    });
  }

  // A function for rendering the list of customers to the page
  function renderCustomerList(rows) {
    customerList.children().not(":last").remove();
    customerContainer.children(".alert").remove();
    if (rows.length) {
      //   console.log(rows);
      customerList.prepend(rows);

      // table pagination
      $("#customerTable").fancyTable({
        sortColumn: 0,
        pagination: true,
        perPage: 10,
        searchable: false,
      });
    } else {
      renderEmpty();
    }
  }

  // Function for handling what to render when there are no customers
  function renderEmpty() {
    var alertDiv = $("<div>");
    alertDiv.addClass("alert alert-danger");
    alertDiv.text("You must create a customer before you can create a sale.");
    customerContainer.append(alertDiv);
  }

  // function to render div with text when search finds no matches.
  function renderNoMatch() {
    $("#nav").remove();
    $("#customerTable tbody").empty();
    var alertDiv = $("<div>");
    // save searched string to use to use in url should the user click
    // the link to add as a new customer
    var searchedString = $("#phoneSearchInput").val().trim();
    alertDiv.addClass("alert alert-danger");
    // display this message if no matches are found, includes a link which,
    // if clicked, will lead to the addCustomer page, with the searched
    // phone number in the url so we can pre-insert it into the form.
    alertDiv.html(
      "No matches found!  Click " +
        "<a id='noMatchesLink'>" +
        "here" +
        "</a>" +
        " to add as a new customer."
    );
    customerContainer.append(alertDiv);
    $("#noMatchesLink").attr("href", "/addCustomer?phone=" + searchedString);
  }

  // Function for handling search
  $("#customerSearchForm").on("submit", function (event) {
    event.preventDefault();
    var phoneInput = $("#phoneSearchInput").val();
    var queryURL = "/search?phone=" + phoneInput;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (data) {
      if (data === null) {
        renderNoMatch();
      } else {
        var rowsToAdd = [];
        $("#nav").remove();
        $("#customerTable tbody").empty();
        rowsToAdd.push(createCustomerRow(data));
        renderCustomerList(rowsToAdd);
      }
    });
  });

  // Function for handling delete
  function handleCustomerDelete() {
    var listItemData = $(this).parent("td").parent("tr").data("customer");
    var id = listItemData.id;
    var confirmDelete = confirm(
      "Confirm delete of customer: " +
        listItemData.lastName +
        ", " +
        listItemData.firstName +
        "?"
    );
    if (confirmDelete) {
      $.ajax({
        method: "DELETE",
        url: "/customers/" + id,
      }).then(function () {
        location.reload();
      });
    }
  }
});
