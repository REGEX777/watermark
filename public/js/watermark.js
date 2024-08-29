// elements initiliaztipn
const watermarkImage = document.getElementById('watermarkImage');
const watermarkX = document.getElementById('watermarkX');
const watermarkY = document.getElementById('watermarkY');


// absolute positong for the watermark image
watermarkImage.style.position = 'absolute';

// default posiiton will be (0, 0)
watermarkImage.style.left = '0px';
watermarkImage.style.top = '0px';
watermarkX.value = 0;
watermarkY.value = 0;

watermarkImage.onmousedown = function (event) {
    event.preventDefault();

    let shiftX = event.clientX - watermarkImage.getBoundingClientRect().left;
    let shiftY = event.clientY - watermarkImage.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        watermarkImage.style.left = `${pageX - shiftX}px`;
        watermarkImage.style.top = `${pageY - shiftY}px`;

        watermarkX.value = parseInt(watermarkImage.style.left, 10) || 0;
        watermarkY.value = parseInt(watermarkImage.style.top, 10) || 0;
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    watermarkImage.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        watermarkImage.onmouseup = null;
    };
};

watermarkImage.ondragstart = function () {
    return false;
};
