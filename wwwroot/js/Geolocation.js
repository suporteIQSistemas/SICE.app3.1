window.addEventListener('load', function () {
    GetGeolacation();
});

function GetGeolacation() {
    var idRoute = window.location.origin == "https://siceapp.com.br" ? 2 : 1;
    if (window.location.pathname.split('/')[idRoute] == "catalogoonline") {
        navigator.geolocation.getCurrentPosition(success, error, options);
    }
}

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

function success(pos) {
    const crd = pos.coords;
    const obj = {
        "latitude": crd.latitude,
        "longitude": crd.longitude,
        "uf": "",
        "municipio": ""
    };
    
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var origin = obterOrigin();
        var filePath = origin + '/data/geolocationIBGE.json';

        $.get(filePath, function (dados) {

            var terminate = false;
            var substr = 5;
            
            while (!terminate) {
                const foundItem = dados.BR_Localidades_2010_v1.find((item) => {
                    const Ilatitude = item.LAT.toString().substring(0, substr);
                    const latitude = crd.latitude.toString().substring(0, substr);

                    const Ilongitude = item.LONG.toString().substring(0, substr);
                    const longitude = crd.longitude.toString().substring(0, substr);

                    return Ilatitude === latitude && Ilongitude === longitude;
                });

                if (foundItem) {
                    obj.uf = foundItem.CD_GEOCODM.substring(0, 2);
                    obj.municipio = foundItem.CD_GEOCODM;
                    localStorage.setItem('geolocation', JSON.stringify(obj));
                }

                terminate = substr == 1 || foundItem;
                substr--;
            }

        }).fail(function () {
            console.log('Erro ao ler os dados do IBGE.');
        });
    }
    
}

function error(err) {
    localStorage.setItem('geolocation', "");
}
