// Define the ViewModel
function ViewModel() {
  const self = this;
  self.error = ko.observable("");
  self.coffees = ko.observableArray([]);
  self.saveData = function (id) {
    // Save the id to local storage
    localStorage.setItem("purchaseItem", id);
    window.location = "pay/pay.html";
  };

  ajaxHelper("coffee-data.json", "GET").done(function (data) {
    console.log(data);
    // Modify the data
    data.coffees.forEach((item) => {
      item.photo = `images/capsule-banner/${removeDiacritics(item.name)
        .split(" ")
        .join("-")
        .toLowerCase()}.png`;
      item.image = `images/capsule-picture/${removeDiacritics(item.name)
        .split(" ")
        .join("-")
        .toLowerCase()}.png`;
    });

    // Store the data in the view model
    self.coffees(data.coffees);
    console.log(data.coffees);
  });

  //* Iternal functions
  function ajaxHelper(uri, method, data) {
    self.error(""); // Clear error message
    return $.ajax({
      type: method,
      url: uri,
      dataType: "json",
      contentType: "application/json",
      data: data ? JSON.stringify(data) : null,
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("AJAX Call[" + uri + "] Fail...");
        hideLoading();
        self.error(errorThrown);
      },
    });
  }

  function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  //! if logged in
  self.loggedIn = ko.observable(null);
  self.userName = ko.observable("");
  self.cart = ko.observableArray([]);
  self.logOut = function () {
    ajaxHelper("logout", "POST").done(function () {
      window.location.href = "index.html";
    });
  };

  ajaxHelper("server/data.json", "GET").done(function (data) {
    self.loggedIn(data.loggedIn);
    self.cart(data.cart);
    if (self.loggedIn() != null) {
      self.userName(data.accounts[self.loggedIn()].username);
      self.cart(data.accounts[self.loggedIn()].cart);
      console.log("Logged in");
    }
    console.log(data);
  });
}

$().ready(function () {
  ko.applyBindings(new ViewModel());
  console.log("ViewModel applied");

  $(window).scroll(function () {
    if ($(this).scrollTop() != 0) {
      $("#navbar").addClass("active");
    } else {
      $("#navbar").removeClass("active");
    }
  });
});
