
import React, { Component } from 'react';

import {diag, diagsFlush, diagsPrint} 	from '../diags';

class DebugB extends Component {
	constructor ( props ) {
		const sW = 'DebugB constructor()';
		diag ( [4], sW );
		super ( props );
		this.state = {
		};

	}	//	constructor
	
	
	doAll ( o ) {
		let sW = 'DebugB doAll() ' + o.do;
		if ( o.to ) {
			sW += ' to ' + o.to; }
		diag ( [4], sW );
	}	//	doAll()

	render() {
		const sW = 'DebugB render()';
		diag ( [4], sW );
		return (
			<div id				= 'rr-debug-this-1'
				 className		= 'rr-debug-this' >

                <div id="pe-frame-1-pane" class="pane" 
                                        style={{flexDirection: 'column', 
                                                backgroundColor: 'lightgray'}}>
                    <div style={{flex: '1 1 0%'}}>
                        <div id="pe-frame-1-pane-top-2" class="split split-vertical pane" 
                                                        style={{height: 'calc(50% - 3px)'}}>
                            <div id="pe-frame-1-pane-top-2-content" class="pane-content" 
                                                                    style={{visibility: 'hidden'}}></div>
                        </div>
                        <div class="gutter gutter-vertical" 
                             style={{height: '6px'}}></div>
                        <div id="pe-frame-1-pane-bot-3" class="split split-vertical pane" 
                                                        style={{height: 'calc(50% - 3px)'}}>
                            <div id="pe-frame-1-pane-bot-3-content" class="pane-content" 
                                                                    style={{visibility: 'hidden'}}></div>
                            <div id="pe-frame-1-pane-bot-3-button-bar" class="rr-button-bar" 
                                                                       style={{width: '325px'}}>
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
		const sW = 'DebugB componentDidMount()';
		diag ( [4], sW );
	}	//	componentDidMount()
	
	componentWillUnmount() {
		const sW = 'DebugB componentWillUnmount()';
		diag ( [4], sW );
	}

	componentDidUpdate() {
		const sW = 'DebugB componentDidUpdate()';
		diag ( [4], sW );
	}	//	componentDidMount()

}   //  class DebugB


export default DebugB;
