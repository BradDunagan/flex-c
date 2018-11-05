
import React, { Component } from 'react';

class BtnSplitHorz extends Component {
	constructor ( props ) {
		super ( props );
		this.id 		= 'frame-burger-menu-' + props.frameId;
		this.appFnc 	= props.appFnc;
		this.frameFnc 	= props.frameFnc;
		this.doAll 		= this.doAll.bind ( this );
		this.mouseDown	= this.mouseDown.bind ( this );
		this.mouseUp	= this.mouseUp.bind ( this );
		this.mouseMove	= this.mouseMove.bind ( this );
		this.click		= this.click.bind ( this );

		this.frameFnc ( { do: 		    		'frame-btn-split-horz-call-down',
						  BtnSplitHorzFnc:  	this.doAll } );
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
		this.frameFnc ( { do: 'split-horz' } );
	}	//	click()

	render() {
		return (
			<img id			= { this.id }
				 className	= "btn-split-horz"
				 src		= "/images/split_horz_lite_18x18.png"
				 onMouseDown 	= { this.mouseDown }
				 onMouseUp		= { this.mouseUp }
				 onMouseMove	= { this.mouseMove }
				 onClick		= { this.click } />
		);
	}   //  render()

}   //  class BtnSplitHorz

export default BtnSplitHorz;
