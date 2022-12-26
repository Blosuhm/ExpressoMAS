$().ready(function () {
  function vm() {
    const self = this;
    self.email = ko.observable();
    self.password = ko.observable();
    self.login = function () {
      $.ajax({
        url: "../server/data.json",
        type: "GET",
        contentType: "application/json",
        success: function (data) {
          let user = data.accounts.find(
            (account) => account.email == self.email()
          );
          let index = data.accounts.findIndex(
            (account) => account.email == self.email()
          );

          console.log(user);
          $("#passwordValidation").hide();
          $("#emailValidation").hide();
          if (user) {
            if (user.password == self.password()) {
              console.log("Success");
              $.ajax({
                url: "login",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(index),
                success: function (data) {
                  console.log(data);
                  window.location.href = "../index.html";
                },
              });
            } else {
              $("#passwordValidation").show();
            }
          } else {
            $("#emailValidation").show();
            console.log("User not found");
          }
        },
      });
    };
  }
  ko.applyBindings(new vm());
});
