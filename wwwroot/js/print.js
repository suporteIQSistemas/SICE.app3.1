async function PrintPdf(printPage) {
    var dadosPrintPage = JSON.parse(printPage);
    
    var htmlContentAtivo = dadosPrintPage.htmlContent != null && dadosPrintPage.htmlContent != "";
    var base64StringContentAtivo = dadosPrintPage.base64StringContent != null && dadosPrintPage.base64StringContent != "";

    if (!htmlContentAtivo && !base64StringContentAtivo) {
        dadosPrintPage.htmlContent = GetHtmlElement(dadosPrintPage.idElement);
        htmlContentAtivo = dadosPrintPage.htmlContent != null && dadosPrintPage.htmlContent != "";
    }

    var processandoAPI = false;
    if (htmlContentAtivo && !base64StringContentAtivo) {
        processandoAPI = true;
        dadosPrintPage.htmlContent = EncodeString64(dadosPrintPage.htmlContent);

        var settings = {
            "url": "api/PrintPDF/GerarPDF",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify(dadosPrintPage),
        };
        $.ajax(settings).done(function (data) {
            var response = JSON.parse(data);
            console.log(response);
            if (response.error == "false") {
                if (isDevice()) {
                    saveFile(dadosPrintPage.fileName + ".pdf", response.result.mensagem, "application/pdf");
                } else {
                    PrintPdfFunc(response.result.mensagem, dadosPrintPage.titleDocument);
                }
            }
        });
    }

    if (!processandoAPI) {
        var pdfSize = calcularTamanhoPDF(dadosPrintPage.base64StringContent);

        if (isDevice() || pdfSize > 500000) {
            saveFile(dadosPrintPage.fileName + ".pdf", dadosPrintPage.base64StringContent, "application/pdf");
        } else {
            PrintPdfFunc(dadosPrintPage.base64StringContent, dadosPrintPage.titleDocument);
        }
    }    
}

function PrintPdfFunc(base64String, title) {
    var doc = window.open("");
    doc.document.write(`
    <object data="data:application/pdf;base64,`+ base64String + `" type="application/pdf" width="` + window.innerWidth + `" height="` + window.innerHeight +`">
        <p class="text-center"><a class="btn btn-primary text-white" @onclick="DownloadPDF">Baixar PDF</a></p>
    </object>

    <script>
        document.body.style.margin = "auto";
        document.body.style.overflowY = 'hidden';
        document.body.style.overflowX = 'hidden';
        document.title = '` + (title ?? "SICE.app - Impressão PDF") + `';
    </script>
    `);
    doc.stop();
}

function calcularTamanhoPDF(base64String) {
    if (base64String == null || base64String == "") {
        return 0;
    }
    else {
        const base64SemCabecalho = base64String.replace(/^data:[^;]+;base64,/, '');
        const stringDecodificada = atob(base64SemCabecalho);
        return stringDecodificada.length;
    }
}

function EncodeString64(contentString) {
    return window.btoa(unescape(encodeURIComponent(contentString)));
}

function printFunc(element, orientacao, modePrint, docTitle) {
    var doc = window.open("");
    //$(".show-print").removeClass("d-none");

    if (modePrint == null || modePrint == "") {
        modePrint = 0;
    }
    if (orientacao == null || orientacao == "") {
        orientacao = "portrait";
    }

    switch (orientacao) {
        case "retrato":
            orientacao = "portrait";
            break;

        case "paisagem":
            orientacao = "landscape";
            break;
    }

    var style = `
    <head>
    

    <!-- Font Google -->
    <link rel="preconnect" href="https://fonts.googleapis.com" media="print">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin media="print">
    <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+EAN13+Text&display=swap" rel="stylesheet" media="print">

    <!-- JQUERY -->
    <script src="../js/jquery.min.js"></script>
    `+ css(orientacao) + `
    </head>
        <body>
    `;
    
    doc.document.write(style);
    if (isDevice()) {
        doc.document.write(`
        <center>
            <button id="btn-print" class="btn btn-primary" onclick="Print()">Imprimir</button>
        </center>

        <script>
            function Print(){
                window.onbeforeprint = (event) => {
                    $("#btn-print").hide();
                };

                window.onafterprint = (event) => {
                    $("#btn-print").show();
                };

                print();
            }
        </script>
    `);
    }
    
    var printElement = document.getElementById(element).outerHTML.replaceAll("overflow: hidden", "").replaceAll("overflow-x: scroll", "").replaceAll("overflow-y: scroll", "");
    doc.document.write(printElement);
    doc.document.write(`<script>` + scripts(docTitle) +
        `
        $(".content-table").css({"height": "auto", "width": "auto"});

        function HidePrintFields() {
            for (var i = 0; i < document.querySelectorAll("div").length; i++) {
                if (document.querySelectorAll("div")[i].classList.contains("tab-pane") == true) {
                    if(document.querySelectorAll("div")[i].classList.contains("active") == false){
                        document.querySelectorAll("div")[i].classList.add("hidden-print");
                    }
                    else {
                        document.querySelectorAll("div")[i].classList.remove("hidden-print");
                    }
                }
            }
        }
        HidePrintFields();

    </script></body>`);

    setTimeout(() => {
        switch (modePrint) {
            case 0:
                $(".show-print").addClass("d-none");
                break;

            case 1: //Quando houver gráficos
                $(".show-print").html("");
                break;
        }
        if (!isDevice()) {
            doc.stop();
            doc.print();
            doc.close();
        }
    }, 200);
}

function scripts(docTitle) {
    var html = "";
    if (docTitle != "") {
        html += "document.title = '" + docTitle + "';"
    }
    return html;
}




function css(orientacao) {
    var css =
        `<style type="text/css">` +
        '.tabela .row .col {width: 100% !important;}' +

        '.tabela {margin-top: 20px; margin-bottom: 20px;}' +

        '.tabela-print {overflow-x: hidden !important; overflow-y: hidden !important; height: auto !important; width: auto !important;}' +

        '.container, .container-fluid, .container-lg, .container-md, .container-sm, .container-xl {' +
        'width: 100%;' +
        'padding-right: 15px;' +
        'padding-left: 15px;' +
        'margin-right: auto;' +
        'margin-left: auto;' +
        '}' +
        '.row {' +
        'display: flex;' +
        'flex-wrap: wrap; ' +
        'margin-right: -15px; ' +
        'margin-left: -15px; ' +
        '}' +

        '.col {' +
        '-ms-flex-preferred-size: 0;' +
        'flex-basis: 0;' +
        '-ms-flex-positive: 1;' +
        'flex-grow: 1;' +
        'max-width: 100%;' +
        '}' +
        '.col, .col-1, .col-10, .col-11, .col-12, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-auto, .col-lg, .col-lg-1, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-auto, .col-md, .col-md-1, .col-md-10, .col-md-11, .col-md-12, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-auto, .col-sm, .col-sm-1, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-auto, .col-xl, .col-xl-1, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-auto {' +
        'position: relative;' +
        'width: 100%;' +
        'padding-right: 15px;' +
        'padding-left: 15px;' +
        '}' +

        '.bg-secondary{ background-color: #6C757D; color: #FFFFFF;} ' +

        '.text-info {color: #17a2b8!important;}' +

        '.text-capitalize {text-transform: capitalize!important;}' +
        '.text-uppercase {text-transform: uppercase!important;}' +
        '.text-lowercase {text-transform: lowercase!important;}' +
        '.text-justify {text-align: justify; text-justify: inter-word;}' +

        `
        .btn {
            display: inline-block;
            font-weight: 400;
            color: #212529;
            text-align: center;
            vertical-align: middle;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            background-color: transparent;
            border: 1px solid transparent;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            line-height: 1.5;
            border-radius: 0.25rem;
            transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        }
        .btn-primary {
            color: #fff;
            background-color: #007bff;
            border-color: #007bff;
        }
        ` +

        'p {' +
        'display: block; ' +
        'margin-block-start: 1em;' +
        'margin-block-end: 1em;' +
        'margin-inline-start: 0px;' +
        'margin-inline-end: 0px;' +
        '}' +

        '.h7 {font-size: .8rem;}' +

        '.font-weight-bold {font-weight: 700!important;} ' +

        '.font-italic {font-style: italic !important;;} ' +

        '.text-center {text-align: center!important;} ' +

        '.text-left {text-align: left!important;} ' +

        '.p-0 {padding: 0!important;} ' +

        '.pb-2 {padding-bottom: 0.5rem!important;} ' +

        '.mb-2, .my-2 {margin-bottom: .5rem!important;} ' +

        '.m-0 {margin: 0!important;} ' +

        '.mb-3, .my-3 {margin-bottom: 1rem!important;}' +

        '.border-bottom {border-bottom: 1px solid #dee2e6!important;}' +
        '.border-top {border-top: 1px solid #dee2e6!important;}' +

        'thead{' +
        'color: #ffffff;' +
        'text-transform: uppercase;' +
        'text-align: center;' +
        'background-color: #343a40;' +
        'font-size: .8rem;' +
        'display: table-header-group;' +
        'vertical-align: middle;' +
        'border-color: inherit;' +
        '}' +

        'tbody{' +
        'text-transform: uppercase;' +
        'text-align: center;' +
        'font-size: .8rem;' +
        '-webkit-print-color-adjust: exact' +
        '}' +

        `.campoDestacado{
            background-color: transparent !important;
            color: #000000 !important;
        }` +

        '.table-sm td, .table-sm th {padding: .3rem;}' +

        '@media print { ' +
        '.page-break {page-break-before: always !important;}' +
        '.hidden-print, .hidden-print * {' +
            'display: none !important;' +
        '}' +
        `.barcode {
                    font-weight: normal;
                    font-style: normal;
                    line-height: normal;
                    font-family: 'Libre Barcode EAN13 Text', cursive;
                    text-align: center;
                    font-size: 100px
                } ` +
        '@page { margin: 0; margin-top: 0px; margin-bottom: 20px; padding-top: 20px; padding-bottom: 20px; size: ' + orientacao + ';}' +
        'body {' +
        'margin: 1.6cm;' +
        '} ' +
        '}' +
        '</style>';

    return css;
}