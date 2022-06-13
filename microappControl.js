    // implementation based on https://stackoverflow.com/questions/7130397/how-do-i-make-a-div-full-screen
    
    var Util = function( microAppDivId ) {

        let self = this;
        
        this.microAppDivId = microAppDivId;

        this.isFullscreen = function() {
            if (
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
            ) {
                return true;
            } else {
                return false;
            }
        }
        
        this.enterFullscreen = function() {
            // if already full screen; return
            // else go fullscreen
            if ( true == self.isFullscreen() ) {
                console.warn( "microapp is already in full screen mode" );
            } else {
                let element = $( self.microAppDivId ).get(0);
                if ( element ) {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.webkitRequestFullscreen) {
                        element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                    } else if (element.msRequestFullscreen) {
                        element.msRequestFullscreen();
                    }
              }
            }
        }
      
        this.exitFullscreen = function() {
            // if already full screen; exit full screen
            // else return
            if ( true == self.isFullscreen() ) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                console.warn( "microapp is currently not in full screen mode" );
            }
        }
        
        this.isFullpage = function() {
            if ( "undefined" != typeof self.defaultHeight ) {
                return true;
            } else {
                return false;
            }
        }
            
        this.enterFullpage = function() {
            if ( "undefined" == typeof self.defaultHeight ) {
                self.defaultHeight = $( self.microAppDivId ).css( "height" );
            }
            if ( "undefined" == typeof self.defaultWidth ) {
                self.defaultWidth = $( self.microAppDivId ).css( "width");
            }
            $( self.microAppDivId ).css( "height", "100%" );
            $( self.microAppDivId ).css( "width", "100%" );
        }

        this.exitFullpage = function() {
            if ( "undefined" != typeof self.defaultHeight ) {
                $( self.microAppDivId ).css( "height", self.defaultHeight );
                delete self.defaultHeight;
            }
            if ( "undefined" != typeof self.defaultWidth ) {
                $( self.microAppDivId ).css( "width", self.defaultWidth );
                delete self.defaultWidth;
            }
        }

        this.controlBarVisiblityOff = function () {
            let rightControlBar = document.getElementById('control_bar_right');
            rightControlBar.style.transition = 'opacity 1s ease-in-out';
            rightControlBar.style.opacity = 0;

        }

        this.controlBarVisiblityOn = function () {
            let rightControlBar = document.getElementById('control_bar_right');
            rightControlBar.style.transition = 'opacity 0s ease-in-out';
            rightControlBar.style.opacity = 1;
        }

        this.resize = function () {
            iframe = document.getElementById('control_bar_game');
            if(self.isFullscreen() == true){
                iframe.height = "100%";
                return;
            }

            iframe.height = "660px";
        }
    }

    $( document ).ready(function() {
        var util = new Util( "#microAppDiv" );
        $('#toggle_fullscreen').on('click', function(){
            // if already full screen; exit
            // else go fullscreen
            if ( true == util.isFullscreen() ) {
                util.exitFullscreen();
            } else {
                util.enterFullscreen(); 
            }
        });
        
        $('div i.fa-solid').on('click', function(){
            util.exitFullpage();
            // if already full screen; exit
            // else go fullscreen
            if ( true == util.isFullscreen() ) {
                // util.exitFullscreen();
            } else {
                util.enterFullscreen();
            }
        });

        $('div i.fa-portrait').on('click', function(){
            util.exitFullscreen();
            util.enterFullpage();
        });

        $('div i.fa-window-minimize').on('click', function(){
            util.exitFullscreen();
            util.exitFullpage();
        });
        
        $('div i.fa-reply').on('click', function(){
            util.exitFullscreen();
            util.exitFullpage();
        });

        $(document).on('fullscreenchange', function(){
            util.resize();
        });

        $(document).on('mousemoveend', function(){
            util.controlBarVisiblityOff(); 
        })

        $(document).on('mousemove', function(event){
            if(event.target.id !== 'control_bar_game'){
                util.controlBarVisiblityOn();
            }
        })

        let timeout;  
        $(document).on('mousemove', function(event){
            if (timeout) window.clearTimeout(timeout); 
            timeout = window.setTimeout(function() {
                $(event.target).trigger('mousemoveend');
            }, 1000);
        });

    });
