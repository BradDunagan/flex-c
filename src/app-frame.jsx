import React, { Component } from 'react';
import './App.css';

import AppHeader 			from './app-header';
import AppContent 			from './app-content';
import AppFooter 			from './app-footer';

class AppFrame extends Component {
	constructor ( props ) {
		super ( props );

		this.mouseMove 		= this.mouseMove.bind ( this );
		this.mouseUp 		= this.mouseUp.bind ( this );
		this.doIt 			= this.doIt.bind ( this );
	
	
		this.frameMoving = {
			moverMouseDown: 	false,
			frameFnc:			null,
			startX: 			0,
			startY: 			0
		};
		this.frameSizing = {
			sizerMouseDown: 	false,
			frameFnc:			null,
			startX: 			0,
			startY: 			0
		};
	}	//	constructor()

	mouseMove ( ev ) {
		let sW = 'mouseMove()';
		console.log ( sW );
		if ( this.frameMoving.moverMouseDown ) {
			this.frameMoving.frameFnc ( { do: 	'move',
										  dX:	ev.pageX - this.frameMoving.startX,
										  dY:	ev.pageY - this.frameMoving.startY } );
			ev.preventDefault();
			return;	}
		if ( this.frameSizing.sizerMouseDown ) {
			this.frameSizing.frameFnc ( { do: 	'size',
										  dX:	ev.pageX - this.frameSizing.startX,
										  dY:	ev.pageY - this.frameSizing.startY } );
			ev.preventDefault();
			return;	}
	}	//	mouseMove()

	mouseUp ( ev ) {
		let sW = 'mouseUp()';
		console.log ( sW );
		if ( this.frameMoving.moverMouseDown ) {
			this.frameMoving.moverMouseDown	= false;
			this.frameMoving.frameFnc		= null;
			return;	}
		if ( this.frameSizing.sizerMouseDown ) {
			this.frameSizing.sizerMouseDown	= false;
			this.frameSizing.frameFnc		= null;
			return;	}
	}	//	mouseUp()

	doIt ( o ) {
		if ( o.do === 'move-frame' ) {
			this.frameMoving.moverMouseDown	= true;
			this.frameMoving.frameFnc 		= o.frameFnc;
			this.frameMoving.startX			= o.ev.pageX;
			this.frameMoving.startY			= o.ev.pageY;
		}
		if ( o.do === 'size-frame' ) {
			this.frameSizing.sizerMouseDown	= true;
			this.frameSizing.frameFnc 		= o.frameFnc;
			this.frameSizing.startX			= o.ev.pageX;
			this.frameSizing.startY 		= o.ev.pageY;
		}
	}	//	doIt()

	render() {
		return (
			<div className		= 'rr-app-frame'
				 onMouseMove	= { this.mouseMove } 
				 onMouseUp		= { this.mouseUp } >
				<AppHeader />
				<AppContent appFrameFnc = { this.doIt } />
				<AppFooter />
			</div>
		);
	}	//	render()
} //  class AppFrame

export default AppFrame;
