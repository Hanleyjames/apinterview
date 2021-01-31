//I created a Connector class with a constructor that takes in a username password and endpoint,
// it then has a method that connects to the api and returns the data or error.
class Connector {
  constructor(endpoint, username, password){
    this.endpoint = endpoint;
    this.password = password;
    this.username = username;
  }

  get connectToApi(){
    return this.connectToApi();
  }

  connectToApi(callback){
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://ap-testing.herokuapp.com/${this.endpoint}`,
        headers:{
          'Authorization' : `Basic ${this.username}:${this.password}`,
          'Content-Type' : 'application/json'
        },
        method: 'GET',
        success: resolve,
        error: reject
      });
    });
  };
}




$(document).ready(function(){

  //Write variables for explicit id targeting. This is more just for clarity sake.
  var $shapes = $('#shapes');
  var $answerone = $('#answer-one');

  //Hide the challenge-number-one and two as they contain information w/r/t the challenge itself.
  $("#challenge-number-one").hide();
  $("#challenge-number-two").hide();

  //set up varables for object instantiation
  let username = "apTestUser";
  let password = "apIsAwesome1234";
  let endpointOne = "secret";
  let endpointTwo = "data";

  //Create a new object that connects to the secret route, log the results and
  //append them to the ptag with the answer-one id, else log an error
  const firstTest = new Connector(endpointOne, username, password);
  firstTest.connectToApi()
  .then(result => {
    console.log("Test Question One: " + JSON.stringify(result));
    $answerone.append(`${JSON.stringify(result)}`);
    $("#challenge-number-one").fadeIn();
  })
  .catch(err => {
    console.log(err);
  });

  //Create a new object that connects to the new route then logs the results as a string,
  //destructuring the JSON objects, and appends the given amounts in the quantity key.
  const secondTest = new Connector(endpointTwo, username, password);
  secondTest.connectToApi()
  .then(result => {
    console.log("Test Question Two: " + JSON.stringify(result));
    //get rid of the loader css and display the 2nd challenge
    $(".loader").hide();
    $("#challenge-number-two").fadeIn();
    //iterate through each key
    $.each(result, function(key,value){
      let shapeClassName = key.toString().replace(/[0-9]/g,'');
      let shapeName = value.name;
      let shapeColor = value.color;
      let shapeQuantity =  value.quantity;
      let shapeSize = value.size.toString().split('x');
      let shapeWidth = shapeSize[0];
      let shapeHeight = shapeSize[1];
      /* left in for clarity if needed
      console.log("shapeClassName: " + shapeClassName + " | shapeName: " +shapeName);
      console.log("shapeColor: " + shapeColor + " | shapeQuantity: " + shapeQuantity);
      console.log("shapeSize: " + shapeSize + " | shapeWidth/Height: "+shapeWidth+ "/"+shapeHeight);
      */
      //Loop over the shape quantity value and insert the key as a class for the list element, and fill the rest in as follows
      for(let i = 0; i < shapeQuantity; i++){
        $shapes.append(`<li class="${shapeClassName} col" style="width: ${shapeWidth}px; height: ${shapeHeight}px; background-color: ${shapeColor}">
                          <p class="shape-name" style="color: white">${shapeName}</p>
                        </li>`).fadeIn();
      }
    })
  })
  .catch(err=>{
    console.log(err);
  });
});
