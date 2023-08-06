import { ChatImage } from '@/assets/images';

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
};
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
};
//获取各类文件图标
export const getFileIcons = (path:string) => {
  const fileSuffix = path.substring(path.lastIndexOf(".") + 1).toLowerCase();
  switch (fileSuffix) {
    case "docx":
    case "doc":
      return ChatImage.WORD;
    case "xls":
    case "xlsx":
      return ChatImage.EXCEL;
    case "ppt":
    case "pptx":
      return ChatImage.PPT;
    case "pdf":
      return ChatImage.PDF;
    case "apk":
      return ChatImage.APK;
    case "exe":
      return ChatImage.EXE;
    case "rar":
    case "zip":
    case "gz":
    case "tar":
    case "7z":
      return ChatImage.ZIP;
    case "avi":
    case "mpeg":
    case "wmv":
    case "mov":
    case "flv":
    case "mp4":
      return ChatImage.MP4;
    case 'txt':
      return ChatImage.TXT;
    default:
      return ChatImage.DEFAULT;
  }
};
//获取文件名
export const getFileName = (path:string) => {
  const fileName = path.split('/').pop();
  return fileName;
};
// 根据图片/视频链接获得图片/视频宽高
export const getMediaSize = (mediaUrl: string,mediaType:string): Promise<{ width: number, height: number }> => {
  return new Promise((resolve, reject) => {
    if(mediaType==='image'){
      const mediaElement = document.createElement('img');
      mediaElement.src = mediaUrl;
      mediaElement.onload = () => {
        resolve({ width: mediaElement.width, height: mediaElement.height });
      };
      mediaElement.onerror = () => {
        reject(new Error(`图片加载失败`));
      };
    }else if(mediaType==='video'){
      const mediaElement = document.createElement('video');
      mediaElement.src = mediaUrl;
      mediaElement.addEventListener('canplay', function() {
        resolve({ width:mediaElement.videoWidth, height:mediaElement.videoHeight });
      });
    }
  });
};
// 根据实际宽高计算展示的合理宽高(图片是按照一定算法缩小，视频是存在横屏和竖屏两种情况)
export const getMediaShowSize = (size: { width: number; height: number },mediaType:'image' | 'video'): { width: string} => {
  if(mediaType==='image'){
    const widthRem = size.width/1000;
    if(widthRem<1){
      return { width: `${widthRem+0.2}rem`};
    }else if(widthRem<3){
      return { width: `${widthRem}rem`};
    }else{
      return { width: `${3}rem`};
    }
  }else{
    // 横屏
    if(size.width>size.height){
      return { width: `${2.5}rem`};
    }else{
      return { width: `${1}rem`};
    }
  }
};
// 文件下载
export const downloadFile = (url: string)=>{
  const link = document.createElement('a');
  link.href = url;
  link.download = '';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
