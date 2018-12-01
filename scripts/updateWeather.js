var axios = require('axios');
const path = require('path');
var Promise = require('bluebird');
var moment = require('moment');
var Papa = require('papaparse');

var models = require('../models');

const fs = Promise.promisifyAll(require('fs'));
const { Weather, Game, Venue } = models;
const since = '2007-01-01';

const dataDir = path.resolve('comps');

fs.readFileAsync(`${dataDir}/WeatherBell_NFL_Wx.csv`)
    .then(content => {
      var results = Papa.parse(content.toString());
      return Promise.map(
        results.data,
        (item, index) => {
          if (index > 0) {
            const stat = {
              timestamp: item[6],
              cloud_cover: item[20],
              dew_point: item[9],
              feels_like: item[10],
              heat_index: item[12],
              pressure_msl: item[16],
              precipitation: item[19],
              pressure_tendency: 0,
              radiation_solar_total: 0,
              relative_humidity: item[13],
              specific_humidity: item[14],
              snowfall: item[20],
              pressure: item[15],
              temp: item[7],
              wind_chill: item[11],
              wind_direction: item[18],
              wind_direction_80m: 0,
              wind_direction_100m: 0,
              wind_speed: item[17],
              wind_speed_80m: 0,
              wind_speed_100m: 0,
              wet_bulb: item[8],
            }
            return Weather.create({
              ...stat,
            }).then(weather => {
              return  Game.update({ weather_id: weather.id }, {
                where: {
                  id: item[0]
                },
              }).catch(err=> { console.log('+++++++++++++') });
            }).catch(err => { console.log('==================='); });
          }
        },
        { concurrency: 10 },
      );
    })
    .catch(err => {
      console.log('Content Error', err);
    });

