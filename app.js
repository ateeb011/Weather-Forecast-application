// npx tailwindcss -i ./src/input.css -o ./src/output.css --watch

// API configuration
const API_KEY = 'Enter API key here'; // Get API key from OpenWeather. Haven't uploaded mine for security reasons.
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const locationButton = document.getElementById('location-button');
const searchDropdown = document.getElementById('search-dropdown');
const errorMessage = document.getElementById('error-message');
const currentWeather = document.getElementById('current-weather');
const forecastContainer = document.getElementById('forecast-container');
const forecast = document.getElementById('forecast');

// City name elements
const cityName = document.getElementById('city-name');
const currentDate = document.getElementById('current-date');
const currentTemp = document.getElementById('current-temp');
const weatherDescription = document.getElementById('weather-description');
const weatherIcon = document.getElementById('weather-icon');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const feelsLike = document.getElementById('feels-like');

// Recently searched cities
let recentCities = [];

// Initialize the application
function initApp() {
    loadRecentCities();
    setupEventListeners();
}

// Load recently searched cities from local storage
function loadRecentCities() {
    const storedCities = localStorage.getItem('recentCities');
    if (storedCities) {
        recentCities = JSON.parse(storedCities);
    }
}

// Save recently searched cities to local storage
function saveRecentCities() {
    localStorage.setItem('recentCities', JSON.stringify(recentCities));
}

// Add a city to recent searches
function addToRecentCities(city) {
    // Remove city if it already exists (to move it to the top)
    const index = recentCities.indexOf(city);
    if (index !== -1) {
        recentCities.splice(index, 1);
    }
    
    // Add city to the beginning of the array
    recentCities.unshift(city);
    
    // Keep only the 5 most recent cities
    if (recentCities.length > 5) {
        recentCities = recentCities.slice(0, 5);
    }
    
    saveRecentCities();
}

// Setup event listeners
function setupEventListeners() {
    // Search button click event
    searchButton.addEventListener('click', handleSearch);
    
    // Enter key press in search input
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Current location button click event
    locationButton.addEventListener('click', getCurrentLocationWeather);
    
    // Search input focus event to show dropdown
    searchInput.addEventListener('focus', showRecentCitiesDropdown);
    
    // Search input blur event to hide dropdown (with delay to allow clicking dropdown items)
    searchInput.addEventListener('blur', () => {
        setTimeout(() => {
            searchDropdown.classList.add('hidden');
        }, 200);
    });
    
    // Search input input event to filter dropdown
    searchInput.addEventListener('input', () => {
        if (searchInput.value.length > 0) {
            showRecentCitiesDropdown();
        } else {
            searchDropdown.classList.add('hidden');
        }
    });
    
    // Document click event to hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
            searchDropdown.classList.add('hidden');
        }
    });
}

// Show dropdown with recently searched cities
function showRecentCitiesDropdown() {
    if (recentCities.length === 0) return;
    
    searchDropdown.innerHTML = '';
    
    const inputValue = searchInput.value.toLowerCase();
    const filteredCities = recentCities.filter(city => 
        city.toLowerCase().includes(inputValue)
    );
    
    if (filteredCities.length === 0) {
        searchDropdown.classList.add('hidden');
        return;
    }
    
    filteredCities.forEach(city => {
        const item = document.createElement('div');
        item.className = 'px-4 py-2 hover:bg-blue-100 cursor-pointer';
        item.textContent = city;
        item.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevent the input from losing focus
            searchInput.value = city;
            searchDropdown.classList.add('hidden');
            getWeatherByCity(city);
        });
        searchDropdown.appendChild(item);
    });
    
    searchDropdown.classList.remove('hidden');
}

// Handle search button click
function handleSearch() {
    const city = searchInput.value.trim();
    
    if (city === '') {
        showError('Please enter a city name');
        return;
    }
    
    hideError();
    getWeatherByCity(city);
}

// Get weather by city name
function getWeatherByCity(city) {
    showLoading();
    
    fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayCurrentWeather(data);
            addToRecentCities(data.name);
            getExtendedForecast(data.coord.lat, data.coord.lon);
            hideLoading();
        })
        .catch(error => {
            hideLoading();
            showError(error.message);
        });
}

// Get weather by coordinates
function getWeatherByCoords(lat, lon) {
    showLoading();
    
    fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Weather data not available');
            }
            return response.json();
        })
        .then(data => {
            displayCurrentWeather(data);
            addToRecentCities(data.name);
            getExtendedForecast(lat, lon);
            hideLoading();
        })
        .catch(error => {
            hideLoading();
            showError(error.message);
        });
}

// Get extended forecast
function getExtendedForecast(lat, lon) {
    fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Forecast data not available');
            }
            return response.json();
        })
        .then(data => {
            displayExtendedForecast(data);
        })
        .catch(error => {
            showError(error.message);
        });
}

// Get current location weather
function getCurrentLocationWeather() {
    hideError();
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherByCoords(lat, lon);
            },
            (error) => {
                showError('Unable to get your location');
                console.error(error);
            }
        );
    } else {
        showError('Geolocation is not supported by your browser');
    }
}

// Display current weather
function displayCurrentWeather(data) {
    // Show the weather container
    currentWeather.classList.remove('hidden');
    
    // Update weather data
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    currentDate.textContent = formatDate(new Date());
    currentTemp.textContent = Math.round(data.main.temp);
    weatherDescription.textContent = data.weather[0].description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    humidity.textContent = `${data.main.humidity}%`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
}

// Display extended forecast
function displayExtendedForecast(data) {
    // Clear previous forecast data
    forecast.innerHTML = '';
    
    // Show the forecast container
    forecastContainer.classList.remove('hidden');
    
    // Filter forecast data for one entry per day (at 12:00)
    const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    
    // If no data at 12:00, take the first entry of each day
    if (dailyData.length < 5) {
        const days = {};
        data.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0];
            if (!days[date]) {
                days[date] = item;
            }
        });
        
        dailyData.length = 0;
        Object.values(days).forEach(item => {
            dailyData.push(item);
        });
        
        // Limit to 5 days
        dailyData.splice(5);
    }
    
    // Create forecast cards
    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const card = document.createElement('div');
        card.className = 'bg-blue-50 rounded-lg p-4 text-center';
        
        card.innerHTML = `
            <p class="font-medium">${formatDay(date)}</p>
            <p class="text-xs text-gray-500">${formatDate(date, true)}</p>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}" class="mx-auto w-16 h-16">
            <p class="font-bold">${Math.round(day.main.temp)}°C</p>
            <div class="text-xs text-gray-600 mt-2">
                <p><i class="fas fa-wind mr-1"></i>${day.wind.speed} m/s</p>
                <p><i class="fas fa-droplet mr-1"></i>${day.main.humidity}%</p>
            </div>
        `;
        
        forecast.appendChild(card);
    });
}

// Format date to string
function formatDate(date, short = false) {
    const options = { 
        weekday: short ? 'short' : 'long',
        month: short ? 'short' : 'long',
        day: 'numeric',
        year: short ? undefined : 'numeric'
    };
    
    return date.toLocaleDateString('en-US', options);
}

// Format day name
function formatDay(date) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

// Hide error message
function hideError() {
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
}

// Show loading state
function showLoading() {
    searchButton.disabled = true;
    searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
}

// Hide loading state
function hideLoading() {
    searchButton.disabled = false;
    searchButton.textContent = 'Search';
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
