async function fetchWeather () {
    var rightRow = document.getElementById('rightRow');
    rightRow.style.display = "block";
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

function displayUVIndex (weatherData) {
    console.log ( `[displayUVIndex]`, weatherData );
    document.querySelector('.uvIndex').textContent = "UV Index: " + weatherData.value;
    fetchFiveDays();
}

function fetchFiveDays () {
    var cityName = document.querySelector("#searchCity").value;
    var APIKey = "166a433c57516f51dfab1f7edaed8413";
    var fiveDaysURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;

    $.ajax({
        url: fiveDaysURL,
        method:"GET"
      }).then (displayFiveDays);
}

function displayFiveDays(weatherData) {
    console.log ( `[displayFiveDays]`, weatherData );
    
    //Setting up the temperature for 5 days
    var tempKel = weatherData.list[7].main.temp;
    var tempCel = tempKel - 273.15;
    document.querySelector('.fiveTemp1').textContent = "Temp: " + tempCel + "°C";

    var tempKel = weatherData.list[15].main.temp;
    var tempCel = tempKel - 273.15;
    document.querySelector('.fiveTemp2').textContent = "Temp: " + tempCel + "°C";

    var tempKel = weatherData.list[23].main.temp;
    var tempCel = tempKel - 273.15;
    document.querySelector('.fiveTemp3').textContent = "Temp: " + tempCel + "°C";

    var tempKel = weatherData.list[31].main.temp;
    var tempCel = tempKel - 273.15;
    document.querySelector('.fiveTemp4').textContent = "Temp: " + tempCel + "°C";

    var tempKel = weatherData.list[39].main.temp;
    var tempCel = tempKel - 273.15;
    document.querySelector('.fiveTemp5').textContent = "Temp: " + tempCel + "°C";

    //Setting up the humidity for 5 days
    document.querySelector('.fiveHumidity1').textContent = "Humidity: " + weatherData.list[7].main.humidity + "%";
    document.querySelector('.fiveHumidity2').textContent = "Humidity: " + weatherData.list[15].main.humidity + "%";
    document.querySelector('.fiveHumidity3').textContent = "Humidity: " + weatherData.list[23].main.humidity + "%";
    document.querySelector('.fiveHumidity4').textContent = "Humidity: " + weatherData.list[31].main.humidity + "%";
    document.querySelector('.fiveHumidity5').textContent = "Humidity: " + weatherData.list[39].main.humidity + "%";

    //Setting up the icon for 5 days
    var iconImg = "http://openweathermap.org/img/w/" + weatherData.list[7].weather[0].icon + ".png";

    var cityImg = $("<img>");
    cityImg.attr("src", iconImg);
    $('.fiveIcon1').append(cityImg);

    var iconImg = "http://openweathermap.org/img/w/" + weatherData.list[15].weather[0].icon + ".png";

    var cityImg = $("<img>");
    cityImg.attr("src", iconImg);
    $('.fiveIcon2').append(cityImg); 

    var iconImg = "http://openweathermap.org/img/w/" + weatherData.list[23].weather[0].icon + ".png";

    var cityImg = $("<img>");
    cityImg.attr("src", iconImg);
    $('.fiveIcon3').append(cityImg); 

    var iconImg = "http://openweathermap.org/img/w/" + weatherData.list[31].weather[0].icon + ".png";

    var cityImg = $("<img>");
    cityImg.attr("src", iconImg);
    $('.fiveIcon4').append(cityImg); 

    var iconImg = "http://openweathermap.org/img/w/" + weatherData.list[39].weather[0].icon + ".png";

    var cityImg = $("<img>");
    cityImg.attr("src", iconImg);
    $('.fiveIcon5').append(cityImg); 

    



}