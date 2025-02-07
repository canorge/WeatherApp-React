import React from 'react'

export const OtherDays = ({day}) => {
  return (
    <>
        <div className='futureDaysItem'>
            <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>{day.dt_txt.split(" ")[0]}</h3>
            <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt="" />            
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>{day.weather[0].main}</span> 
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>{(day.main.temp).toFixed(0)}°</span>
            <div className='weather-info'>
              <div className="weather-box">
                <h5 >{(day.main.feels_like).toFixed(0)}°</h5>
                <span>Hissedilen Sıcaklık</span>
              </div>
              <div className="weather-box">
                <h5 >{day.main.humidity}%</h5>
                <span>Nem</span>
              </div>
              <div className="weather-box">
                <h5 style={{ display: "inline-block", transform: `rotate(${day.wind.deg}deg)`, marginLeft: "8px"}}>
                    ➤
                </h5>
                <span>Hız: {day.wind.speed} m/s</span>
                {day.wind.gust && <span>Rüzgar Esintisi: {day.wind.gust} m/s</span>}
              </div>
            </div>
        </div>
    </>
  )
}
