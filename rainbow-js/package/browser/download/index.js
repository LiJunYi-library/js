import { imgParseBlob } from "../img";

export function downloadFile(blob, fileName) {
  const elink = document.createElement("a");
  elink.download = fileName;
  elink.style.display = "none";
  elink.href = URL.createObjectURL(blob);
  document.body.appendChild(elink);
  elink.click();
  URL.revokeObjectURL(elink.href);
  document.body.removeChild(elink);
}

export async function downloadForImgHtml(img, type, fileName) {
  const blob = await imgParseBlob(img, type);
  downloadFile(blob, fileName);
}
