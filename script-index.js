$(document).ready(function () {
  // Define the ViewModel
  function vm() {
    const self = this;
    self.coffees = ko.observableArray([]);
    self.saveData = function (id) {
      // Save the id to local storage
      localStorage.setItem("purchaseItem", id);
      window.location = "pay/pay.html";
    };

    $.ajax({
      url: "coffee_data.json",
      dataType: "json",
      type: "GET",
      success: function (data) {
        console.log(data);
        // Store the data in the view model
        self.coffees(data.coffees);
        console.log(data.coffees);
      },
    });

    // if logged in
    self.loggedIn = ko.observable(null);
    self.userName = ko.observable("");
    self.cart = ko.observableArray([]);
    self.logOut = function () {
      $.ajax({
        url: "logout",
        type: "POST",
        contentType: "application/json",
        success: function (data) {
          window.location.href = "index.html";
        },
      });
    };

    $.ajax({
      url: "server/data.json",
      type: "GET",
      contentType: "application/json",
      success: function (data) {
        self.loggedIn(data.loggedIn);
        self.cart(data.cart);
        if (self.loggedIn() != null) {
          self.userName(data.accounts[self.loggedIn()].username);
          self.cart(data.accounts[self.loggedIn()].cart);
          console.log("Logged in");
        }
        console.log(data);
      },
    });
  }
  ko.applyBindings(new vm());

  $(window).scroll(function () {
    if ($(this).scrollTop() != 0) {
      $("#navbar").addClass("active");
    } else {
      $("#navbar").removeClass("active");
    }
  });
});
