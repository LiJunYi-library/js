export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.readyState === 2) {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to load file as Base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


