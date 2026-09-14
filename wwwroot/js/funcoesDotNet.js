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

async function statusApiWhatsAppConexao() {
    try {
        await DotNet.invokeMethodAsync(_assemblyName, "StatusApiWhatsAppConexao");

    } catch (error) {
        console.error('Erro ao chamar a função. ', error);
        throw error;
    }
}
async function htmlToPdfConverter(printPage, style = true, formatacaoBase = true, baseUri = "", colorido = false) {
    try {
        const result = await DotNet.invokeMethodAsync(_assemblyName,
                                                      "HtmlToPdfConverter", 
                                                      printPage, 
                                                      style,
                                                      formatacaoBase,
                                                      baseUri,
                                                      colorido);

        return result;

    } catch (error) {
        console.error('Erro ao chamar a função. ', error);
        throw error;
    }
}