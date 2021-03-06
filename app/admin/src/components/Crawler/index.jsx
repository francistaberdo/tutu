import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import { Segment, Grid, Label } from 'semantic-ui-react';
import { addLog, fetchLogs, fetchStats, incErrorCount, incSuccessCount } from '../../modules/crawler';
import CrawlerFeed from './CrawlerFeed';
import './styles.css';
import { DATE_FORMAT } from '../../constants';

const mapStateToProps = ({
  crawler: {
    stats,
    logs,
    fetchStatsStatus,
    fetchLogsStatus,
  },
  socket,
}) => ({
  stats,
  logs,
  fetchStatsStatus,
  fetchLogsStatus,
  socket,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchStats,
  incSuccessCount,
  incErrorCount,
  fetchLogs,
  addLog,
}, dispatch);

class Crawler extends Component {
  componentDidMount() {
    const { socket } = this.props;

    this.props.fetchStats(() => {
      const { stats: { labels } } = this.props;
      let latest = labels[labels.length - 1];

      socket.on('crawlLog', (log) => {
        const logDate = moment(log.timestamp).format(DATE_FORMAT);

        if (logDate !== latest) {
          latest = logDate;
          this.props.fetchStats();
        } else if (log.status === 'success') {
          this.props.incSuccessCount();
        } else if (log.status === 'error') {
          this.props.incErrorCount();
        }

        this.props.addLog(log);
      });
    });

    this.props.fetchLogs();
  }

  componentWillUnmount() {
    this.props.socket.removeAllListeners();
  }

  render() {
    const { stats, logs } = this.props;
    const statsData = {
      labels: stats.labels,
      datasets: [
        {
          label: 'Success',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: stats.successCounts,
        },
        {
          label: 'Error',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(255,99,132,0.4)',
          borderColor: 'rgba(255,99,132,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(255,99,132,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(255,99,132,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: stats.errorCounts,
        },
      ],
    };

    return (
      <div className="crawler-container">
        <Grid>
          <Grid.Row>
            <Grid.Column width={7}>
              <Segment>
                <Line data={statsData} />
              </Segment>
              {/* <Segment>
                <Line data={statsData} />
              </Segment> */}
            </Grid.Column>

            <Grid.Column width={9}>
              <Segment>
                <Label color="teal" ribbon>Activity Feed</Label>
                <CrawlerFeed logs={logs} />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Crawler);

