import React, { Component } from 'react';

import FrameBurgerMenu      from './frame-burger-menu';
import FrameIconize			from './frame-iconize';
import FrameDestroy			from './frame-destroy';
import BtnSplitHorz 		from './btn-split-horz';

class TitleBar extends Component {
	constructor ( props ) {
		super ( props );
		this.id 		= 'title-bar-' + props.frameId;
		this.appFnc 	= props.appFnc;
		this.frameFnc 	= props.frameFnc;
		this.state = {
			style: {
				left:	'0px',
				top:	'0px',
				width:	'0px',
				height:	'18px'
			}
		};
		this.doAll 		= this.doAll.bind ( this );
		this.mouseDown	= this.mouseDown.bind ( this );
		this.mouseUp	= this.mouseUp.bind ( this );

		this.sizeW0 = 0;

		this.frameFnc ( { do: 		    'title-bar-call-down',
						  titleBarFnc:  this.doAll } );
	}	//	constructor
	
	doAll ( o ) {
		if ( o.do === 'size-start' ) {
			this.sizeW0 = Number.parseInt ( this.state.style.width );
			return;
		}
		if ( o.do === 'size' ) {
			this.setState ( {
				style: {
					left:	this.state.style.left,
					top:	this.state.style.top,
					width:	(this.sizeW0 + o.dX) + 'px',
					height:	this.state.style.height
				}
			} );
			return;
		}
	}

	mouseDown ( ev ) {
		let sW = 'mouseDown()';
		console.log ( sW );
		this.sizeX0 = Number.parseInt ( this.state.style.left );
		this.sizeY0 = Number.parseInt ( this.state.style.top );
		this.frameFnc ( { do: 	'move-start',
						  ev: 	ev } );
	}	//	mouseDown()

	mouseUp ( ev ) {
		let sW = 'mouseUp()';
		console.log ( sW );
	}	//	mouseUp()
	
	render() {
		return (
			<div id				= { this.id }
				 className		= 'rr-title-bar'
				 style			= { this.state.style }
				 onMouseDown	= { this.mouseDown }
				 onMouseUp		= { this.mouseUp } >
				<FrameBurgerMenu frameFnc 	= { this.frameFnc } />
				<FrameDestroy frameFnc 		= { this.frameFnc } />
				<FrameIconize frameFnc 		= { this.frameFnc } />
				<BtnSplitHorz frameFnc 		= { this.frameFnc } />
			</div>
		);
	}   //  render()

	componentDidMount() {
		let e = document.getElementById ( this.id );
		let p = e.parentElement;
		this.setState ( { 
			style: {
				left:	this.state.style.left,
				top:	this.state.style.top,
				width: 	(p.clientWidth - 0) + 'px',
				height:	this.state.style.height
			}
		} );
	}	//	componentDidMount()

}   //  class TitleBar

export default TitleBar;
