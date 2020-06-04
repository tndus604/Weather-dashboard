$(document).ready(function () {

    var apiKey = "166a433c57516f51dfab1f7edaed8413";
    var cityNames = [];


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
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                var iconObj = data.weather[0].icon;


                $('#location').text(data.name);
                $('#dateNow').text(date);
                $('#con').text('Current condition: ' + data.weather[0].description);
                $('#temp').text('Now: ' + (parseInt(data.main.temp).toFixed(0)) + ' ' + String.fromCharCode(176) + 'F');
                $('#humidity').text('Humidity: ' + data.main.humidity + '%');
                $('#windSpeed').text('Wind Speed: ' + data.wind.speed + ' MPH');
                $('#like').text('Feels like: ' + (parseInt(data.main.feels_like).toFixed(0) + ' ' + String.fromCharCode(176) + 'F'));
                $('#low').text('Lows for today : ' + (parseInt(data.main.temp_min).toFixed(0) + ' ' + String.fromCharCode(176) + 'F'));
                $('#high').text('Highs for today: ' + (parseInt(data.main.temp_max).toFixed(0) + ' ' + String.fromCharCode(176) + 'F'));
                $('#rise').text('Sunrise: ' + unix_Time(data.sys.sunrise));
                $('#set').text('Sunset: ' + unix_Time(data.sys.sunset));
                $('#pressure').text('Pressure: ' + data.main.pressure + ' ' + 'Pa');
                console.log(unix_Time(data.sys.sunrise));
                updateUvIndex(lat, lon);

                var iconURL = "https://openweathermap.org/img/w/" + iconObj + ".png";
                var cityImg = $("<img>");
                cityImg.attr("src", iconURL);
                $('#location').append(cityImg);

                fiveDayFor(data.name);
            }
        });

    }



    //when click on the button for city info
    $('#searchCity').click(function () {

        var city=document.querySelector('#cityName').value;
        cityNames.push(city);

            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                renderButtons(response.name);
                currentCity(city);
                fiveDayFor(city);
            });

    });

    function renderButtons(city) {
        $('buttons-view').empty();
        console.log(city);
        var a = $("<button id='place'>");

        a.addClass('btn btn-dark');

        a.attr('data-name', city);

        a.text(city);

        a.css("background-color", "rgb(41, 127, 184)");

        a.css("width", "200px");

        $('#buttons-view').append(a);

    }

    function currentCity(city) {

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey,
            type: "GET",
            dataType: "json",
            success: function (data) {
                var today = new Date(Date.now());
                var date = today.toDateString();
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                var iconObj = data.weather[0].icon;

                $('#location').text(data.name);
                $('#dateNow').text(date);
                $('#con').text('Current condition: ' + data.weather[0].description);
                $('#temp').text('Temperature: ' + (parseInt(data.main.temp).toFixed(0)) + ' ' + String.fromCharCode(176) + 'F');
                $('#humidity').text('Humidity: ' + data.main.humidity + '%');
                $('#windSpeed').text('Wind Speed: ' + data.wind.speed + ' MPH');
                $('#like').text('Feels like: ' + (parseInt(data.main.feels_like).toFixed(1) + ' ' + String.fromCharCode(176) + 'F'));
                $('#low').text('Lows for today : ' + (parseInt(data.main.temp_min).toFixed(1) + ' ' + String.fromCharCode(176) + 'F'));
                $('#high').text('Highs for today: ' + (parseInt(data.main.temp_max).toFixed(1) + ' ' + String.fromCharCode(176) + 'F'));
                $('#rise').text('Sunrise: ' + unix_Time(data.sys.sunrise));
                $('#set').text('Sunset: ' + unix_Time(data.sys.sunset));
                $('#pressure').text('Pressure: ' + data.main.pressure + ' ' + 'Pa');
                console.log(unix_Time(data.sys.sunrise));
                updateUvIndex(lat, lon);

                var iconURL = "https://openweathermap.org/img/w/" + iconObj + ".png";
                var cityImg = $("<img>");
                cityImg.attr("src", iconURL);
                $('#location').append(cityImg);


            }
        });
    }

    function updateUvIndex(latt, longg) {
        var value;
        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/uvi?&appid=' + apiKey + '&lat=' + latt + '&lon=' + longg,
            method: "GET"
        }).then(function (response) {
            $('#uV').text('UV Index: ' + response.value);
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

    function fiveDayFor(userCity) {

        var APIKey = "166a433c57516f51dfab1f7edaed8413";
        var fiveURL =
            "https://api.openweathermap.org/data/2.5/forecast?appid=" +
            APIKey +
            "&q=" +
            userCity +
            "&units=imperial";


        $('#fiveForecast').text('5-day Forecast:');

        $.ajax({
            url: fiveURL,
            method: "GET"
        }).then(function (response) {
            var box = $("#forecastbox");
            box.empty();
            count = 1;

            for (var x = 0; x < response.list.length; ++x) {
                if (response.list[x].dt_txt.includes('00:00:00')) {
                    iconObj = response.list[x].weather[0].icon;
                    var daysForecast = $('<div class="col-sm-12 col-md-auto col-lg-0" id="days">');

                    var dayDate = $('<h6>');
                    var dayImg = $('<img>');
                    var desc = $('<h6>');
                    var tempForecast = $('<h6>');


                    var humidityFor = $('<h6>');
                    var iconURL = "https://openweathermap.org/img/w/" + iconObj + ".png";
                    var today = new Date();
                    var futureDate = new Date();
                    futureDate.setDate(today.getDate() + count);
                    var forecast = moment(futureDate).format("MM/D");
                    dayDate.text(forecast);
                    dayImg.attr("src", iconURL);
                    desc.text(response.list[x].weather[0].description);
                    tempForecast.text("Temp.: " + parseInt(response.list[x].main.temp).toFixed(1) + " °F ");

                    humidityFor.text("Humidity: " + response.list[x].main.humidity + "% ");
                    console.log(response);
                    console.log(unix_Time(response.list[x].dt));
                    daysForecast.append(dayDate, dayImg, desc, tempForecast, humidityFor);


                    //daysForecast.attr("class", "days");
                    box.append(daysForecast);
                    ++count;
                }
            }
        });


    }

    function unix_Time(t) {
        var dt = new Date(t * 1000);
        var hr = dt.getHours();
        var m = "0" + dt.getMinutes();

        var time;
        if (hr > 12) {
            time = "pm"
        }
        else {
            time = "am"
        }

        return hr + ':' + m.substr(-2) + ' ' + time;
    }

    function displayCityInfo() {
        var userCity = $(this).attr("data-name");

        currentCity(userCity);
        fiveDayFor(userCity);
    }

    $(document).on('click', '#place', displayCityInfo);


});