function noEvent() {
    if (event.keyCode == 116) {
        event.keyCode = 2;
        return false;
    } else if (event.ctrlKey && (event.keyCode==78 || event.keyCode == 82)) {
        return false;
    }
}

document.onkeydown = noEvent;