/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

Consider "React Class Component Syntax" in -
	
	https://www.robinwieruch.de/javascript-fundamentals-react-requirements/

	Savs a lot of text, apparently. 
->	Leaving the constructor out only works when there are no props.

Also see "Map, Reduce and Filter in React" in that same article.  Good
arrow function examples/explanations in JSX.

Also -

	How to fetch data in React
	https://www.robinwieruch.de/react-fetching-data/
	
*/

import React			from 'react';

import FrameHeader			from './frame-header';
import Pane					from './pane';
import FrameFooter			from './frame-footer';
/*
import TitleBar 			from './title-bar'
*/
import TransientTitleBar	from './frame-transient-title-bar';
import Sizer 				from './sizer'
import BurgerMenu			from './burger-menu';

import {diag, diagsFlush, diagsPrint} 	from './diags';


class Frame extends React.Component {
	constructor ( props ) {
		super ( props );
		const sW = props.frameId + ' Frame constructor()';
		diag ( [1], sW );
		this.eleId 		= 'rr-frame-' + props.frameId;
		this.peId 		= props.frameId;
		this.appFnc 	= props.appFrameFnc;
		this.headerFnc	= null;
		this.footerFnc	= null;
		this.rootPaneFnc	= null;
		this.titleBarFnc	= null;

		this.zTop				= this.zTop.bind ( this );
		this.mouseDown			= this.mouseDown.bind ( this );
		this.burgerClick		= this.burgerClick.bind ( this );
		this.iconize2			= this.iconize2.bind ( this );
		this.iconize 			= this.iconize.bind ( this );
		this.transitionEnd		= this.transitionEnd.bind ( this );
		this.clickIcon			= this.clickIcon.bind ( this );
		this.nameFrame			= this.nameFrame.bind ( this );
		this.nameFrameName		= this.nameFrameName.bind ( this );
		this.doAll 				= this.doAll.bind ( this );

		this.state = {
			frameName:	'Frame-' + props.frameId,
			titleBar:
				<TransientTitleBar frameId		= { props.frameId }
								   frameEleId	= { this.eleId }
								   appFnc 		= { this.appFnc }
								   frameFnc		= { this.doAll }
								   rootPaneFnc	= { null } />,
			iconized:	null,
			style: {
				left:       props.left,
				top:        props.top,
				width:      props.width,
				height:     props.height,
			},
			burgerMenu: null,
			contentRestoreIncomplete:	false
		};

		this.iconSlot		= null;
		this.contentState 	= null;

	//	this.props.appFrameContent ( { do: 			'set-call-down',
	//								   to:			'frame',
	//								   frameId:		this.props.frameId,
	//								   frameFnc:	this.doAll } );

	}	//	constructor()

	zTop() {
		this.props.appFrameContent ( { do: 		'ensure-frame-z-is-top',
									  frameId:	this.props.frameId } );
	}	//	zTop()

	mouseDown ( ev ) {
		let sW = 'Frame mouseDown()';
	//	console.log ( sW );
		this.zTop();
	}	//	mouseDown()

	burgerClick() {
		let sW = 'Frame burgerClick()';
	//	console.log ( sW );
		let fe = document.getElementById ( this.eleId );
		let r  = fe.getBoundingClientRect();
	//	this.setState ( { burgerMenu:
	//		<BurgerMenu eleId = { 'rr-pe-frame-burger-menu' }
	//					style = {{ left:	r.x + 'px',
	//							   top: 	r.y + 'px' }} />
	//	} );
		let isHdrVisible = false;
		if ( this.headerFnc ) {
			isHdrVisible = this.headerFnc ( { do: 'is-visible' } ); }
		let itemTextHdr = isHdrVisible ? 'Hide Header' : 'Show Header';
		let isFtrVisible = false;
		if ( this.footerFnc ) {
			isFtrVisible = this.footerFnc ( { do: 'is-visible' } ); }
		let itemTextFtr = isFtrVisible ? 'Hide Footer' : 'Show Footer';
		this.appFnc ( { 
			do: 		'show-menu',
			menuEleId:	this.eleId + '-burger-menu',
			menuX:		r.x,
			menuY:		r.y,
		//	menuItems:	[ { type: 'item', 		text: 'Tabs' },
		//				  { type: 'item', 		text: 'UDUI' },
		//				  { type: 'item', 		text: 'Viewport' },
		//				  { type: 'item', 		text: 'Process' },
		//				  { type: 'item', 		text: 'Diagnostics' },
		//				  { type: 'item', 		text: 'Values' },
		//				  { type: 'item', 		text: 'Stdout' } ],
			menuItems:	[ { type: 'item', 		text: 'Frame Name ...' },
						  { type: 'item', 		text: itemTextHdr },
						  { type: 'item', 		text: itemTextFtr } ],
			upFnc:		this.doAll,
			ctx:		{ after:	'menu-item' }
		} );
	}	//	burgerClick()

	iconize2() {
		window.setTimeout ( () => {
			this.setState ( { iconized: { 
				style: {
				//	left:		'20px',
				//	top: 		'20px',
					left:		this.iconSlot.x + 'px',
					top: 		this.iconSlot.y + 'px',
					width:		'50px',
					height:		'60px',
					transitionProperty: 	'left, top, width, height',
					transitionDuration:		'200ms' },
				iconName: {
					visibility: 	'hidden' },
				titleBar: null,
			} } );
			this.iconSlot = null;
		}, 50 );
	}	//	iconize2()

	iconize ( o ) {
		let sW = this.props.frameId + ' Frame iconize()';
		diagsFlush();
		diagsPrint ( sW, 2, 2000 );
		diag ( [2], sW );
		this.contentState = this.rootPaneFnc ( { do: 'get-state' } );
		this.setState ( { titleBar: null,
						  iconized: { 
			style: {
				left:		this.state.style.left,
				top: 		this.state.style.top,
				width:		this.state.style.width,
				height:		this.state.style.height,
				transitionProperty: 	'left, top, width, height',
				transitionDuration:		'200ms' },
			iconName: {
				visibility: 	'hidden',
			}
		} } );
		if ( ! this.iconSlot ) {
		//	this.props.appFrameContent ( { 
		//		do: 		'get-icon-slot',
		//		frameId: 	this.props.frameId } )
		//	.then ( ( slot ) => {
		//		this.iconSlot = slot;
		//		this.iconize2();
		//	} );
			this.iconSlot = this.props.appFrameContent ( { 
				do: 		'get-icon-slot',
				frameId: 	this.props.frameId } ); 
		}
		this.iconize2();
	}	//	iconize()

	transitionEnd ( ev ) {
		let sW = 'transitionEnd()';
	//	console.log ( sW );
		//	This fires for each of the left, top, width, height transition
		//	properties. That is, four times.  Simply set the icon's name 
		//	visiblity on the event that indicates one of the transitions 
		//	to icon is ended.
		if ( this.state.iconized.iconName.visibility !== 'visible' ) {
			this.setState ( { iconized: {
				style: {
					left:		this.state.iconized.style.left,
					top: 		this.state.iconized.style.top,
					width:		this.state.iconized.style.width,
					height:		this.state.iconized.style.height,
					transitionProperty: 	'left, top, width, height',
					transitionDuration:		'200ms' },
				iconName: { visibility: 'visible' } } 
			} );
		}
	}	//	transitionEnd()

	clickIcon ( ev ) {
		let sW = this.props.frameId + ' Frame clickIcon()';
		diagsFlush();
		diagsPrint ( sW, 2, 2000 );
		diag ( [2], sW );
		//	First, transition to the frame's position and size.
		let style = this.state.iconized.style;
		this.setState ( { iconized: { 
			style: {
				left:		this.state.style.left,
				top: 		this.state.style.top,
				width:		this.state.style.width,
				height:		this.state.style.height,
				transitionProperty: 	'left, top, width, height',
				transitionDuration:		'200ms' },
			iconName: {
				visibility:		'hidden'
			}
		} } );
		//	Now, after a delay, restore the frame.
		window.setTimeout ( () => {
			this.setState ( { iconized: 				null,
							  contentRestoreIncomplete:	true } );
			this.zTop();
		}, 200 );
	}	//	clickIcon()

	nameFrame ( o ) {
		this.appFnc ( { do: 	'show-name-dlg',
						upFnc: 	this.doAll,
						ctx: 	{ title:	'Frame Name',
								  curName:	this.state.frameName,
								  after: 	'name-frame-name' } } );
	}	//	nameFrame()

	nameFrameName ( o ) {
		this.setState ( { frameName: o.name } );
	}	//	nameFrameName()
	
	doAll ( o ) {
		let sW = this.props.frameId + ' Frame doAll() ' + o.do;
		if ( o.to ) {
			sW += ' to ' + o.to; }
		diag ( [1, 2, 3], sW );
		let self = this;
		function setCallDown ( o ) {
			if ( ! o.to ) {
				return; }
			if ( o.to === 'frame-header' ) {
				self.headerFnc = o.fnc;
				return; }
			if ( o.to === 'frame-footer' ) {
				self.footerFnc = o.fnc;
				return; }
			if ( o.to === 'root-pane' ) {
				self.rootPaneFnc = o.fnc;
				return; }
			if ( o.to === 'PECmdEditor' ) {
				self.editor = o.fnc; 
				return; }
			if ( o.to === 'client-content' ) {
				self.rootPaneFnc ( o );
				return }
			if ( o.to === 'sizer' ) {
				self.sizerFnc = o.sizerFnc;
				return; }
			if ( o.to === 'title-bar' ) {
				self.titleBarFnc = o.titleBarFnc;
			//	if ( self.rootPaneFnc ) {
			//		self.titleBarFnc ( { do: 			'set-root-pane-fnc',
			//							 rootPaneFnc:	self.rootPaneFnc } ); }

				//	Do this here because it is now known that button bar functions 
				//	are set	up in the title bar.
				if ( self.state.contentRestoreIncomplete && self.state.titleBar ) {
					self.titleBarFnc ( { do:		'set-root-pane-fnc',
										 paneFnc:	self.rootPaneFnc } );

					self.rootPaneFnc ( { do: 	'set-state',
										state:	self.contentState } );
					self.contentState = null;
					self.state.contentRestoreIncomplete = false; }
				return;	}
		}

		if ( o.do === 'set-call-down' ) {
			setCallDown ( o );
			return; 
		}
		if ( o.do === 'move-start' ) {
			this.moveX0 = Number.parseInt ( this.state.style.left );
			this.moveY0 = Number.parseInt ( this.state.style.top );
			this.appFnc ( { do: 		'move-frame',
							frameFnc:	this.doAll,
							ev: 		o.ev } );
			return;
		}
		if ( o.do === 'move' ) {
			this.setState ( {
				style: {
					left:	(this.moveX0 + o.dX) + 'px',
					top:	(this.moveY0 + o.dY) + 'px',
					width:	this.state.style.width,
					height:	this.state.style.height,
				}
			} );
			return;
		}
		if ( o.do === 'size-start' ) {
			this.sizeW0 = Number.parseInt ( this.state.style.width );
			this.sizeH0 = Number.parseInt ( this.state.style.height );
			if ( this.titleBarFnc ) {
				this.titleBarFnc ( o ); }
			if ( this.rootPaneFnc ) {
				o.visitedPanes = {};
				this.rootPaneFnc ( o ); }
			this.appFnc ( { do: 		'size-frame',
							frameFnc:	this.doAll,
							ev: 		o.ev } );
			return;
		}
		if ( o.do === 'size' ) {
			this.setState ( {
				style: {
					left:	this.state.style.left,
					top:	this.state.style.top,
					width:	(this.sizeW0 + o.dX) + 'px',
					height:	(this.sizeH0 + o.dY) + 'px'
				}
			} );
			if ( this.titleBarFnc ) {
				this.titleBarFnc ( o ) }
			if ( this.sizerFnc ) {
				this.sizerFnc ( o ); }
			if ( this.rootPaneFnc ) {
				this.rootPaneFnc ( o ); }
			return;
		}
		if ( o.do === 'frame-burger-click' ) {
			this.burgerClick();
			return;
		}
		if ( o.do === 'iconize' ) {
			this.iconize ( o );
			return;
		}
		if ( o.do === 'split-horz' ) {
			if ( this.rootPaneFnc ) {
				this.rootPaneFnc ( o );
			}
			return;
		}
		if ( o.do === 'split-vert' ) {
			if ( this.rootPaneFnc ) {
				this.rootPaneFnc ( o );
			}
			return;
		}
		if ( o.do === 'content-split-horz' ) {
			if ( this.titleBarFnc ) {
				this.titleBarFnc ( o ) }
			return;
		}
	//	if ( o.do === 'content-split-drag' ) {
	//		if ( this.titleBarFnc ) {
	//			this.titleBarFnc ( o ) }
	//		return;
	//	}
		if ( o.do === 'add-pane-btn-bar' ) {
			self.titleBarFnc ( o );
			return;
		}
		if ( o.do === 'clear-pane-btn-bars' ) {
			self.titleBarFnc ( o );
			return;
		}
		if ( o.do === 'remove-pane-btn-bar' ) {
			self.titleBarFnc ( o );
			return;
		}
		if ( o.do === 'show-menu' ) {
			this.appFnc ( o );
			return;
		}
		if ( o.do === 'show-name-dlg' ) {
			this.appFnc ( o );
			return;
		}
		if ( o.do === 'append-menu-items' ) {
			this.props.appFrameContent ( o );
			return;
		}
		if ( o.do === 'menu-item' ) {
			if ( o.menuItemText === 'Frame Name ...' ) {
				this.nameFrame();
				return; }
			if ( o.menuItemText === 'Show Header' ) {
				if ( this.headerFnc ) {
					this.headerFnc ( { do: 'show' } ); }
				return; }
			if ( o.menuItemText === 'Hide Header' ) {
				if ( this.headerFnc ) {
					this.headerFnc ( { do: 'hide' } ); }
				return; }
			if ( o.menuItemText === 'Show Footer' ) {
				if ( this.footerFnc ) {
					this.footerFnc ( { do: 'show' } ); }
				return; }
			if ( o.menuItemText === 'Hide Footer' ) {
				if ( this.footerFnc ) {
					this.footerFnc ( { do: 'hide' } ); }
				return; }
			o.frameId = this.props.frameId;
			this.props.appFrameContent ( o );
			return;
		}
		if ( o.do === 'name-frame-name' ) {
			this.nameFrameName ( o );
			return; }
	}   //  doAll()

	render() {
		const sW = this.props.frameId + ' Frame render()';
		diag ( [1, 2, 3], sW );
		/*
				<TitleBar frameId	= 'frame-1'
						  appFnc 	= { this.appFnc }
						  frameFnc	= { this.doAll } />

				<TransientTitleBar frameEleId	= { this.eleId }
								   appFnc 		= { this.appFnc }
								   frameFnc		= { this.doAll } />
		*/
		if ( this.state.iconized ) {
			return (
				<div id					= { this.eleId }
					 className 			= 'rr-pe-frame'
					 style 				= { this.state.iconized.style }
					 onTransitionEnd	= { this.transitionEnd }
					 onClick			= { this.clickIcon } >
					<div className 	= 'rr-iconized-frame-name'
						 style 		= { this.state.iconized.iconName } >
						{ this.state.frameName }
					</div>
				</div>
			); }
		return (
			<div id				= { this.eleId }
				 className		= "rr-pe-frame"
				 style 			= { this.state.style}
				 onMouseDown	= { this.mouseDown } >
				<FrameHeader frameId 	= { this.props.frameId }
							 frameName	= { this.state.frameName }
							 frameFnc	= { this.doAll } />
				<Pane frameId		= { this.props.frameId }
					  paneId		= { this.props.paneId }
					  peId			= { this.peId } 
					  frameFnc		= { this.doAll }
					  tabs			= { false } 
					  atFrameTop	= { true } 

				//	  contentStyle	= { this.props.contentStyle }
				//	  ccEleId		= { this.props.ccEleId }
				//	  clientContent	= { this.props.clientContent } 
					  
					  clientFnc		= { this.props.clientFnc } />

				<FrameFooter frameFnc = { this.doAll } />
				<Sizer frameId 		= { this.props.frameId }
					   frameEleId 	= { this.eleId }
					   appFnc 		= { this.appFnc }
					   frameFnc		= { this.doAll }  />
				{ this.state.titleBar }
				{ this.state.burgerMenu }
			</div>
		)
	}	//	render()

	componentDidMount() {
		const sW = this.props.frameId + ' Frame componentDidMount()';
		diag ( [1, 2], sW );

		this.props.appFrameContent ( { do: 			'set-call-down',
									   to:			'frame',
									   frameId:		this.props.frameId,
									   frameFnc:	this.doAll } );

	//	if ( ! this.state.titleBar ) {
	//		diag ( [1], sW + ' this.setState ( { titleBar: ... ' );
	//		this.setState ( { titleBar:
	//			<TransientTitleBar frameId		= { this.props.frameId }
	//							   frameEleId	= { this.eleId }
	//							   appFnc 		= { this.appFnc }
	//							   frameFnc		= { this.doAll }
	//							   rootPaneFnc	= { this.rootPaneFnc } />
	//		}, () => {
	//		} );
	//	}

		if ( this.titleBarFnc ) {
			this.titleBarFnc ( { do:		'set-root-pane-fnc',
								 paneFnc:	this.rootPaneFnc } );
		}
	}	//	componentDidMount()

	componentDidUpdate() {
		const sW = this.props.frameId + ' Frame componentDidUpdate()';
		diag ( [1, 2, 3], sW );

	//	if ( this.state.contentRestoreIncomplete && this.state.titleBar ) {
	//		this.rootPaneFnc ( { do: 	'set-state',
	//							 state:	this.contentState } );
	//		this.contentState = null;
	//		this.state.contentRestoreIncomplete = false;
	//	}
	//
	//	Title bar must be set up before the pane's state (with possible
	//	child panes) is set because of button bar issues in the title
	//	bar (the button bar container function must be set in the title
	//	bar). So the pane's state is set in the 'title-bar-call-down'
	//	command in doAll().

		//	But do do this - 
		if ( this.state.contentRestoreIncomplete && ! this.state.titleBar ) {
			this.setState ( { titleBar:
			//	<TransientTitleBar frameId		= { this.props.frameId }
			//					   frameEleId	= { this.eleId }
			//					   appFnc 		= { this.appFnc }
			//					   frameFnc		= { this.doAll }
			//					   rootPaneFnc	= { this.rootPaneFnc } />
				<TransientTitleBar frameId		= { this.props.frameId }
								   frameEleId	= { this.eleId }
								   appFnc 		= { this.appFnc }
								   frameFnc		= { this.doAll }
								   rootPaneFnc	= { null } />
			}, 
			() => {	} );
		}
	}	//	componentDidUpdate()

}	//	class Frame

export { Frame as default };
