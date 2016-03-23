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
	    var db = CFTracker.db;
	    
	    //create chit_master table if not exists
	    db.transaction(function(transaction){
            transaction.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='chit_master';",
                [],
                function(transaction,results){
                    for (var i = 0; i <= results.rows.length; i++) {
                        var table_name = results.rows.item(i).name;
                        if(!table_name){
                            //transaction.executeSql("CREATE TABLE chit_master (id INTEGER PRIMARY KEY, name VARCHAR, monthly_premium INTEGER, months INTEGER);");
                        }
                    }
                },
                function(err){
                    
                }
            );
            //transaction.executeSql("CREATE TABLE chit_transaction (id INTEGER PRIMARY KEY, chit_id INTEGER, bid_amount INTEGER);");
            //transaction.executeSql("INSERT INTO chit_master (amt,months,note values (?,?,?);",[123,456,"test"]);
            transaction.executeSql("INSERT INTO chit_master (name,monthly_premium,months) values ('test',111,222);");
            
        });
        
        db.transaction(function(transaction){alert(123);
                transaction.executeSql("SELECT * from chit_master",
                    [],
                    successCallback,
                    function(err){
                        alert("some error "+err.message);
                    })
            });
            
            function successCallback(transaction,results){
                        for (var i = 0; i <= results.rows.length; i++) {
                            var amount = results.rows.item(i).amt;
                            alert(amount);
                        }
                    }
	}
}
