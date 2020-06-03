async function fetchWeather () {
    var cityName = document.querySelector("#searchCity").value;
    var APIKey = "166a433c57516f51dfab1f7edaed8413";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&appid=" + APIKey;
    
    $.ajax({
    url: queryURL,
      method: "GET"
      }).then( displayWeather ); 
  }


function displayWeather( weatherData ){
    myWeather = weatherData;
    console.log( `[displayWeather]`, weatherData );
    var tempKelvin = weatherData.main.temp;
    var tempCel = tempKelvin - 273.15;

    var iconImg = "http://openweathermap.org/img/w/" + weatherData.weather[0].icon + ".png";

    var latCity = weatherData.coord.lat;
    var lonCity = weatherData.coord.lon;



// Create CODE HERE to dump the temperature content into HTML
    document.querySelector('.city').textContent = weatherData.name;
    document.querySelector('.wind').textContent = "Wind Speed: " + weatherData.wind.speed + " MPH";
    document.querySelector('.humidity').textContent = "Humidity: " + weatherData.main.humidity + "%";
    document.querySelector('.temp').textContent = "Temperature: " + tempCel + "°C";
    var cityImg = $("<img>");
        cityImg.attr("src", iconImg);
        $('.city').append(cityImg);     
    document.querySelector('.latitude').textContent = "Latitude: " + latCity;
    document.querySelector('.longitude').textContent = "Longitude: " + lonCity;
    fetchUVIndex(latCity, lonCity);
  }

function fetchUVIndex (latCity, lonCity) {
    var APIKey = "166a433c57516f51dfab1f7edaed8413";
    var uvIndexURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latCity +"&lon=" + lonCity;

    $.ajax({
      url: uvIndexURL,
      method:"GET"
    }).then (displayUVIndex);
}

function displayUVIndex (response) {
    console.log ( `[displayUVIndex]`, response )
    document.querySelector('.uvIndex').textContent = "UV Index: " + response.value;
}