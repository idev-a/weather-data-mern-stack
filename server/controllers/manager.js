var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
// var dateFormat = require('dateformat');
const config = require('../config');
var moment = require('moment');

// Configure MySQL connection
var connection = mysql.createConnection({
	host: 'localhost',
	user: config.mysql.username,
	password: config.mysql.password,
    database: config.mysql.database,
    multipleStatements: true,
  })

//Establish MySQL connection
connection.connect();

const GAME_PATH = path.resolve('comps', 'game-data');

module.exports.importData = function() {
    console.log(GAME_PATH);
    fs.readdir(GAME_PATH, function(err, items) {
        var json_array = [];
        for (var i=0; i<items.length; i++) {
            var file = GAME_PATH + '/' + items[i];

            var contents = fs.readFileSync(file);
            var jsonContent = JSON.parse(contents);
            for(var i = 0; i < jsonContent.length; i++){
                var game  = jsonContent[i]
                // const timeString = game['time']
                //     ? game['time'].match(/\d.*\./)[0].replace(/\./g, '')
                //     : '12:00 pm';
                // const dateObj = moment(
                //     `${game['date']} ${timeString}`,
                //     'dddd, MMMM D, YYYY h:mm a',
                // );
                // const duration = moment(game['time_of_game'], 'H:mm');
                // const durationHours = duration.hours();
                // const durationMinutes = duration.minutes();
                // game['start_date'] = dateObj.format('YYYY-MM-DD[T]HH:mm:ss');
                // game['end_date'] = dateObj
                //     .add({
                //     hours: durationHours,
                //     minutes: durationMinutes,
                //     })
                //     .format('YYYY-MM-DD[T]HH:mm:ss');
                game['date'] = moment(game['date']).format("YYYY-MM-DD[T]HH:mm:ss");
                game['time'] = moment(game['time'], "H:mma").format("HH:mm");
                game['time_of_game'] = moment(game['time_of_game'], "H:mm").format("HH:mm");
                console.log(game);
                var query = connection.query('INSERT INTO game SET ?', game, function(err, result) {
                    if  (err != null) {
                        console.log('--insert game data -- ', err);
                    } else {
                        console.log('--insert game data -- ', result);
                    }
                });
            }
        }

        // con.connect(function(err) {
        //     if (err) throw err;
        //     console.log("Connected!");
        //     var sql = "INSERT INTO customers (id, home, home_score, home_record, away, away_score, away_record,date, time, stadium, time_of_game, first_downs_home, first_downs_away, rush_yds_tds_home, rush_yds_tds_away, cmp_att_yd_td_int_home, cmp_att_yd_td_int_away, sacked_yards_home, sacked_yards_away, net_pass_yards_home, net_pass_yards_away, total_yards_home, total_yards_away，fumbles_lost_home，fumbles_lost_away，turnovers_home， turnovers_away， penalties_yards_home， penalties_yards_away， third_down_conv_home， third_down_conv_away， fourth_down_conv_home， fourth_down_conv_away， time_of_possession_home， time_of_possession_away) VALUES ?";
        //     con.query(sql, json_array, function (err, result) {
        //         if (err) throw err;
        //         console.log("Number of records inserted: " + result.affectedRows);
        //       });
        //     });
    });
}