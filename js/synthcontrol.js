import {$S} from './core.js';

export function display(pnl, spectrum){ pnl = $(pnl);
	const canvas = $S(pnl[0]);

	const w = pnl.width(), 
		h = pnl.height(),
		padding = 5
	;
	const axisAttr = {stroke:'#0f0', strokeWidth:1};
	const dataAttr = {stroke:'#0f0', strokeWidth:3};
	
	canvas.rect(0, 0, w, h).attr({fill:'#000'});

	const x0 = padding, y0 = h - padding,
		xM = w - 2*padding, yM = padding;

	canvas.path(['M', x0, y0, 'L', xM, y0].join(' ')).attr(axisAttr);
	canvas.path(['M', x0, y0, 'L', x0, yM].join(' ')).attr(axisAttr);


	// console.log('spectrum:%o', spectrum);

	const fRange = [spectrum[0].f, spectrum[spectrum.length-1].f];
	const rf = (xM - x0)/fRange[1];
	const ra = (y0 - yM)/1;

	spectrum.forEach((e,i)=>{
		const fx = x0 + rf*e.f,
			fy = y0 - ra*e.a;

		canvas.path(['M', fx, y0, 'L', fx, fy].join(' ')).attr(dataAttr);
	});
}
