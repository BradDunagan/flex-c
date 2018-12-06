import React, { Component } from 'react';
import './App.css';

import AppHeader 			from './app-header';
import AppContent 			from './app-content';
import AppFooter 			from './app-footer';

import AppDialog			from './app-dialog';

class AppFrame extends Component {
	constructor ( props ) {
		super ( props );

		this.state = {
			appDialog:  [],
		};

		this.dlgList = [];

		this.mouseMove 		= this.mouseMove.bind ( this );
		this.mouseUp 		= this.mouseUp.bind ( this );
		this.doAll 			= this.doAll.bind ( this );
	
	
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
	//	console.log ( sW );
		if ( this.frameMoving.moverMouseDown ) {
			this.frameMoving.frameFnc ( { do: 	'move',
										  dX:	ev.pageX - this.frameMoving.startX,
										  dY:	ev.pageY - this.frameMoving.startY } );
			ev.preventDefault();
			return;	}
		if ( this.frameSizing.sizerMouseDown ) {
			this.frameSizing.frameFnc ( { do: 	'size',
										  dX:	ev.pageX - this.frameSizing.startX,
										  dY:	ev.pageY - this.frameSizing.startY,
										  visitedPanes:	{} } );
			ev.preventDefault();
			return;	}
	}	//	mouseMove()

	mouseUp ( ev ) {
		let sW = 'mouseUp()';
	//	console.log ( sW );
		if ( this.frameMoving.moverMouseDown ) {
			this.frameMoving.moverMouseDown	= false;
			this.frameMoving.frameFnc		= null;
			return;	}
		if ( this.frameSizing.sizerMouseDown ) {
			this.frameSizing.sizerMouseDown	= false;
			this.frameSizing.frameFnc		= null;
			return;	}
	}	//	mouseUp()

	updateDialogState() {
		this.setState ( {  
			appDialog: this.dlgList.map ( ( r, i ) => {
				if ( ! r.mnu ) {
					return ( <AppDialog key = {i}
										upFncAppFrame = {this.doAll}
										upFnc = {r.upFnc}
										ctx = {r.ctx}
										dlg = {r.dlg}
										mnu = {r.mnu} /> );
				} else {
					return ( <AppDialog key = {i}
										upFncAppFrame = {this.doAll}
										dlg = {r.dlg}
										mnu = {r.mnu} /> );
				}
			} )
		} );
	}	//	updateDialogState()

	doAll ( o ) {
		if ( o.do === 'move-frame' ) {
			this.frameMoving.moverMouseDown	= true;
			this.frameMoving.frameFnc 		= o.frameFnc;
			this.frameMoving.startX			= o.ev.pageX;
			this.frameMoving.startY			= o.ev.pageY;
			return;
		}
		if ( o.do === 'size-frame' ) {
			this.frameSizing.sizerMouseDown	= true;
			this.frameSizing.frameFnc 		= o.frameFnc;
			this.frameSizing.startX			= o.ev.pageX;
			this.frameSizing.startY 		= o.ev.pageY;
			return;
		}
		if ( o.do === 'show-sign-in-dlg' ) {
			this.dlgList.push ( { dlg: 		'sign-in',
								  upFnc: 	this.doAll,
								  ctx: 		null } );
			this.updateDialogState();
			return;
		}
		if ( o.do === 'show-name-dlg' ) {
			this.dlgList.push ( { dlg: 		'dlg-name',
								  upFnc: 	o.upFnc,
								  ctx: 		o.ctx } );
			this.updateDialogState();
			return;
		}
		if ( o.do === 'show-menu' ) {
			this.dlgList.push ( { dlg: 		'menu',
								  mnu:		o } );
			this.updateDialogState();
			return;
		}
		if ( (o.do === 'menu-dismiss')  ||  (o.do === 'close-dlg') ) {
			this.dlgList.pop();
			this.updateDialogState();
			return;
		}
	}	//	doAll()

	render() {
		return (
			<div className		= 'rr-app-frame'
				 onMouseMove	= { this.mouseMove } 
				 onMouseUp		= { this.mouseUp } >
				<AppHeader clientFnc   = { this.props.clientFnc }
						   appFrameFnc = { this.doAll } />
				<AppContent clientFnc 	= { this.props.clientFnc }
							appFrameFnc = { this.doAll } />
				<AppFooter />
				{ this.state.appDialog }
			</div>
		);
	}	//	render()
} //  class AppFrame

export default AppFrame;
