import React 				from 'react';
import ReactDOM 			from 'react-dom';
import './index.css';
/*
import AppFrame				from './app-frame';
*/
import App  				from './client/app';
import * as serviceWorker 	from './serviceWorker';

/*
ReactDOM.render ( <AppFrame />, document.getElementById ( 'rr-app-root' ) );
*/
ReactDOM.render ( <App />, document.getElementById ( 'rr-app-root' ) );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
