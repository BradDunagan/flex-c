/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React, { Component } from 'react';

import ButtonBar 			from './button-bar';

let lastBtnBarId = 0;

class PaneButtonBarsContainer extends Component {
	constructor ( props ) {
		super ( props );

		this.state = {
			buttonBars: []
		}

		this.doAll 				= this.doAll.bind ( this );
		this.setButtonBarsState	= this.setButtonBarsState.bind ( this );

	//	this.rootPaneFnc 	= null;

		this.buttonBars = {};

	}	//	constructor
	
	doAll ( o ) {
		const sW = 'PaneButtonBarsContainer doAll()';
		if ( o.do === 'set-call-down' ) {
			if ( o.to === 'button-bar' ) {
				console.log ( sW + ' bbFnc' );
				this.buttonBars[o.bbEleId].buttonBarFnc = o.bbFnc;
			//	if ( this.rootPaneFnc && o.needPaneFnc ) {
			//		o.bbFnc ( { do:			'set-pane-fnc',
			//					paneFnc:	this.rootPaneFnc } ); }
			}
			return; }
	//	if ( o.do === 'set-root-pane-fnc' ) {
	//		console.log ( sW + ' rootPaneFnc' );
	//		this.rootPaneFnc = o.rootPaneFnc;
	//		let keys = Object.keys ( this.buttonBars );
	//		if ( keys.length === 1 ) {
	//			let bb = this.buttonBars[keys[0]];
	//			bb.paneFnc = this.rootPaneFnc;
	//			if ( bb.buttonBarFnc ) {
	//				bb.buttonBarFnc ( { do:			'set-pane-fnc',
	//									paneFnc:	this.rootPaneFnc } ); }
	//		}
	//		return;
	//	}
		if ( (o.do === 'split-horz') || (o.do === 'split-vert') ) {
			console.log ( sW + ' split-horz/vert' );
			//	Remove the button bar. Then call the pane to do the split.
			delete this.buttonBars[o.bbEleId];
			this.setButtonBarsState ( () => {
				o.paneFnc ( o );
			} );
			return;
		}
		if ( o.do === 'add-pane-btn-bar' ) {
			console.log ( sW + ' add-pane-btn-bar' );
			let eleId = 'bb-' + ++lastBtnBarId;
			this.buttonBars[eleId] = { buttonBar: 		null,
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
			console.log ( sW + ' clear-pane-btn-bars' );
			this.buttonBars = {};
			this.setButtonBarsState();
			return;
		}
		if ( o.do === 'remove-pane-btn-bar' ) {
			console.log ( sW + ' remove-pane-btn-bar' );
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
		return (
			<div id				= { 'bb-container' }
				 className		= 'rr-pane-button-bars-container' >
				{ this.state.buttonBars }
			</div>
		);
	}   //  render()

	setButtonBarsState ( fnc ) {
		const sW = 'PaneButtonBarsContainer setButtonBarsState()';
		let bba = [];
		let bbId = 0;
		for ( var eleId in this.buttonBars ) {
			bba.push ( ' ' + eleId ); }
		console.log ( sW + ' BB eleIds: ' + bba );
		bba = [];
		for ( var eleId in this.buttonBars ) {
			let d = this.buttonBars[eleId];
			d.buttonBar = <ButtonBar key 			= { ++bbId }
									 eleId			= { eleId }
									 containerFnc	= { this.doAll }
									 paneFnc		= { d.paneFnc }
									 isForRootPane	= { d.isForRootPane } />;
			bba.push ( d.buttonBar );
		}
		this.setState ( { buttonBars: bba }, fnc );
	}	//	setButtonBarsState()

	componentDidMount() {
		const sW = 'PaneButtonBarsContainer componentDidMount()';
		console.log ( sW );
		let eleId1 = 'bb-' + ++lastBtnBarId;
		this.buttonBars[eleId1] = { buttonBar: 		null,
									buttonBarFnc:	null,
								//	paneFnc:		null };
									paneFnc:		this.props.rootPaneFnc,
									isForRootPane:	true };
							   
		this.setButtonBarsState ( () => {
		//	this.props.ttbFnc ( { do: 		'set-call-down',
		//						  to:		'pane-button-bars-container',
		//						  pbbcFnc:	this.doAll } );
		} );
		this.props.ttbFnc ( { do: 		'set-call-down',
							  to:		'pane-button-bars-container',
							  pbbcFnc:	this.doAll } );
	}	//	componentDidMount()

	componentDidUpdate() {

	}	//	componentDidUpdate()

}   //  class PaneButtonBarsContainer

export default PaneButtonBarsContainer;
