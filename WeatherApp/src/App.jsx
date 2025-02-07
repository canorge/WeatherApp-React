import { useState,useEffect } from 'react'
import './App.css'
import axios from 'axios'
import {Stack,TextField,InputAdornment,IconButton} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import { OtherDays } from './components/OtherDays'

const apiKey='fb8dcf57ed40280e7b06983cc3b89eec';

function App() {
  const [futureDays, setFutureDays] = useState([]);
  const [weather, setWeather] = useState(null);
  const [index, setIndex] = useState(0);
  const [city, setCity] = useState('Sakarya');
  const getWeather= async(city)=>{
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setWeather({ cod: 404 }); 
      } else {
        console.error("Hata oluştu:", error);
      }
    }
  };

  const getNearestWeatherHour = (weatherList) => {
    const now = new Date();
    const currentHour = now.getHours();
  
    const nearestItem = weatherList.reduce((nearest, item) => {
        const forecastHour = new Date(item.dt_txt).getHours();
        const nearestHour = new Date(nearest.dt_txt).getHours();
  
        return Math.abs(forecastHour - currentHour) < Math.abs(nearestHour - currentHour)
            ? item
            : nearest;
    });

    const nearestHour = new Date(nearestItem.dt_txt).getHours();
    
    // Kaçıncı parça olduğunu bul (her 3 saatlik dilime göre)
    const partIndex = nearestHour / 3;  

    return {
        nearestHour: nearestItem.dt_txt.split(" ")[1].split(":")[0], // Örneğin: "15"
        partIndex  // Örneğin: 5 (15:00 için)
    };
};


  useEffect(()=>{
    getWeather(city);
  },[]);

  useEffect(() => {
    
    if (weather && weather.list) { 
      const {nearestHour,partIndex} = getNearestWeatherHour(weather.list);
      setFutureDays(weather.list.filter((item) => {
        const today = new Date().toISOString().split("T")[0]; 
        return item.dt_txt.includes(`${nearestHour.padStart(2, '0')}:00:00`) && !item.dt_txt.includes(today);
      }));
      setIndex(partIndex);
  };
    
  }, [weather]); 

  const handleClick=(e)=>{
    e.preventDefault();
    getWeather(city);
  }

  
  return (
    <>
      <div>
       <Stack>
          <TextField 
          sx={{borderRadius:'30px'}}  
            id="outlined-basic"
            label="Şehir Giriniz"
            variant="outlined"
            value={city}
            onChange={(e)=>setCity(e.target.value)}
            InputProps={{
              sx: {
                borderRadius: "30px", 
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClick}>
                    <SearchIcon/>
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />  
       </Stack>
      
        <Stack sx={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',marginTop:'20px'}}>
          {weather && weather.cod === "200" ? (
            
            <>
            <h1 style={{fontSize:'50px'}}>{weather.city.name}</h1>
            <img src={`https://openweathermap.org/img/wn/${weather.list[index].weather[0].icon}.png`} style={{width:'150px',height:'150px'}} alt="" />            
           <span>{weather.list[index].weather[0].main}</span> 
            <span style={{fontSize:'50px'}}>{(weather.list[index].main.temp).toFixed(0)}°</span>
            <div style={{display:'flex',justifyContent:'space-around',width:'100%'}}>
              <div>
                <h4 style={{fontSize:'30px'}}>{(weather.list[index].main.feels_like).toFixed(0)}°</h4>
                <span>Hissedilen Sıcaklık</span>
              </div>
              <div>
                <h4 style={{fontSize:'30px'}}>{weather.list[index].main.humidity}%</h4>
                <span>Nem</span>
              </div>
              <div>
                <p>
                  <span style={{ display: "inline-block", transform: `rotate(${weather.list[index].wind.deg}deg)`, marginLeft: "8px",fontSize:'30px' }}>
                    ➤
                  </span>
                </p>
                <p>Hız: {weather.list[index].wind.speed} m/s</p>
                {weather.list[index].wind.gust && <p>Rüzgar Esintisi: {weather.list[index].wind.gust} m/s</p>}
              </div>
            </div>
            
            <div className="futureDays">
              {
                futureDays.map((day,index)=>{
                  return <OtherDays key={index} day={day}/>
                })
              }
            </div>
            
            </>
          ):(<>
            <h1>Şehir Bulunamadı</h1>
          </>)}
        </Stack>
      </div>
    </>
  )
}

export default App;
