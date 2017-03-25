/*
PSEUDOCODE FOR YOLO EVENT GENERATOR

1. Find user location with ipinfo API
2. Generate weather conditions with API based on user location
3. Generate event card based on type of weather
4. Print results to HTML

*/
//Initialize Firebase for subscription modal
var config = {
    apiKey: "AIzaSyCjANjoJMW02iXa1ly07zEYPcgfa_pg3gI",
    authDomain: "yolo-2dba3.firebaseapp.com",
    databaseURL: "https://yolo-2dba3.firebaseio.com",
    storageBucket: "yolo-2dba3.appspot.com",
    messagingSenderId: "1004684398228"
};

firebase.initializeApp(config);


//Global Variables for Firebase 

var database = firebase.database();
var sv; //To shorten a call for snapshot value 
var firstName;
var lastName;
var email;



//on page load run the following
$(document).ready(function() {
    getcity();
    $("img.logo").on("click", function() {
        $(".yolo-overlay").removeClass("hidden");

    });

    //Firebase database
    database.ref().on('value', function(snap) {
        sv = snap.val();
    });

    // pulling city name from ip address
    function getcity() {
        $.get("http://ipinfo.io", function(response) {
            console.log(response.city);
            $("#city").html(response.city);
            weather(response.city);
        }, "jsonp")
    };

    function weather(cityname) {
        var APIKey = "166a433c57516f51dfab1f7edaed8413";

        // Here we are building the URL we need to query the database
        var queryURL = "http://api.openweathermap.org/data/2.5/forecast?" +
            "q=" + cityname + "&units=imperial&cnt=1&appid=" + APIKey;

        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
                url: queryURL,
                method: "GET"
            })
            // We store all of the retrieved data inside of an object called "response"
            .done(function(response) {

                // Log the queryURL
                console.log(queryURL);

                // Log the resulting object
                console.log(response);


                // variables to set up conditions for event or venue pull

                var weatherStatus = response.list[0].weather[0].main;
                console.log(weatherStatus);

                var temperature = response.list[0].main.temp;
                console.log(temperature);

                //conditionals for event card pull

                if ((weatherStatus = "clear sky" || "few clouds" || "scattered clouds") && (temperature >= 75)) {
                    console.log('we are going outside');
                    generateOutdoorEvent();

                } else {
                    console.log('we are staying inside');
                    generateIndoorEvent();

                }

            });
    };

    function generateOutdoorEvent() {

        //placeholder for outdoor event info. hopefully we can utilize Google or Yelp API if we can solve CORS issue
        var outdoorObject = {

            outdoor1: {
                name: 'Lake Eola Park',
                image: '<img src= "http://www.cityoforlando.net/parks/wp-content/uploads/sites/40/2016/04/eolaslide2.jpg" width="800" height="400" >',
                address: '512 E Washington St, Orlando, FL 32801',
                description: 'Lake Eola Park is located in the heart of Downtown Orlando. The sidewalk that circles the lake is .9 miles in length, making it easy for visitors to keep track of their walking or running distances. Other activities available to park visitors include renting swan-shaped paddle boats, feeding the live swans and other birds inhabiting the park, seeing a concert or a play in the Walt Disney Amphitheater, grabbing a bite to eat at Relax Grill on Lake Eola or relaxing amid beautiful flower beds and a spectacular view of Orlando’s skyline.'

            },
            outdoor2: {
                name: 'Wekiva Island',
                image: '<img src="http://wekivaisland.wpengine.com/wp-content/uploads/bartlettimage-4570.jpg" width="800" height="400">',
                address: '1014 Miami Springs Dr, Longwood, FL 32779',
                description: 'A favorite local gathering spot on the river, The Tooting Otter is Wekiva Island’s outdoor and indoor bar. Come relax with drinks on the water or cool off in the AC and enjoy our newly renovated craft beer and wine bar inside. Craft and domestic beer, large wine selection, soda, water, snacks and delicious menu items are always readily available.'
            }
        }

        // Creates and pulls random event value
        var eventCard = outdoorObject[Object.keys(outdoorObject)[Math.floor(Math.random() * Object.keys(outdoorObject).length)]];
        console.log(eventCard);

        //prints event card to random.html
        $('.eventHeaderImage').html(eventCard.image);
        $('.event-header').html(eventCard.name);
        $('.event-info').html(eventCard.description);
    }


    function generateIndoorEvent() {
        //placeholder for outdoor event info. hopefully we can utilize Google or Yelp API if we can solve CORS issue
        var indoorObject = {
            indoor1: {
                name: 'Dr. Phillips Center for the Performing Arts',
                image: '<img src="assets/images/philipsheader.jpg">',
                address: '445 S Magnolia Ave, Orlando, FL 32801',
                description: 'The Dr. Phillips Center for the Performing Arts is a performing arts center in Downtown Orlando, Florida, United States. It replaced the Bob Carr Performing Arts Centre, originally opened as the Orlando Municipal Auditorium in 1927.',
                media: '<img src="assets/images/philips1.jpg"><img src="assets/images/philips2.jpg">',
            },
            indoor2: {
                name: 'RDV Sportsplex Ice Den',
                image: '<img src="assets/images/sportsplexheader.jpg">',
                address: '8701 Maitland Summit Blvd, Orlando, FL 32810',
                description: 'Spacious ice rink for public skating, hockey & events also hosts classes & competitions.',
                media: '<img src="assets/images/sportsplex1.jpg"><img src="assets/images/sportsplex2.jpg">',

            }
        }

        // Creates and pulls random event value
        var eventCard = indoorObject[Object.keys(indoorObject)[Math.floor(Math.random() * Object.keys(indoorObject).length)]];
        console.log(eventCard);

        //prints event card to random.html
        $('.eventHeaderImage').html(eventCard.image);
        $('.event-header').html(eventCard.name);
        $('.event-info').html(eventCard.description);
        $('.eventMediaImages').html(eventCard.media);
    }

    //Pull subscription email and send to firebase

    $('#subscribe').on('click', function() {
        firstName = $('#firstName').val().trim();
        lastName = $('#lastName').val().trim();
        email = $('#email').val().trim();

        console.log(firstName);

        //send to firebase

        database.ref().push({
            name: {
                first: firstName,
                last: lastName
            },
            email: email
        })

        console.log(sv);
    });

    //reset button

    $("#next-button").on("click", function() {
       getcity();
   })

});
