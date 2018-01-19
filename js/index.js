
$(function (){

	var curPlay = new Object();
	var $tbody = $('#tbody'),
		$search = $('.searchBox .search'),
		$sideBar_footer = $(".sidebarFooter"),
		$pic_small = $(".sidebarFooter img"),
		$pic_large = $('.mainContentTop .headImg img'),
		$pic_cd = $('.cd .cdbg img'),
		$trigger = $('#play .keys .trigger'),
		$progress = $('.progress .progressBar'),
		$songTimer = $('.progress .time') ,
		$content = $('#main .content'),
		$scrollbar = $('#main .scrollbar .block'),
		$pageBody = $('.page .pageBody'),
		$volume = $('.volume .volumeBar'),
		$lyricTop = $('.lyric .top'),
		audio = document.getElementsByTagName('audio')[0]
	

init();
Volume.init($volume,function(){
	audio.volume = Volume.getVolume();
});
Progress.init($progress,function(width,rate){
		Timer.setTime(width*rate);
		audio.ontimeupdate = null;
		Lyric.setLyric(width*rate);
		lyricRender();
		audio.currentTime = width*rate;
	});
ScrollBar.init($scrollbar,$scrollbar.offsetParent(),$content);
Timer.init($songTimer,curPlay.duration);

/**展示歌词**/
	$sideBar_footer.on('click',function(){
		$('#container .containerList').fadeTo(1000,0,function(){
			$(this).css('z-index',0);
		});
		$('.contentDetails').css('z-index',3).delay(500).fadeTo(1000,1);
	});

/**隐藏歌词层**/
	$('.lyric .top .iconfont').on('click',function(){
		$('.contentDetails').fadeTo(1000,0,function(){
			$(this).css('z-index',0);
		});
		$('#container .containerList').css('z-index',3).delay(500).fadeTo(1000,1);
	});

/**歌词滚动渲染**/
function lyricRender(){
	Lyric.display($('#lyricList'));
	audio.ontimeupdate = function(){
		if(Lyric.getTime() <= audio.currentTime){
			Lyric.next();
			Lyric.display($('#lyricList'));
		}
	}
}



function init(){
	getSongList("勇气",1,function(res){
		renderList(res);
	});

	/**搜索框功能**/
	$search.on('keydown',function(e){
		if(e.keyCode == 13){
			var value = this.value;
			getSongList(value,1,function(res){
				renderList(res);
			});
			
		}
	});

	/**列表双击播放功能**/
	$tbody.on('dblclick','tr',replay);
	/**播放按钮**/
	$trigger.click(function(){
		if (audio.currentSrc === "")
			{replay.call($tbody.children().eq(0));return;}
		if (audio.paused) {
			audio.play();
			Progress.run(1000);
			Timer.run(1000);
		}else{
			audio.pause();
			Progress.stop();
			Timer.stop();
		}
		$(this).toggleClass('zanting bofang');
	});

	/**下一曲**/
	$('#play .keys span.next').click(function(){
		if (curPlay.index < 9) {
			onfinished();triggerOn();
			$nextTr = $tbody.children().eq(curPlay.index+1);
			replay.call($nextTr);
		}
	});

	/**上一曲**/
	$('#play .keys span.prev').click(function(){
		if (curPlay.index > 0) {
			onfinished();triggerOn();
			$prevTr = $tbody.children().eq(curPlay.index-1);
			replay.call($prevTr);
		}
	});
}

/**播放歌曲、切歌，重新加载数据**/
function replay(e){
	
	getSongInfo($(this).data('id'),$(this).data('mid'),function(songDesc){
		renderSong(songDesc);
		audio.onloadedmetadata = function(){
			curPlay.setDuration(audio.duration);
			onloaded();
			triggerOn();// 开关始终保持打开
		}
		audio.onended = function (){
			onfinished();
			triggerOff();// 开关始终保持关闭
		}
		audio.play();
	});
		onfinished(); // 切歌
	var $td = $(this).children();
	curPlay = new Song($td.eq(1).html(),$td.eq(2).html(),$td.eq(0).html());
}

/**音乐加载完成**/
function onloaded(){
	triggerOn();
	Progress.setDuration(curPlay.duration); // 设置进度条属性
	Timer.setDuration(curPlay.duration); // 设置计时器属性
	Progress.run(1000);  //进度条动起来
	Timer.run(1000);  // 计时器动起来
}

/**音乐结束播放**/
function onfinished(){
	triggerOff();
	Progress.reset(); // 音乐结束要重置进度条
	Timer.reset();    // 计时器也重置
	Lyric.reset(0,10);// 歌词也重置
	Lyric.lyric&&lyricRender();
}

/**启动播放按钮**/
function triggerOn(){$trigger.removeClass('bofang').addClass('zanting');}
/**关闭播放按钮**/
function triggerOff(){$trigger.removeClass('zanting').addClass('bofang');}

/**分页管理部分**/
$pageBody.children('#nextPage').on('click',nextPage);
function nextPage(){
	if (Song.curPage < Song.allPage)
		getSongList(Song.keywords,Song.curPage+1,function(res){renderList(res);});
	ScrollBar.reset();
}

$pageBody.children('#prevPage').on('click',prevPage);
function prevPage(){
	if (Song.curPage > 1)
		getSongList(Song.keywords,Song.curPage-1,function(res){renderList(res);});
	ScrollBar.reset();
}

$pageBody.children('#firstPage').on('click',firstPage);
function firstPage(){
		getSongList(Song.keywords,1,function(res){renderList(res);});
		ScrollBar.reset();
}

$pageBody.children('#lastPage').on('click',lastPage);
function lastPage(){
		getSongList(Song.keywords,Song.allPage,function(res){renderList(res);});
		ScrollBar.reset();
}

/**
*	渲染歌单列表数据
*	@param json songList : 歌单列表
*
**/
function renderList(songList){
	$tbody.html("");
	for(key in songList){
			if (key == 'page') continue;
			songList[key].id = songList[key].urlParam.match(/id=\d+/)[0].replace("id=","");
			songList[key].mid = songList[key].urlParam.match(/mid=\w+/)[0].replace("mid=","");
			$('<tr/>').append($('<td/>').html(songList[key].index))
					  .append($('<td/>').html(songList[key].name))
					  .append($('<td/>').html(songList[key].singer))
					  .append($('<td/>').html("none")).data('id',songList[key].id).data('mid',songList[key].mid).appendTo($tbody);
		}
}


/**
*	渲染歌曲详细信息数据
*	@param json songDesc : 歌曲详情信息
*
**/
function renderSong(songDesc){
	$pic_small.attr('src',songDesc.albumImg);
	$pic_large.attr('src',songDesc.albumImg);
	$pic_cd.attr('src',songDesc.albumImg);
	$sideBar_footer.find('p.singname').html(curPlay.songName);
	$sideBar_footer.find('p.singername').html(curPlay.singer);
	$lyricTop.find('h1').html(curPlay.songName);
	$lyricTop.find('p.singer span').html(curPlay.singer);
	audio.src = songDesc.playUrl;
	curPlay.setImgUrl(songDesc.albumImg);
	curPlay.setPlayUrl(songDesc.playUrl);
	Lyric.init(songDesc.lyric,0,10);
	lyricRender();
}

/**
*	获取歌单列表
*	@param string keywords : 搜索关键词
*	@param string page: 页数
*	@param recall function: 回调函数 
*
**/
function getSongList(keywords,page,recall){
	page = page || 1;
	$.ajax({
		url: 'http://127.0.0.1/test/songList.php',
		type: 'GET',
		async: true,
		data: {
			keywords: keywords,
			page: page,
		},
		dataType: 'jsonp',
		jsonpCallback: 'cb',
		success: function(res){
			var res = JSON.parse(res);
			Song.keywords = keywords;
			Song.curPage = page;
			Song.allPage = res.page;
			recall(res);
		},
		error: function(err,status,msg){
			alert("未能找到相对应的歌曲，请重新输入");
		}
	});
}

/**
*	获取歌曲的详细信息，包括专辑图像，播放下载链接等
*	@param string id : 歌曲id
*	@param string mid: 歌曲mid
*	@param recall function: 回调函数 
*
**/
function getSongInfo(id,mid,recall){
	$.ajax({
		url: 'http://127.0.0.1/test/songInfo.php',
		type: 'GET',
		data: {
			id: id,
			mid: mid,
		},
		async: true,
		dataType: 'jsonp',
		jsonpCallback: 'cbd',
		success: function(res){
			res = res.replace(/[\r\n]/g,"^");
			res = JSON.parse(res);
			recall(res);
		},
		error: function(err,status,msg){
			alert("资源有误");
		}
	});
}
	
})

/***
	var reg = /<div class = 'search'>[\d\D]*?<\/div>/g;  // 任意字符的惰性匹配
	var reg2 = /([\u4e00-\u9fa5]\s?)+|info.php\?id=\w+&mid=\w+/g;// 允许中文之间用空格分割
	var strArr = str.match(reg);
	for(var i=0,len=strArr.length;i<len;i++){
		console.log (strArr[i].match(reg2));
	}

	***/

/***
var reg1 = /http:\/\/i\.gtimg\.cn\/music\/photo[^"']+|http:\/\/dl\.stream\.qqmusic\.qq\.com[^"']+/g;
console.log(str.match(reg1));
var reg2 = /<m>歌词部分<\/m>[\d\D]+<div.+?>/;
var lyric = str.match(reg2);

lyric = lyric[0].replace(/<[\w\s\/"=]+>/g,"");
console.log(lyric)
***/