//Answer for First Question, the use of promise enables us to use .then .catch,
//By default async is turned on for each ajax call.

function testAjaxCallOne(callback){
  return new Promise((resolve, reject) =>{
    $.ajax({

      //Set the url to the endpoint
      url: 'https://ap-testing.herokuapp.com/secret',

      //Normally I would set these from environment variables if I was running node
      headers: {
          'Authorization':'Basic apTestUser:apIsAwesome1234',
          'Content-Type':'application/json'
      },
      method: 'GET',
      success: resolve,
      error: reject
    });
  });
};

$(document).ready(function(){

  //Write variables for explicit id targeting. This is more just for clarity sake.
  var $shapes = $('#shapes');
  var $answerone = $('#answer-one');

  //Hide the challenge-number-one and two as they contain information w/r/t the challenge itself.
  $("#challenge-number-one").hide();
  $("#challenge-number-two").hide();

  //Question one, make a get request and return the results in the console,
  //For job interview sake, I just decided to also show it on the html, so no one has to open a console.
  testAjaxCallOne()

    //If successful return the results
    .then(result => {

      //log the results
      console.log("Test Question One: " + JSON.stringify(result));

      //append the JSON results as a string to the answer one paragraph
      $answerone.append(`${JSON.stringify(result)}`);

      //Display the information on the page once loaded
      $("#challenge-number-one").fadeIn();
    })
    .catch(err => {

      //If there's an error, log it to the console. Because I have this documented as working ({"secret":"YARPPP"}),
      //nothing bad should happen.
      console.log(err);
    });

    //Here is the basic version of the second answer
    $.ajax({

      //Set the url to the endpoint
      url: 'https://ap-testing.herokuapp.com/data',

      //Pass Headers from the documentation
      headers: {
          'Authorization':'Basic apTestUser:apIsAwesome1234',
          'Content-Type':'application/json'
      },

      //Set the request method as get
      method: 'GET',

      //On the success of the call, it should log the objects and the style should conform to the values provided by the object.
      success: function(data){

        //Show the stringified version of the JSON data.
        console.log("Test Question Two: " + JSON.stringify(data));

        //Hide the loader div after the data has been returned, then display the div
        $(".loader").hide();
        $("#challenge-number-two").fadeIn();

        //Both .map() and .each() work for this occasion, My reasoning for using .each() is it is meant immutable iteration over an object.
        //.map() is meant to manipulate an object and return that new object/array, and I believe iteration and destructuring is all that's needed.
        //If our call required multiple endpoints, I would be much more inclined to use JS inbuilt map.
        $.each(data, function(i,shape){

          //This section is to destructure this JSON Object into locally scoped variables
          let shapeClassName = i.toString().replace(/[0-9]/g,'');
          let shapeName = shape.name;
          let shapeColor = shape.color;
          let shapeQuantity = shape.quantity;
          let shapeSize = shape.size.toString().split('x');
          let shapeWidth = shapeSize[0];
          let shapeHeight = shapeSize[1];

          /* uncomment for console log breakdown
          console.log("Object destructuring example");
          console.log("shapeClassName: " + shapeClassName + " | shapeName: " +shapeName);
          console.log("shapeColor: " + shapeColor + " | shapeQuantity: " + shapeQuantity);
          console.log("shapeSize: " + shapeSize + " | shapeWidth/Height: "+shapeWidth+ "/"+shapeHeight);
          */
          
          //Iterate over the quantity value for each of the objects given and append a new list element with each of the destructured variables.
          for(let i = 0; i < shapeQuantity; i++){
            $shapes.append(`<li class="${shapeClassName} col" style="width: ${shapeWidth}px; height: ${shapeHeight}px; background-color: ${shapeColor}">
                              <p class="shape-name" style="color: white">${shapeName}</p>
                            </li>`).fadeIn();
          }
        })
      }
    });
})
