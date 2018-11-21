/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React, { Component } from 'react';

import TabPages 			from './tab-pages';
import TabPageNames			from './tab-page-names';
import Pane                 from './pane';
import TabName				from './tab-name';
import { getNextTabId }		from './tab-next-id';

class Tabs extends Component {
	constructor ( props ) {
		super ( props );

		this.state = {
			names: [],
		};
		
		this.tabPagesEleId		= props.eleId + '-pages';
		this.tabPageNamesEleId 	= props.eleId + '-names';

		this.addTabPageName		= this.addTabPageName.bind ( this );
		this.setPageNamesState	= this.setPageNamesState.bind ( this );
		this.selectTab			= this.selectTab.bind ( this );
		this.addTab				= this.addTab.bind ( this );

		this.doAll = this.doAll.bind ( this );

		this.pageFncs = {};
		this.pages = {};

		this.nameFncs = {};
		this.names = {};
		this.selectedNameEleId = null;

		props.paneFnc ( { do:		'set-call-down',
						  to:		'tabs',
						  tabsFnc:  this.doAll } );
	}	//	constructor
	

	addTabPageName ( text, cbPageName ) {

		let tabId = getNextTabId()
		let page1 = <Pane key 		= { tabId }
						  tabId 	= { tabId }
					  	  peId 		= { this.props.peId }
					  	  frameFnc	= { this.props.frameFnc } 
					  	  parentFnc = { this.props.paneFnc }
						  style 	= { null }
					  	  tabs      = { false } />
		this.pages[tabId] = { page: 	page1,
							  paneFnc:	null };
							   
		this.setState ( { pages: [ page1 ] }, () => {
		} );


		let eleId = 'rr-tab-name-' + tabId;

		this.names[eleId] = { tabId:	tabId,
							  text:		text ? text : null };
		this.setPageNamesState ( cbPageName, eleId );

	}	//	addTabPageName()

	setPageNamesState ( cbPageName, prmPageName ) {
		const sW = 'TabPageNames setPageNamesState()';
		let tna = [];		//	Tab Name Array
		let key = 0;
		for ( var eleId in this.names ) {
			tna.push ( ' ' + eleId ); }
		console.log ( sW + ' PN eleIds: ' + tna );
		tna = [];
		for ( var eleId in this.names ) {
			let d = this.names[eleId];
			d.name = <TabName key 		= { ++key }
							  tabId		= { d.tabId }
							  eleId		= { eleId }
							  text		= { d.text }
						//	  namesFnc	= { this.doAll }
							  tabsFnc 	= { this.doAll } />;
			tna.push ( d.name );
		}
		this.setState ( { names: tna }, () => {
			if ( cbPageName ) {
				cbPageName ( prmPageName ); }
		} );
	}	//	setPageNamesState()

	selectTab ( eleId ) {
		if ( this.selectedNameEleId ) {
			this.nameFncs[this.selectedNameEleId] ( { do: 		'select',
													  selected:	false } ); }
		this.nameFncs[eleId] ( { do: 		'select',
								 selected:	true } );
		this.selectedNameEleId = eleId;
	}	//	selectTab()

	addTab() {
		this.addTabPageName ( 'Tab Name', ( eleId ) => {
			this.nameFncs[eleId] ( { do: 		'select',
									 selected:	true } );
		//	this.selectedNameEleId = eleId;
			this.selectTab ( eleId );
		} );
	}	//	addTab()

	doAll ( o ) {
		const sW = 'Tabs doAll()';
		if ( o.do === 'set-call-down' ) {
			if ( o.to === 'tab-name' ) {
				this.nameFncs[o.nameEleId] = o.nameFnc;
			}
			return;
		}
		if ( o.do === 'name-click' ) {
		//	if ( this.selectedNameEleId ) {
		//		this.nameFncs[this.selectedNameEleId] ( 
		//			{ do: 		'select',
		//			  selected:	false } ); }
		//	this.nameFncs[o.nameEleId] ( 
		//		{ do: 		'select',
		//		  selected:	true } );
		//	this.selectedNameEleId = o.nameEleId;
			this.selectTab ( o.nameEleId );
			return;
		}
		if ( o.do === 'add-tab' ) {
			console.log ( sW + ' add-tab' );
			this.addTab();
			return;
		}
	}	//	doAll()

	render() {
		return (
			<div id			= { this.props.eleId }
				 className	= 'rr-tabs' >
				<TabPages eleId		= { this.tabPagesEleId }
						  peId		= { this.props.peId }
						  frameFnc 	= { this.props.frameFnc }
						  paneFnc 	= { this.props.paneFnc }
						  pages		= { this.state.pages } />
				<TabPageNames eleId		= { this.tabPageNamesEleId }
							  tabsFnc	= { this.doAll } 
							  paneFnc 	= { this.props.paneFnc } 
							  names		= { this.state.names } />
			</div>
		);
	}   //  render()

	componentDidMount() {
	//	this.addTabPageName ( 'Tab Name', ( eleId ) => {
	//		this.nameFncs[eleId] ( { do: 		'select',
	//								 selected:	true } );
	//		this.selectedNameEleId = eleId;
	//	} );
		this.addTab();
	}	//	componentDidMount()

}   //  class Tabs

export default Tabs;
