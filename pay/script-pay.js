// Define the ViewModel
function ViewModel() {
  const self = this;
  const maxQuantity = 15;
  const minQuantity = 1;
  self.error = ko.observable("");
  self.cart = ko.observableArray([]);
  self.totalPrice = ko.observable(0);
  self.standardShipping = ko.observable(0.5);
  self.type = ko.observable("takeaway");
  self.isDelivery = function () {
    return self.type() === "delivery";
  };
  self.Log = function () {
    console.log(self.type());
  };
  // self.isDisabledS = ko.observable(true);
  // self.isDisabledA = ko.observable(false);
  self.add = function (i) {
    if (self.cart()[i].quantity() < maxQuantity) {
      self.cart()[i].quantity(self.cart()[i].quantity() + 1);
      self.cart()[i].quantityPure = self.cart()[i].quantity();
      self.totalPrice(
        self.cart().reduce((acc, item) => acc + item.price * item.quantity(), 0)
      );

      ajaxHelper("add-to-cart", "POST", {
        id: self.loggedIn(),
        cart: self.cart(),
      });
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

    ajaxHelper("add-to-cart", "POST", {
      id: self.loggedIn(),
      cart: self.cart(),
    });
  };
  self.valueChange = function (i) {
    if (!self.coffee()[i].quantity()) {
      self.coffee()[i].quantity(minQuantity);
    } else if (!/^\d+$/.test(self.coffee()[i].quantity())) {
      let newval = self.coffee()[i].quantity().replace(/\D/g, "");
      self.coffee()[i].quantity(newval);
    } else if (self.coffee()[i].quantity() > maxQuantity) {
      self.coffee()[i].quantity(maxQuantity);
    } else if (self.coffee()[i].quantity() < minQuantity) {
      self.coffee()[i].quantity(minQuantity);
    }
    self.coffee()[i].quantity(Number(self.coffee()[i].quantity()));
    self.cart()[i].quantityPure = self.cart()[i].quantity();
    ajaxHelper("add-to-cart", "POST", {
      id: self.loggedIn(),
      cart: self.cart(),
    });
    console.log(self.coffee()[i].quantity());
  };

  //* Loads login data
  ajaxHelper("../server/data.json", "GET").done(function (data) {
    self.loggedIn(data.loggedIn);
    self.cart(data.cart);
    if (self.loggedIn() !== null) {
      self.userName(data.accounts[self.loggedIn()].username);
      let cart = data.accounts[self.loggedIn()].cart;
      cart.forEach((item) => {
        item.quantity = ko.observable(item.quantityPure);
      });
      self.cart(data.accounts[self.loggedIn()].cart);
      console.log("Logged in");
    }
    self.totalPrice(
      self.cart().reduce((acc, item) => acc + item.price * item.quantity(), 0)
    );
    console.log(data);
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

  //! if logged in
  self.loggedIn = ko.observable(null);
  self.userName = ko.observable("");
  self.cart = ko.observableArray([]);
  self.logOut = function () {
    ajaxHelper("logout", "POST");
    window.location.href = "index.html";
  };

  self.clearCart = function () {
    console.log("Clearing cart");
    self.cart([]);
    self.totalPrice(0);
    ajaxHelper("add-to-cart", "POST", {
      id: self.loggedIn(),
      cart: self.cart(),
    }).done(function () {
      console.log("Cart cleared");
    });
  };
  self.removeFromCart = function (item) {
    console.log(`Removing ${item.name} from cart`);
    self.cart.remove(item);
    self.totalPrice(
      self.cart().reduce((acc, item) => acc + item.price * item.quantity(), 0)
    );

    ajaxHelper("add-to-cart", "POST", {
      id: self.loggedIn(),
      cart: self.cart(),
    }).done(function () {
      console.log("Removed from cart");
    });
  };
}

$().ready(function () {
  // Create a new instance of the ViewModel and apply bindings
  ko.applyBindings(new ViewModel());
  console.log("ViewModel initialized");
});
