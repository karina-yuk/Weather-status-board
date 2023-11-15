// Declare global variables for city, temperature, etc
var city;
var temperature;
var wind;
var humidity;

// Array to store timestamp offsets for 5 day forecast
var timeStamp = [6, 14, 22, 30, 38];

// Function to clear weather card

function clear() {
  // Clear contents of all future weather card elements
  $(".future-weather-card").empty();
}

// Function to fetch API data and display weather info

function fetchWeather(geoAPI) {
  // Declare variables to store latitude and longitude
  var latitude;
  var longitude;

  // Fetch geographic coordinate data from API
  fetch(geoAPI)
    .then(function (geoCode) {
      // Return geographic data as JSON
      return geoCode.json();
    })
    .then(function (geoCode) {
      //log returned data
      console.log(geoCode);
      //set latitude and longitude variables
      latitude = Number(geoCode[0].lat);
      longitude = Number(geoCode[0].lon);
      // Construct API URL with coordinates
      var weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=0d65026d9cfca54d99c9baa64c87a051`;
      // Fetch weather data from API
      fetch(weatherAPI)
        .then(function (weather) {
          return weather.json();
        })
        .then(function (weather) {
          console.log(weather);
          city = weather.city.name;
          temperature = weather.list[0].main.feels_like;
          wind = weather.list[0].wind.speed;
          humidity = weather.list[0].main.humidity;
          code = weather.list[0].weather[0].icon;

          var iconLink = `https://openweathermap.org/img/wn/${code}@2x.png`;
          var weatherIcon = $("<img />");
          weatherIcon.attr("src", iconLink);

          $(`#city`).text(`${city} (${dayjs().format("M/D/YYYY")})`);
          $(`.main-img`).append(weatherIcon);
          $(`#temperature`).text(`${temperature} ºC`);
          $(`#wind`).text(`${wind} MPH`);
          $(`#humidity`).text(`${humidity} %`);

          for (var i = 0; i < timeStamp.length; i++) {
            // Add Date
            var dateEl = $("<h3></h3>");
            var date = dayjs()
              .add(i + 1, "d")
              .format("M/D/YYYY");
            dateEl.text(date);
            $(`#day-${i}`).append(dateEl);

            // Add icon
            var weatherIcon = $("<img />");
            weatherIcon.attr("src", iconLink);
            $(`#day-${i}`).append(weatherIcon);

            // Add temp
            var tempEl = $("<h3></h3>");
            var temperature = weather.list[timeStamp[i]].main.feels_like;
            tempEl.text(`Temperature: ${temperature} ºC`);
            $(`#day-${i}`).append(tempEl);

            // Add Wind
            var windEl = $("<h3></h3>");
            var wind = weather.list[timeStamp[i]].wind.speed;
            windEl.text(`Wind: ${wind} MPH`);
            $(`#day-${i}`).append(windEl);

            // Add Humidity
            var humidityEl = $("<h3></h3>");
            var humidity = weather.list[timeStamp[i]].main.humidity;
            humidityEl.text(`Wind: ${humidity} MPH`);
            $(`#day-${i}`).append(humidityEl);
          }
        });
    });
}

// Function to add previously add previously selected cities into search list

function addHistory() {
  if (localStorage.getItem("city") != null) {
    var historyList = JSON.parse(localStorage.getItem("city"));
    for (var i = 0; i < historyList.length; i++) {
      var prevBtn = $("<button></button>");
      prevBtn.addClass("history-city");
      prevBtn.text(historyList[i]);
      prevBtn.attr("id", historyList[i]);
      $(".search-history").append(prevBtn);
    }
  }
}

// Function to add to local storage

function addCity(city) {
  var prevBtn = $("<button></button>");
  prevBtn.attr("id", city);
  prevBtn.addClass("history-city");
  prevBtn.text(city);
  $(".search-history").append(prevBtn);

  if (localStorage.getItem("city") === null) {
    var cityList = [];
    cityList.push(city);
    localStorage.setItem("city", JSON.stringify(cityList));
  } else {
    var currentList = JSON.parse(localStorage.getItem("city"));
    currentList.push(city);
    localStorage.setItem("city", JSON.stringify(currentList));
  }
}

addHistory();

$(".search-btn").click(function (event) {
  clear();
  city = $("#enterCity").val();

  var geoCodeAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=0d65026d9cfca54d99c9baa64c87a051`;

  fetchWeather(geoCodeAPI);

  addCity(city);
  $("#enterCity").val("");
});

$(".search-history").click(function (event) {
  clear();
  var cityClass = event.target.id;
  console.log(cityClass);

  var geoCodeAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${cityClass}&appid=0d65026d9cfca54d99c9baa64c87a051`;

  fetchWeather(geoCodeAPI);
});

// Clear button element
const clearBtn = document.getElementById("clear-btn");

// Function to clear search history
function clearHistory() {
  // Clear search history buttons
  $(".search-history").empty();

  // Clear local storage
  localStorage.removeItem("city");
}

// Add click event listener to clear button
clearBtn.addEventListener("click", clearHistory);
