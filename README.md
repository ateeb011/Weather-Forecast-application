# Weather Forecast Application

A responsive weather forecast application built with HTML, JavaScript, and Tailwind CSS that allows users to search for weather conditions by city name or using their current location.

## Features

- Search weather by city name
- Get weather for current location
- Recently searched cities dropdown (stored in local storage)
- Current weather conditions display
- 5-day weather forecast
- Responsive design for desktop, iPad Mini, and iPhone SE
- Error handling and validation


## Setup Instructions

### Prerequisites

- A web browser
- An OpenWeatherMap API key

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/ateeb011/weather-forecast-application.git
   cd weather-forecast-application
   ```

2. Get an API key from [OpenWeatherMap](https://openweathermap.org/api):
   - Sign up for a free account at [OpenWeatherMap](https://home.openweathermap.org/users/sign_up)
   - Navigate to your API keys section
   - Copy your API key

3. Open `app.js` and replace the empty API_KEY constant with your API key:
   ```javascript
   const API_KEY = 'API KEY'; // You'll need to get your own API key
   ```

4. Open `index.html` in your web browser or use a local server:
   ```

## Project Structure

```
weather-forecast-app/
│
├── index.html          # Main HTML structure with Tailwind CSS
├── output.css          # Output CSS File for the converted CSS from tailwind
├── app.js              # JavaScript functionality
└── README.md           # Project documentation
```

## API Integration

This application uses two OpenWeatherMap APIs:

1. **Current Weather API** (`/weather`):
   - Provides current weather data for a specific location
   - Example: `https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY&units=metric`

2. **5-Day Forecast API** (`/forecast`):
   - Provides forecast data in 3-hour steps for 5 days
   - Example: `https://api.openweathermap.org/data/2.5/forecast?lat=51.5074&lon=-0.1278&appid=YOUR_API_KEY&units=metric`


## Usage

1. Enter a city name in the search box and click "Search" or press Enter
2. Click on "Current Location" to get weather for your current location
3. Select a previously searched city from the dropdown
4. View current weather conditions including:
   - Temperature
   - Weather description with icon
   - Wind speed
   - Humidity
   - "Feels like" temperature
5. View the 5-day forecast with daily weather information

## Responsive Design

The application is designed to be responsive and works well on:
- Desktop displays
- iPad Mini 
- iPhone SE 

## Error Handling

The application handles various error scenarios:
- Invalid city names
- Empty search queries
- Geolocation permission denied
- API request failures

Error messages are displayed to the user in a clear, user-friendly manner.

## Local Storage

Recently searched cities are stored in the browser's local storage to persist between sessions. This provides a convenient way for users to access their frequently checked locations.

## Credits

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons by [Font Awesome](https://fontawesome.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)