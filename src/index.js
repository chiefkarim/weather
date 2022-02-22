import "./style.css";
import fetch from "node-fetch";

const apiKey = "17e4ce86e3f52b9995d463e57b607f01";
const body = document.querySelector("body");
body.innerHTML = `
<div id="background"></div>
<pre>no matter the weather, exploring the earth is always an interesting experience.</pre>
<div class="content">
<div class="currentWeather">

</div>
<div class="LocationContainer">
          <label for="Location">Location</label>
      <input type="text" id="Location" name="Location">
      <span></span>
      <button id="search">Search</button>
      <div>
   </div>
`;
const search = document.querySelector("#search");

const getWeatherInfos = async function () {
  async function getGeocording() {
    const location = document.querySelector("#Location").value;
    const geocordingApi = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${apiKey}`;
    const response = await fetch(geocordingApi, {
      mode: "cors",
    });
    const geocordings = await response.json();
    return { lat: geocordings[0].lat, lon: geocordings[0].lon, geocordings };
  }
  getGeocording()
    .then(async (geocordings) => {
      const { lat } = geocordings;
      const { lon } = geocordings;
      const units = "metric";
      const currentWeatherApi = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
      const response = await fetch(currentWeatherApi, {
        mode: "cors",
      });
      const weather = await response.json();

      return { weather };
    })
    .then((value) => {
      const { weather } = value;
      const showWeather = document.querySelector(".currentWeather");
      showWeather.innerHTML = `
      <h1>${weather.sys.country}, ${weather.name}</h1>
      <h3>${weather.main.temp}°C </h3>
      <h2>${weather.weather[0].description}</h2>
      <div class="others">
       <p>Humidity levels: ${weather.main.humidity}%</p>
      <p>Wind: ${weather.wind.speed}k/m</p>
      </div>`;
    });
};

search.addEventListener("click", () => {
  if (document.querySelector("#Location").value) {
    getWeatherInfos();
    const span = document.querySelector(".LocationContainer>span");
    span.textContent = "";
  } else {
    (function error() {
      const span = document.querySelector(".LocationContainer>span");
      span.textContent = "please, enter a location first.";
    })();
  }
});
