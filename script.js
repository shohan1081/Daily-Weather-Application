const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const API_KEY = '3f9ff6757f8a4618a48101102241610';

setInterval(() => {
    const time = new Date();
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const day = time.toLocaleString('en-US', { weekday: 'long' });
    const date = time.getDate();
    const month = time.toLocaleString('en-US', { month: 'long' });
    
    const ampm = hours >= 12 ? 'PM' : 'AM';
    timeEl.innerHTML = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} <span id="am-pm">${ampm}</span>`;
    dateEl.innerHTML = `${day}, ${month} ${date}`;
}, 1000);

getWeatherData('Dhaka');

function getWeatherData(city) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            showWeatherData(data);
            showForecastData(data.forecast.forecastday);
        })
        .catch(err => {
            console.error('Error fetching weather data:', err);
            alert('Error fetching weather data. Please try again later.');
        });
}

function showWeatherData(data) {
    const { current, location } = data;

    timezone.innerHTML = location.tz_id;
    countryEl.innerHTML = location.country;

    currentWeatherItemsEl.innerHTML = `
        <div class="weather-item">
            <div>Temperature</div>
            <div>${current.temp_c}°C</div>
        </div>
        <div class="weather-item">
            <div>Humidity</div>
            <div>${current.humidity}%</div>
        </div>
        <div class="weather-item">
            <div>Wind Speed</div>
            <div>${current.wind_kph} kph</div>
        </div>
    `;

    currentTempEl.innerHTML = `
    <img src="${current.condition.icon}" alt="weather icon" class="w-icon">
    <div class="other">
        <div class="day">${location.name}</div>
        <div class="temp">Temperature ${current.temp_c}°C</div>
    </div>
`;
}

function showForecastData(forecastDays) {
    let forecastHTML = '';
    forecastDays.forEach(day => {
        forecastHTML += `
            <div class="weather-forecast-item">
                <div class="day">${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                <img src="${day.day.condition.icon}" alt="weather icon" class="w-icon">
                <div class="temp">Max - ${day.day.maxtemp_c}°C</div>
                <div class="temp">Min - ${day.day.mintemp_c}°C</div>
            </div>
        `;
    });
    weatherForecastEl.innerHTML = forecastHTML;
}

document.getElementById('search-button').addEventListener('click', () => {
    const city = document.getElementById('search-input').value;
    if (city) {
        getWeatherData(city);
    } else {
        alert('Please enter a city name');
    }
});
