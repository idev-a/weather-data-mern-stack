import path from 'path';
var moment = require('moment-timezone');
import Promise from 'bluebird';
import models from '../models';
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
          const dateObj = moment(
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
          console.log(stat);
          if (stat.stadium) {
            return Venue.findOne({ where: { name: stat.stadium } })
              .then(venue => {
                if (venue) {
                  return Game.build({
                    ...stat,
                    start_date,
                    end_date,
                    venue_id: venue.id,
                    weather_id: 1,
                  }).save();
                } else if (/disney|tokyo|bragg|sydney/i.test(stat.venue)) {
                  console.log(stat.venue)
                } else {
                  console.log(stat)
                }
              })
              .then(stats => {
                // console.log('Success', stats);
              })
              .catch(err3 => {
                console.log(stat.away_pitching_era)
                console.log('Error', err3);
              });
          }
        },
        { concurrency: 100 },
      );
    })
    .catch(err => {
      console.log('Content Error', err);
    }),
);
