window.onload = () => {
  getCountryData();
  getGlobalData();
  getHistoricalData();
};

var map;
let infoWindow;
let coronaGlobalData;
let mapCircles = [];
let casesTypeColors = {
  cases: "dodgerblue",
  active: "orangered",
  recovered: "green",
  deaths: "rgb(14,22,38)",
};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 37,
      lng: -96,
    },
    zoom: 3,
    styles: mapStyle,
  });
  infoWindow = new google.maps.InfoWindow();
}

const changeDataSelection = (casesType) => {
  clearTheMap();
  showDataOnMap(coronaGlobalData, casesType);
};

const clearTheMap = () => {
  for (let circle of mapCircles) {
    circle.setMap(null);
  }
};

const getCountryData = () => {
  fetch("https://corona.lmao.ninja/v2/countries")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      coronaGlobalData = data;
      showDataOnMap(data);
      showDataInTable(data);
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
  fetch("https://disease.sh/v2/all")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      buildPieChart(data);
      getCurrentTotals(data);
    });
};

// insert current total cases on cards html
const getCurrentTotals = (data) => {
  const totalsData = [data.cases, data.active, data.recovered, data.deaths];
  const cardTotals = document.querySelectorAll(".card-total");
  for (let i = 0; i < totalsData.length; i++) {
    cardTotals[i].innerText = totalsData[i];
  }
};

const openInfoWindow = () => {
  infoWindow.open(mao);
};

const showDataOnMap = (data, casesType = "cases") => {
  data.map((country) => {
    let countryCenter = {
      lat: country.countryInfo.lat,
      lng: country.countryInfo.long,
    };

    var countryCircle = new google.maps.Circle({
      strokeColor: casesTypeColors[casesType],
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: casesTypeColors[casesType],
      fillOpacity: 0.35,
      map: map,
      center: countryCenter,
      radius: country[casesType],
    });

    mapCircles.push(countryCircle);

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
    document.getElementById("table-data").innerHTML = html;
  });
};
