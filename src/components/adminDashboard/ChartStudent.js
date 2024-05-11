import React from 'react';
import ReactApexChart from 'react-apexcharts';

class ChartStudent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: 'دانش آموزان دوره ها',
          data: [100, 40, 28, 70, 42, 80, 50],
        },
        {
            name: 'دانش آموزان کلاس ها',
            data: [10, 4, 5, 13, 7, 15, 6],
        },
      ],
      options: {
        chart: {
          height: 350,
          type: 'area',
          background: 'transparent',
          toolbar: {
            show: false,
          }
        //    fill: ['#FF5733', '#000'],
        },

        grid: {
          show: true, // hide grid
          // colors: ['#fff', '#61A5FB'],
            // fill:'#000',
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
          colors: ['#fff', '#61A5FB'],
        },
        theme:{
            mode:'dark'
          },
        xaxis: {
          type: 'datetime',
          categories: [
            "2018-09-10T00:00:00.000Z",
            "2018-09-11T01:30:00.000Z",
            "2018-09-12T02:30:00.000Z",
            "2018-09-13T03:30:00.000Z",
            "2018-09-14T04:30:00.000Z",
            "2018-09-15T05:30:00.000Z",
            "2018-09-16T06:30:00.000Z",
          ],
          
          
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm',
          },
         
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart options={this.state.options} series={this.state.series} type="area" height={450} />
      </div>
    );
  }
}

export default ChartStudent;
