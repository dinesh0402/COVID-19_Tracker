import './App.css';
import {MenuItem,FormControl,Select,Card, CardContent} from '@mui/material'
import { useEffect, useState } from 'react';
import InfoBoxes from './components/InfoBoxes';
import Map from './components/Map';
import Table from './components/Table';
import {sortData} from './util';
import LineGraph from './components/LineGraph';
import 'leaflet/dist/leaflet.css'
import {prettyPrintStat} from './util'

// https://disease.sh/v3/covid-19/countries

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then((data) => {
      setCountryInfo(data);
    })
  } , [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ));

        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };

    getCountriesData();
  } , []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    // https://disease.sh/v3/covid-19/all
    // https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]

    const url = countryCode === 'worldwide' ?
    'https://disease.sh/v3/covid-19/all' : 
    `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);

      // All of the data received about the country from the API ...
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    });

    console.log(mapCenter);
  };

  return (
    <div className="app">

      <div className='app__left'>
        {/* Header */}
        {/* Title + Dropdown input */}
        <div className='app__header'>
          <h1>COVID-19 Tracker</h1>
          <FormControl className='app__dropdown'>
            <Select onChange={onCountryChange} variant='outlined' value={country}>
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        {/* Infoboxes */}
        <div className='app__stats'>
          <InfoBoxes
            onClick={(e) => setCasesType('cases')}
            title='Coronavirus Cases'
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBoxes
            onClick={(e) => setCasesType('recovered')}
            title='Recovered'
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBoxes 
            onClick={(e) => setCasesType('deaths')}
            title='Deaths' 
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        <Map
          casesType={casesType}
          countries = {mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className='app__right'>
        <CardContent>
          <div className='app__information'>
            <h3>Live Cases by Country</h3>
            {/* Table */}
            <Table countries={tableData} />
            <br />
            <h3>Worldwide new {casesType}</h3>
            {/* Graph */}
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
