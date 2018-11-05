import React, { Component } from 'react';

import PEFrame          from './pe-frame';

class AppContent extends React.Component {
	constructor ( props ) {
		super ( props );

		this.state = {
			frames: [],             //  PEs, VPs (what else?) to render
		};
		
		this.frames = {};			//	PEs, VPs (what else?) code/interfaces.

		this.doAll 		= this.doAll.bind ( this );

	}   //  constructor()

	async doAll ( o ) {
		const sW = 'AppContent doAll()'
		if ( o.do === 'set-call-down' ) {
			if ( 	(o.to === 'PEFrame')
				 || (o.to === 'VPFrame') ) {
				let frame = this.frames[o.frameId];
				if ( ! frame ) {
					console.log ( sW + ' frame of frameId ' + o.frameId 
									 + ' not found' );
					return;
				}
				frame.doAll = o.fnc;
				return;
			}
			console.log ( sW + 'ERROR set-call-down: unrecognized frame' )
			return;
		}
	}   //  doAll()

	render() {
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
		let frameId = 1;
		let frame = <PEFrame key = {frameId}
							 frameId = {frameId}
							 appFrameFnc = {this.props.appFrameFnc} 
							 appFrameContent = {this.doAll}
							 left 	= '30px' 
							 top	= '30px'
							 width 	= '400px'
							 height	= '460px' />;
		this.setState ( { frames: [ frame ] } );

		this.frames[frameId] = { frame: 	frame,
								 doAll: 	null };
	}

}   //  AppContent()


export default AppContent;
