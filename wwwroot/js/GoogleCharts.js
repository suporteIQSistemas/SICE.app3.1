/*Documentation on: https://developers-dot-devsite-v2-prod.appspot.com/chart/interactive/docs/gallery/columnchart.html */

async function GoogleChart(json, idElementTemporario = "") {
    if (json == null || json == "")
        return;

    var request = JSON.parse(json);
    var response;
    
    var retornarString = idElementTemporario?.length > 1;
    if (retornarString) {
        $(`#${idElementTemporario}`).append(`<div id="${request.idGrafico}"></div>`);
    }

    $(`#${request.idGrafico}`).html(`<div style="height: 100%;" id="` + request.tipoGrafico + request.idGrafico + `" class="centralizar-geral"></div>`);
    // Criação do gráfico 
    switch (request.tipoGrafico) {
        case "column":
            if (retornarString) {
                response = await new Promise((resolve, reject) => {
                    google.charts.load("current", { packages: ["corechart"] });
                    google.charts.setOnLoadCallback(function () {
                        columnChart(request);
                        if (retornarString) {
                            resolve(salvarGrafico(request.idGrafico));
                        }
                    });

                    window.addEventListener('unhandledrejection', event => {
                        console.error('Unhandled rejection (promise: ', event.promise, ', reason: ', event.reason, ').');
                    });
                });
            }
            else {
                google.charts.load("current", { packages: ["corechart"] });
                google.charts.setOnLoadCallback(function () {
                    columnChart(request);
                    if (retornarString) {
                        resolve(salvarGrafico(request.idGrafico));
                    }
                });
            }
            break;

        case "donutChart":
            if (retornarString) {
                response = await new Promise((resolve, reject) => {
                    google.charts.load("current", { packages: ["corechart"] });
                    google.charts.setOnLoadCallback(function () {
                        donutChart(request);
                        if (retornarString) {
                            resolve(salvarGrafico(request.idGrafico));
                        }
                    });

                    window.addEventListener('unhandledrejection', event => {
                        console.error('Unhandled rejection (promise: ', event.promise, ', reason: ', event.reason, ').');
                    });
                });
            }
            else {
                google.charts.load("current", { packages: ["corechart"] });
                google.charts.setOnLoadCallback(function () {
                    donutChart(request);
                    if (retornarString) {
                        resolve(salvarGrafico(request.idGrafico));
                    }
                });
            }
            break;

        case "lineChart":
            if (retornarString) {
                response = await new Promise((resolve, reject) => {
                    google.charts.load('current', { packages: ['corechart', 'line'] });
                    google.charts.setOnLoadCallback(function () {
                        lineChart(request);
                        if (retornarString) {
                            resolve(salvarGrafico(request.idGrafico));
                        }
                    });

                    window.addEventListener('unhandledrejection', event => {
                        console.error('Unhandled rejection (promise: ', event.promise, ', reason: ', event.reason, ').');
                    });
                });
            }
            else {
                google.charts.load('current', { packages: ['corechart', 'line'] });
                google.charts.setOnLoadCallback(function () {
                    lineChart(request);
                    if (retornarString) {
                        resolve(salvarGrafico(request.idGrafico));
                    }
                });
            }
            break;
    }

    return response;
}

async function salvarGrafico(idElement) {
    var htmlGrafico = $(`#${idElement}`).html();
    $(`#${idElement}`).remove();
    return htmlGrafico;
}

function columnChart(request) {
    if (request.rowsData.length == 0 || request.rowsData[0].length < 2)
        return;

    if (request.rowsData.length > 1) {
        var dataTable = [];
        dataTable.push([request.columnsData[0], 'Valor']);
        for (var i = 1; i < request.columnsData.length; i++) {
            var linha = [request.columnsData[i].value, request.rowsData[0][i]];
            dataTable.push(linha);
        }

        var data = google.visualization.arrayToDataTable(dataTable);
    }
    else {
        var data = new google.visualization.DataTable();

        for (var i = 0; i < request.columnsData.length; i++) {
            data.addColumn(request.columnsData[i].type, request.columnsData[i].value);
        }
        data.addRows(request.rowsData);
    }

    var view = new google.visualization.DataView(data);
    var options = request.options;
    var chart_div = document.getElementById(request.tipoGrafico + request.idGrafico);
    var chart = new google.visualization.ColumnChart(chart_div);
    chart.draw(view, options);
    return JSON.stringify(data);
}

function donutChart(request) {
    var data = google.visualization.arrayToDataTable(request.data);

    var options = request.options;

    var chart_div = document.getElementById(request.tipoGrafico + request.idGrafico);
    var chart = new google.visualization.PieChart(chart_div);
    chart.draw(data, options);
    return JSON.stringify(data);
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
    return JSON.stringify(data);
}