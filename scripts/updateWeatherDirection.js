const Promise = require('bluebird');
const models = require('../models');
const { convertWindDirection } = require('../utils');

const { Weather } = models;

models.sequelize.query(`
    SELECT game.id as game_id, weather.wind_direction as wind_direction, venue.orientationDeg as orientation_deg
      FROM game
        JOIN venue ON game.venue_id = venue.id
        JOIN weather ON game.weather_id = weather.id
    ;
    `,
  {
    type: models.sequelize.QueryTypes.SELECT,
  },
).then(result => {
  return Promise.map(
    result,
    item => {
      return Weather.update(
        {
          wind_field_direction: convertWindDirection(
            item.wind_direction,
            item.orientation_deg,
          ),
        },
        {
          where: { id: item.weather_id },
        },
      )
        .then(result => {
          console.log(result)
        })
        .catch(err => {
          console.log('ERROR', err);
        });
      
    },
    { concurrency: 20 },
  );
}).catch(err => {
  console.log(err)
});
