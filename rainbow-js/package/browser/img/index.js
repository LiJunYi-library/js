export async function loadImg(src) {
  if (!src) return Promise.reject();
  if (!/\.(jpg|jpeg|png|gif)/g.test(src)) return Promise.reject();
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.src = src;
    img.onload = (e) => {
      resolve(e);
      img = null;
    };
    img.onerror = (e) => {
      reject(e);
      img = null;
    };
  });
}

export function loadSSHImg(src) {
  if (!/^(http(s?)):\/\/.*?\.(jpg|jpeg|png|gif)/g.test(src))
    return Promise.reject();
  return loadImg(src);
}

export function preLoadImg(obj) {
  JSON.stringify(obj, (key, value) => {
    loadSSHImg(value);
    return value;
  });
}

export async function preLoadImgs(...list) {
  return Promise.all(list.map((src) => loadImg(src)));
}

export async function requireImgFiles(imgFiles) {
  if (!imgFiles) return Promise.reject();
  const list = imgFiles.keys().map((path) => {
    const content = imgFiles(path);
    return content;
  });
  return Promise.all(list.map((src) => loadImg(src)));
}

export function imgParseBlob(img, type = "image/png") {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject();
    }, type);
  });
}
