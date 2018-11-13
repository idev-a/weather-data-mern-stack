const getColor = (data, key) => {
  if (['bb', 'era', 'whip'].indexOf(key) > -1) {
    return data[key].delta <= 0 ? '#13dd01' : '#ee0009';
  } else if (['rbi', 'tr', 'gb', 'ld'].indexOf(key) > -1) {
    return data[key].percentage > 0 ? '#13dd01' : '#ee0009';
  } else {
    return data[key].delta > 0 ? '#13dd01' : '#ee0009';
  }
};

const convertDirectionToDegrees = direction => {
  const map = {
    N: 0,
    NNE: 22.5,
    NE: 45,
    ENE: 67.5,
    E: 90,
    ESE: 112.5,
    SE: 135,
    SSE: 157.5,
    S: 180,
    SSW: 202.5,
    SW: 225,
    WSW: 247.5,
    W: 270,
    WNW: 292.5,
    NW: 315,
    NNW: 337.5,
  };
  
  return map[direction];
};

const convertWindDirection = (windDirection, stadiumOrientaion) => {
  let diff = windDirection - stadiumOrientaion;
  diff = diff < 0 ? diff + 360 : diff;
  
  if (diff > 46 && diff < 135 || diff > 226 && diff < 315) {
    return 'cross';
  } else if (diff > 136 && diff < 225) {
    return 'in';
  } else if (diff > 316 || diff < 45) {
    return 'out';
  }
  return 'cross';
};

module.exports = {
  convertWindDirection: convertWindDirection,
  convertDirectionToDegrees: convertDirectionToDegrees,
  getColor: getColor,
}