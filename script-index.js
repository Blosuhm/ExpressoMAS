// Define the ViewModel
function ViewModel() {
  const self = this;
  const maxQuantity = 15;
  const minQuantity = 1;
  self.error = ko.observable("");
  self.coffees = ko.observableArray([]);

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
        self.error(errorThrown);
      },
    });
  }

  function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  //* End Internal Functions

  if (!localStorage.getItem("preload-first-time")) {
    localStorage.setItem("preload-first-time", true);
    localStorage.setItem("loggedIn", 0);
    localStorage.setItem("cart", JSON.stringify([]));
    ajaxHelper("coffee-data.json", "GET").done(function (data) {
      localStorage.setItem("accounts", JSON.stringify(data.accounts));
      location.reload();
    });
  }
  self.loggedIn = ko.observable(null);
  self.userName = ko.observable("");
  self.cart = ko.observableArray([]);
  self.totalPrice = ko.observable(0);
  self.accounts = JSON.parse(localStorage.getItem("accounts")) || [];

  //! If logged in
  //* Cart functions
  self.addToCart = function (item) {
    console.log(`Adding ${item.name} to cart`);
    if (self.cart().includes(item)) {
      console.log("Item already in cart");
      return;
    }
    item.quantity = ko.observable(1);
    item.quantityPure = 1;
    self.cart.push(item);
    self.totalPrice(
      self.cart().reduce((acc, item) => acc + item.price * item.quantity(), 0)
    );

    if (self.loggedIn() !== null) {
      self.accounts[self.loggedIn()].cart = self.cart();
      localStorage.setItem("accounts", JSON.stringify(self.accounts));
    } else {
      localStorage.setItem("cart", JSON.stringify(self.cart()));
    }

    console.log(self.cart());
  };
  self.clearCart = function () {
    console.log("Clearing cart");
    self.cart([]);
    self.totalPrice(0);
    self.accounts[self.loggedIn()].cart = self.cart();
    localStorage.setItem("accounts", JSON.stringify(self.accounts));
  };
  self.removeFromCart = function (item) {
    console.log(`Removing ${item.name} from cart`);
    self.cart.remove(item);
    self.totalPrice(
      self.cart().reduce((acc, item) => acc + item.price * item.quantity(), 0)
    );

    if (self.loggedIn() !== null) {
      self.accounts[self.loggedIn()].cart = self.cart();
      localStorage.setItem("accounts", JSON.stringify(self.accounts));
    } else {
      localStorage.setItem("cart", JSON.stringify(self.cart()));
    }
  };

  //* Quantity functions
  self.add = function (i) {
    if (self.cart()[i].quantity() < maxQuantity) {
      self.cart()[i].quantity(self.cart()[i].quantity() + 1);
      self.cart()[i].quantityPure = self.cart()[i].quantity();
      self.totalPrice(
        self.cart().reduce((acc, item) => acc + item.price * item.quantity(), 0)
      );

      if (self.loggedIn() !== null) {
        self.accounts[self.loggedIn()].cart = self.cart();
        localStorage.setItem("accounts", JSON.stringify(self.accounts));
      } else {
        localStorage.setItem("cart", JSON.stringify(self.cart()));
      }
    }
    console.log(self.cart()[i].quantity());
  };
  self.subtract = function (i) {
    if (self.cart()[i].quantity() > minQuantity) {
      self.cart()[i].quantity(self.cart()[i].quantity() - 1);
      self.cart()[i].quantityPure = self.cart()[i].quantity();
      self.totalPrice(
        self.cart().reduce((acc, item) => acc + item.price * item.quantity(), 0)
      );
    }

    if (self.loggedIn() !== null) {
      self.accounts[self.loggedIn()].cart = self.cart();
      localStorage.setItem("accounts", JSON.stringify(self.accounts));
    } else {
      localStorage.setItem("cart", JSON.stringify(self.cart()));
    }
  };
  //* End Quantity and Cart functions

  //* Login and Logout
  self.loggedIn(JSON.parse(localStorage.getItem("loggedIn")));
  console.log("initial cart", JSON.parse(localStorage.getItem("cart")));
  self.cart(JSON.parse(localStorage.getItem("cart")));
  self.cart().forEach((item) => {
    item.quantity = ko.observable(item.quantityPure);
  });
  if (self.loggedIn() !== null) {
    self.userName(self.accounts[self.loggedIn()].username);
    let cart = self.accounts[self.loggedIn()].cart;

    console.log("logged in cart:", cart);
    cart.forEach((item) => {
      item.quantity = ko.observable(item.quantityPure);
    });
    self.cart(cart);
    console.log("Logged in");
  }
  self.totalPrice(
    self.cart().reduce((acc, item) => acc + item.price * item.quantity(), 0)
  );
  self.logOut = function () {
    localStorage.setItem("loggedIn", JSON.stringify(null));
    location.reload();
  };
  //* End Login and Logout
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
