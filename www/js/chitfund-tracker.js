$.ajaxSetup({ cache: false });
$.event.special.tap.emitTapOnTaphold = false;

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
	        // transaction.executeSql("DROP TABLE IF EXISTS chit_master");
	        // transaction.executeSql("DROP TABLE IF EXISTS chit_transaction");
	        transaction.executeSql("CREATE TABLE IF NOT EXISTS chit_master (id INTEGER PRIMARY KEY, chitname VARCHAR, monthly_premium INTEGER, months INTEGER, commission INTEGER);");
	        transaction.executeSql("CREATE TABLE IF NOT EXISTS chit_transaction (id INTEGER PRIMARY KEY, chit_id INTEGER, bid_amount INTEGER, bid_number INTEGER);");
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
        	markup += "<li id='"+data['id']+"' data-chit-id='"+data['id']+"'>";
        	markup += "<a href='#'>"+ data['chitname'] +"</a>";
        	markup += "</li>";
        	
        	$("#dashboardListView").append(markup);
        	$("#dashboardListView").listview( "refresh" );
        }
	}
	
	function initDashboardListTap(){
		$("#dashboardListView")
		.unbind()
		.on("tap", "li", function(){
			var chitId = $(this).data("chit-id");
			CFTracker.data.chitId = chitId;
			$.mobile.navigate( "#chitDetails", { transition : "flip"});
		})
		.on("taphold", "li", function(){
			var chitId = $(this).data("chit-id");
			CFTracker.data.chitId = chitId;
			$("#dashboardPopUp").popup("open");
			return false;
		});
		
		$("#dashboardPopUp #deleteChit").unbind().on("tap", function(){
			var chitId = CFTracker.data.chitId;
			var db = CFTracker.db;
			db.transaction(function(transaction){
				transaction.executeSql("DELETE FROM chit_master WHERE id=?",[chitId]);
				transaction.executeSql("DELETE FROM chit_transaction WHERE chit_id=?",[chitId]);
			});
			$("#dashboardPopUp").popup("close");
			var selector = "#dashboardListView #"+chitId;
			$(selector).remove();
		});
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
		$("#addChit input").val("");
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
		$("#addChit #save").unbind().on("tap", function(){
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
		initChitData();
		initChitDetailsData();
		initBtns();
	}
	
	function initChitData(){
		var db = CFTracker.db;
		var chitId = CFTracker.data.chitId;
		
		var sql = "SELECT * from chit_master where id = " + chitId;
		db.transaction(function(transaction){
			transaction.executeSql(sql, 
				[], 
				populateMasterData, 
				function(err){
                    alert("some error "+err);
                });
		});
		
		function populateMasterData(transaction, results){
			for (var i = 0; i <= results.rows.length; i++) {
        		var row = results.rows.item(i);
        		addMasterData(row);
        		
        	}
		}
		
		function addMasterData(data){
			var markup = "";
			markup += "<div>Chit Name: " + data['chitname'] + "</div>";
			markup += "<div>Monthly Premium: " + data['monthly_premium'] + "</div>";
			markup += "<div>Months: " + data['months'] + "</div>";
			markup += "<div>Commission: " + data['commission'] + "%</div>";
			
			$("#chitDetailsDiv").html(markup);
		}
	}
	
	function initChitDetailsData(){
		var db = CFTracker.db;
		var chitId = CFTracker.data.chitId;
		
		var sql = "SELECT * from chit_transaction where chit_id = " + chitId + " order by bid_number asc";
		db.transaction(function(transaction){
			transaction.executeSql(sql, 
				[], 
				initBidDetails, 
				function(err){
                    alert("some error "+err);
                });
		});
		
		function initBidDetails(transaction, results){
			$("#bidDetails").html("");
			$("#bidDetails").listview( "refresh" );
			for (var i = 0; i <= results.rows.length; i++) {
       			var row = results.rows.item(i);
       			initBidDetailsData(row);
    		}	
		}
	
		function initBidDetailsData(data){
			var markup = "";
        	markup += "<li data-icon='false' id='"+data['id']+"' data-bid-id='"+data['id']+"'>";
        	markup += "<a href='#'>"+ data['bid_amount'] +"</a>";
        	markup += "<a href='#' class='delete-bid ui-btn ui-icon-delete ui-btn-icon-notext ui-btn-inline'>Delete</a>";
        	markup += "</li>";
        	
        	$("#bidDetails").append(markup);
        	$("#bidDetails").listview( "refresh" );
		}
	}
	
	function initBtns(){
		$("#bidDetails").unbind().on("tap", ".delete-bid", function(event){
			event.preventDefault()
			var $li = $(this).parents("li");
			var bidId = $li.data("bid-id");
			var db = CFTracker.db;
			db.transaction(function(transaction){
				transaction.executeSql("DELETE FROM chit_transaction WHERE id=?",[bidId]);
			});
			$li.remove();
		});
	}
	
}


CFTracker = window.CFTracker || {};
CFTracker.data = CFTracker.data || {};
CFTracker.addBid = CFTracker.addBidDialog || {};
CFTracker.addBid.initialize = function(){
    $(function() {
		init();
	});

	function init(){
		clearFormFields();
		initData();
		initBidData();
		initBtns();
	}
	
	function clearFormFields(){
		$("#addBid input").val("");
	}
	
	function initData(){
		var db = CFTracker.db;
		var chitId = CFTracker.data.chitId;
		
		var sql = "SELECT * from chit_master where id = " + chitId;
		db.transaction(function(transaction){
			transaction.executeSql(sql, 
				[], 
				initAddBid, 
				function(err){
                    alert("some error "+err);
                });
		});
		
	}
	
	function initAddBid(transaction, results){
		for (var i = 0; i <= results.rows.length; i++) {
       		var row = results.rows.item(i);
       		initAddBidData(row);
        		
    	}
    }
	
	function initAddBidData(data){
		$("#addBid .chit-details").html("");
		var chitpool = data['monthly_premium'] * data['months'];
		
		var markup = "";
		markup += "<div data-role='fieldcontain'>";
		markup += "Chit Name: " + data['chitname'];
		markup += "</div>";
		markup += "<div data-role='fieldcontain'>";
		markup += "Total Chit Amount: " + chitpool;
		markup += "</div>";
		
		$("#addBid .chit-details").html(markup);
		
	}	
	
	function initBidData(){
		var db = CFTracker.db;
		var chitId = CFTracker.data.chitId;
		
		var sql = "SELECT count(*) as total_bids from chit_transaction where chit_id = " + chitId;
		db.transaction(function(transaction){
			transaction.executeSql(sql, 
				[], 
				initBidCount, 
				function(err){
                    alert("some error "+err);
                });
		});
	}
	
	function initBidCount(transaction, results){
		for (var i = 0; i <= results.rows.length; i++) {
       		var row = results.rows.item(i);
       		initBidCountData(row);
		}
    }
    
    function initBidCountData(data){
    	var totalBids = data['total_bids'];
    	$("#bidnumber").val(totalBids+1);
    }
	
	function initBtns(){
		$("#addBid #save").unbind().on("tap", function(){
			var bidAmount = $("#bidamount").val();
			var chitId = CFTracker.data.chitId;
			var insertArr = [chitId, bidAmount];
			
			var db = CFTracker.db;
			db.transaction(function(transaction){
				transaction.executeSql("INSERT INTO chit_transaction (chit_id, bid_amount) values (?,?);",insertArr);
			});
			//$.mobile.navigate( "#index", { transition : "flip"});
			history.back();
		});
	}
}