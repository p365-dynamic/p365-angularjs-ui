window.requestAnimationFrame = window.requestAnimationFrame
                               || window.mozRequestAnimationFrame
                               || window.webkitRequestAnimationFrame
                               || window.msRequestAnimationFrame
                               || function(f){return setTimeout(f, 1000/60)}

window.cancelAnimationFrame = window.cancelAnimationFrame
                              || window.mozCancelAnimationFrame
                              || function(requestID){clearTimeout(requestID)} //fall back

function scrollable(setting){

	var defaults = {
		orient: 'vertical',
		moveby: 5,
		mousedrag: false
	}

	var $ = jQuery
	var s = $.extend({}, defaults, setting)
	var touchenabled = 'ontouchstart' in window || navigator.msMaxTouchPoints
	var $outer = $('#' + s.wrapperid)
	var $belt = $outer.find('div.belt')
	var curpos, bounds
	var outerwidth, beltwidth, outerheight, beltheight
	var moveRequest, updateDimensionsBoundsRequest
	var thisint = this

	this.getDimensionsAndBounds = function(orient){
		if (orient == 'vertical'){
			outerheight = $outer.height()
			beltheight = $belt.outerHeight()
			bounds = [outerheight-beltheight, 0]
		}
		else{
			outerwidth = $outer.width()
			beltwidth = $belt.outerWidth()
			bounds = [outerwidth-beltwidth, 0]
		}
	}

	this.scrollContent = function(dir){
		this.stopScroll()
		var moveby = (dir == 'down' || dir =='right')? -s.moveby :s.moveby
		function movecontent(){
			curpos = parseInt($belt.css( (s.orient == 'vertical')? 'top' : 'left' ))
			if (dir == 'down' && curpos > bounds[0]){
				$belt.css('top', Math.max(curpos + moveby, bounds[0]))
				moveRequest = requestAnimationFrame(movecontent)
			}
			else if (dir == 'up' && curpos < bounds[1]){
				$belt.css('top', Math.min(curpos + moveby, bounds[1]))
				moveRequest = requestAnimationFrame(movecontent)
			}
			else if (dir == 'right' && curpos > bounds[0]){
				$belt.css('left', Math.max(curpos + moveby, bounds[0]))
				moveRequest = requestAnimationFrame(movecontent)
			}
			else if (dir == 'left' && curpos < bounds[1]){
				$belt.css('left', Math.min(curpos + moveby, bounds[1]))
				moveRequest = requestAnimationFrame(movecontent)
			}
		}
		moveRequest = requestAnimationFrame(movecontent)
	}

	this.stopScroll = function(){
		cancelAnimationFrame(moveRequest)
	}

	var disabletextselect = function(){
		if ( /(MSIE)|(Trident)/i.test(navigator.userAgent) ){ // test for IE browsers
			$belt.on('selectstart', function() { return false; })
		}
		else{
			$outer.on('mousedown', function(e){e.preventDefault()})
			$outer.on('mouseup', function(e){return true})
		}
	}


	this.getDimensionsAndBounds(s.orient)

	if ($belt.length == 1 && (touchenabled || s.mousedrag)){
		if (s.orient == 'vertical'){
			var myImpetus = new Impetus({
			    source: $belt.get(0),
					boundY: bounds,
			    update: function(x, y) {
						$belt.css('top', y + 'px')
						curpos = y
			    }
			})
		}
		else{
			var myImpetus = new Impetus({
			    source: $belt.get(0),
					boundX: bounds,
			    update: function(x, y) {
						$belt.css('left', x + 'px')
						curpos = x
			    }
			})
		}
	
		$belt.on('mousedown touchstart', function(e){ // update cur x and y pos inside myImpetus upon touch of scrollable, as x and y may have changed by calling scrollContent()
			var x = (s.orient == 'vertical')? 0 : curpos
			var y = (s.orient == 'vertical')? curpos : 0
			myImpetus.setValues(x, y)
			thisint.stopScroll()
		})
		disabletextselect()
	}

	$(window).on('load resize', function(){
		clearTimeout(updateDimensionsBoundsRequest)
		updateDimensionsBoundsRequest = setTimeout(function(){
			thisint.getDimensionsAndBounds(s.orient)
			var boundtype = (s.orient == 'vertical')? 'y': 'x'
			if (typeof myImpetus !='undefined')
				myImpetus.setBounds(bounds[0], bounds[1], boundtype)
		}, 200)
	})

}