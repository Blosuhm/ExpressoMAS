$(document).ready(function () {
  const maxQuantity = 15;
  const minQuantity = 1;

  // Define the ViewModel

  function vm() {
    let self = this;
    self.temp = ko.observableArray([]);
    self.coffee = ko.observableArray([]);
    self.isDisabledS = ko.observable(true);
    self.isDisabledA = ko.observable(false);
    self.add = function (i) {
      if (self.coffee()[i].quantity() < maxQuantity) {
        self.coffee()[i].quantity(self.coffee()[i].quantity() + 1);
      }
      self.coffee.valueHasMutated();
      console.log(self.coffee());
    };
    self.subtract = function (i) {
      if (self.coffee()[i].quantity() > minQuantity) {
        self.coffee()[i].quantity(self.coffee()[i].quantity() - 1);
      }
      self.coffee.valueHasMutated();
      console.log(self.coffee());
    };
    self.valueChange = function (i) {
      if (self.coffee()[i].quantity() > maxQuantity) {
        self.coffee()[i].quantity(maxQuantity);
      } else if (self.coffee()[i].quantity() < minQuantity) {
        self.coffee()[i].quantity(minQuantity);
      }

      if (self.coffee()[i].quantity() >= maxQuantity) {
        self.isDisabledA(true);
      } else {
        self.isDisabledA(false);
      }

      if (self.coffee()[i].quantity() <= minQuantity) {
        self.isDisabledS(true);
      } else {
        self.isDisabledS(false);
      }
      self.coffee()[i].quantity(Number(self.coffee()[i].quantity()));
      console.log("changed");
      console.log(self.coffee()[i].quantity());
    };

    $.ajax({
      url: "../coffee_data.json",
      dataType: "json",
      type: "GET",
      success: function (data) {
        // Store the data in the view model
        //vm.coffee(data.coffees[localStorage.getItem("purchaseItem")]);
        //console.log(data.coffees[localStorage.getItem("purchaseItem")]);
        self.temp = ko.mapping.fromJS(data.coffees);
        self.coffee(self.temp());
      },
    });
  }

  // Create a new instance of the ViewModel and apply bindings
  ko.applyBindings(vm);

  $("#orderType").change(function () {
    if ($(this).val() == "delivery") {
      $("#deliveryInfo").show();
    } else {
      $("#deliveryInfo").hide();
    }
  });
});
