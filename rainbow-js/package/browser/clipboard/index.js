export function getClipboardContents(fmt) {
  return new Promise(async (resolve, reject) => {
    const clipboardItems = await navigator.clipboard.read();
    let hasImg = false;
    const files = [];
    for (const clipboardItem of clipboardItems) {
      const types = clipboardItem.types;
      for (const type of types) {
        if (fmt(type)) {
          hasImg = true;
          const blob = await clipboardItem.getType(type);
          blob.lastName = blob.type?.match?.(/\/([^\/]+)$/)?.[1];
          files.push(blob);
        }
      }
    }

    if (hasImg === true && files.length > 0) resolve(files);
    else reject("error");
  });
}

export function getClipboardImgs(fmt = (type) => type.startsWith("image/")) {
  return getClipboardContents(fmt);
}
