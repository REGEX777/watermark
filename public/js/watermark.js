// elements initiliaztipn
const watermarkImage = document.getElementById('watermarkImage');
const watermarkX = document.getElementById('watermarkX');
const watermarkY = document.getElementById('watermarkY');
const imageContainer = document.getElementById('imageContainer');
const regularImage = document.getElementById('regularImage');

// absolute positioning for the watermark image
watermarkImage.style.position = 'absolute';

// default position will be (0, 0)
watermarkImage.style.left = '0px';
watermarkImage.style.top = '0px';
watermarkX.value = 0;
watermarkY.value = 0;

watermarkImage.onmousedown = function (event) {
    event.preventDefault();

    let shiftX = event.clientX - watermarkImage.getBoundingClientRect().left;
    let shiftY = event.clientY - watermarkImage.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        let newLeft = pageX - shiftX - imageContainer.getBoundingClientRect().left;
        let newTop = pageY - shiftY - imageContainer.getBoundingClientRect().top;

        // Ensure the watermark stays within the container
        if (newLeft < 0) newLeft = 0;
        if (newTop < 0) newTop = 0;
        if (newLeft + watermarkImage.clientWidth > regularImage.clientWidth)
            newLeft = regularImage.clientWidth - watermarkImage.clientWidth;
        if (newTop + watermarkImage.clientHeight > regularImage.clientHeight)
            newTop = regularImage.clientHeight - watermarkImage.clientHeight;

        watermarkImage.style.left = `${newLeft}px`;
        watermarkImage.style.top = `${newTop}px`;

        watermarkX.value = newLeft;
        watermarkY.value = newTop;
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
