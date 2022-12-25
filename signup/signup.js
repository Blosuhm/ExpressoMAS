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
          url: "../server/data.json",
          type: "GET",
          contentType: "application/json",
          success: function (data) {
            // check if user is taken or email is taken
            let userTaken = data.accounts.find(
              (account) => account.username == self.username()
            );

            let emailTaken = data.accounts.find(
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
                window.location.href = "../login/login.html";
              },
            });
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
