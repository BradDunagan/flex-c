
import React, { Component } from 'react';

import  './app.css';

class ContentExample1 extends Component {
	constructor ( props ) {
		super ( props );

        this.click          = this.click.bind ( this );
        this.burgerClick    = this.burgerClick.bind ( this );
		this.doAll          = this.doAll.bind ( this );

        this.state = {
        };

        this.data = {
            nClicks:    0,
        };

        this.props.appContentFnc ( { do:        'set-call-down',
                                     to:        'client-content-fnc',
                                     frameId:   this.props.frameId,
                                     ccEleId:   this.props.eleId,
                                     fnc:       this.doAll } );
	}	//	constructor()

    click ( ev ) {
        const sW = 'ContentExample1 click()';
        this.data.nClicks += 1;
        console.log ( sW + ': nClicks ' + this.data.nClicks );
    }   //  click()

	burgerClick ( o ) {
		let sW = 'ContentExample1 burgerClick()';
		console.log ( sW );
		let pe = document.getElementById ( o.paneEleId );
		let r  = pe.getBoundingClientRect();
		this.props.appFrameFnc ( { 
            do: 		'show-menu',
            menuEleId:	this.props.eleId + '-burger-menu',
            menuX:		r.x - 1,
            menuY:		r.y - 1,
            menuItems:	[ 'Tabs',
                          'UDUI',
                          'Viewport',
                          'Process',
                          'Diagnostics',
                          'Values',
                          'Stdout' ],
            upFnc:		this.doAll,
            ctx:		{ after:	'menu-item' }
		} );
	}	//	burgerClick()

	doAll ( o ) {
        const sW = 'ContentExample1 doAll()';
        if ( o.do === 'get-state' ) {
            console.log ( sW + ' get-state' );
            return { state: this.state,
                     data:  this.data };
        }
        if ( o.do === 'set-state' ) {
            console.log ( sW + ' set-state' );
            this.data = o.state.data;
            this.setState ( o.state.state );
            return;
        }
		if ( o.do === 'pane-burger-click' ) {
			this.burgerClick ( o );
			return;
		}
		if ( o.do === 'menu-item' ) {
			console.log ( sW + ' menu-item: ' + o.menuItemText );
			return;
		}
	}	//	doAll()

	render() {
		return (
			<div id         = { this.props.eleId }
                 className  = 'rr-app-content-exampe-1'
                 onClick    = { this.click } >
                ContentExample1
            </div>
		);
	}	//	render()
} //  class ContentExample1

export default ContentExample1;
