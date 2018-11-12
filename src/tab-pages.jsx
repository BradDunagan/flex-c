/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React, { Component } from 'react';

import Pane                 from './pane';


class TabPages extends Component {
	constructor ( props ) {
		super ( props );

		this.getHeight 	= this.getHeight.bind ( this );
		this.doAll 		= this.doAll.bind ( this );

		this.state = {
			pages: [],
		};
		
		this.pageFncs = {};
		this.pages = {};
		this.selectedPageEleId = null;

	//	props.paneFnc ( { do:			'set-call-down',
	//					  to:			'tab-pages',
	//					  tabPagesFnc:  this.doAll } );

		this.h0 = 0;
	}	//	constructor

	getHeight() {
		let e = document.getElementById ( this.props.eleId );
		return e.offsetHeight;
	}

	doAll ( o ) {
//		if ( o.do == 'size-start' ) {
//			this.h0 = this.getHeight();
//			this.propagateDown_SizeOp ( o );
//			return;
//		}
//		if ( o.do === 'size' ) {
//			let cs = this.state.containerStyle;
//			if ( cs ) {
//				this.setState ( { containerStyle: { 
//					width: '100%', 
//					height: (this.containerH0 + o.dY) + 'px' } } ); }
//		//	this.width += o.dX;
//			this.propagateDown_SizeOp ( o );
//			return;
//		}
	}

	render() {
		return (
			<div id			= { this.props.eleId }
				 className	= 'rr-tab-pages' >
				{this.state.pages}
			</div>
		);
	}   //  render()

	componentDidMount() {
		this.paneStyle = {
			position:	'absolute',
			width:		'100%',
			height:		(this.getHeight() - 1) + 'px'
		}
		let pageId1 = 1;
		let eleId1 = this.props.eleId + '-page-' + pageId1;
		let page1 = <Pane key 		= { pageId1 }
						  tabEleId 	= { eleId1 }
					  	  peId 		= { this.props.peId }
					  	  frameFnc	= { this.props.frameFnc } 
					  	  parentFnc = { this.props.paneFnc }
						  style 	= { this.paneStyle }
					  	  tabs      = { false } />
		this.pages[eleId1] = { page: 	page1,
							   paneFnc:	null };
							   
		/*
		let pageId2 = 2;
		let eleId2 = this.props.eleId + '-page-' + pageId2;
		let page2 = <Pane key 		= { pageId2 }
						  tabEleId 	= { eleId2 }
					  	  peId 		= { this.props.peId }
					  	  frameFnc	= { this.props.frameFnc } 
					  	  parentFnc = { this.props.paneFnc }
						  style 	= { this.paneStyle }
					  	  tabs      = { false } />
		this.pages[eleId2] = { page: 	page2,
							   paneFnc:	null };

		let pageId3 = 3;
		let eleId3 = this.props.eleId + '-page-' + pageId3;
		let page3 = <Pane key 		= { pageId3 }
						  tabEleId 	= { eleId3 }
					  	  peId 		= { this.props.peId }
					  	  frameFnc	= { this.props.frameFnc } 
					  	  parentFnc = { this.props.paneFnc }
						  style 	= { this.paneStyle }
					  	  tabs      = { false } />
		this.pages[eleId3] = { page: 	page3,
							   paneFnc:	null };
		*/

	//	this.setState ( { pages: [ page1, page2, page3 ] }, () => {
		this.setState ( { pages: [ page1               ] }, () => {
		//	this.pageFncs[eleId1] ( { do: 		'select',
		//							  selected:	true } );
		//	this.selectedPageEleId = eleId1;
		} );

	}	//	componentDidMount()


}   //  class TabPages

export default TabPages;
