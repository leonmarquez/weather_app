const queryString = window.location.search;
//console.log(queryString);
const urlParams = new URLSearchParams(queryString);

function getUrlParams(){
    let location = urlParams.get('location');
    return location;
}


//weatherApiKey = 'c3577216e5324af405ad20ef9801a912';
async function getWeatherApiKey(){
    const apikey = await fetch('config/config.json')
   .then(res => {
        return res.json();
    })
    .then(data => {
        return data.weather_app.api_key;
    });

    return apikey;
}

// Coverts the unix time to a readable string
function getDateTime(unix_timestamp){
    var date = new Date(unix_timestamp * 1000);
    return date;
}


async function getCurrentWeather(city, units){
    const weatherApiKey = await getWeatherApiKey();
    //console.log('API KEY: ' + weatherApiKey)
    let protocol = location.protocol;
    let url = protocol + '//api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + weatherApiKey + '&units=' + units;
    console.log(`Connecting to ${url}`)
    fetch(url)
        .then(res => {
            if(!res.ok){
                throw res.status           
            }
            return res.json();
        })
        .then(data => {
            console.log(data);

            var unit;
            if (units === "metric"){
                unit = " °C"
            } else {
                unit = " °F"
            }
            
            var currentWeatherImage = document.querySelector(".weather__current-image");
            document.getElementById('weather__city').innerHTML = data.city.name;

            let html = currentWeatherCard(data, unit);
            html += forecastHourlyCard(data, unit);      

            //console.log(html);
            let element = document.querySelector('#weather__app');
            if (!element.classList.contains('grid')){
                element.classList.add('grid');
            }
            element.innerHTML = html;
        })
        .catch(error => {
            document.querySelector('#weather__app').innerHTML = "";
            if (error === 404){
                console.log('404');
                let message = "Location not found"
                printErrorCode(error, message);
            } else {
                console.log("Error: " + error);
            }            
        });
}


/* Card Components */
function currentWeatherCard(data, unit) {
    let currentTemp = Math.round(data.list[0].main.temp) + unit;
    let currentTempFellsLike = Math.round(data.list[0].main.feels_like) + unit;

    //console.log(data);
    let currentWeather = data.list[0].weather[0].main;
    let weatherIcon = getCurrentWeatherIcon(currentWeather);
    setBgVideo(currentWeather);

    let currentSunrise = getDateTime(data.city.sunrise).toLocaleTimeString();
    let currentSunset = getDateTime(data.city.sunset).toLocaleTimeString();

    const html = `
                <div id="weather__current" class="card grid--1x2">
                    <div class="card--transparent"></div>
                    <h2 class="card__headerbg"> today </h2>

                    <img class="weather__current-image" src="${weatherIcon}" alt="">

                    <div class="weather__current-temperature">
                        <div class="weather__content">
                            <div class="card__temperatur">
                                <h3>${currentTemp}</h3>
                                <p>Feels like ${currentTempFellsLike}</p>
                            </div> 
                        </div>    
                    </div>
                    <div>
                        <p class="card__p__sunrise"> Sunrise ${currentSunrise}</p>
                        <p class="card__p__sunset"> Sunset ${currentSunset}</p>
                    </div> 
                </div>    
                    `;

    return html;
} 


function forecastHourlyCard(data, unit) {
    var html_list =  "";
    //console.log(data.list[1].main.temp)
    for(var i=0; i < 4; i++){
        var dataItem = data.list[i]

        var houre = getDateTime(dataItem.dt).getHours().toString();
        var temp = Math.round(dataItem.main.temp) + unit;
        var imgSrc = getCurrentWeatherIcon(dataItem.weather[0].main);

        if (houre.length < 2){
            houre = 0 + houre;
        }

        html_list += `
            <li class="forecast__item">
                <h3>${houre}</h3>
                <img src="${imgSrc}">
                <p>${temp}</p>
            </li>
        `;

    var html = `
        <div id="weather__forecast" class="card card--2x1">
            <div class="card--transparent"></div>
                <h2 class="forecast__header"> Forecast </h2>
                <ul class="forecast__items">
                    ${html_list}
                </ul>
        </div>   
        `;

    } 
    return html;
}


function getCurrentWeatherIcon(currentWeather){
    let imgSrc;
    
    if(!currentWeather){
        throw Error;
    } else if(currentWeather == "Clouds") {
        imgSrc = "./assets/images/cloudy.png"
    } else if(currentWeather == "Rain"){
        imgSrc = "./assets/images/rain.png"
    } else if(currentWeather == "Clear"){
        imgSrc = "./assets/images/sunny.png"
    } 

    return imgSrc; 
}


function setBgVideo(currentWeather){
    var videoSrc;
    if (!currentWeather){
        throw Error;
    } else if(currentWeather == "Clouds"){
        videoSrc = "https://player.vimeo.com/external/297888387.hd.mp4?s=597e7209648625e257b30e9d73164b2239de2425&profile_id=175&oauth2_token_id=57447761&download=1&w=1920&h=1080";
    }else if(currentWeather == "Rain"){
        videoSrc = "https://player.vimeo.com/external/451758277.hd.mp4?s=80c714688123300922fcc99042736449864a6cb0&profile_id=172&oauth2_token_id=57447761&download=1&w=1920&h=1080";
    } else if(currentWeather == "Clear"){
        videoSrc = "https://player.vimeo.com/external/474256084.hd.mp4?s=6fa7fa7bd2ea188ec35a6bc9d685e5f9b23f8341&profile_id=175&oauth2_token_id=57447761&download=1&w=1920&h=1080"
    } else {
        console.log("NO VIDEO FOUND FOR: " + currentWeather);
    }

    let bgVideoOld = document.querySelector('.bg__video.bg__show');
    let bgVideoNew = document.querySelector('.bg__video.bg__hidden');

    bgVideoNew.src = videoSrc;

    bgVideoOld.className = 'bg__video bg__hidden';
    bgVideoNew.className = 'bg__video bg__show';

    document.querySelector('.bg__video.bg__show').play();
}

function printErrorCode(error, message){
    let html = `
            <div class="error">
                <div class="error_content">
                    <h2>${error}</h2>
                    <h3>${message}</h3>
                </div>
            </div>    
                `

        
    let element = document.querySelector('#weather__app');
    element.classList.remove('grid');
    element.innerHTML = html;
}




function getCityInput(){
    var city = document.querySelector(".input__field").value;
    getCurrentWeather(city, 'metric');
}

let loc = getUrlParams();
if (loc) {
    //console.log(`Getting location from Params: ${loc}`);
    getCurrentWeather( loc, 'metric');
}


