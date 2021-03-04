class Game{
    constructor(){
        this.vis = 255
        this.time = 0
    }

    getState(){
        var gameStateRef = database.ref("gameState");
        
        gameStateRef.on("value", function(data){
            gameState = data.val();
        })

    }

    update(x){    
        database.ref('/').update({
            "gameState": x
        })
    }

    async start(){
      
        if(gameState === 0){
           
            player = new Player()
            var playerCountRef = await database.ref('playerCount').once("value")
             if(playerCountRef.exists()){
                playerCount = playerCountRef.val()
                player.getCount()
             }

            form = new Form()
            form.display()
        }
        starGroup=new Group()
        car1 = createSprite(470,650,20,50);
        car1.addImage(car1Img);
        car2 = createSprite(570,650,20,50);
        car2.addImage(car2Img);
        car3 = createSprite(670,650,30,50);
        car3.addImage(car3Img);
        car4 = createSprite(770,650,30,50);
        car4.addImage(car4Img);
        cars = [car1,car2,car3,car4]
        
    }

    play(){   
        if(player.ended === false && player.distance<12500){
            if(keyIsDown(UP_ARROW) && player.index !== null ){
                player.distance +=50
            }
            if(keyIsDown(LEFT_ARROW) && player.index !== null && cars[player.index-1].x > 440){
                player.xPos =  player.xPos -10
            }
            if(keyIsDown(RIGHT_ARROW) && player.index !== null && cars[player.index-1].x < 850){
                player.xPos=  player.xPos +10 
            }
        }
        console.log(cars[player.index-1].x)

        // if player is touching anyother car then update the db with new positions of x and stop the cars.
        
       for(var i=0;i<cars.length;i++){
                
            if(cars[player.index-1].isTouching(cars[i])){       
                cars[player.index-1].collide(cars[i])
                player.xPos = cars[player.index-1].x - 480 + (i * 100);
            }        
        }      
          
        player.update();
        
               
        if(player.distance >= 12500 && player.ended === false){       
                       
            carsAtEnd++
                
            player.updateRank(carsAtEnd)
            Player.updateCarsAtEnd(carsAtEnd)
            player.ended = true
        }

         if(carsAtEnd === 2){
            game.update(2)
         }

         if(frameCount%100 === 0){
            var star = createSprite(random(460,820),random(100,-12500),2,2)
        
            star.addImage(starImg)
            star.scale = 0.25
            starGroup.add(star)
         }

         
            //fill code here, to destroy the objects.
        for(var i =0; i< starGroup.length; i++){
            if(starGroup.get(i).isTouching(cars[player.index-1])){
                starGroup.get(i).destroy();
                player.score = player.score + 1;
                player.update();
            }
        }
      
      
    }
    
    display(){
        form.hideElements()
        image(bg,0, -900*12.8, displayWidth, 900*15)
        
        image(track, 300, -900*12.8, displayWidth/2, 900*15);
        Player.getPlayerInfo()
        player.getCarsAtEnd();
        push()
        textSize(20)
        fill("red")
        
        var index = 0;//array index

        var x=0,y=0;
        var pos = camera.position.y-300;
        push()
        textSize(25);
        textStyle(BOLDITALIC); 
        fill("Black")
        
        textAlign(CENTER);
        text("Time:" + game.time, displayWidth/2-600,pos-20)
        text("Player    Distance   stars\n", displayWidth-150, pos); 
        pop()
        for(var plr in allPlayers){
            x = 480 + (index * 100) + allPlayers[plr].xPos;
            y = displayHeight - allPlayers[plr].distance + 800
            cars[index].x = x
            cars[index].y = y
         
            if(player.index === index+1){

                //player.xPos = x
                //player.update();
                fill("red")
                push()
                stroke(10);
                
                ellipse(x,y,60,60)
                pop()
                camera.position.x = displayWidth/2
                camera.position.y = cars[index].y 
                            

            } else{
                fill("white")
            }  
            
            pos = pos + 30;                      
            
            stroke("white"); 

            textSize(25)
            text(allPlayers[plr].name +"   " + Math.round(allPlayers[plr].distance)+"   " + allPlayers[plr].score,displayWidth-250, pos)
            
            push()
            textAlign(CENTER);
            textSize(20);
            text(allPlayers[plr].name, cars[index].x, cars[index].y + 75);
            pop()

            if(allPlayers[plr].rank !== 0){
                push()
                textSize(40)
                fill("White")
                                
                text(allPlayers[plr].rank, cars[index].x, cars[index].y + 125);

                pop()
                if(allPlayers[plr].rank === 1 && gameState === 2){
                    push()
                    winner = allPlayers[plr].name
                    fill(255,204,0,this.vis)
                    noStroke()
                    textSize(25)
                    text("WINNER",cars[index].x-40, cars[index].y - 50)
                
                    pop()
                    this.vis = this.vis - 10
                    if(this.vis < 0){
                        this.vis = 255
                    }
                }
            }            
            
            index = index+1                
        }

    
    drawSprites()

    }

    end(){
        
           //text("GAME OVER! CLICK ON RESET TO PLAY AGAIN!!",displayWidth/2,-(900*12.8)+200)
            var endMsg = createElement('h1')
            endMsg.position(displayWidth/2-350 ,displayHeight/2-300)
            endMsg.style.color = "white"
            endMsg.html("GAME OVER! CLICK ON RESET TO PLAY AGAIN!!")

            var endMsg1 = createElement('h1')
            endMsg1.position(displayWidth/2-250 ,displayHeight/2-200)
            endMsg1.style.color = "white"
            endMsg1.html(" CONGRATULATIONS    " +  winner)
            if(frameCount%10 === 0){
                
                var star = createSprite(random(10,displayWidth-50),-(900*12.8)+20,20,20)
    
                star.addImage(starImg)
                switch(Math.round(random(1,4))){
                    case 1: star.tint= "rgba(255,255,255,1)"
                            break
                    case 2: star.tint= "rgba(255,255,255,0.25)"
                            break
                    case 3: star.tint= "rgba(255,255,255,0.5)"
                            break
                    case 4: star.tint= "rgba(255,255,255,0.8)"
                            break                        
                        }
                star.scale = random(0.1,0.5)
                star.velocityY = random(5,10)               
                star.lifetime = 200
            }
            drawSprites()        
        }
       
}
    
  
      
