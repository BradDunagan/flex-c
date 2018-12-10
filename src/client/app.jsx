
/*
        1          2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
import React, { Component } from 'react';
import AppFrame				from '../app-frame';
import ContentExample1		from './content-example-1';
import db           		from '../dbp';


import {diag, diagsFlush, diagsPrint} 	from '../diags';

let lastCCId = 0;		//	Client Content Id

class App extends Component {
	constructor ( props ) {
		super ( props );

		this.addFrame			= this.addFrame.bind ( this );
		this.addFrames			= this.addFrames.bind ( this );
		this.setCallDown		= this.setCallDown.bind ( this );
		this.fixPaneId			= this.fixPaneId.bind ( this );
		this.menuItem			= this.menuItem.bind ( this );
		this.storeState			= this.storeState.bind ( this );
		this.loadState			= this.loadState.bind ( this );
		this.saveApp			= this.saveApp.bind ( this );
		this.loadApp			= this.loadApp.bind ( this );
		this.definePaneContent	= this.definePaneContent.bind ( this );
		this.newFrame			= this.newFrame.bind ( this );
		this.clearLayout		= this.clearLayout.bind ( this );
		this.clickAppTitle		= this.clickAppTitle.bind ( this );
		this.doAll 				= this.doAll.bind ( this );

		this.appContentFnc   = null;
		this.appContentEleId = '';

	//	this.newEleIds = [];		//	For initializing new content.
	//	this.content = {};			//	Content in each pane. Key is eleId.
		this.content = {};		//	Content in pane. Key is paneId. This
								//	key must be "fixed" when, for example,
								//	a pane is split because the content 
								//	will be moved to a new pane (with a
								//	different ID).

	}	//	constructor()

	addFrame ( o ) {
		const sW = 'App addFrame()';
		diagsFlush();
		diagsPrint ( sW, 1, 2000 );
		diag ( [1], sW );
		let ids = 	  (o && o.frameId && o.paneId) 
					? { frameId: 	o.frameId,
						paneId:		o.paneId }
					: this.appContentFnc ( { do: 'get-new-frame-id' } );

		this.definePaneContent ( { frameId: ids.frameId,
								   paneId:	ids.paneId } );

		this.appContentFnc ( {
			do:				'add-frame',
			frameName:		(o && o.frameName) ? o.frameName : null,
			frameId:		ids.frameId,
			paneId:			ids.paneId,
			left:			(o && o.left)   ? o.left   : '40px',
			top:			(o && o.top)    ? o.top    : '20px',
			width:			(o && o.width)  ? o.width  : '400px',
			height:			(o && o.height) ? o.height : '400px',
			iconized:		(o && o.iconized) ? o.iconized : null,
		} );

	}	//	addFrame()

	addFrames ( a, c ) {
		const sW = 'App addFrames()';
	//	diagsFlush();
	//	diagsPrint ( sW, 1, 2000 );
	//	diag ( [1], sW );

		let frames = [];
		for ( let i = 0; i < a.length; i++ ) {
			let o = a[i];
			let ids = 	  (o && o.frameId && o.paneId) 
						? { frameId: 	o.frameId,
							paneId:		o.paneId }
						: this.appContentFnc ( { do: 'get-new-frame-id' } );

			let content = this.definePaneContent ( { frameId:	ids.frameId,
									   				 paneId:	ids.paneId } );
			if ( c[ids.paneId].install ) {
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
			}
			content.state = c[ids.paneId].state;

			frames.push ( {
				frameName:		(o && o.frameName) ? o.frameName : null,
				frameId:		ids.frameId,
				paneId:			ids.paneId,
				left:			(o && o.left)   ? o.left   : '40px',
				top:			(o && o.top)    ? o.top    : '20px',
				width:			(o && o.width)  ? o.width  : '400px',
				height:			(o && o.height) ? o.height : '400px',
				iconized:		(o && o.iconized) ? o.iconized : null,
			} );
		}	//	for ( ... )

		this.appContentFnc ( { do:		'add-frames',
							   frames:	frames } );

	}	//	addFrames()

	setCallDown ( o ) {
		let sW = 'App setCallDown() ' + o.to;
		diag ( [1, 2, 3], sW );
		if ( o.to === 'app-frame' ) {
			this.appFrameFnc = o.fnc;
			return; }
		if ( o.to === 'app-content' ) {
			this.appContentFnc	 = o.fnc;
			this.appContentEleId = o.eleId;
			let self = this;
			//	Default, first frame.
			window.setTimeout ( () => {
				self.addFrame();
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

	saveApp ( o ) {
		const sW = 'App saveApp()';
		diag ( [1, 2, 3], sW );
		let state = this.appContentFnc ( { do: 'get-state' } )
		state.content = this.content;
		db.addLayout ( { SystemID: 		0,
						 UserID:		0,
						 LayoutName:	'test',
						 json:			JSON.stringify ( state ) } );
	}	//	saveApp():

	async loadApp ( o ) {
		const sW = 'App loadApp()';
		diag ( [1, 2, 3], sW );
		this.appContentFnc ( { do: 'clear' } );
		let record = await db.loadLayout ( [0, 0, 'test'] );
		let state = JSON.parse ( record.json );
	//	this.content = state.content;
	//	delete state.content;
		this.content = {};
		let frames = [];
		for ( let frameId in state ) {
			if ( frameId === 'content' ) {
				continue; }
			let frm = state[frameId].frame;
			frames.push ( {
				frameName:	frm.frameName,
				frameId:	frm.frameId,
				paneId:		frm.paneId,
				left:		frm.style.left,
				top:		frm.style.top,
				width:		frm.style.width,
				height:		frm.style.height,
				iconized:	frm.iconized ? frm.iconized : null,
			} );
		}

		this.addFrames ( frames, state.content );
	}	//	loadApp():

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

	newFrame ( ev ) {
		const sW = 'App newFrame()';
		console.log ( sW );
		this.addFrame();
	}	//	newFrame()

	clearLayout ( ev ) {
		const sW = 'App clearLayout()';
		console.log ( sW );
		this.content = {};
		this.appContentFnc ( { do: 'clear' } );
	}	//	clearLayout()

	clickAppTitle ( ev ) {
		const sW = 'App clickAppTitle()';
		diag ( [1, 2, 3], sW );

		let ce = document.getElementById ( this.appContentEleId );
		let r  = ce.getBoundingClientRect();

		this.appFrameFnc ( { 
			do: 		'show-menu',
			menuEleId:	'app-title-menu',
			menuX:		r.x + 10,
			menuY:		r.y + 10,
			menuItems:	[ 
				{ type: 'item', 
				  text: 'New Frame',		fnc: this.newFrame },
				{ type: 'item',	
				  text: 'Clear Layout',		fnc: this.clearLayout },
				{ type: 'item',	
				  text: 'Save Layout ...',	fnc: this.saveLayout },
				{ type: 'item', 
				  text: 'Load Layout ...',	fnc: this.loadLayout } ],
			upFnc:		this.doAll,
			ctx:		{ after:	'menu-item' }
		} );

	}	//	clickAppTitle()


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
				if ( o.itemText === 'New Frame' ) {
					this.addFrame();
					return;	}
		//		if ( o.itemText === 'New Process' ) {
		//			this.addFrame();
		//			return;	}
		//		if ( o.itemText === 'New Viewport' ) {
		//		}
				if ( o.itemText === 'Save Layout' ) {
					this.saveApp ( o );
					return;	}
				if ( o.itemText === 'Load Layout' ) {
					this.loadApp ( o );
					return;	}
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
			<AppFrame appTitle		= 'Robot Records'
					  appTitleClick	= { this.clickAppTitle }
					  clientFnc		= { this.doAll } />
		);
	}	//	render()
} //  class App

export default App;
