import { ChatImage } from '@/assets/links/imagesLinks'

// 根据文件路径获取文件类型（用于消息记录）
export const getFileSuffixByPath = (path:string) => {
  const filename = (new URLSearchParams(path.split("?")[1])).get("filename");
  const fileSuffix = filename!.substring(filename!.lastIndexOf(".") + 1).toLowerCase();
  switch (fileSuffix) {
    case "avi":
    case "mpeg":
    case "wmv":
    case "mov":
    case "flv":
    case "mp4":
      return "video";
    case "png":
    case "jpeg":
    case "jpg":
    case "gif":
    case "webp":
    case "svg":
      return "image";
    default:
      return fileSuffix;
  }
}
// 根据文件名获取文件类型（用于发送消息）
export const getFileSuffixByName = (filename:string) => {
  const fileSuffix = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
  switch (fileSuffix) {
    case "avi":
    case "mpeg":
    case "wmv":
    case "mov":
    case "flv":
    case "mp4":
      return "video";
    case "png":
    case "jpeg":
    case "jpg":
    case "gif":
    case "webp":
    case "svg":
      return "image";
    default:
      return "file";
  }
}
//获取各类文件图标
export const getFileIcons = (path:string) => {
  const fileSuffix = path.substring(path.lastIndexOf(".") + 1).toLowerCase();
  switch (fileSuffix) {
    case "docx":
    case "doc":
      return require(ChatImage.WORD);
    case "xls":
    case "xlsx":
      return require(ChatImage.EXCEL);
    case "ppt":
    case "pptx":
      return require(ChatImage.PPT);
    case "pdf":
      return require(ChatImage.PDF);
    case "apk":
      return require(ChatImage.APK);
    case "exe":
      return require(ChatImage.EXE);
    case "rar":
    case "zip":
    case "gz":
    case "tar":
    case "7z":
      return require(ChatImage.ZIP);
    case "avi":
    case "mpeg":
    case "wmv":
    case "mov":
    case "flv":
    case "mp4":
      return require(ChatImage.MP4);
    default:
      return require(ChatImage.TXT);
  }
}
//获取文件名
export const getFileName = (path:string) => {
  const fileName = path.split('/').pop();
  return fileName;
}
