$.ajaxSetup({ cache: false });

var CFTracker = window.CFTracker || {};
CFTracker.dashboard = CFTracker.dashboard || {};
CFTracker.data = CFTracker.data || {};

CFTracker.dashboard.initialize = function(){
    $(function() {
		init();
	});

	function init(){
		initBindings();
	}
	
	function initBindings(){
	    $('.ui-btn').on('tap', function(){
	        alert(123);
	    });
	}
}