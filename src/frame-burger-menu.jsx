
import React, { Component } from 'react';

class FrameBurgerMenu extends Component {
	constructor ( props ) {
		super ( props );
		this.id 		= 'frame-burger-menu-' + props.frameId;
		this.appFnc 	= props.appFnc;
		this.frameFnc 	= props.frameFnc;
		this.doIt 		= this.doIt.bind ( this );
		this.mouseDown	= this.mouseDown.bind ( this );
		this.mouseUp	= this.mouseUp.bind ( this );
		this.mouseMove	= this.mouseMove.bind ( this );
		this.click		= this.click.bind ( this );

		this.frameFnc ( { do: 		    		'frame-burger-menu-call-down',
						  frameBurgerMenuFnc:  	this.doIt } );
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
	}	//	click()

	render() {
		return (
			<img id			= { this.id }
				 className	= "frame-burger-menu"
				 src		= "/images/burger_lite_18x18.png"
				 onMouseDown 	= { this.mouseDown }
				 onMouseUp		= { this.mouseUp }
				 onMouseMove	= { this.mouseMove }
				 onClick		= { this.click } />
		);
	}   //  render()

}   //  class FrameBurgerMenu

export default FrameBurgerMenu;
