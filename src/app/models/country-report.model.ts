export interface CountryReport {
  country: string;
  continent: string;
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  population: number;
  recovered: number;
  todayRecovered: number;
  active: number;
  critical: string;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  testsPerOneMillion: number;
  countryInfo: {
    flag: string;
    lat: string;
    long: string;
    _id: string;
  };
}
