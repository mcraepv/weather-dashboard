$(document).ready(function () {
  var city;
  var apiKey = "8068c24e41107ad9fbda7d1bc1a904ed";
  var todayURL;

  $(".btn").on("click", function (event) {
    event.preventDefault();
    weatherSearch();
  });

  //initial search function
  function weatherSearch() {
    city = $("#searchBar").val();
    addToSidebar();
    addToMain();
  }

  function addToSidebar() {
    var newList = $("<li>").addClass("list-group-item");
    newList.attr("id", "listItem");
    var searchList = $("#searchList");
    newList.text(city);
    searchList.prepend(newList);
    // saveListItems();
  }

  function addToMain() {
    var todayURL =
      "http://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial" +
      "&appid=" +
      apiKey;
    $.ajax({
      url: todayURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      var header = $("<h2>");
      header.addClass("text-center");
      var d = new Date();
      header.text(
        city + " " + d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear()
      );
      var temp = $("<p>").text("Temperature: " + response.main.temp + "\xB0F");
      temp.addClass("text-center", "my-1");
      var humid = $("<p>").text("Humidity: " + response.main.humidity + "%");
      humid.addClass("text-center", "my-1");
      var wind = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");
      wind.addClass("text-center", "my-1");
      $("#today").append(header, temp, humid, wind);
      var lat = response.coord.lat;
      var lon = response.coord.lon;
      var uvURL =
        "http://api.openweathermap.org/data/2.5/uvi?appid=" +
        apiKey +
        "&lat=" +
        lat +
        "&lon=" +
        lon;
      $.ajax({
        url: uvURL,
        method: "GET",
      }).then(function (uvResponse) {
        console.log(uvResponse);
        var uv = parseInt(uvResponse.value);
        var uvText = $("<mark>").text(uv);
        if (uv <= 2) {
          uvText.attr("id", "low");
        } else if (uv >= 3 && uv <= 5) {
          uvText.attr("id", "moderate");
        } else if (uv >= 6 && uv <= 7) {
          uvText.attr("id", "high");
        } else if (uv > 8) {
          uvText.attr("id", "very-high");
        }
        var uvEl = $("<p>").text("UV Index: ");
        uvEl.addClass("text-center", "my-1");
        uvEl.append(uvText);
        $("#today").append(uvEl);
        var fiveDayURL =
          "http://api.openweathermap.org/data/2.5/forecast?q=" +
          city +
          "&units=imperial" +
          "&appid=" +
          apiKey;
        $.ajax({
          url: fiveDayURL,
          method: "GET",
        }).then(function (fiveResponse) {
          console.log(fiveResponse);
          var len = fiveResponse.list.length;
          for (var i = 2; i < len; i += 8) {
            console.log(fiveResponse.list[i]);
            var thisFWD = fiveResponse.list[i];
            var fwdCard = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
            var date = thisFWD.dt_txt.split(" ");
            var dateEl = $("<h4>").text(date[0]);
            var tempEl = $("<p>").text(
              "Temperature: " + thisFWD.main.temp + "\xB0F"
            );
            var humidEl = $("<p>").text(
              "Humidity: " + thisFWD.main.humidity + "%"
            );
            cardBody.append(dateEl, tempEl, humidEl);
            fwdCard.append(cardBody);
            var col = $("<div>");
            col.append(fwdCard);
            $("#fwdForecast").append(col);
          }
        });
      });
    });
  }
});
