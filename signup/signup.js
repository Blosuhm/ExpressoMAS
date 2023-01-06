if (JSON.parse(localStorage.getItem("loggedIn")) !== null) {
  window.location.href = "../";
}

function ViewModel() {
  const self = this;
  self.username = ko.observable("");
  self.password = ko.observable("");
  self.confirmPassword = ko.observable("");
  self.email = ko.observable("");
  self.accounts = JSON.parse(localStorage.getItem("accounts"));

  self.submitForm = function () {
    if (validation()) {
      // check if user is taken or email is taken
      let userTaken = self.accounts.find(
        (account) => account.username == self.username()
      );

      let emailTaken = self.accounts.find(
        (account) => account.email == self.email()
      );

      if (userTaken) {
        $("#userNameInUse").show();
        return;
      }
      $("#userNameInUse").hide();
      if (emailTaken) {
        $("#emailInUse").show();
        return;
      }
      $("#emailInUse").hide();
      // if not taken, send data to server
      self.accounts.push({
        username: self.username(),
        password: self.password(),
        email: self.email(),
        cart: [],
      });
      localStorage.setItem("accounts", JSON.stringify(self.accounts));
      console.log("Success");
      window.location.href = "../login/login.html";
    }
  };

  //* Validation functions

  function validateUserName() {
    if (!self.username() || self.username().length < 3) {
      $("#userNameValidation").show();
      return false;
    }

    $("#userNameValidation").hide();
    return true;
  }
  function validateEmail() {
    if (
      !self.email() ||
      !self.email().includes("@") ||
      self.email().length < 4
    ) {
      $("#emailValidation").show();
      return false;
    }
    $("#emailValidation").hide();

    return true;
  }
  function validatePassword() {
    if (!self.password() || self.password().length < 8) {
      $("#passwordValidation").show();
      return false;
    }
    $("#passwordValidation").hide();
    return true;
  }
  function validateConfirmPassword() {
    if (
      (validatePassword() && !self.confirmPassword()) ||
      self.password() != self.confirmPassword()
    ) {
      $("#confirmPasswordValidation").show();
      return false;
    }
    $("#confirmPasswordValidation").hide();
    return true;
  }
  function validation() {
    return [
      validateUserName(),
      validateEmail(),
      validatePassword(),
      validateConfirmPassword(),
    ].every(function (value) {
      return value;
    });
  }
}

$().ready(function () {
  console.log("ViewModel loaded");
  ko.applyBindings(new ViewModel());
});
