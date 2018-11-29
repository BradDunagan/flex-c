
let diags = [];

let curTag = 0;

let diagEnabled = false;
let tagsEnabled = [1, 2];

function diag ( ta, s ) {
	if ( ! diagEnabled ) {
		return; }
	if ( ta.length > 0 ) {
		if ( ta.indexOf ( curTag ) < 0 ) {
        return; }
	}
//	diags.push ( s );
	console.log ( s );
}

function diagsFlush() {
	diags = [];
}

function diagsPrint ( tag, delay ) {
	if ( tagsEnabled.indexOf ( tag ) < 0 ) {
		return;	}
	diagEnabled = true;
	curTag = tag;
	console.groupCollapsed ( curTag );
	window.setTimeout ( () => {
		const len = diags.length;
		let i;
		for ( i = 0; i < len; i++ ) {
			console.log ( diags[i] ); }
		console.groupEnd();
		diagEnabled = false;
	}, delay );
}   //  diagsPrint()

export { diag, diagsFlush, diagsPrint };
