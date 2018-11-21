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

import PEFrameHeader		from './pe-frame-header';
import Pane					from './pane';
import PEFrameFooter		from './pe-frame-footer';
/*
import TitleBar 			from './title-bar'
*/
import TransientTitleBar	from './pe-frame-transient-title-bar';
import Sizer 				from './sizer'
import BurgerMenu			from './burger-menu';


class PEFrame extends React.Component {
	constructor ( props ) {
		super ( props );
		this.eleId 		= 'rr-frame-' + props.frameId;
		this.peId 		= props.frameId;
		this.appFnc 	= props.appFrameFnc;
		this.rootPaneFnc	= null;
		this.titleBarFnc	= null;
		this.state = {
			titleBar:	null,
			iconized:	null,
			style: {
				left:       this.props.left,
				top:        this.props.top,
				width:      this.props.width,
				height:     this.props.height,
			},
			burgerMenu: null,
			contentRestoreIncomplete:	false
		};
		this.zTop				= this.zTop.bind ( this );
		this.mouseDown			= this.mouseDown.bind ( this );
		this.burgerClick		= this.burgerClick.bind ( this );
		this.iconize2			= this.iconize2.bind ( this );
		this.iconize 			= this.iconize.bind ( this );
		this.transitionEnd		= this.transitionEnd.bind ( this );
		this.clickIcon			= this.clickIcon.bind ( this );
		this.doAll 				= this.doAll.bind ( this );

		this.iconSlot		= null;
		this.contentState 	= null;

		this.props.appFrameContent ( { do: 			'set-call-down',
									   to:			'frame',
									   frameId:		this.props.frameId,
									   frameFnc:	this.doAll } );

	}	//	constructor()

	zTop() {
		this.props.appFrameContent ( { do: 		'ensure-frame-z-is-top',
									  frameId:	this.props.frameId } );
	}	//	zTop()

	mouseDown ( ev ) {
		let sW = 'PEFrame mouseDown()';
	//	console.log ( sW );
		this.zTop();
	}	//	mouseDown()

	burgerClick() {
		let sW = 'PEFrame burgerClick()';
		console.log ( sW );
		let fe = document.getElementById ( this.eleId );
		let r  = fe.getBoundingClientRect();
	//	this.setState ( { burgerMenu:
	//		<BurgerMenu eleId = { 'rr-pe-frame-burger-menu' }
	//					style = {{ left:	r.x + 'px',
	//							   top: 	r.y + 'px' }} />
	//	} );
		this.appFnc ( { do: 		'show-menu',
						menuEleId:	this.eleId + '-burger-menu',
						menuX:		r.x,
						menuY:		r.y,
						menuItems:	[ 'Tabs',
									  'UDUI',
									  'Viewport',
									  'Process',
									  'Diagnostics',
									  'Values',
									  'Stdout' ],
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
		let sW = 'iconize()';
		console.log ( 'Frame ' + sW );
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
		console.log ( sW );
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
		let sW = 'clickIcon()';
		console.log ( 'Frame ' + sW );
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

	doAll ( o ) {
		let sW = 'PEFrame ' + this.eleId + ' doAll()';
		let frame = this;
		function setCallDown ( o ) {
			if ( o.to && o.to === 'root-pane' ) {
				frame.rootPaneFnc = o.fnc;
				return; 
			}
			if ( o.to && o.to === 'PECmdEditor' ) {
				frame.editor = o.fnc; }
			if ( o.to && o.to === 'client-content-fnc' ) {
				frame.rootPaneFnc ( o ); }
		}

		if ( o.do === 'set-call-down' ) {
			setCallDown ( o );
			return; 
		}
		if ( o.do === 'sizer-call-down' ) {
			this.sizerFnc = o.sizerFnc;
			return;
		}
		if ( o.do === 'title-bar-call-down' ) {
			this.titleBarFnc = o.titleBarFnc;
		//	if ( this.rootPaneFnc ) {
		//		this.titleBarFnc ( { do: 			'set-root-pane-fnc',
		//							 rootPaneFnc:	this.rootPaneFnc } ); }
			//	Do this here because it is now known that button bar functions 
			//	are set	up in the title bar.
			if ( this.state.contentRestoreIncomplete && this.state.titleBar ) {
				this.rootPaneFnc ( { do: 	'set-state',
									 state:	this.contentState } );
				this.contentState = null;
				this.state.contentRestoreIncomplete = false; }
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
		if ( o.do === 'content-split-drag' ) {
			if ( this.titleBarFnc ) {
				this.titleBarFnc ( o ) }
			return;
		}
		if ( o.do === 'add-pane-btn-bar' ) {
			frame.titleBarFnc ( o );
			return;
		}
		if ( o.do === 'clear-pane-btn-bars' ) {
			frame.titleBarFnc ( o );
			return;
		}
		if ( o.do === 'remove-pane-btn-bar' ) {
			frame.titleBarFnc ( o );
			return;
		}
		if ( o.do === 'show-menu' ) {
			this.appFnc ( o );
			return;
		}
		if ( o.do === 'append-menu-items' ) {
			this.props.appFrameContent ( o );
			return;
		}
		if ( o.do === 'menu-item' ) {
			o.frameId = this.props.frameId;
			this.props.appFrameContent ( o );
			return;
		}
	}   //  doAll()

	render() {
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
						{ 'Frame-' + this.props.frameId }
					</div>
				</div>
			); }
		return (
			<div id				= { this.eleId }
				 className		= "rr-pe-frame"
				 style 			= { this.state.style}
				 onMouseDown	= { this.mouseDown } >
				<PEFrameHeader frame	= { this.doAll } />
				<Pane peId 			= { this.peId } 
					  frameFnc 		= { this.doAll }
					  tabs			= { false } 
					  atFrameTop	= { true } 
					  contentStyle	= { this.props.contentStyle }
					  ccEleId		= { this.props.ccEleId }
					  clientContent	= { this.props.clientContent } />
				<PEFrameFooter />
				<Sizer frameEleId 	= { this.eleId }
					   appFnc 		= { this.appFnc }
					   frameFnc		= { this.doAll }  />
				{ this.state.titleBar }
				{ this.state.burgerMenu }
			</div>
		)
	}	//	render()

	componentDidMount() {
		if ( ! this.state.titleBar ) {
			this.setState ( { titleBar:
				<TransientTitleBar frameId		= { this.props.frameId }
								   frameEleId	= { this.eleId }
								   appFnc 		= { this.appFnc }
								   frameFnc		= { this.doAll }
								   rootPaneFnc	= { this.rootPaneFnc } />
			}, () => {
			} );
		}
	}	//	componentDidMount()

	componentDidUpdate() {
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
		//	But do do this - like componentDidMount(), but since that
		//	is not called when restoring from an icon, we do it here too.
		if ( this.state.contentRestoreIncomplete && ! this.state.titleBar ) {
			this.setState ( { titleBar:
				<TransientTitleBar frameId		= { this.props.frameId }
								   frameEleId	= { this.eleId }
								   appFnc 		= { this.appFnc }
								   frameFnc		= { this.doAll }
								   rootPaneFnc	= { this.rootPaneFnc } />
			}, () => {
			} );
		}

	}	//	componentDidUpdate()

}	//	class PEFrame

export { PEFrame as default };
