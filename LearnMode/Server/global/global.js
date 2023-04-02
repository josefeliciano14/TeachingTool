export function getFileExtension(fileName){
    console.log("File Name: ");
    console.log(fileName);
    
    let divs = fileName.split(".");

    return divs[divs.length-1];
}