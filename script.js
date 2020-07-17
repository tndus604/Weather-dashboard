var apiKey = "166a433c57516f51dfab1f7edaed8413";
var cityNames = [];

var question = confirm('Do you want to track your location?');
if (question) {
    getLocation();
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geoSuccess)
    } else {
        alert("Geolocation is not supported by this browser.")
    }
}

function geoSuccess(position) {
    var latt = position.coords.latitude;
    var longg = position.coords.longitude;

    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?lat=" + latt + "&lon=" + longg + "&units=imperial&appid=" + apiKey,
        type: "GET",
        dataType: "json",
        success: function (data) {
            var today = new Date(Date.now());
            var date = today.toDateString();
            var iconObj = data.weather[0].icon;
            var iconURL = "https://openweathermap.org/img/w/" + iconObj + ".png";
            var tempFar = data.main.temp;
            var tempCel = (tempFar - 32) * (5/9);
            var tempFarFeels = data.main.feels_like;
            var tempCelFeels = (tempFarFeels - 32) * (5/9);
            var latt= data.coord.lat;
            var longg = data.coord.lon;
            var pressure = (data.main.pressure/10)

            var currentWeather = document.querySelector('#currentWeather')

            currentWeather.innerHTML = `
                <h1 style="display: inline">${data.name}</h1>
                (<p style="display: inline">${date}</p>)
                <h1 id="temp">${(parseInt(tempCel).toFixed(0))}°C <img src="${iconURL}"></h1>
                <h4>${data.weather[0].description}</h4>
                <h6>Feels like: ${(parseInt(tempCelFeels).toFixed(0))} °C</h6>
                <h6>Humidity: ${data.main.humidity} %</h6>
                <h6>Wind Speed: ${data.wind.speed} MPH</h6>
                <h6>Pressue: ${pressure} kPa</h6>
            `
            updateUvIndex(latt, longg);
            fiveDayFor(data.name);
            renderButtons(data.name);
        }
    });
}

$('#searchCity').click(function () {
    var city=document.querySelector('#cityName').value;
    cityNames.push(city);

    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        renderButtons(response.name);
        currentCity(city);
        fiveDayFor(city);
    });
});

function currentCity(city) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey,
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log(data);

            var today = new Date(Date.now());
            var date = today.toDateString();
            var iconObj = data.weather[0].icon;
            var iconURL = "https://openweathermap.org/img/w/" + iconObj + ".png";
            var tempFar = data.main.temp;
            var tempCel = (tempFar - 32) * (5/9);
            var tempFarFeels = data.main.feels_like;
            var tempCelFeels = (tempFarFeels - 32) * (5/9);
            var latt= data.coord.lat;
            var longg = data.coord.lon;
            var pressure = (data.main.pressure/10)

            var currentWeather = document.querySelector('#currentWeather')

            currentWeather.innerHTML = `
                <h1 style="display: inline">${data.name}</h1>
                (<p style="display: inline">${date}</p>)
                <h1 id="temp">${(parseInt(tempCel).toFixed(0))}°C <img src="${iconURL}"></h1>
                <h4>${data.weather[0].description}</h4>
                <h6>Feels like: ${(parseInt(tempCelFeels).toFixed(0))} °C</h6>
                <h6>Humidity: ${data.main.humidity} %</h6>
                <h6>Wind Speed: ${data.wind.speed} MPH</h6>
                <h6>Pressue: ${pressure} kPa</h6>
            `
            updateUvIndex(latt, longg);
        }
    });
}

function updateUvIndex(latt, longg) {
    $.ajax({
        url: 'https://api.openweathermap.org/data/2.5/uvi?&appid=' + apiKey + '&lat=' + latt + '&lon=' + longg,
        method: "GET"
    }).then(function (response) {
        var uV = document.querySelector('#uV')
        uV.innerHTML = `<h6>UV Index: ${response.value}</h6>`
        if (response.value < 3) {
            $('#uV').css("color", "green");
        } else if (response.value < 6) {
            $('#uV').css("color", "yellow");
        } else if (response.value < 8) {
            $('#uV').css("color", "tangerine");
        } else if (response.value < 11) {
            $('#uV').css("color", "red");
        } else {
            $('#uV').css("color", "purple");
        } 
    });
}

function fiveDayFor(city) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?appid=" + apiKey +
        "&q=" + city + "&units=imperial",
        method: "GET"
    }).then(function (response) {
        console.log(response)
        $("#forecastBox").removeClass('d-none')
        count = 1;

        var futureWeather = document.querySelector('#futureWeather');
        futureWeather.innerHTML = '';
        for (var i = 4; i < response.list.length; i += 8 ) {
            var iconObj = response.list[i].weather[0].icon;
            var iconURL = "https://openweathermap.org/img/w/" + iconObj + ".png";
            var today = new Date();
            var futureDate = new Date();
            futureDate.setDate(today.getDate() + count++);
            var forecast = moment(futureDate).format("MM/D")
            var tempFar5 = response.list[i].main.temp;
            var tempCel5 = (tempFar5 - 32) * (5/9);

            futureWeather.innerHTML += `
                <div class="col">
                <div class="card">
                    <h3>${forecast}</h3>
                    <h3 style="display: inline; color: purple">${parseInt(tempCel5).toFixed(0)}°C<img src="${iconURL}"></h3>
                    <h6>${response.list[i].weather[0].description}</h6>
                    <h6>Humidity: ${response.list[i].main.humidity} %</h6>
                </div>
                </div>
            `
        }
    })
}


function renderButtons(city) {
    $('buttons-view').empty();
    console.log(city);
    var a = $("<button type='button' class='btn btn-outline-dark' id='place'>");
    a.addClass('btn btn-dark');
    a.attr("data-name", city);
    a.text(city);
    a.css("width", "200px");
    $('#buttons-view').append(a);
}

$(document).on('click', '#place', displayCityInfo);

function displayCityInfo() {
    var userCity = $(this).attr("data-name");

    currentCity(userCity);
    fiveDayFor(userCity);
}