import React, { useEffect, useState } from 'react';
import { createDiaryEntry, getAllDiaryEntries } from './services/diaryService';
import { DiaryEntry, Visibility, Weather } from './types';
import axios from 'axios';

function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState('');
  const [weather, setWeather] = useState('');
  const [comment, setComment] = useState('');
  
  const [notification, setNotification] = useState('');

  useEffect(() => {
    getAllDiaryEntries().then(data => {
      setDiaries(data);
    })
  }, [])

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    createDiaryEntry({date, visibility, weather, comment})
      .then(newEntry => setDiaries(diaries.concat(newEntry)))
      .catch(error => {
        if(axios.isAxiosError(error)) {
          if(error.response)
            setNotification(error.response.data);
        }
      })
  }

  return (
    <>
      <h2>Add new entry</h2>
      <div style={{color: "red"}}>{notification}</div>
      <form onSubmit={handleSubmit} >
        date: <input type="date" onChange={({target}) => setDate(target.value)} value={date}/><br />
        visibility:
          {(Object.keys(Visibility) as Array<keyof typeof Visibility>).map(key => 
            <label key={Visibility[key]}>
              <input
                name="visibility"
                type="radio"
                onChange={() => setVisibility(Visibility[key])}
              /> {key}
            </label>
          )}<br />
        weather:
          {(Object.keys(Weather) as Array<keyof typeof Weather>).map(key => 
            <label key={Weather[key]}>
              <input
                type="radio"
                name="weather"
                onChange={() => setWeather(Weather[key])}
              /> {key}
            </label>
          )}<br />
        comment: <input type="text" onChange={({target}) => setComment(target.value)} value={comment}/><br />
        <button>add</button>
      </form>
      <h2>Diary Entries</h2>
      <ul>
        {diaries.map(entry => (
          <li key={entry.id}>
            <h3>{entry.date}</h3>
            Visibility: {entry.visibility}<br />
            Weather: {entry.weather}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
