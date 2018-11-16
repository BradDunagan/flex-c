/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React, { Component } from 'react';

import FrameBurgerMenu      from './frame-burger-menu';
import FrameIconize			from './frame-iconize';
import FrameDestroy			from './frame-destroy';

class FrameHeaderTitleBar extends Component {
	constructor ( props ) {
		super ( props );
		this.eleId 		= 'title-bar-' + props.frameEleId;
		this.appFnc 	= props.appFnc;
		this.frameFnc 	= props.frameFnc;
		this.state = {
			style: {
			},
		};

		this.doAll 			= this.doAll.bind ( this );
		this.mouseDown		= this.mouseDown.bind ( this );
		this.mouseUp		= this.mouseUp.bind ( this );
	}	//	constructor
	
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
	
	doAll ( o ) {
	}   //  doAll()

	render() {
		return (
			<div id				= { this.eleId }
				 className		= 'rr-frame-header-title-bar'
				 style			= { this.state.style }
				 onMouseDown	= { this.mouseDown }
				 onMouseUp		= { this.mouseUp } >
				<FrameBurgerMenu frameFnc 	= { this.frameFnc } />
				<FrameDestroy frameFnc 		= { this.frameFnc } />
				<FrameIconize frameFnc 		= { this.frameFnc } />
			</div>
		);
	}   //  render()

	componentDidMount() {
	//	let e = document.getElementById ( this.eleId );
	//	let p = e.parentElement;
	//	this.setState ( { 
	//		style: {
	//			left:	this.state.style.left,
	//			top:	this.state.style.top,
	//			width: 	(p.clientWidth - 0) + 'px',
	//			height:	this.state.style.height
	//		}
	//	} );
	}	//	componentDidMount()

}   //  class FrameHeaderTitleBar

export default FrameHeaderTitleBar;
