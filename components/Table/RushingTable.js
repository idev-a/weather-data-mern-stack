import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Loader from '../Loader';

import s from './Table.scss';

const RushingTable = ({ data, loading }) => {
  return (
    <div className={s.tableWrapper}>
      {data && !loading ? (
        <div>
          <h2 className={s.tableHeading}>Rushing</h2>
          <table className={classnames(s.table, 'tbl')}>
            <tbody>
              <tr>
                <th></th>
                <th>Rushing yards </th>
                <th>Rushing Attempts</th>
                <th>Yards per Carry</th>
              </tr>
              <tr key="batting-table-wowxAvg">
                <td><strong>W/O Wx Avg</strong></td>
                <td>{data.rushing_yards.wowxAvg}</td>
                <td>{data.rushing_attempts.wowxAvg}</td>
                <td>{data.yards_per_carry.wowxAvg}</td>
              </tr>
              <tr key="batting-table-avg">
                <td><strong>Average</strong></td>
                <td>{data.rushing_yards.avg}</td>
                <td>{data.rushing_attempts.avg}</td>
                <td>{data.yards_per_carry.avg}</td>
              </tr>
              <tr>
                <td><strong>Δ</strong></td>
                <td>{data.rushing_yards.delta}</td>
                <td>{data.rushing_attempts.delta}</td>
                <td>{data.yards_per_carry.delta}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : <Loader />}
    </div>
  );
};

RushingTable.propTypes = {
  data: PropTypes.shape({
    away: PropTypes.object,
    home: PropTypes.object,
  }),
  loading: PropTypes.bool,
};

RushingTable.defaultProps = {
  data: null,
  loading: false,
};

export default RushingTable;
