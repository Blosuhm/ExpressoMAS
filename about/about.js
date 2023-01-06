function ViewModel() {
  const self = this;
  self.accounts = JSON.parse(localStorage.getItem("accounts"));
  self.userName = ko.observable("");
  self.loggedIn = ko.observable(JSON.parse(localStorage.getItem("loggedIn")));
  self.cart = ko.observableArray([]);
  self.totalPrice = ko.observable(0);

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

    self.accounts[self.loggedIn()].cart = self.cart();
    localStorage.setItem("accounts", JSON.stringify(self.accounts));

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

    self.accounts[self.loggedIn()].cart = self.cart();
    localStorage.setItem("accounts", JSON.stringify(self.accounts));
  };

  //* Quantity functions
  self.add = function (i) {
    if (self.cart()[i].quantity() < maxQuantity) {
      self.cart()[i].quantity(self.cart()[i].quantity() + 1);
      self.cart()[i].quantityPure = self.cart()[i].quantity();
      self.totalPrice(
        self.cart().reduce((acc, item) => acc + item.price * item.quantity(), 0)
      );

      self.accounts[self.loggedIn()].cart = self.cart();
      localStorage.setItem("accounts", JSON.stringify(self.accounts));
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

    self.accounts[self.loggedIn()].cart = self.cart();
    localStorage.setItem("accounts", JSON.stringify(self.accounts));
  };
  //* End Quantity and Cart functions
  //* Login and Logout
  self.loggedIn(JSON.parse(localStorage.getItem("loggedIn")));
  console.log("initial cart", JSON.parse(localStorage.getItem("cart")));
  self.cart(JSON.parse(localStorage.getItem("cart")));
  self.cart().forEach((item) => {
    item.quantity = ko.observable(item.quantityPure);
  });
  console.log(self.loggedIn());
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

$(function () {
  console.log("ViewModel initiated");
  ko.applyBindings(new ViewModel());
});
