const buildChartData = (data) => {
  let chartData = [];
  let recoveredData = [];
  let deathsData = [];
  let allData = [];

  for (let date in data.cases) {
    let newDataPoint = {
      x: date,
      y: data.cases[date],
    };
    chartData.push(newDataPoint);
  }

  for (let date in data.recovered) {
    let newDataPoint = {
      x: date,
      y: data.recovered[date],
    };
    recoveredData.push(newDataPoint);
  }

  for (let date in data.deaths) {
    let newDataPoint = {
      x: date,
      y: data.deaths[date],
    };
    deathsData.push(newDataPoint);
  }

  allData.push(chartData, recoveredData, deathsData);
  return allData;
};

const buildChart = (chartData) => {
  const timeFormat = "MM/DD/YY";
  var ctx = document.querySelector("#myChart").getContext("2d");

  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "bar",
    data: {
      datasets: [{
          label: ["Cases"],
          data: chartData[0],
          showLine: true,
          fill: false,
          backgroundColor: "rgb(142,195,185)",
          borderColor: "rgb(142,195,185)",
        },
        {
          label: ["Recovered"],
          data: chartData[1],
          showLine: true,
          fill: false,
          backgroundColor: "rgb(2,62,88)",
          borderColor: "rgb(2,62,88)",
        },
        {
          label: ["Deaths"],
          data: chartData[2],
          showLine: true,
          fill: false,
          backgroundColor: "rgb(14,22,38)",
          borderColor: "rgb(14,22,38)",
        },
      ],
    },
    // Configuration options go here
    options: {
      maintainAspectRatio: false,
      tooltips: {
        mode: "index",
        intersect: false,
      },
      scales: {
        xAxes: [{
          type: "time",
          time: {
            format: timeFormat,
            tooltipFormat: "ll",
          },
          scaleLabel: {
            display: true,
            labelString: "Date",
          },
        }, ],
        yAxes: [{
          ticks: {
            callback: function (value, index, values) {
              return numeral(value).format("0,0");
            },
          },
        }, ],
      },
    },
  });
};

const buildPieChart = (data) => {
  // const timeFormat = "MM/DD/YY";
  var ctx = document.querySelector("#pieChart").getContext("2d");

  var pieChart = new Chart(ctx, {
    // The type of chart we want to create
    type: "pie",
    data: {
      datasets: [{
        data: [data.active, data.recovered, data.deaths],
        backgroundColor: [
          "rgb(142,195,185)",
          "rgb(2,62,88)",
          "rgb(14,22,38)",
        ]
      }],
      labels: [
        "Active",
        "Recovered",
        "Death",
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
};