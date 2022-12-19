$(document).ready(function () {
  // Define the ViewModel
  let vm = {
    coffee: ko.observableArray([]),
  };

  $.ajax({
    url: "../coffee_data.json",
    dataType: "json",
    type: "GET",
    success: function (data) {
      // Store the data in the view model
      //vm.coffee(data.coffees[localStorage.getItem("purchaseItem")]);
      //console.log(data.coffees[localStorage.getItem("purchaseItem")]);
      vm.coffee(data.coffees);
    },
  });

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
