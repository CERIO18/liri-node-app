require("dotenv").config();
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);


// node liri.js movie-this '<movie name here>'

// info for request
var request = require("request");

var moment = require("moment");

// Info for fs
var fs = require("fs");

var command = process.argv[2];

function movieThis(movieTitle) {
  if (movieTitle === undefined) {

    movieTitle = "Mr. Nobody";
  }

  request("https://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy", function (error, response, data) {
    if (!error && response.statusCode === 200) {
      console.log(data);
      console.log("");

      console.log("Title: " + JSON.parse(data).Title);
      console.log("Year Released: " + JSON.parse(data).Year);
      console.log("IMDB Rating: " + JSON.parse(data).imdbRating);

      var rottenTomatoesExists = false;
      var index;
      var ratings = JSON.parse(data).Ratings;
      for (var i = 0; i < ratings.length; i++) {
        if (ratings[i].Source === 'Rotten Tomatoes') {
          rottenTomatoesExists = true;
          index = i;
          break;
        }
      }

      if (rottenTomatoesExists) {
        console.log('Rotten Tomatoes rating: ' + ratings[index].Value);
      } else {
        console.log('Rotten Tomatoes rating not found');
      }

      console.log("Country Produced: " + JSON.parse(data).Country);
      console.log("Language: " + JSON.parse(data).Language);
      console.log("Plot: " + JSON.parse(data).Plot);
      console.log("Actors: " + JSON.parse(data).Actors);
      console.log("");

    }
  });
};

function concertThis(nameArtist) {
  request("https://rest.bandsintown.com/artists/" + nameArtist + "/events?app_id=codingbootcamp", function (error, response, data) {
    if (!error && response.statusCode === 200) {


      console.log("Venue: " + JSON.parse(data)[0].venue.name);
      console.log("Location: " + JSON.parse(data)[0].venue.city + " " + JSON.parse(data)[0].venue.region);
      console.log("Date: " + moment(JSON.parse(data)[0].datetime).format("MM/DD/YYYY"));

      console.log("");
    
    }

  });
}

function songThis(song) {
  if (song === undefined) {
    song = "The Sign";
  }
  spotify.search({ type: "track", query: song }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);

    }

    console.log("");

    console.log("Artist: " + data.tracks.items[0].artists[0].name);
    console.log("Song Name: " + data.tracks.items[0].name);
    console.log("Preview Link: " + data.tracks.items[0].preview_url);
    console.log("Album: " + data.tracks.items[0].album.name);

    console.log("");

  });
}

// movie
if (command === "movie-this") {

  var movie = process.argv[3];
  movieThis(movie);

}


else if (command === "concert-this") {

  var artist = process.argv[3];
  concertThis(artist);
}


else if (command === "spotify-this-song") {
  var song = process.argv[3];

  songThis(song);
}


else if (command === "do-what-it-says") {

  fs.readFile("random.txt", "utf8", function (error, data) {

    if (error) {
      return console.log(error);
    }

    console.log(data);
    var dataArr = data.split(", ");
    console.log(dataArr);

    command = dataArr[0];
    doWhatItSays = dataArr[1];

    if (command === "concert-this") {
      var artist = doWhatItSays;
      concertThis(artist);

    } else if (command === "movie-this") {
      var movie = doWhatItSays;
      movieThis(movie);

    } else if (command === "spotify-this-song") {

      var song = doWhatItSays;
      songThis(song);

      if (song === undefined) {
        song = "The Sign";
      }
      spotify.search({ type: "track", query: song }, function (err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);

        }
        console.log("");
        console.log("");

        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song Name: " + data.tracks.items[0].name);
        console.log("Preview Link: " + data.tracks.items[0].preview_url);
        console.log("Album: " + data.tracks.items[0].album.name);

        console.log("");
       
      });

    }
  });
} else {
  console.log("Error!")
}



