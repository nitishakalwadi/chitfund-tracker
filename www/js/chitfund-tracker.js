$.ajaxSetup({ cache: false });

var CFTracker = window.CFTracker || {};

CFTracker.data = CFTracker.data || {};

CFTracker.initialize = function(){
    $(function() {
		init();
	});

	function init(){
		initDatabase();
	}
	
	function initDatabase(){
	    CFTracker.db = openDatabase("myApp", 1.0, "App database",200000);
	    var db = CFT.db;
	    
	    //create chit_master table if not exists
	    db.transaction(function(transaction){
            transaction.executeSql("SELECT table_name FROM sqlite_master WHERE type='table' AND name='chit_master';",
                [],
                function(transaction,results){
                    for (var i = 0; i <= results.rows.length; i++) {
                        var table_name = results.rows.item(i).table_name;
                        if(!table_name){
                            transaction.executeSql("CREATE TABLE chit_master (id INTEGER PRIMARY KEY, amt INTEGER, month INTEGER, note VARCHAR);");
                        }
                    }
                },
                function(e){
                    
                }
            );
        });
	}
}
