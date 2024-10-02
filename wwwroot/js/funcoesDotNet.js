const _assemblyName = "SICEWeb";
async function obterMaxFileSize() {
    try {
        const result = await DotNet.invokeMethodAsync(_assemblyName, "ObterMaxFileSize");
        return result;
    } catch (error) {
        console.error('Erro ao chamar a função. ', error);
        throw error;
    }
}

async function saveFile(printPage, type) {
    try {
        await DotNet.invokeMethodAsync(_assemblyName, "PrintPageDB", "gravar", printPage);
        window.open(`api/Download/DownloadFile/?ipTerminal=${printPage?.ipTerminal}`);

    } catch (error) {
        console.error('Erro ao chamar a função. ', error);
        throw error;
    }
}

async function statusApiWhatsAppConexao() {
    try {
        await DotNet.invokeMethodAsync(_assemblyName, "StatusApiWhatsAppConexao");

    } catch (error) {
        console.error('Erro ao chamar a função. ', error);
        throw error;
    }
}
async function htmlToPdfConverter(printPage, style = true, baseUri = "") {
    try {
        const result = await DotNet.invokeMethodAsync(_assemblyName, "HtmlToPdfConverter", printPage, style, baseUri, false);
        return result;
    } catch (error) {
        console.error('Erro ao chamar a função. ', error);
        throw error;
    }
}