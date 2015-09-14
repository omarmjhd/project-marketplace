/*
Home Page Slideshow
	
*/

(function($) {
	
	function TBMain (container, options){
		
		this.sett = $.extend({
		
			//Default Settings
			slide_autoplay			: true,
			slide_delaytime			: 5,
			slide_transition		: 1,	
			slide_transition_period	: 800,
			slide_preload_images	: 1,
						
			button_size				: 20,
			button_margin			: 4,
			button_opacity			: .7,
			button_space			: 2,
			button_color			: '#FFFFFF',	
			
			button_show_next		: true,
			button_show_back		: false,
			button_show_timer		: true,
			button_show_numbers		: true,
			
			button_numbers_autohide		: true,
			button_numbers_horizontal	: false,			
			
			caption_float_mode		: false,
			caption_bg_blur			: 12,
			caption_padding_x		: 24,
			caption_padding_y		: 12,
			caption_margin_x		: 0,
			caption_margin_y		: 0,
			
			caption_position_x		: 50,
			caption_position_y		: 100,
			caption_width			: 300,
			caption_height			: '',
			caption_bg_color		: '#FFFFFF',
			caption_bg_opacity		: .08,
			caption_bg_radius		: 6,
			caption_bg_shadow		: .3,
			caption_allow_selection	: false,
			
			caption_border			: 1,
			caption_border_color	: '#FFFFFF',
			caption_border_opacity	: .15,
			
			touch_dragdrop_factor	: 60,
			touch_throw_factor		: 5
			
		}, options);			
		
		this.$cont = container;
		
		this.bW = this.$cont.width();
		this.bH = this.$cont.height();
		
		this.slides = [];
		this.slide_tot = this.$cont.children('.Slide').length;
		this.slide_dir = -1;
		this.slide_sel = 0;
		this.slide_pr1 = '';
		this.slide_pr2 = '';
		this.slide_fin = false;
		this.slide_drg = false;	
		this.slide_sta = true;
		
		this.clockDraw;		
		this.clockContext;
		this.clockStart;
		this.clockDiff = 0;
		this.clockTimer = this.sett.button_show_timer;
		this.clockPlaying = false;
		
		this.buttonNext = this.sett.button_show_next;
		this.buttonBack = this.sett.button_show_back;
		this.buttonNumber = this.sett.button_show_numbers;
				
		this.FF2 = $.browser.mozilla && parseFloat($.browser.version, 10) < 1.9 ? true : false;
		this.IE8 = $.browser.msie && parseInt($.browser.version, 10) <= 8 ? true : false;
		this.canvasSupport = document.createElement('canvas').getContext;

		this.buttonIE = this.IE8? 1 : 0;	
		this.buttonLeaveTimer;
		
		this.draggable = true;
		this.dragged = false;
		this.numShow = false;
		this.autoPlaying = this.sett.slide_autoplay;
		this.timerob = $('<div style="position:absolute;"></div>').appendTo(this.$cont);
		
		var trans = this.sett.slide_transition;
		if (trans <=1 || isNaN(trans)) {
			this.sett.slide_transition = 'move';			
		} else if (trans == 2) {
			this.sett.slide_transition = 'fade';			
		} else if (trans == 3) {
			this.sett.slide_transition = 'slideIn';			
		} else if (trans >= 4) {
			this.sett.slide_transition = 'slideOut';
		}
		
		if (this.sett.caption_margin_y == 0 && !this.sett.caption_float_mode) this.sett.caption_bg_radius = 0;
		if (this.sett.button_show_numbers && !this.sett.button_show_next) this.sett.button_numbers_autohide = false;
		
		if ($.browser.webkit) {
			this.shProp = '-webkit-box-shadow';
		} else if ($.browser.mozilla && this.$cont.css('box-shadow') != 'none') {
			this.shProp = '-moz-box-shadow';
		} else {	
			this.shProp = 'box-shadow';
		}
		
		if (this.sett.slide_preload_images> this.slide_tot) this.sett.slide_preload_images = this.slide_tot;
		
		var regx=/url\(["']?([^'")]+)['"]?\)/;
		var ic = $('<div class="icon"></div>').appendTo(this.$cont);
		var ts = $('<div class="timer_sprite"></div>').appendTo(this.$cont);
		this.timer_sprite = ts.css("background-image").replace(regx,'$1');
		
		var imgList = [ic.css("background-image").replace(regx,'$1')];	
		if (this.sett.slide_preload_images >1) {			
			for (var i=0; i<this.slide_tot; i++){
				imgList[i+1] = this.$cont.children('.Slide').eq(i).find('img').attr('src');
			}			
		} else {
			imgList[1] = this.$cont.children('.Slide').eq(0).find('img').attr('src');			
		}
		
		//Check load status of 1st image and Navigation icons. After preloading, the banner is initiated.
		this.preload(imgList);
		
		ic.remove();	
		ts.remove();
	
	}

	TBMain.prototype = {
		
		//Preload 1st image & icons
		//////////////////////////////////////////////////////////////////////////////////////////////
		preload: function (items){
			var self = this;			
			for (var i=0; i<items.length; i++){
				items[i] = {src: items[i], loaded: false};
				var _img = new Image();	
				
				//Load event
				$(_img).bind('load', {id:i}, function (e) {
					items[e.data.id].loaded = true;
					var complete = true;
					for (var i=0; i<items.length; i++){						
						if (!items[i].loaded){
							complete = false;
						}
					}
					if (complete) self.init();
				});
				_img.src = items[i].src;
			}		
			
		},
		
		
		//Initialise Slideshow / gather data
		//////////////////////////////////////////////////////////////////////////////////////////////
		init: function (){

			var self = this;
			var IEBlur = Math.max((this.sett.caption_bg_blur/3), 3);
			var navWidth = (this.sett.button_show_next? this.sett.button_size+this.sett.button_space : 0) + (this.sett.button_show_back? this.sett.button_size+this.sett.button_space : 0) + (this.sett.button_show_timer? this.sett.button_size+this.sett.button_space : 0) + (!this.sett.button_numbers_autohide && this.sett.button_numbers_horizontal? (this.sett.button_size+this.sett.button_space)*this.slide_tot : 0);
			var capX, capY, capW, capH;	
			var $cont = this.$cont.children('.Slide');
			//Generate each slide with caption elements
			for (var i=0; i<this.slide_tot; i++){				
				var div = $cont.eq(i).css({'position':'absolute', 'z-index':this.slide_tot-i, 'left':'0px', 'top': '0px', 'width': this.bW+'px', 'height': this.bH+'px','overflow': 'hidden', 'visibility': 'visible'});
				var img = div.find('img').css({'filter': 'progid:DXImageTransform.Microsoft.Alpha(opacity=100)', 'z-index':1, 'position':'absolute', 'left': '0px', 'top':'0px', 'border': '0px'}).attr('galleryimg', 'no').addClass('noSelect');;
				var inner = $('<span></span>').css('opacity', .99);
				var txt = div.find('div').wrapInner(inner);
				if (this.sett.caption_allow_selection){
					txt.bind('mousedown', function (e){
						e.stopImmediatePropagation();					
					});					
				} else {
					txt.addClass('noSelect').attr('unselectable', 'on');
				}
				if (txt.length>0){		
					txt.css({'z-index':4, 'position':'absolute', 'left': this.sett.caption_padding_x+'px', 'top': this.sett.caption_padding_y+'px'});							
					var capCont = $('<div></div>').css({'z-index':3, 'position':'absolute'}).appendTo(div);				
					var txtCont = $('<div></div>').css({'z-index':4, 'position':'absolute', 'overflow' : 'hidden', 'left': '0px', 'top': '0px'}).appendTo(capCont);	
					
					//If the text should float over the image, find location and size		
					if (this.sett.caption_float_mode){
						var pd = div.data('position');
						
						if (pd) {
							capX = parseInt(pd.split(',')[0], 10);
							capY = parseInt(pd.split(',')[1], 10);							
						} else {
							capX = this.sett.caption_position_x;

							capY = this.sett.caption_position_y;												
						}
						
						//width
						var wd = div.data('width');
						if (wd) {
							capW = parseInt(wd, 10);							
						} else {
							capW = this.sett.caption_width;													
						}
						if (capX+capW+this.sett.caption_margin_x > this.bW) capW = this.bW-capX-this.sett.caption_margin_x;
						txt.css({'width': (capW-(this.sett.caption_padding_x*2))+'px'});
						
						//height
						var hd = div.data('height');
						if (hd) {
							capH = parseInt(hd, 10);							
						} else {
							capH = this.sett.caption_height == '' ? txt.height()+(this.sett.caption_padding_y*2) : this.sett.caption_height;												
						}		
						txt.css({'height': this.sett.caption_height == '' ? 'auto' : capH+'px'});		
						capCont.css({'left': capX+'px', 'top': capY+'px', 'width': capW, 'height': capH});
					
					} else {					
						capCont.css({'left': this.sett.caption_padding_x+'px', 'width': (this.bW-((this.sett.caption_padding_x+this.sett.caption_margin_x)*2)-navWidth)+'px'});
						txt.css({'width': (this.bW-((this.sett.caption_padding_x+this.sett.caption_margin_x)*2)-navWidth)+'px'});
					}
					
					var canvas;				
					var descH = txt.height()+(this.sett.caption_padding_y*2);	
					
					if (!this.sett.caption_float_mode){
						capX = this.sett.caption_margin_x;
						capY = this.bH-descH-this.sett.caption_margin_y;
						capW = this.bW-(this.sett.caption_margin_x*2);
						capH = descH;
						txt.css({'width': (capW-navWidth-(this.sett.caption_padding_x*2))+'px'});						
						capCont.css({'left': capX+'px', 'top': capY+'px', 'width': capW+'px', 'height': capH});					
					}				
					txtCont.css({'width':capW, 'height':capH});
					txt.appendTo(txtCont);
					
					var capBGSh = div.data('caption_bg_shadow') ? div.data('caption_bg_shadow') : this.sett.caption_bg_shadow;
					
					
					//Text BG blur effect
					if (this.sett.caption_bg_blur > 0){
						if (this.IE8){	
							canvas = $('<div style="position:absolute; z-index:1; overflow:hidden; width:'+ (capW-1)+'px; height:'+(capH-1)+'px; top:0px; left:0px"><div style="position:absolute; z-index:2; width:'+(capW+(this.sett.caption_bg_blur*2))+'px; height:'+(capH+(this.sett.caption_bg_blur*2))+'px; top:'+(-(this.sett.caption_bg_blur)*2)+'px; left:'+(-(this.sett.caption_bg_blur*2))+'px; background: transparent url('+img.attr('src')+') '+(-capX+(this.sett.caption_bg_blur))+'px '+(-capY+(this.sett.caption_bg_blur))+'px no-repeat; -ms-filter: progid:DXImageTransform.Microsoft.blur(pixelradius='+this.sett.caption_bg_blur+'); filter: progid:DXImageTransform.Microsoft.blur(pixelradius='+this.sett.caption_bg_blur+');"></div></div>').appendTo(capCont);				
							if (this.sett.caption_margin_y <= this.sett.caption_bg_blur/2 && !this.sett.caption_float_mode) canvas.append('<div style="position:absolute; z-index:1; width:'+(capW+(IEBlur*2))+'px; height:'+(capH+(IEBlur*2))+'px; top:'+(-(IEBlur)*2)+'px; left:'+(-(IEBlur*2))+'px; background: transparent url('+img.attr('src')+') '+(-capX+(IEBlur))+'px '+(-capY+(IEBlur))+'px no-repeat; -ms-filter: progid:DXImageTransform.Microsoft.blur(pixelradius='+IEBlur+'); filter: progid:DXImageTransform.Microsoft.blur(pixelradius='+IEBlur+');"></div>');
						} else {
							if (!this.FF2) canvas = $('<canvas id="c'+(i+1)+'" width="'+capW+'px" height="'+capH+'px" style="position:absolute; z-index:1; top: 0px; left: 0px;  -moz-border-radius: '+this.sett.caption_bg_radius+'px; -webkit-border-radius: '+this.sett.caption_bg_radius+'px; border-radius: '+this.sett.caption_bg_radius+'px; -khtml-border-radius: '+this.sett.caption_bg_radius+'px;"></canvas>' ).appendTo(capCont);
						}
					}  else {
						if (capBGSh>0 && !this.FF2) canvas = $('<div id="c'+(i+1)+'" width="'+capW+'px" height="'+capH+'px" style="position:absolute; z-index:1; top: 0px; left: 0px;  -moz-border-radius: '+this.sett.caption_bg_radius+'px; -webkit-border-radius: '+this.sett.caption_bg_radius+'px; border-radius: '+this.sett.caption_bg_radius+'px; -khtml-border-radius: '+this.sett.caption_bg_radius+'px;"></div>' ).appendTo(capCont);
					}
					
					//Text BG color with transaprency
					var capBG = div.data('caption_bg_color') ? div.data('caption_bg_color') : this.sett.caption_bg_color;
					var capBGOp = div.data('caption_bg_opacity') ? div.data('caption_bg_opacity') : this.sett.caption_bg_opacity;
					var color = $('<div style="position:absolute; z-index:2; left:0px; top:0px; width:'+capW+'px; height:'+capH+'px; background-color:'+capBG+';  -moz-border-radius: '+this.sett.caption_bg_radius+'px; -webkit-border-radius: '+this.sett.caption_bg_radius+'px; border-radius: '+this.sett.caption_bg_radius+'px; -khtml-border-radius: '+this.sett.caption_bg_radius+'px;"></div>').appendTo(capCont).css('opacity', capBGOp);
					
					//Text BG Border
					if (this.sett.caption_border) {
						var border = $('<div style="position:absolute; z-index:3; left:0px; top:0px; width:'+(capW-(this.sett.caption_border*2))+'px; height:'+(capH-(this.sett.caption_border*2))+'px; border:'+this.sett.caption_border+'px solid '+this.sett.caption_border_color+';  -moz-border-radius: '+this.sett.caption_bg_radius+'px; -webkit-border-radius: '+this.sett.caption_bg_radius+'px; border-radius: '+this.sett.caption_bg_radius+'px; -khtml-border-radius: '+this.sett.caption_bg_radius+'px;"></div>').appendTo(capCont).css('opacity', this.sett.caption_border_opacity);
					}
					
					//Text BG Shadow					
					if (capBGSh>0 && !this.FF2){
						if ($.browser.webkit) {
							if (parseInt($.browser.version, 10) < 533) {
								canvas.css(this.shProp, '0px 0px 6px rgba(0, 0, 0, '+capBGSh+')');				
							} else {								
								canvas.css(this.shProp, '0px 0px 6px 0px rgba(0, 0, 0, '+capBGSh+')');			
							}
						} else if ($.browser.mozilla) {
							if (canvas.css('box-shadow') != 'none') { 						
								canvas.css(this.shProp, '0px 0px 4px 1px rgba(0, 0, 0, '+capBGSh+')');	
							} else {
								canvas.css(this.shProp, '0px 0px 4px 0px rgba(0, 0, 0, '+capBGSh+')');	
							}
						} else if ($.browser.opera){	
							canvas.css(this.shProp, '0px 0px 4px 1px rgba(0, 0, 0, '+capBGSh+')');
						} else {
							canvas.css(this.shProp, '0px 0px 6px 0px rgba(0, 0, 0, '+capBGSh+')');	
						}
					}
					
					//Hide elements to start animation
					capCont.hide();
					txt.hide();					
				}
				
				
				//Store each slide's data
				this.slides.push({con: div, img: img, txt: txt.length>0 ? txt : false, cap: capCont, loaded: false, butt:"", z:this.slide_tot-i, can:canvas, cx: capX, cy:capY, cw:capW, ch:capH, tx:this.sett.caption_padding_x+capX, ty:this.sett.caption_padding_y+capY, tw:txt.width(), delay: (div.data('delay') ? div.data('delay') : this.sett.slide_delaytime)*1000});
				div.hide().bind('mousedown touchstart', {id:i}, function (e){				
					if (self.draggable && !self.slide_drg) {	
						if (e.type == "mousedown"){
							if (self.slide_fin) self.startDrag(e.data.id, e.pageX);
						} else {
							if (self.slide_fin && e.originalEvent.touches.length>0 && e.originalEvent.touches.length<2) self.startDrag(e.data.id, e.originalEvent.changedTouches[0].pageX);
						}
						 
					}
					if (e.type == "mousedown"){
						 e.preventDefault();
					}					
										
				});	
			}
			
			//First image already loaded, prepare the blurred version
			if (!self.IE8 && !self.FF2 && self.sett.caption_bg_blur>0 && self.slides[0].txt) {						
				boxBlurImage(self.slides[0].img[0], self.slides[0].cx, self.slides[0].cy, self.slides[0].cw, self.slides[0].ch, self.slides[0].can[0], self.sett.caption_bg_blur, false ,2);						
			}
			
			//Create Navigation
			self.setNavigation ();		
			
			//Start trnasition so that 1st image displays	
			self.slides[0].loaded = true;				
			self[self.sett.slide_transition] ();
			
			//Check load status of images
			for (var i=1; i<this.slide_tot; i++){
				var _img = new Image();					
				//Load event
				self.slides[i].img.hide();
				$(_img).bind('load', {id:i}, function (e) {
					var id = e.data.id;
					self.slides[id].loaded = true;
					self.slides[id].con.css({'background-image': 'none'});
									
					//Once the image loaded, prepare the blurred version
					if (!self.IE8 && !self.FF2 && self.sett.caption_bg_blur>0 && self.slides[id].txt) {						
						boxBlurImage(self.slides[id].img[0], self.slides[id].cx, self.slides[id].cy, self.slides[id].cw, self.slides[id].ch, self.slides[id].can[0], self.sett.caption_bg_blur, false ,2);						
					}
					
					//Show the slide if this is currently selected slide
					if (id == self.slide_sel)	{
						self.slides[id].img.fadeIn(400);						
					} else {
						self.slides[id].img.show();
					}
							
				});
				_img.src = this.slides[i].img.attr('src');				
			}
			

			//Manage Links when slide dragged
			if (this.draggable) {
				var aHrefs = this.$cont.find('a');
				aHrefs.each(function() {
					var a = $(this);				
					a.bind('click', {l:a.attr('href'), t:a.attr('target')}, function (e){
						e.stopImmediatePropagation();	
						e.preventDefault();	
						var l = e.data.l;
						var t = e.data.t? e.data.t.toLowerCase() : "_self";			
						if (!self.slide_drg) {						
							$(document).unbind('mouseup.drag touchend.drag');	
							$(document).unbind('mousemove.drag touchmove.drag');							
							if(t === '_self') {
								window.location.href = l;
							} else {
								window.open(l);
							}												
						} else {										
							self.slide_drg = false;						
						}
						return false;
						
					});
					if (a.find('img').length <1) {
						a.bind('mousedown', function (e){	
							e.preventDefault();
							return false;						
						});
					}
					a.attr('href', 'return false');			
				});	
			}	
			
			
		},		
		
		
		//Add Navigation
		//////////////////////////////////////////////////////////////////////////////////////////////
		setNavigation: function (){	
			var self = this;
			var $navigation = this.navigation().appendTo(this.$cont);
			var navX = $navigation.position().left;

			//Fade/slide in navigation
			if (!this.IE8) $navigation.hide().fadeIn(700);
			$navigation.css({'left':navX-30}).animate({'left':navX},
				{duration: 700,
				easing:'easeInOutQuart',
				queue:false,
				complete: function (){
					if (!self.sett.button_numbers_autohide && self.sett.button_show_numbers){
						for (var i=0; i<self.slide_tot; i++) {	
							self.showHideButton(i, true);
						}
					}					
				}
			});
			
			//Class for button color
			$('.col').css('background-color', this.sett.button_color);		
		},
		
		
		startDrag: function (id, sx) {
			var self = this;
			var n;			
			var pos;
			var p = 0;
			var ch = 0;	
			var reversed = false;		
			if (this.sett.slide_transition !== 'move') this.slides[id].con.css(this.shProp, '0px 0px 45px 0px #000000');
			this.slide_drg = false;
			
			$(document).unbind('mousemove.drag touchmove.drag').bind('mousemove.drag touchmove.drag', function (e){						
				var mouseX;
				
				if (e.type == 'mousemove')	{
					mouseX = e.pageX;
					
				} else {
					//If multi touch swipe happens instead of single finger, stop dragging
					if (e.originalEvent.touches.length>1) {
						return false;
					} else {
						mouseX = e.originalEvent.changedTouches[0].pageX;
					}
				}				
				
				pos = mouseX-sx;
				if(pos>self.bW) pos = self.bW;
				if(pos<-self.bW) pos = -self.bW;
				ch = mouseX-p;
				p = mouseX;
				self.slides[id].con.css('left',pos);
				
				//Drag rightwards				
				if (pos>0) {
					n = self.slide_sel-1 <0? self.slide_tot-1 : self.slide_sel-1;	
					if (!self.slide_drg) {
						 self.slides[n].con.show();
					}
					if (self.slides[n].txt) {
						self.slides[n].cap.hide();					
					}
					self.slide_drg = true;
					
				//Drag leftwards
				} else if (pos<0) {
					n = self.slide_sel+1 >self.slide_tot-1? 0 : self.slide_sel+1;
					if (!self.slide_drg) {
						self.slides[n].con.show();
					}
					if (self.slides[n].txt) {
						self.slides[n].cap.hide();
					}
					self.slide_drg = true;
					
				}
				
				//If drag started
				if (pos !==0){	
					self.slide_pr1 = n;
					self.zSort(2,1);					
					if (self.clockPlaying) {
						self.clockPlaying = false;
						self.timerob.stop();
						self.timerReset(true);	
					}										
			
					if (self.sett.slide_transition == 'move'){						
						self.slides[n].con.css({'left': pos+(pos>0?-self.bW : self.bW)});						
					} else {
						self.slides[n].con.css({'left': '0px'});
					}
					
				}
				 e.preventDefault();
				 return false;				
			});
			$(document).unbind('mouseup.drag touchend.drag').bind('mouseup.drag touchend.drag', function (e){
				$(document).unbind('mousemove.drag touchmove.drag');
				$(document).unbind('mouseup.drag touchend.drag');
				if (self.slide_drg) {
					var dir = 0;
					var cp = self.slides[id].con.position().left;
					if (self.IE8){
						if (cp> self.sett.touch_dragdrop_factor) {
							dir = 1;
						} else if (cp< -self.sett.touch_dragdrop_factor) {
							dir = -1;
						}
					} else {
						if (cp>  self.sett.touch_dragdrop_factor) {
							dir = 1;
						} else if (cp< -self.sett.touch_dragdrop_factor) {
							dir = -1;
						}
						if (ch>self.sett.touch_throw_factor) {						
							dir = cp<  0 ? 0 : 1;
						} else if (ch<-self.sett.touch_throw_factor) {
							dir = cp> 0 ? 0 : -1;
						}
					}			
					
					if (dir != 0) {
						self.dragged = true;
						self.slide_dir =  dir;
						self.slide_fin = false;
						if (self.sett.slide_transition == 'move'){
							self.slides[id].con.stop().animate({'left': self.bW*dir} , {duration: Math.max((self.bW-(self.slides[id].con.position().left*dir))/1.5, 400), 
							step: function (now, fx){
								self.slides[n].con.css({'left': now+(pos>0?-self.bW : self.bW)});
							},
							complete: function(){
								self.slide_fin = true;
								self.slide_drg = false;
								if (self.sett.button_show_numbers){
									self.toggleButton ();
								} else {
									self.timerReset(true);	
								}
								if (self.slides[n].txt) {
									self.slides[n].cap.hide();
									if (self.sett.caption_float_mode) {				
										self.slides[n].cap.css('left', (self.IE8? self.slides[n].cx : self.slides[n].cx+(100*-self.slide_dir))+'px');	
									}
								}
								if (self.slides[n].txt) {									
									self.animateCaption ();						
								}
								if (self.autoPlaying){			
									self.startDelayTimer();
								}
							}});						
							
						} else {
							if (self.IE8){
								if (self.slides[self.slide_pr1].txt) {
									self.slides[self.slide_pr1].txt.stop().clearQueue();
									self.slides[self.slide_pr1].cap.stop().clearQueue();
								}
							}
							self.slides[id].con.stop().animate({'left': (self.bW+30)*dir} , {duration: Math.max((self.bW-(self.slides[id].con.position().left*dir))/.75, 600), 
							easing:'easeOutQuart',
							complete: function(){
								self.slides[id].con.css(self.shProp, 'none');	
								self.slide_fin = true;	
								self.slide_drg = false;
								if (self.sett.button_show_numbers){
									self.toggleButton ();
								} else {
									self.timerReset(true);	
								}
								if (self.slides[n].txt) {
									self.slides[n].cap.hide();
									if (self.sett.caption_float_mode) {				
										self.slides[n].cap.css('left', (self.IE8? self.slides[n].cx : self.slides[n].cx+(100*-self.slide_dir))+'px');
									}
								}
								if (self.slides[n].txt) {									
									self.animateCaption ();
								}
								if (self.autoPlaying){
									self.startDelayTimer();
								}
							}});
						}
						self.slide_sel = n;
						
					} else {
						if (self.sett.slide_transition == 'move'){
							self.slides[id].con.stop().animate({'left':0} , {
								step: function(now, fx){
									self.slides[n].con.css({'left': now+(pos>0?-self.bW : self.bW)});																						
								},
								complete: function (){
									self.slide_drg = false;
									if (self.autoPlaying){				
										self.startDelayTimer();
									}								
								}
							});
						} else {
							self.slides[id].con.stop().animate({'left':0} , {
								complete: function(){
									self.slide_drg = false;									
									self.slides[id].con.css(self.shProp, 'none');	
									if (self.autoPlaying){				
										self.startDelayTimer();
									}							
								}
							});	
						}
					}					
				}
				
				return false;		
			});	
				
		},		
		
		
		
		//Find the selected slide before making transition
		//////////////////////////////////////////////////////////////////////////////////////////////
		changeSlide: function (n){
			this.slide_pr2 = this.slide_pr1;
			this.slide_pr1 = this.slide_sel;
			this.dragged = false;
						
			//Next button clicked			
			if (n=='next'){
				this.slide_sel = this.slide_sel+1 > this.slide_tot-1?  0 : this.slide_sel+1;	
							
			//Back button clicked
			} else if (n=='back'){
				this.slide_sel = this.slide_sel-1 < 0?  this.slide_tot-1 : this.slide_sel-1;	
							
			//Number button clicked
			} else {
				this.slide_sel = n;
			}
						
			this[this.sett.slide_transition] ();

		},
		
		
		
		//Change the stack order (z-index) of slides
		//////////////////////////////////////////////////////////////////////////////////////////////
		zSort : function (current, previous){
			var z = 1;
			for ( var i=0; i<this.slide_tot; i++) {	
				if (i !== this.slide_sel && i !== this.slide_pr1) {
					if (this.slides[i]) {
						this.slides[i].con.css('z-index', z);
						if (this.IE8) this.slides[i].con.hide();
					}
					z++;
				}				
			}
			if (this.slides[this.slide_pr1]) this.slides[this.slide_pr1].con.css('z-index', this.slide_tot+previous);
			if (this.slides[this.slide_sel]) this.slides[this.slide_sel].con.css('z-index', this.slide_tot+current);
		},
		
		
		
		//Trasnition out the previous slides caption
		//////////////////////////////////////////////////////////////////////////////////////////////
		textOut : function (){
			var self = this;			
			if (this.slides[this.slide_pr1] && this.sett.slide_transition == 'fade') {				
				this.slides[this.slide_pr1].txt.stop().clearQueue().animate({
					'left':(-self.slides[self.slide_pr1].cw/2)+'px'}, {
					duration: 150, 
					easing:'easeOutQuad',
					
					queue: false,
					complete: function (){						
						$(this).hide();
					}
				});
			} 
		},
		
		
		
		//Animate the slected slide's caption
		//////////////////////////////////////////////////////////////////////////////////////////////
		textIn : function (){
			var txtDir = -this.slide_dir;			
			if (this.sett.slide_transition == 'fade' && !this.dragged) txtDir = 1;			
				
			if (this.slides[this.slide_sel].txt) {
				if (this.IE8) {
					this.slides[this.slide_sel].txt.css({'left': (this.sett.caption_padding_x+(100*txtDir))+'px', 'filter': 'none'})
				} else {
					this.slides[this.slide_sel].txt.css({'left': (this.sett.caption_padding_x+(100*txtDir))+'px', 'opacity': 1});
				}
				this.slides[this.slide_sel].txt
				.hide()
				.fadeIn(600, function(){
					$(this).removeAttr("filter").removeAttr("-ms-filter");
				})
				.animate({
					'left':this.sett.caption_padding_x+'px'}, {
					duration: 800,
					easing:'easeOutQuart',
					queue:false
				});
			}
		},
		
		
		
		//Entire Caption holder animates
		//////////////////////////////////////////////////////////////////////////////////////////////
		animateCaption : function () {
			var self = this;
			var id = this.slide_sel;			
			this.slides[this.slide_sel].txt.hide();	
			if (this.sett.caption_float_mode) {
				if (this.IE8) {
					this.slides[id].cap.hide().fadeIn({ duration: 300});
				} else {
					this.slides[id].cap.hide().fadeIn({ duration: 800, queue:false}).animate({'left':this.slides[id].cx}, {'duration':600});
				}
				this.textIn ();
			} else {
				if (this.IE8) {
					this.slides[id].cap.hide().fadeIn({ duration: 600, 
						complete: function () {
							self.textIn();
						}, queue:false});
				} else {
					this.slides[id].cap.hide().fadeIn({ duration: 600, queue:false});
					this.slides[id].cap.animate({'_':100}, {'duration': 400, 
						complete: function () {
							self.textIn();
						}
					});
				}				
			}	
		},		
			
		
		
		//Navigation Button
		//////////////////////////////////////////////////////////////////////////////////////////////
		createButton: function (nav, holder, zindex, icon, num){
			var self = this;
			var _size = this.sett.button_size;
			var button = $('<div></div>', {'style': 'z-index:'+zindex+'; position: absolute; width:'+(_size+(this.buttonIE*2))+'px; height:'+(_size+(this.buttonIE*2))+'px; cursor: pointer; '}).addClass('noSelect');
			var bg = $('<div></div>', {'style': 'z-index:2; position: absolute; left: '+this.buttonIE+'px; top: '+this.buttonIE+'px; right:'+this.buttonIE+'px; bottom:'+this.buttonIE+'px; width:'+_size+'px; height:'+ _size+'px;'}).appendTo(button);
			
			if (this.IE8) {
				var sh = $('<div></div>', {'style': 'z-index:1; position: absolute; background-color:#000000; left: 0px; top: 0px; width:100%; height:100%; filter: alpha(opacity=10)'}).appendTo(button);
				var alpha = '<div class="col" style="z-index:2; position:absolute; left:0px; top:0px; width:100%; height:100%; filter: alpha(opacity=35);"></div>';		
				var tb = '<div class="col" style="z-index:3; position:absolute; left:1px; right:1px; top:0px; height:100%; filter: alpha(opacity=100);"></div>';		
				var cent = '<div class="col" id="iconHolder" unselectable="on" style="z-index:4; position:absolute; left:0px; top: 1px; width: 100%; height: '+(_size-2)+'px; filter: alpha(opacity=100);" align="center"></div>';	
				$(alpha+tb+cent).appendTo(bg);		
				var ih = bg.find('#iconHolder');
				if (icon){
					ih.addClass('icon').css({'background-position': (num == "next"? ((_size-30)/2)-30 : num == "pause"? ((_size-30)/2)-(this.autoPlaying? 60 : 90) : (_size-30)/2) + 'px center', 'background-repeat': 'no-repeat'});		
				} else {
					var ih_number = $('<span unselectable="on" style="position:relative; font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: bold; text-align: center; line-height:'+ (_size-1)+'px; left:'+ (String(num+1).length <=1 ? 1 : 0)+'px; top:-1px;"  align="center">'+(num+1)+'</span>')
					ih.append(ih_number);
				}
				
			} else {
				if ($.browser.webkit) {
					if (parseInt($.browser.version, 10) < 533) {
						bg.css(this.shProp, '0px 0px 2px #000000');				
					} else {
						bg.css(this.shProp, '0px 0px 5px -1px #000000');			
					}
				} else if ($.browser.mozilla) {
					if (bg.css('box-shadow') != 'none') { 
						bg.css(this.shProp, '0px 0px 3px -1px #000000');
					} else {				
						bg.css(this.shProp, '0px 0px 2px -1px #000000');
					}
				} else if ($.browser.opera){	
					bg.css(this.shProp, '0px 0px 2px 0px #000000');
				} else {
					bg.css(this.shProp, '0px 0px 5px -1px #000000');
				}
				bg.css({
					'-moz-border-radius': '2px', '-webkit-border-radius': '2px', 'border-radius': '2px', '-khtml-border-radius': '2px'		
				}).addClass('col');		
				
				if (icon){
					bg.addClass('icon').css({'background-position': (num == "next"? ((_size-30)/2)-30 : num == "pause"? ((_size-30)/2)-(this.autoPlaying? 60 : 90) : (_size-30)/2) + 'px center', 'background-repeat': 'no-repeat'});
				
				} else {	
					button.append($('<div align="center" style="z-index:2; position: absolute; left: 0px; top: 0px; width: 100%; height:100%; font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: bold; line-height:'+ _size+'px; text-align: center; cursor:hand;">'+(num+1)+'</div>'));
				}
			}
			
			//Button Events; only for over, out and down states
			button.bind('mouseenter', function (e){
				bg.css({'opacity': 1});	
				
			}).bind('mouseleave', {id:num}, function (e){	
				if (e.data.id != self.slide_sel) bg.css({'opacity': self.sett.button_opacity});
				
			}).bind('mousedown', function (e){
				e.stopImmediatePropagation();
				if (num !== self.slide_sel) {
					bg.css({'opacity': 1, 'left': (1+self.buttonIE)+'px', 'top': (1+self.buttonIE)+'px', 'width': (_size-2)+'px', 'height': (_size-2)+'px', 'background-position': ((num == "next"? ((_size-30)/2)-30 : num == "pause"? ((_size-30)/2)-(self.autoPlaying? 60 : 90) : (_size-30)/2)-1) + 'px center'});
					sh? sh.css({'left': '1px', 'top': '1px', 'width': _size+'px', 'height': _size+'px'}) : "";
					if (ih) ih.css({'height':(_size-4)+'px', 'background-position': ((num == "next"? ((_size-30)/2)-30 : num == "pause"? ((_size-30)/2)-(self.autoPlaying? 60 : 90) : (_size-30)/2)-1) + 'px center'});									
					if (ih_number) ih_number.css({'top': '-2px'});
					nav.currentDown = num;	
				}
			});
			
			bg.css('opacity', this.sett.button_opacity);		
			button.appendTo(holder);
			button.bg = bg;
			button.ih = button.children().eq(1);
			return button;
		},
		
		
		
		//Setup entire navigation here
		////////////////////////////////////////////////////////////////////////////////////////////// 
		navigation: function () {
			var self = this;			
			
			var nav = this.nav = this;
			nav.currentDown = "";
			
			var _size = this.sett.button_size;
			var _sp = this.sett.button_space;
				
			var navPosX = this.bW-this.sett.button_margin-(this.sett.caption_float_mode? 0 : this.sett.caption_margin_x);
			var navPosY = this.bH-this.sett.button_margin-(this.sett.caption_float_mode? 0 : this.sett.caption_margin_y);
			
			//Add Navigation Holder
			var $navHolder = $('<div></div>', {'style': 'z-index:'+(this.slide_tot+50)+'; position: absolute; left: '+ navPosX +'px; top: '+ navPosY +'px;'});
			
			if (this.buttonNext || this.buttonNumber){
				var $numSet = $('<div></div>', {'style': 'z-index:4; position: absolute; left: '+(-_size)+'px; top: '+ (-(_size+_sp)*(this.slide_tot+(this.buttonNext? 1 : 0))+_sp) +'px; width: '+_size+'px; height: '+((_size+_sp)*(this.slide_tot+1)-_sp)+'px; '});
				if (this.sett.button_numbers_horizontal) {		
					$numSet.css({
						'z-index':4,
						'position': 'absolute',
						'left': (-(_size+_sp)*(this.slide_tot+ (this.buttonNext? 1 : 0))+_sp) +'px',
						'top': (-_size) +'px',
						'width': ((_size+_sp)*(this.slide_tot+ (this.buttonNext? 1 : 0))-_sp)+'px',
						'height': _size+'px'
					});				
				} 
				$numSet.appendTo($navHolder);
			}
			
			//Next Button
			if (this.buttonNext) {
				this.buttonNext = this.createButton (nav, $numSet, 4, true, "next")
				.css({'left': (this.sett.button_numbers_horizontal? ((_size+_sp)*this.slide_tot) : 0)-this.buttonIE+'px', 'top': (this.sett.button_numbers_horizontal? 0 :((_size+_sp)*this.slide_tot))-this.buttonIE+'px'})
			
				if (this.sett.button_numbers_autohide && this.buttonNumber){
					this.buttonNext.bind('mouseenter', function (e){
						if (!self.numShow){
							for (var i=0; i<self.slide_tot; i++) {
								clearTimeout(self.buttonLeaveTimer);
								clearTimeout(self.slides[i].timer);															
								self.showHideButton(i, true);								
							}	
						}							
					});
					$numSet.bind('mouseleave', function (e){					
						if (self.numShow){											
							self.buttonLeaveTimer = setTimeout(function (){
								self.numShow = false;					
								for (var i=0; i<self.slide_tot; i++) {
									self.showHideButton(i, false);
								}			
							}, 300);
						}
						
					})		
					.bind('mouseenter', function (e){	
						if (self.numShow) {
							clearTimeout(self.buttonLeaveTimer);
						};			
					});
				}
			}
			
			//Timer Clock
			if (this.clockTimer) {
				if (this.canvasSupport){
					this.clockTimer = $('<canvas id="clockTimer" width="'+_size+'" height="'+_size+'" style="position:absolute; z-index:2;"></canvas>').appendTo(this.sett.button_numbers_horizontal && this.buttonNext? $numSet : $navHolder);
					this.clockContext = this.clockTimer[0].getContext('2d');
					this.clockContext.shadowColor = 'rgba(0, 0, 0, 0.5)';
					this.clockContext.shadowBlur = 3;
					this.clockContext.shadowOffsetX = 0;
					this.clockContext.shadowOffsetY = 0;
					this.clockContext.lineWidth = _size/10;
					this.clockContext.lineCap = 'round';					
				} else {			
					this.clockTimer = $('<div style="position:absolute; z-index:2; width:'+_size+'px; height:'+_size+'px; overflow:hidden"><div style="position:absolute; left: -2px; top:-2px; width:'+(_size !== 20 ? (960*(_size/20/1)) : 960)+'px; height:'+(_size+2)+'px; filter : progid:DXImageTransform.Microsoft.AlphaImageLoader(src='+this.timer_sprite+', sizingMethod='+(_size !== 20 ? 'scale' : 'noscale')+') alpha(opacity=100);"></div></div>').appendTo(this.sett.button_numbers_horizontal && this.buttonNext? $numSet : $navHolder);
				}
				
				if (this.sett.button_numbers_horizontal) {
					if (this.buttonNext) {
						if (this.buttonNumber && !this.sett.button_numbers_autohide){
							this.clockTimer.css({'left': -(_size+_sp)+'px', 'top': '0px'});
						} else {
							this.clockTimer.css({'left': ((_size+_sp)*(this.slide_tot-1))+'px', 'top': '0px'});
						}
					} else {
						if (this.buttonNumber && !this.sett.button_numbers_autohide){
							this.clockTimer.css({'left': -((_size+_sp)*(this.slide_tot+1))+_sp+'px', 'top': (-_size)+'px'});
						} else {
							this.clockTimer.css({'left': (-_size)+'px', 'top': (-_size-this.buttonIE)+'px'});							
						}
					}
				} else {
					this.clockTimer.css({'left': -((_size*(this.buttonNext || this.buttonNumber? 2 : 1))+(this.buttonNext || this.buttonNumber? _sp : 0))+'px', 'top': -(_size)+'px'});
				}
				
				this.buttonPause = this.createButton (nav, this.sett.button_numbers_horizontal && this.buttonNext? $numSet : $navHolder, 3, true, 'pause')
				.css({'left': parseInt(this.clockTimer.css('left'), 10)-this.buttonIE, 'top': parseInt(this.clockTimer.css('top'), 10)-this.buttonIE});
				if (this.autoPlaying){
					this.buttonPause.css({'opacity':0});
				} else {
					this.clockTimer.css({'opacity':0});
				}
				
				this.buttonPause.bind('mouseenter', function (e){
					self.buttonPause.stop().animate({opacity: 1},{
						duration: 400,
						easing: 'easeOutQuad'
					
					});					
											
				}).bind('mouseleave', function (e){
					if (self.autoPlaying){
						self.buttonPause.stop().animate({opacity: 0},{
							duration: 400,
							easing: 'easeOutQuart'						
						});	
					}
											
				});	
			}
				
			//Back Button
			if (this.buttonBack) {
				this.buttonBack = this.createButton (nav, this.sett.button_numbers_horizontal && this.buttonNext? $numSet : $navHolder, 1, true, "back");	
				if (this.sett.button_numbers_horizontal) {	
					if (this.buttonNext){
						if (this.clockTimer){
							this.buttonBack.css({'left': ((_size+_sp)*(this.slide_tot-2))-this.buttonIE+'px', 'top': (-this.buttonIE)+'px'});
						} else{
							this.buttonBack.css({'left': ((_size+_sp)*(this.slide_tot-1))-this.buttonIE+'px', 'top': (-this.buttonIE)+'px'});
						}
					} else {	
						if (this.clockTimer){							
							this.buttonBack.css({'left': (parseInt(this.clockTimer.css('left'),10)-_size-_sp)-this.buttonIE+'px', 'top': parseInt(this.clockTimer.css('top'), 10)-this.buttonIE});
						} else{
							this.buttonBack.css({'left': (-_size)+'px', 'top': (-_size-this.buttonIE)+'px'});							
						}
					}					
				} else {
					if (this.clockTimer){
						this.buttonBack.css({'left': ((-(_size+_sp)*(this.buttonNext? 3 : 2))+_sp)-this.buttonIE+'px', 'top': -(_size)-this.buttonIE+'px'});
					} else {
						this.buttonBack.css({'left': -((_size*(this.buttonNext || this.buttonNumber? 2 : 1))+(this.buttonNext || this.buttonNumber? _sp : 0))-this.buttonIE+'px', 'top': -(_size)-this.buttonIE+'px'});
					}
				}	
			}
			
			//Number Buttons
			if (this.buttonNumber) {
				for (var i=0; i<this.slide_tot; i++){					
					this.slides[i].butt =  this.createButton (nav, $numSet, this.slide_tot-i+5, false, i);	
					this.slides[i].buttBG = this.slides[i].butt.bg;
					this.slides[i].buttIH = this.slides[i].butt.ih;
					if (this.sett.button_numbers_horizontal) {
						this.slides[i].butt.css({'top': (-this.buttonIE)+'px', 'left': ((_size+_sp)*i)-this.buttonIE+'px'});
					} else {
						this.slides[i].butt.css({'left': (-this.buttonIE)+'px', 'top': ((_size+_sp)*i)-this.buttonIE+'px'});
					}						
					if (i == this.slide_sel) this.slides[i].buttBG.css({'opacity': 1});				
					this.slides[i].butt.hide();
				}			
			}
				
			//Mouse Up event for all the buttons: Next, Back, Pause and Number buttons
			$(document).bind('mouseup', function (){	
				if (nav.currentDown == "next"){								
					if ((self.sett.slide_transition == 'fade' && self.slide_fin) || (self.sett.slide_transition != 'fade' && ((self.slide_dir <0 && self.slides[self.slide_sel].con.position().left < self.bW/2) || (self.slide_dir >0 && self.slides[self.slide_sel].con.position().left > -self.bW/2)))) {
						self.slide_dir = -1;
						self.changeSlide ("next");				
					}

					if (self.sett.button_show_numbers){
						self.toggleButton ();
					} else {
						self.timerReset(false);	
					}			
					self.buttonNext.bg.css({'opacity': 1, 'left': (self.buttonIE)+'px', 'top': (self.buttonIE)+'px', 'width': _size+'px', 'height': _size+'px', 'background-position': (((_size-30)/2)-30) + 'px center'});
					self.buttonNext.ih.css({'left': '0px', 'top': '0px', 'width': _size+2+'px', 'height': _size+2+'px'});
					self.buttonNext.find('#iconHolder').css({'height':(_size-2)+'px', 'background-position': (((_size-30)/2)-30) + 'px center'});			
										
				} else if (nav.currentDown == "back"){
					if ((self.sett.slide_transition == 'fade' && self.slide_fin) || (self.sett.slide_transition != 'fade' && ((self.slide_dir <0 && self.slides[self.slide_sel].con.position().left < self.bW/2) || (self.slide_dir >0 && self.slides[self.slide_sel].con.position().left > -self.bW/2)))) {
						self.slide_dir = 1;
						self.changeSlide ("back");				
					}
					if (self.sett.button_show_numbers){
						self.toggleButton ();
					} else {
						self.timerReset(false);	
					}						
					self.buttonBack.bg.css({'opacity': 1, 'left': (self.buttonIE)+'px', 'top': (self.buttonIE)+'px', 'width': _size+'px', 'height': _size+'px', 'background-position': ((_size-30)/2) + 'px center'});
					self.buttonBack.ih.css({'left': '0px', 'top': '0px', 'width': _size+2+'px', 'height': _size+2+'px'});
					self.buttonBack.find('#iconHolder').css({'height':(_size-2)+'px', 'background-position': ((_size-30)/2) + 'px center'});
						
				} else if (nav.currentDown == "pause"){
					if (self.autoPlaying){
						self.autoPlaying = false;
						self.buttonPause.css({'opacity':1});
						self.clockTimer.css({'opacity':0});
						self.timerReset(true);
					} else {
						self.autoPlaying = true;
						self.buttonPause.stop().animate({opacity: 0},{
							duration: 400,
							easing: 'easeOutQuart'						
						});	
						self.clockTimer.css({'opacity':1});
						self.startDelayTimer();
					}
											
					self.buttonPause.bg.css({'opacity': 1, 'left': (self.buttonIE)+'px', 'top': (self.buttonIE)+'px', 'width': _size+'px', 'height': _size+'px', 'background-position': (((_size-30)/2)-(self.autoPlaying? 60 : 90)) + 'px center'});
					self.buttonPause.ih.css({'left': '0px', 'top': '0px', 'width': _size+2+'px', 'height': _size+2+'px'});
					self.buttonPause.find('#iconHolder').css({'height':(_size-2)+'px', 'background-position': (((_size-30)/2)-(self.autoPlaying? 60 : 90)) + 'px center'});
						
				} else if (nav.currentDown !== ""){
					if (self.slide_sel !== nav.currentDown){
						if ((self.sett.slide_transition == 'fade' && self.slide_fin) || (self.sett.slide_transition != 'fade' && ((self.slide_dir <0 && self.slides[self.slide_sel].con.position().left < self.bW/2) || (self.slide_dir >0 && self.slides[self.slide_sel].con.position().left > -self.bW/2)))) {
							if (nav.currentDown > self.slide_sel ) {
								self.slide_dir = -1;
							} else if (nav.currentDown < self.slide_sel ){
								self.slide_dir = 1;
							}									
							self.changeSlide (nav.currentDown);					
						}						
					}
					if (self.sett.button_show_numbers){
						self.toggleButton ();
					} else {
						self.timerReset(false);	
					}				
					var ih = self.slides[self.slide_sel].butt.find('#iconHolder');				
					if (ih) {
						ih.css({'height':(_size-2)+'px'});
						ih.children().eq(0).css({'top': '-1px'});
					}					
				}
				nav.currentDown = "";
			});			
			return $navHolder;
		},
	
		
		
		//The timer clock initiated
		//////////////////////////////////////////////////////////////////////////////////////////////
		startDelayTimer: function(){
			var self = this;		
			if (this.clockPlaying) this.timerob.stop();
			if (this.clockTimer) this.clockTimer.stop();
			this.clockPlaying = true;
			this.timerob.css('left', '0px');
			this.timerob.animate({'left': '780px'}, {
				easing: 'linear',
				duration: this.slides[this.slide_sel].delay,
				queue: false,
				step: function (now, fx){
					if (self.sett.button_show_timer) {
						if (self.canvasSupport){							
							self.clockContext.clearRect(0, 0, self.sett.button_size, self.sett.button_size);	
							self.clockContext.strokeStyle = "rgba(255, 255, 255, .4)";
							self.clockContext.beginPath();		
							self.clockContext.arc(self.sett.button_size/2, self.sett.button_size/2, (self.sett.button_size/2)-(self.sett.button_size/10), 0, Math.PI*2, true);
							self.clockContext.stroke();
							self.clockContext.closePath();	
				
							self.clockContext.strokeStyle = "rgba(255, 255, 255, .85)";
							self.clockContext.beginPath();		
							self.clockContext.arc(self.sett.button_size/2, self.sett.button_size/2, (self.sett.button_size/2)-(self.sett.button_size/10), (Math.PI*2*(now/780))-(Math.PI/2), -Math.PI/2, true);
							
							self.clockContext.stroke();
							self.clockContext.closePath();						
						} else {
							var pos = (parseInt(now/780*39, 10)*-(24*self.sett.button_size/20))-2;			
							pos< -(39*(24*self.sett.button_size/20))-2? pos = -2 : "";
							self.clockTimer.children().eq(0).css({'left': pos+'px'});						
						}	
					}
				}, 
				complete: function (){	
					self.clockPlaying = false;														
					if (!self.slide_drg) {
						self.slide_dir = -1;						
						self.changeSlide ("next");
						if (self.sett.button_show_numbers){
							self.toggleButton ();
						} else {
							self.timerReset(false);	
						}
					}					
				}
			});		
		},
		
		
		
		//Stop timer clock and initiate new
		//////////////////////////////////////////////////////////////////////////////////////////////
		timerReset: function (immediate){
			var self = this;			
			if (this.clockPlaying) this.timerob.stop();
			
			if (this.autoPlaying){
				if (immediate){					
					if (this.clockTimer) {
						this.clockTimer.stop();
						if (this.canvasSupport){						
							self.clockContext.clearRect(0, 0, self.sett.button_size, self.sett.button_size);	
							self.clockContext.strokeStyle = "rgba(255, 255, 255, .4)";
							self.clockContext.beginPath();		
							self.clockContext.arc(self.sett.button_size/2, self.sett.button_size/2, (self.sett.button_size/2)-(self.sett.button_size/10), 0, Math.PI*2, true);
							self.clockContext.stroke();
							self.clockContext.closePath();
							self.clockTimer.css({'opacity':1});						
						} else {		
							self.clockTimer.children().eq(0).css({'left': '-2px'});					
							self.clockTimer.css({'filter':'none'});				
						}
					}	
				} else {
					if (this.clockTimer) {
						if (this.canvasSupport){	
							this.clockTimer.stop().fadeTo(300, .4, function(){								
								self.clockContext.clearRect(0, 0, self.sett.button_size, self.sett.button_size);	
								self.clockContext.strokeStyle = "rgba(255, 255, 255, .4)";
								self.clockContext.beginPath();		
								self.clockContext.arc(self.sett.button_size/2, self.sett.button_size/2, 8, 0, Math.PI*2, true);
								self.clockContext.stroke();
								self.clockContext.closePath();
								self.clockTimer.css({'opacity':1});													
							});
						} else {				
							this.clockTimer.stop().fadeTo(300, .4, function(){
								self.clockTimer.children().eq(0).css({'left': '-2px'});					
								self.clockTimer.css({'filter':'none'});
							});				
						}
					}	
				}
			}
		},
		
		
		
		//Change Number button selection
		//////////////////////////////////////////////////////////////////////////////////////////////
		toggleButton: function (){
			for (var i=0; i<this.slide_tot; i++){		
				this.slides[i].buttBG.css({'opacity': this.sett.button_opacity});
				this.slides[i].buttBG.css({'opacity': this.sett.button_opacity, 'left': (this.buttonIE)+'px', 'top': (this.buttonIE)+'px', 'width': this.sett.button_size+'px', 'height': this.sett.button_size+'px'});	
			}
			this.timerReset(false);		
			this.slides[this.slide_sel].buttBG.css({'opacity': 1, 'left': (this.buttonIE)+'px', 'top': (this.buttonIE)+'px', 'width': this.sett.button_size+'px', 'height': this.sett.button_size+'px'});	
			this.buttonIE >0? this.slides[this.slide_sel].buttIH.css({'left': '0px', 'top': '0px', 'width': this.sett.button_size+2+'px', 'height': this.sett.button_size+2+'px'}) : "";			
		},
		
		
		
		//Number Buttons - Animated Chain display
		//////////////////////////////////////////////////////////////////////////////////////////////
		showHideButton: function (i, up){			
			var self = this;	
			var _size = this.sett.button_size;
			var _sp = this.sett.button_space;	
			var delay, dur, tar_op, sc, ob, bg, sh, children;
			ob = self.slides[i].butt;
						
			clearTimeout(this.buttonLeaveTimer);
			clearTimeout(self.slides[i].timer);		
	
			bg = ob.bg;
			sh = ob.ih;	
			ob.stop();
			if (up) {			
				self.numShow = true;
				self.slides[i].butt.show();
				if (ob.css('opacity') ==1)ob.css('opacity', 0);	
				delay = (self.slide_tot-i)*(100/self.slide_tot);
				dur = 20+((self.slide_tot-i)*(300/self.slide_tot));			
				tar_op = 1;
				sc = 3;
			} else {			
				delay = i*(150/self.slide_tot);
				dur = 20+(i*(150/self.slide_tot));
				tar_op = 0;
				sc = 8			
			}
			self.slides[i].timer = setTimeout(function (){			
				ob.animate({'opacity': tar_op},
					{duration: dur,
					step: function(now, fx) {
						
						var p = parseInt((_size/sc)-(_size/sc*now), 10);
						var s = _size-(p*2);	
						bg.css({'width': s,'height': s, 'left': p+self.buttonIE, 'top': p+self.buttonIE});
						self.buttonIE >0 ? sh.css({'width': s+2,'height': s+2, 'left': p, 'top': p}) : "";
						var ih = bg.find('#iconHolder');	
						if (ih) {
							ih.css({'height':(s-2)+'px'});
							ih.children().eq(0).css({'top': (-p-1)+'px'});
						}
						if (self.sett.button_numbers_horizontal) {
							if (self.clockTimer)	{						
								if (i==self.slide_tot-1){
									if (up){
										if (self.buttonNext){	
											self.clockTimer.css({'left': (-(_size+_sp)*now)+'px', 'top': '0px'});
										}																		
									} else {
										self.clockTimer.css('left', (((_size+_sp)*(self.slide_tot-1)*(1-now))+(_size+_sp)*now)+'px');
									}
									if (self.buttonBack)	{								
										self.buttonBack.css('left', (self.clockTimer.position().left-_size-_sp)-self.buttonIE+'px');								
									}
								}
								self.buttonPause.css({'left': parseInt(self.clockTimer.css('left'), 10)-self.buttonIE, 'top': parseInt(self.clockTimer.css('top'), 10)-self.buttonIE});		
							} else {
								if (i==self.slide_tot-1){
									if (self.buttonBack)	{						
										if (up){
											if (self.buttonNext){
												self.buttonBack.css('left', (-(now*(_size+_sp)))-self.buttonIE+'px');	
											} 																			
										} else {
											if (self.buttonNext){
												self.buttonBack.css('left', (((_size+_sp)*(self.slide_tot-1)*(1-now))+(_size+_sp)*now)-self.buttonIE+'px');
											} 
																			
										}								
									}
								}						
							}						
						}
					},
					complete: function() {
						if (!up) self.slides[i].butt.hide();											
					}
				});		
			}, delay);
		},
		
		
		
		//Transition 1: Move
		//////////////////////////////////////////////////////////////////////////////////////////////
		move : function (){
			var self = this;
			var id = this.slide_sel;
			this.zSort (2,1);
			if (this.slides[id].txt) {
				this.slides[id].cap.hide();
				if (this.sett.caption_float_mode) {		
					this.slides[id].cap.css('left', (this.IE8? this.slides[id].cx : this.slides[id].cx+(100*-this.slide_dir))+'px');	
				}
			}
			if (this.slide_pr1 !== ''){
				if (this.slides[this.slide_pr1].txt) {
					this.textOut();
				}
			}		
			this.slide_drg = false;
			this.slide_fin = false;			
			var ent = false;
			this.slide_playing = true;				
			this.slides[id].con.stop().show().css({'left': (this.slide_pr1 !== ''? this.slides[this.slide_pr1].con.position().left+(-this.bW*this.slide_dir) : -this.bW*this.slide_dir)}).animate({
				'left':'0px'},
				{duration: self.sett.slide_transition_period+100,
				easing:'easeInOutQuart',
					step: function (now, fx){
					if (self.slide_pr1 !== '' && self.slide_pr1 !== id) self.slides[self.slide_pr1].con.stop().css({'left': now+(self.bW*self.slide_dir)});							
					if (self.slide_pr2 !== '' && self.slide_pr2 !== id && self.slide_pr2 !== self.slide_pr1) self.slides[self.slide_pr2].con.stop().css({'left': now+(self.bW*2*self.slide_dir)});								
				},
				complete: function (){						
					self.slide_fin = true;	
					if (self.slide_sta)	{
						self.slide_sta = false;
						self.$cont.css('background-image', 'none');
					}	

					if (id == self.slide_sel && self.slides[id].txt) {
						self.animateCaption ();
					}
					if (self.autoPlaying){			
						self.startDelayTimer();
					}
				}						
			});				
		},	
		
				

		//Transition 2: FadeIn
		//////////////////////////////////////////////////////////////////////////////////////////////
		fade : function (){
			var self = this;
			var id = this.slide_sel;
			this.zSort (2,1);
			if (this.slides[id].txt) {	
				this.slides[id].con.show();	
				this.slides[id].cap.hide();
				if (this.sett.caption_float_mode) {				
					this.slides[id].cap.css('left', (this.IE8? this.slides[id].cx : this.slides[id].cx+(100*-this.slide_dir))+'px');	
				}
			}		
			if (this.slide_pr1 !== ''){
				if (this.slides[this.slide_pr1].txt) {
					this.textOut();
				}
			}
			this.slide_drg = false;
			this.slide_fin = false;
			
			var ent = false;
			this.slide_playing = true;	
			this.slides[id].con.stop().hide().css('left','0px').fadeIn({
				duration: self.sett.slide_transition_period+100,
				easing:'easeInOutQuart',
				complete: function (){			
					self.slide_fin = true;
					if (self.slide_sta)	{
						self.slide_sta = false;
						self.$cont.css('background-image', 'none');
					}					
					if (id == self.slide_sel && self.slides[id].txt) {
						self.animateCaption ();
					}
					if (self.autoPlaying){	
						self.startDelayTimer();
					}
				}						
			});				
		},
		
		
		
		//Transition 3: Slide In
		//////////////////////////////////////////////////////////////////////////////////////////////
		slideIn : function (){
			var self = this;
			var id = this.slide_sel;
			this.zSort (2,1);
			if (this.slides[id].txt) {
				this.slides[id].cap.hide();
				if (this.sett.caption_float_mode) {				
					this.slides[id].cap.css('left', (this.IE8? this.slides[id].cx : this.slides[id].cx+(100*-this.slide_dir))+'px');	
				}
			}
			if (this.slide_pr1 !== ''){
				if (this.slides[this.slide_pr1].txt) {
					this.textOut();
				}
			}
			this.slide_drg = false;
			this.slide_fin = false;
			var ent = false;
			this.slide_playing = true;							
			this.slides[id].con.stop().clearQueue().show().css({'left': (this.slide_dir<0? this.bW+30 : -this.bW-30)+'px'});			
			if (this.IE8){
				this.slides[id].txt.stop().clearQueue();
				this.slides[id].cap.stop().clearQueue();				
			}
			this.slides[id].con.css(this.shProp, '0px 0px 45px 0px #000000');
			this.slides[id].con.stop().clearQueue().animate({
				'left': '0px'},
				{duration:  self.sett.slide_transition_period+100,		
				easing:'easeInOutQuart',
				complete: function (){				
					self.slide_fin = true;
					if (self.slide_sta)	{
						self.slide_sta = false;
						self.$cont.css('background-image', 'none');
					}		
					if (id == self.slide_sel && self.slides[id].txt) {
						self.animateCaption ();
					}
					if (self.autoPlaying){			
						self.startDelayTimer();
					}
					self.slides[id].con.css(self.shProp, 'none');	
				}				
			});			
		},
		
		
		
		//Transition 4: Slide Out
		//////////////////////////////////////////////////////////////////////////////////////////////
		slideOut : function (){
			var self = this;
			var id = this.slide_sel;
			this.zSort (1,2);
			if (this.slides[id].txt) {
				this.slides[id].cap.hide();
				if (this.sett.caption_float_mode) {				
					this.slides[id].cap.css('left', (this.IE8? this.slides[id].cx : this.slides[id].cx+(100*-this.slide_dir))+'px');	
				}
			}
			if (this.slide_pr1 !== ''){
				if (this.slides[this.slide_pr1].txt) {
					this.textOut();
				}
			}
			this.slide_drg = false;
			this.slide_fin = false;
			var ent = false;
			this.slide_playing = true;					
			if (this.slide_pr1 !== '') {				
				this.slides[id].con.stop().clearQueue().show().css({'left': '0px'});
				if (this.IE8){
					this.slides[this.slide_pr1].txt.stop().clearQueue();
					this.slides[this.slide_pr1].cap.stop().clearQueue();					
				}
				this.slides[id].con.css(this.shProp, '0px 0px 45px 0px #000000');
				this.slides[this.slide_pr1].con.stop().clearQueue().animate({
					'left': this.slide_dir*(this.bW+30)},
					{duration:  self.sett.slide_transition_period,				
					easing:'easeInOutQuart',
					complete: function (){					
						self.slide_fin = true;	
						if (self.slide_sta)	{
							self.slide_sta = false;
							self.$cont.css('background-image', 'none');
						}	
						if (id == self.slide_sel && self.slides[id].txt) {
							self.animateCaption ();
						}
						if (self.autoPlaying){			
							self.startDelayTimer();
						}
						self.slides[self.slide_pr1].con.css(self.shProp, 'none');	
									
					}					
				});	
			} else {	
				this.slides[id].con.stop().show().clearQueue().css({'left': this.bW+'px'}).animate({
					'left': '0px'},
					{duration:  self.sett.slide_transition_period,				
					easing:'easeInOutQuart',
					complete: function (){					
						self.slide_fin = true;		
						if (id == self.slide_sel && self.slides[id].txt) {
							self.animateCaption ();
						}
						if (self.autoPlaying){			
							self.startDelayTimer();
						}
					}					
				});					
			}
		}
		
	} //End - TBMain.prototype	

    $.fn.TransBanner = function(options) {
        return this.each(function() {
			var banner = $(this);
			if (!banner.data('TransBanner')) {
				banner.data('TransBanner',  new TBMain(banner, options));				
			} 
        });
    };	
	
}) (jQuery);

/* Below is Mario Klingemann's Superfast Blur

Superfast Blur - a fast Box Blur For Canvas

Version: 	0.5
Author:		Mario Klingemann
Contact: 	mario@quasimondo.com
Website:	http://www.quasimondo.com/BoxBlurForCanvas
Twitter:	@quasimondo

In case you find this class useful - especially in commercial projects -
I am not totally unhappy for a small donation to my PayPal account
mario@quasimondo.de

Or support me on flattr:
https://flattr.com/thing/140066/Superfast-Blur-a-pretty-fast-Box-Blur-Effect-for-CanvasJavascript

Copyright (c) 2011 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/
var mul_table = [ 1,57,41,21,203,34,97,73,227,91,149,62,105,45,39,137,241,107,3,173,39,71,65,238,219,101,187,87,81,151,141,133,249,117,221,209,197,187,177,169,5,153,73,139,133,127,243,233,223,107,103,99,191,23,177,171,165,159,77,149,9,139,135,131,253,245,119,231,224,109,211,103,25,195,189,23,45,175,171,83,81,79,155,151,147,9,141,137,67,131,129,251,123,30,235,115,113,221,217,53,13,51,50,49,193,189,185,91,179,175,43,169,83,163,5,79,155,19,75,147,145,143,35,69,17,67,33,65,255,251,247,243,239,59,29,229,113,111,219,27,213,105,207,51,201,199,49,193,191,47,93,183,181,179,11,87,43,85,167,165,163,161,159,157,155,77,19,75,37,73,145,143,141,35,138,137,135,67,33,131,129,255,63,250,247,61,121,239,237,117,29,229,227,225,111,55,109,216,213,211,209,207,205,203,201,199,197,195,193,48,190,47,93,185,183,181,179,178,176,175,173,171,85,21,167,165,41,163,161,5,79,157,78,154,153,19,75,149,74,147,73,144,143,71,141,140,139,137,17,135,134,133,66,131,65,129,1];
        
   
var shg_table = [0,9,10,10,14,12,14,14,16,15,16,15,16,15,15,17,18,17,12,18,16,17,17,19,19,18,19,18,18,19,19,19,20,19,20,20,20,20,20,20,15,20,19,20,20,20,21,21,21,20,20,20,21,18,21,21,21,21,20,21,17,21,21,21,22,22,21,22,22,21,22,21,19,22,22,19,20,22,22,21,21,21,22,22,22,18,22,22,21,22,22,23,22,20,23,22,22,23,23,21,19,21,21,21,23,23,23,22,23,23,21,23,22,23,18,22,23,20,22,23,23,23,21,22,20,22,21,22,24,24,24,24,24,22,21,24,23,23,24,21,24,23,24,22,24,24,22,24,24,22,23,24,24,24,20,23,22,23,24,24,24,24,24,24,24,23,21,23,22,23,24,24,24,22,24,24,24,23,22,24,24,25,23,25,25,23,24,25,25,24,22,25,25,25,24,23,24,25,25,25,25,25,25,25,25,25,25,25,25,23,25,23,24,25,25,25,25,25,25,25,25,25,24,22,25,25,23,25,25,20,24,25,24,25,25,22,24,25,24,25,24,25,25,24,25,25,25,25,22,25,25,25,24,25,24,25,18];


		
function boxBlurImage(img, left, top, imgW, imgH, canvas, radius, blurAlphaChannel, iterations ){
	
 	//var img = document.getElementById( imageID );
	//var w = img.naturalWidth;
    //var h = img.naturalHeight;
	
	var w = imgW;
    var h = imgH;
       
	//var canvas = document.getElementById( canvasID );
      
    canvas.style.width  = w + "px";
    canvas.style.height = h + "px";
    canvas.width = w;
    canvas.height = h;
    
    var context = canvas.getContext("2d");
    context.clearRect( 0, 0, w, h );
	
   	context.drawImage( img, -left, -top );
	

	if ( isNaN(radius) || radius < 1 ) return;
	
	boxBlurCanvasRGB( canvas, 0, 0, w, h, radius, iterations );
	
	context.restore();
	
}


function boxBlurCanvasRGB( canvas, top_x, top_y, width, height, radius, iterations ){
	if ( isNaN(radius) || radius < 1 ) return;
	
	radius |= 0;
	
	if ( isNaN(iterations) ) iterations = 1;
	iterations |= 0;
	if ( iterations > 3 ) iterations = 3;
	if ( iterations < 1 ) iterations = 1;
	
	//var canvas  = document.getElementById( id );
	var context = canvas.getContext("2d");

	var imageData;
	
	try {
	  try {
		imageData = context.getImageData( top_x, top_y, width, height );
	  } catch(e) {
	  
		// NOTE: this part is supposedly only needed if you want to work with local files
		// so it might be okay to remove the whole try/catch block and just use
		// imageData = context.getImageData( top_x, top_y, width, height );
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
			imageData = context.getImageData( top_x, top_y, width, height );
		} catch(e) {
			
			//throw new Error("unable to access local image data: " + e);
			return;
		}
	  }
	} catch(e) {
		
	 	// throw new Error("unable to access image data: " + e);
	  return;
	}
			
	var pixels = imageData.data;
		
	var rsum,gsum,bsum,asum,x,y,i,p,p1,p2,yp,yi,yw,idx;		
	var wm = width - 1;
  	var hm = height - 1;
    var wh = width * height;
	var rad1 = radius + 1;
   
	var r = [];
    var g = [];
    var b = [];
	
	var mul_sum = mul_table[radius];
	var shg_sum = shg_table[radius];
	
	var vmin = [];
	var vmax = [];
  
	while ( iterations-- > 0 ){
		yw = yi = 0;
	 
		for ( y=0; y < height; y++ ){
			rsum = pixels[yw]   * rad1;
			gsum = pixels[yw+1] * rad1;
			bsum = pixels[yw+2] * rad1;
			
			for( i = 1; i <= radius; i++ ){
				p = yw + (((i > wm ? wm : i )) << 2 );
				rsum += pixels[p++];
				gsum += pixels[p++];
				bsum += pixels[p++];
			}
			
			for ( x = 0; x < width; x++ ){
				r[yi] = rsum;
				g[yi] = gsum;
				b[yi] = bsum;
				
				if( y==0) {
					vmin[x] = ( ( p = x + rad1) < wm ? p : wm ) << 2;
					vmax[x] = ( ( p = x - radius) > 0 ? p << 2 : 0 );
				} 
				
				p1 = yw + vmin[x];
				p2 = yw + vmax[x];
				  
				rsum += pixels[p1++] - pixels[p2++];
				gsum += pixels[p1++] - pixels[p2++];
				bsum += pixels[p1++] - pixels[p2++];
				 
				yi++;
			}
			yw += ( width << 2 );
		}
	  
		for ( x = 0; x < width; x++ ){
			yp = x;
			rsum = r[yp] * rad1;
			gsum = g[yp] * rad1;
			bsum = b[yp] * rad1;
				
			for( i = 1; i <= radius; i++ ){
			  yp += ( i > hm ? 0 : width );
			  rsum += r[yp];
			  gsum += g[yp];
			  bsum += b[yp];
			}
			
			yi = x << 2;
			for ( y = 0; y < height; y++){
				pixels[yi]   = (rsum * mul_sum) >>> shg_sum;
				pixels[yi+1] = (gsum * mul_sum) >>> shg_sum;
				pixels[yi+2] = (bsum * mul_sum) >>> shg_sum;
		   
				if( x == 0 ) {
					vmin[y] = ( ( p = y + rad1) < hm ? p : hm ) * width;
					vmax[y] = ( ( p = y - radius) > 0 ? p * width : 0 );
				} 
				  
				p1 = x + vmin[y];
				p2 = x + vmax[y];

				rsum += r[p1] - r[p2];
				gsum += g[p1] - g[p2];
				bsum += b[p1] - b[p2];
				  
				yi += width << 2;
			}
		}
	}
	context.putImageData( imageData, top_x, top_y );	
}