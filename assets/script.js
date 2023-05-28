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

// function calls api that grabs the lat and lon values, passes it to the getWeatherForecast function
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

  //functioncalls api that grabs the weather forecast, passes it to the displayWeather function 
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
    //today's forecast
    var p1El = document.createElement('p')
    p1El.classList = "fw-medium fs-3 ms-1";
    p1El.textContent = data.city.name +' [' + dayjs.unix(data.list[0].dt).format("MM.DD.YYYY") +'] ';
    var weatherIcon = document.createElement('img')
    weatherIcon.setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.list[0].weather[0].icon +'.png')

    var p2El = document.createElement('p')
    p2El.classList = "ms-1";
    p2El.textContent = 'Temp: ' + data.list[0].main.temp + ' °F'; 
    var p3El = document.createElement('p')
    p3El.classList = "ms-1";
    p3El.textContent = 'Wind: ' + data.list[0].wind.speed + ' MPH'; 
    var p4El = document.createElement('p')
    p4El.classList = "ms-1";
    p4El.textContent = 'Humidity: ' + data.list[0].main.humidity + ' %';
    
    todayContainerEl.appendChild(p1El)
    p1El.appendChild(weatherIcon)
    todayContainerEl.appendChild(p2El)
    todayContainerEl.appendChild(p3El)
    todayContainerEl.appendChild(p4El)

    for (let index = 8; index < data.list.length; index+=8) {
            if (index <= 40) {
                //card information
                
                var dayCard = $('#day-' + (index-7))
                console.log(dayCard)
                
                
                p1El = document.createElement('p')
                p1El.classList = "fw-medium fs-3 ms-1";
                p1El.textContent ='[' + dayjs.unix(data.list[index].dt).format("MM.DD.YYYY") +']';
                //weatherIcon.setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.list[index].weather[0].icon +'.png')
                
                p2El.textContent = 'Temp: ' + data.list[index].main.temp + ' °F'; 
                p3El.textContent = 'Wind: ' + data.list[index].wind.speed + ' MPH'; 
                p4El.textContent = 'Humidity: ' + data.list[index].main.humidity + ' %';

                dayCard.appendChild(p1El)
                /*
                dayCard.appendChild(weatherIcon)
                dayCard.appendChild(p2El)
                dayCard.appendChild(p3El)
                dayCard.appendChild(p4El)*/
            }
    }


  };

  userFormEl.addEventListener('submit', getCityLocation);