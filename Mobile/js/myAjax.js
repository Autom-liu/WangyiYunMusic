/**
 * 
 * ajax 初级简单封装
 */

function ajax(obj){
	obj.method = obj.method||'get';
	obj.sync = obj.sync || true;
	obj.dataType = obj.dataType || 'json';
	obj.data = obj.data || {};
	var dataStr = [];
	for(key in obj.data) dataStr.push(key+'='+obj.data[key])
	dataStr = dataStr.join('&');
	
	console.log(dataStr);
	var xhr = XMLHttpRequest? new XMLHttpRequest():new ActiveXObject('Microsoft.XMLHTTP');
	var p = obj.method.toUpperCase() === 'POST';
	xhr.open(obj.method, p?obj.url:obj.url+'?'+dataStr ,obj.sync);
	p && xhr.setRequestHeader('Content-Type', (function (dataType){
			switch(dataType){
				case 'json' : return 'application/x-www-form-urlencoded;charset=utf-8'; 
			}
		})(obj.dataType));
	xhr.send(p?dataStr:null);

	xhr.onload = function(){
		if (xhr.readyState===4) {
			if (xhr.status>=200&&xhr.status<300||xhr.status===304) {
				obj.success && obj.success(xhr.responseText);
			}
			else{
				obj.error && obj.error(xhr.status);
			}
		}
	}
}