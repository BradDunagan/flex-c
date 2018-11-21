/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React		from 'react';

import Tabs			from './tabs';

class PaneContent extends React.Component {
	constructor ( props ) {
		super ( props );
	}	//  constructor()


	render() {
		if ( this.props.tabs ) {
			return (
				<div id 		= { this.props.eleId }
					 className 	= 'pane-content' >
					<Tabs eleId 	= { this.props.eleId + '-tabs' } 
						  paneFnc	= { this.props.paneFnc }
						  frameFnc	= { this.props.frameFnc } />
				</div>
			);
		}
		return (
			<div id 		= { this.props.eleId }
				 className 	= 'pane-content'
				 style		= { this.props.style } >
				{ this.props.content }
			</div>
		);
	}   //  render()

}   //  class PaneContent

export { PaneContent as default };
