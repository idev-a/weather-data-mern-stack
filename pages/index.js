import React from 'react';
import axios from 'axios';
import moment from 'moment';
import Head from 'next/head'
import Layout from '../components/Layout';
import Map from '../components/Map';
import Filters from '../components/Filters';
import RushingTable from '../components/Table/RushingTable';
import PassingTable from '../components/Table/PassingTable';
import TurnoversTable from '../components/Table/TurnoversTable';
import PercentageHeader from '../components/PercentageHeader';
import PercentageSection from '../components/PercentageSection';
import Alert from '../components/Alert';
import ResultsMessage from '../components/ResultMessage';
const config = require('../config');

class Index extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      lat: 0,
      lng: 0,
      passing: null,
      rushing: null,
      isLoading: false,
      hasResults: false,
      alerts: [],
      count: 0
    };
    
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }
  
  handleFormSubmit(values) {
    console.log(values);
  
    this.setState({
      isLoading: true,
      startDate: values.startDate ? moment(values.startDate).format('MM/DD/YYYY') : '',
      endDate: values.endDate ? moment(values.endDate).format('MM/DD/YYYY') : ''
    });
  
    axios
      .post(`${config.baseUrl}/api/v1/filter/table`, {...values})
      .then(result => {
        console.log(result);
        const hasEmptyResults = result.data.count === 0;
        const alerts = [];
      
        if (hasEmptyResults) {
          alerts.push({type: 'info', message: 'There are 0 results matching this weather criteria.'})
        }
        
        this.setState({
          lat: result.data.lat || this.state.lat,
          lng: result.data.lng || this.state.lng,
          rushing: result.data.rushing,
          passing: result.data.passing,
          turnovers: result.data.turnovers,
          team: result.data.team,
          total_score: result.data.total_score,
          stadium: result.data.stadium,
          isLoading: false,
          alerts,
          hasResults: result.data.count,
          count: result.data.count
        });
        console.log('Table data', result.data);
      })
      .catch(err => {
        console.log('ERROR', err);
      });
  }
  
  renderMessages() {
    return this.state.alerts.map((alert, key) => {
      return <Alert  key={`alert-${key}`} type={alert.type}>{alert.message}</Alert>;
    });
  }
  
  render() {
    return (
      <Layout>
        <Head>
          <title>Rotogrinders</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link href="https://rical-rg.s3.amazonaws.com/css/styleguide.css" rel="stylesheet" />
        </Head>
        <Map
          height={220}
          lat={Number(this.state.lat)}
          lng={Number(this.state.lng)}
          team={this.state.team}
          stadium={this.state.stadium}
        />
        <div className="container">
          {this.renderMessages()}
          <Filters onSubmit={this.handleFormSubmit} />
          {this.state.hasResults || this.state.isLoading ? <div>
            {this.state.passing && (<PercentageHeader
                loading={this.state.isLoading}
                data={{
                  tp: { ...this.state.passing.passing_yds_total, ...{ icon: '' }},
                  ts: { ...this.state.total_score, ...{ icon: '' }},
                  tr: { ...this.state.rushing.rushing_yards, ...{ icon: '' }}
                }}
              />)}
            <RushingTable loading={this.state.isLoading} data={this.state.rushing} />
            <PercentageSection loading={this.state.isLoading} data={this.state.rushing} type="rushing"/>
            <ResultsMessage count={this.state.count} startDate={this.state.startDate} endDate={this.state.endDate} />
            <PassingTable loading={this.state.isLoading} data={this.state.passing} />
            <PercentageSection loading={this.state.isLoading} data={this.state.passing} type="passing"/>
            <ResultsMessage count={this.state.count} startDate={this.state.startDate} endDate={this.state.endDate} />
            <TurnoversTable loading={this.state.isLoading} data={this.state.turnovers} />
            <PercentageSection loading={this.state.isLoading} data={this.state.turnovers} type="turnovers"/>
            <ResultsMessage count={this.state.count} startDate={this.state.startDate} endDate={this.state.endDate} />
          </div> : <div className="no-results">No Results</div>
          }
        </div>
      </Layout>
    );
  }
}

export default Index;
