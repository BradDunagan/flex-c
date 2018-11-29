
/*
        1          2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
import React, { Component } from 'react';
import AppFrame				from '../app-frame';
import ContentExample1		from './content-example-1';

import {diag, diagsFlush, diagsPrint} 	from '../diags';

let lastCCId = 0;		//	Client Content Id

class App extends Component {
	constructor ( props ) {
		super ( props );

		this.addProcess		= this.addProcess.bind ( this );
		this.doAll 			= this.doAll.bind ( this );

		this.appContentFnc = null;

	//	this.newEleIds = [];		//	For initializing new content.
	//	this.content = {};			//	Content in each pane. Key is eleId.
		this.content = {};		//	Content in pane. Key is paneId. This
								//	key must be "fixed" when, for example,
								//	a pane is split because the content 
								//	will be moved to a new pane (with a
								//	different ID).

	}	//	constructor()

	addProcess ( o ) {
		const sW = 'App addProcess()';
		diagsFlush();
		diagsPrint ( 1, 2000 );
		diag ( [1], sW );
		let ids 	= this.appContentFnc ( { do: 'get-new-frame-id' } );
		let ccEleId = 'rr-cc-' + ++lastCCId;
	//	this.newEleIds.push ( ccEleId );
		this.content[ids.paneId] = { frameId:			ids.frameId,
									 ccEleId:			ccEleId,
									 initialized:		false,
									 paneContentFnc:	null,
									 contentFnc:		null };
	//	let content = (
	//		<ContentExample1 
	//			frameId			= { ids.frameId }
	//			paneId			= { ids.paneId }
	//			eleId			= { ccEleId }
	//			clientAppFnc 	= { this.doAll }
	//			appFrameFnc 	= { this.appFrameFnc }
	//			appContentFnc	= { this.appContentFnc } />
	//	);
		this.appContentFnc ( {
			do:			'add-frame',
			frameId:	ids.frameId,
			paneId:		ids.paneId,
			left:		'40px',
			top:		'20px',
			width:		'400px',
			height:		'400px',
		//	parentStyle:	{ position:		'relative',
		//					  overflowY:	'auto' },
		//	ccEleId:	ccEleId,
		//	content:	content,
		} );

	}	//	addProcess()

	doAll ( o ) {
		const sW = 'App doAll()';
		if ( o.do === 'set-call-down' ) {
			if ( o.to === 'app-frame' ) {
				this.appFrameFnc = o.fnc;
				return; }
			if ( o.to === 'app-content' ) {
				this.appContentFnc = o.fnc;
				let self = this;
				//	Default, first frame.
				window.setTimeout ( () => {
					self.addProcess();
				}, 500 );
				return;
			}
			if ( o.to === 'pane-content' ) {
				diag ( [1, 2], sW + ' set-call-down to pane-content' );
				let content = this.content[o.paneId];
				if ( ! content ) {
					diag ( [], sW + ' set-call-down to pane-content'
								  + ' ERROR(?): unrecognized paneId '
								  + '(' + o.paneId + ')' );
					return; }
				content.paneContentFnc = o.fnc;
			//	content.paneContentFnc ( {
			//		do:				'install-client-content',
			//		parentStyle:	{ 
			//			position:	'relative',
			//			overflowY:	'auto' },
			//		content: 		(
			//			<ContentExample1 
			//				frameId			= { content.frameId }
			//				paneId			= { o.paneId }
			//				eleId			= { content.ccEleId }
			//				clientAppFnc 	= { this.doAll }
			//				appFrameFnc 	= { this.appFrameFnc }
			//				appContentFnc	= { this.appContentFnc } />
			//		)
			//	} );
				return;
			}
			if ( o.to === 'client-content' ) {
				diag ( [1], sW + ' set-call-down to client-content' );
			//	let content = this.content[o.ccEleId];
				let content = this.content[o.paneId];
				if ( ! content ) {
					console.log ( sW + ' set-call-down to client-content'
									 + ' ERROR: unrecognized paneId' );
					return; }
				content.contentFnc = o.fnc;
				if ( ! content.initialized ) {
					content.contentFnc ( { do: 'init-new' } );
					content.initialized = true;
				}
				return;
			}
			return;
		}
		if ( o.do === 'fix-pane-id' ) {
			diag ( [2], sW + ' fix-pane-id   ' + o.curPaneId + ' -> '
											   + o.newPaneId );
			let content = this.content[o.curPaneId];
			if ( ! content ) {
				console.log ( sW + ' fix-pane-id'
								 + ' ERROR: unrecognized paneId' );
				return; }
			delete this.content[o.curPaneId];
			this.content[o.newPaneId] = content;
			return;
		}
		if ( o.do === 'app-frame-menu-bar-item-click' ) {
			//	These are the menu items on the app header (to the right of
			//	Robot Records).
			if ( o.itemText === 'New Process' ) {
				this.addProcess();
				return;
			}
			if ( o.itemText === 'New Viewport' ) {

			}
			return;
		}
		if ( o.do === 'append-menu-items' ) {
			if ( o.to === 'pane-burger' ) {
				o.menuItems.push ( 'Process' );
				o.menuItems.push ( 'Viewport' );
			}
			return;
		}
		if ( o.do === 'menu-item' ) {
			console.log ( sW + ' menu-item: ' + o.menuItemText );

			//	Install client content in a vacant pane.

			let ccEleId = 'rr-cc-' + ++lastCCId;
		//	this.newEleIds.push ( ccEleId );
		//	this.content[ccEleId] = { initialized:	false,
		//							  contentFnc:	null };
			this.content[o.paneId] = { frameId:			o.frameId,
									   ccEleId:			ccEleId,
									   initialized:		false,
									   paneContentFnc:	o.paneContentFnc,
									   contentFnc:		null };
		//	let content = (
		//		<ContentExample1 
		//			frameId			= { o.frameId }
		//			eleId			= { ccEleId }
		//			clientAppFnc 	= { this.doAll }
		//			appFrameFnc 	= { this.appFrameFnc }
		//			appContentFnc	= { this.appContentFnc }
		//			paneFnc			= { o.paneFnc } /> );
		//	o.paneFnc ( {
		//		do:				'install-content',
		//		parentStyle:	{ position: 	'relative',
		//						  overflowY:	'auto' },
		//		ccEleId:		ccEleId,
		//		content:		content
		//	} );

			o.paneContentFnc ( { 
				do: 			'install-client-content',
				parentStyle:	{ 
					position:	'relative',
					overflowY:	'auto' },
				content: 		(
					<ContentExample1 
						frameId			= { o.frameId }
						paneId			= { o.paneId }
						eleId			= { ccEleId }
						clientAppFnc 	= { this.doAll }
						appFrameFnc 	= { this.appFrameFnc }
						appContentFnc	= { this.appContentFnc } />
				) } );
			return;
		}
	}	//	doAll()

	render() {
		return (
			<AppFrame clientFnc     = { this.doAll } />
		);
	}	//	render()
} //  class App

export default App;
