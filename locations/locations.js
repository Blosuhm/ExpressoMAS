function ViewModel() {
  const self = this;
  self.error = ko.observable("");
  self.locations = ko.observableArray([]);

  ajaxHelper("../coffee-data.json", "GET").done(function (data) {
    let locations = data.locations;
    locations.forEach((item) => {
      item.image = `../images/locations/${removeSpecialCharacters(
        removeDiacritics(item.name)
      )
        .split(" ")
        .join("-")
        .toLowerCase()}.png`;
    });
    self.locations(locations);
  });

  //* Internal Functions
  function ajaxHelper(uri, method, data) {
    self.error(""); // Clear error message
    return $.ajax({
      type: method,
      url: uri,
      dataType: "json",
      contentType: "application/json",
      data: data ? JSON.stringify(data) : null,
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("AJAX Call[" + uri + "] Fail...");
        self.error(errorThrown);
      },
    });
  }

  function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function removeSpecialCharacters(str) {
    return str.normalize("NFD").replace(/[^\w\s]/gi, "");
  }

  //* End Internal Functions
}

$(function () {
  console.log("ViewModel loaded");
  ko.applyBindings(new ViewModel());
});
