export function checkstatus(roomId, socket) {
    socket.emit('check_status', roomId);

    socket.on('check_status', function(status, client) {
        var statusEvent = new CustomEvent('status', {
            detail: {
                statusData: status
            }
        });
        window.dispatchEvent(statusEvent);
    });
}