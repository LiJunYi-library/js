export async function imgLoad(src) {
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

export function imgLoadSSH(src) {
  if (!/^(http(s?)):\/\/.*?\.(jpg|jpeg|png|gif)/g.test(src)) return Promise.reject();
  return loadImg(src);
}

export function imgPreLoad(obj) {
  JSON.stringify(obj, (key, value) => {
    loadSSHImg(value);
    return value;
  });
}

export async function imgsPreLoad(...list) {
  return Promise.all(list.map((src) => loadImg(src)));
}

export async function imgFilesRequire(imgFiles) {
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

export function imgCompress(src, imageType, options = {}) {
  const config = {
    width: undefined,
    height: undefined,
    zoom: 0.5,
    quality: 0.92,
    ...options,
  };
  if (config.width) config.width = config.width * 1;
  if (config.height) config.height = config.height * 1;
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.style.width = img.width;
      canvas.style.height = img.height;
      const { W, H } = (() => {
        if (config.zoom) return { W: img.width * config.zoom, H: img.height * config.zoom };
        if (config.width && !config.height) {
          return { W: config.width, H: (config.width / img.width) * img.height };
        }
        if (config.height && !config.width) {
          return { W: (config.height / img.height) * img.width, H: config.height };
        }
        return { W: config.width, H: config.height };
      })();
      canvas.width = W;
      canvas.height = H;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          resolve({ blob, base64: canvas.toDataURL(imageType, config.quality), img });
        },
        imageType,
        config.quality,
      );
    };
  });
}

export const loadImg = imgLoad;
export const loadSSHImg = imgLoadSSH;
export const preLoadImg = imgPreLoad;
export const preLoadImgs = imgsPreLoad;
export const requireImgFiles = imgFilesRequire;
