/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React, { Component } from 'react';

import TabName				from './tab-name';

class TabPageNames extends Component {
	constructor ( props ) {
		super ( props );

		this.doAll = this.doAll.bind ( this );

		this.state = {
			names: [],
		};
		
		this.nameFncs = {};
		this.names = {};
		this.selectedNameEleId = null;

		props.tabsFnc ( { do:		'set-call-down',
						  to:		'tab-page-names',
						  namesFnc:	this.doAll } );
	}	//	constructor
	

	doAll ( o ) {
		if ( o.do === 'set-call-down' ) {
			if ( o.to === 'tab-name' ) {
				this.nameFncs[o.nameEleId] = o.nameFnc;
			}
			return;
		}
		if ( o.do === 'name-click' ) {
			if ( this.selectedNameEleId ) {
				this.nameFncs[this.selectedNameEleId] ( 
					{ do: 		'select',
					  selected:	false } ); }
			this.nameFncs[o.nameEleId] ( 
				{ do: 		'select',
				  selected:	true } );
			this.selectedNameEleId = o.nameEleId;
			return;
		}
	}

	render() {
		return (
			<div id			= { this.props.eleId }
				 className	= 'rr-tab-page-names' >
				{this.state.names}
			</div>
		);
	}   //  render()

	componentDidMount() {
		let nameId1 = 1;
		let eleId1 = this.props.eleId + '-name-' + nameId1;
		let name1 = <TabName key 		= { nameId1 }
							 eleId 		= { eleId1 }
							 namesFnc	= { this.doAll }
							 tabsFnc 	= { this.props.tabsFnc } />;
		this.names[eleId1] = { name: 	name1 };

		let nameId2 = 2;
		let eleId2 = this.props.eleId + '-name-' + nameId2;
		let name2 = <TabName key 		= { nameId2 }
							 eleId 		= { eleId2 }
							 namesFnc	= { this.doAll }
							 tabsFnc 	= { this.props.tabsFnc } />;
		this.names[eleId2] = { name: 	name2 };

		let nameId3 = 3;
		let eleId3 = this.props.eleId + '-name-' + nameId3;
		let name3 = <TabName key 		= { nameId3 }
							 eleId 		= { eleId3 }
							 namesFnc	= { this.doAll }
							 tabsFnc 	= { this.props.tabsFnc } />;
		this.names[eleId3] = { name: 	name3 };

		this.setState ( { names: [ name1, name2, name3 ] }, () => {
			this.nameFncs[eleId1] ( { do: 		'select',
									  selected:	true } );
			this.selectedNameEleId = eleId1;
		} );

	}	//	componentDidMount()

}	//  class TabPageNames

export default TabPageNames;
