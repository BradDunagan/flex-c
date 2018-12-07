/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React        		from 'react';
import FrameBurgerMenu      from './frame-burger-menu';
import FrameTitle			from './frame-title';
import FrameIconize			from './frame-iconize';
import FrameDestroy			from './frame-destroy';



class PEFrameHeader extends React.Component {
	
	constructor ( props ) {
		super ( props );
		this.state = {
		//	style:	{ display:		'none' }
			style:	null
		};

		this.doAll		= this.doAll.bind ( this );
	}	//	constructor()

	doAll ( o ) {
		if ( o.do === 'is-visible' ) {
			if ( (! this.state.style) || (! this.state.style.display) ) {
				return true; }
			return this.state.style.display !== 'none'; }
		if ( o.do === 'show' ) {
			this.setState ( { style: null } );
			return;	}
		if ( o.do === 'hide' ) {
			this.setState ( { style: { display: 'none' } } );
			return;	}
	}	//	doAll()

	render() {
		return (
			<div className	= "rr-pe-frame-title-bar"
				 style		= { this.state.style } >
				<FrameBurgerMenu frameId	= { this.props.frameId }
								 frameFnc 	= { this.props.frameFnc } />
				<FrameTitle frameId		= { this.props.frameId }
							titleText	= { this.props.frameName }
							frameFnc	= { this.props.frameFnc } />
				<FrameDestroy frameId		= { this.props.frameId }
							  frameFnc 		= { this.props.frameFnc } />
				<FrameIconize frameId		= { this.props.frameId }
							  frameFnc 		= { this.props.frameFnc } />
			</div>
		);
	}	//  render()

	componentDidMount() {
		this.props.frameFnc ( { do: 	'set-call-down',
								to:		'frame-header',
								fnc:	this.doAll } );
	}	//	componentDidMount()

	componentWillUnmount() {
		this.props.frameFnc ( { do: 	'set-call-down',
								to:		'frame-header',
								fnc:	null } );
	}	//	componentWillUnmount()

}   //  class PEFrameHeader

export { PEFrameHeader as default };
