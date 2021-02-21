import { Howl, Howler } from 'howler/src/howler.core'
import SiriWave from "siriwave";

let audioSrc = document.querySelector('.episode').getAttribute('data-audio');
const controls = ['playpause', 'skipback', 'timer', 'progress', 'waveform', 'rate'];
const rates = ['1', '1.5', '2', '3'];
const colorTheme = getComputedStyle(document.body);
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
        progress.style.width = (((seek / sound.duration() ) * 100) || 0) + '%';

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

        // Start the wave animation if we have already loaded
        wave.start();
        playpause.setAttribute("aria-pressed", true );
    },
    onend: function() {
        let self = this;

        // Stop the wave animation.
        wave.stop();
    },
    onpause: function() {
        // Stop the wave animation.
        wave.stop();
        playpause.setAttribute("aria-pressed", false );
    },
    onstop: function() {
        // Stop the wave animation.
        wave.stop();
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
    }
    if ( "false" === aria ){
        console.log("Playing");
        sound.play();
    }
});

skipback.addEventListener( 'click', () => {
    // Go back 10seconds.
    sound.seek("-10");
} );

rate.addEventListener( 'click', () => {
    let currentRate = sound.rate();
    console.log(currentRate);
});

// Setup the "waveform" animation.
let wave = new SiriWave({
  container: waveform,
  width: window.innerWidth,
  height: waveform.innerHeight,
  color: colorTheme.getPropertyValue('--waveform'),
  cover: true,
  speed: 0.03,
  amplitude: 1.0,
  frequency: 2
});
wave.start();