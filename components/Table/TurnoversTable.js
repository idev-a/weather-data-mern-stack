import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Loader from '../Loader';

import s from './Table.scss';

const TurnoversTable = ({ data, loading }) => {
  return (
    <div className={s.tableWrapper}>
      {data && !loading ? (
        <div>
          <h2 className={s.tableHeading}>Points and Turnovers</h2>
          <table className={classnames(s.table, 'tbl')}>
            <tbody>
              <tr>
                <th></th>
                <th>Total Turnovers</th>
                <th>Interceptions</th>
                <th>Fumbles</th>
                <th>Total Points</th>
              </tr>
              <tr key="Turnovers-table-wowxAvg">
                <td><strong>W/O Wx Avg</strong></td>
                <td>{data.turnovers_total.wowxAvg}</td>
                <td>{data.passing_int_total.wowxAvg}</td>
                <td>{data.fumbles_total.wowxAvg}</td>
                <td>{data.total_points.wowxAvg}</td>
              </tr>
              <tr key="Turnovers-table-avg">
                <td><strong>Average</strong></td>
                <td>{data.turnovers_total.avg}</td>
                <td>{data.passing_int_total.avg}</td>
                <td>{data.fumbles_total.avg}</td>
                <td>{data.total_points.avg}</td>
              </tr>
              <tr>
                <td><strong>Δ</strong></td>
                <td>{data.turnovers_total.delta}</td>
                <td>{data.passing_int_total.delta}</td>
                <td>{data.fumbles_total.delta}</td>
                <td>{data.total_points.delta}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : <Loader />}
    </div>
  );
};

TurnoversTable.propTypes = {
  data: PropTypes.shape({
    away: PropTypes.object,
    home: PropTypes.object,
  }),
  loading: PropTypes.bool,
};

TurnoversTable.defaultProps = {
  data: null,
  loading: false,
};

export default TurnoversTable;
