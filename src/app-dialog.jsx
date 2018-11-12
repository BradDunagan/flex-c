/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
import React            from 'react';
/*
import AppSignInDialog  from './sign-in';
*/
import BurgerMenu       from './burger-menu';

class AppDialog extends React.Component {
	constructor ( props ) {
		super ( props );

		this.click = this.click.bind ( this );
	}

	click ( ev ) {
		this.props.upFncAppFrame ( { do: 'menu-dismiss' } );
	}	//	click()

	render() {
		switch ( this.props.dlg ) {
//			case 'sign-in': 
//				return (
//					<div className = "rr-app-screen-dialog">
//						<AppSignInDialog frameFnc = {this.props.upFnc}/>
//					</div>
//				);
			case 'menu':
				let mnu = this.props.mnu;
				return (
					<div className 	= "rr-app-screen-dialog"
						 onClick	= { this.click } >
						<BurgerMenu eleId 	= { mnu.menuEleId }
									style 	= {{ left:	mnu.menuX + 'px',
												 top: 	mnu.menuY + 'px' }}
									items	= { mnu.menuItems }
									upFnc	= { mnu.upFnc }
									ctx		= { mnu.ctx } />
					</div>
					
				)
			default:
				return null;
		}
	}
}   //  AppDialog()

export { AppDialog as default };
