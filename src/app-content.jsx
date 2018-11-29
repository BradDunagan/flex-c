import React, { Component } from 'react';

import PEFrame          from './pe-frame';
import { getPaneId }	from './pane';

import {diag, diagsFlush, diagsPrint} 	from './diags';


let lastFrameId = 0;

class AppContent extends React.Component {
	constructor ( props ) {
		super ( props );

		this.state = {
			frames: [],             //  PEs, VPs (what else?) to render
		};
		
		this.frames = {};			//	PEs, VPs (what else?) code/interfaces.

		this.doAll 		= this.doAll.bind ( this );

	}   //  constructor()

	doAll ( o ) {
		const sW = 'AppContent doAll()'
		let frame = null;
		if ( o.do === 'set-call-down' ) {
			if ( o.to === 'frame' ) {
				diag ( [1], sW + ': set-call-down to frame' );
				frame = this.frames[o.frameId];
				if ( ! frame ) {
					console.log ( sW + ' frame of frameId ' + o.frameId 
									 + ' not found' );
					return; }
				frame.frameFnc = o.frameFnc;
				return;
			}
			if ( o.to === 'client-content' ) {
				diag ( [1, 2], sW + ': set-call-down to client-content' );
				frame = this.frames[o.frameId];
				frame.frameFnc ( o )
				return;
			}
			console.log ( sW + 'ERROR set-call-down: unrecognized frame' )
			return;
		}
		if ( o.do === 'get-new-frame-id' ) {
			return { frameId:	++lastFrameId,
					 paneId:	getPaneId() };
		}
		if ( o.do === 'add-frame' ) {
			diag ( [1], sW + ': add-frame' );
			let fa = [];
			frame = <PEFrame key 			 = { o.frameId }
							 frameId 		 = { o.frameId }
							 paneId			 = { o.paneId }
							 appFrameFnc 	 = { this.props.appFrameFnc } 
							 appFrameContent = { this.doAll }
							 left 	= { o.left }
							 top	= { o.top }
							 width 	= { o.width }
							 height	= { o.height }

						//	 contentStyle	= { o.parentStyle }
						//	 ccEleId		= { o.ccEleId }
						//	 clientContent	= { o.content } 
							 
							 clientFnc		= { this.props.clientFnc } />;

			this.frames[o.frameId] = { frame: 		frame,
									   ccEleId:		o.ccEleId,
									   frameFnc:	null };

			for ( var id in this.frames ) {
				fa.push ( this.frames[id].frame ); }

			this.setState ( { frames: fa } );

			return o.frameId;
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
			<div className = "rr-app-content">
				<div className = "rr-mird-container">
					<span className = "rr-mird-span">
						- minimal impedance robot development -
					</span>
				{this.state.frames}
				</div>
			</div>
		);
	}   //  render()

	componentDidMount() {
		const sW = 'AppContent componentDidMount()';
		diag ( [1], sW );

		this.props.clientFnc ( { do: 	'set-call-down',
								 to: 	'app-frame',
								 fnc:	this.props.appFrameFnc } );
		this.props.clientFnc ( { do: 	'set-call-down',
								 to: 	'app-content',
								 fnc:	this.doAll } );

	//	let frameId = ++lastFrameId;
	//	let frame = <PEFrame key = {frameId}
	//						 frameId = {frameId}
	//						 appFrameFnc = {this.props.appFrameFnc} 
	//						 appFrameContent = {this.doAll}
	//						 left 	= '30px' 
	//						 top	= '30px'
	//						 width 	= '400px'
	//						 height	= '460px' />;
	//
	//	this.frames[frameId] = { frame: 	frame,
	//							 doAll: 	null };
	//
	//	let frames = this.state.frames;
	//	frames.push ( frame );							 
	//	this.setState ( { frames: frames } );
	}	//	componentDidMount()

	componentDidUpdate() {
		const sW = 'AppContent componentDidUpdate()';
		diag ( [1], sW );

	}	//	componentDidUpdate()

}   //  AppContent()



export default AppContent;
