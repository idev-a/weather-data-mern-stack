import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PercentageCircle from '../PercentageCircle';
import classnames from 'classnames';
import { getColor } from '../../utils';

import s from './PercentageSection.scss';

const PercentageSection = ({ data }) => {

  const renderPercentages = () => {
    if (data) {
      return Object.keys(data).map(key => {
        const stat = data[key];
        const adjustedValue = Math.abs(Number(stat.percentage)) * 4;
        
        return (
          <div
            className="col-xs-12 col-sm-6 col-md-3"
            key={`percentage-${key}`}
          >
            <div className={classnames(s.label, 'center')}>{stat.label}</div>
            <PercentageCircle
              percent={stat.percentage}
              radius={60}
              color={getColor(data, key)}
              borderWidth={20}
            >
              <div className={s.percentage}>{Number(stat.percentage) > 0 ? '+' : ''}{Number(stat.percentage)} %</div>
            </PercentageCircle>
          </div>
        )
      });
    }
  };

  return (
      <div className={classnames(s.percentageSection, 'row',  'center-xs')}>
        {renderPercentages()}
      </div>
  );
};

PercentageSection.propTypes = {
  data: PropTypes.object,
  type: PropTypes.string,
  loading: PropTypes.bool,
};

PercentageSection.defaultProps = {
  data: null,
  type: '',
  loading: false,
};

export default PercentageSection;
