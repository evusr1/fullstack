import { useState, useEffect } from 'react'

import weatherService from './services/weather'
import countriesService from './services/countries'

const WeatherDisplay = ({capital, weather}) => {
  if(weather) {
    const weatherInfo = weather.weather[0]

    return (
      <div>
        <h1>Weather in {capital}</h1>
        <p>
          temperature {weather.main.temp} Celcius
        </p>
        <img src={weatherService.getIconUrl(weatherInfo.icon)} alt={weatherInfo.main}/>
        <p>
          wind {weather.wind.speed} m/s
        </p>
      </div>
    )
  }
  return (
    <div>
      Loading weather...
    </div>   
  )
  
}

const CountryDisplay = ({country, weather}) => {
  const languages = Object.values(country.languages)

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>
        capital {country.capital}
      </p>
      <p>
        area  {country.area}
      </p>
      <div>
        languages
        <ul>
          {
            languages.map(language => 
              <li key={language}>
                {language}
              </li>
            )
          }
        </ul>
      </div>
      <img src={country.flags.png} alt={"Flag of " + country.name.common}/>
      <WeatherDisplay weather={weather} capital={country.capital} />
    </div>   
  )
}

const CountriesDisplay = ({countries, handleShow, weather}) => {
  if(!countries)
    return
  if(countries.length > 10)
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  if(countries.length > 1)
    return (
      <div>
        <ul>
          {
            countries.map(country => 
              <li key={country.ccn3} >
                {country.name.common} <button onClick={() => {handleShow(country.ccn3)}}>show</button>
              </li>
            )
          }
        </ul>
      </div>
    )
  if(countries.length) {
    const country = countries[0];

    return (
      <CountryDisplay weather={weather} country={country} />
    )
  }
  return (
    <div>
      No results found
    </div>
  )
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [countries, setCountries] = useState(null)
  const [countriesCache, setCountriesCache] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countriesService
      .getAll()
      .then(returnedCountries => 
        setCountriesCache(returnedCountries)
      )
  }, [])

  useEffect(() => {
    if(countries && countries.length === 1) {
      if(!weather) {
        const countryCoord = countries[0].capitalInfo.latlng;

        weatherService
          .getCoord(countryCoord[0], countryCoord[1])
          .then(returnedWeather => 
            setWeather(returnedWeather)
          )
      }
    } else
      setWeather(null)

  }, [countries])

  const handleShowClick = (ccn3) => {
    if(countriesCache)
      setCountries([countriesCache.find(country => country.ccn3 === ccn3)])
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    if(countriesCache)
      setCountries(
          countriesCache.filter((country =>
            country.name.official.toLowerCase().includes(e.target.value.toLowerCase())
        ))
      )
  }

  return (
    <div>
        find countries <input value={searchTerm} onChange={handleSearchChange}/>
        <CountriesDisplay countries={countries} handleShow={handleShowClick} weather={weather}/>
    </div>
  );
}

export default App;
