/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React, { Component } from 'react';

import TabPages 			from './tab-pages';
import TabPageNames			from './tab-page-names';

class Tabs extends Component {
	constructor ( props ) {
		super ( props );

		this.tabPagesEleId		= props.eleId + '-pages';
		this.tabPageNamesEleId 	= props.eleId + '-names';

		this.doAll = this.doAll.bind ( this );

		props.paneFnc ( { do:		'set-call-down',
						  to:		'tabs',
						  tabsFnc:  this.doAll } );
	}	//	constructor
	

	doAll ( o ) {
	}

	render() {
		return (
			<div id			= { this.props.eleId }
				 className	= 'rr-tabs' >
				<TabPages eleId		= { this.tabPagesEleId }
						  peId		= { this.props.peId }
						  frameFnc 	= { this.props.frameFnc }
						  paneFnc 	= { this.props.paneFnc } />
				<TabPageNames eleId		= { this.tabPageNamesEleId }
							  tabsFnc	= { this.doAll } 
							  paneFnc 	= { this.props.paneFnc } />
			</div>
		);
	}   //  render()

	componentDidMount() {
	}	//	componentDidMount()

}   //  class Tabs

export default Tabs;
