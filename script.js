window.onload = () => {
  getCountryData();
  getGlobalData();
  getHistoricalData();
};

var map;
let infoWindow;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37, lng: -96 },
    zoom: 5,
    styles: mapStyle,
  });
  infoWindow = new google.maps.InfoWindow();
}

const getCountryData = () => {
  fetch("https://corona.lmao.ninja/v2/countries")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showDataOnMap(data);
      // showDataInTable(data);
    });
};

const getHistoricalData = () => {
  fetch("https://corona.lmao.ninja/v2/historical/all?lastdays=120")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let chartData = buildChartData(data);
      buildChart(chartData);
    });
};

const getGlobalData = () => {
  fetch("https://corona.lmao.ninja/v2/all")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      buildPieChart(data);
    });
};

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

const openInfoWindow = () => {
  infoWindow.open(mao);
};

const showDataOnMap = (data) => {
  data.map((country) => {
    let countryCenter = {
      lat: country.countryInfo.lat,
      lng: country.countryInfo.long,
    };

    var countryCircle = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: map,
      center: countryCenter,
      radius: Math.sqrt(country.cases) * 250,
    });

    let html = `
      <div class="info-container">
        <div class="info-flag" style="background-image: url(${country.countryInfo.flag}">
        </div>
        <div class="info-name">
          ${country.country}
        </div>
        <div class="info-confirmed">
          Total: ${country.cases}
        </div>
        <div class="info-recovered">
          Recovered: ${country.recovered}
        </div>
        <div class="info-deaths">
          Deaths: ${country.deaths}
        </div>  
      </div>
    `;

    var infoWindow = new google.maps.InfoWindow({
      content: html,
      position: countryCircle.center,
    });

    google.maps.event.addListener(countryCircle, "mouseover", function (e) {
      infoWindow.open(map);
    });

    google.maps.event.addListener(countryCircle, "mouseout", function (e) {
      infoWindow.close(map);
    });
  });
};

const showDataInTable = (data) => {
  let html = "";
  data.forEach((country) => {
    html += `
      <tr>
        <td>${country.country}</td>
        <td>${country.cases}</td>
        <td>${country.recovered}</td>
        <td>${country.deaths}</td>
      </tr>
    `;
    // document.getElementById("table-data").innerHTML = html;
  });
};

const buildChart = (chartData) => {
  const timeFormat = "MM/DD/YY";
  var ctx = document.querySelector("#myChart").getContext("2d");

  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "bar",
    data: {
      datasets: [
        {
          label: ["Total Cases"],
          data: chartData[0],
          showLine: true,
          fill: false,
          backgroundColor: "rgb(142,195,185)",
          borderColor: "rgb(142,195,185)",
        },
        {
          label: ["Total Recovered"],
          data: chartData[1],
          showLine: true,
          fill: false,
          backgroundColor: "rgb(2,62,88)",
          borderColor: "rgb(2,62,88)",
        },
        {
          label: ["Total Deaths"],
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
      tooltips: {
        mode: "index",
        intersect: false,
      },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              format: timeFormat,
              tooltipFormat: "ll",
            },
            scaleLabel: {
              display: true,
              labelString: "Date",
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              callback: function (value, index, values) {
                return numeral(value).format("0,0");
              },
            },
          },
        ],
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
      datasets: [
        {
          label: [
            "Total Cases",
            "Active Cases",
            "Recovered Cases",
            "Death Cases",
          ],
          data: [data.cases, data.active, data.recovered, data.deaths],
          backgroundColor: [
            "rgb(142,195,185)",
            "rgb(2,62,88)",
            "rgb(14,22,38)",
            "rgb(14,22,38)",
          ],
          borderColor: [
            "rgb(142,195,185)",
            "rgb(2,62,88)",
            "rgb(14,22,38)",
            "rgb(14,22,38)",
          ],
        },
      ],
    },
    // Configuration options go here
    // options: {
    //   tooltips: {
    //     mode: "index",
    //     intersect: false,
    //   },
    //   scales: {
    //     xAxes: [
    //       {
    //         type: "time",
    //         time: {
    //           format: timeFormat,
    //           tooltipFormat: "ll",
    //         },
    //         scaleLabel: {
    //           display: true,
    //           labelString: "Date",
    //         },
    //       },
    //     ],
    //     yAxes: [
    //       {
    //         ticks: {
    //           callback: function (value, index, values) {
    //             return numeral(value).format("0,0");
    //           },
    //         },
    //       },
    //     ],
    //   },
  });
};

