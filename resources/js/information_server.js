$(document).ready(function () {
    $.getJSON("../../cgi-bin/information.pl",function (resp) {
            console.log(resp);
            var dateTime = $(
                '<div align=\'right\'><small> <strong>Last update ' +
                resp['dateInfo'][0] + ' of ' + resp['dateInfo'][1] +
                '</strong></small></div>');
            /* CPU INFO */
            var tablaCPUinfo = '<table class="table table-striped table-hover">\n' +
                '  <thead class="thead-dark">\n' +
                '    <tr>\n' +
                '      <th scope="col">CPU Core #</th>\n' +
                '      <th scope="col">Description</th>\n' +
                '      <th scope="col">Value</th>\n' +
                '    </tr>\n' +
                '  </thead>\n' +
                '  <tbody>\n';
            for (var i = 0; i < resp["cpuInfo"].length; i++) {
              //console.log(resp["cpuInfo"][i]);
              tablaCPUinfo += '<tr>\n' +
                  '      <th scope="row">' + resp['cpuInfo'][i][0] + '</th>\n' +
                  '      <td>' + resp['cpuInfo'][i][1] + '</td>\n' +
                  '      <td>' + resp['cpuInfo'][i][2] + '</td>\n' +
                  '    </tr>';
            }
            tablaCPUinfo += '</tbody>\n' +
                '</table>';
      
            /* Mem info */
      
            var tableMemInfo = '<table class="table table-striped table-hover"><thead class="thead-dark">\n' +
                '                    <tr>\n' +
                '                        <th scope="col">Mem Type</th>\n' +
                '                        <th scope="col">Value</th>\n' +
                '                        <th scope="col">Unit</th>\n' +
                '                    </tr>\n' +
                '                    </thead>' +
                '<tbody id="valoresTableMemInfo">';
      
            for (var i = 0, len = resp['memInfo'].length; i < len; i++) {
              var entry = '<tr>\n';
              entry += '<td scope="row">' + resp['memInfo'][i][0] + '</td>\n';
              entry += '<td>' + resp['memInfo'][i][1] + '</td>\n';
              entry += '<td>' + resp['memInfo'][i][2] + '</td>\n';
              entry += '</tr>\n';
              tableMemInfo += entry;
            }
            tableMemInfo += '</tbody></table>';
      
            /* Uptime */
            var nCore = resp['cpuInfo'][resp['cpuInfo'].length - 1][0] + 1;
            var idlePromedioPorcentaje = Math.round(
                100 * (resp['uptimeInfo'][0][1] / nCore) / resp['uptimeInfo'][0][0]);
            var carUptime = '<div class="card" style="width: 50%;">\n' +
                '  <div class="card-body">\n' +
                '    <h4 class="card-title">Uptime</h4>\n' +
                '    <h6 class="card-subtitle mb-2 text-muted">OS uptime information <small>[sec]</small></h6>\n' +
                '    <p class="card-text">Time since system start: ' +
                Math.round(resp['uptimeInfo'][0][0]) +
                '<br>Total IDLE time: ' + Math.round(resp['uptimeInfo'][0][1]) +
                '<br>Meand IDLE per core: ' +
                Math.round(resp['uptimeInfo'][0][1] / nCore) +
                '<br> IDLE time [\%]:</p>\n' +
                '<div class="progress">\n' +
                '  <div class="progress-bar bg-info" role="progressbar" style="width: ' +
                idlePromedioPorcentaje +
                '%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">' +
                idlePromedioPorcentaje + '%</div>\n' +
                '</div>' +
                '  </div>\n' +
                '</div>';
      
            /* Uptime */
      
      
            var carMem = '<div class="card" style="width: 50%;">\n' +
                '  <div class="card-body">\n' +
                '    <h4 class="card-title">MemInfo</h4>\n' +
                '    <h6 class="card-subtitle mb-2 text-muted">Memory information <small>[Kb]</small></h6>\n' +
                '<div id="memInfoGrafico" style="height: 200px; width: 100%;"></div>' +
                '  </div>\n' +
                '</div>';
      
            /* Carga CPU  */
            var carCPUload = '<div class="card"  style="width: 100%;">\n' +
                '  <div class="card-body">\n' +
                '    <h4 class="card-title">CPU Load</h4>\n' +
                '    <h6 class="card-subtitle mb-2 text-muted">Total load CPU and per core</h6>\n' +
                '<p class="card-text">Refresh: 1[s]</p>' +
                '<div id="graficoCPU" style="height: 370px; width:100%;"></div>\n' +
                '</div>';
      
            $('#info-result').append(dateTime);
            $('#info-result').append(carCPUload);
            $('#info-result').append('<div><div><p><br></p></div></div>')
            console.log("Call gaficoCPU");
            graficoCPU();
            $('#info-result').append(carUptime);
            $('#info-result').append('<div><div><p><br></p></div></div>')
            $('#info-result').append(carMem);
            graficoMEM(resp['memInfo'][0][1],resp['memInfo'][1][1]);
            $('#info-result').append('<div><div><p><br></p></div></div>')
            $('#info-result').append('<h3>Memory Information</h3><br>');
            $('#info-result').append(tableMemInfo);
            $('#info-result').append('<h3>CPU Information</h3><br>');
            $('#info-result').append(tablaCPUinfo);
        }
    );
});

function graficoCPU() {
    console.log("Entry to CPU");
    var load_global = [];
    var load_core0 = [];
    var load_core1 = [];
    var load_core2 = [];
    var load_core3 = [];
    var chart = new CanvasJS.Chart('graficoCPU', {
      exportEnabled: true,
      title: {
        text: 'CPU Load (Global/per Core)',
      },
      axisY: {
        includeZero: true,
        suffix: "%",
        maximum: 100
  
  
      },
      data: [
        {
        //type: "spline",
          markerSize: 0,
          dataPoints: load_global,
          name: "Global",
          showInLegend: true,
          legendMarkerType: "square",
          type: "area",
          color: "rgba(40,175,101,0.6)",
        },
        {
          type: 'spline',
          markerSize: 0,
          dataPoints: load_core0,
          name: "Core #1",
          showInLegend: true,
        },
        {
          type: 'spline',
          markerSize: 0,
          dataPoints: load_core1,
          name: "Core #2",
          showInLegend: true,
        },
        {
          type: 'spline',
          markerSize: 0,
          dataPoints: load_core2,
          name: "Core #3",
          showInLegend: true,
        },
        {
          type: 'spline',
          markerSize: 0,
          dataPoints: load_core3,
          name: "Core #4",
          showInLegend: true,
        }],
  
    });

    console.log(chart);
  
    var xVal = 0;
    var dataLength = 25; // numero de puntos visibles
  
    var updateChart = function(count) {
  
      $.getJSON('../../cgi-bin/refresh_data.pl', function(data) {
  
        load_global.push({
          x: xVal,
          y: parseFloat(data[0]),
        });
        load_core0.push({
          x: xVal,
          y: parseFloat(data[1]),
        });
        load_core1.push({
          x: xVal,
          y: parseFloat(data[2]),
        });
        load_core2.push({
          x: xVal,
          y: parseFloat(data[3]),
        });
        load_core3.push({
          x: xVal,
          y: parseFloat(data[4]),
        });
  
  
  
      });
  
      xVal++;
      if (load_global.length > dataLength) {
        load_global.shift();
        load_core0.shift();
        load_core1.shift();
        load_core2.shift();
        load_core3.shift();
      }
      chart.render();
    };
  
    updateChart(dataLength);
  
    setInterval(function() {
      updateChart();
    }, 1000);
}  

function graficoMEM(total,ocupado) {
    var chart = new CanvasJS.Chart("memInfoGrafico", {
      animationEnabled: true,
      title: {
        text: "Usage principal memory"
      },
      data: [{
        type: "doughnut",
        startAngle: 240,
        indexLabel: "{label} {y}",
        dataPoints: [
          {y: total-ocupado, label: "Non free"},
          {y: ocupado, label: "Free"},
        ]
      }]
    });
    chart.render();
  
  }