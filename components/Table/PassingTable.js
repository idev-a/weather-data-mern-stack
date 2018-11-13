import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Loader from '../Loader';
import s from './Table.scss';

const PassingTable = ({ data, loading }) => {
  return (
    <div className={s.tableWrapper}>
      {data && !loading ? (
        <div>
        <Loader />
          <h2 className={s.tableHeading}>Passing</h2>
          <table className={classnames(s.table, 'tbl')}>
            <tbody>
              <tr>
                <th></th>
                <th>Passing Yards </th>
                <th>Passing attempts</th>
                <th>Passing completions </th>
                <th>Passing completion percentage </th>
              </tr>
              <tr key="passing-table-wowxAvg">
                <td><strong>W/O Wx Avg</strong></td>
                <td>{data.passing_yds_total.wowxAvg}</td>
                <td>{data.passing_attempts_total.wowxAvg}</td>
                <td>{data.passing_completion_total.wowxAvg}</td>
                <td>{data.passing_comp_pct_total.wowxAvg}</td>
              </tr>
              <tr key="passing-table-avg">
                <td><strong>Average</strong></td>
                <td>{data.passing_yds_total.avg}</td>
                <td>{data.passing_attempts_total.avg}</td>
                <td>{data.passing_completion_total.avg}</td>
                <td>{data.passing_comp_pct_total.avg}</td>
              </tr>
              <tr>
                <td><strong>Δ</strong></td>
                <td>{data.passing_yds_total.delta}</td>
                <td>{data.passing_attempts_total.delta}</td>
                <td>{data.passing_completion_total.delta}</td>
                <td>{data.passing_comp_pct_total.delta}</td>
              </tr>
            </tbody>
          </table>
          <br/>
        </div>
      ) : <Loader />}
    </div>
  );
};

PassingTable.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
};

PassingTable.defaultProps = {
  data: null,
  loading: false,
};

export default PassingTable;
