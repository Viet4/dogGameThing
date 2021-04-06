var dog, sitDog, happyDog;
var food, foodStock = 10;
var database;
//var milk;
var feedFood, addFood;
var fedTime, lastFed;
var foodObj;

function preload() {
  
  sitDog = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
}

function setup() {
	createCanvas(500, 500);
  
  dog = createSprite(250,250,50,50);
  dog.addImage(sitDog);
  dog.scale = 0.25;

  database = firebase.database();

  
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);
  

  foodObj = new Milk();

  feedFood = createButton("Feed the Dog");
  feedFood.position(375,95);
  feedFood.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(750,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(46, 139, 87);

  /*
  if (keyWentDown(UP_ARROW)) {

    writeStock(food);
    dog.addImage(happyDog);
  }
  */

  foodObj.display();

  fedTime = database.ref("lastFed");
  fedTime.on("value", function(data){
    lastFed= data.val();
  });

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed: " + lastFed%12 + " PM", 350, 30);
  }else if(lastFed===0){
    text("Last Feed: 12 AM", 350, 30);
  }else{
    text("Last Feed: " + lastFed + " AM", 350, 30);
  }

  
  drawSprites();

  fill(255);
  stroke(255);
  text("Note: Press Up Arrow to Feed Drago Milk", 140, 50);
}


function readStock(data) {

  food = data.val();
}

function writeStock(x) {

  if (x<=0) {
    x=0;
  } else {
    x=x-1;
  }

  database.ref('/').update({
    Food:x
  })
}


function feedDog(){
  dog.addImage(happyDog);
  
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref("/").update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  });
}

function addFoods(){
  food++;
  database.ref("/").update({
    Food:food
  });
}