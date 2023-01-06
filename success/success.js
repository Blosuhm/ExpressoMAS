if (!JSON.parse(localStorage.getItem("invoice"))) {
  window.location.href = "../";
}

function ViewModel() {
  const self = this;
  self.invoice = ko.observableArray(
    JSON.parse(localStorage.getItem("invoice"))
  );
  self.totalPrice = ko.observable(
    self
      .invoice()
      .reduce((acc, item) => acc + item.price * item.quantityPure, 0)
  );
}

$(function () {
  console.log("ViewModel initialized");
  ko.applyBindings(new ViewModel());
});

$(window).on("beforeunload", function (e) {
  if (performance.navigation.type === 1) {
    return;
  }
  localStorage.setItem("invoice", null);
});
