/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

//  Using -
//      https://github.com/jakearchibald/idb

//  On promises -
//      https://developers.google.com/web/ilt/pwa/working-with-indexeddb

import idb		from 'idb';


let db = (function () {

	function create_Layouts ( upgradeDB ) {
		//	Table (object store) name: Layouts
		//	Columns (object properties) -
		//		SystemID		int
		//		UserID			int
		//		LayoutName		varchar(64)
		//		json			varchar(max)
		const keyPath = ['SystemID', 'UserID', 'LayoutName'];
		upgradeDB.createObjectStore ( 'Layouts', { keyPath: keyPath } );
	}	//	create_Layouts()

	function initDB_1 ( db ) {
		let os = null;
	}

	let doInit = false;

	let dbi = idb.open ( 'rr-idb', 1, upgradeDB => {
		//  Note: we don't use 'break' in this switch statement, the 
		//  fall-through behaviour is what we want.
		switch ( upgradeDB.oldVersion ) {
			case 0:
				create_Layouts ( upgradeDB );
				doInit = true;
		}
	} );

	dbi.then ( ( db ) => {
		if ( doInit ) {
			initDB_1 ( db );
			doInit = false;
		}
	} );

	function addLayout ( o ) {
		//	o should be -
		//		{
		//			SystemID:
		//			UserID:	
		//			LayoutName:
		//			JSON:
		//		}
		return dbi.then ( db => {
			const tx = db.transaction ( 'Layouts', 'readwrite' );
			const os = tx.objectStore ( 'Layouts' );
			os.add ( o );
			return tx.complete;
		} );
	}	//	addLayout()

	function updateLayout ( o ) {
		//	o should be -
		//		See addLayout().
		return dbi.then ( db => {
			const tx = db.transaction ( 'Layouts', 'readwrite' );
			const os = tx.objectStore ( 'Layouts' );
			os.put ( o );
			return tx.complete;
		} );
	}	//	updateLayout()

	function loadLayout ( keys ) {
		//	keys should be -
		//		[ <SystemID>, <UserID>, <LayoutName> ]
		return dbi.then ( ( db ) => {
			const tx = db.transaction ( 'Layouts', 'readonly' );
			const os = tx.objectStore ( 'Layouts' );
			return os.get ( keys );
		} );
	}	//	loadLayout()

	function nextLayout ( cursor ) {
		if ( cursor )
			return cursor.continue();
		return dbi.then ( ( db ) => {
			const tx = db.transaction ( 'Layouts', 'readonly' );
			const os = tx.objectStore ( 'Layouts' );
			return os.openCursor();
		} );
	}	//	nextLayout()

	return {
		addLayout:      	addLayout,
		updateLayout:   	updateLayout,
		loadLayout:     	loadLayout,
		nextLayout:     	nextLayout,
	}
} )();


export { db as default };
