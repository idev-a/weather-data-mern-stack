const Promise = require('bluebird');
const models = require('../models');
const { convertDirectionToDegrees } = require('../utils');

const { Venue } = models;


Venue.findAll().then(venues => {
  Promise.map(
    venues,
    venue =>
      venue
        .update({ orientationDeg: convertDirectionToDegrees(venue.orientation) })
        .then(result => {
          console.log(result);
        })
        .catch(err => {
          console.log('ERROR', err);
        }),
    { concurrency: 20 },
  );
});
