$(document).ready(function () {
  // Define the ViewModel
  let vm = {
    coffees: ko.observableArray([]),
    saveData: function (id) {
      // Save the id to local storage
      localStorage.setItem("purchaseItem", id);
      window.location = "pay/pay.html";
    },
  };
  $.ajax({
    url: "coffee_data.json",
    dataType: "json",
    type: "GET",
    success: function (data) {
      console.log(data);
      // Store the data in the view model
      vm.coffees(data.coffees);
      console.log(data.coffees);
    },
  });

  ko.applyBindings(vm);

  $(window).scroll(function () {
    if ($(this).scrollTop() != 0) {
      $("#navbar").addClass("active");
    } else {
      $("#navbar").removeClass("active");
    }
  });
});
