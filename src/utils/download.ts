export function download(file: Blob | File) {
  let a = document.createElement("a");
  let url = URL.createObjectURL(file);
  a.href = url;
  a.download = file instanceof File ? file.name : "download";
  a.click();
  URL.revokeObjectURL(url);
}
