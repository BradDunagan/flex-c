/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React, { Component } from 'react';

import {diag, diagsFlush, diagsPrint} 	from './diags';


class MenuItemsSeparator extends Component {
	constructor ( props ) {
		super ( props );

	}	//	constructor

	doAll ( o ) {
	}	//	doAll()

	render() {
		return (
			<div className	= 'rr-menu-items-separator' >
			</div>
		);
	}   //  render()

	componentDidMount() {
	}	//	componentDidMount()

}	//	class	MenuItemsSeparator

class BurgerMenu extends Component {
	constructor ( props ) {
		super ( props );

		this.click		= this.click.bind ( this );
		this.doAll 		= this.doAll.bind ( this );

		this.state = {
			listItems:  []
		};
	}	//	constructor

	click ( i, ev ) {
		let sW = 'BurgerMenu click()';
		console.log ( sW + '  ' + ev.target.innerText );
		ev.stopPropagation();
		this.props.screenFnc ( { do: 'menu-dismiss' } );
		let item = this.props.items[i];
		if ( item.fnc ) {
			item.fnc ( ev ); 
			return; }
		this.props.upFnc ( { do: 			this.props.ctx.after,
							 menuItemText:	ev.target.innerText } );
	}	//	click()

	doAll ( o ) {

	}	//	doAll()

	render() {
		return (
			<div id			= { this.props.eleId }
				 style		= { this.props.style }
				 className	= 'rr-burger-menu' >
				<ul>
					{this.state.listItems}
				</ul>
			</div>
		);
	}   //  render()

	componentDidMount() {
		let menuItems = this.props.items;
		let listItems = [];
		let i = 0;
		for ( ; i < menuItems.length; i++ ) {
			let mi = menuItems[i];
			if ( mi.type === 'separator' ) {
				listItems.push ( 
					<li key		= { i }
						idx		= { i } >
						<MenuItemsSeparator />
					</li> );
				continue; }

			listItems.push ( 
				<li key		= { i }
					idx		= { i }
					onClick	= { this.click.bind ( this, i ) } >
					{ mi.text }
				</li> );
		}
		this.setState ( { listItems: listItems }, () => {
		} );
	}	//	componentDidMount()


}   //  class BurgerMenu

export default BurgerMenu;
