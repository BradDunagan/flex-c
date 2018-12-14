import React, { Component } from 'react';

import Frame			from './frame';
import { getPaneId, getLastPaneId, setLastPaneId }	from './pane';

import {diag, diagsFlush, diagsPrint} 	from './diags';


let lastFrameId = 0;

class AppContent extends React.Component {
	constructor ( props ) {
		super ( props );

		this.state = {
			frames: [],             //  PEs, VPs (what else?) to render
		};

		this.eleId = 'rr-app-content';

		this.frames = {};			//	PEs, VPs (what else?) code/interfaces.

		this.cycleFocus	= this.cycleFocus.bind ( this );
		this.addFrame 	= this.addFrame.bind ( this );
		this.addFrames	= this.addFrames.bind ( this );
		this.doAll 		= this.doAll.bind ( this );

		this.focusedFrameId = null;

	}   //  constructor()

	cycleFocus() {
		let sW = 'AppContent cycleFocus()';
		let frameIds = Object.keys ( this.frames );
		frameIds.sort();
		if ( typeof this.focusedFrameId === 'number' ) {
			if ( this.focusedFrameId === 0 ) {
				this.props.appFrameFnc ( { do: 'not-focus-app-title' } );
			}
		}
		else {
			//	First focus on app title display its menu.
			this.props.appFrameFnc ( { do: 'focus-app-title' } );
			this.focusedFrameId = 0;
		}

	}	//	cycleFocus()

	addFrame ( o ) {
		let frame = null, fa = [];
		frame = <Frame key 				= { o.frameId }
					   hdrVisible		= { o.hdrVisible }
					   ftrVisible		= { o.ftrVisible }
					   frameName		= { o.frameName }
					   frameId 			= { o.frameId }
					   paneId			= { o.paneId }
					   appFrameFnc 		= { this.props.appFrameFnc } 
					   appFrameContent	= { this.doAll }
					   left 			= { o.left }
					   top				= { o.top }
					   width 			= { o.width }
					   height			= { o.height }
					   iconized			= { o.iconized }
					   clientFnc		= { this.props.clientFnc } />;

		this.frames[o.frameId] = { frame: 		frame,
								   ccEleId:		o.ccEleId,
								   frameFnc:	null,
								   iconSlot:	null };

		for ( var id in this.frames ) {
			fa.push ( this.frames[id].frame ); }

		this.setState ( { frames: fa } );

		return o.frameId;
	}	//	addFrame()

	addFrames ( a ) {
		let frame = null, fa = [];
		for ( let i = 0; i < a.length; i++ ) {
			let o = a[i];
			frame = <Frame key 				= { o.frameId }
						   hdrVisible		= { o.hdrVisible }
						   ftrVisible		= { o.ftrVisible }
						   frameName		= { o.frameName }
						   frameId 			= { o.frameId }
						   paneId			= { o.paneId }
						   appFrameFnc 		= { this.props.appFrameFnc } 
						   appFrameContent	= { this.doAll }
						   left 			= { o.left }
						   top				= { o.top }
						   width 			= { o.width }
						   height			= { o.height }
						   iconized			= { o.iconized }
						   clientFnc		= { this.props.clientFnc } />;
			this.frames[o.frameId] = { frame: 		frame,
									   ccEleId:		o.ccEleId,
									   frameFnc:	null,
									   iconSlot:	null };
			fa.push ( frame );
		}	//	for ( ... )

		this.setState ( { frames: fa } );
	}	//	addFrames()

	doAll ( o ) {
		let sW = 'AppContent doAll() ' + o.do;
		if ( o.to ) {
			sW += ' to ' + o.to; }
		diag ( [1, 2], sW  );
		if ( o.do === 'set-call-down' ) {
			if ( o.to === 'frame' ) {
				let frame = this.frames[o.frameId];
				if ( ! frame ) {
					console.log ( sW + ' frame of frameId ' + o.frameId 
									 + ' not found' );
					return; }
				frame.frameFnc = o.frameFnc;
				return;
			}
			if ( o.to === 'client-content' ) {
				let frame = this.frames[o.frameId];
				frame.frameFnc ( o )
				return;
			}
			console.log ( sW + 'ERROR set-call-down: unrecognized frame' )
			return;
		}
		if ( o.do === 'cycle-frame-focus' ) {
			this.cycleFocus();
			return;
		}
		if ( o.do === 'get-new-frame-id' ) {
			return { frameId:	++lastFrameId,
					 paneId:	getPaneId() };
		}
		if ( o.do === 'add-frame' ) {
			return this.addFrame ( o );
		}
		if ( o.do === 'add-frames' ) {
			this.addFrames ( o.frames );
		}
		if ( o.do === 'get-state' ) {
			let state = { lastFrameId: 	lastFrameId,
						  lastPaneId:	getLastPaneId(),
						  frames:		{} };
			for ( let frameId in this.frames ) {
				let frm = this.frames[frameId];
				state.frames[frameId] = {
					frame:		frm.frameFnc ( o ),
					iconSlot:	Object.assign ( {}, frm.iconSlot ) } }
			return state;
		}
		if ( o.do === 'set-state' ) {
			lastFrameId = o.state.lastFrameId;
			setLastPaneId ( o.state.lastPaneId );
			//	The rest is done by the app.
			return;
		}
		if ( o.do === 'clear' ) {
			this.frames = {};
			this.setState ( { frames: [] } );
		}
		if ( o.do === 'ensure-frame-z-is-top' ) {
			//	Put frame o.frameId last to be rendered.
			let i, j, fa = this.state.frames;

			for ( i = 0; i < fa.length; i++ ) {
				if ( fa[i].props.frameId === o.frameId ) {
					break; } }
			if ( i >= fa.length ) {
				return; }
		//	console.log ( sW + ' ensure-frame-z-is-top i: ' + i );
			if ( i === fa.length - 1 ) {
				return;	}

			fa = [];

			for ( j = 0; j < this.state.frames.length; j++ ) {
				if ( j === i ) {
					continue; }
				fa.push ( this.state.frames[j] ); }
			fa.push ( this.state.frames[i] )

			this.setState ( { frames: fa } );
			return;
		}
		if ( o.do === 'get-icon-slot' ) {
			let x = 20;
			let y = 20;
			let lookAgain = true;
			while ( lookAgain ) {
				lookAgain = false;
				for ( var id in this.frames ) {
					let frm = this.frames[id];
					if ( Number.parseInt ( id ) === o.frameId ) {
						if ( frm.iconSlot ) {
							return frm.iconSlot; 
						} 
					}
					if ( frm.iconSlot && (frm.iconSlot.y === y) ) {
						y += 95;	lookAgain = true;
						break; 
					}
				}	//	for ( ...
			}	//	while ( ...
			let iconSlot = {
				x: 		x,
				y:		y 
			};
			this.frames[o.frameId].iconSlot = iconSlot;
			return iconSlot;
		}
		if ( o.do === 'append-menu-items' ) {
			this.props.clientFnc ( o );
			return;
		}
		if ( o.do === 'menu-item' ) {
			this.props.clientFnc ( o );
			return;
		}
	}   //  doAll()

	render() {
		const sW = 'AppContent render()';
		diag ( [1], sW );
		return (
			<div id 		= { this.eleId }
				 className 	= "rr-app-content">
				<div className = "rr-mird-container">
					<span className = "rr-mird-span">
						<p>- robots work better with more data -</p>
						<p>- minimal impedance robot development -</p>
					</span>
				{this.state.frames}
				</div>
			</div>
		);
	}   //  render()

	componentDidMount() {
		const sW = 'AppContent componentDidMount()';
		diag ( [1], sW );

		this.props.appFrameFnc ( { do: 'set-call-down',
								   to:	'app-content',
								   fnc:	this.doAll } );
		this.props.clientFnc ( { do: 	'set-call-down',
								 to: 	'app-frame',
								 fnc:	this.props.appFrameFnc } );
		this.props.clientFnc ( { do: 	'set-call-down',
								 to: 	'app-content',
								 eleId:	this.eleId,
								 fnc:	this.doAll } );
	}	//	componentDidMount()

	componentDidUpdate() {
		const sW = 'AppContent componentDidUpdate()';
		diag ( [1], sW );

	}	//	componentDidUpdate()

}   //  AppContent()



export default AppContent;
