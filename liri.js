require("dotenv").config();
// code required to import the keys.js file and store it in a variable
var keys = require("./keys.js");

var Twitter = require("twitter");

var client  = new Twitter(keys.twitterKeys);

var params = {screen_name: "inrtracker"};
client.get("statuses/user_timeline", params, function (error, tweets, response) {
    if (!error) {
        console.log(tweets);

for (var i=0; i<tweets.length; i++) {
    console.log(tweets[i].created_at);
    console.log("");
    console.log(tweets[i].text);
}










    }
});

var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);
// var cTable = require("console.table");
var request = require("request");
var moment = require("moment");
var axios = require("axios");
var fs = require("fs");


if (process.argv[2] === "concert-this") {
    var artist = process.argv.slice(3).join(" ");
    console.log(artist);

    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request(queryURL, function (error, response, body) {
        if (error) console.log(error);
        var result = JSON.parse(body)[0];
        console.log("Venue name: " + result.venue.name);
        console.log("Venue location: " + result.venue.city);
        console.log("Date of Event: " + moment(result.dateTime).format("MM/DD/YYYY"));
    });
} else if (process.argv[2] === "spotify-this-song") {
    var songName = process.argv.slice(3).join(" ");
    // default if left blank
    if (!songName) {
        songName = "The sign + Ace of Base";
    }
    // song name input, query one result
    spotify.search({
        type: "track",
        query: songName,
        limit: 1
    }, function (err, data) {
        if (err) {
            console.log("Error occurred: " + err);
            return;
        }

        var tableArray = [];

        for (var i = 0; i < data.tracks.items.length; i++) {
            var result = {
                artist: data.tracks.items[i].album.artists[0].name,
                album_name: data.tracks.items[i].album.name,
                song_name: data.tracks.items[i].name,
                preview_url: data.tracks.items[i].preview_url
            }
            tableArray.push(result);
        }
        var table = cTable.getTable(tableArray);
        console.log(table);
    });
    // Movie
} else if (process.argv[2] == 'movie-this') {
    var movieName = String(process.argv.slice(3));
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=a1c0b24e";
    //if the movie name is left blank, default to Mr. Nobody
    if (!movieName) {
        movieName = "Mr. Nobody";
        queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=a1c0b24e";
        axios.get(queryUrl).then(

            function (response) {

                console.log("Title:" + response.data.Title);
                console.log("Year:" + response.data.Released);
                console.log("IMDB Rating:" + response.data.imdbRating);
                console.log("Rotten Tomatoes:" + response.data.Ratings[1].Value);
                console.log("Country:" + response.data.Country);
                console.log("Language:" + response.data.Language);
                console.log("Movie Plot:" + response.data.Plot);
                console.log("Actors:" + response.data.Actors);

            });
    } else {
        axios.get(queryUrl).then(
            function (response) {

                console.log("Title:" + response.data.Title);
                console.log("Year:" + response.data.Released);
                console.log("IMDB Rating:" + response.data.imdbRating);
                console.log("Rotten Tomatoes:" + response.data.Ratings[1].Value);
                console.log("Country:" + response.data.Country);
                console.log("Language:" + response.data.Language);
                console.log("Movie Plot:" + response.data.Plot);
                console.log("Actors:" + response.data.Actors);
            });
    }
    //do-what-it-says: read random.txt file, retrieve the information
} else if (process.argv[2] == 'do-what-it-says') {

    var fs = require("fs");
    //Read random.txt file
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error)
        }

        //split the data from the random.txt file into two array items
        var data;
        data = data.split(",");

        var search = data[0]; //the command(spotify-this-song, concert-this, or movie-this)
        var userInput = data[1]; //the thing the user is searching for (song title, band name, or movie title)
        // console.log(search + userInput);

        if (search == "spotify-this-song") {
            // console.log("YAY!");
            spotify.search({
                type: 'track',
                query: userInput,
                limit: 1
            }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }

                var tableArray = [];

                for (var i = 0; i < data.tracks.items.length; i++) {
                    var result = {
                        artist: data.tracks.items[i].album.artists[0].name,
                        album_name: data.tracks.items[i].album.name,
                        song_name: data.tracks.items[i].name,
                        preview_url: data.tracks.items[i].preview_url
                    }
                    tableArray.push(result);
                }
                var table = cTable.getTable(tableArray);

                console.log(table);
            });
        };
    })
};