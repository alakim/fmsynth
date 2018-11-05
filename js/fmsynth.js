export function bessel(k, I){
	return BESSEL.besselj(I, k);
}

export function spectrum(c, m, I){
	const byF = (a,b)=>Math.sign(a.f-b.f);

	const s1 = [];
	for(let k=0; k<=I+2; k++){
		const J = bessel(k, I);
		s1.push({f:c+k*m, a:J});
		if(k!=0)s1.push({f:c-k*m,
			a:J*(k%2?-1:1)
		});
	}

	const mm = new Map();
	for(let x,i=0; x=s1[i],i<s1.length; i++){
		const f = x.f<0?-x.f:x.f;
		const a = x.f<0?-x.a:x.a;
		if(mm.has(f)){
			mm.set(f, mm.get(f)+a);
		}
		else mm.set(f, a);
	}

	return Array
		.from(mm.entries())
		.map(x=>({f:x[0], a:Math.abs(x[1])}))
		.sort(byF)
	;
}
