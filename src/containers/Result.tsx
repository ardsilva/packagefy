import React, { Component } from "react";
import Chart from 'react-apexcharts';

interface ResultProps {
  value1: any
  value2: any
  value3: any
  value4: any
}

interface ResultsState {
  series: any;
  options: any;
}
class Result extends Component<ResultProps, ResultsState> {
  constructor(props: any) {
    super(props);
    const { value1, value2, value3, value4 } = this.props;
    this.state = {
      series: [{
        name: 'Unpacked',
        data: [value1.sizes.bundle,
        value2.sizes.bundle,
        value3.sizes.bundle,
        value4.sizes.bundle]
      }, {
        name: 'Gzipped',
        data: [value1.sizes.gzipped,
        value2.sizes.gzipped,
        value3.sizes.gzipped,
        value4.sizes.gzipped]
      }],
      options: {
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: false
          },
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 180
            }
          }
        }],
        xaxis: {
          categories: [this.props.value1.version,
          this.props.value2.version,
          this.props.value3.version,
          this.props.value4.version],
          title: {
            text: "Latest 3 versions, and latest 'Major-1' version ",
            offsetX: 0,
            offsetY: 0,
            style: {
              color: undefined,
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              cssClass: 'apexcharts-xaxis-title',
            },
          },
        },
        yaxis: {
          title: {
            text: "Size(in KB)",
            offsetX: 0,
            offsetY: 0,
            style: {
              color: undefined,
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              cssClass: 'apexcharts-xaxis-title',
            },
          },
        },
        fill: {
          opacity: 1,
          background: 'black'
        },
        legend: {
          position: 'right',
          offsetX: 0,
          offsetY: 50
        },
        tooltip: {
          'theme': 'dark'
        },
        title: {
          text: "Comparative Chart",
          align: 'center',
          margin: 10,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: undefined,
            color: '#263238'
          },
        }

      },
    };
  }



  render() {
    return (
      <div id="chart" style={{
        marginBottom: 10,
        width: 650,
        height: 350
      }}>
        <Chart options={this.state.options} series={this.state.series} type="bar" height={350} />
      </div>
    )
  }
}

export default Result;