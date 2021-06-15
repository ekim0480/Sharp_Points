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
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createCustomerRow(data[i]));
      }
      renderCustomerList(rowsToAdd);
      //   nameInput.val("");
    });
  }

  // A function for rendering the list of customers to the page
  function renderCustomerList(rows) {
    customerList.children().not(":last").remove();
    customerContainer.children(".alert").remove();
    if (rows.length) {
      //   console.log(rows);
      customerList.prepend(rows);
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
        alert("No matching phone number found!");
      } else {
        var rowsToAdd = [];
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
