var app = angular.module('jsxgraph');
app.directive('jsxGraph',function(Canvas){
	return {
		template: "<div id='box' class='jxgbox' style='width:200px; height:200px;'></div>",
		restrict: 'A',
		scope: {
			boardParams: '=',
			pointsCallback: '=',
			maxPoints: '@',
			mousePtr: '=',
			scale: '@'
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
			        	if(canvas.points.length == scope.maxPoints){
			        		canvas.popPoint();
			        	}
			        	canvas.addPoint(coords)
			        	if(canvas.points.length == 2){
			        		var line = canvas.makeLine();
						}
			        }else{
			        	canvas.removePoint(pointCollision)
			        }
			        scope.pointsCallback(canvas.prettifyPoints())
			    })
			    canvas.on('move', function(e){
			    	var coords = canvas.getMouseCoords(e)
			    	scope.mousePtr = {x: coords.usrCoords[1], y: coords.usrCoords[2]}
			    })
			}else console.error("domain and/or range unspecified");
		}
	}
});
app.controller('jsxGraphController', ['$scope','$timeout',function($scope,$timeout){
	$scope.boardParams = {
		domain: 10,
		range: 10
	}
	$scope.equation = "y = mx + b";
	$scope.points = {A: {x: "", y: ""}, B: {x: "", y: ""}}
	$scope.updatePoints = function(points){
		_.each(points,function(p){
			$scope.points[p.name] = {x: p.x, y: p.y}
		})
		if(points.length == 2){
			var slope = (points[0].y - points[1].y) / (points[0].x - points[1].x)
			var yintercept = points[0].y / (points[0].x * slope)
			$scope.equation = "y = "+slope+"x + "+yintercept;
		}
	}
	$timeout(redraw, 500)
	function redraw(){
		$scope.$digest()
		$timeout(redraw, 500)
	}
}]);