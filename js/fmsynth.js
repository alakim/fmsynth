export function bessel(k, I){
	return BESSEL.besselj(I, k);
}

export function spectrum(c, m, I){
	const res = [];
	for(let k=0; k<=I+2; k++){
		const J = bessel(k, I);
		res.push({f:c+k*m, a:J});
		if(k!=0)res.push({f:c-k*m,
			a:J*(k%2?-1:1)
		});
	}

	return res.sort((a,b)=>Math.sign(a.f-b.f));
}
