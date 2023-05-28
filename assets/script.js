//var weatherAPI = "api.openweathermap.org/data/2.5/forecast?lat=" + lat + '&lon=' + lon + '&appid=' + apiKey
//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
//use this to grab 5 day weather value
//var geocodingAPI = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName +'&limit=5&appid=' + apiKey 
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
//use this to grab lat and long based off of city 

//API variables 
var apiKey = "42db8486013a86dadfafb2d6b067bf5a"
var lat;
var lon;

//history list counter 
var listCounter = 0;

//event listeners
var userFormEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector('#city');
var todayContainerEl = document.querySelector("#today");
var searchHistoryEl = document.querySelector('#search-history');

//local storage arrays 
var searchHistoryArray = [];
var fiveDayForecast = [];

//function handling the form information 
var getCityLocation = function (event) {
    event.preventDefault();
    var cityName = cityInputEl.value;

    if (cityName) {
        getLocation(cityName);
  
        todayContainerEl.textContent = '';
        cityInputEl.value = '';

        searchHistoryArray.push(cityName);
        console.log(searchHistoryArray)
        //save history to local storage 
        localStorage.setItem('history', searchHistoryArray);

        var historyOl = document.querySelector('#history-list')
        var historyLi = document.createElement('li')

        var historyButton = document.createElement('button')
        historyButton.textContent = cityName;
        historyButton.classList = "btn btn-secondary w-100 m-1"
        historyButton.setAttribute('type', 'button')

        historyOl.appendChild(historyLi);
        historyLi.appendChild(historyButton);

        //keeps history to a maximum of 10 
        listCounter++;
        if(listCounter >= 10) {
            searchHistoryArray.shift();
            $('#history-list').children().eq(0).remove();
            localStorage.setItem('history', searchHistoryArray);
            listCounter = listCounter - 1;
        }
    } else {
      alert('Please enter a name of a city!');
    }
};

//search for weather when history buttons are pressed 
$('#history-list').on('click', 'button', function(event) {
    event.preventDefault();

    var btnEl = event.target; 
    var btnVal = btnEl.innerHTML; 

    if (btnEl.getAttribute('type') === 'button'){
        getLocation(btnVal); 
    }
})

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
            getWeatherForecast(lat ,lon);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to the Geocoding API');
      });
  };

  var getWeatherForecast = function (lat, lon) {
    var weatherAPI = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + '&lon=' + lon + '&appid=' + apiKey

    fetch(weatherAPI)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);

            displayWeather(data);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to 5 day weather forecast API');
      });
  };

  var displayWeather = function(data){
    //console.log(data);

  };

  userFormEl.addEventListener('submit', getCityLocation);