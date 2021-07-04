var dog,sadDog,happyDog,garden,bedroom,washroom, database,livingroom;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;
var sleepyMood;
var Milkbottle;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("Happy.png");
garden=loadImage("Garden.png");
washroom=loadImage("Wash Room.png");
bedroom=loadImage("Bed Room.png");
Milkbottle=loadImage("milk.png")
livingroom=loadImage("Living Room.png")

}

function setup() {
  database=firebase.database();
  createCanvas(900,900);
  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,120);
  if(feed.mousePressed(function(){
    foodS=foodS-1
    dog.addImage(happyDog)
    foodS.visible=true
    gameState=1
    database.ref('/').update({'gameState':gameState});
  }))
  if(gameState===1){
dog.addImage(happyDog)
dog.scale=0.175
Milkbottle.visible=true

dog.y=250;
  }

  addFood=createButton("Add Food");
  addFood.position(800,120);
  if (addFood.mousePressed(function(){
    gameState=2
    dog.addImage(sadDog)
    database.ref('/').update({'gameState':gameState});
  }))
  if(gameState===2){
    dog.addImage(sadDog)
    dog.scale=0.175
    Milkbottle.visible=false;
    dog.y=250;
  }


  sleepyMood=createButton("I am very sleepy")
sleepyMood.position(830,95)
if(sleepyMood.mousePressed(function(){
  gameState=4;
  foodObj.bedroom()
  database.ref('/').update({'gameState':gameState});

}))
if(gameState===4){
 foodObj.bedroom()
  dog.scale=1
  Milkbottle.visble=false
}

bath=createButton("I want to take bath")
bath.position(700,95)
if(bath.mousePressed(function(){
  foodObj.washroom()
  gameState=3
  database.ref('/').update({'gameState':gameState});
      }))
      if(gameState===3){
     foodObj.washroom()
        dog.scale=1
        Milkbottle.visible=false
      }

play=createButton("lets play")
play.position(600,95)
if(play.mousePressed(function(){
  gameState=5;
  foodObj.livingroom()
  database.ref('/').update({'gameState':gameState});

}))
if(gameState===5){
  foodObj.livingroom()
  dog.scale=1
  Milkbottle.visible=false
}


enjoyplay=createButton("lets play at park")
enjoyplay.position(450,95)
if(enjoyplay.mousePressed(function(){
  gameState=6
  foodObj.garden()
  database.ref('/').update({'gameState':gameState});
}))
if(gameState===6){
foodObj.garden()
  dog.scale=1
  Milkbottle.visible=false

}










}

function draw() {

 
   if(foodS===0){
     dog.addImage(happyDog)
     Milkbottle.visible=false;  
    }else{
      dog.addImage(sadDog)
      Milkbottle.visible=true
    }
    

    
   if (lastFed >=12) {
     textSize(20)
     fill ("black")
    text("Last feed: " + lastFed % 12 + " PM", 350, 30);
   }else  if(lastFed===0){
    textSize(20)
     fill('black')
     text("Last feed: 12 AM", 350, 30);
   } else {
    textSize(20)
 fill("black")
    text("Last feed: " + lastFed + " AM", 350, 30);

  }
       

  drawSprites();
  
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}
function writeStock(x){
  database.ref('/').update({
    food:x
  })
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
 
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}


//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}