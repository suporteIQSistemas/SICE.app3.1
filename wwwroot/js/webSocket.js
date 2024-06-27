let socket = null;
let imgQRCodeElement = null;

function conectarSocket(url, idElement, options) {
    imgQRCodeElement = idElement;
    socket = io(url, JSON.parse(options));

    socket.on('connect', () => {
    });

    socket.on('disconnect', () => {
    });

    // Gerar QRCode WhatsApp API Connect
    socket.on('qrcoderetorno', (response) => {
        var qrCodeImage = document.getElementById(imgQRCodeElement);
        qrCodeImage.src = response.status == "conectado" ? `${obterOrigin()}/imagens/loadingComponent.gif` : response.url;

    });

    // Atualiza status conexão  WhatsApp API Connect
    socket.on('dispositivoativado', (response) => {
        var qrCodeImage = document.getElementById(imgQRCodeElement);
        qrCodeImage.src = `${obterOrigin()}/imagens/loadingComponent.gif`;

    });
}

function gerarQRCodeWhatsAppConnect() {
    socket.emit('gerar-qrcode', '')
}

function desconectarSocket() {
    if (socket) {
        socket.disconnect();
    }
}
