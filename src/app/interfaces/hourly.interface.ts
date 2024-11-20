export interface HourlyForecast {
    dt: number;
    main: {
      temp: number;
    };
    weather: {
      icon: string;
    }[];
  }