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

import PEFrameHeader	from './pe-frame-header';
import PEFrameContent	from './pe-frame-content';
import PEFrameFooter	from './pe-frame-footer';
import TitleBar 		from './title-bar'
import Sizer 			from './sizer'


class PEFrame extends React.Component {
	constructor ( props ) {
		super ( props );
		this.peId 		= props.frameId;
		this.appFnc 	= props.appFrameFnc;
		this.contentFnc = null;
		this.state = {
			iconized:	null,
			style: {
				left:       this.props.left,
				top:        this.props.top,
				width:      this.props.width,
				height:     this.props.height,
			}
		};
		this.iconize 		= this.iconize.bind ( this );
		this.transitionEnd	= this.transitionEnd.bind ( this );
		this.clickIcon		= this.clickIcon.bind ( this );
		this.doAll 			= this.doAll.bind ( this );
	}	//	constructor()

	iconize ( o ) {
		let sW = 'iconize()';
		console.log ( 'Frame ' + sW );
		//	1	Make the frame infisible.
		//	2	Render a rectangle matching the frame's position and
		//		size.
		//	3	Transition that rectangle to the icon's position and
		//		size.
		this.setState ( { iconized: { 
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
		window.setTimeout ( () => {
			this.setState ( { iconized: { 
				style: {
					left:		'20px',
					top: 		'20px',
					width:		'50px',
					height:		'60px',
					transitionProperty: 	'left, top, width, height',
					transitionDuration:		'200ms' },
				iconName: {
					visibility: 	'hidden',
				}
			} } );
		}, 50 );
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
		window.setTimeout ( () => {
			this.setState ( { iconized: null } );
		}, 200 );
	}	//	clickIcon()

	doAll ( o ) {
		let frame = this;
		function setCallDown ( o ) {
			if ( o.to && o.to === 'PEFrameContent' ) 
				frame.contentFnc = o.fnc;
			if ( o.to && o.to === 'PECmdEditor' ) 
				frame.editor = o.fnc;
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
			return;
		}
		if ( o.do === 'iconize' ) {
			this.iconize ( o );
			return;
		}
		if ( o.do === 'split-horz' ) {
			if ( this.contentFnc ) {
				this.contentFnc ( o );
			}
			return;
		}
	}   //  doAll()

	render() {
		if ( this.state.iconized ) {
			return (
				<div className 			= 'rr-pe-frame'
					 style 				= { this.state.iconized.style }
					 onTransitionEnd	= { this.transitionEnd }
					 onClick			= { this.clickIcon } >
					<div className 	= 'rr-iconized-frame-name'
						 style 		= { this.state.iconized.iconName } >
						FrameName
					</div>
				</div>
			); }
		return (
			<div className = "rr-pe-frame"
				 style = {this.state.style}>
				<TitleBar frameId	= 'frame-1'
						  appFnc 	= { this.appFnc }
						  frameFnc	= { this.doAll } />
				<PEFrameHeader frame	= {this.doAll} />
				<PEFrameContent peId 		= {this.peId} 
								frameFnc 	= {this.doAll} />
				<PEFrameFooter />
				<Sizer frameId 		= 'frame-1'
					   appFnc 	= { this.appFnc }
					   frameFnc	= { this.doAll }  />
			</div>
		)
	}
}

export { PEFrame as default };