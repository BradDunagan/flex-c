
import React, { Component } from 'react';

class BtnSplitVert extends Component {
	constructor ( props ) {
		super ( props );
		this.id 		= 'btn-split-vert-' + props.frameId;
		this.appFnc 	= props.appFnc;
		this.frameFnc 	= props.frameFnc;
		this.doAll 		= this.doAll.bind ( this );
		this.mouseDown	= this.mouseDown.bind ( this );
		this.mouseUp	= this.mouseUp.bind ( this );
		this.mouseMove	= this.mouseMove.bind ( this );
		this.click		= this.click.bind ( this );

		if ( this.frameFnc ) {
			this.frameFnc ( { do: 		    	'frame-btn-split-vert-call-down',
							  BtnSplitVertFnc:  this.doAll } ); }
	}	//	constructor
	
	doAll ( o ) {
	}

	mouseDown ( ev ) {
		let sW = 'mouseDown()';
		console.log ( sW );
		ev.stopPropagation();
	}	//	mouseDown()

	mouseUp ( ev ) {
		let sW = 'mouseUp()';
		console.log ( sW );
		ev.stopPropagation();
	}	//	mouseUp()

	mouseMove ( ev ) {
		let sW = 'mouseMove()';
		console.log ( sW );
		ev.stopPropagation();
	}	//	mouseMove()

	click ( ev ) {
		let sW = 'click()';
		console.log ( sW );
		ev.stopPropagation();
		if ( this.frameFnc ) {
			this.frameFnc ( { do: 			'split-vert',
							  contentId:	this.props.contentId } ); }
		if ( this.props.paneFnc ) {
			this.props.paneFnc ( { do: 'split-vert' } ); }
	}	//	click()

	render() {
		return (
			<img id			= { this.id }
				 className	= "btn-split-vert"
				 style		= { this.props.style }
				 src		= "/images/split_vert_lite_18x18.png"
				 onMouseDown 	= { this.mouseDown }
				 onMouseUp		= { this.mouseUp }
				 onMouseMove	= { this.mouseMove }
				 onClick		= { this.click } />
		);
	}   //  render()

}   //  class BtnSplitVert

export default BtnSplitVert;
