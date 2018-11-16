/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React		from 'react';

import PaneContent	from './pane-content';
import ButtonBar	from './button-bar';
import Split 		from 'split.js'

let paneId = 0;

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
	

class Pane extends React.Component {
	constructor ( props ) {
		super ( props );
		if ( props.eleId ) {
			this.eleId = props.eleId;
		} else
		if ( props.tabEleId ) {
			this.eleId = 'pe-tab-' + props.tabEleId + '-pane';
		} else {
			this.eleId = 'pe-frame-' + props.peId + '-pane';
		}
		if ( props.class ) {
			this.class = props.class;
		} else {
			this.class = 'pane';
		}
		
		this.contentEleId		= this.eleId + '-content';
		this.buttonBarEleId 	= this.eleId + '-button-bar';

		this.myElementStyleFnc		= this.myElementStyleFnc.bind ( this );
		this.splitDrag				= this.splitDrag.bind ( this );
		this.splitPrep				= this.splitPrep.bind ( this );
		this.splitHorz				= this.splitHorz.bind ( this );
		this.splitVert				= this.splitVert.bind ( this );
		this.sizeStartByTabPage		= this.sizeStartByTabPage.bind ( this );
		this.sizeByTabPage			= this.sizeByTabPage.bind ( this );
		this.propagateDown_SizeOp 	= this.propagateDown_SizeOp.bind ( this );
		this.doAll 					= this.doAll.bind ( this );

		this.sizeButtonBar			= this.sizeButtonBar.bind ( this );

		this.state = {
			style: props.tabEleId ? props.style : {
			//	flexDirection: 		'row'
			},

			containerStyle:	null,
			containerH0: 	0,
		//	conatinerEle:	null,
			splitHorz: 		null,
			splitVert:		null,

			tabs:			props.tabs ? true : false,
		};

	//	this.width = 0;
		this.buttonBarFnc	= null;
		this.tabsFnc 		= null;
	//	this.tabPagesFnc	= null;
		this.tabPanes		= {};		//	keyed by eleId of tab pane
		this.h0				= 0;		//	used when this is on a tab page

		//	If there is a parent pane then false until that parent makes
		//	a calldown with 'set-at-frame-top' specifying possibly otherwise.
	//	this.isAtFrameTop	= props.parentFnc ? false : true;
	}	//  constructor()

	//	Data associated with any element.  Keys are the elements' id.
	eleData = {};

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
		console.log ( sW + '  sizes: ' + sizes );
		if ( ! this.props.parentFnc ) {
			this.props.frameFnc ( { do: 	'content-split-drag',
									sizes: 	sizes } );
		}
		let sh = this.state.splitHorz;
		if ( sh ) {
			if ( sh.left.paneFnc ) {
				sh.left.paneFnc ( { do: 'splitter-dragged' } ); }
			if ( sh.right.paneFnc ) {
				sh.right.paneFnc ( { do: 'splitter-dragged' } ); }
		}
	}	//	splitDrag()

	splitPrep ( o ) {
		let sp = {};

		//  Get the content element
		sp.pe = document.getElementById ( this.contentEleId );

		//  Copy the current contents.
		sp.pet = sp.pe.textContent.trim()
		sp.pec = Array.from ( sp.pe.children );

		//  Delete the current contents.
		sp.pe.textContent = '';

		return sp;
	}	//	splitPrep()

	splitHorz ( o ) {
		let sW = 'splitHorz()';
		console.log ( 'Frame ' + sW );

		if ( this.props.atFrameTop && this.buttonBarFnc ) {
			this.props.frameFnc ( { do: 		'remove-pane-btn-bar',
									bbEleId:	this.buttonBarEleId } );
			this.buttonBarEleId = null; }

		let sp = this.splitPrep ( o );
		
		this.setState ( { 
			style: Object.assign ( { 
				backgroundColor:	'lightgray' },
				this.state.style ), 
			splitHorz: { 
			//	d: 	this.eleData[this.eleId],
				left: {
					eleId: 		this.eleId + '-lft-' + ++paneId,
					class: 		'split split-horizontal pane',
					pet: 		sp.pet,
					pec: 		sp.pec,
					paneFnc: 	null,
				},
				right: {
					eleId: 		this.eleId + '-rgt-' + ++paneId,
					class: 		'split split-horizontal pane',	
					paneFnc: 	null,
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

		this.buttonBarFnc = null;
	}	//	splitHorz()

	splitVert ( o ) {
		let sW = 'splitVert()';
		console.log ( 'Frame ' + sW );

		let sp = this.splitPrep ( o );
		
		this.setState ( { 
			style: Object.assign ( { 
				flexDirection: 		'column',
				backgroundColor:	'lightgray' }, 
				this.state.style ),
			containerStyle: {
				width:		'100%',
				height:		sp.pe.offsetHeight + 'px' },
			splitVert: { 
				top: {
					eleId: 		this.eleId + '-top-' + ++paneId,
					class: 		'split split-vertical pane',
					pet: 		sp.pet,
					pec: 		sp.pec,
					paneFnc: 	null,
				},
				bottom: {
					eleId: 		this.eleId + '-bot-' + ++paneId,
					class: 		'split split-vertical pane',	
					paneFnc: 	null,
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

		this.buttonBarFnc = null;
	}	//	splitVert()

	propagateDown_SizeOp ( o ) {
		let sh = this.state.splitHorz;
		if ( sh ) {
			sh.left.paneFnc ( o );
			sh.right.paneFnc ( o );	}
		let sv = this.state.splitVert;
		if ( sv ) {
			sv.top.paneFnc ( o );
			sv.bottom.paneFnc ( o ); }
	//	if ( this.tabPagesFnc ) {
	//		this.tabPagesFnc ( o ); }
		for ( var eleId in this.tabPanes ) {
			this.tabPanes[eleId].fnc ( o );
		}
	}	//	propagateDown_SizeOp()

	sizeStartByTabPage() {
		let e = document.getElementById ( this.eleId );
		this.h0 = Number.parseInt ( e.style.height );
	}	//	sizeStartByTabPage()

	sizeByTabPage ( o ) {
		let e = document.getElementById ( this.eleId );
		let s = {
			position:	'absolute',
			width:		'100%',
			height:		(this.h0 + o.dY) + 'px' };
		if ( this.state.style.flexDirection ) {
			s.flexDirection = this.state.style.flexDirection; }
		if ( this.state.style.backgroundColor ) {
			s.backgroundColor = this.state.style.backgroundColor; }
		this.setState ( { style: s } );
	}	//	sizeByTabPage()

	doAll ( o ) {
		if ( o.do === 'set-call-down' ) {
			if ( o.to === 'child-pane' ) {
				let sh = this.state.splitHorz;
				if ( sh ) {
					if ( sh.left.eleId === o.childEleId ) {
						sh.left.paneFnc = o.fnc; 
					//	sh.left.paneFnc ( { do:	'set-at-frame-top',
					//					    is:	this.isAtFrameTop } ); 
					}
					if ( sh.right.eleId === o.childEleId ) {
						sh.right.paneFnc = o.fnc; 
					//	sh.right.paneFnc ( { do: 'set-at-frame-top',
					//					     is: this.isAtFrameTop } ); 
					} 
				}
				let sv = this.state.splitVert;
				if ( sv ) {
					if ( sv.top.eleId === o.childEleId ) {
						sv.top.paneFnc = o.fnc; 
					//	sv.top.paneFnc ( { do: 'set-at-frame-top',
					//					   is:  this.isAtFrameTop } ); 
					}
					if ( sv.bottom.eleId === o.childEleId ) {
						sv.bottom.paneFnc = o.fnc; } }
			}
			if ( o.to === 'tabs' ) {
				this.tabsFnc = o.tabsFnc;
			}
		//	if ( o.to === 'tab-pages' ) {
		//		this.tabPagesFnc = o.tabPagesFnc;
		//	}
			if ( o.to === 'tab-pane' ) {
				this.tabPanes[o.tabPaneEleId] = { fnc:	o.tabPaneFnc };
			}
			if ( o.to === 'button-bar' ) {
				this.buttonBarFnc 	= o.bbFnc; 
				this.buttonBarEleId = o.bbEleId;
			}
			return;
		}
	//	if ( o.do === 'button-bar-call-down' ) {
	//		this.buttonBarFnc = o.buttonBarFnc;
	//		return;
	//	}
		if ( o.do === 'split-horz' ) {
			this.splitHorz ( o );
			return;
		}
		if ( o.do === 'split-vert' ) {
			if ( o.paneId ) {
				//	How to find the pane to split?

				return;
			}
			this.splitVert ( o );
			return;
		}
		if ( o.do == 'size-start' ) {
			let cs = this.state.containerStyle;
			if ( cs ) {
				this.containerH0 = Number.parseInt ( cs.height ); }
			if ( this.props.tabEleId ) {
				this.sizeStartByTabPage(); }
			this.propagateDown_SizeOp ( o );
			return;
		}
		if ( o.do === 'size' ) {
			let cs = this.state.containerStyle;
			if ( cs ) {
				this.setState ( { containerStyle: { 
					width: '100%', 
					height: (this.containerH0 + o.dY) + 'px' } } ); }
		//	this.width += o.dX;
			if ( this.props.tabEleId ) {
				this.sizeByTabPage ( o );
				this.sizeButtonBar(); }
			this.propagateDown_SizeOp ( o );
			return;
		}
		if ( o.do === 'splitter-dragged' ) {
			this.sizeButtonBar();
			this.propagateDown_SizeOp ( o );
			return;
		}
		if ( o.do === 'get-state' ) {
			let pe = document.getElementById ( this.eleId );
			let state = Object.assign ( {}, this.state );
			let sh = state.splitHorz;
			if ( sh ) {
				sh.left.contentState = sh.left.paneFnc ( o );
				sh.left.paneFnc = null;
				sh.right.contentState = sh.right.paneFnc ( o );
				sh.right.paneFnc = null;
				sh.opts.elementStyle = null;
				sh.opts.onDrag = null; }
			let sv = state.splitVert;
			if ( sv ) {
				sv.top.contentState = sv.top.paneFnc ( o );
				sv.top.paneFnc = null;
				sv.bottom.contentState = sv.bottom.paneFnc ( o );
				sv.bottom.paneFnc = null;
				sv.opts.elementStyle = null;
				sv.opts.onDrag = null; }
			state.eleData = Object.assign ( {}, this.eleData );
			let d = state.eleData[pe.id];
			if ( d ) {
				d.split.sizes = d.split.instance.getSizes(); }
			return state;
		}
		if ( o.do === 'set-state' ) {
			let lft = null, rgt = null, top = null, bot = null;
			let sh = o.state.splitHorz;
			let sv = o.state.splitVert;
			if ( (! this.parentFnc) && (sh || sv) ) {
				this.props.frameFnc ( { do: 'clear-pane-btn-bars' } ); }
			if ( sh ) {
				sh.opts.elementStyle	= this.myElementStyleFnc;
				sh.opts.onDrag			= this.splitDrag;
				sh.incomplete			= true; }
			if ( sv ) {
				sv.opts.elementStyle	= this.myElementStyleFnc;
				sv.opts.onDrag			= this.splitDrag;
				sv.incomplete			= true; }
			
			this.eleData = Object.assign ( {}, o.state.eleData );
			delete o.state.eleData;
			this.setState ( o.state );
			return;
		}

	//	if ( o.do === 'is-at-frame-top-border' ) {
	//		if ( ! this.parentFnc ) {
	//
	//		}
	//		let sv = o.state.splitVert;
	//		if ( sv ) {
	//		}
	//		let sh = o.state.splitHorz;
	//		if ( sh ) {
	//		}
	//		return false;
	//	}

	//	if ( o.do === 'set-at-frame-top' ) {
	//		this.isAtFrameTop = o.is;
	//		if ( this.isAtFrameTop ) {
	//			//	The button bar for this pane should up in the frame's
	//			//	transient title bar thing.
	//			//	So the button bar element is not a child element of this
	//			//	pane.
	//		}
	//		return;
	//	}
	}   //  doAll()

	render() {
		//	When split horizontally - For example -
		if ( this.state.splitHorz ) {
			console.log ( 'Pane render() this.state.splitHorz )' );
			let lft = this.state.splitHorz.left;
			let rgt = this.state.splitHorz.right;
			return (
				<div id 		= { this.eleId }
					 className 	= { this.class }
					 style 		= { this.state.style } >
					<Pane eleId 		= { lft.eleId }
						  class 		= { lft.class }
						  peId 			= { this.props.peId }
						  frameFnc		= { this.props.frameFnc } 
						  parentFnc 	= { this.doAll } 
						  atFrameTop	= { this.props.atFrameTop } />
					<Pane eleId 		= { rgt.eleId } 
						  class 		= { rgt.class }
						  peId 			= { this.props.peId }
						  frameFnc		= { this.props.frameFnc } 
						  parentFnc 	= { this.doAll } 
						  atFrameTop	= { this.props.atFrameTop } />
				</div>
			); }

		if ( this.state.splitVert ) {
			console.log ( 'Pane render() this.state.splitVert )' );
			let sv = this.state.splitVert;
			let top = sv.top;
			let bot = sv.bottom;
			return (
				<div id 		= { this.eleId }
					 className 	= { this.class }
					 style 		= { this.state.style } >
					<div style = { this.state.containerStyle } >
						<Pane eleId 		= { top.eleId }
							  class 		= { top.class }
							  peId 			= { this.props.peId }
							  frameFnc		= { this.props.frameFnc } 
							  parentFnc 	= { this.doAll } 
							  atFrameTop	= { this.props.atFrameTop } />
						<Pane eleId 		= { bot.eleId } 
							  class 		= { bot.class }
							  peId 			= { this.props.peId }
							  frameFnc		= { this.props.frameFnc } 
							  parentFnc 	= { this.doAll } 
							  atFrameTop	= { false } />
					</div>
				</div>
			); }

		if ( this.props.parentFnc ) {
			console.log ( 'Pane render() this.props.parentFnc )' );
			if ( this.props.atFrameTop ) {
				return (
					<div id 		= { this.eleId }
						 className 	= { this.class }
						 style 		= { this.state.style } >
						<PaneContent eleId 		= { this.contentEleId }
									 peId		= { this.props.peId }
									 paneFnc	= { this.doAll }
									 frameFnc 	= { this.props.frameFnc } />
					</div>
				); }
			else {
				return (
					<div id 		= { this.eleId }
						 className 	= { this.class }
						 style 		= { this.state.style } >
						<PaneContent eleId 		= { this.contentEleId }
									 peId		= { this.props.peId }
									 paneFnc	= { this.doAll }
									 frameFnc 	= { this.props.frameFnc } />
						<ButtonBar eleId			= { this.buttonBarEleId }
								   containerFnc		= { null }
								   paneFnc			= { this.doAll }
								   isForRootPane	= { false } />
					</div>
				); }
			}
		
		if ( this.state.tabs ) {
			return (
				<div id 		= { this.eleId }
					className 	= { this.class }
					style 		= { this.state.style } >
					{ this.state.contentElements }
					<PaneContent eleId 		= { this.contentEleId } 
								 peId		= { this.props.peId }
								 paneFnc	= { this.doAll }
								 frameFnc 	= { this.props.frameFnc }
								 tabs 		= { true } />
				</div>
			);
		}
		console.log ( 'Pane render()' );
		/*
		return (
			<div id 		= { this.eleId }
				 className 	= { this.class }
				 style 		= { this.state.style } >
				{ this.state.contentElements }
				<PaneContent eleId 		= { this.contentEleId } 
							 peId		= { this.props.peId }
							 paneFnc	= { this.doAll }
							 frameFnc 	= { this.props.frameFnc } />
				<ButtonBar eleId		= { this.buttonBarEleId }
						   containerFnc	= { null }
						   paneFnc		= { this.doAll } />
			</div>
		);
		*/
		return (
			<div id 		= { this.eleId }
				 className 	= { this.class }
				 style 		= { this.state.style } >
				{ this.state.contentElements }
				<PaneContent eleId 		= { this.contentEleId } 
							 peId		= { this.props.peId }
							 paneFnc	= { this.doAll }
							 frameFnc 	= { this.props.frameFnc } />
			</div>
		);
	}   //  render()

	sizeButtonBar() {
		if ( ! this.props.atFrameTop ) {
			let e  = document.getElementById ( this.eleId );
			let bb = document.getElementById ( this.buttonBarEleId );
			if ( e && bb ) {
			//	console.log ( 'e && bb' );
				bb.style.width = e.offsetWidth + 'px'; }
		} else {
			if ( this.buttonBarFnc ) {
				let pe = document.getElementById ( this.eleId );
				this.buttonBarFnc ( { do: 		'set-left-and-width',
									  left: 	pe.offsetLeft,
									  width:	pe.offsetWidth } ); }
		}
	}	//	sizeButtonBar()

	componentDidMount() {
		this.sizeButtonBar();

		if ( ! this.props.parentFnc ) {
			this.props.frameFnc ( { do:		'set-call-down',
									to:		'root-pane',
									fnc:	this.doAll } );
		} else {
			this.props.parentFnc ( { do:  			'set-call-down',
									 to: 			'child-pane',
									 childEleId:	this.props.eleId,
									 fnc: 			this.doAll } );
			if ( this.props.tabEleId ) {
				this.props.parentFnc ( { do:			'set-call-down',
										 to:			'tab-pane',
										 tabPaneEleId:	this.eleId,
										 tabPaneFnc:	this.doAll } ); }
		}
	}	//	componentDidMount()

	componentDidUpdate() {
		this.sizeButtonBar();
		let sh = this.state.splitHorz;
		if ( sh && sh.incomplete ) {
			let pe = document.getElementById ( this.eleId );

			//  Put the copied contents in the left <div>.
			let lft = document.getElementById ( sh.left.eleId );
			let lftContent = lft.children[0];
			lftContent.textContent = sh.left.pet;						//	Do not destroy button bar.
			sh.left.pec.forEach ( e => lftContent.appendChild ( e ) );

			//	Some content in the right side pane.
			let rgt = document.getElementById ( sh.right.eleId );
			let rgtContent = rgt.children[0];
			rgtContent.textContent = 'side pane';						//	Do not destroy button bar.

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

			this.propagateDown_SizeOp ( { do: 'splitter-dragged' } );

			if ( sh.left.contentState ) {
				sh.left.paneFnc ( { do: 	'set-state',
									state:	sh.left.contentState } );
				delete sh.left.contentState; }
			if ( sh.right.contentState ) {
				sh.right.paneFnc ( { do: 	'set-state',
									 state:	sh.right.contentState } );
				delete sh.right.contentState; }

			if ( this.props.atFrameTop ) {
				this.props.frameFnc ( { do: 		'add-pane-btn-bar',
									  	paneEleId:	sh.left.eleId,
										paneFnc:	sh.left.paneFnc,
										paneLeft:	lft.offsetLeft,
										paneWidth:	lft.offsetWidth } );
				this.props.frameFnc ( { do: 		'add-pane-btn-bar',
									  	paneEleId:	sh.right.eleId,
										paneFnc:	sh.right.paneFnc,
										paneLeft:	rgt.offsetLeft,
										paneWidth:	rgt.offsetWidth } );
			}
			sh.incomplete = false
		}
		let sv = this.state.splitVert;
		if ( sv && sv.incomplete ) {
			let pe = document.getElementById ( this.eleId );

			//  Put the copied contents in the top <div>.
			let top = document.getElementById ( sv.top.eleId );
			let topContent = top.children[0];
			topContent.textContent = sv.top.pet;
			sv.top.pec.forEach ( e => topContent.appendChild ( e ) );

			//	Some content in the bottom side pane.
			let bot = document.getElementById ( sv.bottom.eleId );
			let botContent = bot.children[0];
			botContent.textContent = 'lower pane';

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

			this.propagateDown_SizeOp ( { do: 'splitter-dragged' } );

			let topSplit = false;
			if ( sv.top.contentState ) {
				topSplit = true;
				sv.top.paneFnc ( { do:		'set-state',
								   state:	sv.top.contentState } );
				delete sv.top.contentState; }
			if ( sv.bottom.contentState ) {
				sv.bottom.paneFnc ( { do:		'set-state',
									  state:	sv.bottom.contentState } );
				delete sv.bottom.contentState; }

			if ( this.props.atFrameTop && ! topSplit ) {
				this.props.frameFnc ( { do: 		'add-pane-btn-bar',
									  	paneEleId:	sv.top.eleId,
										paneFnc:	sv.top.paneFnc,
										paneLeft:	top.offsetLeft,
										paneWidth:	top.offsetWidth } );
			}

			sv.incomplete = false
		}
	}	//	componentDidUpdate()

}   //  class Pane

export { Pane as default };
