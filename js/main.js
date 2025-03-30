/*-----------------| ROOT CONSTANTS |--------------------------------------------------------------------*/
//  Highest Priority IDs
const ROOT = document.documentElement;
const CONTEXT = document.getElementById('context'); // Bar at the top that displays hover context

const WRAPPER = document.getElementById('wrapper'); // Wrapper of everything but header info

//  Control Panel
const CRT_TOGGLE = document.getElementById('crt_toggle');
const CRT_TOGGLE_ICON = document.getElementById('crt_toggle_icon');

//  Navbar
const NAVBAR_ICON = document.getElementById('navbar_icon');
const EXTERNAL_BUTTON_CONTAINER = document.getElementById('button_scroller');
const EXTERNAL_BUTTON_TEMPLATE = document.getElementById('button_template');

//  Pages
const PAGE_LIST = document.querySelectorAll('.page_content'); // Collection of all page information

const GALLERY_ITEMS = document.querySelectorAll('.gallery_item'); // Select all gallery items

GALLERY_ITEMS.forEach(item => {
    item.addEventListener('click', function (event) {
        event.preventDefault();
        const imageUrl = this.style.backgroundImage.slice(5, -2); // Extract URL from style
        const context = this.getAttribute('context'); // Get context attribute
        document.getElementById('gallery_preview').href = imageUrl; // Update link
        document.getElementById('gallery_preview_img').src = imageUrl; // Update image
        document.getElementById('gallery_description').innerText = context; // Update description
    });
});

const BLOG_ITEMS = document.querySelectorAll('.log_list_item'); // Select all blog items

// Logs data
const LOGS = {
    blogs: [
        {
            id: "LOVE",
            date: "10/01",
            content: `<iframe src="poem.html" width="100%" height="100%" title="Beyond the dreams"></iframe>`
        },
        {
            id: "FEEL",
            date: "09/29",
            content: 
                ` <video id="bio_player" controls>
                    <source src="videoX/bury.mp4" type="video/mp4">
                    Your browser does not support the video tag.
                  </video> `
        },
        {
            id: "MOON",
            date: "09/27",
            content: `<iframe src="forest.html" width="100%" height="100%" title="Beyond the dreams"></iframe>`
        },
        {
            id: "RISE",
            date: "09/27",
            content: `<iframe src="fullscreen/rise.html" width="100%" height="100%" title="Beyond the dreams"></iframe>`
        },
        {
            id: "WHAT?",
            date: "09/26",
            content: `<iframe src="404.html" width="100%" height="100%" title="Beyond the dreams"></iframe>`
        },
        {
            id: "TER",
            date: "09/29",
            content: `<iframe src="terminus/terminal.html" width="100%" height="100%" title="Beyond the dreams"></iframe>`
        },
    ]
};

function changePage(destination) {
    const page_selected = document.getElementById(destination) || document.getElementById('about');
    if (page_selected) { // If the page exists
        PAGE_LIST.forEach(page_item => { // Hide all pages
            page_item.classList.remove('shown');
        });
        page_selected.classList.remove('hidden');   // Show this page
        page_selected.classList.add('shown');       // Make it flicker
        CONTEXT.textContent = page_selected.getAttribute('context'); // Update context
        targetRate = 1;
        if (destination === 'gallery' && !galleryLoaded) { // Update gallery if need be
            loadGallery();
        }
        targetRate = page_selected.getAttribute('rate') || 1;
        document.getElementById('page_title').textContent = destination; // Update the page title
        currentPage = destination;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    changePage('about'); // Set initial page
    // Initialize blog content with first entry
    if (LOGS.blogs.length > 0) {
        document.getElementById('log_content').innerHTML = LOGS.blogs[0].content;
    }
});

BLOG_ITEMS.forEach(item => {
    item.addEventListener('click', function () {
        const blogId = this.getAttribute('data-log-id');
        const blogEntry = LOGS.blogs.find(blog => blog.id === blogId);
        if (blogEntry) {
            document.getElementById('log_content').innerHTML = blogEntry.content;
            console.log(`Updated log content with ID: ${blogId}`); // Debugging statement
        } else {
            console.error(`No blog entry found for ID: ${blogId}`); // Debugging statement
        }
    });
});

const bio = document.getElementById('bio');
const bio_TYPES = document.querySelectorAll('.bio_type');
const bio_DESCRIPTION = document.getElementById('bio_description');
const bio_PRICING = document.getElementById('bio_pricing');
const bio_EXTRA = document.getElementById('bio_extra');
const bio_PREFERENCES = document.getElementById('bio_preferences');

// Vanity
const CRT_SCAN_FX = document.getElementById('crt_scan_fx');

/*-----------------| VARIABLES |-------------------------------------------------------------------------*/
// Toggles
let crtOn = true; // Set CRT state to always on

let galleryLoaded = false;
let logLoaded = false;

// Parallax
let easingEnabled = true; // Flag for performance conservation
let easeFactor = 3; // Factor by which to increase or decrease the lerping speed
let lastEaseTime = Date.now(); // Must init to Date.now()
let mouseRealPosition = [0, 0]; // Real global X, Y of mouse
let mouseRealOffset = [0, 0]; // -1 to 1 target offset determined by lerper()
let parallaxEasedOffset = [0, 0, 1]; // Final eased offset coefficients
let windowMax = [window.innerWidth, window.innerHeight]; // Updated to be accurate

// Easing
let easedRate = 1;
let targetRate = 1;
let bio_info = {};

// Etc
let currentPage = 'about';

/*-----------------| GENERAL FUNCTIONS |------------------------------------------------------------------*/
// Update CSS variable value
function CSS(VarName, VarProperty) {
    document.documentElement.style.setProperty('--' + VarName, VarProperty);
}

// Linear interpolation
function lerp(p1, p2, t) {
    return p1 + (p2 - p1) * t;
}

// Smooth movements
function lerper(now_ms) {
    if (easingEnabled) { // calculate easing only if we need to
        mouseRealOffset[0] = (mouseRealPosition[0] / windowMax[0]);
        mouseRealOffset[1] = (mouseRealPosition[1] / windowMax[1]);
        if (isNaN(mouseRealOffset[0]) || mouseRealOffset[0] == undefined) {
            mouseRealOffset[0] = 0;
            mouseRealOffset[1] = 0;
        }
        let LocalEaseFactor = Math.min(1, (now_ms - lastEaseTime) / 1000);
        lastEaseTime = now_ms;
        parallaxEasedOffset[0] = Number(lerp(parallaxEasedOffset[0], mouseRealOffset[0], LocalEaseFactor * easeFactor).toFixed(8));
        parallaxEasedOffset[1] = Number(lerp(parallaxEasedOffset[1], mouseRealOffset[1], LocalEaseFactor * easeFactor).toFixed(8));
        CSS('M_XP', parallaxEasedOffset[0] * 100 + '%');
        CSS('M_YP', parallaxEasedOffset[1] * 100 + '%');
    }
}

// Event-based updaters and initializer
function handleMouseMove(event) {
    mouseRealPosition = [event.pageX, event.pageY];
}
function onResize(event) {
    windowMax = [window.innerWidth, window.innerHeight];
}

// Main loop function
function mainLoop() {
    requestAnimationFrame(mainLoop);
    let NOW = Date.now();
    lerper(NOW);
}

// Event attachment and initializer
document.addEventListener('mousemove', handleMouseMove);
window.addEventListener('resize', onResize);

window.addEventListener('load', function () {
    mainLoop();
});

/*-----------------| PAGE HANDLING |--------------------------------------------------------------------*/
// Navigate to appropriate page if hash contains valid string
if (window.location.hash) {
    const hashValue = window.location.hash.substring(1);
    const target_page = document.getElementById(hashValue);
    if (target_page) {
        changePage(hashValue);
    }
} else {
    changePage('about');
}

// Update hash history if user has navigated
function pushHash(hashString) {
    if ('#' + hashString != window.location.hash) {
        if (history.pushState) {
            history.pushState(null, null, '#' + hashString);
        } else {
            location.hash = '#' + hashString;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Display correct page according to request and load gallery if needed
    function changePage(destination) {
        const page_selected = document.getElementById(destination) || document.getElementById('about');
        if (page_selected) { // If the page exists
            PAGE_LIST.forEach(page_item => { // Hide all pages
                page_item.classList.remove('shown');
            });
            page_selected.classList.remove('hidden');   // Show this page
            page_selected.classList.add('shown');       // Make it flicker
            CONTEXT.textContent = page_selected.getAttribute('context'); // Update context
            targetRate = 1;
            if (destination === 'gallery' && !galleryLoaded) { // Update gallery if need be
                loadGallery();
            }
            targetRate = page_selected.getAttribute('rate') || 1;
            document.getElementById('page_title').textContent = destination; // Update the page title
            currentPage = destination;
        }
    }
});

// Change the topbar
function updateContext(info) {
    if (info) {
        CONTEXT.textContent = info;
    }
}

// Update page when user uses browser navigation
addEventListener('hashchange', () => {
    changePage(window.location.hash.substring(1));
});

function updateCRT() {
    if (crtOn) {
        document.body.classList.add('crt');
        CRT_SCAN_FX.classList.remove('hidden');
    } else {
        document.body.classList.remove('crt');
        CRT_SCAN_FX.classList.add('hidden');
    }
}

/*-----------------| CRT TOGGLE FUNCTIONALITY |--------------------------------------------------------*/
CRT_TOGGLE.addEventListener('click', () => {
    crtOn = !crtOn; // Toggle CRT state
    if (crtOn) {
        document.body.classList.add('crt');
        CRT_TOGGLE_ICON.src = 'imagesX/imgmain/button/crt_on.svg'; // Change icon to "on"
    } else {
        document.body.classList.remove('crt');
        CRT_TOGGLE_ICON.src = 'imagesX/imgmain/button/crt_off.svg'; // Change icon to "off"
    }
});

/*-----------------| BUTTONS |---------------------------------------------------------------------------*/
// Bind all button functionality and sounds.
function addGlowEffect(button) {
    button.classList.add('glow');
    setTimeout(() => {
        button.classList.remove('glow');
    }, 300); // Duration of the glow effect
}

// Bind button to update context if it has any, and play some sounds
function bindButton(button) {
    button.addEventListener('mouseenter', () => { updateContext(button.getAttribute('context')); })
    button.addEventListener('mouseleave', () => updateContext(document.getElementsByClassName('shown')[0].getAttribute('context')));
}

// Give most buttons generic sounds and events
document.querySelectorAll('.navbar_button, .link, .external_button, .bio_type, #links .link').forEach(button => bindButton(button));

// navbar buttons
document.querySelectorAll('.navbar_button').forEach(button => { // Make all navbar buttons play sound & change to respective page
    const content = button.textContent.toLowerCase();
    button.addEventListener('mousedown', () => {
        addGlowEffect(button); // Add glow effect on click
        pushHash(content);
        changePage(content);
    });
});

// Site buttons
fetchJSON('./json/buttons.json')
    .then(data => {
        CSS('ButtonCount', data.length);
        data.forEach(button => {
            let instance = EXTERNAL_BUTTON_TEMPLATE.cloneNode(true);
            instance.removeAttribute('id');
            instance.setAttribute('href', button[0]);
            instance.innerHTML = `<img class="external_button" src="./imagesX/imgmain/button/${button[1]}"></img>`;
            instance.classList.remove('hidden');
            bindButton(instance, 'drop', 'tap');
            EXTERNAL_BUTTON_CONTAINER.appendChild(instance);
        });
    });

bindButton(CRT_TOGGLE);

// Set CRT to always be on
document.body.classList.add('crt');
CRT_TOGGLE_ICON.setAttribute('src', 'imagesX/imgmain/button/crt_on.svg');

updateCRT(); // Ensure CRT is updated


/*-----------------| SECURITY |--------------------------------------------------------------------*/


// Developer tools detection
function detectDevTools() {
    // Method 1: Check window size difference
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    
    // Method 2: Check for devtools function toString
    const devtools = /./;
    devtools.toString = function() {
        document.body.innerHTML = '<h1 style="color:red;text-align:center;">Access Denied</h1>';
        window.location.href = 'about:blank';
        return '';
    };
    
    // Method 3: Debugger statement
    setInterval(function() {
        (function() {
            return false;
        }['constructor']('debugger')());
    }, 5000);
    
    if (widthThreshold || heightThreshold) {
        document.body.innerHTML = '<h1 style="color:red;text-align:center;">Access Denied</h1>';
        window.location.href = 'about:blank';
    }
}

// Run devtools detection periodically
setInterval(detectDevTools, 1000);

// Disable right click
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// Disable keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') || 
        (e.ctrlKey && e.shiftKey && e.key === 'J') || 
        (e.ctrlKey && e.shiftKey && e.key === 'C') || 
        (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
        alert('Developer tools are disabled');
        return false;
    }
});


