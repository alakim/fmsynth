import {$S} from './core.js';
import * as FMSynth from './fmsynth.js';

const Vector = (function(){
	function Vector(x, y){
		switch(arguments.length){
			case 2: this.x = x; this.y = y; break;
			case 1: if(x instanceof Array){this.x = x[0]; this.y = x[1];}
					else if(x instanceof Vector){this.x = x.x; this.y = x.y}
				break;
			default: this.x = 0; this.y = 0; break;
		}
		if(arguments.length==2){this.x = x; this.y = y;}
	}
	$.extend(Vector, {
		scalarProd: function(v1, v2){return v1.x*v2.x + v1.y*v2.y;}
	});
	$.extend(Vector.prototype, {
		Add: function(x, y){
			if(x instanceof Array){this.x+=x[0]; this.y+=x[1];}
			else if(x instanceof Vector){this.x+=x.x; this.y+=x.y;}
			else{this.x+=x; this.y+=y;}
			return this;
		},
		add: function(x, y){return (new Vector(this)).Add(x, y);},
		Mul: function(rate){
			if(rate instanceof Vector){
				this.x*=rate.x; this.y*=rate.y;
			}
			else {
				this.x*=rate;this.y*=rate;
			}
			return this;
		},
		mul: function(rate){return (new Vector(this)).Mul(rate);},
		Norm: function(){const _=this;
			const lng = Math.sqrt(_.x*_.x+_.y*_.y);
			return _.Mul(1/lng);
		},
		norm: function(){
			return (new Vector(this)).Norm();
		},
		getAngle: function(degreeMode){
			degreeMode = degreeMode==null?true:degreeMode;
			const angle = Math.atan2(this.y, this.x);
			return degreeMode?angle/Math.PI*180:angle;
		},
		getLength: function(){return Math.sqrt(this.x*this.x + this.y*this.y);},
		getPolar: function(degreeMode){
			degreeMode = degreeMode==null?true:degreeMode;
			return {
				mod:this.getLength(), 
				angle:this.getAngle(degreeMode)
			};
		},
		Set: function(x, y){
			if(arguments.length==1){
				if(x instanceof Array){this.x = x[0]; this.y = x[1];}
				else if(x instanceof Vector){this.x = x.x; this.y = x.y}
			}
			else{
				this.x = x; this.y = y;
			}
			return this;
		},
		SetPolar: function(mod, angle, degreeMode){
			degreeMode = degreeMode==null?true:degreeMode;
			if(degreeMode) angle = angle/180*Math.PI;
			this.x = Math.cos(angle)*mod;
			this.y = Math.sin(angle)*mod;
			return this;
		},
		toString: function(){
			return "("+[this.x, this.y].join()+")";
		}
	});
	return Vector;
})();

function knob(canvas, pnl, pos, title, range, onchange, defaultValue){
	const btPos = pos;
	const size = 30,
		pos0 = 90,
		marg = 40;
	const panelPos = pnl.offset();

	const drag = {
		start: function(x2, y2, e){
			x2-=panelPos.left; y2-=panelPos.top;
			this.attr({fill:grad2});
			this.data("curPos", new Vector(pos.x, pos.y).Mul(-1).Add(x2, y2));
		},
		move: function(dx, dy, x1, y1, e){
			const pos = this.data("curPos");
			if(!pos) return;
			const pos1 = pos.add(dx, dy);
			
			let angle = pos1.getAngle(true) - pos0 - marg;
			if(angle<0) angle += 360;
			if(angle>320) angle = 0;
			if(angle>360-marg*2) angle = 360-marg*2;
			
			direction.SetPolar(size*.7, angle + pos0 + marg, true);
			marker.attr({cx:btPos.x+direction.x, cy:btPos.y+direction.y});
			const val = (range.mn+(range.mx-range.mn)*angle/(360-marg*2)).toFixed(range.precision);
			label.attr({text:formatLabel(val)});
			onchange(val);
		},
		end: function(e){
			this.attr({fill:grad})
		}
	};

	const grad = "r(0.25, 0.25, 1) #ccc-#888", 
		grad2 = "r(0.25, 0.25, 1) #aaa-#777";

	canvas.circle(pos.x, pos.y, size).attr({fill:grad, cursor:"pointer"}).drag(drag.move, drag.start, drag.end);
	const defAngle = pos0+marg + (360-marg*2)*(defaultValue-range.mn)/(range.mx-range.mn);
	const direction = new Vector().SetPolar(size*.7, /*pos0+marg*/ defAngle, true);
	const marker = canvas.circle(btPos.x+direction.x, btPos.y+direction.y, 3).attr({fill:"#0f0", stroke:0});

	function formatLabel(val){
		return [title.toUpperCase(), ' = ', val].join('');
		
	}
	
	const label = canvas.text(pos.x, pos.y+size+20, formatLabel(defaultValue)).attr({"font-size":12, fill:'#0f0', 'text-anchor':'middle'});

}

export function display(pnl, c, m, I){ pnl = $(pnl);
	//TODO: при перерисовке изменять только график, крутилки не трогать!
	const canvas = $S(pnl[0]);

	const w = pnl.width(), 
		h = pnl.height(),
		padding = 5,
		controlsBarHeight = 100
	;
	const axisAttr = {stroke:'#0f0', strokeWidth:1};
	const dataAttr = {stroke:'#0f0', strokeWidth:3};
	
	canvas.rect(0, 0, w, h).attr({fill:'#000'});

	const x0 = padding, y0 = h - padding - controlsBarHeight,
		xM = w - 2*padding, yM = padding;

	let graph = [];

	function draw(c, m, I){
		for(let e of graph) e.remove();
		graph = [];
		const spectrum = FMSynth.spectrum(c, m, I);

		graph.push(canvas.path(['M', x0, y0, 'L', xM, y0].join(' ')).attr(axisAttr));
		graph.push(canvas.path(['M', x0, y0, 'L', x0, yM].join(' ')).attr(axisAttr));

		const fRange = [spectrum[0].f, spectrum[spectrum.length-1].f + 1];
		const rf = (xM - x0)/fRange[1];
		const ra = (y0 - yM)/1;

		for(let i=0; i<fRange[1]; i++){
			const x = x0 + i*rf;
			graph.push(canvas.path(['M', x, y0, x, y0-5].join(' ')).attr(axisAttr));
		}

		for(let i=0; i<10; i++){
			const y = y0 - i*ra/10;
			graph.push(canvas.path(['M', x0, y, x0+5, y].join(' ')).attr(axisAttr));
		}


		spectrum.forEach((e,i)=>{
			const fx = x0 + rf*e.f,
				fy = y0 - ra*e.a;

			graph.push(canvas.path(['M', fx, y0, 'L', fx, fy].join(' ')).attr(dataAttr));
		});

	}

	knob(canvas, pnl, {x:50, y:h - padding - controlsBarHeight/2}, 'C', {mn:.5, mx:10, precision:1}, function(v){
		$('.tbC').val(v);
		draw(v, m, I);
	}, 1);

	knob(canvas, pnl, {x:150, y:h - padding - controlsBarHeight/2}, 'M', {mn:.5, mx:10, precision:1}, function(v){
		$('.tbM').val(v);
		draw(c, v, I);
	}, 1);

	knob(canvas, pnl, {x:250, y:h - padding - controlsBarHeight/2}, 'I', {mn:.5, mx:20, precision:1}, function(v){
		$('.tbI').val(v);
		draw(c, m, v);
	}, 1);

	draw(c, m, I);
}
