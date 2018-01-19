/**
 * Created by HiWin10 on 2017/9/18.
 */

 
//界面尺寸修正
var doc = document,
    win = window,
    oBody = doc.documentElement || doc.body,
    resize = "onorientationchange" in win ? "orientationchange" : "resize";
rem();
addEventListener(resize, rem, false);
function rem() {
    oBody.style.fontSize = 100 * (doc.body.clientWidth / 640) + "px";
}


$(function () {
	var $layer = $('.lyricLayer');
		$main = $('#main');

	$layer.find('.layer-body').css("height",$(window).height() - $layer.find('.layer-top').outerHeight() - $layer.find('.layer-footer').height());
	$main.css("height",$(window).height() - $('#top').innerHeight() - $('nav.tag').innerHeight());
})



