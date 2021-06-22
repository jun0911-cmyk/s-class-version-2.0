function isBrowserCheck(){ 
    const agt = navigator.userAgent.toLowerCase(); 
    if (agt.indexOf("chrome") != -1) return 'Chrome'; 
    if (agt.indexOf("opera") != -1) return 'Opera'; 
    if (agt.indexOf("staroffice") != -1) return 'Star Office'; 
    if (agt.indexOf("webtv") != -1) return 'WebTV'; 
    if (agt.indexOf("beonex") != -1) return 'Beonex'; 
    if (agt.indexOf("chimera") != -1) return 'Chimera'; 
    if (agt.indexOf("netpositive") != -1) return 'NetPositive'; 
    if (agt.indexOf("phoenix") != -1) return 'Phoenix'; 
    if (agt.indexOf("firefox") != -1) return 'Firefox'; 
    if (agt.indexOf("safari") != -1) return 'Safari'; 
    if (agt.indexOf("skipstone") != -1) return 'SkipStone'; 
    if (agt.indexOf("netscape") != -1) return 'Netscape'; 
    if (agt.indexOf("mozilla/5.0") != -1) return 'Mozilla'; 
    if (agt.indexOf("msie") != -1) { 
        let rv = -1; 
        if (navigator.appName == 'Microsoft Internet Explorer') { 
            let ua = navigator.userAgent; var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})"); 
        if (re.exec(ua) != null) 
            rv = parseFloat(RegExp.$1); 
        } 
        return 'Internet Explorer '+rv; 
    } 
}

const browser = isBrowserCheck();
console.log(browser);
if(browser === 'Chrome') {
    alert('해당 브라우저로는 접속할수 없습니다 다른 브라우저로 접속을 해주세요.');
}