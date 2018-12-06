/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React, { Component } from 'react';

/*
import ButtonBar 			from './button-bar';

let lastBtnBarId = 0;
*/
import { ButtonBar, nextBtnBarId } 		from './button-bar';

import {diag, diagsFlush, diagsPrint} 	from './diags';


class PaneButtonBarsContainer extends Component {
	constructor ( props ) {
		let sW = props.frameId + ' PaneButtonBarsContainer constructor()';
		diag ( [4], sW );
		super ( props );

		this.eleId = 'rr-bb-container-' + props.frameId;

		this.state = {
			buttonBars: []
		}

		this.doAll 				= this.doAll.bind ( this );
		this.setButtonBarsState	= this.setButtonBarsState.bind ( this );

		this.rootPaneFnc 	= null;

		this.buttonBars = {};

	}	//	constructor
	
	doAll ( o ) {
		let sW = this.props.frameId + ' PaneButtonBarsContainer  doAll() ' 
									+ o.do;
		if ( o.to ) {
			sW += ' to ' + o.to; }
		diag ( [4], sW );
		if ( o.do === 'set-call-down' ) {
			if ( o.to === 'button-bar' ) {
			//	console.log ( sW + ' bbFnc' );
				this.buttonBars[o.bbEleId].buttonBarFnc = o.bbFnc; }
			return; }

		if ( o.do === 'set-root-pane-fnc' ) {
			this.rootPaneFnc = o.paneFnc;
			let bbId  = nextBtnBarId();
			let eleId = 'rr-bb-' + bbId;
			this.buttonBars[eleId]  = { bbId:			bbId,
										buttonBar: 		null,
										buttonBarFnc:	null,
										paneFnc:		this.rootPaneFnc,
										isForRootPane:	true };
								
			this.setButtonBarsState ( () => {
			} );
			return; }

		if ( (o.do === 'split-horz') || (o.do === 'split-vert') ) {
		//	console.log ( sW + ' split-horz/vert' );
			//	Remove the button bar. Then call the pane to do the split.
			delete this.buttonBars[o.bbEleId];
			this.setButtonBarsState ( () => {
				o.paneFnc ( o );
			} );
			return;
		}
		if ( o.do === 'add-pane-btn-bar' ) {
		//	console.log ( sW + ' add-pane-btn-bar' );
			let bbId  = nextBtnBarId();
			let eleId = 'rr-bb-' + bbId;
			this.buttonBars[eleId] = { bbId:			bbId,
									   buttonBar: 		null,
									   buttonBarFnc:	null,
							   		   paneFnc:			o.paneFnc,
									   isForRootPane:	false };
			this.setButtonBarsState ( () => {
				let d = this.buttonBars[eleId];
				d.buttonBarFnc ( { do: 		'set-left-and-width',
								   left:	o.paneLeft,
								   width:	o.paneWidth } );
			} );
			return;
		}
		if ( o.do === 'clear-pane-btn-bars' ) {
		//	console.log ( sW + ' clear-pane-btn-bars' );
			this.buttonBars = {};
			this.setButtonBarsState();
			return;
		}
		if ( o.do === 'remove-pane-btn-bar' ) {
		//	console.log ( sW + ' remove-pane-btn-bar' );
			if ( this.buttonBars[o.bbEleId] ) {
				delete this.buttonBars[o.bbEleId];
				this.setButtonBarsState(); }
			return;
		}
		if ( o.do === 'button-bar-move' ) {
			return;
		}
	}   //  doAll()

	render() {
		let sW = this.props.frameId + ' PaneButtonBarsContainer render()';
		diag ( [4], sW );
		return (
			<div id				= { this.eleId }
				 className		= 'rr-pane-button-bars-container' >
				{ this.state.buttonBars }
			</div>
		);
	}   //  render()

	setButtonBarsState ( fnc ) {
		let sW =   this.props.frameId 
				 + ' PaneButtonBarsContainer setButtonBarsState()';
		diag ( [4], sW );
		let bba = [];
		let key = 0;
		for ( var eleId in this.buttonBars ) {
			bba.push ( ' ' + eleId ); }
	//	console.log ( sW + ' BB eleIds: ' + bba );
		bba = [];
		for ( var eleId in this.buttonBars ) {
			let d = this.buttonBars[eleId];
			d.buttonBar = <ButtonBar key 			= { ++key }
									 bbId 			= { d.bbId }
									 eleId			= { eleId }
									 containerFnc	= { this.doAll }
									 paneFnc		= { d.paneFnc }
									 isForRootPane	= { d.isForRootPane } />;
			bba.push ( d.buttonBar );
		}
		this.setState ( { buttonBars: bba }, fnc );
	}	//	setButtonBarsState()

	componentDidMount() {
		const sW = this.props.frameId 
				 + ' PaneButtonBarsContainer componentDidMount()';
		diag ( [4], sW );
	
	//	let bbId  = nextBtnBarId();
	//	let eleId = 'rr-bb-' + bbId;
	//	this.buttonBars[eleId]  = { bbId:			bbId,
	//								buttonBar: 		null,
	//								buttonBarFnc:	null,
	//							//	paneFnc:		null };
	//								paneFnc:		this.props.rootPaneFnc,
	//								isForRootPane:	true };
	//						   
	//	this.setButtonBarsState ( () => {
	//	//	this.props.ttbFnc ( { do: 		'set-call-down',
	//	//						  to:		'pane-button-bars-container',
	//	//						  pbbcFnc:	this.doAll } );
	//	} );

		this.props.ttbFnc ( { do: 		'set-call-down',
							  to:		'pane-button-bars-container',
							  pbbcFnc:	this.doAll } );
	}	//	componentDidMount()

	componentDidUpdate() {
		const sW = this.props.frameId 
				 + ' PaneButtonBarsContainer componentDidUpdate()';
		diag ( [4], sW );

	}	//	componentDidUpdate()

}   //  class PaneButtonBarsContainer

export default PaneButtonBarsContainer;

