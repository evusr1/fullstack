import axios from 'axios'

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
const iconUrl = 'http://openweathermap.org/img/wn/'
const api_key = process.env.REACT_APP_API_KEY

const getCoord = (lat, lng) => {
    const request = axios.get(`${baseUrl}?lat=${lat}&lon=${lng}&units=metric&appid=${api_key}`)
    return request.then(response => response.data)
}

const getIconUrl = (icon) => 
    iconUrl + icon + "@2x.png"

export default { getCoord, getIconUrl } 