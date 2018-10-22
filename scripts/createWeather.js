import Promise from 'bluebird';
import { Game, Weather } from '../src/server/models/index';

// Create sample game data
Game.findAll().then(games => {
  Promise.map(
    games,
    game =>
      Weather.create({
        cldCvrMin: 0,
        cldCvrAvg: 1,
        cldCvrMax: 10,
        dewPtMin: 23.8,
        dewPtAvg: 27,
        dewPtMax: 29.6,
        feelsLikeMin: 28.7,
        feelsLikeAvg: 40.2,
        feelsLikeMax: 52.7,
        heatIndexMin: 31.4,
        heatIndexAvg: 41.9,
        heatIndexMax: 52.7,
        mslPresMin: 1020.4,
        mslPresAvg: 1022.9,
        mslPresMax: 1025.7,
        precip: 0,
        presTendMin: -0.5,
        presTendAvg: 0.2,
        presTendMax: 1,
        radSolarMin: 0,
        radSolarAvg: 203.3,
        radSolarMax: 549.1,
        radSolarTot: 3253,
        relHumMin: 39,
        relHumAvg: 56,
        relHumMax: 79,
        sfcPresMin: 998,
        sfcPresAvg: 999.9,
        sfcPresMax: 1002.6,
        snowDepth: 0,
        snowfall: 0,
        spcHumMin: 2.7,
        spcHumAvg: 3.1,
        spcHumMax: 3.5,
        tempMin: 31.4,
        tempAvg: 41.9,
        tempMax: 52.7,
        windChillMin: 28.7,
        windChillAvg: 40.2,
        windChillMax: 52.7,
        windDirAvg: 284,
        windDir80mAvg: 296,
        windDir100mAvg: 296,
        windSpdMin: 0.9,
        windSpdAvg: 2.6,
        windSpdMax: 4.5,
        windSpd80mMin: 1.2,
        windSpd80mAvg: 3.1,
        windSpd80mMax: 5.9,
        windSpd100mMin: 1.2,
        windSpd100mAvg: 3.1,
        windSpd100mMax: 5.8,
        wetBulbMin: 29.4,
        wetBulbAvg: 36.5,
        wetBulbMax: 43.6,
      })
        .then(weather => game.update({ weather_id: weather.id }))
        .then(() => {
          console.log(`Game ${game} updated`);
        })
        .catch(err => {
          console.log('Error', err);
        }),
    { concurrency: 20 }
  );
});
