/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React	from 'react';

import Split 	from 'split.js'


class PEFrameContent extends React.Component {
	constructor ( props ) {
		super ( props );

		this.eleId 		= 'pe-frame-' + props.peId + '-content';
		this.splitHorz 	= this.splitHorz.bind ( this );
		this.doAll 		= this.doAll.bind ( this );

		props.frameFnc ( { do:  'set-call-down',
						   to:  'PEFrameContent',
						   fnc: this.doAll } );

		this.state = {
			style: {
				flexDirection: 		'row'
			}
		}
	}	//  constructor()

	//	Data associated with any element.  Keys are the elements' id.
	eleData = {};

	splitHorz ( o ) {
		let sW = 'splitHorz()';
		console.log ( 'Frame ' + sW );
		function createSplitPanelElement ( eleId ) {
			let sW = 'createSplitPanelElement()';
			console.log ( sW );
			//	That is, create a panel that is on either side of a spliter (i.e.,
			//	a slider/gutter). This element itself is not split.
			let ele = document.createElement ( 'div' );
			ele.id = eleId;
			ele.classList.value = 'split split-horizontal content';
			return ele;
		}	//	createSplitPanelElement()
		
		//  Get the panel element
		let pe = document.getElementById ( this.eleId );	//	 querySelector ( '#rr-pe-frame-content' );
//		//	And the sizer.  Remove it from the panel.
//		let szr = document.querySelector ( '#rr-pe-a-sizer' );
//		szr.remove();
	//	console.log ( pe.innerHTML );
		//  Copy the current contents of the panel.
		let pet = pe.textContent.trim()
		let pec = Array.from ( pe.children );
		//  Delete the current contents.
		pe.textContent = '';
		//	Panel is just sizeable now (no content). Set class to sizeable.
		//	And Fix the size because making it without content might have 
		//	removed some padding.
		let ow = pe.offsetWidth;
		let oh = pe.offsetHeight;
	//	pe.classList.value = 'sizeable';
		pe.style.width  = (Number.parseInt ( pe.style.width )  + (ow - pe.offsetWidth )).toString() + 'px';
		pe.style.height = (Number.parseInt ( pe.style.height ) + (oh - pe.offsetHeight)).toString() + 'px';
		//	Create three <div>s in the panel.
		let lft = createSplitPanelElement ( 'left' );
		pe.appendChild ( lft );
		let rgt = createSplitPanelElement ( 'right' );
		pe.appendChild ( rgt );
		//  Put the copied contents in the left <div>.
		lft.textContent = pet;
		pec.forEach ( e => lft.appendChild ( e ) );
		//	Split -
		let opts = {
			gutterSize: 6,
			minSize: 	20,
			snapOffset: 5,
			cursor: 	'col-resize'
		};
		let d = this.eleData[pe.id];
		if ( d && d.split && d.split.sizes )
			opts.sizes = d.split.sizes;
		let split = Split ( ['#left', '#right'], opts );
		//	Set the background color of the parent - it will show through
		//	on the gutter.
		pe.style.backgroundColor = 'lightgrey';
		//	Some content in the right side panel.
		rgt.textContent = 'side panel';
//		//	Put the sizer back.
//		pe.appendChild ( szr );
		//	Remember the split instance.
		if ( ! this.eleData[pe.id] )
			this.eleData[pe.id] = {};
		this.eleData[pe.id].split = { instance: split };
		//	Buttons -
	//	document.getElementById ( 'rr-btn-open' ).setAttribute ( 'disabled', true );
	//	document.getElementById ( 'rr-btn-close' ).removeAttribute ( 'disabled' );
		this.setState ( { style: { flexDirection: 'row' } } );
	}	//	splitHorz()

	doAll ( o ) {
		if ( o.do === 'split-horz' ) {
			this.splitHorz ( o );
			return;
		}
	}   //  doAll()

	render() {
		return (
			<div id 		= { this.eleId }
				 className 	= 'rr-pe-frame-content'
				 style 		= { this.state.style } >
			</div>
		);
		/*	When split horizontally - For example -
		if ( this.state.splitHorizontally ) {
			return (
				<div id 		= { this.eleId }
					className 	= 'rr-pe-frame-content'
					style 		= { this.state.style } >
					<Left>
						<PEFrameContent />
					</Left>
					<Gutter />
					<Right>
						<PEFrameContent />
					</Right>
				</div>
			); }
		if ( this.state.splitVertically ) {
			return (

			); }
		return (
			<div id 		= { this.eleId }
				 className 	= 'rr-pe-frame-content'
				 style 		= { this.state.style } >
				{ this.state.contentElements }
			</div>
		);
		*/
	}   //  render()
}   //  class PEFrameContent

export { PEFrameContent as default };
