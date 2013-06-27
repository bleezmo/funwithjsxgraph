angular.module('jsxgraph', []).factory('Canvas', function(){
	return function(board){
		this.points = [];
		this.getMouseCoords = function(e){
	        return new JXG.Coords(JXG.COORDS_BY_SCREEN, [e.offsetX, e.offsetY], board);
		}
		this.pointCollision = function(coords){
			for (var el in board.objects) {
	            if(JXG.isPoint(board.objects[el]) && board.objects[el].hasPoint(coords.scrCoords[1], coords.scrCoords[2])) {
	            	return el;
	            }
	        }
	        return undefined;
		}
		this.addPoint = function(coords){
			var point = board.create('point', [coords.usrCoords[1], coords.usrCoords[2]]);
			this.points.unshift(point)
			if(this.points.length == 2){
				board.create('line',[this.points[0],this.points[1]], {strokeColor:'#00ff00',strokeWidth:2})
			}
		}
		this.popPoint = function(){
			board.removeObject(this.points.shift());
		}
		this.removePoint = function(point){
			board.removeObject(point)
			this.points = _.filter(this.points,function(p){
				return p.id != point;
			})			
		}
		this.on = function(event,handler){
			board.on(event,handler);
		}
	}
})