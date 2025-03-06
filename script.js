/* Chargement du fichier JSON */
let jsonData = {};

async function fetchData() {
  try {
    const response = await fetch('./shapes.json');
    jsonData = await response.json();
    // console.log(jsonData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
fetchData();

function hexToRgb(hex) {
  const bigint = parseInt(hex, 16);
  // console.log(hex, bigint);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  // console.log(r, g, b);
  return { r, g, b };
}

function findColor(text) {
  const color = jsonData[text];
  // console.log(color);
  if (color) {
    return color;
  } else {
    alert('Forme non trouvée');
  }
}

document.getElementById('button-search').addEventListener('click', function () {
  const selectElement = document.getElementById('color-input');
  const selectedOptions = Array.from(selectElement.selectedOptions).map(option => option.value);
  // console.log(selectedOptions)

  const image = document.getElementById('calque');
  const canvas = document.getElementById('canvas');
  /* Optimisation de la lecture des pixels */
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  const highlightColors = selectedOptions.map(findColor).map(hexToRgb);

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
  // console.log(highlightData, highlightPixels)
  
  for (let i = 0; i < data.length; i += 4) {
    let isHighlighted = false;
    for (const color of highlightColors) {
      if (data[i] === color.r && data[i + 1] === color.g && data[i + 2] === color.b) {
        isHighlighted = true;
        break;
      }
    }
    if (isHighlighted) {
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