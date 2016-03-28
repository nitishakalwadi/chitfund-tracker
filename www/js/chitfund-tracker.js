$.ajaxSetup({ cache: false });

var CFTracker = window.CFTracker || {};

CFTracker.data = CFTracker.data || {};

CFTracker.initialize = function(){
    $(function() {
		init();
	});

	function init(){
		clearFormFields();
		initDatabase();
		initBtns();
	}
	
	function clearFormFields(){
		$("#index input").val("");
	}
	
	function initDatabase(){
	    CFTracker.db = openDatabase("myApp", 1.0, "App database",200000);
	    var db = CFTracker.db;
	    
	    //create chit_master and chit_transaction table if not exists
	    db.transaction(function(transaction){
	        transaction.executeSql("DROP TABLE IF EXISTS chit_master");
	        transaction.executeSql("DROP TABLE IF EXISTS chit_transaction");
	        transaction.executeSql("CREATE TABLE IF NOT EXISTS chit_master (id INTEGER PRIMARY KEY, name VARCHAR, monthly_premium INTEGER, months INTEGER, commission INTEGER);");
	        transaction.executeSql("CREATE TABLE IF NOT EXISTS chit_transaction (id INTEGER PRIMARY KEY, chit_id INTEGER, bid_amount INTEGER);");
	    });
	    
	    db.transaction(function(transaction){
	        transaction.executeSql("INSERT INTO chit_master (name,monthly_premium,months,commission) values (?,?,?,?);",["name",1000,1,10]);
	        transaction.executeSql("INSERT INTO chit_master (name,monthly_premium,months,commission) values (?,?,?,?);",["name",2000,1,10]);
	    });
        
        db.transaction(function(transaction){
                transaction.executeSql("SELECT * from chit_master",
                    [],
                    function successCallback(transaction,results){
                        for (var i = 0; i <= results.rows.length; i++) {
                            var amount = results.rows.item(i).monthly_premium;
                            alert(amount);
                        }
                    },
                    function(err){
                        alert("some error "+err);
                    })
            });
            
	}
	
	function initBtns(){
		$("#save").on("tap", function(){
			var chitname = $("#chitname").val();
			var monthlyPremium = $("#monthlyPremium").val();
			var months = $("#months").val();
			var commission = $("#commission").val();
			var insertArr = new Array(chitname, monthlyPremium, months, commission);
			
			var db = CFTracker.db;
			db.transaction(function(transaction){
	        	transaction.executeSql("INSERT INTO chit_master (name,monthly_premium,months,commission) values (?,?,?,?);", insertArr);
	    	});
	    	db.transaction(function(transaction){
                transaction.executeSql("SELECT * from chit_master",
                    [],
                    function successCallback(transaction,results){
                        for (var i = 0; i <= results.rows.length; i++) {
                            var amount = results.rows.item(i).monthly_premium;
                            alert(amount);
                        }
                    },
                    function(err){
                        alert("some error "+err);
                    })
            });
		});
	}
}
