export function select_devicesList(navigator, selectors, VideoSelect, AudioInputSelect, AudioOutputSelect) {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
        for (let i = 0; i !== deviceInfos.length; ++i) {
            const deviceInfo = deviceInfos[i];
            const option = document.createElement('option');
            option.value = deviceInfo.deviceId;
            if (deviceInfo.kind === 'audioinput') {
                console.log(deviceInfo.label);
            } else if (deviceInfo.kind === 'audiooutput') {
                console.log(deviceInfo.label);
            } else if (deviceInfo.kind === 'videoinput') {
                console.log(deviceInfo.label);
            } else {
                console.log('Some other kind of source/device: ', deviceInfo);
            }
        }
    });
}