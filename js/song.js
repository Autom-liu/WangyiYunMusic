function Song(songName,singer,index) {
	this.songName = songName;
	this.singer = singer;
	this.index = index-1;
}

Song.prototype.setImgUrl = function(imgUrl){
	this.imgUrl = imgUrl;
}

Song.prototype.setPlayUrl = function(playUrl){
	this.playUrl = playUrl;
}

Song.prototype.setDuration = function(duration){
	this.duration = duration;
}

Song.prototype.setLyric = function(lyric){
	this.lyric = lyric;
}

Song.prototype.curPage = 1;
Song.prototype.allPage = 10;
Song.prototype.keywords = '';
