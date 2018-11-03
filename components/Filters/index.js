import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import classnames from 'classnames';
import axios from 'axios';
import Autocomplete from 'react-autocomplete';
import DateTime from 'react-datetime';
import moment from 'moment';
import config from '../../config';

import '../../node_modules/react-datetime/css/react-datetime.css';
import styles from './Filters.scss';

class FiltersForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      venues: [],
      venue: '',
    };

    this.fetchVenues = this.fetchVenues.bind(this);
    this.handleShowVenue = this.handleShowVenue.bind(this);
  }

  componentDidMount() {
    this.props.submitForm();
  }

  handleShowVenue() {
    this.props.handleChange();
    this.fetchVenues();
  }

  fetchVenues(e, q) {
    axios
      .get(`${config.baseUrl}/api/v1/venue/search`, {
        params: { q },
      })
      .then(venues => {
        const venueNames = venues.data.map(venue => ({
          id: venue.id,
          name: venue.name,
          team: venue.team,
        }));
        this.setState(
          {
            venue: `${this.state.venue}${q}`,
            venues: venueNames,
          },
          () => {
            this.props.setFieldValue('venue', q);
          },
        );
      })
      .catch(err => {
        console.log('ERROR', err);
      });
  }
  
  renderError(field) {
    return this.props.touched[field]
      && this.props.errors[field]
      && (
        <div className="form-error">
          {this.props.errors[field]}
        </div>
      );
  }

  render() {
    const {
      handleSubmit,
      handleChange,
      handleReset,
      values,
      errors,
      touched
    } = this.props;
    return (
      <form className={classnames('frm', styles.form)} onSubmit={handleSubmit}>
        <div className="flex flex-wrap mb2">
          <div className="flex-auto mr2">
            <div>
              <label htmlFor="team">Home Team or Stadium Name</label>
              <Autocomplete
                wrapperStyle={{
                  display: 'block',
                  position: 'relative',
                  display: 'flex'
                }}
                getItemValue={item => item.name}
                items={this.state.venues}
                renderItem={(item, isHighlighted) => (
                  <div
                    key={`item-${Math.random()}`}
                    style={{
                      background: isHighlighted ? 'lightgray' : 'white',
                      padding: '5px 10px',
                      cursor: 'pointer',
                    }}
                  >
                    {`${item.name} - ${item.team}`}
                  </div>
                )}
                renderInput={props => (
                  <input
                    className="flex-auto"
                    name="venue"
                    type="text"
                    {...props}
                  />
                )}
                value={values.venue}
                onChange={this.fetchVenues}
                onSelect={value => this.props.setFieldValue('venue', value)}
                menuStyle={{
                  borderRadius: '3px',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: '2px 0',
                  fontSize: '90%',
                  position: 'fixed',
                  overflow: 'auto',
                  maxHeight: '50%',
                  zIndex: 3,
                }}
              />
            </div>
          </div>
          {/* <div className=" mr2">
            <label htmlFor="startDate">Show Retired Venues</label>
            <div className="flex justify-center mt1">
              <input
                type="checkbox"
                name="showRetiredVenues"
                checked={values.showRetiredVenues}
                onChange={handleChange}
              />
            </div>
          </div> */}
          <div className="flex mr2">
            <div className="mr2">
              <label htmlFor="startDate">Start Date/Time</label>
              <DateTime
                onChange={date => this.props.setFieldValue('startDate', typeof date === 'string' ? date : date.format('YYYY-MM-DD HH:mm:ss'))}
                value={this.props.values.startDate}
              />
              {this.renderError('startDate')}
            </div>
            <div>
              <label htmlFor="endDate">End Date/Time</label>
              <DateTime
                onChange={date => this.props.setFieldValue('endDate', typeof date === 'string' ? date : date.format('YYYY-MM-DD HH:mm:ss'))}
                value={this.props.values.endDate}
              />
              {touched.endDate && errors.endDate && <div className="form-error">{errors.endDate}</div>}
            </div>
          </div>
          <div className="flex">
            <button className="btn full mr2" type="submit">
              Retrieve Stats
            </button>
            <button
              className="btn full mr0"
              onClick={e => {e.preventDefault(); handleReset()}}
            >
              Reset
            </button>
          </div>
        </div>
        <div className="flex flex-wrap mb2">
          <div className="mr2 mb2">
            <label htmlFor="temp">Temperature</label>
            <div className="flex px1">
              <div className="flex items-center mr2">
                <input
                  type="radio"
                  name="tempAboveBelow"
                  value="above"
                  checked={values.tempAboveBelow === 'above'}
                  onChange={handleChange}
                />
                <label htmlFor="tempAboveBelow">
                  Above
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="tempAboveBelow"
                  value="below"
                  checked={values.tempAboveBelow === 'below'}
                  onChange={handleChange}
                />
                <label htmlFor="tempAboveBelow">
                  Below
                </label>
              </div>
            </div>
            <div className={styles.formGroup}>
              <input
                name="temp"
                type="text"
                value={values.temp}
                onChange={handleChange}
                maxLength="3"
              />
              <div className={styles.inputUnit}>°F</div>
            </div>
            {this.renderError('temp')}
          </div>
          <div className="mr2 mb2">
            <label htmlFor="temp">Humidity</label>
            <div className="flex px1">
              <div className="flex items-center mr2">
                <input
                  type="radio"
                  name="humidityAboveBelow"
                  value="above"
                  checked={values.humidityAboveBelow === 'above'}
                  onChange={handleChange}
                />
                <label
                  htmlFor="humidityAboveBelow"
                >
                  Above
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="humidityAboveBelow"
                  value="below"
                  checked={values.humidityAboveBelow === 'below'}
                  onChange={handleChange}
                />
                <label
                  htmlFor="humidityAboveBelow"
                >
                  Below
                </label>
              </div>
            </div>
            <div className={styles.formGroup}>
              <input
                name="humidity"
                type="text"
                value={values.humidity}
                onChange={handleChange}
                maxLength="3"
              />
              <div className={styles.inputUnit}>%</div>
            </div>
            {this.renderError('humidity')}
          </div>
          <div className="mr2 mb2">
            <label htmlFor="temp">Wind Speed</label>
            <div className="flex px1">
              <div className="flex items-center mr2">
                <input
                  type="radio"
                  name="windSpeedAboveBelow"
                  value="above"
                  checked={values.windSpeedAboveBelow === 'above'}
                  onChange={handleChange}
                />
                <label
                  htmlFor="windSpeedAboveBelow"
                >
                  Above
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="windSpeedAboveBelow"
                  value="below"
                  checked={values.windSpeedAboveBelow === 'below'}
                  onChange={handleChange}
                />
                <label
                  htmlFor="windSpeedAboveBelow"
                >
                  Below
                </label>
              </div>
            </div>
            <div className={styles.formGroup}>
              <input
                name="windSpeed"
                type="text"
                value={values.windSpeed}
                onChange={handleChange}
                maxLength="3"
              />
              <div className={styles.inputUnit}>mph</div>
            </div>
            {this.renderError('windSpeed')}
          </div>
          <div className="mr2">
            <label htmlFor="temp">Wind Chill</label>
            <div className="flex px1">
              <div className="flex items-center mr2">
                <input
                  type="radio"
                  name="windChillAboveBelow"
                  value="above"
                  checked={values.windChillAboveBelow === 'above'}
                  onChange={handleChange}
                />
                <label
                  htmlFor="windChillAboveBelow"
                >
                  Above
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="windChillAboveBelow"
                  value="below"
                  checked={values.windChillAboveBelow === 'below'}
                  onChange={handleChange}
                />
                <label
                  htmlFor="windChillAboveBelow"
                  className={styles.radioLabel}
                >
                  Below
                </label>
              </div>
            </div>
            <div className={styles.formGroup}>
              <input
                name="windChill"
                type="text"
                value={values.windChill}
                onChange={handleChange}
                maxLength="3"
              />
              <div className={styles.inputUnit}>mb</div>
            </div>
            {this.renderError('windChill')}
          </div>
          <div className="">
            <label htmlFor="precipitation">Precipitation</label>
            <div className={classnames('blk select', styles.precipitation)}>
              <div className="icn">
                <span className="icn-arw-up" />
                <span className="icn-arw-down" />
              </div>
              <select
                name="precipitation"
                onChange={handleChange}
              >
                <option value="">None</option>
                <option value="rain">Rain</option>
                <option value="snow">Snow</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

FiltersForm.propTypes = {
  values: PropTypes.object,
  onSubmit: PropTypes.func,
  submitForm: PropTypes.func,
};

FiltersForm.defaultProps = {
  values: {},
  onSubmit: () => {},
  submitForm: () => {},
};

export default (
  withFormik({
    mapPropsToValues: () => ({
      venue: 'Qualcomm Stadium',
      temp: 0,
      humidity: 0,
      windSpeed: "0",
      windChill: 0,
      showRetiredVenues: false,
      humidityAboveBelow: 'above',
      tempAboveBelow: 'above',
      windSpeedAboveBelow: 'above',
      windChillAboveBelow: 'above',
      precipitation: '',
      startDate: '',
      endDate: '',
    }),
    validate: (values, props) => {
      const errors = {};
      
      ['temp', 'humidity', 'windSpeed'].forEach(field => {
        if (!/^[\d]*$/i.test(values[field])) {
          errors[field] = 'Please enter integer value'
        }
        
        if (values[field] === '') {
          values[field] = 0;
        }
      });
      const dateRegEx = /\d{4}-{1}\d{2}-{1}\d{2} ([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]/i;
      
      if (!dateRegEx.test(values.startDate) && values.startDate !== '') {
        errors.startDate = 'Please enter valid date';
      }
  
      if (!dateRegEx.test(values.endDate) && values.endDate !== '') {
        errors.endDate = 'Please enter valid date';
      }
      
      return errors;
    },
    handleSubmit: (values, { props }) => {
      props.onSubmit(values);
    },
    displayName: 'FilterForm',
  })(FiltersForm));
