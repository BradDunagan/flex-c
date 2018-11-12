/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React		from 'react';

import ButtonBar	from './button-bar';
import Split 		from 'split.js'

let contentId = 0;

// Helper function determines which prefixes of CSS calc we need.
// We only need to do this once on startup, when this anonymous function is called.
//
// Tests -webkit, -moz and -o prefixes. Modified from StackOverflow:
// http://stackoverflow.com/questions/16625140/js-feature-detection-to-detect-the-usage-of-webkit-calc-over-calc/16625167#16625167
const calc = `${['', '-webkit-', '-moz-', '-o-']
	.filter(prefix => {
		const el = document.createElement('div')
		el.style.cssText = `width:${prefix}calc(9px)`
		return !!el.style.length
	})
	.shift()}calc`
	

class PEFrameContent extends React.Component {
	constructor ( props ) {
		super ( props );
		if ( props.eleId ) {
			this.eleId = props.eleId;
		} else {
			this.eleId = 'pe-frame-' + props.peId + '-content';
		}
		if ( props.class ) {
			this.class = props.class;
		} else {
			this.class = 'rr-pe-frame-content';
		}
		this.splitHorz 			= this.splitHorz.bind ( this );
		this.myElementStyleFnc	= this.myElementStyleFnc.bind ( this );
		this.splitDrag			= this.splitDrag.bind ( this );
		this.splitPrep			= this.splitPrep.bind ( this );
		this.splitHorz2			= this.splitHorz2.bind ( this );
		this.splitVert2			= this.splitVert2.bind ( this );
		this.doAll 				= this.doAll.bind ( this );

		if ( ! props.parentFnc ) {
			props.frameFnc ( { do:  'set-call-down',
							   to:  'PEFrameContent',
							   fnc: this.doAll } );
		};

		this.state = {
			style: {
			//	flexDirection: 		'row'
			},

			containerStyle:	null,
			containerH0: 	0,
		//	conatinerEle:	null,
			splitHorz: 		null,
			splitVert:		null
		};

	//	this.width = 0;
		this.buttonBarFnc = null;
	}	//  constructor()

	//	Data associated with any element.  Keys are the elements' id.
	eleData = {};

	splitHorz ( o ) {
		let sW = 'splitHorz()';
		console.log ( 'Frame ' + sW );

		function createSplitPanelElement ( eleId ) {
			let sW = 'createSplitPanelElement()';
			console.log ( sW );
			//	That is, create a panel that is on either side of a spliter (i.e.,
			//	a slider/gutter). This element itself is not split.
			let ele = document.createElement ( 'div' );
			ele.id = eleId;
			ele.classList.value = 'split split-horizontal content';
			return ele;
		}	//	createSplitPanelElement()
		
		//  Get the panel element
		let pe = document.getElementById ( this.eleId );

		//  Copy the current contents of the panel.
		let pet = pe.textContent.trim()
		let pec = Array.from ( pe.children );

		//  Delete the current contents.
		pe.textContent = '';
		
	//	//	Panel is just sizeable now (no content). Set class to sizeable.
	//	//	And Fix the size because making it without content might have 
	//	//	removed some padding.
	//	let ow = pe.offsetWidth;
	//	let oh = pe.offsetHeight;
	//	pe.style.width  = (Number.parseInt ( pe.style.width )  + (ow - pe.offsetWidth )).toString() + 'px';
	//	pe.style.height = (Number.parseInt ( pe.style.height ) + (oh - pe.offsetHeight)).toString() + 'px';

		//	Create three <div>s in the panel.
		let lft = createSplitPanelElement ( 'left' );
		pe.appendChild ( lft );
		let rgt = createSplitPanelElement ( 'right' );
		pe.appendChild ( rgt );
		
		//  Put the copied contents in the left <div>.
		lft.textContent = pet;
		pec.forEach ( e => lft.appendChild ( e ) );

		//	Split -
		let opts = {
			gutterSize: 6,
			minSize: 	20,
			snapOffset: 5,
			cursor: 	'col-resize'
		};
		let d = this.eleData[pe.id];
		if ( d && d.split && d.split.sizes )
			opts.sizes = d.split.sizes;
		let split = Split ( ['#left', '#right'], opts );

		//	Set the background color of the parent - it will show through
		//	on the gutter.
//		pe.style.backgroundColor = 'lightgrey';

		//	Some content in the right side panel.
		rgt.textContent = 'side panel';

		//	Remember the split instance.
		if ( ! this.eleData[pe.id] )
			this.eleData[pe.id] = {};
		this.eleData[pe.id].split = { instance: split };

	//	this.setState ( { style: { flexDirection: 	'row',
	//							   backgroundColor:	'lightgray' } } );
		this.setState ( { style: { backgroundColor:	'lightgray' } } );
	}	//	splitHorz()

	myElementStyleFnc ( dim, size, gutSize ) {
		const sW = 'myElementStyleFnc()';
	//	console.log ( sW + '  dim: ' + dim + '  size: ' + size );
		// Helper function checks if its argument is a string-like type
		function isString ( v ) {
			return (typeof v === 'string') || (v instanceof String);
		} 

		const style = {};
		if ( ! isString ( size ) ) {
				style[dim] = `${calc}(${size}% - ${gutSize}px)`;
		} else {
			style[dim] = size;
		}
		return style;
	}	//	myElementStyleFnc()

	splitDrag() {
		const sW = 'splitDrag()';
		let sizes = this.eleData[this.eleId].split.instance.getSizes();
	//	console.log ( sW + '  sizes: ' + sizes );
		if ( ! this.props.parentFnc ) {
			this.props.frameFnc ( { do: 	'content-split-drag',
									sizes: 	sizes } );
		}
	}	//	splitDrag()

	splitPrep ( o ) {
		let sp = {};

		//  Get the panel element
		sp.pe = document.getElementById ( this.eleId );

		//  Copy the current contents of the panel.
		sp.pet = sp.pe.textContent.trim()
		sp.pec = Array.from ( sp.pe.children );

		//  Delete the current contents.
		sp.pe.textContent = '';

		return sp;
	}	//	splitPrep()

	splitHorz2 ( o ) {
		let sW = 'splitHorz2()';
		console.log ( 'Frame ' + sW );

		//  Get the panel element
		let pe = document.getElementById ( this.eleId );
	//	this.width = pe.offsetWidth;

		//  Copy the current contents of the panel.
		let pet = pe.textContent.trim()
		let pec = Array.from ( pe.children );

		//  Delete the current contents.
		pe.textContent = '';
		
		this.setState ( { 
			style: { 
			//	flexDirection: 		'row',
				backgroundColor:	'lightgray' }, 
			splitHorz: { 
			//	d: 	this.eleData[this.eleId],
				left: {
					eleId: 		this.eleId + '-' + ++contentId,
					class: 		'split split-horizontal content',
					pet: 		pet,
					pec: 		pec,
				},
				right: {
					eleId: 		this.eleId + '-' + ++contentId,
					class: 		'split split-horizontal content',	
				},
				opts: {
					direction:		'horizontal',
					gutterSize: 	6,
					minSize: 		20,
					snapOffset: 	5,
					cursor: 		'col-resize',
					elementStyle:	this.myElementStyleFnc,
					onDrag:			this.splitDrag
				},
				incomplete: 	true }
		} );
	}	//	splitHorz2()

	splitVert2 ( o ) {
		let sW = 'splitVert2()';
		console.log ( 'Frame ' + sW );

		let sp = this.splitPrep ( o );
		
		this.setState ( { 
			style: { 
				flexDirection: 		'column',
				backgroundColor:	'lightgray' }, 
			containerStyle: {
				width:		'100%',
				height:		sp.pe.offsetHeight + 'px' },
			splitVert: { 
		//	d: 	this.eleData[this.eleId],
				top: {
					eleId: 		this.eleId + '-' + ++contentId,
					class: 		'split split-vertical content',
					pet: 		sp.pet,
					pec: 		sp.pec,
				},
				bottom: {
					eleId: 		this.eleId + '-' + ++contentId,
					class: 		'split split-vertical content',	
				},
				opts: {
					direction:		'vertical',
					gutterSize: 	6,
					minSize: 		20,
					snapOffset: 	5,
					cursor: 		'row-resize',
					elementStyle:	this.myElementStyleFnc,
					onDrag:			this.splitDrag
				},
				incomplete: 	true, }
		} );

	}	//	splitVert2()

	doAll ( o ) {
		if ( o.do === 'button-bar-call-down' ) {
			this.buttonBarFnc = o.buttonBarFnc;
			return;
		}
		if ( o.do === 'split-horz' ) {
		//	this.splitHorz ( o );
			this.splitHorz2 ( o );
			return;
		}
		if ( o.do === 'split-vert' ) {
			if ( o.contentId ) {
				//	How to find the content to split?

				return;
			}
			this.splitVert2 ( o );
			return;
		}
		if ( o.do == 'size-start' ) {
			let cs = this.state.containerStyle;
			if ( cs ) {
				this.containerH0 = Number.parseInt ( cs.height ); }
			return;
		}
		if ( o.do === 'size' ) {
			let cs = this.state.containerStyle;
			if ( cs ) {
				this.setState ( { containerStyle: { 
					width: '100%', 
					height: (this.containerH0 + o.dY) + 'px' } } ); }
		//	this.width += o.dX;

			return;
		}
	}   //  doAll()

	render() {
		/*
		return (
			<div id 		= { this.eleId }
				 className 	= 'rr-pe-frame-content'
				 style 		= { this.state.style } >
			</div>
		);
		*/
		//	When split horizontally - For example -
		if ( this.state.splitHorz ) {
			console.log ( 'PEFrameContent render() this.state.splitHorz )' );
			let lft = this.state.splitHorz.left;
			let rgt = this.state.splitHorz.right;
			return (
				<div id 		= { this.eleId }
					 className 	= { this.class }
					 style 		= { this.state.style } >
					<PEFrameContent eleId 		= { lft.eleId }
									class 		= { lft.class }
									peId 		= { this.props.peId }
									frameFnc	= { this.props.frameFnc } 
									parentFnc 	= { this.doAll } />
					<PEFrameContent eleId 		= { rgt.eleId } 
									class 		= { rgt.class }
									peId 		= { this.props.peId }
									frameFnc	= { this.props.frameFnc } 
									parentFnc 	= { this.doAll } />
				</div>
			); }

		if ( this.state.splitVert ) {
			console.log ( 'PEFrameContent render() this.state.splitVert )' );
			let sv = this.state.splitVert;
			let top = sv.top;
			let bot = sv.bottom;
			return (
				<div id 		= { this.eleId }
					 className 	= { this.class }
					 style 		= { this.state.style } >
					<div style = { this.state.containerStyle } >
						<PEFrameContent eleId 		= { top.eleId }
										class 		= { top.class }
										peId 		= { this.props.peId }
										frameFnc	= { this.props.frameFnc } 
										parentFnc 	= { this.doAll } />
						<PEFrameContent eleId 		= { bot.eleId } 
										class 		= { bot.class }
										peId 		= { this.props.peId }
										frameFnc	= { this.props.frameFnc } 
										parentFnc 	= { this.doAll } />
					</div>
				</div>
			); }

		if ( this.props.parentFnc ) {
			console.log ( 'PEFrameContent render() this.props.parentFnc )' );
			return (
				<div id 		= { this.eleId }
					 className 	= { this.class }
					 style 		= { this.state.style } >
					<ButtonBar contentEleId	= { this.eleId }
							   contentFnc	= { this.doAll } />
				</div>
			); }
		
		console.log ( 'PEFrameContent render()' );
		return (
			<div id 		= { this.eleId }
				 className 	= { this.class }
				 style 		= { this.state.style } >
				{ this.state.contentElements }
			</div>
		);
		/*
		return (
			<div id 		= { this.eleId }
				 className 	= { this.class }
				 style 		= { this.state.style } >
				<ButtonBar contentEleId	= { this.eleId }
						   contentFnc	= { this.doAll } />
			</div>
		);
		*/
	}   //  render()

	componentDidUpdate() {
		let sh = this.state.splitHorz;
		if ( sh && sh.incomplete ) {
			let pe = document.getElementById ( this.eleId );

			//  Put the copied contents in the left <div>.
			let lft = document.getElementById ( sh.left.eleId );
		//	lft.textContent = sh.left.pet;							Do not destroy button bar.
			sh.left.pec.forEach ( e => lft.appendChild ( e ) );

			//	Some content in the right side panel.
			let rgt = document.getElementById ( sh.right.eleId );
		//	rgt.textContent = 'side panel';							Do not destroy button bar.

			//	Add the gutter <div>.
			let d = this.eleData[pe.id];
			if ( d && d.split && d.split.sizes )
				sh.opts.sizes = d.split.sizes;
			let split = Split ( ['#' + sh.left.eleId, 
								 '#' + sh.right.eleId], 
								sh.opts );

			//	Remember the split instance.
			if ( ! this.eleData[pe.id] )
				this.eleData[pe.id] = {};
			this.eleData[pe.id].split = { instance: split };

			sh.incomplete = false

			if ( ! this.props.parentFnc ) {
				this.props.frameFnc ( { 
					do: 		'content-split-horz',
					sizes:		split.getSizes(),
					sides:		[sh.left.eleId, sh.right.eleId],
					sideFncs: 	[] } );
			}
		}
		let sv = this.state.splitVert;
		if ( sv && sv.incomplete ) {
			let pe = document.getElementById ( this.eleId );

			//  Put the copied contents in the top <div>.
			let top = document.getElementById ( sv.top.eleId );
			top.textContent = sv.top.pet;
			sv.top.pec.forEach ( e => top.appendChild ( e ) );

			//	Some content in the bottom side panel.
			let bot = document.getElementById ( sv.bottom.eleId );
			bot.textContent = 'lower panel';

			//	Add the gutter <div>.
			let d = this.eleData[pe.id];
			if ( d && d.split && d.split.sizes )
				sv.opts.sizes = d.split.sizes;
			let split = Split ( ['#' + sv.top.eleId, 
								 '#' + sv.bottom.eleId], 
								sv.opts );

			//	Remember the split instance.
			if ( ! this.eleData[pe.id] )
				this.eleData[pe.id] = {};
			this.eleData[pe.id].split = { instance: split };

			sv.incomplete = false
		}
	}	//	componentDidUpdate()

}   //  class PEFrameContent

export { PEFrameContent as default };
