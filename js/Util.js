

var MyUtil = {

	formatTime: function (){
		var time = '';
		for(var i=0,len=arguments.length;i<len;i++){
			time += this.format(arguments[i])+':';
		}

		time = time.substring(0,time.length-1);
		return time;
	},
	
	format :　function(n){
		return n<10? '0'+n:n+'';
	}
}

var Progress = {

	init: function($progressEle,callback){
		var $bar = $progressEle.children('.bar'),
			$red = $progressEle.children('.red');
		drag.call($bar,$progressEle.width(),callback);
	},

	/**启动进度条自动运行**/
	start : function($progressEle,duration){
		if ($progressEle && duration) {
			$progressEle.data('started',true);
			
			var rate = $progressEle.width()/duration;
			setTimeout(fn,1000);
			function fn (){
				if(!$progressEle.data('started')) return;
				var cnt = $progressEle.data('cnt') || 1;
				$progressEle.data('cnt',++cnt);
				$progressEle.children('.red').css({
					width: '+='+rate+'px',
				});
				$progressEle.children('.bar').css({
					left: '+='+rate+'px',
				});


				if (cnt < duration){
					setTimeout(fn,1000);
				}else{
					$progressEle.children('.red').css({
						width: $progressEle.width(),
					});
					$progressEle.children('.bar').css({
						left: $progressEle.width()-$progressEle.children('.bar').width()/2,
					});
				}
				
			}
		}
	},

	/**设置进度条的位置**/
	setPostion: function($progressEle,left,duration){
		$progressEle.children('.red').css('width',left);
		$progressEle.children('.bar').css('left',left-$progressEle.children('.bar').width()/2,);
		var rate = duration/$progressEle.width();
		$progressEle.data('cnt',parseInt(left*rate));
		return rate;
	},

	/**停止进度条运动**/
	stop: function($progressEle){
		$progressEle.data('started',false);
	},

	/**重置进度条**/
	reset: function($progressEle){
		$progressEle.children().removeAttr('style');
		$progressEle.data('started',false);
		$progressEle.data('cnt',1);
	}

	/**获取进度条当前位置**/
}

/**计时器控件**/
var Timer = {
	start : function($timerEle,duration){
		$timerEle.data('started',true);
		var min = 0,sec = 0,cnt = $timerEle.data('cnt') || 1;;
		setTimeout(function(){
			if(!$timerEle.data('started')) return;
			min = parseInt(cnt/60);
			sec = cnt%60;
			$timerEle.data('cnt',cnt++);
			$timerEle.html(MyUtil.formatTime(min,sec));
			if (cnt < duration){
				setTimeout(arguments.callee,1000);
			}
		},1000);
	},
	stop : function ($timerEle){
		$timerEle.data('started',false);
	},
	reset : function ($timerEle){
		$timerEle.html(MyUtil.formatTime(0,0));
		$timerEle.data('started',false);
		$timerEle.data('cnt',1);
	},

	setTime : function($timerEle,time){
		var min = parseInt(time/60),sec = parseInt(time%60);
		$timerEle.html(MyUtil.formatTime(min,sec));
	}
}


var ScrollBar = {

	init:　function($scrollbar,$parentObj,$offsetObj){
		// 滚动条高度
		$scrollbar.height($parentObj.height() * ($offsetObj.height()/$parentObj.height()));
		// scrollbar滚动最大范围
		var scrollOffsetMax = $parentObj.height() - $scrollbar.height();
		// offsetObj 可视区域的最大滚动范围
		//var contentOffsetMax;

		$offsetObj.on("mousewheel",function(event,direction){
			event.preventDefault();
			var top = $scrollbar.position().top;
			direction>0? top-=30:top +=30;
			top = Math.max(top,0);
			top = Math.min(top,scrollOffsetMax);
			$scrollbar.css('top',top);
			$(this).css('top',-top);
		});
		
	},
	reset: function($scrollbar,$offsetObj){
		$scrollbar.css('top',0);
		$offsetObj.css('top',0);
	}
}


/**进度条的拖动**/
function drag (max,callback){
	
	$(this).on('mousedown',function(e){
		var that = this;
		var mouseOldX = e.clientX;
		OldLeft = $(this).position().left;
		$(document).on('mousemove',function(e){
			var left = e.clientX - mouseOldX + OldLeft;

			left = Math.min(left,max);
			left = Math.max(left,0);

			callback(left);
		});

		$(document).one('mouseup',function(){
			$(this).off('mousemove');
		})
	})
}
	
