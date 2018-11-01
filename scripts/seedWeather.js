var axios = require('axios');
var Promise = require('bluebird');
var moment = require('moment');

var models = require('../models');


const { Weather, Game, Venue } = models;
const since = '2007-01-01';

Game.findAll({ include: [Venue] }).then(games => {
  Promise.each(games, game => {
    if (moment(game.date).isAfter(since)) {
      return axios
        .get(
          `https://api.weathersource.com/v1/750fe3bf727e29422ece/points/${
            game.Venue.lat
          },${
            game.Venue.lng
          }/history.json?period=hour&timestamp_between=${moment(
            game.start_date,
          ).format('YYYY-MM-DD[T]HH:mm:ss')},${moment(game.end_date).format(
            'YYYY-MM-DD[T]HH:mm:ss',
          )}`,
        )
        .then(response => {
          const data = response.data.reduce(
            (result, item) => ({
              cloud_cover: result.cloud_cover + item.cldCvr,
              dew_point: result.dew_point + item.dewPt,
              feels_like: result.feels_like + item.feelsLike,
              heat_index: result.heat_index + item.heatIndex,
              pressure_msl: result.pressure_msl + item.mslPres,
              precipitation: result.precipitation + item.precip,
              pressure_tendency: result.pressure_tendency + item.presTend,
              radiation_solar_total: result.radiation_solar_total + item.radSolar,
              relative_humidity: result.relative_humidity + item.relHum,
              pressure: result.pressure + item.sfcPres,
              snowfall: result.snowfall + item.snowfall,
              specific_humidity: result.specific_humidity + item.spcHum,
              temp: result.temp + item.temp,
              wet_bulb: result.wet_bulb + item.wetBulb,
              wind_chill: result.wind_chill + item.windChill,
              wind_direction: result.wind_direction + item.windDir,
              wind_direction_80m: result.wind_direction_80m + item.windDir80m,
              wind_direction_100m: result.wind_direction_100m + item.windDir100m,
              wind_speed: result.wind_speed + item.windSpd,
              wind_speed_80m: result.wind_speed_80m + item.windSpd80m,
              wind_speed_100m: result.wind_speed_100m + item.windSpd100m,
            }),
            {
              cloud_cover: 0,
              dew_point: 0,
              feels_like: 0,
              heat_index: 0,
              pressure_msl: 0,
              precipitation: 0,
              pressure_tendency: 0,
              radiation_solar_total: 0,
              relative_humidity: 0,
              pressure: 0,
              snowfall: 0,
              specific_humidity: 0,
              temp: 0,
              wet_bulb: 0,
              wind_chill: 0,
              wind_direction: 0,
              wind_direction_80m: 0,
              wind_direction_100m: 0,
              wind_speed: 0,
              wind_speed_80m: 0,
              wind_speed_100m: 0,
            },
          );

          console.log (data);

          Object.keys(data).forEach(key => {
            if (key != 'timestamp') {
              data[key] = (data[key] / response.data.length).toFixed(2);
            }
          });

          return Weather.create({
            ...data,
          }).then(weather => game.update({ weather_id: weather.id }));
        })
        .then(result => {
          // console.log('Weather created', result);
        })
        .catch(err => {
          console.log('ERROR', err);
        });
    }
  });
});
