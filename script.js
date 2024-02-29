
// Define API Key
const apiKey = '8595e4e5b46da03003fcf314fd82b635';

// Function to get coordinates from city name
async function getCoordsFromCity(city) {
    const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    const response = await fetch(geocodeUrl);
    const data = await response.json();
    if (data && data.length > 0) {
        return data[0]; // Returns the first match if available
    } else {
        alert('City not found!');
        return null; // Return null if city is not found
    }
}

// Function to fetch weather data using coordinates
async function getWeather(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(weatherUrl);
    const data = await response.json();
    return data; // Returns weather data
}

// Function to update the UI with the fetched weather data
function updateWeatherUI(data) {
    // Ensure data is available before attempting to update the UI
    if (!data || !data.list || data.list.length === 0) {
        alert('No weather data available for this location.');
        return;
    }

    // Update Current weather UI
    document.getElementById('current-weather').innerHTML = `
        <h2>Current Weather for ${data.city.name}</h2>
        <p>Temperature: ${data.list[0].main.temp}°C</p>
        <p>Humidity: ${data.list[0].main.humidity}%</p>
        <p>Wind Speed: ${data.list[0].wind.speed} m/s</p>
    `;
    
    // Update 5-day forecast UI
    const forecast = document.getElementById('forecast');
    forecast.innerHTML = '<h2>5-Day Forecast</h2>';
    for (let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];
        forecast.innerHTML += `
            <div>
                <p>Date: ${new Date(day.dt * 1000).toDateString()}</p>
                <p>Temp: ${day.main.temp}°C</p>
                <p>Humidity: ${day.main.humidity}%</p>
            </div>
        `;
    }
}

// Function to handle search form submission
async function handleSearch(event) {
    event.preventDefault();
    const city = document.getElementById('city-input').value;
    const coords = await getCoordsFromCity(city);
    if (!coords) {
        return; // Exit the function if no coords are returned (city not found)
    }
    const weatherData = await getWeather(coords.lat, coords.lon);
    updateWeatherUI(weatherData);
    saveSearchHistory(city);
    updateSearchHistoryUI();
}

// Function to save search history in local storage
function saveSearchHistory(city) {
    let searches = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searches.includes(city)) {
        searches.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searches));
    }
}

// Function to update the search history UI
function updateSearchHistoryUI() {
    const searches = JSON.parse(localStorage.getItem('searchHistory')) || [];
    document.getElementById('search-history').innerHTML = searches.map(city => `<li><button>${city}</button></li>`).join('');
    // Added <li> tags to wrap buttons for semantic correctness
}

// Function to handle search history item click
function handleHistorySearch(event) {
    if (event.target.tagName === 'BUTTON') {
        document.getElementById('city-input').value = event.target.textContent;
        document.querySelector('#search-form').dispatchEvent(new Event('submit')); // Ensure selector matches form ID
    }
}

// Initialize the app
function init() {
    document.querySelector('#search-form').addEventListener('submit', handleSearch); // Ensure selector matches form ID
    document.getElementById('search-history').addEventListener('click', handleHistorySearch);
    updateSearchHistoryUI();
}

// Call init to set up event listeners
init();