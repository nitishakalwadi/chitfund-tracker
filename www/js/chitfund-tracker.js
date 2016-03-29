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
		initDashboardListTap();
	}
	
	function initDatabase(){
	    CFTracker.db = openDatabase("myApp", 1.0, "App database",200000);
	    var db = CFTracker.db;
	    
	    //create chit_master and chit_transaction table if not exists
	    db.transaction(function(transaction){
	        //transaction.executeSql("DROP TABLE IF EXISTS chit_master");
	        //transaction.executeSql("DROP TABLE IF EXISTS chit_transaction");
	        transaction.executeSql("CREATE TABLE IF NOT EXISTS chit_master (id INTEGER PRIMARY KEY, chitname VARCHAR, monthly_premium INTEGER, months INTEGER, commission INTEGER);");
	        transaction.executeSql("CREATE TABLE IF NOT EXISTS chit_transaction (id INTEGER PRIMARY KEY, chit_id INTEGER, bid_amount INTEGER);");
	    });
	    
	    db.transaction(function(transaction){
	        //transaction.executeSql("INSERT INTO chit_master (chitname,monthly_premium,months,commission) values (?,?,?,?);",["testname",1000,1,10]);
	        //transaction.executeSql("INSERT INTO chit_master (chitname,monthly_premium,months,commission) values (?,?,?,?);",["testname",2000,1,10]);
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
        	markup += "<li data-chit-id='"+data['id']+"'>";
        	markup += "<a href='#'>"+ data['chitname'] +"</a>";
        	markup += "</li>";
        	
        	$("#dashboardListView").append(markup);
        	$("#dashboardListView").listview( "refresh" );
        }
	}
	
	function initDashboardListTap(){
		$("#dashboardListView").unbind().on("tap", "li", function(){
			var chitId = $(this).data("chit-id");alert(chitId);
			CFTracker.data.chitId = chitId;
			$.mobile.navigate( "#chitDetails", { transition : "flip"});
		});
		
		// $("#dashboardListView").unbind().on("taphold", "li", function(){
		// 	alert("taphold");
		// });
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
		// initValidation();
		initBtns();
	}
	
	function clearFormFields(){
		$("#index input").val("");
	}
	
	// function initValidation(){
	// 	var validationRules = {
	// 		chitname: {
	// 			required: true,
	// 			maxlength: 128
	// 		},
	// 		monthlyPremium: {
	// 			required: true,
	// 			maxlength: 32,
	// 			number: true
	// 		},
	// 		months: {
	// 			required: true,
	// 			maxlength: 32,
	// 			number: true
	// 		},
	// 		commission: {
	// 			required: true,
	// 			maxlength: 32,
	// 			number: true
	// 		}
	// 	};
		
	// 	var formValidator = $("#addchitForm").validate({
	// 		rules: validationRules,
	// 		ignore: [], //allow hidden fields to be validated
	// 		onsubmit: false,
	// 		errorPlacement: "",
	// 		errorElement: "error",
	// 		errorClass: "invalid",
	// 		validClass: "valid",
	// 		highlight: "",
	// 		unhighlight: ""
	// 	});
	// }
	
	function initBtns(){
		$("#save").on("tap", function(){
			var chitname = $("#chitname").val();
			var monthly_premium = $("#monthlyPremium").val();
			var months = $("#months").val();
			var commission = $("#commission").val();
			var insertArr = [chitname, monthly_premium, months, commission];
			
			//if( $('#addchitForm').valid() ){
				var db = CFTracker.db;
				db.transaction(function(transaction){
					transaction.executeSql("INSERT INTO chit_master (chitname,monthly_premium,months,commission) values (?,?,?,?);",insertArr);
				});
				//$.mobile.navigate( "#index", { transition : "flip"});
				history.back();
			// }
		});
	}
}


CFTracker = window.CFTracker || {};
CFTracker.data = CFTracker.data || {};
CFTracker.chitDetails = CFTracker.chitDetails || {};
CFTracker.chitDetails.initialize = function(){
    $(function() {
		init();
	});

	function init(){
		alert(CFTracker.data.chitId);
		
	}
}