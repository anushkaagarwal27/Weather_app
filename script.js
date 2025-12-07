const apiKey = "f8f7f2bec2a0d5d718bfbece98e4d687";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const weatherDiv = document.querySelector(".weather");
const errorDiv = document.querySelector(".error");
const loader = document.querySelector(".loader");

// 1. Reusable function to fetch and display data
async function fetchWeather(url) {
    // Show loader, hide content, hide error
    loader.style.display = "block";
    weatherDiv.style.display = "none";
    errorDiv.style.display = "none";

    try {
        const response = await fetch(url);
        
        // Handle City Not Found (404)
        if (response.status == 404) {
            errorDiv.style.display = "block";
            loader.style.display = "none";
            return;
        }

        const data = await response.json();

        // Update Text Content
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        // Update Weather Icon
        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/1146/1146869.png";
        } else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/869/869869.png";
        } else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/1163/1163657.png";
        } else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/3076/3076129.png";
        } else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/4005/4005901.png";
        } else if (data.weather[0].main == "Snow") {
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/642/642000.png";
        } else if (data.weather[0].main == "Thunderstorm") {
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/1146/1146860.png";
        }

        // --- ANIMATION RESET TRICK ---
        // This forces the browser to "forget" the animation happened so it can play again
        weatherDiv.style.animation = 'none';
        weatherDiv.offsetHeight; /* trigger reflow */
        weatherDiv.style.animation = null; 
        // -----------------------------

        // Hide loader, show weather
        loader.style.display = "none";
        weatherDiv.style.display = "block";

    } catch (error) {
        console.error("Error fetching weather data:", error);
        loader.style.display = "none";
        // Optional: Show error div if network fails completely
        errorDiv.style.display = "block";
        errorDiv.innerHTML = "<p>Something went wrong. Check connection.</p>";
    }
}

// 2. Search by City Name
function checkWeatherByCity(city) {
    // Prevent empty API calls
    if (city.trim() === "") {
        return; 
    }
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}`;
    fetchWeather(apiUrl);
}

// 3. Search by Coordinates (Geolocation)
function checkWeatherByCoords(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetchWeather(apiUrl);
}

// Event Listener: Click Button
searchBtn.addEventListener("click", () => {
    checkWeatherByCity(searchBox.value);
});

// FEATURE: Enter Key Support
searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        checkWeatherByCity(searchBox.value);
    }
});

// FEATURE: Get User Location on Load
window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            checkWeatherByCoords(lat, lon);
        }, (error) => {
            // User denied location? Load a default city (New York)
            checkWeatherByCity("New York"); 
        });
    } else {
        // Browser doesn't support geolocation? Load default.
        checkWeatherByCity("New York");
    }
});