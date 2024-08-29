// elements initialization
const watermarkImage = document.getElementById('watermarkImage');
const watermarkX = document.getElementById('watermarkX');
const watermarkY = document.getElementById('watermarkY');
const imageContainer = document.getElementById('imageContainer');

function setPosition(position) {
    const containerWidth = imageContainer.clientWidth;
    const containerHeight = imageContainer.clientHeight;
    const watermarkWidth = watermarkImage.clientWidth;
    const watermarkHeight = watermarkImage.clientHeight;

    let newLeft, newTop;

    switch (position) {
        case 'top-left':
            newLeft = 0;
            newTop = 0;
            break;
        case 'top-right':
            newLeft = containerWidth - watermarkWidth;
            newTop = 0;
            break;
        case 'bottom-left':
            newLeft = 0;
            newTop = containerHeight - watermarkHeight;
            break;
        case 'bottom-right':
            newLeft = containerWidth - watermarkWidth;
            newTop = containerHeight - watermarkHeight;
            break;
    }

    watermarkImage.style.left = `${newLeft}px`;
    watermarkImage.style.top = `${newTop}px`;

    watermarkX.value = newLeft;
    watermarkY.value = newTop;
}
