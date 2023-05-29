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

//function handling the form information 
var getCityLocation = function (event) {
    event.preventDefault();

    var cityName = cityInputEl.value;
    //if the cityName is truthy call the getLocation function and clear the fields 
    if (cityName) {
        getLocation(cityName);
        clear();
        cityInputEl.value = '';
        searchHistoryArray.push(cityName);
        //save history to local storage 
        localStorage.setItem('history', searchHistoryArray);

        //create list and buttons for search history
        var historyOl = document.querySelector('#history-list')
        var historyLi = document.createElement('li')

        var historyButton = document.createElement('button')
        historyButton.textContent = cityName;
        historyButton.classList = "btn btn-secondary w-100 m-1"
        historyButton.setAttribute('type', 'button')

        historyOl.appendChild(historyLi);
        historyLi.appendChild(historyButton);

        //keeps history list and buttons to a maximum of 10 
        listCounter++;
        if(listCounter >= 10) {
            searchHistoryArray.shift();
            $('#history-list').children().eq(0).remove();

            localStorage.setItem('history', searchHistoryArray); //save to local history 
            listCounter = listCounter - 1;
        }
    } else {
        // if the field is empty make an alert
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

//clear function that clears all the box and cards 
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
          //console.log(response);
          response.json().then(function (data) {
            //console.log(data);
            
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
          //console.log(response);
          response.json().then(function (data) {
            //console.log(data);

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
    //today's forecast text area, create all elements and manipulate api information 
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
    
    //append and create all elements 
    todayContainerEl.appendChild(p1El)
    p1El.appendChild(weatherIcon)
    todayContainerEl.appendChild(p2El)
    todayContainerEl.appendChild(p3El)
    todayContainerEl.appendChild(p4El)
    
    //loop through the weather array for cards 
    for (let index = 7; index < data.list.length; index+=7) {
                //card information
                cardCounter++;
                var dayNumber = (index-(index-cardCounter))
                //var dayNumberSub = dayNumber - 1;
                var dayCard = $('#day-' + dayNumber)
                
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
    }
    //card counter needs to be reset every time for next use 
    cardCounter = 0;
  };

  //initialize function that recalls previous sessions search queries and generates the history list and buttons
  var init = function(){
    var searchHistory =localStorage.getItem('history')
    if (searchHistory){
      searchHistoryArray = searchHistory.split(',')
    }
    listCounter = listCounter + searchHistoryArray.length;
    for (let index = 0; index < searchHistoryArray.length; index++) {
        var historyOl = document.querySelector('#history-list')
        var historyLi = document.createElement('li')

        var historyButton = document.createElement('button')
        historyButton.textContent = searchHistoryArray[index];
        historyButton.classList = "btn btn-secondary w-100 m-1"
        historyButton.setAttribute('type', 'button')

        historyOl.appendChild(historyLi);
        historyLi.appendChild(historyButton);
    }
    console.log(searchHistoryArray)
    localStorage.setItem('history', searchHistoryArray); //save to local history 
  }

  //call init function to setup page, add event listener for the form
  init()
  userFormEl.addEventListener('submit', getCityLocation);