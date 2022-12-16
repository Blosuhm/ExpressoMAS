$(document).ready(function () {
  // Define the ViewModel
  function vm() {
    console.log("ViewModel initiated...");
    //---Variáveis locais
    const self = this;
    self.Coffees = ko.observableArray([]);
    SaveData = function (id) {
      // Save the id to local storage
      localStorage.setItem("data", id);
      console.log(localStorage.getItem("data"));
      window.location = "pay/pay.html";
    };
    $.ajax({
      url: "coffee_data.json",
      dataType: "json",
      type: "GET",
      success: function (data) {
        console.log(data);
        // Store the data in the view model
        self.Coffees(data.coffees);
        console.log(data.coffees);
      },
    });
  }
  // Create a new instance of the ViewModel and apply bindings
  ko.applyBindings(new vm());

  // Open and close sidebar
  $("#openNav").click(openNav);
  function openNav() {
    $("#sidebar").removeClass("d-none");
    $("#nothing").removeClass("d-none");
    $("html").css("overflow-y", "hidden");
  }

  $("#nothing").click(function () {
    $("#sidebar").addClass("d-none");
    $("#nothing").addClass("d-none");
    $("html").css("overflow-y", "scroll");
  });
});
