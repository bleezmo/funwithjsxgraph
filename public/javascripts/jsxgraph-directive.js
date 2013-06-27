var app = angular.module('jsxgraph');
app.directive('jsxGraph',function(Canvas){
	return {
		template: "<div id='box' class='jxgbox' style='width:500px; height:500px;'></div>",
		restrict: 'A',
		scope: {
			boardParams: '=boardParams'
		},
		link: function(scope,elem,attr){
				var domain = scope.boardParams.domain
				var range = scope.boardParams.range
				if(domain && range) {
			    	var canvas = new Canvas(JXG.JSXGraph.initBoard('box', {
			    		boundingbox: [(0 - domain), range, domain, (0 - range)], 
			    		axis:true
			    	}));
			    	//add mouse click listener to create points
					canvas.on('up', function(e) {
						var coords = canvas.getMouseCoords(e)
				 		var pointCollision = canvas.pointCollision(coords)
				        if (!pointCollision) {
				        	if(canvas.points.length == 2){
				        		canvas.popPoint();
				        	}
				        	canvas.addPoint(coords)
				        }else{
				        	canvas.removePoint(pointCollision)
				        }
				    })
				}else console.error("domain and/or range unspecified");
		}
	}
});
app.controller('jsxGraphController', ['$scope',function($scope){
	$scope.boardParams = {
		domain: 10,
		range: 10
	}
}]);