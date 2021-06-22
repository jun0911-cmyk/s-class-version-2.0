export function audio_devices_setting(selectDevices) {
    selectDevices.addEventListener("click", () => {
        var classes = document.getElementById('audio_settings').classList;
        var select = classes.toggle('fa-chevron-up');
        if(select == true) {
            $('#audio_dropdown').show();
            document.getElementById('audio_dropdown').innerHTML = `
                <span id="AudioInputSelect">마이크 선택</span>
                </br>
                <span id="AudioOutputSelect">스피커 선택</span>
                </br>
                <button>오디오 설정...</button>
            `
        } else {
            $('#audio_dropdown').hide();
        }
    });
}