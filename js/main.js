import * as FMSynth from './fmsynth.js';
import {$C,$H,px,css} from './core.js';
import {display} from './synthcontrol.js';


$('head').append($($C.html.style($C.css.stylesheet({
	'#fmControl':{
		border:$C.css.template.border(1, '#ffe'),
		width:px(600),
		height:px(400),
		padding:px(3),
		margin:px(10, 10, 10, 50)
	}
}))));


$('body').append($($H.markup(
	$H.div(
		' c:', $H.input({type:'text', 'class':'tbC', value:1}),
		' m:', $H.input({type:'text', 'class':'tbM', value:2}),
		' I:', $H.input({type:'text', 'class':'tbI', value:4}),
		' ', $H.button({'class':'btDraw'}, 'Draw spectrum')
	),
	$H.div($C.html.svg({id:'fmControl'}))
)));

function draw(){
	const c = parseFloat($('.tbC').val());
	const m = parseFloat($('.tbM').val());
	const I = parseFloat($('.tbI').val());
	display('#fmControl', c, m, I);
}

$('.btDraw').click(draw).end();

draw();

