angular.module('jsxgraph', []).factory('Canvas', function(){
	return function(board){
		this.points = [];
		//given mouse clicke event e, get the coordinates on the board that was clicked
		this.getMouseCoords = function(e){
	        return new JXG.Coords(JXG.COORDS_BY_SCREEN, [e.offsetX, e.offsetY], board);
		}
		//if there is a collision, return the point that coords collides with
		//otherwise return undefined
		this.pointCollision = function(coords){
			for (var el in board.objects) {
	            if(JXG.isPoint(board.objects[el]) && board.objects[el].hasPoint(coords.scrCoords[1], coords.scrCoords[2])) {
	            	return el;
	            }
	        }
	        return undefined;
		}
		//add a point to the board, update the points array
		this.addPoint = function(coords){
			var point = board.create('point', [coords.usrCoords[1], coords.usrCoords[2]]);
			this.points.push(point)
			return point;
		}
		//remove the last point
		this.popPoint = function(){
			board.removeObject(this.points.pop());
		}
		this.removePoint = function(pointId){
			board.removeObject(pointId)
			this.points = _.filter(this.points,function(p){
				return p.id != pointId;
			})
		}
		this.on = function(event,handler){
			board.on(event,handler);
		}
		this.makeLine = function(){
			if(this.points.length == 2){
				return board.create('line',[this.points[0],this.points[1]], {strokeColor:'#00ff00',strokeWidth:2})
			}
		}
		this.prettifyPoints = function(){
			return _.map(this.points, function(p){
				return {name: p.name, x: p.coords.usrCoords[1], y: p.coords.usrCoords[2]}
			})
		}
	}
})