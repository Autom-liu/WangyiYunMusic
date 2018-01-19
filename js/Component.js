/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-01-08 21:52:07
 * @version $Id$
 */

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


/**进度条组件**/
var Progress = {
	$ele: null,$bar: null,$red: null,callback: null,width: 0,
	started: false, // 如果需要和定时器互斥该变量，请初始化true
	duration: 0,rateS: 0,ratePx: 0,autoCnt: 1,
	

	init: function ($ele,callback) {
		this.$ele = $ele;
		this.$bar = $ele.children('.bar');
		this.$red = $ele.children('.red');
		this.width = $ele.width();
		this.callback = callback;
	},

	setDuration: function(duration){
		this.duration = duration;
		this.rateS = this.width/duration;
		this.ratePx = duration/this.width;
	},

	/**启动进度条自动运行**/
	run: function(speed){
		this.started = true;   // 如果需要和定时器互斥该变量，请去掉该句
		setTimeout(fn.bind(this),speed);
		var that = this;
		// 设置点击事件
		click.call(this.$ele,this.$ele.width(),this.forEvent.bind(this))
		//  设置拖拽事件
		drag.call(this.$bar,this.$ele.width(),this.forEvent.bind(this));
		function fn(){
			if(!this.started) /**this.started = ture**/ return; // 如果需要和定时器互斥该变量，请使用该句
			this.$red.css('width','+='+this.rateS+'px');
			this.$bar.css('left','+='+this.rateS+'px');

			this.autoCnt += speed/1000;

			if(this.autoCnt < this.duration){
				setTimeout(fn.bind(this),speed);
			}else{
				this.$red.css('width',this.$ele.width());
				this.$bar.css('left',this.$ele.width()-this.$bar.width()/2);
			}
			
		}
	},

	/**设置进度条的位置**/
	setPosition: function(left){
		this.$red.css('width',left);
		this.$bar.css('left',left-this.$bar.width()/2);
		this.autoCnt = parseInt(left*this.ratePx);
	},

	/**停止进度条的运动**/
	stop: function(){
		this.started = false;
	},

	/**重置进度条**/
	reset: function(){
		this.$red.add(this.$bar).removeAttr('style');
		this.started = false;
		this.autoCnt = 1;
	},

	forEvent: function(left){
		this.setPosition(left);
		this.callback(left,this.ratePx);
	},

	/**获取进度条当前位置**/
	getPosition: function(){
		return this.$red.width();
	}

}


/**音量控制组件**/
var Volume = {
	$ele: null,
	$bar: null,
	$red: null,
	$width: 0,
	$callback : null,
	$curLeft: 0,

	init: function($ele,callback){
		this.$ele = $ele;
		this.$bar = $ele.children('.bar');
		this.$red = $ele.children('.red');
		this.curLeft = this.width = $ele.width();
		this.callback = callback;
		var that = this;
		drag.call(this.$bar,this.width,function(left){
			that.curLeft = left;
			that.setPosition(left);
			that.callback();
		});
		click.call(this.$ele,this.width,function(left){
			that.curLeft = left;
			that.setPosition(left);
			that.callback();
		})
	},
	setPosition: function(left){
		this.$red.css('width',left);
		this.$bar.css('left',left-this.$bar.width()/2);
	},
	getPosition: function(){
		return this.curLeft;
	},
	getVolume: function(){
		return this.curLeft * (100/this.width)*0.01; 
	}

}


/**计时器组件**/
var Timer = {
	$ele : null,
	duration : 0,
	started: false,
	autoCnt: 1,

	init: function($ele){
		this.$ele = $ele;
		this.started = false;
		this.autoCnt = 1;
	},

	setDuration: function(duration){
		this.duration = duration;
	},

	run: function(speed){
		this.started = true;
		var min = 0,sec =0;
		var that = this;
		setTimeout(function(){
			if(!that.started) return;
			min = parseInt(that.autoCnt/60);
			sec = parseInt(that.autoCnt%60);
			that.autoCnt += speed/1000;
			that.$ele.html(MyUtil.formatTime(min,sec));
			if(that.autoCnt < that.duration){
				setTimeout(arguments.callee,speed);
			}
		},speed)
	},

	reset: function(){
		this.started = false;
		this.autoCnt = 1;
		this.$ele.html(MyUtil.formatTime(0,0));
	},

	stop: function(){
		this.started = false;
	},

	setTime: function(time){
		var min = parseInt(time/60),
			sec = parseInt(time%60);
			this.autoCnt = time;
			this.$ele.html(MyUtil.formatTime(min,sec));
	}
}


/**滚动条组件**/
var ScrollBar = {
	$ele: null,
	$parent: null,
	$relativeView: null,
	viewMaxOffset: 0,
	scrollMaxOffset: 0,

	init: function($ele,$parent,$relativeView){
		this.$ele = $ele;
		this.$parent = $parent;
		this.$relativeView = $relativeView;
		$ele.height($parent.height()* ($relativeView.height()/$parent.height()));
		this.scrollMaxOffset = $parent.height()-$ele.height();
		this.viewMaxOffset = $relativeView.height();// 待更
		
		this.wheelEvent();
	},

	wheelEvent: function(){
		var that = this;
		this.$relativeView.on('mousewheel',function(event,direction){
			event.preventDefault();
			var top = that.$ele.position().top; // 获取相对位移值
			top += direction>0? -30:30;
			
			that.setPosition(top);
			
		})
	},

	reset: function(){
		this.setPosition(0);
	},

	setPosition: function(top){
			top = Math.min (Math.max(top,0),this.scrollMaxOffset);
			this.$ele.css('top',top);
			this.$relativeView.css('top',-top);
	},

	getPosition: function(){
		return this.$ele.position().top;
	}

}

/**歌词模块**/
var Lyric ={
	lyric: null,
	first: 0,
	last: 9,
	/**
	*	初始化歌词
	*	@param lyric string: 表示歌词的字符串
	*	@param first int : 起始位置
	*	@param last  int : 结束位置
	*
	**/
	init: function(lyric,first,last){
		this.first = first;this.last = last;
		this.lyric = new Array();
		lyric.replace(/\[([\d:.]+)\]([^_^]+)/g,(function(self,$1,$2){
			this.lyric.push({time: $1.split(':').reduce(function(a,b){return a*60+b*1}),str: $2});
		}).bind(this));
		if(this.lyric.length === 0) this.lyric.push({time: 1,str: '纯音乐，请欣赏'});

		for(var i=0;i<5;++i){
			this.lyric.unshift({time: 0,str: '&nbsp;&nbsp;'});
			this.lyric.push({time: 9999,str: '&nbsp;&nbsp;'});
		}
	},

	/**
	*	找到匹配的歌词
	*	@param Time float: 时间
	*	@return index : 歌词索引值
	**/
	findIndex : function (Time){
		var length = this.lyric? this.lyric.length : 0;
		for( var i=0;i<length;++i){
			if (this.lyric[i].time > Time){
				return i;
			}
		}
		return -1;
	},

	/**
	*	设置当前歌词的位置
	*	@param Time float: 时间
	*
	**/
	setLyric: function(Time){
		var Index = this.findIndex(Time);
		var length = parseInt((this.last - this.first)/2);
		Index = Index>length ? Index : length;
		this.first = Index - length;
		this.last = Index + length;
	},

	/**
	*	下一句歌词
	*	
	**/
	next: function(){
		this.last++;this.first++;
	},

	/**
	*	获取当前歌词时间
	*	
	**/
	getTime: function(){
		var current = parseInt((this.first + this.last)/2);
		return this.lyric[current].time;
	},
	
	/**
	*	渲染歌词展示
	*	@param DOM container: 展示的容器
	*	
	**/
	display: function(container){
		for(var i=this.first;i<this.last;++i){
			container.children('li').eq(i-this.first).html(this.lyric[i].str);
		}
	},
	reset: function(first,last){
		this.first = first;
		this.last = last;
	}
}

/**进度条拖动**/
function drag(max,callback){
	$(this).on('mousedown',function(event){
		var mouseOldX = event.clientX,
			oldLeft = $(this).position().left;

			$(document).on('mousemove',function(e){
				var left = e.clientX - mouseOldX + oldLeft;
				left = Math.min(Math.max(left,0),max);
				callback(left);
			});

			$(document).one('mouseup',function(){
				$(this).off('mousemove');
			})
	})
}

/**进度条点击**/
function click(max,callback){
	$(this).on('click',function(e){
		var left = e.clientX - $(this).offset().left;
		left = Math.min(Math.max(left,0),max);
		callback(left);
	});
	
}




