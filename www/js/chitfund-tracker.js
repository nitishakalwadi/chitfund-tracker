$.ajaxSetup({ cache: false });

var CFTracker = window.CFTracker || {};
CFTracker.data = CFTracker.data || {};
CFTracker.dashboard = CFTracker.dashboard || {};
CFTracker.dashboard.initialize = function(){
    $(function() {
		init();
	});

	function init(){
		initDatabase();
		initDashboard();
	}
	
	function initDatabase(){
	    CFTracker.db = openDatabase("myApp", 1.0, "App database",200000);
	    var db = CFTracker.db;
	    
	    //create chit_master and chit_transaction table if not exists
	    db.transaction(function(transaction){
	        //transaction.executeSql("DROP TABLE IF EXISTS chit_master");
	        //transaction.executeSql("DROP TABLE IF EXISTS chit_transaction");
	        transaction.executeSql("CREATE TABLE IF NOT EXISTS chit_master (id INTEGER PRIMARY KEY, name VARCHAR, monthly_premium INTEGER, months INTEGER, commission INTEGER);");
	        transaction.executeSql("CREATE TABLE IF NOT EXISTS chit_transaction (id INTEGER PRIMARY KEY, chit_id INTEGER, bid_amount INTEGER);");
	    });
	    
	    db.transaction(function(transaction){
	        //transaction.executeSql("INSERT INTO chit_master (name,monthly_premium,months,commission) values (?,?,?,?);",["testname",1000,1,10]);
	        //transaction.executeSql("INSERT INTO chit_master (name,monthly_premium,months,commission) values (?,?,?,?);",["testname",2000,1,10]);
	    });
        
        // db.transaction(function(transaction){
        //         transaction.executeSql("SELECT * from chit_master",
        //             [],
        //             function successCallback(transaction,results){
        //                 for (var i = 0; i <= results.rows.length; i++) {
        //                     var amount = results.rows.item(i).monthly_premium;
        //                     alert(amount);
        //                 }
        //             },
        //             function(err){
        //                 alert("some error "+err);
        //             })
        //     });
            
	}
	
	function initDashboard(){
		//get all the chits from database
		var db = CFTracker.db;
		db.transaction(function(transaction){
            transaction.executeSql("SELECT * from chit_master",
                [],
                populateDashboard,	//success callback
                function(err){
                    alert("some error "+err);
                });
        });
        
        function populateDashboard(transaction, results){
        	$("#dashboardListView").html("");
        	$("#dashboardListView").listview( "refresh" );
        	for (var i = 0; i <= results.rows.length; i++) {
        		var row = results.rows.item(i);
        		addListItem(row);
        	}
        }
        
        function addListItem(data){
        	var markup = "";
        	markup += "<li>";
        	markup += "<a href='#'>"+ data['name'] +"</a>";
        	markup += "</li>";
        	
        	$("#dashboardListView").append(markup);
        	$("#dashboardListView").listview( "refresh" );
        }
	}
	
}


CFTracker = window.CFTracker || {};
CFTracker.data = CFTracker.data || {};
CFTracker.addChit = CFTracker.addChit || {};
CFTracker.addChit.initialize = function(){
    $(function() {
		init();
	});

	function init(){
		clearFormFields();
		initBtns();
	}
	
	function clearFormFields(){
		$("#index input").val("");
	}
	
	function initBtns(){
		$("#save").on("tap", function(){
			alert(123);
		});
	}
}