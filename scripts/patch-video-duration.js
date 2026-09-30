const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');

const updateSlideRegex = /currentDuration = 6000;\s*\/\/ Slides\s*slides\.forEach/g;

// We will modify startAutoPlay instead. Let's find startAutoPlay:
const startAutoPlayRegex = /function startAutoPlay\(\) \{\s*stopAutoPlay\(\);\s*resetProgressBar\(\);\s*autoPlayTimer = setTimeout\(\(\) => \{\s*updateSlide\(currentIndex \+ 1\);\s*startAutoPlay\(\);\s*\}, currentDuration\);\s*\}/g;

const newStartAutoPlay = `function startAutoPlay() {
    stopAutoPlay();
    
    const slide = slides[currentIndex];
    const video = slide ? slide.querySelector('video') : null;
    
    const runTimers = () => {
      resetProgressBar();
      autoPlayTimer = setTimeout(() => {
        updateSlide(currentIndex + 1);
        startAutoPlay();
      }, currentDuration);
    };

    if (video) {
      const handleVideo = () => {
        currentDuration = video.duration && video.duration > 0 ? (video.duration * 1000) : 6000;
        video.currentTime = 0;
        video.play().catch(e=>console.log(e));
        runTimers();
      };
      
      if (video.readyState >= 1) { // HAVE_METADATA
        handleVideo();
      } else {
        // Fallback if it takes too long
        let fallback = setTimeout(() => {
          currentDuration = 6000;
          runTimers();
        }, 3000);
        
        video.addEventListener('loadedmetadata', () => {
          clearTimeout(fallback);
          handleVideo();
        }, { once: true });
      }
    } else {
      currentDuration = 6000;
      runTimers();
    }
  }`;

js = js.replace(startAutoPlayRegex, newStartAutoPlay);

fs.writeFileSync('js/main.js', js);
console.log('startAutoPlay logic patched for dynamic video duration!');
