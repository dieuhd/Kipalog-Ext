'use strict';
chrome.cookies.getAll({},function (cookies){
    for(var i=0;i<cookies.length;i++){
        if(cookies[i].name == 'ext_max_page'){
            document.getElementById('max_page').innerHTML = cookies[i].value;
        }
    }
});