const Promise = require('bluebird');
const models = require('../../models');
const moment = require('moment');

exports.getTableData = (req, res) => {
  const startTime = new Date();
  
  const {
    venue,
    temp,
    windSpeed,
    windChill,
    startDate,
    endDate,
    precipitation,
  } = req.body;
  
  const tempAboveBelow = req.body.tempAboveBelow === 'above' ? '>=' : '<=';
  const windSpeedAboveBelow =
    req.body.windSpeedAboveBelow === 'above' ? '>=' : '<=';
  const windChillAboveBelow =
    req.body.windChillAboveBelow === 'above' ? '>=' : '<=';
  
  const query = (includeWeather) => {
    return models.sequelize.query(
      `SELECT
        AVG(home_score + away_score) AS combined_score, 
        (home_rush_yds + away_rush_yds) as total_rush_yds, 
        (home_rush_attempts + away_rush_attempts) as total_rush_attempts,
        (home_yds_per_carry + away_yds_per_carry) as total_yds_per_carry,
        (passing_yds_home + passing_yds_away) as passing_yds_total,
        (passing_attempts_home + passing_attempts_away) as passing_attempts_total,
        (passing_completion_home + passing_completion_away) as passing_completion_total,
        (passing_comp_pct_home + passing_comp_pct_away) as passing_comp_pct_total,
        SUM(turnovers_away + turnovers_home) AS turnovers_total, 
        (passing_int_home + passing_int_away) as passing_int_total,
        SUM(fumbles_lost_away + fumbles_lost_home) AS fumbles_total,
        SUM(away_score + home_score) AS total_score,
        venue.lat, venue.lng, COUNT(DISTINCT game.id) as count, venue.name, venue.team

        FROM game as game JOIN venue ON game.venue_id = venue.id ${includeWeather ? 'JOIN weather ON game.weather_id = weather.id' : ''}
      
      WHERE venue.name = :venue
      ${startDate ? `AND game.start_date >= '${startDate}'` : ''}
      ${endDate ? `AND game.end_date <= '${endDate}'` : ''}
      ${includeWeather ?
      `${precipitation === 'snow' ? `AND weather.snowfall > 0` : ''}
        ${precipitation === 'rain' ? `AND weather.precipitation > 0 AND weather.snowfall = 0` : ''}
        AND weather.temp ${tempAboveBelow} ${Number(temp)}
        AND weather.wind_chill ${windChillAboveBelow} ${Number(windChill)}
        AND weather.wind_speed ${windSpeedAboveBelow} ${Number(windSpeed)}` : ''
      }
      
      GROUP BY  ${includeWeather ? 'weather.id AND' : ''} venue.name AND venue.id AND venue.lat AND venue.lng AND venue.team AND total_rush_yds AND total_rush_attempts AND total_yds_per_carry AND passing_yds_total AND passing_attempts_total AND passing_completion_total AND passing_comp_pct_total AND passing_int_total
      ;`,
      {
        replacements: {
          venue,
          precipitation,
        },
        type: models.sequelize.QueryTypes.SELECT,
      },
    );
  };
  
  const statsWithWeather = query(true); // Include weather conditions
  const statsWithoutWeather = query(false); // Exclude weather conditions
  
  console.info('Fetching table data');
  Promise.all([
    statsWithWeather,
    statsWithoutWeather,
  ])
    .then(result => {
      const endTime = new Date();
      console.info('Received table data: ' + (endTime.getTime() - startTime.getTime()) / 1000 + ' s');
      const data = result[0] && result[0][0] || {};
      const dataWowx = result[1] && result[1][0] || {};

      const getPercentage = field => (((Number(data[field]) - Number(dataWowx[field])) / Number(dataWowx[field])) * 100).toFixed(2);
  
      // const whipAvgWowx = (Number(dataWowx.combined_pitching_bb) + Number(dataWowx.combined_batting_h)) /
      //   Number(dataWowx.combined_pitching_ip);
  
      // const whipAvg = (Number(data.combined_pitching_bb) + Number(data.combined_batting_h)) /
      //   Number(data.combined_pitching_ip);

      // const getWhipPercentage = () => {
      //   return (((whipAvg - whipAvgWowx) / whipAvgWowx) * 100).toFixed(2);
      // };
      
      const getDelta = (field, decimals) => (Number(data[field]) - Number(dataWowx[field])).toFixed(decimals);
      
      const getData = (field, label, decimals) => ({
        wowxAvg: Number(dataWowx[field]).toFixed(decimals),
        avg: Number(data[field]).toFixed(decimals),
        delta: getDelta(field, decimals),
        label,
        percentage: getPercentage(field),
      });
      
      res.json({
        lat: data.lat,
        lng: data.lng,
        team: data.team,
        stadium: data.name,
        count: data.count || 0,
        wowxCount: dataWowx.count || 0,
        total_score: getData('total_score', 'Total Score', 2),
        rushing: {
          rushing_yards: getData('total_rush_yds', 'Rushing Yards', 2),
          rushing_attempts: getData('total_rush_attempts', 'Rushing Attempts', 2),
          yards_per_carry: getData('total_yds_per_carry', 'Yards per Carry', 2)
        },
        passing: {
          passing_yds_total: getData('passing_yds_total', 'Passing Yards', 2),
          passing_attempts_total: getData('passing_attempts_total', 'Passing Attempts', 2),
          passing_completion_total: getData('passing_completion_total', 'Passing Completions', 2),
          passing_comp_pct_total: getData('passing_comp_pct_total', 'Passing Completion Percentage', 2)
        },
        turnovers: {
          turnovers_total: getData('turnovers_total', 'Total Turnovers', 2),
          passing_int_total: getData('passing_int_total', 'Interception', 2),
          fumbles_total: getData('fumbles_total', 'Fumbles', 2),
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};