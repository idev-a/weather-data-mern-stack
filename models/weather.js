module.exports = (sequelize, DataTypes) => {
  const Weather = sequelize.define(
    'Weather',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      timestamp: {
        type: DataTypes.DATE,
      },
      cloud_cover: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      dew_point: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      feels_like: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      heat_index: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      pressure_msl: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      precipitation: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      pressure_tendency: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      radiation_solar_total: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      relative_humidity: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      specific_humidity: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      snowfall: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      pressure: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      temp: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      wind_chill: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      wind_direction: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      wind_direction_80m: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      wind_direction_100m: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      wind_speed: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      wind_speed_80m: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      wind_speed_100m: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      wet_bulb: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
    },
    {
      tableName: 'weather',
      timestamps: false,
    },
  );

  Weather.associate = db => {
    Weather.belongsTo(db.Game, {
      foreignKey: 'weather_id',
      targetKey: 'id',
    });
  };

  return Weather;
};
