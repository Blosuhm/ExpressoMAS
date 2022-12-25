$().ready(function () {
  function vm() {
    let self = this;
    self.username = ko.observable();
    self.password = ko.observable();
    self.confirmPassword = ko.observable();
    self.email = ko.observable();

    self.submitForm = function () {
      if (validation()) {
        $.ajax({
          url: "signup",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify({
            username: self.username(),
            password: self.password(),
            email: self.email(),
          }),
          success: function (data) {
            console.log("Success");
          },
        });
      }
    };

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

  ko.applyBindings(new vm());
});
