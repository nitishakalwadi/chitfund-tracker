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
            transaction.executeSql("CREATE TABLE chit_master (id INTEGER PRIMARY KEY, amt INTEGER, months INTEGER, note VARCHAR);");
            transaction.executeSql("CREATE TABLE chit_transaction (id INTEGER PRIMARY KEY, chit_id INTEGER, bid_amount INTEGER);");
            transaction.executeSql("INSERT INTO chit_master (amt,months values (?,?);",[123,456]);
            
            db.transaction(function(transaction){
                transaction.executeSql("SELECT * from expense ",
                    [],
                    function(transaction,results){
                        for (var i = 0; i <= results.rows.length; i++) {
                            var amount = results.rows.item(i).amt;
                            alert(amount);
                        }
                    },
                    function(e){
                        console.debug("some error")
                    })
            })
        });
	}
}
