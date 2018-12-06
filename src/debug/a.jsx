
import React, { Component } from 'react';

import {diag, diagsFlush, diagsPrint} 	from '../diags';

class DebugA extends Component {
	constructor ( props ) {
		const sW = 'DebugA constructor()';
		diag ( [4], sW );
		super ( props );
		this.state = {
		};

	}	//	constructor
	
	
	doAll ( o ) {
		let sW = 'DebugA doAll() ' + o.do;
		if ( o.to ) {
			sW += ' to ' + o.to; }
		diag ( [4], sW );
	}	//	doAll()

	render() {
		const sW = 'DebugA render()';
		diag ( [4], sW );
		return (
			<div id				= 'rr-debug-this-1'
				 className		= 'rr-debug-this' >
				<div id="pe-frame-1-pane-rgt-3" class="split split-horizontal pane" 
												style={{ width: 'calc(50% - 3px)', 
													  	 flexDirection: 'column', 
														 backgroundColor: 'lightgray'}}>
					<div style={{flex: '1 1 0%'}}>
						<div id="pe-frame-1-pane-rgt-3-top-4" class="split split-vertical pane" 
															  style={{height: 'calc(50% - 3px)'}}>
							<div id="pe-frame-1-pane-rgt-3-top-4-content" class="pane-content" 
																		  style={{visibility: 'hidden'}}></div>
						</div>
						<div class="gutter gutter-vertical" 
							 style={{height: '6px'}}></div>
						<div id="pe-frame-1-pane-rgt-3-bot-5" class="split split-vertical pane" 
															  style={{height: 'calc(50% - 3px)'}}>
							<div id="pe-frame-1-pane-rgt-3-bot-5-content" class="pane-content" 
																		  style={{visibility: 'hidden'}}></div>
							<div id="pe-frame-1-pane-rgt-3-bot-5-button-bar" class="rr-button-bar" 
																			 style={{width: '253px'}}>
								<img id="rr-bgr-4" class="rr-btn-burger" src="/images/burger_lite_18x18.png" />
								<img id="rr-sh-4" class="btn-split-horz" src="/images/split_horz_lite_18x18.png"/>
								<img id="rr-sv-4" class="btn-split-vert" src="/images/split_vert_lite_18x18.png" />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
		
	}   //  render()
	
	componentDidMount() {
		const sW = 'DebugA componentDidMount()';
		diag ( [4], sW );
	}	//	componentDidMount()
	
	componentWillUnmount() {
		const sW = 'DebugA componentWillUnmount()';
		diag ( [4], sW );
	}

	componentDidUpdate() {
		const sW = 'DebugA componentDidUpdate()';
		diag ( [4], sW );
	}	//	componentDidMount()

}   //  class DebugA


export default DebugA;
