import * as FMSynth from './fmsynth.js';
import {$C,$H,px,css} from './core.js';
import {display} from './synthcontrol.js';


$('head').append($($C.html.style($C.css.stylesheet({
	'#fmControl':{
		border:$C.css.template.border(1, '#ffe'),
		width:px(300),
		height:px(200),
		padding:px(3),
		margin:px(10)
	}
}))));

const sampleValues = [
	[0, 0],
	[0, 4],
	[0, 7],
	[1, 0],
	[1, 2],
	[2, 7]
]

$('body').append($($H.markup(
	$H.p('Bessel function sample values:'),
	$H.table({border:1, cellspacing:0, cellpadding:3},
		$H.tr($H.th('K'), $H.th('I'), $H.th('J',$C.html.sub('k'),'(I)')),
		$H.apply(sampleValues, ([k, i])=>$H.tr(
			$H.td(k), $H.td(i), $H.td(FMSynth.bessel(k,i))
		))
	)
)));

const spectrum = FMSynth.spectrum(1, 2, 4);

$('body').append($($H.markup(
	$H.p('Spectrum for c:1, m:2, I:4'),
	$H.table({border:1, cellspacing:0, cellpadding:3},
		$H.tr($H.th('F'), $H.th('A')),
		$H.apply(spectrum, ({f, a})=>$H.tr(
			$H.td(f), $H.td(a)
		))
	)
)));

$('body').append($($H.div($C.html.svg({id:'fmControl'}))));

display('#fmControl', spectrum);
