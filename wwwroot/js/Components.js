/**************************/
/*   BARCODE SCANNER     */
/************************/
window.barcodeScanner = {
    continueScanning: true,

    startScanner: function (videoElementId, dotNetObjectReference) {
        const video = document.getElementById(videoElementId);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(function (stream) {
                video.srcObject = stream;
                video.setAttribute('playsinline', true);
                video.play();
                requestAnimationFrame(tick);
            });

        const tick = () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA && this.continueScanning) {
                canvas.height = video.videoHeight;
                canvas.width = video.videoWidth;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = canvas.toDataURL('image/png');
                dotNetObjectReference.invokeMethodAsync('ReceiveBarcodeFrame', imageData).then(response => {
                    if (response) {
                        this.continueScanning = false;
                    }
                });
            }
            if (this.continueScanning) {
                requestAnimationFrame(tick);
            }
        };

        this.continueScanning = true;
        requestAnimationFrame(tick);
    },

    stopScanner: function () {
        this.continueScanning = false;
    }
};

/**************************/
/*     CAMERA PHOTO      */
/************************/
window.camera = {
    startCamera: function (videoElementId) {
        const video = document.getElementById(videoElementId);
        navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'environment' } })
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function (err) {
                console.error("Error accessing camera: " + err);
            });
    },
    captureImage: function (videoElementId, canvasElementId) {
        const video = document.getElementById(videoElementId);
        const canvas = document.getElementById(canvasElementId);
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/png');
    },
    stopCamera: function () {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.videoElement.srcObject = null;
        }
    }
};

/**************************/
/* CARD LIST - DROPDOWN  */
/************************/
function initializeCardListDropdown(dotNetHelper) {
    document.addEventListener('click', function (event) {
        const elementId = event.target.firstElementChild?.id || event.target.id || event.target.parentElement.id || event.target.parentElement.parentElement.id || '';
        const clientX = event.clientX;
        const clientY = event.clientY;

        dotNetHelper.invokeMethodAsync('OnClickItem', clientX, clientY, elementId);
    });
}

/******************************/
/* NAVTAB - SCROLL TAB ITEMS */
/****************************/
function iniciarNavTab(idElement) {
    let bodyHeight = MobileDevice() ? 65 : 95;
    let container = document.querySelector(`#${idElement}`);

    const NavTabHeaderElement = container.querySelector('#NavTabHeader');
    const NavTabHeaderFirstRowElement = container.querySelector('#NavTabHeader .row');

    const NavTabBodyElement = NavTabHeaderElement.nextElementSibling;

    let isDown = false;
    let startX;
    let scrollLeft;

    const startDragging = (e) => {
        isDown = true;
        startX = (e.pageX || e.touches[0].pageX) - NavTabHeaderFirstRowElement.offsetLeft;
        scrollLeft = NavTabHeaderFirstRowElement.scrollLeft;
    };

    const stopDragging = () => {
        isDown = false;
    };

    const drag = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = (e.pageX || e.touches[0].pageX) - NavTabHeaderFirstRowElement.offsetLeft;
        const walk = (x - startX) * 3; // Ajuste a velocidade de rolagem
        NavTabHeaderFirstRowElement.scrollLeft = scrollLeft - walk;
    };

    if (NavTabHeaderFirstRowElement) {
        NavTabHeaderFirstRowElement.addEventListener('mousedown', startDragging);
        NavTabHeaderFirstRowElement.addEventListener('mouseleave', stopDragging);
        NavTabHeaderFirstRowElement.addEventListener('mouseup', stopDragging);
        NavTabHeaderFirstRowElement.addEventListener('mousemove', drag);

        // Adicionando suporte para touch (mobile)
        NavTabHeaderFirstRowElement.addEventListener('touchstart', startDragging);
        NavTabHeaderFirstRowElement.addEventListener('touchend', stopDragging);
        NavTabHeaderFirstRowElement.addEventListener('touchmove', drag);

        // Adicionando suporte para Edge
        NavTabHeaderFirstRowElement.addEventListener('pointerdown', startDragging);
        NavTabHeaderFirstRowElement.addEventListener('pointerup', stopDragging);
        NavTabHeaderFirstRowElement.addEventListener('pointermove', drag);
    }

    if (container) {
        let elementFocus = container.querySelector("input");
        if (elementFocus) {
            elementFocus.focus();
        } else {
            elementFocus = container.nextElementSibling.querySelector("button");
            if (elementFocus) {
                elementFocus.focus();
            }
        }
    }
}

/*****************************/
/* TABLE - SCROLL TAB ITEMS */
/***************************/
