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
	    
	    db.transaction(function(transaction){
            transaction.executeSql("SELECT table_name FROM sqlite_master WHERE type='table' AND name='chit_master';",
                [],
                function(transaction,results){
                    for (var i = 0; i <= results.rows.length; i++) {
                    var table_name = results.rows.item(i).table_name;
                    alert(table_name);
                    }
                },
                function(e){
                    
                }
            );
        });
	}
}
