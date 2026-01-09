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

        // primeira linha: cabeçalhos
        var headers = [];
        headers.push(request.columnsData[0]);
        for (var i = 0; i < request.rowsData.length; i++) {
            headers.push(request.rowsData[i][0]);
        }
        dataTable.push(headers);

        // demais linhas: valores
        for (var j = 1; j < request.columnsData.length; j++) {
            var linha = [];
            var valido = true;

            // primeiro valor da linha
            if (request.columnsData[j] && request.columnsData[j].value !== undefined) {
                linha.push(request.columnsData[j].value);
            } else {
                valido = false;
            }

            // valores das métricas
            for (var k = 0; k < request.rowsData.length; k++) {
                if (request.rowsData[k][j] !== undefined) {
                    linha.push(request.rowsData[k][j]);
                } else {
                    valido = false;
                    break;
                }
            }

            // só adiciona se todos os valores existirem
            if (valido) {
                dataTable.push(linha);
            }
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