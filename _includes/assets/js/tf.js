import { Howl, Howler } from 'howler';


let audioSrc = document.querySelector('.episode').getAttribute('data-audio');
const controls = ['playpause', 'skipback', 'timer', 'rate'];
const progress = document.querySelector('progress');
const progressGroup = document.querySelector('.progress-group');
const speeds = ['1', '1.5', '2'];
let currentSpeed = 0;
controls.forEach( c => {
  window[c] = document.getElementById(c);
});

let Player = {
    /**
     * Format the time from seconds to M:SS.
     * @param  {Number} secs Seconds to format.
     * @return {String}      Formatted time.
     */
    formatTime: function (secs) {
        let minutes = Math.floor(secs / 60) || 0;
        let seconds = (secs - minutes * 60) || 0;

        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    },
    step: function () {
        let self = this;

        let seek = sound.seek() || 0;

        timer.innerHTML = Player.formatTime( Math.round(seek) );
        progress.value = (((seek / sound.duration() ) * 100) || 0);

        // If the sound is still playing, continue stepping.
        if (sound.playing()) {
            requestAnimationFrame(Player.step.bind(self));
        }
    }

}

// Setup the new Howl.
const sound = new Howl({
    autoplay: false,
    src: audioSrc,
    preload: true,
    html5: true,
    autoUnlock: false,
    onplay: function() {
        // Start upating the progress of the track.
        requestAnimationFrame( Player.step.bind(self) );

        playpause.setAttribute("aria-pressed", true );
    },
    onpause: function() {
        playpause.setAttribute("aria-pressed", false );
    }
});

// Controls
playpause.addEventListener('click', () => {
    // Resume AudioContext for chrome.
    let aria = playpause.getAttribute("aria-pressed");
    let context = new AudioContext();

    if ( "true" === aria ) {
        console.log("Paused");
        sound.pause();
    } else {
        console.log("Playing");
        sound.play();
    }
});

skipback.addEventListener( 'click', (e) => {
    let now = sound.seek();
    sound.seek( now -10 );
} );

rate.addEventListener( 'click', ( e ) => {
    currentSpeed = (currentSpeed+1) % (speeds.length);
    rate.querySelector('.current').innerHTML = speeds[currentSpeed] + "x";
    sound.rate(speeds[currentSpeed]);
});

progressGroup.addEventListener( 'click', (e) => {
    let box = progressGroup.getBoundingClientRect();
    let seekPoint = (e.clientX - box.left) / box.width;

    sound.pause().seek( seekPoint * sound.duration() ).play();
});