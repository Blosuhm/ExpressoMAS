$(document).ready(function () {
  // Define the ViewModel
  function vm() {
    console.log("ViewModel initiated...");
    //---Variáveis locais
    const self = this;
    console.log(localStorage.getItem("data"));
    self.Coffee = ko.observableArray();
    $.ajax({
      url: "../coffee_data.json",
      dataType: "json",
      type: "GET",
      success: function (data) {
        console.log(data);
        // Store the data in the view model
        self.Coffee(data.coffees[localStorage.getItem("data")]);
        console.log(data.coffees[localStorage.getItem("data")]);
      },
    });
  }
  // Create a new instance of the ViewModel and apply bindings
  ko.applyBindings(new vm());
});
