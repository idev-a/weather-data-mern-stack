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
          const rush_home = item.rush_yds_tds_home.split('-');
          stat.home_rush_attempts = rush_home[0];
          stat.home_rush_yds = rush_home[1];
          stat.home_rush_tds = rush_home[2];
          stat.home_yds_per_carry = rush_home[1] / rush_home[0];
          const rush_away = item.rush_yds_tds_away.split('-');
          stat.away_rush_attempts = rush_away[0];
          stat.away_rush_yds = rush_away[1];
          stat.away_rush_tds = rush_away[2];
          stat.away_yds_per_carry = rush_away[1] / rush_away[0];
          const passing_home = item.cmp_att_yd_td_int_home.split('-');
          stat.passing_completion_home = passing_home[0];
          stat.passing_attempts_home = passing_home[1];
          stat.passing_yds_home = passing_home[2];
          stat.passing_td_home = passing_home[3];
          stat.passing_int_home = passing_home[4];
          stat.passing_comp_pct_home = stat.passing_completion_home / stat.passing_attempts_home;
          const passing_away = item.cmp_att_yd_td_int_away.split('-');
          stat.passing_completion_away = passing_away[0];
          stat.passing_attempts_away = passing_away[1];
          stat.passing_yds_away = passing_away[2];
          stat.passing_td_away = passing_away[3];
          stat.passing_int_away = passing_away[4];
          stat.passing_comp_pct_away = stat.passing_completion_away / stat.passing_attempts_away;
          stat.time_of_possession_home = moment(item.time_of_possession_home, 'mm:ss').format('HH:mm:ss')  
          stat.time_of_possession_away = moment(item.time_of_possession_away, 'mm:ss').format('HH:mm:ss')  
          // console.log(stat);
          if (stat.stadium) {
            return Venue.findOne({ where: { name: stat.stadium, team: stat.home} })
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
                  // console.log(stat.venue)
                } else {
                  // console.log(stat)
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
