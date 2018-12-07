import React, { Component } from 'react';

import BtnBurger 			from './btn-burger';
import BtnSplitHorz 		from './btn-split-horz';
import BtnSplitVert 		from './btn-split-vert';

import {diag, diagsFlush, diagsPrint} 	from './diags';

let lastBtnBarId = 0;

function nextBtnBarId() {
	return ++lastBtnBarId;
}

class ButtonBar extends Component {
	constructor ( props ) {
		const sW = 'ButtonBar constructor()';
		diag ( [4], sW );
		super ( props );
	//	console.log ( 'ButtonBar constructor()' );
		this.state = {
			style: {
				//	Assuming not for the root pane.
			},
			styleSplitHorz: {
		//		left: 	'0px'
			},
			styleSplitVert: {
		//		left: 	'0px'
			}
		};
		if ( props.left && props.width ) {
			this.state.style = { left:	props.left  + 'px',
								 width:	props.width + 'px' }; }

		this.mouseEnter		= this.mouseEnter.bind ( this );
		this.mouseLeave		= this.mouseLeave.bind ( this );
		this.doAll 			= this.doAll.bind ( this );

	//	this.sizeW0 = 0;

		this.bshFnc 	= null;
		this.bsvFnc		= null;
	//	this.paneFnc	= null;

	//	if ( props.paneFnc ) {
	//		props.paneFnc ( { do:				'button-bar-call-down',
	//						  buttonBarFnc:		this.doAll } ); }
	//	else {
	//	if ( ! props.paneFnc ) {
	//		//	for the root pane
		if ( props.isForRootPane ) {
			this.state.style = {
				width:				'100%',
				opacity:			'1.0',
				transitionProperty:	'none'
			}
		}
	}	//	constructor
	
	mouseEnter ( ev ) {
		let sW = 'ButtonBar mouseEnter()';
	//	console.log ( sW );
	//	let isAtTop = this.props.paneFnc ( { do: 'is-at-frame-top-border' } );
	//	if ( isAtTop ) {
	//		console.log ( sW + ' also need to show frame top button bar' );
	//	}
	}	//	mouseEnter()
	
	mouseLeave ( ev ) {
		let sW = 'ButtonBar mouseLeave()';
	//	console.log ( sW );
	}	//	mouseLeave()
	
	doAll ( o ) {
		let sW = 'ButtonBar doAll() ' + o.do;
		if ( o.to ) {
			sW += ' to ' + o.to; }
		diag ( [4], sW );
		if ( o.do === 'set-call-down' ) {
			if ( o.to === 'btn-split-horz' ) {
			//	console.log ( sW + ' bshFnc' );
				this.bshFnc = o.bshFnc; 
			//	if ( this.paneFnc ) {
			//		this.bshFnc ( { do: 		'set-pane-fnc',
			//						paneFnc:	this.paneFnc } ); }
			}
			if ( o.to === 'btn-split-vert' ) {
			//	console.log ( sW + ' bsvFnc' );
				this.bsvFnc = o.bsvFnc;
			//	if ( this.paneFnc ) {
			//		this.bsvFnc ( { do: 		'set-pane-fnc',
			//						paneFnc:	this.paneFnc } ); }
			}
			return;
		}
	//	if ( o.do === 'set-pane-fnc' ) {
	//		console.log ( sW + ' paneFnc' );
	//		this.paneFnc = o.paneFnc;
	//		if ( this.bshFnc ) {
	//			this.bshFnc ( { do: 		'set-pane-fnc',
	//							paneFnc:	this.paneFnc } ); }
	//		if ( this.bsvFnc ) {
	//			this.bsvFnc ( { do: 		'set-pane-fnc',
	//							paneFnc:	this.paneFnc } ); }
	//		return;
	//	}
		if ( (o.do === 'split-horz') || (o.do === 'split-vert') ) {
		//	let paneFnc = this.paneFnc ? this.paneFnc : this.props.paneFnc;
		//	if ( ! paneFnc ) {
		//		console.log ( sW + ' split ERROR: no paneFnc' );
		//		return; }
			if ( this.props.containerFnc ) {
				o.bbEleId = this.props.eleId;
			//	o.paneFnc = paneFnc;
				o.paneFnc = this.props.paneFnc;
				this.props.containerFnc ( o );
			} else {
			//	paneFnc ( o );	}
				this.props.paneFnc ( o );	}
			return;
		}
		if ( o.do === 'set-left-and-width' ) {
			//	This command implies this button bar is part of the
			//	transient title bar at the top of the frame.  I.e., the top 
			//	of the pane borders the top of the frame.
			this.setState ( { style: {
				left:				o.left  + 'px',
				width:				o.width + 'px',
				opacity:			'1.0',
				transitionProperty:	'none'
			} } );
			return;
		}
		if ( o.do === 'get-left-and-width' ) {
			let style = this.state.style;
			if ( style && style.left && style.width ) {
				return { left: 	Number.parseInt ( style.left ),
						 width:	Number.parseInt ( style.width ) }; }
			return null;
		}
		/*
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
				},
				styleSplitHorz: {
					left: 	(((this.sizeW0 + o.dX) / 2) - 20) + 'px'
				},
				styleSplitVert: {
					left: 	(((this.sizeW0 + o.dX) / 2) + 2) + 'px'
				}
			} );
			return;
		}
		*/
	}	//	doAll()

	render() {
		const sW = 'ButtonBar render()';
		diag ( [4], sW );
		/*
		return (
			<div id				= { this.props.eleId }
				 className		= 'rr-button-bar' >
			</div>
		);
		*/
		let ctnrFnc = this.props.containerFnc ? this.props.containerFnc : null;
		return (
			<div id				= { this.props.eleId }
				 className		= 'rr-button-bar' 
				 style 			= { this.state.style }
				 onMouseEnter	= { this.mouseEnter }
				 onMouseLeave	= { this.mouseLeave }>
				<BtnBurger eleId		= { 'rr-bgr-' + this.props.bbId }
						   containerFnc	= { ctnrFnc }
						   bbFnc		= { this.doAll }
						   paneFnc		= { this.props.paneFnc } />
				<BtnSplitHorz eleId			= { 'rr-sh-' + this.props.bbId }
							  containerFnc	= { ctnrFnc }
							  bbFnc			= { this.doAll }
							  paneFnc		= { this.props.paneFnc } 
							  style 		= { this.state.styleSplitHorz } 
							  contentId		= { 0 } />
				<BtnSplitVert eleId			= { 'rr-sv-' + this.props.bbId }
							  containerFnc	= { ctnrFnc }
							  bbFnc			= { this.doAll }
							  paneFnc		= { this.props.paneFnc } 
							  style 		= { this.state.styleSplitVert } 
							  contentId		= { 0 } />
			</div>
		);
		
	}   //  render()
	
	componentDidMount() {
		const sW = 'ButtonBar componentDidMount()';
		diag ( [4], sW );
		let e  = document.getElementById ( this.props.eleId );
		/*
		let p  = e.parentElement;
		let w  = p.clientWidth;
		let w2 = w / 2;
		*/
		/*
		this.setState ( { 
			styleSplitHorz: {
				left: 	(w2 - 20) + 'px'
			},
			styleSplitVert: {
				left: 	(w2 + 2) + 'px'
			}
		} );
		*/
	//	let paneFnc = this.paneFnc ? this.paneFnc : this.props.paneFnc;
		if ( this.props.containerFnc ) {
			this.props.containerFnc ( { do: 			'set-call-down',
										to:				'button-bar',
										bbEleId:		this.props.eleId,
										bbFnc:			this.doAll  } ); }
								//		needPaneFnc:	(! paneFnc) } ); }

		this.props.paneFnc ( { do: 		'set-call-down',
							   to:		'button-bar',
							   bbEleId:	this.props.eleId,
							   bbFnc:	this.doAll } );	
	}	//	componentDidMount()
	
	componentWillUnmount() {
		const sW = 'ButtonBar componentWillUnmount()';
		diag ( [4], sW );
		let e  = document.getElementById ( this.props.eleId );
	//	console.log ( 'ButtonBar will unmount. e: ' + e );
	}

	componentDidUpdate() {
		const sW = 'ButtonBar componentDidUpdate()';
		diag ( [4], sW );
	//	let e  = document.getElementById ( this.props.eleId );
		/*
		if ( ! e ) {
			return; }
		let p  = e.parentElement;
		let w  = p.clientWidth;
		let w2 = w / 2;
		this.setState ( { 
			styleSplitHorz: {
				left: 	(w2 - 20) + 'px'
			},
			styleSplitVert: {
				left: 	(w2 + 2) + 'px'
			}
		} );
		*/
	}	//	componentDidMount()

}   //  class ButtonBar

/*
export default ButtonBar;
*/

export { nextBtnBarId, ButtonBar } ;
