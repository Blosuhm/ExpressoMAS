function ViewModel() {
  const self = this;
  self.email = ko.observable();
  self.password = ko.observable();
  self.accounts = ko.observableArray(
    JSON.stringify(localStorage.getItem("accounts"))
  );
  self.login = function () {
    let user = self.accounts.find((account) => account.email == self.email());
    let index = self.accounts.findIndex(
      (account) => account.email == self.email()
    );

    console.log(user);
    $("#passwordValidation").hide();
    $("#emailValidation").hide();
    if (user) {
      if (user.password === self.password()) {
        console.log("Success");
        localStorage.setItem("loggedIn", JSON.stringify(index));
        window.location.href = "../index.html";
      } else {
        $("#passwordValidation").show();
      }
    } else {
      $("#emailValidation").show();
      console.log("User not found");
    }
  };
}

$().ready(function () {
  ko.applyBindings(new ViewModel());
});
