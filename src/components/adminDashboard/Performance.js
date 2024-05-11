


import React, { Component } from "react";
import ReactApexChart from 'react-apexcharts';



export default class ChartBarStudent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "تست",
          data: [1, 3, 4, 3,],
        },
   
        {
          name: "تست",
          data: [1, 3, 2, 5,],
        },

  
    
    
    
 
      ],
      options: {
        chart: {
          type: "bar",
          height: 400,
          background: 'transparent',
          toolbar: {
            show: false,
          },
          
        },

        grid: {
          show: false, // hide grid
        },
        
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "25%",
            endingShape: "rounded",
            
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        theme:{
          mode:'dark'
          
        },
    
        xaxis: {
          
          
       
          categories: [
      
            "فروردین",
            "اردیبهشت",
            "خرداد",

            "تیر",
          ],
  
     
        },

        yaxis: {
          title: {
            text: " ",
          },
          axisBorder: {
            show: false, // Set to true to show the Y-axis border
            color: '#000', // Set the color of the Y-axis border
            width: 2, // Set the width of the Y-axis border
            height: 10, // Set the height of the Y-axis border
          },

          
        },
        fill: {
          opacity: 1,
          
            colors: ['#DD7136']
          
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "" + val + " ";
            },
          },
        },
      },
    };
  }
  render() {
    return (
      <div style={{width:'100%'}} id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height={400}
          width={'100%'}
        />
      </div>
    );
  }
}
