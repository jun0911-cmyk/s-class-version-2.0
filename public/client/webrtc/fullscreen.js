export function startFS(docV) {
    if (docV.requestFullscreen) 
        docV.requestFullscreen();
    else if (docV.webkitRequestFullscreen)
        docV.webkitRequestFullscreen();
    else if (docV.mozRequestFullScreen)
        docV.mozRequestFullScreen();
    else if (docV.msRequestFullscreen)
        docV.msRequestFullscreen();
}