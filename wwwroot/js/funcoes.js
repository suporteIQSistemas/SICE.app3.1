window.scrollToTop = (topValue) => {
    window.scrollTo({ top: topValue ?? 0, behavior: 'smooth' });
};

window.playAudio = function (idElement) {
    var audio = document.getElementById(idElement);
    audio.play();
}

function getSelectionStart(idElement) {
    return document.getElementById(idElement).selectionStart;
}

//function KeypressRadionButton() {
//    var radioButtons = document.querySelectorAll('input[type="radio"]');
//    radioButtons.forEach(function (radioButton) {
//        radioButton.addEventListener('keypress', function (event) {
//            if (event.key === 'Enter') {
//                console.log("Radio button selected: ", radioButton.value);
//            }
//        });
//    });
//}

function getSelectionEnd(idElement) {
    return document.getElementById(idElement).selectionEnd;
}

function ChangeCursorPosition(idElement, position) {
    var textarea = $("#" + idElement);
    textarea.prop("selectionStart", position);
    textarea.prop("selectionEnd", position);
    textarea.focus();
}

function isDevice() {
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(navigator.userAgent) && window.innerWidth <= 768;
}

function MobileDevice() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    }
    else {
        return false;
    }
}

function ObterHeightElement(element, unidadeMedida) {
    switch (unidadeMedida) {
        case "px":
            return $(element).height() ? $(element).height() : null;

        case "vh":
            var windowHeight = window.innerHeight;
            var elementHeight = $(element).height() ? $(element).height() : null;
            if (elementHeight != null)
                return ((elementHeight / windowHeight) * 100) + "vh";
            else
                return null;

        default:
            return ObterHeightElement(element, "vh");
    }    
}
function ObterListAttrElements(listaString) {
    var retorno = [];
    $.each(listaString, function (index, selector) {
        var element = $(selector);
        var id = element.attr("id");
        var height = element.height();
        var clientHeight = element[0].clientHeight;

        retorno.push({
            id: id ?? "",
            reference: selector,
            height: height ?? 0,
            clientHeight: clientHeight ?? 0
        });
    });

    return JSON.stringify(retorno);
}

function ObterHeightMobileIndexComponent(headerIdElement, footerIdElement) {
    var windowHeight = window.innerHeight;
    var headerHeight = $('#' + headerIdElement).height() ? $('#' + headerIdElement).height() : 70; //retorna em px
    var footerHeight = $('#' + footerIdElement).height() ? $('#' + footerIdElement).height() : windowHeight * (70 / 100); //retorna em px
    var alertHeight = 0;// $(".alert").height();

    //headerHeight = 70; //Analisando

    var heightMobile = (windowHeight - headerHeight - footerHeight - alertHeight - 30);
    return ((heightMobile / windowHeight) * 100) + "vh";
}

function ObterValorEntreTags(content, tag, tagEnd) {/* Ex: <div>teste</div> result: teste  */

    if (content == null || tag == null || tagEnd == null)
        return "";

    var inicio = content.indexOf(tag) + tag.length;
    var fim = content.indexOf(tagEnd);
    return content.substring(inicio, fim);
}

function GetItemAsStringAsync(key) {
    return localStorage.getItem(key);
}

function NavTabActive(activeTab) {
    $('.nav[role="tablist"] a[href="#' + activeTab + '"]').tab('show');
}

function OnClickNavBarItem() {
    var itemAtivo = null;
    $(".tab-content .tab-pane").each(function () {
        if ($(this).hasClass("show")) {
            itemAtivo = $(this).attr("id");
            $('.navbar-collapse').collapse('hide');
        }
    });
    return itemAtivo;
}

function OnClickNavToggler(tabPaneActived) {
    var padraoH = 0;
    var tabAlvo = null;
    $(".tab-content .tab-pane").each(function () {
        if ($(this).hasClass("show")) {
            tabAlvo = $(this);
        }
        else {
            padraoH = $(this).height();
        }
    });

    if (tabPaneActived) {
        tabAlvo.css("height", padraoH - $(".navbar-collapse ul").height());
    }
    else {
        tabAlvo.css("height", padraoH);
    }
}

function SetFocusOn(element) {
    $('#' + element).focus().select();
}

function saveFile(fileName, base64String, type) {
    const linkSource = `data:${type};base64,${base64String}`;
    const downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);

    downloadLink.href = linkSource;
    downloadLink.target = '_self';
    downloadLink.download = fileName;
    downloadLink.click();
}

function getFilePathFromInput(inputFile) {
    const pathParts = inputFile.value.split('\\');
    pathParts.pop();
    const directoryPath = pathParts.join('\\');
    return directoryPath;
}

function updateIframeContent(content) {
    if (content == null || content == "")
        content = "<body></body>";

    document.querySelector('iframe').setAttribute('srcdoc', content);
    return content;
}

function GetHtmlElement(idElement) {
    return $("#" + idElement).html();
}

function getScrollPosition() {
    if (window.pageYOffset !== undefined) {
        return JSON.stringify({
            x: window.pageXOffset,
            y: window.pageYOffset
        });
    }
    else if (document.documentElement.scrollTop !== undefined) {
        return JSON.stringify({
            x: document.documentElement.scrollLeft,
            y: document.documentElement.scrollTop
        });
    }
    else {
        return JSON.stringify({ x: 0, y: 0 });
    }
}

function NewGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function obterOrigin() {
    var appCloud = window.location.origin == "https://siceapp.com.br";
    var appName = window.location.pathname.split('/')[1];

    return origin = appCloud || appName?.toLowerCase() == 'siceapp' ? window.location.origin + "/" + window.location.pathname.split('/')[1] : window.location.origin;
}


//$("iframe").ready(function () {
//    console.log("ready");
//    if (document.querySelector("iframe") != null)
//        document.querySelector("iframe").addEventListener("click", function () {
//            console.log("click");
//            document.querySelector("iframe").contentDocument.body.contentEditable = true;
//        });
//    else
//        console.log("err");
    

//    //document.querySelector("iframe").addEventListener("input", updateIframeContent("<body>tese</body>"));

//});


/* FORMATAÇÃO PADRÃO */
function campoObrigatorio() {
    $('.alert-obrigatorio').removeClass('text-danger animated fadeInRight');
    alert("Por favor preencha os campos obrigatórios!");
    $('.alert-obrigatorio').text(' * Campo obrigatório').addClass('text-danger animated fadeInRight');
}
function campoObrigatorioClear() {
    $('.alert-obrigatorio').text('').removeClass('text-danger animated fadeInRight');
}
function enviarEmail(funcao) {
    switch (funcao) {
        case 0:
            let emailDest = "suporte@iqsistemas.com.br";
            let emailAssunto = "Solicitação de suporte";
            let emailCorpo = "Empresa: " + WebClienteNome + " \n Cidade: " + WebClienteCidade + " \n Telefone: " + WebClienteTel + " \n Solicitante: (Digite seu nome aqui) \n \n Solicitamos atendimento para: (digite sua solicitação aqui) \n \n";
            let emailLink = "mailto:"+emailDest+"?subject="+emailAssunto+"&body="+encodeURIComponent(emailCorpo);
            window.location.href = emailLink;
            break;
    }
}
function dataFormatada() {
    var dNow = new Date();
    var localdate = dNow.getDate() + '/' + (dNow.getMonth()+1) + '/' + dNow.getFullYear() + ' ' + dNow.getHours() + ':' + dNow.getMinutes();
    return localdate;
}

function campoInativo() {
    if ($('.input').is(':disabled') || $('.select').is(':disabled')) {
        $('.input:disabled').attr("style", "opacity: .2;").attr("title", "Campo bloqueado!");
        $('.select:disabled').attr("style", "opacity: .2;").attr("title", "Campo bloqueado!");
    }
}

validarTelefone();
function validarTelefone() {
    let telefone = $('.telefone').text();
    let restTelefone = '';
    
    if (telefone.substr(0,1) == 0) {
        restTelefone = telefone.substr(1,11);

        switch (restTelefone.length) {
            case 8:
                restTelefone = '00' + telefone;
                $('.telefone').text('(' + restTelefone.substr(0, 2) + ') ' + restTelefone.substr(2, 4) + ' - ' + restTelefone.substr(6, 4));
                break;

            case 9:
                restTelefone = '00' + telefone;
                $('.telefone').text('(' + restTelefone.substr(0, 2) + ') ' + restTelefone.substr(2, 1) + ' ' + restTelefone.substr(3, 4) + ' - ' + restTelefone.substr(7, 4));
                break;

            case 10:
                $('.telefone').text('(' + restTelefone.substr(0, 2) + ') ' + restTelefone.substr(2, 4) + ' - ' + restTelefone.substr(6, 4));
                break;

            case 11:
                $('.telefone').text('(' + restTelefone.substr(0, 2) + ') ' + restTelefone.substr(2, 1) + ' ' + restTelefone.substr(3, 4) + ' - ' + restTelefone.substr(7, 4));
                break;

            default:
                break;
        }
    } else{
        restTelefone = telefone;
        switch (restTelefone.length) {
            case 8:
                restTelefone = '00' + telefone;
                $('.telefone').text('(' + restTelefone.substr(0, 2) + ') ' + restTelefone.substr(2, 4) + ' - ' + restTelefone.substr(6, 4));
                break;

            case 9:
                restTelefone = '00' + telefone;
                $('.telefone').text('(' + restTelefone.substr(0, 2) + ') ' + restTelefone.substr(2, 1) + ' ' + restTelefone.substr(3, 4) + ' - ' + restTelefone.substr(7, 4));
                break;

            case 10:
                $('.telefone').text('(' + restTelefone.substr(0, 2) + ') ' + restTelefone.substr(2, 4) + ' - ' + restTelefone.substr(6, 4));
                break;

            case 11:
                    $('.telefone').text('(' + restTelefone.substr(0, 2) + ') ' + restTelefone.substr(2, 1) + ' ' + restTelefone.substr(3, 4) + ' - ' + restTelefone.substr(7, 4));
                break;

            default:
                break;
        }
    }
}

/* FORMATAÇÃO PADRÃO FIM */

function GerarQRCode(idQRCode) {
    $("#qrcode").html("");
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        width: 200,
        height: 200
    });
    qrcode.makeCode(idQRCode);
}






/* PAGINA DE PIN 
function irPagLogin() {
    if ($('#inputPin').val().length > 0) {
        campoObrigatorioClear();
        window.location.href="paginas/pglogin.php";
    } else{
        campoObrigatorio();
        $('#inputPin').focus();
    }
}
 PAGINA DE PIN FIM */




/* PAGINA DE LOGIN 
function irPagInicio() {
    if (
        $('#inputLoginUser').val().length > 0 && 
        $('#inputLoginSenha').val().length > 0 && 
        $('#selectLoginGrupo').val().length > 0 && 
        $('#selectLoginFilial').val().length > 0
        ) {
            campoObrigatorioClear();
            window.location.href="../paginas/pgInicio.php";
    } else {
        campoObrigatorio();
        $('#inputLoginUser').val('');
        $('#inputLoginSenha').val('');
        $('#selectLoginGrupo').val('');
        $('#selectLoginFilial').val('');
        $('#inputLoginUser').focus();
    }
}
 PAGINA DE LOGIN FIM */




/**************************************************/

/* PAGINA INICIO */

/* FORMATAÇÃO PADRÃO */
/*let operFoto = operadorFoto; // PERFIL DO OPERADOR
if (operFoto != '') {
    let diroperFoto = '<img src="../imagens/operadores/' + operFoto + '" class="rounded-circle" style="width: 3rem; height: 3rem; line-height: 2rem;" title="' + operadorUsuario + '">';
    $("#inicioInicial").removeClass('inicioInicial').html(diroperFoto);
} else {
    $("#inicioInicial").text($("#inicioOperador").text().substr(0, 1)).css("background-color", gerarCor());
}

function gerarCor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let contador = $('#inicioContador');
if (contador.text() > 0) { // NOTIFICAÇÕES
    $('#inicioNotificacao').attr({'src': '../svg/notificacoes-ativo.svg', 'title': 'Você tem ' + contador.text() + ' novas notificações'});
    contador.attr({'src': '../svg/notificacoes-ativo.svg', 'title': 'Você tem '+contador.text()+' novas notificações'});
} else {
    $('#inicioNotificacao').attr({'src': '../svg/notificacoes-inativo.svg', 'title': 'Ver notificações antigas'});
    contador.hide();
}
if (contador.text() > 99) {
    contador.text('99+').attr('title', 'Você tem mais de ' + contador.text().substr(0,2) + ' novas notificações');
}

let codFilial = $("#inicioCodFilial");
let filial = $("#inicioFilial");

if (codFilial.text().length > 5) { // LIMITE DE CARACTERES PARA CÓDGIO DA FILIAL
    codFilial.text(codFilial.text().substr(0, 5));
}
if (filial.text().length > 22) { // LIMITE DE CARACTERES PARA NOME DA FILIAL
    filial.text(filial.text().substr(0, 23));
}
*/
function sair() { // SAIR DO SISTEMA
    window.location.href="../paginas/pglogin.php";
}



/* FORMATAÇÃO PADRÃO FIM */




/* PAGINA INICIO FIM */


/* PAGINA COMPRAS */
$("#CarregarXML").change(function() {
    $(this).prev().html($(this).val());
});
/* PAGINA COMPRAS FIM */




/**************************************************/
/* PÁGINA CONFIGURAÇÕES */
$("#configuracaoBtnIQCARD").hover( // BOTÕES DA BARRA LATERAL
    function() {
        $(this).attr("src","../imagens/logo-iqcard-2-hover.png");
    }, function() {
        $(this).attr("src","../imagens/logo-iqcard-2.png");
    }
);

/* PÁGINA CONFIGURAÇÕES FIM */


/**************************************************/
/* FORMATAÇÃO PADRÃO */



/* FORMATAÇÃO PADRÃO FIM */




/**************************************************/
/* BOTÃO AJUDA */
function abreAjuda() {
    if ($(window).height() < 769 || $(window).width() < 769) {
        $(".ajuda").removeClass('col-1').addClass('col-5');
     }
     if ($(window).width() < 420) {
        $(".ajuda").removeClass('col-3').addClass('col-11');
     }
     else {
        $(".ajuda").removeClass('col-1').addClass('col-3');
     }

    $(".ajuda-conteudo").removeClass("d-none");
    $("#btn-ajuda").addClass('ajuda-ativo');
    $("#btn-ajuda").attr('onclick', 'fechaAjuda()');
}
function fechaAjuda() {
    if ($(window).height() < 769 || $(window).width() < 769) {
        $(".ajuda").removeClass('col-5').addClass('col-1');
     }
     if ($(window).width() < 420) {
        $(".ajuda").removeClass('col-11').addClass('col-3');
     }
     else {
         $(".ajuda").removeClass('col-3').addClass('col-1');
     }

    $(".ajuda-conteudo").addClass("d-none");
    $("#btn-ajuda").removeClass('ajuda-ativo');
    $("#btn-ajuda").attr('onclick', 'abreAjuda()');
}
ajuda();
function ajuda() {/*
    let iqcardSuporte = WebIQCARDsuporte;
    var qrcode = new QRCode(document.getElementById("qrcode-ajuda"), {
        width : 200,
        height : 200
    });
    qrcode.makeCode(iqcardSuporte+"chat");*/
}
/* BOTÃO AJUDA FIM */