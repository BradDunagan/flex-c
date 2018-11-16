/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React, { Component } from 'react';


class BurgerMenu extends Component {
	constructor ( props ) {
		super ( props );

		this.click		= this.click.bind ( this );
		this.doAll 		= this.doAll.bind ( this );

		this.state = {
			listItems:  []
		};
	}	//	constructor

	click ( ev ) {
		let sW = 'BurgerMenu click()';
		console.log ( sW + '  ' + ev.target.innerText );
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
			listItems.push ( 
				<li key		= { i }
					idx		= { i }
					onClick	= { this.click } >
					{ menuItems[i] }
				</li>
			);
		}
		this.setState ( { listItems: listItems }, () => {
		} );
	}	//	componentDidMount()


}   //  class BurgerMenu

export default BurgerMenu;