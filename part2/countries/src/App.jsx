import { useState, useEffect } from 'react';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [message, setMessage] = useState('');
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (searchQuery) {
      fetch(`https://restcountries.com/v3.1/name/${searchQuery}`)
        .then(response => response.json())
        .then(data => {
          if (data.length > 10) {
            setMessage('Too many matches, specify another filter');
            setCountries([]);
            setWeather(null); // Reset weather data when there are too many matches
          } else {
            setMessage('');
            setCountries(data);
            if (data.length === 1) {
              fetchWeather(data[0].capital[0]); // Assuming the first capital is the main one
            }
          }
        })
        .catch(error => console.log(error));
    } else {
      setCountries([]);
      setMessage('');
      setWeather(null); // Reset weather data when search query is cleared
    }
  }, [searchQuery]);

  const fetchWeather = (capital) => {
    const apiKey = import.meta.env.VITE_SOME_KEY
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setWeather(data);
      })
      .catch(error => console.log(error));
  };

  const handleShowDetails = (country) => {
    setCountries([country]);
    fetchWeather(country.capital[0]); // Fetch weather data for the capital
  };

  return (
    <div className="App">
      <div>
        find countries <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>
      {message && <p>{message}</p>}
      {countries.length === 1 ? (
        <div>
          {/* Country details */}
          <h3>{countries[0].name.common}</h3>
          <p>Capital: {countries[0].capital}</p>
          <p>Area: {countries[0].area} km²</p>
          <strong>Languages:</strong>
          <ul>
            {Object.values(countries[0].languages).map((language, index) => (
              <li key={index}>{language}</li>
            ))}
          </ul>
          <img src={countries[0].flags.svg} alt={`Flag of ${countries[0].name.common}`} width="100" />
          {/* Weather details */}
          {weather && (
            <div>
              <h3>Weather in {countries[0].capital}</h3>
              <p>Temperature: {weather.main.temp}°C</p>
              <p>Wind: {weather.wind.speed} m/s</p>
            </div>
          )}
        </div>
      ) : countries.map((country, index) => (
        <div key={index}>
          <p>{country.name.common} <button onClick={() => handleShowDetails(country)}>Show</button></p>
        </div>
      ))}
    </div>
  );
}

export default App;