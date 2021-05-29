// Read an image (from form file object) and
// return the image in base64/dataUrl format
export const read = file => new Promise(res => {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    res(reader.result);
  }, false);
  reader.readAsDataURL(file);
});

// Scale an image in base64/dataUrl format
export const scale = (dataUrl, maxWidth = 2000, maxHeight = 2000, quality = 0.8) => new Promise(res => {
  let img = document.createElement('img');
  img.src = dataUrl;
  img.onload = () => {
    let { width: w, height: h } = img;
    let scale = Math.min(maxWidth / w, maxHeight / h);
    w = Math.floor(w * scale);
    h = Math.floor(h * scale);
    let canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, w, h);
    res(canvas.toDataURL('image/jpeg', quality));
  }
});