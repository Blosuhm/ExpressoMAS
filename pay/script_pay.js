$(document).ready(function () {
  const maxQuantity = 15;
  const minQuantity = 1;

  // Define the ViewModel

  function vm() {
    let self = this;
    self.coffee = ko.observableArray([]);

    self.add = function (i) {
      if (self.coffee[i].quantity < maxQuantity) {
        self.coffee[i].quantity += 1;
      }
    };
    self.subtract = function (i) {
      if (self.coffee[i].quantity > minQuantity) {
        self.coffee[i].quantity -= 1;
      }
    };
    $.ajax({
      url: "../coffee_data.json",
      dataType: "json",
      type: "GET",
      success: function (data) {
        // Store the data in the view model
        //vm.coffee(data.coffees[localStorage.getItem("purchaseItem")]);
        //console.log(data.coffees[localStorage.getItem("purchaseItem")]);
        self.coffee(data.coffees);
      },
    });
  }

  // Create a new instance of the ViewModel and apply bindings
  ko.applyBindings(new vm());

  $("#orderType").change(function () {
    if ($(this).val() == "delivery") {
      $("#deliveryInfo").show();
    } else {
      $("#deliveryInfo").hide();
    }
  });

  /*$("ul#cartList").on("click", "button.add", function () {
    // Get the quantity
    let quantity = parseInt($(this).siblings("input").val());
    if (quantity < maxQuantity) {
      // Update quantity
      $(this)
        .siblings("input")
        .val(quantity + 1);
    }
  });

  $("ul#cartList").on("click", "button.subtract", function () {
    // Get the quantity
    let quantity = parseInt($(this).siblings("input").val());
    if (quantity > minQuantity) {
      // Update quantity
      $(this)
        .siblings("input")
        .val(quantity - 1);
    }
  });*/

  $("ul#cartList").on("click", "div.quantity", function () {
    if ($(this).children("input").val() >= maxQuantity) {
      $(this).children("button.add").prop("disabled", true);
    } else {
      $(this).children("button.add").prop("disabled", false);
    }
    if ($(this).children("input").val() <= minQuantity) {
      $(this).children("button.subtract").prop("disabled", true);
    } else {
      $(this).children("button.subtract").prop("disabled", false);
    }
  });

  $("ul#cartList").on("change", "input", function () {
    console.log("updated");
    if (
      !(
        $.isNumeric($(this).val()) &&
        Number.isInteger(parseFloat($(this).val()))
      )
    ) {
      $(this).val(1);
    } else if ($(this).val() > maxQuantity) {
      $(this).val(maxQuantity);
    } else if ($(this).val() < minQuantity) {
      $(this).val(minQuantity);
    }

    if ($(this).val() >= maxQuantity) {
      $(this).siblings("button.add").prop("disabled", true);
    } else {
      $(this).siblings("button.add").prop("disabled", false);
    }
    if ($(this).val() <= minQuantity) {
      $(this).siblings("button.subtract").prop("disabled", true);
    } else {
      $(this).siblings("button.subtract").prop("disabled", false);
    }
  });
});
