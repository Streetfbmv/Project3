//self-executing anonymous function!
(function(){

    //class-like object
    var Jukebox= function(playlistRef, positionRef, SC){
        
        //store a reference to this object
        var me= this;
        
        this.currentlyPlayingSound;
        this.currentlyPlayingIndex;
        this.position= $(positionRef);
        this.playlist = $(playlistRef);
        this.sc= SC;
        
        //respond to a click on any list item in playlist   
        this.playlist.on("click", "span", function(event) {
            
            var clickedElement = $(event.target);
            
            //update what is currently playing
            me.currentlyPlayingIndex = clickedElement.index();
            
            //get the associated track of the clicked element
            var trackID = clickedElement.data("trackID");
            
            //show the track title for "now playing"
            $("#txtNow").html(clickedElement.html());
            
            //play the selected song
            me.playSong(trackID);
        });
   
    }

    //Play next song
    Jukebox.prototype.playNext=function(){
         //try to play next song
                this.currentlyPlayingIndex ++;
                
                //make sure there is a next song to play
                if(this.currentlyPlayingIndex < this.playlist.children().length ) {
                    var nextElement = this.playlist.find('li').eq(this.currentlyPlayingIndex);
                    
                    //update the now playing HTML
                    $("#txtNow").html(nextElement.html() );
    
                    //play the next song
                    this.playSong(nextElement.data("trackID"));
    
    
    }
    }
    
    //play a song
    Jukebox.prototype.playSong=function playSong(trackID) {
        
        //store a reference to this object
        var me= this;
    
            //make sure this sound exists
        if(this.currentlyPlayingSound) {
            //if it does, stop it
            this.currentlyPlayingSound.stop();
        }
        
        SC.stream("/tracks/"+trackID, function(sound){
          
            me.currentlyPlayingSound = sound;
            
            sound.play({
            whileplaying: function() {
                me.position.val(this.position / this.duration);
            },
            onfinish: function() {
               me.playNext();
                
            }
          });
        });
    }
    
    //stop currently playing song
    Jukebox.prototype.stop=function() {
    
    if(this.currentlyPlayingSound) {
        this.currentlyPlayingSound.stop();
    } }
    //play next song
    
    
    //export jukebox fro everybody to use
    window.Jukebox= Jukebox;
    
})();