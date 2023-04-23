export function getFileExtension(fileName){
    if(fileName){
        let divs = fileName.split(".");

        return divs[divs.length-1];
    }
    else{
        return fileName;
    }
}

export let supportedImgFormats = ["png", "jpeg", "gif", "svg", "bmp", "ico"];