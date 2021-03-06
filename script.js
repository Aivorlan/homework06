var citiesList = [];
var id = "2fab4dbff3c744e6452b92d0a78ccab0";

function displayCityWeather() {
    var thisCity = $(this).attr("data-city");

    $(".cityToday").empty();
    getCurrentWeather(thisCity, id);

    $(".forecast").empty();
    getForecast(thisCity, id);
    
}


function createcitiesList(){
    $(".citiesList").empty();
    citiesList.forEach(function(city) {
        $(".citiesList").prepend($(`<button class="list-group-item list-group-item-action cityButton" data-city="${city}">${city}</button>`));
    })
}


function init() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    if (storedCities !== null) {
        citiesList = storedCities;
    }

    createcitiesList();

    if (citiesList) {
        var thisCity = citiesList[citiesList.length - 1]
        getCurrentWeather(thisCity, id);
        getForecast(thisCity, id);
    }
}



function getForecast(thisCity, id) {
    var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${thisCity}&units=imperial&appid=${id}`;

    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function (data) {
        for (i = 0; i < data.list.length; i++) {
            if (data.list[i].dt_txt.search("15:00:00") != -1) {
                var forecastDate = data.list[i];
                $(".forecast").append(
                    `<div class="card bg-primary shadow m-4">
                        <div class="card-body">
                            <h4 class="card-title">${(new Date(1000 * forecastDate.dt).getUTCMonth()) + 1}/${new Date(1000 * forecastDate.dt).getUTCDate()}/${new Date(1000 * forecastDate.dt).getUTCFullYear()}</h4>
                            <div class="card-text">
                                <img src="http://openweathermap.org/img/w/${forecastDate.weather[0].icon}.png">
                                <p class="card-text">Temp: ${forecastDate.main.temp} &degF</p>
                                <p class="card-text">Humidity: ${forecastDate.main.humidity} %</p>
                            </div>
                        </div>
                    </div>`
                );
            }
        }

    })
}

function getCurrentWeather(thisCity, id) {
    var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${thisCity}&units=imperial&appid=${id}`;
    var cityLat;
    var cityLong;

    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function (data) {
        $(".cityToday").append(
            `<div class="row ml-1">
                <h3 class="mr-3">${data.name} (${(new Date(1000 * data.dt).getUTCMonth()) + 1}/${(new Date(1000 * data.dt).getUTCDate()) - 1}/${new Date(1000 * data.dt).getUTCFullYear()})</h3>
                <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png">
            </div>`
        )
        $(".cityToday").append(`<p>Temperature: ${data.main.temp} &degF</p>`)
        $(".cityToday").append(`<p>Humidity: ${data.main.humidity} %</p>`)
        $(".cityToday").append(`<p>Wind: ${data.wind.speed} mph</p>`)
        cityLat = data.coord.lat;
        cityLong = data.coord.lon;
        getUVI(id, cityLat, cityLong);
    })

}

$("form").on("submit", function(event) {
    event.preventDefault();
    console.log("i work")
    var newCity = $("#citySearchInput").val().trim();
    citiesList.push(newCity);
    createcitiesList();
    storeCities();
    $("#citySearchInput").val("");
})


$(".citiesList").on("click", ".cityButton", displayCityWeather);

function getUVI(id, cityLat, cityLong) {
    var uvURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${cityLat}&lon=${cityLong}&appid=${id}`;

    $.ajax({
        url: uvURL,
        method: "GET"
    }).then(function (data) {
        $(".cityToday").append(`<p>UV Index: <span class="badge badge-danger p-2">${data.value}</span></p>`);
    })
}




