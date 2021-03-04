class Player {
    constructor(){
       
       this.index = 0;
       this.name = 0;
       this.distance = 0;
       this.xPos = 0
       this.ended = false
       this.time = 0;
       this.isCollided = false;
       this.score = 0;
       
    }
      getCarsAtEnd(){
        database.ref('CarsAtEnd').on("value", (data)=>{
            carsAtEnd= data.val();
            
        })

    }

    static updateCarsAtEnd(rank){
        database.ref('/').update({
            CarsAtEnd:rank
        })
    }

    updateRank(rank){
        var playerIndex = "players/player" + this.index;
        database.ref(playerIndex).update({
            rank:rank
        })

    }

    getCount(){
        var playerCountRef = database.ref("playerCount")
        playerCountRef.on("value", function(data){
            playerCount = data.val()
        })
     }

     updateCount(count) {
         database.ref("/").update({
             playerCount: count
         })
     }

      update() {
          var playerIndex = "players/player" + this.index;
          //"player" + 1, player1 name: form
          database.ref(playerIndex).set({
              name:this.name,
              distance: this.distance,
              xPos: this.xPos ,
              score : this.score
              
          })


      }
      //it is not specific to the player, or an object
      static getPlayerInfo() {
          var playerInfoRef = database.ref('players');
          playerInfoRef.on("value",function(data) {
              allPlayers = data.val()
          })
      }
}