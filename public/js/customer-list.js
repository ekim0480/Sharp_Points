$(document).ready(function () {
  // Getting references to the customer container, as well as the table body
  var customerList = $("tbody");
  var customerContainer = $("#customer-container");

  // set up global variable to hold user's admin status
  var hasAdmin;

  // click event listener for customer delete button
  $(document).on("click", "#deleteCustomer", handleCustomerDelete);
  $(document).on("click", "#showAllBtn", handleShowAll);

  // function to get user data, more specifically, see if they have admin
  // we use async function to wait for user data first to see if they have admin
  // so we can render our page accordingly, async would not be necessary if
  // we didn't need to render certain things depending on admin status
  // we do not need async here, look to customer details for async usage
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

  // getting initial list of customers
  getCustomers();

  // Function for retrieving customers and getting them ready to be rendered to the page
  function getCustomers() {
    // retrieve user data to see if they have admin
    // getUser().then(function () {
    $.get("/customers", function (data) {
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createCustomerRow(data[i]));
      }
      renderCustomerList(rowsToAdd);
    });
    // });
  }

  // Function for creating a new list row for customers
  function createCustomerRow(customerData) {
    // console.log(customerData);
    var newTr = $("<tr>");

    newTr.data("customer", customerData);
    // fancytables plugin was screwing up tr data storage above somehow
    // thus the delete button wasn't working.  workaround by including ID
    // as a hidden column and referring to it that way.
    newTr.append("<td class='tableHeadId'>" + customerData.id + "</td>");
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

  // A function for rendering the list of customers to the page
  function renderCustomerList(rows) {
    customerList.children().not(":last").remove();
    customerContainer.children(".alert").remove();
    if (rows.length) {
      //   console.log(rows);
      customerList.prepend(rows);

      // table pagination
      $("#customerTable").fancyTable({
        sortColumn: 1,
        sortable: false,
        pagination: true,
        paginationClass: "btn btn-link",
        perPage: 10,
        globalSearch: true,
        // name column is technically column 2 due to hidden id column
        // and last 2 columns are view/delete links.  3rd column is phone
        // leaving only name search.
        globalSearchExcludeColumns: [1, 3, 4, 5],
        inputPlaceholder: "Search by Name...",
        // upon initialization and any action regarding fancyTable,
        // prepend our custom show all button to the footer, in line
        // with all the pagination.
        onUpdate: function () {
          $("tfoot td").prepend(
            "<a style='margin: 0.2em; cursor: pointer' class='btn btn-link' id='showAllBtn'>Show All</a>"
          );
        },
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
    // empty all table body content
    $("#customerTable tbody").empty();
    // remove table footer which contains pagination
    $("tfoot").remove();

    var alertDiv = $("<div>");
    var showAllDiv = $("<div id='showAllDiv'>");
    // removing divs in case user clicks search again, without this new alert divs would keep appearing.
    $(".alert").remove();
    $("#showAllDiv").remove();
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
    customerContainer.append(showAllDiv);
    // this link will take us to a addCustomer page, but the url will include
    // the phone number user initially searched for, so we can take it and
    // pre insert it into the form
    $("#noMatchesLink").attr("href", "/addCustomer?phone=" + searchedString);
    // appending a div at the end to imitate the normal t.footer which
    // contains the pagination.  This will have only the show all link
    // so the user can repopulate the table without having to refresh the
    // entire page
    $("#showAllDiv").append(
      "<a style='margin: 0.2em; cursor: pointer' class='btn btn-link' id='showAllBtn'>Show All</a>"
    );
  }

  // function to handle show all link
  function handleShowAll() {
    // clear table contents
    $("#customerTable tbody").empty();
    // remove search row as it will render again
    $(".fancySearchRow").remove();
    // same with showAllDiv if it was present
    $("#showAllDiv").remove();
    // rerun function to get all data from server and render
    getCustomers();
  }

  // Function for handling search
  $("#customerSearchForm").on("submit", function (event) {
    event.preventDefault();
    var phoneInput = $("#phoneSearchInput").val();
    var queryURL = "/search?phone=" + phoneInput;
    $.ajax({
      url: queryURL,
      method: "GET",
    })
      .then(function (data) {
        if (data === null) {
          renderNoMatch();
        } else {
          var rowsToAdd = [];
          $("#customerTable tbody").empty();
          rowsToAdd.push(createCustomerRow(data));
          renderCustomerList(rowsToAdd);
        }
      })
      .then(function () {
        // remove search and pagination rows
        $(".fancySearchRow").remove();
        $(".pag").remove();
        $("tfoot tr").append(
          "<a style='margin: 0.2em; cursor: pointer' class='btn btn-link' id='showAllBtn'>Show All</a>"
        );
      });
  });

  // Function for handling delete
  function handleCustomerDelete() {
    // workaround for getting customer id to delete, since fancyTables
    // was somehow messing with $data storage.  Retreiving customer's id
    // from hidden id column.

    // grabbing customer id from the hidden column
    var id = $(this).parent("td").parent("tr").children("td:first").text();
    // console.log(id)
    var confirmDelete = confirm("Confirm delete of customer?");
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
