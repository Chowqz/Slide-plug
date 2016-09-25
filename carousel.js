;(function($){
	var Carousel=function(slideplug){
		var self=this;
		// 保存当个滑动对象
		this.slideMain=slideplug;
		this.slideBox=this.slideMain.find("ul.slide-pic-box");
		this.slideItems=this.slideBox.find("li.slide-item");
		this.prevBtn=this.slideMain.find("div.slide-prev-btn");
		this.nextBtn=this.slideMain.find("div.slide-next-btn");
		this.pointBox=this.slideMain.find("div.slide-point-box");
		this.slidePoints=this.slideMain.find("a.slide-point");
		//将第一帧与最后一帧各复制一份
		//分别放置最后一帧后和第一帧前
		this.slideBox.prepend(this.slideItems.last().clone());
		this.slideBox.append(this.slideItems.first().clone());
		this.slideItems=this.slideBox.find("li.slide-item");
		this.index=1;	//当前所处帧索引
		this.pointIndex=0;	//当前所处滑动点的索引
		this.slideFlag=true;	//滑动标识
		this.timer=null;	//自动播放定时器
		// 默认配置参数
		this.setting={
			"width":1024,	//默认宽度
			"height":580,	//默认高度
			"autoPlay":true,	//默认是否自动播放
			"delay":3000,	//自动播放间隔时间
			"speed":5000	//播放速度
		}
		$.extend(this.setting,this.getSetting());
		this.setSettingValue();
		this.nextBtn.click(function(){
			if(self.slideFlag){
				self.slideFlag=false;
				self.pointOnChange("left");
				self.carouselSlide("left");
			}
		});
		this.prevBtn.click(function(){
			if(self.slideFlag){
				self.slideFlag=false;
				self.pointOnChange("right");
				self.carouselSlide("right");
			}
		});
		this.slidePoints.each(function(i){
			$(this).hover(function(){
				if(i==self.pointIndex){
					return false;
				}
				if(self.slideFlag){
					self.pointBox.find("a.slide-point-on").removeClass("slide-point-on");
					$(this).addClass("slide-point-on");
					self.slideFlag=false;
					self.pointIndex=i;
					self.index=i+1;
					self.carouselSlide();
				}
			});
		});
		if(this.setting.autoPlay){
			this.autoPlay();
			this.slideMain.hover(function(){
				window.clearInterval(self.timer);
			},
			function(){
				self.autoPlay();
			});
		}
	};
	Carousel.prototype={
		//自动播放函数
		autoPlay:function(){
			var self=this;
			this.timer=window.setInterval(function(){
				self.nextBtn.click();
			},this.setting.delay);
		},
		//滑动动画函数
		carouselSlide:function(dir){
			var self=this;
			if(dir=="left"){
				this.index++;
				this.slideBox.animate({
					left:-this.setting.width*this.index,
				},this.setting.speed,function(){
					if(self.index==self.slideItems.size()-1){
						self.index=1;
						self.slideBox.css({
							left:-self.setting.width*self.index,
						})
					}
					self.slideFlag=true;
				});
			}
			if(dir=="right"){
				this.index--;
				this.slideBox.animate({
					left:-this.setting.width*this.index,
				},this.setting.speed,function(){
					if(self.index==0){
						self.index=self.slideItems.size()-2;
						self.slideBox.css({
							left:-self.setting.width*self.index,
						})
					}
					self.slideFlag=true;
				});
			}
			if(dir==null){
				this.slideBox.animate({
					left:-this.setting.width*this.index,
				},this.setting.speed,function(){
					self.slideFlag=true;
				});
			}
		},
		//滑动点切换函数
		pointOnChange:function(dir){
			this.pointBox.find("a.slide-point-on").removeClass("slide-point-on");
			if(dir=="left"){
				this.pointIndex++;
				if(this.pointIndex==this.slidePoints.size()){
					this.pointIndex=0;
				}
			}
			if(dir=="right"){
				this.pointIndex--;
				if(this.pointIndex<0){
					this.pointIndex=this.slidePoints.size()-1;
				}
			}
			this.slidePoints.eq(this.pointIndex).addClass("slide-point-on");
		},
		//设置滑动组件及内部元素宽和高、位置
		setSettingValue:function(){
			this.slideMain.css({
				width:this.setting.width,
				height:this.setting.height,
			});
			this.slideBox.css({
				//根据实际帧数设置帧父元素宽度
				width:this.setting.width*this.slideItems.size(),
				height:this.setting.height,
				left:-this.setting.width*this.index,
			});
			this.slideItems.css({
				width:this.setting.width,
				height:this.setting.height,
			});
			//根据实际滑动点个数设置父元素宽度
			var pointBoxWidth=this.slidePoints.eq(0).outerWidth(true)*this.slidePoints.size();
			this.pointBox.css({
				width:pointBoxWidth,
				marginLeft:-pointBoxWidth/2,
			});
		},
		// 获取人工配置参数
		getSetting:function(){
			var setting=this.slideMain.attr("data-setting");
			if(setting&&setting!=""){
				return $.parseJSON(setting);
			}
			else{
				return {};
			}
		}
	};
	Carousel.init=function(slideplugs){
		var _this_=this;
		slideplugs.each(function(){
			new _this_($(this));
		});
	};
	window["Carousel"]=Carousel;
})(jQuery);