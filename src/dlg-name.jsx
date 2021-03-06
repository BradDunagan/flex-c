/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
import React        		from 'react';
import NameNotIdentifier	from './name-not-identifier';

import {diag, diagsFlush, diagsPrint} 	from './diags';


class DlgName extends React.Component {
	constructor ( props ) {
		const sW = 'Tabs constructor()';
		diag ( [1,2,3], sW );
		super ( props );
		this.state = {
			styleMain: {
				width:          '350px',
			},
			name:           '',
			okDisabled:     true,
		}
		this.doAll       = this.doAll.bind ( this );
		this.clickCancel = this.clickCancel.bind ( this );
		this.clickOK     = this.clickOK.bind ( this );
	}

	doAll ( o ) {
		if ( o.do === 'invalid' ) {
			this.setState ( { okDisabled: true,
							  name: '' } );
		} else
		if ( o.do === 'valid' ) {
			this.setState ( { okDisabled: false,
							  name: o.name } );
		}
	}

	clickCancel() {
		console.log ( 'DlgNameRecord clickCancel()' );
	//	this.props.upFnc ( { do: 'close-dlg' } );
		this.props.appFrameFnc ( { do: 'close-dlg' } );
	}

	clickOK() {
		console.log ( 'DlgNameRecord clickOK()' );
	//	this.props.upFnc ( { do: 'close-dlg' } );
		this.props.appFrameFnc ( { do: 'close-dlg' } );
		this.props.upFnc ( { 
			do:   this.props.ctx.after ? this.props.ctx.after 
									   : 'ok-record-name',
			ctx:  this.props.ctx,
			name: this.state.name } );
	}

	/*	On this.props.nameComp -

		( <RecordName dlg

		> )

		How to pass an unknown callback?
		How to specify for the nameComp a callback other than to
		the client?
		It seems the nameComp will need to -
			1	Callback to the client
			2	The client will return doAll of this dialog.
		So -
			The client will not be able return this dialog's doAll until
			after this dialog's componentDidMount - which is after nameComp's
			componentDidMount - which is what calls the client to get this
			dialog's doAll.
		Ug. Is there not an easier, more direct way?
	*/

	render() {
		return (
			<div className = "rr-pe-dlg-name-dlg"
				 style = {this.state.styleMain}>
				<div className = "rr-pe-dlg-name-main">
					<div className = "rr-pe-dlg-name-title">
						{this.props.ctx.title ? this.props.ctx.title 
											  : 'Name Record'}
					</div>

					<NameNotIdentifier dlg 		= { this.doAll }
									   curText	= { this.props.ctx.curName } />
					<div className = "rr-pe-dlg-name-buttons-container">
						 <button style = {{ visibility: 'hidden' }}>
							nothing
						</button>
						<button className = "rr-general-button"
								disabled = {this.state.okDisabled}
								onClick = {this.clickOK} >
							OK
						</button>
						<button className = "rr-general-button"
								onClick = {this.clickCancel}>
							Cancel
						</button>
					</div>
				</div>
			</div>
		);
	}

	componentDidMount() {
		const sW = 'DlgName componentDidMount()'
		//  Set focus on the name editor.
		const selector = '.rr-pe-dlg-name-dlg .rr-pe-dlg-name-input';
		let ele = document.querySelectorAll ( selector );
		if ( ele.length < 1 ) {
			console.log ( sW + ' ERROR: name element not found' );
			return; }
		if ( ele.length > 1 ) {
			console.log ( sW + ' ERROR: multiple name elements' );
			return; }
		ele[0].focus();
	}   //  componentDidMount()

}   //  DlgName

export { DlgName as default };
