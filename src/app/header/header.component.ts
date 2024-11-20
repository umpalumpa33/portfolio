import { Component, Input, OnInit } from '@angular/core';
import { ForecastResponse } from '../interfaces/forecast.interface';
import { HourlyForecast } from '../interfaces/hourly.interface';
import { WeatherResponse } from '../interfaces/weather.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isDarkMode = false;
  apiKey: string = 'ddef58ed16958473917d5061dc7f592e';

  constructor() {}

  ngOnInit(): void {}

  toggleDarkMode(event: Event): void {
    const isDarkMode = (event.target as HTMLInputElement).checked;
    this.isDarkMode = isDarkMode;

    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  getWeather(): void {
    const cityInput = document.getElementById('city') as HTMLInputElement;

    if (!cityInput || !cityInput.value) {
      cityInput.classList.add('invalid-input');
      return;
    } else {
      cityInput.classList.remove('invalid-input');
    }

    const city: string = cityInput.value;

    const currentWeatherUrl: string = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}`;
    const forecastUrl: string = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}`;

    fetch(currentWeatherUrl)
      .then((response) => response.json())
      .then((data: WeatherResponse) => {
        if (!data.main) {
          console.error(
            'Current weather data is missing expected properties:',
            data
          );

          return;
        }
        this.displayWeather(data);
      })
      .catch((error) => {
        console.error('Error fetching current weather data:', error);
      });

    fetch(forecastUrl)
      .then((response) => response.json())
      .then((data: ForecastResponse) => {
        if (!data.list) {
          console.error(
            'Hourly forecast data is missing expected properties:',
            data
          );

          return;
        }
        this.displayHourlyForecast(data.list);
      })
      .catch((error) => {
        console.error('Error fetching hourly forecast data:', error);
      });
  }

  displayWeather(data: WeatherResponse): void {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById(
      'weather-icon'
    ) as HTMLImageElement;
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    if (!tempDivInfo || !weatherInfoDiv || !weatherIcon || !hourlyForecastDiv) {
      return;
    }

    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
      weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
      const cityName: string = data.name;
      const temperature: number = Math.round(data.main.temp - 273.15);
      const description: string = data.weather[0].description;
      const iconCode: string = data.weather[0].icon;
      const iconUrl: string = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

      const temperatureHTML = `
        <p>${temperature}°C</p>
      `;

      const weatherHtml = `
        <p>${cityName}</p>
        <p>${description}</p>
      `;

      tempDivInfo.innerHTML = temperatureHTML;
      weatherInfoDiv.innerHTML = weatherHtml;
      weatherIcon.src = iconUrl;
      weatherIcon.alt = description;

      this.showImage();
    }
  }

  displayHourlyForecast(hourlyData: HourlyForecast[]): void {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    if (!hourlyForecastDiv) return;

    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach((item: HourlyForecast) => {
      const dateTime: Date = new Date(item.dt * 1000);
      const hour: number = dateTime.getHours();
      const temperature: number = Math.round(item.main.temp - 273.15);
      const iconCode: string = item.weather[0].icon;
      const iconUrl: string = `https://openweathermap.org/img/wn/${iconCode}.png`;

      const hourlyItemHtml = `
        <div class="hourly-item">
          <span>${hour}:00</span>
          <img src="${iconUrl}" alt="Hourly Weather Icon">
          <span>${temperature}°C</span>
        </div>
      `;

      hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
  }

  showImage(): void {
    const weatherIcon = document.getElementById(
      'weather-icon'
    ) as HTMLImageElement;
    if (weatherIcon) {
      weatherIcon.style.display = 'block';
    }
  }
}
