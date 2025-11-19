window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}

// Lazy loading video observer
let videoObserver = null;

// Initialize lazy loading for videos
function initLazyLoadVideos() {
  // Check if Intersection Observer is supported
  if (!('IntersectionObserver' in window)) {
    console.log('IntersectionObserver not supported, loading all videos');
    return;
  }
  
  // Create observer with options
  const observerOptions = {
    root: null, // viewport
    rootMargin: '200px', // Start loading 200px before entering viewport
    threshold: 0.01 // Trigger when 1% visible
  };
  
  videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const cell = entry.target;
      const videos = cell.querySelectorAll('video');
      
      if (entry.isIntersecting) {
        // Video cell is visible - load and play videos
        const videosToLoad = [];
        
        videos.forEach(video => {
          // Load video if not already loaded
          if (video.dataset.loaded === 'false') {
            video.load();
            video.dataset.loaded = 'true';
            videosToLoad.push(video);
          }
        });
        
        // If videos were just loaded, wait for them to be ready then play synchronized
        if (videosToLoad.length > 0) {
          let readyCount = 0;
          const totalVideos = videosToLoad.length;
          
          videosToLoad.forEach(video => {
            video.addEventListener('canplay', function onCanPlay() {
              readyCount++;
              if (readyCount === totalVideos) {
                // All videos ready, play them together
                Promise.all(videosToLoad.map(v => v.play().catch(e => console.log('Play failed:', e))));
              }
            }, { once: true });
          });
        } else {
          // Videos already loaded, just play if paused
          videos.forEach(video => {
            if (video.paused) {
              video.play().catch(e => console.log('Lazy load play failed:', e));
            }
          });
        }
      } else {
        // Video cell is not visible - pause videos to save resources
        videos.forEach(video => {
          if (!video.paused) {
            video.pause();
          }
        });
      }
    });
  }, observerOptions);
  
  // Observe all demo cells
  const allDemoCells = document.querySelectorAll('.demo-cell:not(.empty)');
  allDemoCells.forEach(cell => {
    videoObserver.observe(cell);
  });
  
  console.log(`Lazy loading initialized for ${allDemoCells.length} video cells`);
}


$(document).ready(function() {
    // Initialize all demo galleries
    initDemoGallery();
    initSelfGallery();
    initSpatialGallery();
    
    // Initialize go2 galleries
    initGo2OriGallery();
    initGo2SelfGallery();
    initGo2SpatialGallery();
    
    // Initialize lazy loading for videos
    initLazyLoadVideos();
    
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

})

// Demo data - 23 demos from car/ori
const demoData = [
  // FRC demos (6)
  { name: "FRC Cabinet 1", folder: "bagfile_frc_cabinet_1" },
  { name: "FRC Cabinet 2", folder: "bagfile_frc_cabinet_2" },
  { name: "FRC Sofa 1", folder: "bagfile_frc_sofa_1" },
  { name: "FRC Sofa 2", folder: "bagfile_frc_sofa_2" },
  { name: "FRC Sofa 3", folder: "bagfile_frc_sofa_3" },
  { name: "FRC Whiteboard 1", folder: "bagfile_frc_whiteboard_1" },
  
  // Katia demos (7)
  { name: "Katia Cabinet 1", folder: "bagfile_katia_cabinet_1" },
  { name: "Katia Ref 1", folder: "bagfile_katia_ref_1" },
  { name: "Katia Ref 2", folder: "bagfile_katia_ref_2" },
  { name: "Katia Sofa 1", folder: "bagfile_katia_sofa_1" },
  { name: "Katia Sofa 2", folder: "bagfile_katia_sofa_2" },
  { name: "Katia Trash Can 1", folder: "bagfile_katia_trash_can_1" },
  { name: "Katia Whiteboard 1", folder: "bagfile_katia_whiteboard_1" },
  
  // NSH demos (10)
  { name: "Katia Whiteboard 2", folder: "bagfile_katia_whiteboard_2" },
  { name: "NSH Oven 1", folder: "bagfile_nsh_oven_1" },
  { name: "NSH Oven 2", folder: "bagfile_nsh_oven_2" },
  { name: "NSH Oven 3", folder: "bagfile_nsh_oven_3" },
  { name: "NSH Ref 1", folder: "bagfile_nsh_ref_1" },
  { name: "NSH Ref 2", folder: "bagfile_nsh_ref_2" },
  { name: "NSH Sofa 2", folder: "bagfile_nsh_sofa_2" },
  { name: "NSH Sofa 3", folder: "bagfile_nsh_sofa_3" },
  { name: "NSH Whiteboard 1", folder: "bagfile_nsh_whiteboard_1" },
  { name: "NSH Whiteboard 2", folder: "bagfile_nsh_whiteboard_2" }
];

// Self attribute demo data - first 8 demos from car/self
const selfDemoData = [
  { name: "FRC Self Chair 1", folder: "bagfile_frc_self_chair_1" },
  { name: "FRC Self Chair 2", folder: "bagfile_frc_self_chair_2" },
  { name: "FRC Self Monitor Open 1", folder: "bagfile_frc_self_monitor_open_1" },
  { name: "FRC Self Monitor Open 2", folder: "bagfile_frc_self_monitor_open_2" },
  { name: "FRC Self Trash Can Blue 1", folder: "bagfile_frc_self_trash_can_blue_1" },
  { name: "FRC Self Trash Can Blue 2", folder: "bagfile_frc_self_trash_can_blue_2" },
  { name: "FRC Self Whiteboard 1", folder: "bagfile_frc_self_whiteboard_1" },
  { name: "FRC Self Whiteboard 2", folder: "bagfile_frc_self_whiteboard_2" }
];

// Spatial condition demo data - all 6 demos from car/spatial
const spatialDemoData = [
  { name: "FRC Spatial Bag Hang 1", folder: "bagfile_frc_spatial_bag_hang_1" },
  { name: "FRC Spatial Bag Sofa 1", folder: "bagfile_frc_spatial_bag_sofa_1" },
  { name: "FRC Spatial Desk 1", folder: "bagfile_frc_spatial_desk_1" },
  { name: "FRC Spatial Person 1", folder: "bagfile_frc_spatial_person_1" },
  { name: "FRC Spatial Person 2", folder: "bagfile_frc_spatial_person_2" },
  { name: "FRC Spatial Person Chair 1", folder: "bagfile_frc_spatial_person_chair_1" }
];

// GO2 Original demo data - 7 demos from go2/ori
const go2OriDemoData = [
  { name: "FRC 1th Coffee 1", folder: "bagfile_frc_1th_coffee_1" },
  { name: "FRC 1th Oven 1", folder: "bagfile_frc_1th_oven_1" },
  { name: "FRC 1th Ref 1", folder: "bagfile_frc_1th_ref_1" },
  { name: "FRC 1th TV Monitor 1", folder: "bagfile_frc_1th_tv_monitor_1" },
  { name: "FRC Sofa 1", folder: "bagfile_frc_sofa_1" },
  { name: "FRC Whiteboard 1", folder: "bagfile_frc_whiteboard_1" },
  { name: "Gates Plant 1", folder: "bagfile_gates_plant_1" }
];

// GO2 Self attribute demo data - 6 demos from go2/self
const go2SelfDemoData = [
  { name: "FRC 1th Self Sofa 1", folder: "bagfile_frc_1th_self_sofa_1" },
  { name: "FRC Self Trash Can 1", folder: "bagfile_frc_self_trash_can_1" },
  { name: "Gates Self Chair 1", folder: "bagfile_gates_self_chair_1" },
  { name: "Gates Self Chair 2", folder: "bagfile_gates_self_chair_2" },
  { name: "HCI Self Chair 1", folder: "bagfile_hci_self_chair_1" },
  { name: "HCI Self Trash Can 1", folder: "bagfile_hci_self_trash_can_1" }
];

// GO2 Spatial condition demo data - 5 demos from go2/spatial
const go2SpatialDemoData = [
  { name: "FRC 1th Spatial Person", folder: "bagfile_frc_1th_spatial_person" },
  { name: "FRC Spatial Bag 1", folder: "bagfile_frc_spatial_bag_1" },
  { name: "FRC Spatial Person 1", folder: "bagfile_frc_spatial_person_1" },
  { name: "HCI Spatial Person 1", folder: "bagfile_hci_spatial_person_1" },
  { name: "HCI Spatial Person 2", folder: "bagfile_hci_spatial_person_2" }
];

let currentGalleryPage = 0;
const totalPages = 4;
const demosPerPage = 6;

let currentSelfGalleryPage = 0;
const totalSelfPages = 2;
const selfDemosPerPage = 4;

let currentGo2OriGalleryPage = 0;
const totalGo2OriPages = 2;
const go2OriDemosPerPage = 4;

let currentGo2SelfGalleryPage = 0;
const totalGo2SelfPages = 2;
const go2SelfDemosPerPage = 4;

let currentGo2SpatialGalleryPage = 0;
const totalGo2SpatialPages = 2;
const go2SpatialDemosPerPage = 4;

// Initialize demo gallery (original)
function initDemoGallery() {
  // Fill each page with demos
  for (let page = 0; page < totalPages; page++) {
    const pageElement = document.getElementById(`page${page + 1}`);
    const startIdx = page * demosPerPage;
    const endIdx = Math.min(startIdx + demosPerPage, demoData.length);
    
    for (let i = startIdx; i < startIdx + demosPerPage; i++) {
      if (i < demoData.length) {
        const demo = demoData[i];
        const demoCell = createDemoCell(demo, 'car', 'ori');
        pageElement.appendChild(demoCell);
      } else {
        // Add empty cell for the last position
        const emptyCell = document.createElement('div');
        emptyCell.className = 'demo-cell empty';
        pageElement.appendChild(emptyCell);
      }
    }
  }
  
  updateNavigationButtons();
}

// Initialize self attribute gallery
function initSelfGallery() {
  for (let page = 0; page < totalSelfPages; page++) {
    const pageElement = document.getElementById(`selfPage${page + 1}`);
    const startIdx = page * selfDemosPerPage;
    
    for (let i = startIdx; i < startIdx + selfDemosPerPage; i++) {
      if (i < selfDemoData.length) {
        const demo = selfDemoData[i];
        const demoCell = createDemoCell(demo, 'car', 'self');
        pageElement.appendChild(demoCell);
      }
    }
  }
  
  updateSelfNavigationButtons();
}

// Initialize spatial condition gallery
function initSpatialGallery() {
  const pageElement = document.getElementById('spatialPage1');
  
  spatialDemoData.forEach(demo => {
    const demoCell = createDemoCell(demo, 'car', 'spatial');
    pageElement.appendChild(demoCell);
  });
}

// Initialize go2 ori gallery
function initGo2OriGallery() {
  for (let page = 0; page < totalGo2OriPages; page++) {
    const pageElement = document.getElementById(`go2OriPage${page + 1}`);
    const startIdx = page * go2OriDemosPerPage;
    
    for (let i = startIdx; i < startIdx + go2OriDemosPerPage; i++) {
      if (i < go2OriDemoData.length) {
        const demo = go2OriDemoData[i];
        const demoCell = createDemoCell(demo, 'go2', 'ori');
        pageElement.appendChild(demoCell);
      }
    }
  }
  
  updateGo2OriNavigationButtons();
}

// Initialize go2 self gallery
function initGo2SelfGallery() {
  for (let page = 0; page < totalGo2SelfPages; page++) {
    const pageElement = document.getElementById(`go2SelfPage${page + 1}`);
    const startIdx = page * go2SelfDemosPerPage;
    
    for (let i = startIdx; i < startIdx + go2SelfDemosPerPage; i++) {
      if (i < go2SelfDemoData.length) {
        const demo = go2SelfDemoData[i];
        const demoCell = createDemoCell(demo, 'go2', 'self');
        pageElement.appendChild(demoCell);
      }
    }
  }
  
  updateGo2SelfNavigationButtons();
}

// Initialize go2 spatial gallery
function initGo2SpatialGallery() {
  for (let page = 0; page < totalGo2SpatialPages; page++) {
    const pageElement = document.getElementById(`go2SpatialPage${page + 1}`);
    const startIdx = page * go2SpatialDemosPerPage;
    
    for (let i = startIdx; i < startIdx + go2SpatialDemosPerPage; i++) {
      if (i < go2SpatialDemoData.length) {
        const demo = go2SpatialDemoData[i];
        const demoCell = createDemoCell(demo, 'go2', 'spatial');
        pageElement.appendChild(demoCell);
      }
    }
  }
  
  updateGo2SpatialNavigationButtons();
}

// Load instruction data for a demo
async function loadInstructionData(demo, robot = 'car', type = 'ori') {
  try {
    const basePath = `./static/instructions/${robot}/${type}/${demo.folder}`;
    const targetPath = `${basePath}/target_object.txt`;
    const attributePath = `${basePath}/self_attribute.txt`;
    const spatialPath = `${basePath}/spatial_condition.txt`;
    
    // Fetch all files
    const [targetResponse, attributeResponse, spatialResponse] = await Promise.all([
      fetch(targetPath),
      fetch(attributePath).catch(() => null),
      fetch(spatialPath).catch(() => null)
    ]);
    
    if (!targetResponse.ok) {
      throw new Error('Failed to load target_object.txt');
    }
    
    const target = await targetResponse.text();
    const attribute = attributeResponse && attributeResponse.ok ? await attributeResponse.text() : '';
    const spatial = spatialResponse && spatialResponse.ok ? await spatialResponse.text() : '';
    
    // Clean up the text (remove trailing % and whitespace)
    const cleanTarget = target.trim().replace(/%$/, '');
    const cleanAttribute = attribute.trim().replace(/%$/, '');
    const cleanSpatial = spatial.trim().replace(/%$/, '');
    
    return {
      target: cleanTarget,
      attribute: cleanAttribute,
      spatial: cleanSpatial
    };
  } catch (error) {
    console.error(`Failed to load instruction for ${demo.folder}:`, error);
    return { target: demo.name, attribute: '', spatial: '' };
  }
}

// Build instruction text from components and highlight target
function buildInstructionText(data) {
  if (!data.target) {
    return 'No instruction available';
  }
  
  // Build the instruction text: "Find the [attribute] target [spatial]"
  let parts = ['Find the'];
  
  // Add attribute if exists (red highlight)
  if (data.attribute) {
    parts.push(`<span class="highlight-attribute">${data.attribute}</span>`);
  }
  
  // Add target (yellow highlight)
  parts.push(`<span class="highlight-target">${data.target}</span>`);
  
  // Add spatial condition if exists (blue highlight)
  if (data.spatial) {
    parts.push(`<span class="highlight-spatial">${data.spatial}</span>`);
  }
  
  return parts.join(' ') + '.';
}

// Create a demo cell with video pair (no mini controls)
function createDemoCell(demo, robot = 'car', type = 'ori') {
  const cell = document.createElement('div');
  cell.className = 'demo-cell';
  
  // Add click handler to open modal
  cell.addEventListener('click', function(e) {
    openVideoModal(demo, robot, type);
  });
  
  const title = document.createElement('div');
  title.className = 'demo-title';
  title.textContent = 'Loading...'; // Placeholder while loading
  
  // Load and display instruction with highlighted target
  loadInstructionData(demo, robot, type).then(data => {
    const instructionText = buildInstructionText(data);
    title.innerHTML = instructionText;
  });
  
  const videoPair = document.createElement('div');
  videoPair.className = 'video-pair';
  
  const videoPairVideos = document.createElement('div');
  videoPairVideos.className = 'video-pair-videos';
  
  // Final video (no controls, lazy load) - use compressed version for gallery
  const finalVideo = document.createElement('video');
  finalVideo.setAttribute('muted', '');
  finalVideo.setAttribute('loop', '');
  finalVideo.setAttribute('playsinline', '');
  finalVideo.setAttribute('preload', 'none'); // Don't preload - wait for lazy loading
  finalVideo.muted = true;
  finalVideo.dataset.loaded = 'false'; // Track loading state
  const finalSource = document.createElement('source');
  finalSource.src = `./static/videos_vp9_compressed/${robot}/${type}/${demo.folder}/${demo.folder}_final_vp9.webm`;
  finalSource.type = 'video/webm';
  finalVideo.appendChild(finalSource);
  
  // Footage video (no controls, lazy load) - use compressed version for gallery
  const footageVideo = document.createElement('video');
  footageVideo.setAttribute('muted', '');
  footageVideo.setAttribute('loop', '');
  footageVideo.setAttribute('playsinline', '');
  footageVideo.setAttribute('preload', 'none'); // Don't preload - wait for lazy loading
  footageVideo.muted = true;
  footageVideo.dataset.loaded = 'false'; // Track loading state
  const footageSource = document.createElement('source');
  const footageName = demo.folder.replace('bagfile_', '');
  // Go2 robot uses 'go2_' prefix for footage files
  const footagePrefix = robot === 'go2' ? 'go2_' : '';
  footageSource.src = `./static/videos_vp9_compressed/${robot}/${type}/${demo.folder}/${footagePrefix}${footageName}_footage_vp9.webm`;
  footageSource.type = 'video/webm';
  footageVideo.appendChild(footageSource);
  
  videoPairVideos.appendChild(finalVideo);
  videoPairVideos.appendChild(footageVideo);
  
  // No mini controls - just add videos
  videoPair.appendChild(videoPairVideos);
  
  cell.appendChild(title);
  cell.appendChild(videoPair);
  
  // Note: Synchronization is now handled by lazy loading observer
  // Videos will be loaded and played when they enter the viewport
  
  return cell;
}

// Navigate between gallery pages (with loop)
function navigateGallery(direction) {
  let newPage = currentGalleryPage + direction;
  
  // Enable looping: wrap around to first/last page
  if (newPage < 0) {
    newPage = totalPages - 1; // Go to last page
  } else if (newPage >= totalPages) {
    newPage = 0; // Go to first page
  }
  
  // Pause all videos on current page before switching
  const currentPageElement = document.getElementById(`page${currentGalleryPage + 1}`);
  if (currentPageElement) {
    const currentVideos = currentPageElement.querySelectorAll('video');
    currentVideos.forEach(video => {
      video.pause();
      video.currentTime = 0; // Reset to start
    });
  }
  
  currentGalleryPage = newPage;
  
  const slider = document.getElementById('gallerySlider');
  slider.style.transform = `translateX(-${currentGalleryPage * 100}%)`;
  
  document.getElementById('currentPage').textContent = currentGalleryPage + 1;
  updateNavigationButtons();
  
  // Play all videos on new page from the beginning
  setTimeout(() => {
    const newPageElement = document.getElementById(`page${currentGalleryPage + 1}`);
    if (newPageElement) {
      const newVideos = newPageElement.querySelectorAll('video');
      newVideos.forEach(video => {
        video.currentTime = 0; // Ensure starting from beginning
        video.play().catch(e => console.log('Video play failed after navigation:', e));
      });
    }
  }, 100); // Small delay to ensure page transition has started
}

// Update navigation button states (always enabled for loop mode)
function updateNavigationButtons() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  // Always enable buttons for infinite loop
  prevBtn.disabled = false;
  nextBtn.disabled = false;
}

// Navigate self attribute gallery
function navigateSelfGallery(direction) {
  let newPage = currentSelfGalleryPage + direction;
  
  // Enable looping
  if (newPage < 0) {
    newPage = totalSelfPages - 1;
  } else if (newPage >= totalSelfPages) {
    newPage = 0;
  }
  
  // Pause all videos on current page
  const currentPageElement = document.getElementById(`selfPage${currentSelfGalleryPage + 1}`);
  if (currentPageElement) {
    const currentVideos = currentPageElement.querySelectorAll('video');
    currentVideos.forEach(video => {
      video.pause();
      video.currentTime = 0;
    });
  }
  
  currentSelfGalleryPage = newPage;
  
  const slider = document.getElementById('gallerySelfSlider');
  slider.style.transform = `translateX(-${currentSelfGalleryPage * 100}%)`;
  
  document.getElementById('currentSelfPage').textContent = currentSelfGalleryPage + 1;
  updateSelfNavigationButtons();
  
  // Play all videos on new page
  setTimeout(() => {
    const newPageElement = document.getElementById(`selfPage${currentSelfGalleryPage + 1}`);
    if (newPageElement) {
      const newVideos = newPageElement.querySelectorAll('video');
      newVideos.forEach(video => {
        video.currentTime = 0;
        video.play().catch(e => console.log('Self video play failed:', e));
      });
    }
  }, 100);
}

// Update self navigation button states
function updateSelfNavigationButtons() {
  const prevBtn = document.getElementById('prevSelfBtn');
  const nextBtn = document.getElementById('nextSelfBtn');
  
  prevBtn.disabled = false;
  nextBtn.disabled = false;
}

// Navigate go2 ori gallery
function navigateGo2OriGallery(direction) {
  let newPage = currentGo2OriGalleryPage + direction;
  
  if (newPage < 0) {
    newPage = totalGo2OriPages - 1;
  } else if (newPage >= totalGo2OriPages) {
    newPage = 0;
  }
  
  const currentPageElement = document.getElementById(`go2OriPage${currentGo2OriGalleryPage + 1}`);
  if (currentPageElement) {
    const currentVideos = currentPageElement.querySelectorAll('video');
    currentVideos.forEach(video => {
      video.pause();
      video.currentTime = 0;
    });
  }
  
  currentGo2OriGalleryPage = newPage;
  const slider = document.getElementById('galleryGo2OriSlider');
  slider.style.transform = `translateX(-${currentGo2OriGalleryPage * 100}%)`;
  document.getElementById('currentGo2OriPage').textContent = currentGo2OriGalleryPage + 1;
  updateGo2OriNavigationButtons();
  
  setTimeout(() => {
    const newPageElement = document.getElementById(`go2OriPage${currentGo2OriGalleryPage + 1}`);
    if (newPageElement) {
      const newVideos = newPageElement.querySelectorAll('video');
      newVideos.forEach(video => {
        video.currentTime = 0;
        video.play().catch(e => console.log('Go2 ori video play failed:', e));
      });
    }
  }, 100);
}

function updateGo2OriNavigationButtons() {
  const prevBtn = document.getElementById('prevGo2OriBtn');
  const nextBtn = document.getElementById('nextGo2OriBtn');
  prevBtn.disabled = false;
  nextBtn.disabled = false;
}

// Navigate go2 self gallery
function navigateGo2SelfGallery(direction) {
  let newPage = currentGo2SelfGalleryPage + direction;
  
  if (newPage < 0) {
    newPage = totalGo2SelfPages - 1;
  } else if (newPage >= totalGo2SelfPages) {
    newPage = 0;
  }
  
  const currentPageElement = document.getElementById(`go2SelfPage${currentGo2SelfGalleryPage + 1}`);
  if (currentPageElement) {
    const currentVideos = currentPageElement.querySelectorAll('video');
    currentVideos.forEach(video => {
      video.pause();
      video.currentTime = 0;
    });
  }
  
  currentGo2SelfGalleryPage = newPage;
  const slider = document.getElementById('galleryGo2SelfSlider');
  slider.style.transform = `translateX(-${currentGo2SelfGalleryPage * 100}%)`;
  document.getElementById('currentGo2SelfPage').textContent = currentGo2SelfGalleryPage + 1;
  updateGo2SelfNavigationButtons();
  
  setTimeout(() => {
    const newPageElement = document.getElementById(`go2SelfPage${currentGo2SelfGalleryPage + 1}`);
    if (newPageElement) {
      const newVideos = newPageElement.querySelectorAll('video');
      newVideos.forEach(video => {
        video.currentTime = 0;
        video.play().catch(e => console.log('Go2 self video play failed:', e));
      });
    }
  }, 100);
}

function updateGo2SelfNavigationButtons() {
  const prevBtn = document.getElementById('prevGo2SelfBtn');
  const nextBtn = document.getElementById('nextGo2SelfBtn');
  prevBtn.disabled = false;
  nextBtn.disabled = false;
}

// Navigate go2 spatial gallery
function navigateGo2SpatialGallery(direction) {
  let newPage = currentGo2SpatialGalleryPage + direction;
  
  if (newPage < 0) {
    newPage = totalGo2SpatialPages - 1;
  } else if (newPage >= totalGo2SpatialPages) {
    newPage = 0;
  }
  
  const currentPageElement = document.getElementById(`go2SpatialPage${currentGo2SpatialGalleryPage + 1}`);
  if (currentPageElement) {
    const currentVideos = currentPageElement.querySelectorAll('video');
    currentVideos.forEach(video => {
      video.pause();
      video.currentTime = 0;
    });
  }
  
  currentGo2SpatialGalleryPage = newPage;
  const slider = document.getElementById('galleryGo2SpatialSlider');
  slider.style.transform = `translateX(-${currentGo2SpatialGalleryPage * 100}%)`;
  document.getElementById('currentGo2SpatialPage').textContent = currentGo2SpatialGalleryPage + 1;
  updateGo2SpatialNavigationButtons();
  
  setTimeout(() => {
    const newPageElement = document.getElementById(`go2SpatialPage${currentGo2SpatialGalleryPage + 1}`);
    if (newPageElement) {
      const newVideos = newPageElement.querySelectorAll('video');
      newVideos.forEach(video => {
        video.currentTime = 0;
        video.play().catch(e => console.log('Go2 spatial video play failed:', e));
      });
    }
  }, 100);
}

function updateGo2SpatialNavigationButtons() {
  const prevBtn = document.getElementById('prevGo2SpatialBtn');
  const nextBtn = document.getElementById('nextGo2SpatialBtn');
  prevBtn.disabled = false;
  nextBtn.disabled = false;
}

// Global variables for modal video control
let modalFinalVideo = null;
let modalFootageVideo = null;
// Note: isPlaying, isMuted, updateInterval no longer needed with native controls

// Open video modal for fullscreen playback
function openVideoModal(demo, robot = 'car', type = 'ori') {
  const modal = document.getElementById('videoModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalVideoPair = document.getElementById('modalVideoPair');
  
  // Pause ALL videos on the page to save bandwidth
  const allVideos = document.querySelectorAll('video');
  allVideos.forEach(video => {
    video.pause();
  });
  
  // Set title with highlighted components
  modalTitle.textContent = 'Loading...';
  loadInstructionData(demo, robot, type).then(data => {
    const instructionText = buildInstructionText(data);
    modalTitle.innerHTML = instructionText;
  });
  
  // Clear previous videos
  modalVideoPair.innerHTML = '';
  
  // Create final video with native controls
  modalFinalVideo = document.createElement('video');
  modalFinalVideo.setAttribute('controls', '');
  modalFinalVideo.setAttribute('loop', '');
  modalFinalVideo.setAttribute('playsinline', '');
  modalFinalVideo.setAttribute('preload', 'auto');
  modalFinalVideo.setAttribute('muted', '');
  modalFinalVideo.muted = true;
  const finalSource = document.createElement('source');
  finalSource.src = `./static/videos_vp9/${robot}/${type}/${demo.folder}/${demo.folder}_final_vp9.webm`;
  finalSource.type = 'video/webm';
  modalFinalVideo.appendChild(finalSource);
  
  // Create footage video with native controls
  modalFootageVideo = document.createElement('video');
  modalFootageVideo.setAttribute('controls', '');
  modalFootageVideo.setAttribute('loop', '');
  modalFootageVideo.setAttribute('playsinline', '');
  modalFootageVideo.setAttribute('preload', 'auto');
  modalFootageVideo.setAttribute('muted', '');
  modalFootageVideo.muted = true;
  const footageSource = document.createElement('source');
  const footageName = demo.folder.replace('bagfile_', '');
  // Go2 robot uses 'go2_' prefix for footage files
  const footagePrefix = robot === 'go2' ? 'go2_' : '';
  footageSource.src = `./static/videos_vp9/${robot}/${type}/${demo.folder}/${footagePrefix}${footageName}_footage_vp9.webm`;
  footageSource.type = 'video/webm';
  modalFootageVideo.appendChild(footageSource);
  
  // Start loading immediately
  modalFinalVideo.load();
  modalFootageVideo.load();
  
  // Auto-play when both videos are loaded
  let finalLoaded = false;
  let footageLoaded = false;
  
  function tryPlayBoth() {
    if (finalLoaded && footageLoaded) {
      Promise.all([
        modalFinalVideo.play().catch(e => console.log('Modal final video play failed:', e)),
        modalFootageVideo.play().catch(e => console.log('Modal footage video play failed:', e))
      ]).then(() => {
        console.log('Modal videos auto-playing');
      });
    }
  }
  
  modalFinalVideo.addEventListener('canplay', function() {
    finalLoaded = true;
    console.log('Final video ready');
    tryPlayBoth();
  });
  
  modalFootageVideo.addEventListener('canplay', function() {
    footageLoaded = true;
    console.log('Footage video ready');
    tryPlayBoth();
  });
  
  // Add videos to modal
  modalVideoPair.appendChild(modalFinalVideo);
  modalVideoPair.appendChild(modalFootageVideo);
  
  // Show modal
  modal.classList.add('active');
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

// Setup progress bar interaction (DEPRECATED - now using native controls)
function setupProgressBar() {
  const progressContainer = document.getElementById('progressContainer');
  let isSeeking = false;
  
  progressContainer.addEventListener('click', function(e) {
    if (!modalFinalVideo || !modalFootageVideo) return;
    
    const rect = progressContainer.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * modalFinalVideo.duration;
    
    // Pause during seek
    const wasPlaying = isPlaying;
    if (isPlaying) {
      modalFinalVideo.pause();
      modalFootageVideo.pause();
      isPlaying = false;
      stopProgressUpdate();
      updatePlayPauseButton();
    }
    
    isSeeking = true;
    
    // Check if the target time is buffered for both videos
    function isTimeBuffered(video, targetTime) {
      if (!video || !video.buffered || video.buffered.length === 0) {
        return false;
      }
      for (let i = 0; i < video.buffered.length; i++) {
        if (targetTime >= video.buffered.start(i) && targetTime <= video.buffered.end(i)) {
          return true;
        }
      }
      return false;
    }
    
    const finalBuffered = isTimeBuffered(modalFinalVideo, newTime);
    const footageBuffered = isTimeBuffered(modalFootageVideo, newTime);
    
    console.log(`Seeking to ${newTime.toFixed(2)}s - Final buffered: ${finalBuffered}, Footage buffered: ${footageBuffered}`);
    
    // Set new time for both videos
    modalFinalVideo.currentTime = newTime;
    modalFootageVideo.currentTime = newTime;
    
    // Wait for both videos to finish seeking
    let finalReady = false;
    let footageReady = false;
    let seekTimeout;
    
    function checkBothReady() {
      if (finalReady && footageReady) {
        isSeeking = false;
        updateProgress();
        clearTimeout(seekTimeout);
        
        // Resume playback if was playing
        if (wasPlaying) {
          // Add a small delay to ensure both videos are ready
          setTimeout(() => {
            Promise.all([
              modalFinalVideo.play().catch(e => {
                console.error('Final video play failed:', e);
                return Promise.resolve();
              }),
              modalFootageVideo.play().catch(e => {
                console.error('Footage video play failed:', e);
                // Try to reload if playback fails
                if (modalFootageVideo.readyState < 2) {
                  console.log('Footage video not ready, reloading...');
                  modalFootageVideo.load();
                  modalFootageVideo.currentTime = newTime;
                }
                return Promise.resolve();
              })
            ]).then(() => {
              isPlaying = true;
              updatePlayPauseButton();
              startProgressUpdate();
            });
          }, 100);
        }
      }
    }
    
    // Listen for seeked events
    function handleFinalSeeked() {
      finalReady = true;
      console.log('Final video seeked');
      checkBothReady();
    }
    
    function handleFootageSeeked() {
      footageReady = true;
      console.log('Footage video seeked');
      checkBothReady();
    }
    
    modalFinalVideo.addEventListener('seeked', handleFinalSeeked, { once: true });
    modalFootageVideo.addEventListener('seeked', handleFootageSeeked, { once: true });
    
    // Also listen for 'canplay' event as backup
    function handleFinalCanPlay() {
      if (!finalReady) {
        finalReady = true;
        console.log('Final video canplay (backup)');
        modalFinalVideo.removeEventListener('seeked', handleFinalSeeked);
        checkBothReady();
      }
    }
    
    function handleFootageCanPlay() {
      if (!footageReady) {
        footageReady = true;
        console.log('Footage video canplay (backup)');
        modalFootageVideo.removeEventListener('seeked', handleFootageSeeked);
        checkBothReady();
      }
    }
    
    modalFinalVideo.addEventListener('canplay', handleFinalCanPlay, { once: true });
    modalFootageVideo.addEventListener('canplay', handleFootageCanPlay, { once: true });
    
    // Timeout fallback - force continue even if one video is stuck
    seekTimeout = setTimeout(() => {
      if (isSeeking) {
        console.warn('Seek timeout - forcing playback');
        isSeeking = false;
        
        // Remove event listeners
        modalFinalVideo.removeEventListener('seeked', handleFinalSeeked);
        modalFootageVideo.removeEventListener('seeked', handleFootageSeeked);
        modalFinalVideo.removeEventListener('canplay', handleFinalCanPlay);
        modalFootageVideo.removeEventListener('canplay', handleFootageCanPlay);
        
        updateProgress();
        
        if (wasPlaying) {
          // Try to play both videos, continue even if one fails
          modalFinalVideo.play().catch(e => console.error('Final play timeout failed:', e));
          modalFootageVideo.play().catch(e => {
            console.error('Footage play timeout failed:', e);
            // If footage is really stuck, try reloading it
            if (modalFootageVideo.readyState < 2) {
              console.log('Force reloading footage video...');
              const currentSrc = modalFootageVideo.querySelector('source').src;
              modalFootageVideo.src = currentSrc;
              modalFootageVideo.currentTime = newTime;
              modalFootageVideo.play().catch(e2 => console.error('Reload play failed:', e2));
            }
          });
          isPlaying = true;
          updatePlayPauseButton();
          startProgressUpdate();
        }
      }
    }, 3000);
  });
}

// Update progress bar
function updateProgress() {
  if (!modalFinalVideo) return;
  
  const progressBar = document.getElementById('progressBar');
  const timeDisplay = document.getElementById('timeDisplay');
  
  const percent = (modalFinalVideo.currentTime / modalFinalVideo.duration) * 100;
  progressBar.style.width = percent + '%';
  
  const currentMin = Math.floor(modalFinalVideo.currentTime / 60);
  const currentSec = Math.floor(modalFinalVideo.currentTime % 60);
  const durationMin = Math.floor(modalFinalVideo.duration / 60);
  const durationSec = Math.floor(modalFinalVideo.duration % 60);
  
  timeDisplay.textContent = `${currentMin}:${currentSec.toString().padStart(2, '0')} / ${durationMin}:${durationSec.toString().padStart(2, '0')}`;
}

// Start progress update interval
function startProgressUpdate() {
  if (updateInterval) clearInterval(updateInterval);
  updateInterval = setInterval(updateProgress, 100);
}

// Stop progress update interval
function stopProgressUpdate() {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
}

// Toggle play/pause
function togglePlayPause() {
  if (!modalFinalVideo || !modalFootageVideo) return;
  
  if (isPlaying) {
    modalFinalVideo.pause();
    modalFootageVideo.pause();
    isPlaying = false;
    stopProgressUpdate();
  } else {
    Promise.all([
      modalFinalVideo.play(),
      modalFootageVideo.play()
    ]).then(() => {
      isPlaying = true;
      startProgressUpdate();
    });
  }
  
  updatePlayPauseButton();
}

// Update play/pause button text
function updatePlayPauseButton() {
  const btn = document.getElementById('playPauseBtn');
  if (isPlaying) {
    btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
  } else {
    btn.innerHTML = '<i class="fas fa-play"></i> Play';
  }
}

// Toggle mute
function toggleMute() {
  if (!modalFinalVideo || !modalFootageVideo) return;
  
  isMuted = !isMuted;
  modalFinalVideo.muted = isMuted;
  modalFootageVideo.muted = isMuted;
  
  const btn = document.getElementById('muteBtn');
  if (isMuted) {
    btn.innerHTML = '<i class="fas fa-volume-up"></i> Unmute';
  } else {
    btn.innerHTML = '<i class="fas fa-volume-mute"></i> Mute';
  }
}

// Close video modal
function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  const modalVideoPair = document.getElementById('modalVideoPair');
  
  // Pause and remove videos
  if (modalFinalVideo) {
    modalFinalVideo.pause();
    modalFinalVideo.src = '';
  }
  if (modalFootageVideo) {
    modalFootageVideo.pause();
    modalFootageVideo.src = '';
  }
  
  modalVideoPair.innerHTML = '';
  modalFinalVideo = null;
  modalFootageVideo = null;
  
  // Hide modal
  modal.classList.remove('active');
  
  // Restore body scroll
  document.body.style.overflow = 'auto';
  
  // Resume playing videos with intelligent strategy
  resumeVideosAfterModal();
}

// Resume videos after modal closes with optimized strategy
// Note: This works together with lazy loading - only resumes visible videos
function resumeVideosAfterModal() {
  // Collect visible page video pairs
  const visibleCells = [];
  
  // Ori gallery current page
  const currentOriPage = document.getElementById(`page${currentGalleryPage + 1}`);
  if (currentOriPage) {
    visibleCells.push(...currentOriPage.querySelectorAll('.demo-cell:not(.empty)'));
  }
  
  // Self gallery current page  
  const currentSelfPage = document.getElementById(`selfPage${currentSelfGalleryPage + 1}`);
  if (currentSelfPage) {
    visibleCells.push(...currentSelfPage.querySelectorAll('.demo-cell:not(.empty)'));
  }
  
  // Spatial gallery (only one page)
  const spatialPage = document.getElementById('spatialPage1');
  if (spatialPage) {
    visibleCells.push(...spatialPage.querySelectorAll('.demo-cell:not(.empty)'));
  }
  
  // Go2 ori gallery current page
  const currentGo2OriPage = document.getElementById(`go2OriPage${currentGo2OriGalleryPage + 1}`);
  if (currentGo2OriPage) {
    visibleCells.push(...currentGo2OriPage.querySelectorAll('.demo-cell:not(.empty)'));
  }
  
  // Go2 self gallery current page
  const currentGo2SelfPage = document.getElementById(`go2SelfPage${currentGo2SelfGalleryPage + 1}`);
  if (currentGo2SelfPage) {
    visibleCells.push(...currentGo2SelfPage.querySelectorAll('.demo-cell:not(.empty)'));
  }
  
  // Go2 spatial gallery current page
  const currentGo2SpatialPage = document.getElementById(`go2SpatialPage${currentGo2SpatialGalleryPage + 1}`);
  if (currentGo2SpatialPage) {
    visibleCells.push(...currentGo2SpatialPage.querySelectorAll('.demo-cell:not(.empty)'));
  }
  
  // Synchronize and play videos in each cell
  requestAnimationFrame(() => {
    visibleCells.forEach(cell => {
      const videos = cell.querySelectorAll('video');
      if (videos.length === 2) {
        const video1 = videos[0];
        const video2 = videos[1];
        
        // Get current time of both videos
        const time1 = video1.currentTime;
        const time2 = video2.currentTime;
        
        // Sync to the earlier timestamp
        const syncTime = Math.min(time1, time2);
        
        // Set both videos to the earlier time
        video1.currentTime = syncTime;
        video2.currentTime = syncTime;
        
        // Wait for both to seek, then play together
        let video1Ready = false;
        let video2Ready = false;
        
        function tryPlayBoth() {
          if (video1Ready && video2Ready) {
            Promise.all([
              video1.play().catch(e => console.log('Video 1 play failed:', e)),
              video2.play().catch(e => console.log('Video 2 play failed:', e))
            ]);
          }
        }
        
        video1.addEventListener('seeked', function onSeeked1() {
          video1Ready = true;
          video1.removeEventListener('seeked', onSeeked1);
          tryPlayBoth();
        }, { once: true });
        
        video2.addEventListener('seeked', function onSeeked2() {
          video2Ready = true;
          video2.removeEventListener('seeked', onSeeked2);
          tryPlayBoth();
        }, { once: true });
        
        // Fallback: if seeked doesn't fire quickly, just play
        setTimeout(() => {
          if (!video1Ready || !video2Ready) {
            video1.play().catch(e => {});
            video2.play().catch(e => {});
          }
        }, 500);
      }
    });
  });
}

// Close modal when clicking outside the content
document.addEventListener('click', function(event) {
  const modal = document.getElementById('videoModal');
  if (event.target === modal) {
    closeVideoModal();
  }
});

// Close modal with ESC key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeVideoModal();
  }
});
