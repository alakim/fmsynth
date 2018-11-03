import * as FMSynth from './fmsynth.js';
import {$C,$H} from './core.js';


const sampleValues = [
	[0, 0],
	[0, 4],
	[0, 7],
	[1, 0],
	[1, 2],
	[2, 7]
]

const tbl = $($H.markup(
	$H.p('Bessel function sample values:'),
	$H.table({border:1, cellspacing:0, cellpadding:3},
		$H.tr($H.th('K'), $H.th('I'), $H.th('J',$C.html.sub('k'),'(I)')),
		$H.apply(sampleValues, ([k, i])=>$H.tr(
			$H.td(k), $H.td(i), $H.td(FMSynth.bessel(k,i))
		))
	)
));

$('body').append(tbl);
