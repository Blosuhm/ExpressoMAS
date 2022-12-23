$().ready(function () {
  const maxQuantity = 15;
  const minQuantity = 1;

  // Define the ViewModel

  function vm() {
    const self = this;

    self.coffee = ko.observableArray([]);
    self.isDisabledS = ko.observable(true);
    self.isDisabledA = ko.observable(false);
    self.add = function (i) {
      if (self.coffee()[i].quantity() < maxQuantity) {
        self.coffee()[i].quantity(self.coffee()[i].quantity() + 1);
      }
      console.log(self.coffee()[i].quantity());
    };
    self.subtract = function (i) {
      if (self.coffee()[i].quantity() > minQuantity) {
        self.coffee()[i].quantity(self.coffee()[i].quantity() - 1);
      }
      console.log(self.coffee()[i].quantity());
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
        const temp = ko.mapping.fromJS(data.coffees);
        self.coffee(temp());
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
