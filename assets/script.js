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
var cardCounter = 0;

//event listeners
var userFormEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector('#city');
var todayContainerEl = document.querySelector("#today");
var searchHistoryEl = document.querySelector('#search-history');

var card1 = document.querySelector("#day-1");
var card2 = document.querySelector("#day-2");
var card3 = document.querySelector("#day-3");
var card4 = document.querySelector("#day-4");
var card5 = document.querySelector("#day-5");

//local storage arrays 
var searchHistoryArray = [];
var todayForecast = {location:'', weatherIcon:'', temp:'', wind:'', humidity:''}
var fiveDayForecast = 
    [{location:'', weatherIcon:'', temp:'', wind:'', humidity:''},
    {location:'', weatherIcon:'', temp:'', wind:'', humidity:''},
    {location:'', weatherIcon:'', temp:'', wind:'', humidity:''},
    {location:'', weatherIcon:'', temp:'', wind:'', humidity:''},
    {location:'', weatherIcon:'', temp:'', wind:'', humidity:''}];

//function handling the form information 
var getCityLocation = function (event) {
    event.preventDefault();
    var cityName = cityInputEl.value;

    if (cityName) {
        getLocation(cityName);
  
        clear();
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

            localStorage.setItem('history', searchHistoryArray); //save to local
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
        
        clear(); 
        getLocation(btnVal); 
    }
})

var clear = function(){
    todayContainerEl.textContent = '';
    card1.textContent ='';
    card2.textContent ='';
    card3.textContent ='';
    card4.textContent ='';
    card5.textContent ='';

}

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

  //function calls api that grabs the weather forecast, passes it to the displayWeather function 
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


    //todayForecast = {location:'', weatherIcon:'',temp:'', wind:'', humidity:''}
    todayForecast.location = data.city.name +' [' + dayjs.unix(data.list[0].dt).format("MM.DD.YYYY") +'] '
    todayForecast.weatherIcon = 'https://openweathermap.org/img/wn/'+ data.list[0].weather[0].icon +'.png'
    todayForecast.temp = 'Temp: ' + data.list[0].main.temp + ' °F';
    todayForecast.wind = 'Wind: ' + data.list[0].wind.speed + ' MPH';
    todayForecast.humidity = 'Humidity: ' + data.list[0].main.humidity + ' %';

    localStorage.setItem('todayForecast', todayForecast); //save to local 
    
    for (let index = 7; index < data.list.length; index+=7) {
            
                //card information
                cardCounter++;
                var dayNumber = (index-(index-cardCounter))
                var dayNumberSub = dayNumber - 1;
                var dayCard = $('#day-' + dayNumber)
                //console.log(dayCard)
                
                
                var p1El2 = document.createElement('p')
                p1El2.classList = "fw-medium fs-5 ms-1";
                p1El2.textContent ='[' + dayjs.unix(data.list[index].dt).format("MM.DD.YYYY") +']';
                var weatherIcon2 = document.createElement('img')
                weatherIcon2.setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.list[index].weather[0].icon +'.png')

                var p2El2 = document.createElement('p')
                p2El2.classList = "ms-1";
                p2El2.textContent = 'Temp: ' + data.list[index].main.temp + ' °F'; 
                var p3El2 = document.createElement('p')
                p3El2.classList = "ms-1";
                p3El2.textContent = 'Wind: ' + data.list[index].wind.speed + ' MPH'; 
                var p4El2 = document.createElement('p')
                p4El2.classList = "ms-1";
                p4El2.textContent = 'Humidity: ' + data.list[index].main.humidity + ' %';
    
                dayCard.append(p1El2)
                p1El2.append(weatherIcon2)
                dayCard.append(p2El2)
                dayCard.append(p3El2)
                dayCard.append(p4El2)

                console.log(dayNumberSub);
                //var fiveDayForecast = [{location:'', weatherIcon:'', temp:'', wind:'', humidity:''},
                fiveDayForecast[dayNumberSub].location =' [' + dayjs.unix(data.list[index].dt).format("MM.DD.YYYY") +'] '
                fiveDayForecast[dayNumberSub].weatherIcon = 'https://openweathermap.org/img/wn/'+ data.list[index].weather[0].icon +'.png'
                fiveDayForecast[dayNumberSub].temp = 'Temp: ' + data.list[index].main.temp + ' °F';
                fiveDayForecast[dayNumberSub].wind = 'Wind: ' + data.list[index].wind.speed + ' MPH';
                fiveDayForecast[dayNumberSub].humidity = 'Humidity: ' + data.list[index].main.humidity + ' %';

                localStorage.setItem('fiveDayForecast', fiveDayForecast); //save to local           
    }
    cardCounter = 0;
  };

  userFormEl.addEventListener('submit', getCityLocation);