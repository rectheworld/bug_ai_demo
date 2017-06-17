window.onload = function() {	
	/// Global varaible Zoo 
    
    var num_bugs = 10;
    
    /// The time between bug releses 
    var bug_delay = 1000;
    var bug_timer; 
    
    


    /// create a temp stable spawn point 
    var temp_spawn = {x: 250, 
                      y: 250}
    var random_angle;
    var num_bug;
    
    var global_test_bug;

	var game = new Phaser.Game(500, 500);
    
//     var preloadAssets = function(game){}
//     
//     preloadAssets.prototype = {
//          preload: function(){
//          
//          },
//          create: function(){
//
//          }
//     } /// end of preload prototype 
//     
//	var titleScreen = function(game){}
//	titleScreen.prototype = {
//        startClick: function(){
//          game.state.start('PlayGame')  
//        },
//        create: function(){
//
//        }
//	} /// End od title screen prototype 
    
    function getRot (bug) { console.log(bug.rotation)}
    
    function cutBugs(num_bugs){
        /// Given a numer of bug (an Int), create a list of
        /// indexes used to cut the bugs in to groups 
        var cuts = []
        var i = 0;
        while (i < num_bugs){
            //// Both sides inclusive 
             i = game.rnd.integerInRange(i + 1, num_bugs)
            cuts.push(i)
        }
        
        console.log(cuts)
        
        return(cuts)
    }
    
    
    //debugger;
    function spawn_branch(fork){

        
       //debugger;
        point1 = {x: fork.x - 70,
                 y: fork.y + 70,
                 rotation: 2.25}
        
        point2 = {x: fork.x - 100,
                 y: fork.y,
                 rotation: 3}

        point3 = {x: fork.x - 70,
                 y: fork.y - 70,
                 rotation: -2.25}
        
        point4 = {x: fork.x,
                 y: fork.y - 100,
                 rotation: -1.5}
        
        point5 = {x: fork.x + 70,
                 y: fork.y - 70,
                 rotation: -.75}
        
        point6 = {x: fork.x + 100,
                 y: fork.y,
                 rotation: 0} 
        
        point7 = {x: fork.x + 70,
                 y: fork.y + 70,
                 rotation: .75}

        tree_routes = [point1,point2,point3, point4, point5, point6, point7]

        this_branch1 = game.rnd.integerInRange(0,6)
        
        this_branch = tree_routes[this_branch1]
        
        return(this_branch)
    }
    
 
    function runTheTree(bug, origin, angle){
        /// angle is in radiants ie Math.PI/4
        
        /// Calculate pointB
        /// from the origin calulate the location of the new point
        /// B by finding the legth of each leg 
        var x_length = Math.cos(angle) * 150
        var y_length = Math.sin(angle) * 150
        
        console.log(origin)
        
        /// origin is an object with an x and y value 
        pointB = {
            x: origin.x + x_length,
            y: origin.y + y_length
        }
        
        this_route = [pointB]
        
        branch1 = spawn_branch(pointB)
        branch2 = spawn_branch({x:branch1.x, y:branch1.y})
        
        this_route.push(branch1)
        this_route.push(branch2)
        
        
        ///console.log(this_route)
        
        
        tween_trunk = game.add.tween(bug).to({x: this_route[0].x, y: this_route[0].y}, 1000, 'Quart.easeOut')
        bug.rotation= angle

        
        tween_branch_first_rotation = game.add.tween(bug).to({rotation: this_route[1].rotation}, 10, 'Quart.easeOut')
        tween_branch_first = game.add.tween(bug).to({x: this_route[1].x, y: this_route[1].y}, 1000, 'Quart.easeOut')
        
        tween_branch_2nd_rotation = game.add.tween(bug).to({rotation: this_route[2].rotation}, 10, 'Quart.easeOut')
        tween_branch_2nd = game.add.tween(bug).to({x: this_route[2].x, y: this_route[2].y}, 1000, 'Quart.easeOut')
        
        
        
        //tween_branch.onComplete.add(getRot, this);
        
        tween_trunk.chain(tween_branch_first_rotation)
        
        tween_branch_first_rotation.chain(tween_branch_first)
        
        tween_branch_first.chain(tween_branch_2nd_rotation)
        tween_branch_2nd_rotation.chain(tween_branch_2nd)
        
        tween_trunk.start()
        
        
        //console.log(bug.rotation)
        //tween_trunk_rotation.start()
        
        global_test_bug = bug;
        //debugger;

    }
    
	var playGame = function(game){}
	playGame.prototype = {
		/// Variable Zoo
        
        preload: function(){
          game.load.image("bug", "assets/Ladybug-icon.png")
          },
        
        
        
		create: function(){
           game.stage.backgroundColor = "#4488AA";
            
            
            // Turn onthe physics 
            game.physics.startSystem(Phaser.Physics.ARCADE);
            
            /// create a group to hold ze bugs 
            bug_group = game.add.physicsGroup();
            
            bug_group.createMultiple(num_bugs, "bug", 0, false)
            
            
            bug_group.setAll("visible", false)
            bug_group.setAll("anchor", {x:0.5, y:0.5})
            bug_group.setAll("collideWorldBounds", true)
            bug_group.setAll("bounce", (1,0))
            
            
            /// create buts in this bug group to make marching groups 
            /// Cuts will be a list of indexes 
            cuts = cutBugs(num_bugs)
            
            /// Start the first cut at the zer oindex of the list
            this_cut = cuts[0]
            /// Start the first trunk angle 
            random_angle = Math.random()*Math.PI*2;
            
            /// Start counting bugs 
            num_bug = 1;
            
            
            bug_timer = game.time.now + bug_delay;
            
		}, /// End of Create Function 
        

        

        
        update: function(){
            
            if(game.time.now > bug_timer){
                
                
                this_bug = bug_group.getFirstDead()
                
                if(this_bug){
                    if(num_bug > this_cut - 1){
                        random_angle = Math.random()*Math.PI*2;
                    }
                    
                    
                    this_bug.reset(temp_spawn.x, temp_spawn.y)
                    
                    runTheTree(this_bug, temp_spawn, random_angle)

                    bug_timer = game.time.now + bug_delay;    
                    
                    num_bug++;
                }
                
            }
            
            /// Point the running bugs towrds its running
//            bug_group.forEachAlive(function(bug){
//                
//            })
//            arrow.rotation = game.physics.arcade.angleBetween(arrow, target);
// 

        },// end of updatae function 
        

        
        render: function(){
 
        }// End of Render function 

        
	} // /End of play game protottype 
    
    

    
//	var gameOver = function(game){}
//	gameOver.prototype = {
//  
//        create: function(){
//
//        }
//		
//	} // End of gameOVer prototype 
//    
////    
//    game.state.add("PreloadAssets", preloadAssets); 
//	game.state.add("TitleScreen", titleScreen);
	game.state.add("PlayGame", playGame);
//	game.state.add("GameOver", gameOver);
//     highScore = localStorage.getItem(localStorageName) == null ? 0 : localStorage.getItem(localStorageName);
	game.state.start("PlayGame");	
} // End of onload function 