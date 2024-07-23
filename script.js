let jsonData = {};

async function fetchData() {
  try {
    const response = await fetch('./shapes.json');
    jsonData = await response.json();
    console.log(jsonData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
fetchData();

document.getElementById('button-search').addEventListener('click', function () {
  const textInput = document.getElementById('color-input').value;
  const image = document.getElementById('calque');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const color = findColor(textInput);
  const highlightColor = hexToRgb(color);

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0, image.width, image.height);
  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  const data = imageData.data;

  const highlightCanvas = document.createElement('canvas');
  highlightCanvas.width = canvas.width;
  highlightCanvas.height = canvas.height;
  const highlightCtx = highlightCanvas.getContext('2d');
  const highlightData = highlightCtx.createImageData(canvas.width, canvas.height);
  const highlightPixels = highlightData.data;

  for (let i = 0; i < data.length; i += 4) {
    if (data[i] === highlightColor.r && data[i + 1] === highlightColor.g && data[i + 2] === highlightColor.b) {
      highlightPixels[i] = 255;
      highlightPixels[i + 1] = 255;
      highlightPixels[i + 2] = 0;
      highlightPixels[i + 3] = 127;

    } else {
      highlightPixels[i + 3] = 0;
    }
  }

  highlightCtx.putImageData(highlightData, 0, 0);

  const highlightImg = document.createElement('img');
  highlightImg.src = highlightCanvas.toDataURL();
  highlightImg.className = 'highlight';
  highlightImg.style.top = image.offsetTop + 'px';
  highlightImg.style.left = image.offsetLeft + 'px';
  highlightImg.style.display = 'block';

  const existingHighlight = document.querySelector('.highlight');
  if (existingHighlight) {
    existingHighlight.remove();
  }

  document.querySelector('.image-container').appendChild(highlightImg);
});

function hexToRgb(hex) {
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

function findColor(text) {
  const color = jsonData[text];
  console.log(color)
  if (color) {
    return color
  } else {
    alert('Shape not found');
  }
}