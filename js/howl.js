document.addEventListener("DOMContentLoaded", function () {
    // Define music for each page
    const pageMusic = {
        "about.html": "https://simplyhaffz.github.io/337/audioX/Gloomy.mp3",
        "gallery.html": "https://simplyhaffz.github.io/337/audioX/SeniKaybettim.mp3",
        "arts.html": "https://simplyhaffz.github.io/337/audioX/Brushstrokes.mp3",
        "bio.html": "https://simplyhaffz.github.io/337/audioX/DigitalGhost.mp3",
        "links.html": "https://simplyhaffz.github.io/337/audioX/MournforMe.mp3",
        "chronicle.html": "https://simplyhaffz.github.io/337/audioX/Defiance.mp3",
        "defiance.html": "https://simplyhaffz.github.io/337/audioX/Whispers.mp3",
    };

    // Get the current page filename
    let page = window.location.pathname.split("/").pop();

    // Set default music if page isn't listed
    let musicSrc = pageMusic[page] || "https://simplyhaffz.github.io/337/audioX/HelloWorld.mp3";

    // Create Howler.js sound instance
    let bgMusic = new Howl({
        src: [musicSrc], // Use the detected music file
        loop: true, // Loop music indefinitely
        volume: 0.1, // Default volume
    });

    // Select elements
    const volumeSlider = document.getElementById("volume_slider");
    const musicToggle = document.getElementById("music_toggle");
    const musicToggleIcon = document.getElementById("music_toggle_icon");

    // Check for saved music state in localStorage
    let isMusicOn = localStorage.getItem("musicOn") !== "false"; // Default to true
    let savedVolume = localStorage.getItem("musicVolume") || 0.5;

    // Set initial volume and play state
    bgMusic.volume(parseFloat(savedVolume));
    volumeSlider.value = savedVolume;
    if (isMusicOn) {
        bgMusic.play();
    } else {
        musicToggleIcon.src = "imagesX/imgmain/button/music_off.svg";
    }

    // Music toggle functionality
    musicToggle.addEventListener("click", function () {
        if (bgMusic.playing()) {
            bgMusic.pause();
            localStorage.setItem("musicOn", "false");
            musicToggleIcon.src = "imagesX/imgmain/button/music_off.svg";
        } else {
            bgMusic.play();
            localStorage.setItem("musicOn", "true");
            musicToggleIcon.src = "imagesX/imgmain/button/music_on.svg";
        }
    });

    // Volume control functionality
    volumeSlider.addEventListener("input", function () {
        let volume = parseFloat(this.value);
        bgMusic.volume(volume);
        localStorage.setItem("musicVolume", volume); // Save volume preference
    });

    // Blast sound effect for specific buttons
    const blastSound = new Howl({
        src: ['https://simplyhaffz.github.io/337/audioX/blast.wav'],  
        volume: 0.3
    });

    // Add event listener to all navbar buttons with class 'navbar_button'
    document.querySelectorAll('.navbar_button').forEach(button => {
        button.addEventListener('click', () => {
            blastSound.play();  // Play the blast sound on click
        });

        // Hover sound effect for navbar buttons
        button.addEventListener('mouseenter', () => {
            hoverSound.play();  // Play the hover sound when hovering over navbar buttons
        });
    });

    // Click sound effect for all buttons
    const clickSound = new Howl({
        src: ['https://simplyhaffz.github.io/337/audioX/click.wav'],
        volume: 0.3
    });

    // Adding click sound to all buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            clickSound.play();
        });

        // Hover sound effect for all buttons
        button.addEventListener('mouseenter', () => {
            hoverSound.play();  // Play the hover sound when hovering over any button
        });
    });

    // Hover sound effect for both types of buttons
    const hoverSound = new Howl({
        src: ['https://simplyhaffz.github.io/337/audioX/hover.ogg'],
        volume: 0.5
    });

    // Function to autoplay music after 5 seconds of no interaction
    let interactionTimeout;
    function startAutoplay() {
        // Start playing music if no user interaction for 5 seconds
        setTimeout(() => {
            if (!bgMusic.playing()) {
                bgMusic.play();
                localStorage.setItem("musicOn", "true");
                musicToggleIcon.src = "imagesX/imgmain/button/music_on.svg";
            }
        }, 5000);
    }

    // Listen for any user interaction to reset the timer
    ['click', 'mousemove', 'keydown'].forEach(eventType => {
        document.addEventListener(eventType, () => {
            clearTimeout(interactionTimeout);
            interactionTimeout = setTimeout(startAutoplay, 5000);
        });
    });

    // Initial call to start autoplay if user doesn't interact within 5 seconds
    interactionTimeout = setTimeout(startAutoplay, 5000);
});
