/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React		from 'react';

import PaneContent	from './pane-content';
import { ButtonBar, nextBtnBarId } 		from './button-bar';
import Split 		from 'split.js'

import {diag, diagsFlush, diagsPrint} 	from './diags';


let lastPaneId = 0;

function getPaneId() {
	return ++lastPaneId;
}

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
		const sW = 'Pane ' + this.props.paneId + ' constructor()';
		diag ( [1, 2], sW );
		if ( props.eleId ) {
			this.eleId = props.eleId;
		} else
		if ( props.tabId ) {
			this.eleId = 'pe-tab-' + props.tabId + '-pane';
		} else {
			this.eleId = 'pe-frame-' + props.peId + '-pane';
		}
		if ( props.class ) {
			this.class = props.class;
		} else {
			this.class = 'pane';
		}
		
		this.contentEleId		= this.eleId + '-content';
		this.buttonBarId		= 0;
		this.buttonBarEleId 	= this.eleId + '-button-bar';

		this.burgerClick			= this.burgerClick.bind ( this );
		this.myElementStyleFnc		= this.myElementStyleFnc.bind ( this );
		this.splitDrag				= this.splitDrag.bind ( this );
		this.splitPrep				= this.splitPrep.bind ( this );
		this.splitHorz				= this.splitHorz.bind ( this );
		this.splitVert				= this.splitVert.bind ( this );
	//	this.sizeStartByTabPage		= this.sizeStartByTabPage.bind ( this );
	//	this.sizeByTabPage			= this.sizeByTabPage.bind ( this );
		this.propagateDown_SizeOp 	= this.propagateDown_SizeOp.bind ( this );
		this.doAll 					= this.doAll.bind ( this );

		this.sizeButtonBar			= this.sizeButtonBar.bind ( this );

		this.state = {
			style: props.tabId ? props.style : {
			//	flexDirection: 		'row'
			},

			contentStyle:	props.contentStyle,
			clientContent:	props.clientContent,

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
		this.tabPagePanes	= {};		//	keyed by tab ID
		this.h0				= 0;		//	used when this is on a tab page
		this.sized 			= false;

		this.paneContentFnc = null;

	//	this.ccEleId 	= this.props.ccEleId;	//	Client Content
		this.ccFnc		= null;
		this.ccState	= null;

		//	If there is a parent pane then false until that parent makes
		//	a calldown with 'set-at-frame-top' specifying possibly otherwise.
	//	this.isAtFrameTop	= props.parentFnc ? false : true;

		if ( ! this.props.parentFnc ) {
			this.props.frameFnc ( { do:		'set-call-down',
									to:		'root-pane',
									fnc:	this.doAll } );
		} else {
			this.props.parentFnc ( { do:  			'set-call-down',
									 to: 			'child-pane',
									 childPaneId:	this.props.paneId,
									 fnc: 			this.doAll } );
			if ( this.props.tabId ) {
				this.props.parentFnc ( { do:			'set-call-down',
										 to:			'tab-page-pane',
										 tabId:			this.props.tabId,
										 tabPaneFnc:	this.doAll } ); 
				this.props.tabsFnc ( { do:			'set-call-down',
									   to:			'tab-page-pane',
									   tabId:		this.props.tabId,
									   tabPaneFnc:	this.doAll } ); }
			if ( ! this.props.atFrameTop ) {
				this.buttonBarId = nextBtnBarId();
			}
		}
	}	//  constructor()

	//	Data associated with any element.  Keys are the elements' id.
	eleData = {};

	burgerClick() {
		let sW = 'Pane burgerClick()';
	//	console.log ( sW );
		let menuItems = [ 'Tabs' ];
		this.props.frameFnc ( {
			do:			'append-menu-items',
			to:			'pane-burger',
			menuItems:	menuItems
		} );
		let pe = document.getElementById ( this.eleId );
		let r  = pe.getBoundingClientRect();
		this.props.frameFnc ( { 
            do: 		'show-menu',
            menuEleId:	this.eleId + '-burger-menu',
            menuX:		r.x - 1,
            menuY:		r.y - 1,
            menuItems:	menuItems,
            upFnc:		this.doAll,
            ctx:		{ after:	'menu-item' }
		} );

	}	//	burgerClick()

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
		let sW = 'Pane ' + this.props.paneId + ' splitHorz()';
		diagsFlush();
		diagsPrint ( 2, 2000 );
		diag ( [2], sW );

		if ( this.props.atFrameTop && this.buttonBarFnc ) {
			this.props.frameFnc ( { do: 		'remove-pane-btn-bar',
									bbEleId:	this.buttonBarEleId } );
			this.buttonBarEleId = null; }

		let sp = this.splitPrep ( o );
		
		let lftPaneId = getPaneId();
		let rgtPaneId = getPaneId();
		this.props.clientFnc ( {
			do:			'fix-pane-id',
			curPaneId:	this.props.paneId,
			newPaneId:	lftPaneId
		} );

		this.setState ( { 
			style: Object.assign ( { 
				backgroundColor:	'lightgray' },
				this.state.style ), 
			splitHorz: { 
			//	d: 	this.eleData[this.eleId],
				left: {
					eleId: 			this.eleId + '-lft-' + lftPaneId,
					class: 			'split split-horizontal pane',
					pet: 			sp.pet,
					pec: 			sp.pec,
					paneId:			lftPaneId,
					paneFnc: 		null,
				//	contentStyle:	this.state.contentStyle,
				//	clientContent:	this.state.clientContent,
					contentState:	this.doAll ( { do: 'get-state' } )
				},
				right: {
					eleId: 			this.eleId + '-rgt-' + rgtPaneId,
					class: 			'split split-horizontal pane',	
					paneId:			rgtPaneId,
					paneFnc: 		null,
				//	contentStyle:	null,
				//	clientContent:	null,
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
		let sW = 'Pane ' + this.props.paneId + '  splitVert()';
		diagsFlush();
		diagsPrint ( 2, 2000 );
		diag ( [2], sW );

		let sp = this.splitPrep ( o );
		
		let topPaneId = getPaneId();
		let botPaneId = getPaneId();
		this.props.clientFnc ( {
			do:			'fix-pane-id',
			curPaneId:	this.props.paneId,
			newPaneId:	topPaneId
		} );

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
					eleId: 			this.eleId + '-top-' + topPaneId,
					class: 			'split split-vertical pane',
					pet: 			sp.pet,
					pec: 			sp.pec,
					paneId:			topPaneId,
					paneFnc: 		null,
				//	contentStyle:	this.state.contentStyle,
				//	ccEleId:		this.ccEleId,
				//	clientContent:	this.state.clientContent,
				//	contentState:	this.ccFnc ? this.ccFnc ( { do: 'get-state' } )
				//							   : null
					contentState:	this.doAll ( { do: 'get-state' } )
				},
				bottom: {
					eleId: 			this.eleId + '-bot-' + botPaneId,
					class: 			'split split-vertical pane',	
					paneId:			botPaneId,
					paneFnc: 		null,
				//	contentStyle:	null,
				//	clientContent:	null,
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
	//	this.ccEleId	  = null;
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
		for ( var tabId in this.tabPagePanes ) {
			this.tabPagePanes[tabId].fnc ( o );
		}
	}	//	propagateDown_SizeOp()

//	sizeStartByTabPage() {
//		let e = document.getElementById ( this.eleId );
//		this.h0 = Number.parseInt ( e.style.height );
//	}	//	sizeStartByTabPage()

//	sizeByTabPage ( o ) {
//		let e = document.getElementById ( this.eleId );
//		let s = {
//			position:	'absolute',
//			width:		'100%',
//			height:		(this.h0 + o.dY) + 'px' };
//		if ( this.state.style.flexDirection ) {
//			s.flexDirection = this.state.style.flexDirection; }
//		if ( this.state.style.backgroundColor ) {
//			s.backgroundColor = this.state.style.backgroundColor; }
//		this.setState ( { style: s } );
//	}	//	sizeByTabPage()

	doAll ( o ) {
		const sW = 'Pane ' + this.props.paneId + ' doAll()';
		if ( o.do === 'set-call-down' ) {
			if ( o.to === 'pane-content' ) {
				this.paneContentFnc = o.fnc;
				return;
			}
			if ( o.to === 'child-pane' ) {
				let sh = this.state.splitHorz;
				if ( sh ) {
					if ( sh.left.paneId === o.childPaneId ) {
						diag ( [2], sW + ' left.paneFnc' );
						sh.left.paneFnc = o.fnc; 
					//	sh.left.paneFnc ( { do:	'set-at-frame-top',
					//					    is:	this.isAtFrameTop } ); 
					}
					if ( sh.right.paneId === o.childPaneId ) {
						diag ( [2], sW + ' right.paneFnc' );
						sh.right.paneFnc = o.fnc; 
					//	sh.right.paneFnc ( { do: 'set-at-frame-top',
					//					     is: this.isAtFrameTop } ); 
					} 
				}
				let sv = this.state.splitVert;
				if ( sv ) {
					if ( sv.top.paneId === o.childPaneId ) {
						diag ( [2], sW + ' top.paneFnc' );
						sv.top.paneFnc = o.fnc; 
					//	sv.top.paneFnc ( { do: 'set-at-frame-top',
					//					   is:  this.isAtFrameTop } ); 
					}
					if ( sv.bottom.paneId === o.childPaneId ) {
						diag ( [2], sW + ' bottom.paneFnc' );
						sv.bottom.paneFnc = o.fnc; } }
			}
			if ( o.to === 'tabs' ) {
				this.tabsFnc = o.tabsFnc;
			}
		//	if ( o.to === 'tab-pages' ) {
		//		this.tabPagesFnc = o.tabPagesFnc;
		//	}
			if ( o.to === 'tab-page-pane' ) {
				this.tabPagePanes[o.tabId] = { fnc:	o.tabPaneFnc };
			}
			if ( o.to === 'button-bar' ) {
				this.buttonBarFnc 	= o.bbFnc; 
				this.buttonBarEleId = o.bbEleId;
			}
			if ( o.to === 'client-content' ) {
				diag ( [1, 2], sW + ': set-call-down to client-content' );
			//	if ( o.ccEleId === this.ccEleId ) {
				if ( o.paneId === this.props.paneId ) {
					this.ccFnc = o.fnc; 		//	Client Content
					//	If we have already gotten the client content state ...
					if ( this.ccState ) {
						this.ccFnc ( { do: 		'set-state',
									   state:	this.ccState } );
						this.ccState = null;
					}
				}
				else {
					let sh = this.state.splitHorz;
					if ( sh ) {
						if ( sh.left.paneFnc ) {
							sh.left.paneFnc ( o ); }
						if ( sh.right.paneFnc ) {
							sh.right.paneFnc ( o ); }
						return;
					}
					let sv = this.state.splitVert;
					if ( sv ) {
						if ( sv.top.paneFnc ) {
							sv.top.paneFnc ( o ); }
						if ( sv.bottom.paneFnc ) {
							sv.bottom.paneFnc ( o ); }
						return;
					}
					for ( let tabId in this.tabPagePanes ) {
						let pagePane = this.tabPagePanes[tabId];
						pagePane.fnc ( o );
					}
				}
				return;
			}
			return;
		}	//	if ( o.do === 'set-call-down' ) 
		if ( o.do === 'set-call-down-correct' ) {
			if ( o.to === 'pane-content' ) {
				//	Getting the doAll() of the content - But - should not
				//	call until  * this *  component is mounted.  Got that?
				//	I.e., we know now that PaneContent is mounted. But we
				//	know nothing about its client content - so we can not
				//	set its state, for example.
				//	So what?  When can the content's state be set?
				//	The client content will command this 'client-content'.
				this.correctPaneContentFnc = o.fnc;
				return;
			}
		}	//	if ( o.do === 'set-call-down-correct' ) 
	//	if ( o.do === 'button-bar-call-down' ) {
	//		this.buttonBarFnc = o.buttonBarFnc;
	//		return;
	//	}
		if ( o.do === 'pane-burger-click' ) {
			if ( this.ccFnc ) {
				this.ccFnc ( { do: 			o.do,
							   paneEleId:	this.eleId } );
				return; }
			this.burgerClick();
			return;
		}
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
		//	if ( this.props.tabId ) {
		//		this.sizeStartByTabPage(); }
			this.propagateDown_SizeOp ( o );
			return;
		}
		if ( o.do === 'size' ) {
			let cs = this.state.containerStyle;
			if ( cs ) {
				this.sized = true;
				this.setState ( { containerStyle: { 
					width: '100%', 
					height: (this.containerH0 + o.dY) + 'px' } } ); }
		//	this.width += o.dX;
			if ( this.props.tabId ) {
			//	this.sizeByTabPage ( o );
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
			diag ( [2], sW + ' get-state' );
			let pe = document.getElementById ( this.eleId );
			let state = Object.assign ( {}, this.state );
			let sh = state.splitHorz;
			let sv = state.splitVert;
			if ( sh ) {
				sh.left.contentState = sh.left.paneFnc ( o );
				sh.left.paneFnc = null;
				sh.right.contentState = sh.right.paneFnc ( o );
				sh.right.paneFnc = null;
				sh.opts.elementStyle = null;
				sh.opts.onDrag = null; }
			if ( sv ) {
				sv.top.contentState = sv.top.paneFnc ( o );
				sv.top.paneFnc = null;
				sv.bottom.contentState = sv.bottom.paneFnc ( o );
				sv.bottom.paneFnc = null;
				sv.opts.elementStyle = null;
				sv.opts.onDrag = null; }
			if ( (! sh) && (! sv) && this.ccFnc ) {
				state.ccState = this.ccFnc ( o );
			} else {
				state.ccState = null; }
			if ( this.state.tabs ) {
				state.tabsState = this.tabsFnc ( o );
			} else {
				state.tabsState = false; }
			state.eleData = Object.assign ( {}, this.eleData );
			let d = state.eleData[pe.id];
			if ( d ) {
				d.split.sizes = d.split.instance.getSizes(); }
			return state;
		}
		if ( o.do === 'set-state' ) {
		//	console.log ( sW + ': set-state' );
			diag ( [3], sW + ' set-state' );
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
			if ( (! sh) && (! sv) ) {
				if ( this.ccFnc ) {
				//	console.log ( sW + ' set-state: this.ccFnc is set' );
					diag ( [3], sW + ' set-state: this.ccFnc is set' );
					this.ccFnc ( { do: 		'set-state',
								   state:	o.state.ccState } );
				} else {
				//	diag ( [], sW + ' set-state ERROR: this.ccFnc is not set' );
					//	Set client content state when we get the ccFnc.
					diag ( [3], sW + ' set-state: this.ccState' );
					this.ccState = o.state.ccState;
				}
				delete o.state.ccState;
			}
			
			this.eleData = Object.assign ( {}, o.state.eleData );
			delete o.state.eleData;
			let tabsState = o.state.tabsState;
			delete o.state.tabsState;
			let self = this;
			this.setState ( o.state, () => {
				if ( ! tabsState ) {
					return; }
				self.tabsFnc ( { do: 	'set-state',
								 state:	tabsState } );
			} );
			return (!!sh) || (!!sv);
		}

		if ( o.do === 'menu-item' ) {
			if ( o.menuItemText === 'Tabs' ) {
				diagsFlush();
				diagsPrint ( 2, 2000 );
				diag ( [2], sW + ' menu-item Tabs' );
				this.setState ( { tabs: true } );
				return;	}
			o.paneId		 = this.props.paneId;
			o.paneFnc 		 = this.doAll;
			o.paneContentFnc = this.paneContentFnc;
			this.props.frameFnc ( o );
			return;
		}

	//	if ( o.do === 'install-content' ) {
	//		this.ccEleId = o.ccEleId;
	//		this.setState ( { 
	//			contentStyle:	o.parentStyle,
	//			clientContent:	o.content
	//		} );
	//		return;
	//	}

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
		const sW = 'Pane ' + this.props.paneId + ' render()';
		//	When split horizontally - For example -
		if ( this.state.splitHorz ) {
		//	console.log ( 'Pane render() this.state.splitHorz )' );
			let lft = this.state.splitHorz.left;
			let rgt = this.state.splitHorz.right;
			return (
				<div id 		= { this.eleId }
					 className 	= { this.class }
					 style 		= { this.state.style } >
					<Pane paneId		= { lft.paneId }
						  eleId 		= { lft.eleId }
						  class 		= { lft.class }
						  peId 			= { this.props.peId }
						  frameFnc		= { this.props.frameFnc } 
						  parentFnc 	= { this.doAll } 
						  atFrameTop	= { this.props.atFrameTop }
					//	  contentStyle	= { lft.contentStyle }
					//	  clientContent	= { lft.clientContent } />
						  clientFnc		= { this.props.clientFnc } />
					<Pane paneId		= { rgt.paneId }
						  eleId 		= { rgt.eleId } 
						  class 		= { rgt.class }
						  peId 			= { this.props.peId }
						  frameFnc		= { this.props.frameFnc } 
						  parentFnc 	= { this.doAll } 
						  atFrameTop	= { this.props.atFrameTop } 
					//	  contentStyle	= { rgt.contentStyle } 
					//	  clientContent	= { rgt.clientContent } />
						  clientFnc		= { this.props.clientFnc } />
				</div>
			); }

		if ( this.state.splitVert ) {
			diag ( [2], sW + ' splitVert' );
			let sv = this.state.splitVert;
			let top = sv.top;
			let bot = sv.bottom;
			return (
				<div id 		= { this.eleId }
					 className 	= { this.class }
					 style 		= { this.state.style } >
					<div style = { this.state.containerStyle } >
						<Pane paneId		= { top.paneId }
							  eleId 		= { top.eleId }
							  class 		= { top.class }
							  peId 			= { this.props.peId }
							  frameFnc		= { this.props.frameFnc } 
							  parentFnc 	= { this.doAll } 
							  atFrameTop	= { this.props.atFrameTop }
						//	  contentStyle	= { top.contentStyle }
						//	  ccEleId		= { top.ccEleId }
						//	  clientContent	= { top.clientContent } 
							  clientFnc		= { this.props.clientFnc } />
						<Pane paneId		= { bot.paneId }
							  eleId 		= { bot.eleId } 
							  class 		= { bot.class }
							  peId 			= { this.props.peId }
							  frameFnc		= { this.props.frameFnc } 
							  parentFnc 	= { this.doAll } 
							  atFrameTop	= { false } 
						//	  contentStyle	= { bot.contentStyle }
						//	  clientContent	= { bot.clientContent } 
							  clientFnc		= { this.props.clientFnc } />
					</div>
				</div>
			); }

		if ( this.props.parentFnc ) {
			if ( this.props.atFrameTop ) {
				if ( this.state.tabs ) {
					diag ( [2], sW + ' got parent, at top, tabs' );
					return (
						<div id 		= { this.eleId }
							className 	= { this.class }
							style 		= { this.state.style } >
							<PaneContent eleId 		= { this.contentEleId } 
										 peId		= { this.props.peId }
										 paneId		= { this.props.paneId }
										 paneFnc	= { this.doAll }
										 frameFnc 	= { this.props.frameFnc }
										 clientFnc	= { this.props.clientFnc } 
										 tabs 		= { true } />
						</div>
					);
				}
				diag ( [2], sW + ' got parent, at top' );
				return (
					<div id 		= { this.eleId }
						 className 	= { this.class }
						 style 		= { this.state.style } >
						<PaneContent eleId 		= { this.contentEleId }
									 peId		= { this.props.peId }
									 paneId		= { this.props.paneId }
					  				 paneFnc	= { this.doAll }
									 frameFnc 	= { this.props.frameFnc } 
								//	 style	 = { this.state.contentStyle }
								//	 content = { this.state.clientContent } 
									 clientFnc	= { this.props.clientFnc } />
					</div>
				); 
			} else {
				if ( this.state.tabs ) {
					diag ( [2], sW + ' got parent, not at top, tabs' );
					return (
						<div id 		= { this.eleId }
							className 	= { this.class }
							style 		= { this.state.style } >
							<PaneContent eleId 		= { this.contentEleId } 
										 peId		= { this.props.peId }
										 paneId		= { this.props.paneId }
										 paneFnc	= { this.doAll }
										 frameFnc 	= { this.props.frameFnc }
										 clientFnc	= { this.props.clientFnc } 
										 tabs 		= { true } />
						</div>
					);
				}
				diag ( [2], sW + ' got parent, not at top' );
				return (
					<div id 		= { this.eleId }
						 className 	= { this.class }
						 style 		= { this.state.style } >
						<PaneContent eleId 		= { this.contentEleId }
									 peId		= { this.props.peId }
									 paneId		= { this.props.paneId }
					  				 paneFnc	= { this.doAll }
									 frameFnc 	= { this.props.frameFnc } 
								//	 style	 = { this.state.contentStyle }
								//	 content = { this.state.clientContent }
									 clientFnc	= { this.props.clientFnc } />
						<ButtonBar bbId				= { this.buttonBarId }
								   eleId			= { this.buttonBarEleId }
								   containerFnc		= { null }
								   paneFnc			= { this.doAll }
								   isForRootPane	= { false } />
					</div>
				); 
			}
		}	//	if ( this.props.parentFnc )
		
		if ( this.state.tabs ) {
			diag ( [1, 2], sW + ' no split, no parent, tabs');
			return (
				<div id 		= { this.eleId }
					className 	= { this.class }
					style 		= { this.state.style } >
					<PaneContent eleId 		= { this.contentEleId } 
								 peId		= { this.props.peId }
								 paneId		= { this.props.paneId }
								 paneFnc	= { this.doAll }
								 frameFnc 	= { this.props.frameFnc }
								 clientFnc	= { this.props.clientFnc } 
								 tabs 		= { true } />
				</div>
			);
		}
	//	console.log ( 'Pane render()' );
		/*
		return (
			<div id 		= { this.eleId }
				 className 	= { this.class }
				 style 		= { this.state.style } >
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
		diag ( [1, 2], sW + ' no split, no parent');
		return (
			<div id 		= { this.eleId }
				 className 	= { this.class }
				 style 		= { this.state.style } >
				<PaneContent eleId 		= { this.contentEleId } 
							 peId		= { this.props.peId }
							 paneId		= { this.props.paneId }
							 paneFnc	= { this.doAll }
							 frameFnc 	= { this.props.frameFnc } 

						//	 style		= { this.state.contentStyle }
						//	 content	= { this.state.clientContent } 
							 
							 clientFnc	= { this.props.clientFnc } />
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
		const sW = 'Pane ' + this.props.paneId + ' componentDidMount()';
		diag ( [1, 2, 3], sW );
		this.sizeButtonBar();
	}	//	componentDidMount()

	componentDidUpdate() {
		const sW = 'Pane ' + this.props.paneId + '  componentDidUpdate()';
		diag ( [1, 2], sW );
		this.sizeButtonBar(); 
	//	if ( this.sized ) {
	//		this.sized = false;
	//		this.sizeButtonBar(); }
		let sh = this.state.splitHorz;
		if ( sh && sh.incomplete ) {
			let pe = document.getElementById ( this.eleId );

			//  Put the copied contents in the left <div>.
			let lft = document.getElementById ( sh.left.eleId );
		//	let lftContent = lft.children[0];
		//	lftContent.textContent = sh.left.pet;						//	Do not destroy button bar.
		//	sh.left.pec.forEach ( e => lftContent.appendChild ( e ) );

			//	Some content in the right side pane.
			let rgt = document.getElementById ( sh.right.eleId );
		//	let rgtContent = rgt.children[0];
		//	rgtContent.textContent = 'side pane';						//	Do not destroy button bar.

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
		//	let topContent = top.children[0];
		//	topContent.textContent = sv.top.pet;
		//	sv.top.pec.forEach ( e => topContent.appendChild ( e ) );

			//	Some content in the bottom side pane.
			let bot = document.getElementById ( sv.bottom.eleId );
		//	let botContent = bot.children[0];
		//	botContent.textContent = 'lower pane';

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
			//	topSplit = true;
			//	sv.top.paneFnc ( { do:		'set-state',
			//					   state:	sv.top.contentState } );
				topSplit = sv.top.paneFnc ( { do:	 'set-state',
											  state: sv.top.contentState } );
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

	componentWillUnmount() {
		const sW = 'Pane ' + this.props.paneId + ' componentWillUnmount()';
		diag ( [1, 2, 3], sW );
		if ( this.props.tabId ) {
			this.props.parentFnc ( { do:			'set-call-down',
									 to:			'tab-page-pane',
									 tabId:			this.props.tabId,
									 tabPaneFnc:	null } ); 
			this.props.tabsFnc ( { do:			'set-call-down',
								   to:			'tab-page-pane',
								   tabId:		this.props.tabId,
								   tabPaneFnc:	null } ); 
		}
	}	//	componentWillUnmount()

}   //  class Pane

export { Pane as default, getPaneId };
