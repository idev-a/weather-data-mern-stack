import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StaticMap } from 'react-map-gl';
import classnames from 'classnames';
import s from './Map.scss';
import 'mapbox-gl/dist/mapbox-gl.css';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: props.lat || 33.735278,
        longitude: props.lng || -84.389444,
        zoom: 15.5,
        bearing: 0,
        pitch: 0,
        width: 600,
        height: 300,
      },
    };
  }
  
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.lat && nextProps.lng) {
      return {
        viewport: {
          ...prevState.viewport,
          latitude: nextProps.lat,
          longitude: nextProps.lng,
        },
      }
    }
    return null;
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight,
      },
    });
  };

  render() {
    return (
      <div className={classnames(s.wrapper, 'mb2')}>
        <div>
          <StaticMap
            {...this.state.viewport}
            width={typeof window !== 'undefined' && window.innerWidth}
            height={this.props.height}
            mapStyle="mapbox://styles/weatherbell/cje6hsqkwge1g2rq933i04tu3"
            onViewportChange={viewport => this.setState({ viewport })}
            interactive={false}
            attributionControl={false}
          />
        </div>
        <div className={s.teamWrapper}>
          <div className={s.teamName}>
            {this.props.team}
          </div>
          <div className={s.stadiumName}>
            {this.props.stadium}
          </div>
        </div>
      </div>
      
    );
  }
}

Map.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  lat: PropTypes.number,
  lng: PropTypes.number,
  team: PropTypes.string,
  stadium: PropTypes.string,
};

Map.defaultProps = {
  width: 600,
  height: 300,
  lat: 33.735278,
  lng: -84.389444,
  team: 'Rotogrinders',
  stadium: 'Game Query Tool',
};

export default Map;
