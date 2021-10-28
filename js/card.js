
function currentWeatherCard(data) {
    var currentTemp = Math.round(data.list[0].main.temp) + unit;
    var currentTempFellsLike = Math.round(data.list[0].main.feels_like) + unit;

    var currentSunrise = getDateTime(data.city.sunrise);
    var currentSunset = getDateTime(data.city.sunset);
            
    console.log('HI')

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
}


export {currentWeatherCard}