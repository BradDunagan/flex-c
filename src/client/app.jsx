
import React, { Component } from 'react';
import AppFrame				from '../app-frame';
import ContentExample1		from './content-example-1';

let lastCCId = 0;		//	Client Content Id

class App extends Component {
	constructor ( props ) {
		super ( props );

		this.doAll = this.doAll.bind ( this );

		this.appContentFnc = null;
	}	//	constructor()

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
					let frameId = self.appContentFnc ( {
						do:	'get-new-frame-id' } );
					let ccEleId = 'rr-cc-' + ++lastCCId;
					let content = (
						<ContentExample1 
							frameId			= { frameId }
							eleId			= { ccEleId }
							clientAppFnc 	= { self.doAll }
							appFrameFnc 	= { self.appFrameFnc }
							appContentFnc	= { self.appContentFnc } />
					);
					self.appContentFnc ( {
						do: 		'add-frame',
						frameId:	frameId,
						left:   	'40px',
						top:    	'20px',
						width:  	'400px',
						height: 	'400px',
						parentStyle:	{ position: 	'relative',
										  overflowY:	'auto' },
						ccEleId:	ccEleId,
						content:	content,
					} );
				}, 500 );
				return;
			}
			return;
		}
		if ( o.do === 'app-frame-menu-bar-item-click' ) {
			if ( o.itemText === 'New Process' ) {
				let frameId = this.appContentFnc ( {
					do:		'get-new-frame-id' } );
				let ccEleId = 'rr-cc-' + ++lastCCId;
				let content = (
					<ContentExample1 
						frameId			= { frameId }
						eleId			= { ccEleId }
						clientAppFnc 	= { this.doAll }
						appFrameFnc 	= { this.appFrameFnc }
						appContentFnc	= { this.appContentFnc } />
				);
				this.appContentFnc ( {
					do:			'add-frame',
					frameId:	frameId,
					left:		'40px',
					top:		'20px',
					width:		'400px',
					height:		'400px',
					parentStyle:	{ position: 	'relative',
									  overflowY:	'auto' },
					ccEleId:	ccEleId,
					content:	content,
				} );
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

			let ccEleId = 'rr-cc-' + ++lastCCId;
			let content = (
				<ContentExample1 
					frameId			= { o.frameId }
					eleId			= { ccEleId }
					clientAppFnc 	= { this.doAll }
					appFrameFnc 	= { this.appFrameFnc }
					appContentFnc	= { this.appContentFnc }
					paneFnc			= { o.paneFnc } /> );
			o.paneFnc ( {
				do:				'install-content',
				parentStyle:	{ position: 	'relative',
								  overflowY:	'auto' },
				ccEleId:		ccEleId,
				content:		content
			} );
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
