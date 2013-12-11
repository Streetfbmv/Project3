//Zach Jones created this on 11/15/13
var trackListing = $("#content");
var playlist = $("#playlist ul");
var position = $("#position");
var result;
var currentlyPlayingSound;
var currentlyPlayingIndex;
var intRandTilt
var intPlaylist = 0;

homePage();

function generateRand(){
	intRandTilt = Math.floor((Math.random()*40)-20);
}

function homePage(){
	$("#content").html("<h2>Home</h2><p>Talk to the reindeer!</p>");
}

SC.initialize({
    client_id: "3a0223a4404c4efe6133f785bc3cea54",
    redirect_url: "http://127.0.0.1"
});

$("#home").click(function(){
	$("#content").css("background", "none");
	$("#pullBar").css({"-webkit-animation":"pullBarReverse 5s", "margin-left": "-88%"});
	homePage();
});

$("#search").click(function(){
	$("#txtSearch").focus();
    $("#pullBar").css({"-webkit-animation":"pullBar 5s", "margin-left": "0px"});
})

$("#playlist").on("click", ".removeButton", function() {
	var intClick = $(this).attr("id");
	$("." + intClick).parent().remove();
});

//make a new Jukebox
var jukebox= new Jukebox("#playlist", "#position", SC);

$("#btnStop").click(function() {
	jukebox.stop();
})

$("#btnPlay").click(function() {
    //get the associated track of the first element
    var firstElement = $("#playlist p:first-child");
    
    var trackID = firstElement.data("index");
    
    $("#txtNow").html(firstElement.html());
    
    jukebox.playSong(trackID);
})

//when the search button is clicked...
$("#btnSearch").click(function(){
    //get the search value
    var searchValue = $("#txtSearch").val();
    
    $("#content").css("background-image", "url(assets/wishlist.png)");
	  
    //list the songs of that value
    listSongs(searchValue);
});

//respond to a click on a list item in track listing
//for ANY LIST ITEM regardless of when it was added
trackListing.on("click", ".addToPlaylist", function(event) { 
    var clickedElement = $(event.target);
    
    //get index of the index of the data associated with clicked element
    var arrayIndex = clickedElement.data('index');
    
    //get the extra data from the result array
    var associatedData = result[arrayIndex];
    
    //make a clone //its the same but double
    var clonedElement = clickedElement.clone();
    
    //add some extra data to the cloned element
    //in specific, the trackID to ply whenever this item
    //is clicked
    clonedElement.data("trackID", associatedData.id);
	    
    intPlaylist = parseInt(intPlaylist);
	
	var trackID = clonedElement.data("trackID");
	    
    SC.get("/tracks/" + trackID, function(track){
        //add the track title to our playlist div
        playlist.append( clonedElement );
        
        var newPlaylistItem = "<div class='" + intPlaylist + "'>"
                            + "<p data-index='" + trackID + "'>" + track.title + "</p>"
                            + "<button id='" + intPlaylist + "' class='removeButton'>Remove</button></div>";
							        
        clonedElement.html(newPlaylistItem);
		
		generateRand();
		
		clonedElement.css({"transform":"rotate(" + intRandTilt + "deg)",
							"-ms-transform":"rotate(" + intRandTilt + "deg)",
							"-webkit-transform":"rotate(" + intRandTilt + "deg)"});
        
        intPlaylist++;
    }); 
});

//lists songs for us
function listSongs(query) {
    SC.get("/tracks/", { limit: 10, q: query }, function(tracks) {
        //store result for later
        result = tracks;
		
		$("#content").html("<h2>Search Results</h2>");
        
        //populate new values
        for(var i in tracks) {
            var curTrack = tracks[i];
            
            trackListing.append(
                "<li><span>" + curTrack.title + "</span><span data-index='" + i + "' class='addToPlaylist'>Add to Playlist</span></li>"
            );
        }
    });
}
