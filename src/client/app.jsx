
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

		this.addProcess			= this.addProcess.bind ( this );
		this.setCallDown		= this.setCallDown.bind ( this );
		this.fixPaneId			= this.fixPaneId.bind ( this );
		this.menuItem			= this.menuItem.bind ( this );
		this.storeState			= this.storeState.bind ( this );
		this.loadState			= this.loadState.bind ( this );
		this.definePaneContent	= this.definePaneContent.bind ( this );
		this.doAll 				= this.doAll.bind ( this );

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
		diagsPrint ( 'App addProcess()', 1, 2000 );
		diag ( [1], sW );
		let ids 	= this.appContentFnc ( { do: 'get-new-frame-id' } );

//		let ccEleId = 'rr-cc-' + ++lastCCId;
//	//	this.newEleIds.push ( ccEleId );
//		this.content[ids.paneId] = { frameId:			ids.frameId,
//									 ccEleId:			ccEleId,
//									 paneContentFnc:	null,
//									 initialized:		false,
//									 install:			null,
//									 contentFnc:		null };
		this.definePaneContent ( { frameId: ids.frameId,
								   paneId:	ids.paneId } );

		this.appContentFnc ( {
			do:			'add-frame',
			frameId:	ids.frameId,
			paneId:		ids.paneId,
			left:		'40px',
			top:		'20px',
			width:		'400px',
			height:		'400px',
		} );

	}	//	addProcess()

	setCallDown ( o ) {
		let sW = 'App setCallDown() ' + o.to;
		diag ( [1, 2, 3], sW );
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
			let content = this.content[o.paneId];
			if ( ! content ) {
				diag ( [], sW + ' set-call-down to pane-content'
							  + ' ERROR(?): unrecognized paneId'
							  + ' (' + o.paneId + ')' );
				return; }
			content.paneContentFnc = o.fnc;
			if ( content.install ) {
				content.paneContentFnc ( Object.assign ( 
					{ do: 'install-client-content' }, 
					content.install ) ); }
			return;
		}
		if ( o.to === 'client-content' ) {
		//	let content = this.content[o.ccEleId];
			let content = this.content[o.paneId];
			if ( ! content ) {
				diag ( [], sW + ' set-call-down to client-content'
							  + ' ERROR: unrecognized paneId' 
							  + ' (' + o.paneId + ')' );
				return; }
			content.contentFnc = o.fnc;
			if ( ! content.initialized ) {
				content.contentFnc ( { do: 'init-new' } );
				content.initialized = true;
			}
			return;
		}
	}	//	setCallDown()

	fixPaneId ( o ) {
		let sW = 'App fixPaneId()';
		diag ( [1, 2, 3], sW + ' ' + o.curPaneId + ' -> ' + o.newPaneId );
		let content = this.content[o.curPaneId];
		if ( ! content ) {
			diag ( [], sW + ' fix-pane-id ERROR: unrecognized paneId' );
			return; }
		delete this.content[o.curPaneId];
		this.content[o.newPaneId] = content;

		if ( content.install ) {
			let c = content.install.content;
			//	Note that the component name is in c.type.name which in this
			//	case is (for now) assumed to be ContentExample1.
			content.install.content = ( <ContentExample1 
				frameId			= { c.props.frameId }
				paneId			= { o.newPaneId }
				eleId			= { content.ccEleId }
				clientAppFnc 	= { this.doAll }
				appFrameFnc 	= { this.appFrameFnc }
				appContentFnc	= { this.appContentFnc } /> ) }

		if ( o.reason === 'split' ) {
			//	The current pane is now split.  We need to maintain a content
			//	object for that pane - even though it no longer has "content"
			//	it will still have state. The state will be set later.
			this.content[o.curPaneId] = { state: null }; }
	}	//	fixPaneId()

	menuItem ( o ) {
		let sW = 'App menuItem() ' + o.menuItemText;
		diag ( [1, 2, 3], sW );
		//	Install (uninitialized) client content in a vacant pane.
		let content = this.content[o.paneId];
		if ( ! content ) {
		//	let ccEleId = 'rr-cc-' + ++lastCCId;
		//	content = this.content[o.paneId] = {
		//		frameId:		o.frameId,
		//		ccEleId:		ccEleId,
		//		paneContentFnc:	o.paneContentFnc,
		//		initialized:	false,
		//		install:		null,
		//		contentFnc:		null }; 
			content = this.definePaneContent ( o ); }
		content.install = {
			parentStyle:	{ 
				position:	'relative',
				overflowY:	'auto' },
			content: 		(
				<ContentExample1 
					frameId			= { o.frameId }
					paneId			= { o.paneId }
					eleId			= { content.ccEleId }
					clientAppFnc 	= { this.doAll }
					appFrameFnc 	= { this.appFrameFnc }
					appContentFnc	= { this.appContentFnc } /> ) };

		content.paneContentFnc ( Object.assign ( 
			{ do: 'install-client-content' }, 
			content.install ) );
	}	//	menuItem()

	storeState ( o ) {
		const sW = 'App storeState()  paneId ' + o.paneId;
		diag ( [1, 2, 3], sW );
		//	This "state" being stored is that of the pane and its content.
		//	If the pane is split then the state includes the split position
		//	and there is no content because the content of each of the child
		//	panes is stored for those panes separately.
		let content = this.content[o.paneId];
		if ( ! content ) {
			diag ( [], sW + ' ERROR: content not found'
						  + ' (paneId ' + o.paneId + ')' );
			return; }
		content.state = o.state;
	}	//	storeState();

	loadState ( o ) {
		const sW = 'App loadState()  paneId ' + o.paneId;
		diag ( [1, 2, 3], sW );
		let content = this.content[o.paneId];
		if ( ! content ) {
			diag ( [], sW + ' ERROR: content not found'
						  + ' (paneId ' + o.paneId + ')' );
			return; }
		return content.state;
	}	//	loadState():

	definePaneContent ( o ) {
		const sW = 'App definePaneContent()  paneId ' + o.paneId;
		diag ( [1, 2, 3], sW );
		if ( this.content[o.paneId] ) {
			diag ( [], sW + ' ERROR: content is already defined' );
			return; }
		let ccEleId = 'rr-cc-' + ++lastCCId;
		this.content[o.paneId] = { 
			frameId:		o.frameId,
			ccEleId:		ccEleId,
			paneContentFnc:	o.paneContentFnc ? o.paneContentFnc : null,
			initialized:	false,
			install:		null,
			contentFnc:		null,
			state:			null };
		return this.content[o.paneId];
	}	//	definePaneContent()

	doAll ( o ) {
		let sW = 'App doAll() ' + o.do;
		diag ( [1, 2, 3], sW );
		switch ( o.do ) {
			case 'set-call-down':
				this.setCallDown ( o );
				break;
			case 'fix-pane-id':
				this.fixPaneId ( o );
				break;
			case 'app-frame-menu-bar-item-click':
				//	These are the menu items on the app header (to the right of
				//	Robot Records).
				if ( o.itemText === 'New Process' ) {
					this.addProcess();
					return;	}
				if ( o.itemText === 'New Viewport' ) {
				}
				break;
			case 'append-menu-items':
				if ( o.to === 'pane-burger' ) {
					o.menuItems.push ( { type: 'item', text: 'Process' } );
					o.menuItems.push ( { type: 'item', text: 'Viewport' } ); }
				break;
			case 'menu-item':
				this.menuItem ( o );
				break;
			case 'store-state':
				this.storeState ( o );
				break;
			case 'load-state':
				return this.loadState ( o );
			case 'define-pane-content':
				this.definePaneContent ( o );
				break;
			default:
				diag ( [], sW + ' ERROR: unrecognized command ' + o.do );
		}
	}	//	doAll()

	render() {
		return (
			<AppFrame clientFnc     = { this.doAll } />
		);
	}	//	render()
} //  class App

export default App;
