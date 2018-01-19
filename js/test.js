var Test = {
		str : "51656dgfdbfr55147",

		init: function(){
			this.str.replace(/(\d)+/g,(function(){
				console.log(this);
			}).bind(this));
		}
	}
	Test.init();