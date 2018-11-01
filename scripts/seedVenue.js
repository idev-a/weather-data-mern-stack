const path = require('path');
var moment = require('moment-timezone');
const Promise =  require('bluebird');
const models =  require('../models');
const zone = 'Africa/Abidjan';

const { Venue, Game } = models;
const fs = Promise.promisifyAll(require('fs'));

const dataDir = path.resolve('comps', 'game-data');

fs.readdirAsync(dataDir).map(file =>
  fs
    .readFileAsync(`${dataDir}/${file}`)
    .then(content => {
      const data = JSON.parse(content.toString());
      return Promise.map(
        data,
        item => {
          const stat = { ...item };
          // stat.id = undefined;
          // const timeString = item.time
          //   ? item.time.match(/\d.*\./).replace(/\./g, '')
          //   : '12:00 pm';
          const time = moment(item.time, "H:mma").format("HH:mm:ss")
          const date = moment(item.date).format("YYYY-MM-DD");
          const dateObj = moment.tz(
            date + " " + time, zone
          );
          const duration = moment(item.time_of_game, 'H:mm');
          const durationHours = duration.hours();
          const durationMinutes = duration.minutes();
          const start_date = dateObj.format('YYYY-MM-DD HH:mm:ss');
          const end_date = dateObj
            .add({
              hours: durationHours,
              minutes: durationMinutes,
            })
            .format('YYYY-MM-DD HH:mm:ss');
          stat.time_of_possession_home = moment(item.time_of_possession_home, 'mm:ss').format('HH:mm:ss')  
          stat.time_of_possession_away = moment(item.time_of_possession_away, 'mm:ss').format('HH:mm:ss')  
          // console.log(stat);
          if (stat.stadium) {
            return Game.build({
              ...stat,
              start_date,
              end_date,
            }).save();
          } else {
            console.log('-------------', stat.id);
          }
        },
        { concurrency: 100 },
      );
    })
    .catch(err => {
      console.log('Content Error', err);
    }),
);
