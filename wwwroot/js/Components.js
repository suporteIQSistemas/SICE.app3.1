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
function iniciarNavTab() {
    const NavTabHeaderElement = document.querySelector('#NavTabHeader .row');

    let isDown = false;
    let startX;
    let scrollLeft;

    const startDragging = (e) => {
        isDown = true;
        startX = (e.pageX || e.touches[0].pageX) - NavTabHeaderElement.offsetLeft;
        scrollLeft = NavTabHeaderElement.scrollLeft;
    };

    const stopDragging = () => {
        isDown = false;
    };

    const drag = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = (e.pageX || e.touches[0].pageX) - NavTabHeaderElement.offsetLeft;
        const walk = (x - startX) * 3; // Ajuste a velocidade de rolagem
        NavTabHeaderElement.scrollLeft = scrollLeft - walk;
    };

    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.classList.contains("alert")) {
                        setBodyHeight(85);
                    } else {
                        setBodyHeight(95);
                    }
                });
            }
        }
    });

    // Ajuste Body Max-Height
    const setBodyHeight = (e) => {
        var windowsHeight = $(window).height() / 100;
        var headerHeight = $("#NavTabHeader").height() / windowsHeight;
        $("#NavTabBody").css("max-height", `${e - headerHeight}vh`);
    };

    if (NavTabHeaderElement) {
        NavTabHeaderElement.addEventListener('mousedown', startDragging);
        NavTabHeaderElement.addEventListener('mouseleave', stopDragging);
        NavTabHeaderElement.addEventListener('mouseup', stopDragging);
        NavTabHeaderElement.addEventListener('mousemove', drag);

        // Adicionando suporte para touch (mobile)
        NavTabHeaderElement.addEventListener('touchstart', startDragging);
        NavTabHeaderElement.addEventListener('touchend', stopDragging);
        NavTabHeaderElement.addEventListener('touchmove', drag);

        // Adicionando suporte para Edge
        NavTabHeaderElement.addEventListener('pointerdown', startDragging);
        NavTabHeaderElement.addEventListener('pointerup', stopDragging);
        NavTabHeaderElement.addEventListener('pointermove', drag);

        setBodyHeight(95);
    }

    $('form:first :input:enabled:visible:first')?.focus()?.select();
}

/*****************************/
/* TABLE - SCROLL TAB ITEMS */
/***************************/
function verificaSeModal() {
    return $('div').hasClass('blazored-modal-container');
}

