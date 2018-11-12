import React, { Component } from 'react';

import BtnSplitHorz 		from './btn-split-horz';
import BtnSplitVert 		from './btn-split-vert';

class ButtonBar extends Component {
	constructor ( props ) {
		super ( props );
		console.log ( 'ButtonBar constructor()' );
		this.state = {
			styleSplitHorz: {
		//		left: 	'0px'
			},
			styleSplitVert: {
		//		left: 	'0px'
			}
		};
		this.doAll 			= this.doAll.bind ( this );

	//	this.sizeW0 = 0;

		props.paneFnc ( { do:				'button-bar-call-down',
						  buttonBarFnc:		this.doAll } );
	}	//	constructor
	
	doAll ( o ) {
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
	}

	render() {
		console.log ( 'ButtonBar render()' );
		/*
		return (
			<div id				= { this.props.eleId }
				 className		= 'rr-button-bar' >
			</div>
		);
		*/
		return (
			<div id				= { this.props.eleId }
				 className		= 'rr-button-bar' >
				<BtnSplitHorz paneFnc	= { this.props.paneFnc } 
							  style 		= { this.state.styleSplitHorz } 
							  contentId		= { 0 } />
				<BtnSplitVert paneFnc	= { this.props.paneFnc } 
							  style 		= { this.state.styleSplitVert } 
							  contentId		= { 0 } />
			</div>
		);
		
	}   //  render()
	
	componentDidMount() {
		let e  = document.getElementById ( this.props.eleId );
		console.log ( 'ButtonBar mounted. e: ' + e );
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
	}
	
	componentWillUnmount() {
		let e  = document.getElementById ( this.props.eleId );
		console.log ( 'ButtonBar will unmount. e: ' + e );
	}

	componentDidUpdate() {
		let e  = document.getElementById ( this.props.eleId );
		console.log ( 'ButtonBar did update. e: ' + e );
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

export default ButtonBar;
