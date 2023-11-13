/*Documentation on: https://developers-dot-devsite-v2-prod.appspot.com/chart/interactive/docs/gallery/columnchart.html */

function GoogleChart(json) {
    if (json == null || json == "")
        return;

    var request = JSON.parse(json);
    
    $('#' + request.idGrafico).html(`<div style="height: 100%;" id="` + request.tipoGrafico + request.idGrafico + `" class="centralizar-geral"></div>`);

    //Criação do gráfico 
    switch (request.tipoGrafico) {
        case "column":
            google.charts.load("current", { packages: ["corechart"] });
            google.charts.setOnLoadCallback(function () { columnChart(request) });
            break;

        case "donutChart":
            google.charts.load("current", { packages: ["corechart"] });
            google.charts.setOnLoadCallback(function () { donutChart(request) });
            break;

        case "lineChart":
            google.charts.load('current', { packages: ['corechart', 'line'] });
            google.charts.setOnLoadCallback(function () { lineChart(request) });

            break;
    }
}

function columnChart(request) {
    if (request.rowsData.length == 0 || request.rowsData[0].length < 2)
        return;

    var data = new google.visualization.DataTable();

    for (var i = 0; i < request.columnsData.length; i++) {
        data.addColumn(request.columnsData[i].type, request.columnsData[i].value);
    }
    data.addRows(request.rowsData);

    var view = new google.visualization.DataView(data);
    var options = request.options;
    var chart_div = document.getElementById(request.tipoGrafico + request.idGrafico);
    var chart = new google.visualization.ColumnChart(chart_div);
    chart.draw(view, options);
}

function donutChart(request) {
    var data = google.visualization.arrayToDataTable(request.data);

    var options = request.options;

    var chart_div = document.getElementById(request.tipoGrafico + request.idGrafico);
    var chart = new google.visualization.PieChart(chart_div);
    chart.draw(data, options);
}

function lineChart(request) {

    var data = new google.visualization.DataTable();
    for (var i = 0; i < request.columnsData.length; i++) {
        data.addColumn(request.columnsData[i].type, request.columnsData[i].value);
    }
    data.addRows(request.rowsData);
    var chart_div = document.getElementById(request.tipoGrafico + request.idGrafico);
    var chart = new google.visualization.LineChart(chart_div);
    chart.draw(data, request.options);
}