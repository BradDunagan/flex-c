/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React, { Component } from 'react';

import FrameHeaderTitleBar		from './pe-frame-header-title-bar';
import PaneButtonBarsContainer	from './pane-button-bars-container';

import {diag, diagsFlush, diagsPrint} 	from './diags';

class TransientTitleBar extends Component {
	constructor ( props ) {
		const sW = 'TransientTitleBar constructor()';
		diag ( [4], sW );
		super ( props );
		this.eleId 			= 'transient-title-bar-' + props.frameEleId;
		this.appFnc 		= props.appFnc;
		this.frameFnc 		= props.frameFnc;
		this.pbbcFnc		= null;		//	Pane ButtonBar Container
//		this.rootPaneFnc	= null;
		this.state = {
			style: {
				width:	'0px',
			},
		};

		this.doAll = this.doAll.bind ( this );
	}	//	constructor
	
	doAll ( o ) {
		let sW = 'TransientTitleBar doAll() ' + o.do;
		if ( o.to ) {
			sW += ' to ' + o.to; }
		diag ( [4], sW );
		if ( o.do === 'set-call-down' ) {
			if ( o.to === 'pane-button-bars-container' ) {
				this.pbbcFnc = o.pbbcFnc; 
			//	if ( this.rootPaneFnc ) {
			//		this.pbbcFnc ( { do:			'set-root-pane-fnc',
			//						 rootPaneFnc:	this.rootPaneFnc } ); } 

				//	Important that we do this here because it indicates to
				//	the frame that all is set up here (specifically, pbbcFnc).
			//	this.frameFnc ( { do: 		    'title-bar-call-down',
			//					  titleBarFnc:  this.doAll } );
			}
			return;
		}
		if ( o.do === 'set-root-pane-fnc' ) {
	//		this.rootPaneFnc = o.rootPaneFnc;
			if ( this.pbbcFnc ) {
				this.pbbcFnc ( o ); }
			return;
		}
		if ( o.do === 'size-start' ) {
			this.sizeW0 = Number.parseInt ( this.state.style.width );
			return;
		}
		if ( o.do === 'size' ) {
			this.setState ( {
				style: {
					width:	(this.sizeW0 + o.dX) + 'px'
				}
			} );
			return;
		}
		if ( o.do === 'add-pane-btn-bar' ) {
			if ( this.pbbcFnc ) {
				this.pbbcFnc ( o ); }
			return;
		}
		if ( o.do === 'clear-pane-btn-bars' ) {
			if ( this.pbbcFnc ) {
				this.pbbcFnc ( o ); }
			return;
		}
		if ( o.do === 'remove-pane-btn-bar' ) {
			if ( this.pbbcFnc ) {
				this.pbbcFnc ( o ); }
			return;
		}
	}	//	doAll()

	render() {
		const sW = 'TransientTitleBar render()';
		diag ( [4], sW );
		return (
			<div id			= { this.eleId }
				 className	= 'rr-transient-title-bar'
				 style		= { this.state.style } >
				<FrameHeaderTitleBar frameId		= { this.props.frameId }
								     frameEleId 	= { this.props.frameEleId }
									 appFnc 		= { this.appFnc }
									 frameFnc		= { this.frameFnc } />
				<PaneButtonBarsContainer frameId		= { this.props.frameId }
								   		 frameFnc 		= { this.frameFnc }
									//	 rootPaneFnc	= { this.props.rootPaneFnc }
										 ttbFnc			= { this.doAll } />
			</div>
		);
		/*
		return (
			<div id				= { this.eleId }
				 className		= 'rr-transient-title-bar'
				 style			= { this.state.style } >
			</div>
		);
		*/
	}   //  render()

	componentDidMount() {
		const sW = 'TransientTitleBar componentDidMount()';
		diag ( [4], sW );
		let e = document.getElementById ( this.eleId );
		let p = e.parentElement;
		this.setState ( { 
			style: {
				width: 	(p.clientWidth - 0) + 'px'
			}
		} );

		this.frameFnc ( { do: 		    'set-call-down',
						  to:			'title-bar',
						  titleBarFnc:  this.doAll } );
	}	//	componentDidMount()

}   //  class TransientTitleBar

export default TransientTitleBar;
