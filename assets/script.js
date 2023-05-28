//var weatherAPI = "api.openweathermap.org/data/2.5/forecast?lat=" + lat + '&lon=' + lon + '&appid=' + apiKey
//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
//use this to grab 5 day weather value
//var geocodingAPI = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName +'&limit=5&appid=' + apiKey 
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
//use this to grab lat and long based off of city 

var apiKey = "42db8486013a86dadfafb2d6b067bf5a"

var lat;
var lon;

//event listeners
var userFormEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector('#city');
var todayContainerEl = document.querySelector("#today");

var getCityLocation = function (event) {
    event.preventDefault();
    var cityName = cityInputEl.value;

    if (cityName) {
      getLocation(cityName);
  
      todayContainerEl.textContent = '';
      cityInputEl.value = '';
    } else {
      alert('Please enter a name of a city!');
    }
};

var getLocation = function (cityName) {
    var geocodingAPI = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName +'&limit=1&appid=' + apiKey
  
    fetch(geocodingAPI)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);
            
            lat = data[0].lat;
            lon = data[0].lon;

            console.log(lat);
            console.log(lon);

            //getWeatherForecast(lat ,lon , cityName);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to the Geocoding API');
      });
  };
  
/*
  var getWeatherForecast = function (data, cityName) {
    var weatherAPI = "api.openweathermap.org/data/2.5/forecast?lat=" + lat + '&lon=' + lon + '&appid=' + apiKey
  
    fetch(weatherAPI)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);
            displayRepos(data, user);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to GitHub');
      });
  };*/

  userFormEl.addEventListener('submit', getCityLocation);