'use strict';
var KIPALOG_URL = "http://kipalog.com";
chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});
// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

function notifications(id, title, message, icon_url) {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification(title , {
      icon: icon_url,
      body: message,
    });

    notification.onclick = function () {
      	window.open(KIPALOG_URL + "/notifications/" + id + "/clear");
    };
  }

}
function kipalog_call_api(url, callback,method="GET",headers={}) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(data) {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var data = JSON.parse(xhr.responseText);
          callback(data);
        } else {
          callback(null);
        }
      }
    }
    xhr.open(method, url, true);
    for(var header in headers) {
    	xhr.setRequestHeader(header, headers[header]);
    }
    xhr.send();
}
function setAllNotifications() {
	var url = KIPALOG_URL + "/notifications/see_all";
	chrome.cookies.get({url: KIPALOG_URL,name: "XSRF-TOKEN"},function(cookie){
	 	kipalog_call_api(url,function(data){
			console.info(data);
		}, "PATCH",{"X-XSRF-TOKEN": decodeURIComponent(cookie.value)});
	});
}

function readNotification(event_id) {
	var notifications_api_url = KIPALOG_URL +"/notifications/" + event_id;
	chrome.cookies.get({url: KIPALOG_URL,name: "XSRF-TOKEN"},function(cookie){
	 	kipalog_call_api(notifications_api_url,function(data){
			console.info(data);
		}, "PATCH",{"X-XSRF-TOKEN": decodeURIComponent(cookie.value)});
	});
	
}

setInterval(function(){
	chrome.storage.sync.get("kipalog_notifications",function(obj){
		var last_kipalog_notifications = obj.kipalog_notifications;
		kipalog_call_api(KIPALOG_URL + "/notifications", function(data){
			var unchecked_notification = [];
			for(var i = 0; i < data.length; i++) {
				if(data[i].status = "unchecked"){
					var event_id = data[i].id;
					var message = data[i].user.name + data[i].message + " " + data[i].info;
					var icon_url = data[i].user.avatar_url_path;
					var event_url = data[i].endpoint;
					if (last_kipalog_notifications.search("[" + event_id + "]" == -2)){
						if(icon_url.search("http://") == -1 && icon_url.search("https://") == -1) {
							icon_url = KIPALOG_URL + icon_url;
						}
						notifications(event_id, "Thông báo mới", message, icon_url, KIPALOG_URL + event_url)
					}
					unchecked_notification.push("[" + event_id+ "]");
				}
			}
			chrome.storage.sync.set({"kipalog_notifications" : unchecked_notification.join()});
		})
	});
	
}, 600000);