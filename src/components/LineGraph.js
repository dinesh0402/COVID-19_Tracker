import React, { useEffect, useState } from 'react'
import {Line} from "react-chartjs-2"
import numeral from 'numeral'
import ChartJS from 'chart.js/auto';
import 'chartjs-adapter-moment';

const options = {
  plugins: {
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
      xAxes: 
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      yAxes: 
        {
          gridLines: {
            display: false,
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
    },
  }
};

const buildChartData = (data,casesType) => {
  let chartData = [];
  let lastDataPoint;

  for(let date in data.cases){
      if(lastDataPoint) {
          let newDataPoint = {
              x: date,
              y: data[casesType][date] - lastDataPoint
          }
          chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
  };
  return chartData ;
};

function LineGraph({casesType='cases'}) {
  
    const [data, setData] = useState({});

    // https://disease.sh/v3/covid-19/historical/all?lastdays=120
    
    useEffect(() => {
        const fetchData = async () => {
            fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(response => response.json())
            .then(data => {
                let chartData = buildChartData(data,casesType);
                setData(chartData);
            })
        }

        fetchData();
    } , [casesType]);


    return (
    <div style={{maxHeight: "400px",padding: "10px"}} className='lineGraph'>
        {/* <h1>I'm a graph</h1> */}
        {data?.length > 0 && (
          <Line data={{datasets: [
            {
                backgroundColor: "rgba(204,16,52,0.5)",
                borderColor: "#CC1034",
                data: data
            }
          ]
          }}
            options={options}
          />
        )}
    </div>
  )
}
export default LineGraph