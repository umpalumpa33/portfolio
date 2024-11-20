export interface WeatherResponse {
  cod: string;
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  message?: string;
}
