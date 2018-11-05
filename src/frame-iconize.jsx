
import React, { Component } from 'react';

class FrameIconize extends Component {
	constructor ( props ) {
		super ( props );
		this.id 		= 'frame-iconize-' + props.frameId;
		this.appFnc 	= props.appFnc;
		this.frameFnc 	= props.frameFnc;
		this.doIt 		= this.doIt.bind ( this );
		this.mouseDown	= this.mouseDown.bind ( this );
		this.mouseUp	= this.mouseUp.bind ( this );
		this.mouseMove	= this.mouseMove.bind ( this );
		this.click		= this.click.bind ( this );

		this.frameFnc ( { do: 		    	'frame-iconize-call-down',
						  frameIconizeFnc:	this.doIt } );
	}	//	constructor
	
	doIt ( o ) {
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
		this.frameFnc ( { do: 'iconize' } );
	}	//	click()

	render() {
		return (
			<img id			= { this.id }
				 className	= "frame-iconize"
				 src		= "/images/frame_iconize_lite_18x18.png" 
				 onMouseDown 	= { this.mouseDown }
				 onMouseUp		= { this.mouseUp }
				 onMouseMove	= { this.mouseMove }
				 onClick		= { this.click } />
		);
	}   //  render()

}   //  class FrameIconize

export default FrameIconize;
