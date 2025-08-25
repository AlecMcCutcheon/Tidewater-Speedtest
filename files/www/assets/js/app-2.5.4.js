/*
     Official Website : https://OpenSpeedTest.COM | Email: support@openspeedtest.com
     Developed by : Vishnu | https://Vishnu.Pro | Email : me@vishnu.pro 
     Like this Project? Please Donate NOW & Keep us Alive -> https://go.openspeedtest.com/Donate
    Speed Test by OpenSpeedTest™️ is Free and Open-Source Software (FOSS) with MIT License.
    Read full license terms @ http://go.openspeedtest.com/License
    If you have any Questions, ideas or Comments Please Send it via -> https://go.openspeedtest.com/SendMessage
*/ 

// Load thread configuration from localStorage immediately
var savedThreadMode = localStorage.getItem('threadMode');
var savedThreadType = localStorage.getItem('threadType');

// Global thread configuration variables
var threadMode = savedThreadMode || 'multi'; // 'multi' or 'single'
var threadType = savedThreadType || 'dynamic'; // 'dynamic' or 'default'
var dynamicThreadCount = 6; // Will be calculated based on CPU cores

// Calculate optimal thread count based on CPU cores
function calculateOptimalThreads() {
  if (navigator.hardwareConcurrency) {
    var cores = navigator.hardwareConcurrency;
    // Use 50% of available cores for optimal performance
    var optimalThreads = Math.round(cores * 0.5);
    // Ensure minimum of 1 thread and maximum of available cores
    return Math.max(1, Math.min(optimalThreads, cores));
  }
  return 6; // Fallback to default
}

// Save thread settings to local storage
function saveThreadSettings() {
  localStorage.setItem('threadMode', threadMode);
  localStorage.setItem('threadType', threadType);
  
}

// Update thread count based on current settings
function updateThreadCount() {
  if (threadMode === 'single') {
    dlThreads = 1;
    ulThreads = 1;
  } else {
    if (threadType === 'dynamic') {
      dynamicThreadCount = calculateOptimalThreads();
      dlThreads = dynamicThreadCount;
      ulThreads = dynamicThreadCount;
    } else {
      dlThreads = 6;
      ulThreads = 6;
    }
  }
  
  
  // Save settings whenever thread count is updated
  saveThreadSettings();
}

  // Update button states and icons
  function updateButtonStates() {
    var threadModeBtn = document.getElementById('thread-mode-btn');
    var threadTypeBtn = document.getElementById('thread-type-btn');
    var singleLabel = document.getElementById('single-label');
    var multiLabel = document.getElementById('multi-label');
    var defaultLabel = document.getElementById('default-label');
    var dynamicLabel = document.getElementById('dynamic-label');
    
    if (threadModeBtn) {
      var icon = threadModeBtn.querySelector('i');
      if (threadMode === 'multi') {
        icon.className = 'fas fa-stream';
        threadModeBtn.classList.add('active');
        // Update side label colors
        if (singleLabel) singleLabel.classList.remove('active');
        if (multiLabel) multiLabel.classList.add('active');
        // Update tooltip
        threadModeBtn.setAttribute('data-tooltip-current', threadModeBtn.getAttribute('data-tooltip-multi'));
      } else {
        icon.className = 'fas fa-minus';
        threadModeBtn.classList.remove('active');
        // Update side label colors
        if (singleLabel) singleLabel.classList.add('active');
        if (multiLabel) multiLabel.classList.remove('active');
        // Update tooltip
        threadModeBtn.setAttribute('data-tooltip-current', threadModeBtn.getAttribute('data-tooltip-single'));
      }
    }
    
    if (threadTypeBtn) {
      if (threadType === 'dynamic') {
        threadTypeBtn.classList.add('active');
        // Update side label colors
        if (defaultLabel) defaultLabel.classList.remove('active');
        if (dynamicLabel) dynamicLabel.classList.add('active');
        // Update tooltip with actual thread count
        var cores = navigator.hardwareConcurrency || 4;
        var dynamicThreads = Math.max(1, Math.min(Math.round(cores * 0.5), cores));
        var dynamicTooltip = 'Dynamic: Uses 50% of logical processors for threads (' + dynamicThreads + ')';
        threadTypeBtn.setAttribute('data-tooltip-current', dynamicTooltip);
        
        // Also update the wrapper div's tooltip
        var tooltipWrapper = threadTypeBtn.closest('.tooltip-wrapper');
        if (tooltipWrapper) {
          tooltipWrapper.setAttribute('data-tooltip-current', dynamicTooltip);
        }
      } else {
        threadTypeBtn.classList.remove('active');
        // Update side label colors
        if (defaultLabel) defaultLabel.classList.add('active');
        if (dynamicLabel) dynamicLabel.classList.remove('active');
        // Update tooltip - get the default tooltip from the wrapper div
        var tooltipWrapper = threadTypeBtn.closest('.tooltip-wrapper');
        var defaultTooltip = tooltipWrapper ? tooltipWrapper.getAttribute('data-tooltip-default') : 'Default: Uses 6 threads for download and upload';
        threadTypeBtn.setAttribute('data-tooltip-current', defaultTooltip);
        
        // Also update the wrapper div's tooltip
        if (tooltipWrapper) {
          tooltipWrapper.setAttribute('data-tooltip-current', defaultTooltip);
        }
      }
    }
  }

  // Show/hide thread type container based on mode
  function updateThreadTypeVisibility() {
    var threadTypeContainer = document.getElementById('thread-type-container');
    var threadTypeBtn = document.getElementById('thread-type-btn');
    var defaultLabel = document.getElementById('default-label');
    var dynamicLabel = document.getElementById('dynamic-label');
    
    if (threadTypeContainer) {
      if (threadMode === 'single') {
        threadTypeContainer.style.opacity = '0.3';
        threadTypeContainer.style.pointerEvents = 'none';
        
        // Gray out the button and labels
        if (threadTypeBtn) {
          threadTypeBtn.style.opacity = '0.3';
        }
        if (defaultLabel) {
          defaultLabel.style.opacity = '0.3';
        }
        if (dynamicLabel) {
          dynamicLabel.style.opacity = '0.3';
        }
      } else {
        threadTypeContainer.style.opacity = '1';
        threadTypeContainer.style.pointerEvents = 'auto';
        
        // Restore normal colors
        if (threadTypeBtn) {
          threadTypeBtn.style.opacity = '1';
        }
        if (defaultLabel) {
          defaultLabel.style.opacity = '1';
        }
        if (dynamicLabel) {
          dynamicLabel.style.opacity = '1';
        }
      }
    }
  }

// Initialize thread configuration
function initThreadConfiguration() {
  var threadModeBtn = document.getElementById('thread-mode-btn');
  var threadTypeBtn = document.getElementById('thread-type-btn');
  var threadTypeContainer = document.getElementById('thread-type-container');
  
  if (threadModeBtn && threadTypeBtn) {
    // Set initial states based on loaded values
    updateButtonStates();
    updateThreadTypeVisibility();
    
    // Add event listener for thread mode button
    threadModeBtn.addEventListener('click', function() {
      // Toggle between multi and single
      threadMode = (threadMode === 'multi') ? 'single' : 'multi';
      updateButtonStates();
      updateThreadTypeVisibility();
      updateThreadCount();
    });
    
    // Add event listener for thread type button
    threadTypeBtn.addEventListener('click', function() {
      if (threadMode === 'multi') {
        // Toggle between dynamic and default
        threadType = (threadType === 'dynamic') ? 'default' : 'dynamic';
        updateButtonStates();
        updateThreadCount();
      }
    });
    
    // Initialize thread count
    updateThreadCount();
  }
}

(function(OpenSpeedTest) {
  var Status;
  var ProG;
  var Callback = function(callback) {
    if (callback && typeof callback === "function") {
      callback();
    }
  };
  function _(el) {
    if (!(this instanceof _)) {
      return new _(el);
    }
    this.el = document.getElementById(el);
  }
  _.prototype.fade = function fade(type, ms, callback00) {
    // Check if element exists before trying to access its style
    if (!this.el) {
      if (callback00) {
        callback00();
      }
      return;
    }
    
    var isIn = type === "in", opacity = isIn ? 0 : 1, interval = 14, duration = ms, gap = interval / duration, self = this;
    if (isIn) {
      self.el.style.display = "block";
      self.el.style.opacity = opacity;
    }
    function func() {
      opacity = isIn ? opacity + gap : opacity - gap;
      self.el.style.opacity = opacity;
      if (opacity <= 0) {
        self.el.style.display = "none";
      }
      if (opacity <= 0 || opacity >= 1) {
        window.clearInterval(fading, Callback(callback00));
      }
    }
    var fading = window.setInterval(func, interval);
  };
  var easeOutQuint = function(t, b, c, d) {
    t /= d;
    t--;
    return c * (t * t * t * t * t + 1) + b;
  };
  // Removed conflicting easeOutCubic function
  // Chart.js Charts
  var downloadChart, uploadChart;
  
  // Generate sample data for charts
  function generateSampleData(baseSpeed, variance, points = 50) {
    const data = [];
    const labels = [];
    const now = new Date();
    
    for (let i = 0; i < points; i++) {
      // Create realistic speed variations
      const randomFactor = 0.7 + Math.random() * 0.6; // 70% to 130% of base speed
      const speed = baseSpeed * randomFactor;
      data.push(Math.round(speed * 10) / 10); // Round to 1 decimal place
      
      // Create time labels (going backwards from now)
      const timeOffset = (points - i - 1) * 2; // 2 seconds apart
      const time = new Date(now.getTime() - timeOffset * 1000);
      labels.push(time.toLocaleTimeString());
    }
    
    return { data, labels };
  }
  
  // Function to get CSS variable value
  function getCSSVariable(variableName) {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  }
  
  // Initialize Chart.js charts
  function initializeCharts() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
      setTimeout(initializeCharts, 500);
      return;
    }
    
    // Download Chart
    const downloadCtx = document.getElementById('download-chart');
    
    if (!downloadCtx) {
      return;
    }
    
    const downloadSample = generateSampleData(150, 30); // ~150 Mbps average
    
    try {
      downloadChart = new Chart(downloadCtx, {
        type: 'line',
        data: {
          labels: downloadSample.labels,
          datasets: [{
            label: 'Download Speed (Mbps)',
            data: downloadSample.data,
            borderColor: getCSSVariable('--dark-blue'),
            backgroundColor: getCSSVariable('--dark-blue-transparent'),
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              display: false
            },
            y: {
              display: false
            }
          },
          animation: {
            duration: 0
          },
          layout: {
            padding: {
              top: 10,
              bottom: 10
            }
          }
        }
      });
    } catch (error) {
      console.error('Error creating download chart:', error);
    }
    
    // Upload Chart
    const uploadCtx = document.getElementById('upload-chart');
    
    if (!uploadCtx) {
      return;
    }
    
    const uploadSample = generateSampleData(50, 15); // ~50 Mbps average
    
    try {
      uploadChart = new Chart(uploadCtx, {
        type: 'line',
        data: {
          labels: uploadSample.labels,
          datasets: [{
            label: 'Upload Speed (Mbps)',
            data: uploadSample.data,
            borderColor: getCSSVariable('--dark-blue'),
            backgroundColor: getCSSVariable('--dark-blue-transparent'),
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              display: false
            },
            y: {
              display: false
            }
          },
          animation: {
            duration: 0
          },
          layout: {
            padding: {
              top: 10,
              bottom: 10
            }
          }
        }
      });
    } catch (error) {
      console.error('Error creating upload chart:', error);
    }
  }
  
  // Update chart with new data point
  function updateChart(chart, value) {
    if (!chart) {
      return;
    }
    
    const now = new Date();
    const timeLabel = now.toLocaleTimeString();
    
    chart.data.labels.push(timeLabel);
    chart.data.datasets[0].data.push(value);
    
    // Keep all data points - let the chart compress the time scale
    // The chart will automatically adjust the x-axis to show all data
    
    try {
      chart.update('none'); // Update without animation for real-time performance
    } catch (error) {
      console.error('Error updating chart:', error);
    }
  }
  
  // Reset chart
  function resetChart(chart) {
    if (!chart) return;
    
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    chart.update('none');
  }
  
  // Reset specific chart (download or upload)
  function resetSpecificChart(chartType) {
    if (chartType === 'download') {
      resetChart(downloadChart);
    } else if (chartType === 'upload') {
      resetChart(uploadChart);
    }
  }

  var openSpeedtestShow = function() {

    this.oDoLiveStatus = _("oDoLiveStatus");
    this.ConnectErrorMob = _("ConnectErrorMob");
    this.ConnectErrorDesk = _("ConnectErrorDesk");

    // Legacy UI elements removed - replaced with modern HTML structure
    this.loader = _("loading_app");
    // Legacy gauge references removed - replaced with custom analog gauge



    this.text = _("text");
    // Legacy scale array removed - no longer needed with custom gauge
    this.element = "";
    this.chart = "";
    this.polygon = "";
    this.width = 200;
    this.height = 50;
    this.maxValue = 0;
    this.values = [];
    this.points = [];
    this.vSteps = 5;
    this.measurements = [];
    this.points = [];
  };
  openSpeedtestShow.prototype.reset = function() {
    this.element = "";
    this.chart = "";
    this.polygon = "";
    this.width = 200;
    this.height = 50;
    this.maxValue = 0;
    this.values = [];
    this.points = [];
    this.vSteps = 5;
    this.measurements = [];
    this.points = [];
    
    // Initialize test flag
    this.testActuallyStarted = false;
    
    // Don't reset charts by default - let them persist
  };

  openSpeedtestShow.prototype.prePing = function() {
    this.loader.fade("out", 500);
    // Legacy OpenSpeedtest element removed - modern UI is already visible
  };
  openSpeedtestShow.prototype.app = function() {
    this.loader.fade("out", 500, this.ShowAppIntro());
  };
  openSpeedtestShow.prototype.ShowAppIntro = function() {
    // Legacy OpenSpeedtest element removed - modern UI is already visible
  };
  openSpeedtestShow.prototype.userInterface = function() {
    // Legacy intro elements removed - modern UI is already visible
    this.ShowUI();
  };
    openSpeedtestShow.prototype.ShowUI = function() {
    // Legacy UI elements removed - modern UI is already visible
    Status = "Loaded";
  };

  openSpeedtestShow.prototype.Graph = function(speed, select) {
    // Apply speed clamps if enabled
    if (window.speedClamp && window.speedClamp.download && window.speedClamp.download.enabled && select === 0 && speed > window.speedClamp.download.max) {
      speed = window.speedClamp.download.max;
    }
    if (window.speedClamp && window.speedClamp.upload && window.speedClamp.upload.enabled && select === 1 && speed > window.speedClamp.upload.max) {
      speed = window.speedClamp.upload.max;
    }
    
    // Update Chart.js charts only
    if (speed > 0) {
      if (select === 0) {
        // Download chart
        updateChart(downloadChart, speed);
      } else {
        // Upload chart
        updateChart(uploadChart, speed);
      }
    }
  };
  openSpeedtestShow.prototype.progress = function(Switch, duration) {
    var Self = this;
    var Stop = duration;
    var Stage = Switch;
    var currTime = Date.now();
    var chan2 = 0 - 400;
    var interval = setInterval(function() {
      var timeNow = (Date.now() - currTime) / 1000;
      var toLeft = easeOutCubic4(timeNow, 400, 400, Stop);
      var toRight = easeOutCubic4(timeNow, 400, chan2, Stop);
      if (Stage) {
        // Update modern progress bar (download: server to person - right to left)
        // Use the same easing as the original SVG progress bar
        var progressPercentage = ((toLeft - 400) / 400) * 100;
        updateModernProgress(Math.min(Math.max(progressPercentage, 0), 100), 'download');
      } else {
        // Update modern progress bar (upload: person to server - left to right)
        // Use the same easing as the original SVG progress bar
        var progressPercentage = ((400 - toRight) / 400) * 100;
        updateModernProgress(Math.min(Math.max(progressPercentage, 0), 100), 'upload');
      }
      if (timeNow >= Stop) {
        clearInterval(interval);
        ProG = "done";
        // Complete modern progress bar
        updateModernProgress(100, Stage ? 'download' : 'upload');
      }
    }, 14);
  };
  openSpeedtestShow.prototype.mainGaugeProgress = function(currentSpeed) {
    // Don't update gauge if test hasn't actually started yet
    if (!this.gaugeSyncEnabled) {
      return;
    }
    
    var speed = currentSpeed;
    
    if (speed < 0) {
      speed = 0;
    }
    
    // Apply speed clamps if enabled (only for the current test type)
    if (Status === "Downloading" && window.speedClamp && window.speedClamp.download && window.speedClamp.download.enabled && speed > window.speedClamp.download.max) {
      speed = window.speedClamp.download.max;
    }
    if (Status === "Uploading" && window.speedClamp && window.speedClamp.upload && window.speedClamp.upload.enabled && speed > window.speedClamp.upload.max) {
      speed = window.speedClamp.upload.max;
    }
    
    var currentTime = Date.now();
    
    // Initialize timing on first call
    if (!this.gaugeStartTime) {
      this.gaugeStartTime = currentTime;
      this.gaugeDisplaySpeed = 0;
      this.gaugeTargetSpeed = 0;
      this.gaugeTargetLocked = false;
    }
    
    var timeSinceStart = currentTime - this.gaugeStartTime;
    
    // Update target speed (the speed we're ramping towards)
    // Lock in the target after 500ms to avoid constant changes
    if (!this.gaugeTargetLocked && timeSinceStart > 500) {
      this.gaugeTargetSpeed = Math.max(this.gaugeTargetSpeed, speed);
      this.gaugeTargetLocked = true;
    } else if (!this.gaugeTargetLocked) {
      // During first 500ms, keep updating target
      this.gaugeTargetSpeed = Math.max(this.gaugeTargetSpeed, speed);
    }
    
    if (timeSinceStart < 500) {
      // First 500ms: stay at 0, collect target
      this.gaugeDisplaySpeed = 0;
    } else if (timeSinceStart < 2000) {
      // Next 1.5 seconds: ramp up from 0 to target speed
      var progress = (timeSinceStart - 500) / 1500; // 0 to 1 over 1.5 seconds
      // Use easeInCubic for slow start, fast finish
      var easedProgress = easeInCubic(progress);
      // Always start from 0, ramp up to target speed
      this.gaugeDisplaySpeed = this.gaugeTargetSpeed * easedProgress;
    } else {
      // After 2 seconds: show real speed
      this.gaugeDisplaySpeed = speed || 0;
    }
    
    // Update our custom analog gauge with the display speed
    var analogGauge = document.getElementById('speedGauge');
    if (analogGauge) {
      analogGauge.setAttribute('value', this.gaugeDisplaySpeed);
      
      // Store our display speed in a data attribute to prevent override
      analogGauge.setAttribute('data-lag-speed', this.gaugeDisplaySpeed);
    }
  };
  
  // Smooth easing function for catch-up animation (1 parameter version)
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  
  // Easing function for slow start, fast finish
  function easeInCubic(t) {
    return t * t * t;
  }
  
  // 4-parameter version for compatibility with existing code
  function easeOutCubic4(t, b, c, d) {
    t /= d;
    t--;
    return c * (t * t * t + 1) + b;
  }
  
  // Function to restore lag speed if gauge gets overridden
  function restoreLagSpeed() {
    var analogGauge = document.getElementById('speedGauge');
    if (analogGauge && analogGauge.hasAttribute('data-lag-speed')) {
      var lagSpeed = parseFloat(analogGauge.getAttribute('data-lag-speed'));
      if (!isNaN(lagSpeed)) {
        analogGauge.setAttribute('value', lagSpeed);
      }
    }
  }
  
  // Set up a monitor to prevent gauge override
  setInterval(restoreLagSpeed, 50); // Check every 50ms
  
  // Streaming Stats Functions
  function resetStreamingStats() {
    var streamingItems = ['streamingHD', 'streaming4K', 'videoChat', 'gaming'];
    streamingItems.forEach(function(id) {
      var element = document.getElementById(id);
      if (element) {
        element.classList.remove('supported', 'moderate', 'unsupported', 'testing');
        // Don't add any class by default - let CSS handle the default styling
      }
    });
  }
  
  function setStreamingStatsToTesting() {
    var streamingItems = ['streamingHD', 'streaming4K', 'videoChat', 'gaming'];
    streamingItems.forEach(function(id) {
      var element = document.getElementById(id);
      if (element) {
        element.classList.remove('supported', 'moderate', 'unsupported');
        element.classList.add('testing');
      }
    });
  }
  
    function updateStreamingStats() {
    var downloadSpeed = window.downloadSpeed || 0;
    var uploadSpeed = window.uploadSpeed || 0;
    var ping = window.pingEstimate || 0;
    
    // Helper function to set class
    function setClass(element, className) {
      if (element) {
        element.classList.remove('supported', 'moderate', 'unsupported', 'testing');
        element.classList.add(className);
      }
    }
    
    // HD Video - only needs download speed
    var hdElement = document.getElementById('streamingHD');
    if (downloadSpeed >= 5) {
      setClass(hdElement, 'supported');
    } else if (downloadSpeed >= 3) {
      setClass(hdElement, 'moderate');
    } else if (downloadSpeed > 0) {
      setClass(hdElement, 'unsupported');
    }
    
    // 4K Video - only needs download speed
    var fourKElement = document.getElementById('streaming4K');
    if (downloadSpeed >= 25) {
      setClass(fourKElement, 'supported');
    } else if (downloadSpeed >= 15) {
      setClass(fourKElement, 'moderate');
    } else if (downloadSpeed > 0) {
      setClass(fourKElement, 'unsupported');
    }
    
    // Video Chat - needs both download and upload, plus good ping
    var chatElement = document.getElementById('videoChat');
    if (downloadSpeed > 0 && uploadSpeed > 0) {
      if (downloadSpeed >= 3 && uploadSpeed >= 3 && ping <= 100) {
        setClass(chatElement, 'supported');
      } else if ((downloadSpeed >= 2 && uploadSpeed >= 2) || (downloadSpeed >= 3 && uploadSpeed >= 1) || (downloadSpeed >= 1 && uploadSpeed >= 3)) {
        setClass(chatElement, 'moderate');
      } else {
        setClass(chatElement, 'unsupported');
      }
    }
    
    // Gaming - needs both download and upload, plus low ping
    var gameElement = document.getElementById('gaming');
    if (downloadSpeed > 0 && uploadSpeed > 0) {
      if (downloadSpeed >= 10 && uploadSpeed >= 5 && ping <= 50) {
        setClass(gameElement, 'supported');
      } else if ((downloadSpeed >= 8 && uploadSpeed >= 3) || (downloadSpeed >= 5 && uploadSpeed >= 5) || (downloadSpeed >= 10 && uploadSpeed >= 2)) {
        setClass(gameElement, 'moderate');
      } else {
        setClass(gameElement, 'unsupported');
      }
    }
  }
  openSpeedtestShow.prototype.showStatus = function(e) {
    // Update modern progress status
    updateModernStatus(e);
  };
  openSpeedtestShow.prototype.ConnectionError = function() {
    showModernError();
  };
  openSpeedtestShow.prototype.uploadResult = function(upload) {
    // Update our new HTML upload element only
    var uploadElement = document.getElementById('upload-value');
    var uploadStatus = document.getElementById('upload-status');
    if (uploadElement) {
      if (upload < 1) {
        uploadElement.textContent = upload.toFixed(3);
      } else {
        uploadElement.textContent = upload.toFixed(1);
      }
      uploadStatus.textContent = 'Done';
      uploadStatus.className = 'metric-status';
    }
    
    // Update global upload speed for streaming stats
    window.uploadSpeed = upload;
    
    // Update Chat and Game streaming stats (they need both download and upload)
    var chatElement = document.getElementById('videoChat');
    var gameElement = document.getElementById('gaming');
    var downloadSpeed = window.downloadSpeed || 0;
    var ping = window.pingEstimate || 0;
    
    if (chatElement && downloadSpeed > 0) {
      chatElement.classList.remove('testing');
      if (downloadSpeed >= 3 && upload >= 3 && ping <= 100) {
        chatElement.classList.remove('supported', 'moderate', 'unsupported');
        chatElement.classList.add('supported');
      } else if ((downloadSpeed >= 2 && upload >= 2) || (downloadSpeed >= 3 && upload >= 1) || (downloadSpeed >= 1 && upload >= 3)) {
        chatElement.classList.remove('supported', 'moderate', 'unsupported');
        chatElement.classList.add('moderate');
      } else {
        chatElement.classList.remove('supported', 'moderate', 'unsupported');
        chatElement.classList.add('unsupported');
      }
    }
    
    if (gameElement && downloadSpeed > 0) {
      gameElement.classList.remove('testing');
      if (downloadSpeed >= 10 && upload >= 5 && ping <= 50) {
        gameElement.classList.remove('supported', 'moderate', 'unsupported');
        gameElement.classList.add('supported');
      } else if ((downloadSpeed >= 8 && upload >= 3) || (downloadSpeed >= 5 && upload >= 5) || (downloadSpeed >= 10 && upload >= 2)) {
        gameElement.classList.remove('supported', 'moderate', 'unsupported');
        gameElement.classList.add('moderate');
      } else {
        gameElement.classList.remove('supported', 'moderate', 'unsupported');
        gameElement.classList.add('unsupported');
      }
    }
    
    // Start fade-out immediately when upload test completes
    if (typeof window.showRetryButton === 'function') {
      window.showRetryButton();
    }
  };
  openSpeedtestShow.prototype.pingResults = function(data, Display) {
    var ShowData = data;
    if (Display === "Ping") {
      if (ShowData >= 1 && ShowData < 10000) {
        // Update our new HTML ping element only
        var pingElement = document.getElementById('ping-value');
        var pingStatus = document.getElementById('ping-status');
        if (pingElement) {
          pingElement.textContent = Math.floor(ShowData);
          pingStatus.textContent = 'Done';
          pingStatus.className = 'metric-status';
        }
        
        // Update global ping for streaming stats
        window.pingEstimate = Math.floor(ShowData);
      } else if (ShowData >= 0 && ShowData < 1) {
        if (ShowData == 0) {
          ShowData = 0;
        }
        // Update our new HTML ping element only
        var pingElement = document.getElementById('ping-value');
        var pingStatus = document.getElementById('ping-status');
        if (pingElement) {
          pingElement.textContent = ShowData;
          pingStatus.textContent = 'Done';
          pingStatus.className = 'metric-status';
        }
        
        // Update global ping for streaming stats
        window.pingEstimate = ShowData;
      }
    }
    if (Display === "Error") {
      
      // Update our new HTML ping element with error
      var pingElement = document.getElementById('ping-value');
      var pingStatus = document.getElementById('ping-status');
      if (pingElement) {
        pingElement.textContent = 'Error';
        pingStatus.textContent = 'Error';
        pingStatus.className = 'metric-status error';
      }
    }
  };
  openSpeedtestShow.prototype.downloadResult = function(download) {
    // Update our new HTML download element only
    var downloadElement = document.getElementById('download-value');
    var downloadStatus = document.getElementById('download-status');
    if (downloadElement) {
      if (download < 1) {
        downloadElement.textContent = download.toFixed(3);
      } else {
        downloadElement.textContent = download.toFixed(1);
      }
      downloadStatus.textContent = 'Done';
      downloadStatus.className = 'metric-status';
    }
    
    // Update global download speed for streaming stats
    window.downloadSpeed = download;
    
    // Update HD and 4K streaming stats (they only need download speed)
    var hdElement = document.getElementById('streamingHD');
    var fourKElement = document.getElementById('streaming4K');
    
    if (hdElement) {
      hdElement.classList.remove('testing');
      if (download >= 5) {
        hdElement.classList.remove('supported', 'moderate', 'unsupported');
        hdElement.classList.add('supported');
      } else if (download >= 3) {
        hdElement.classList.remove('supported', 'moderate', 'unsupported');
        hdElement.classList.add('moderate');
      } else {
        hdElement.classList.remove('supported', 'moderate', 'unsupported');
        hdElement.classList.add('unsupported');
      }
    }
    
    if (fourKElement) {
      fourKElement.classList.remove('testing');
      if (download >= 25) {
        fourKElement.classList.remove('supported', 'moderate', 'unsupported');
        fourKElement.classList.add('supported');
      } else if (download >= 15) {
        fourKElement.classList.remove('supported', 'moderate', 'unsupported');
        fourKElement.classList.add('moderate');
      } else {
        fourKElement.classList.remove('supported', 'moderate', 'unsupported');
        fourKElement.classList.add('unsupported');
      }
    }
  };
  openSpeedtestShow.prototype.jitterResult = function(data, Display) {
    var ShowData = data;
    if (Display === "Jitter") {
      if (ShowData >= 1 && ShowData < 10000) {
        // Update our new HTML jitter element only
        var jitterElement = document.getElementById('jitter-value');
        var jitterStatus = document.getElementById('jitter-status');
        if (jitterElement) {
          jitterElement.textContent = Math.floor(ShowData);
          jitterStatus.textContent = 'Done';
          jitterStatus.className = 'metric-status';
        }
      } else if (ShowData >= 0 && ShowData < 1) {
        if (ShowData == 0) {
          ShowData = 0;
        }
        // Update our new HTML jitter element only
        var jitterElement = document.getElementById('jitter-value');
        var jitterStatus = document.getElementById('jitter-status');
        if (jitterElement) {
          jitterElement.textContent = ShowData;
          jitterStatus.textContent = 'Done';
          jitterStatus.className = 'metric-status';
        }
      }
    }
  };
  openSpeedtestShow.prototype.LiveSpeed = function(data, Display) {
    var ShowData = data;
    
    // Apply speed clamps if enabled (only for speed data, not countdown or ping, and only for current test type)
    if (Display !== "countDown" && Display !== "Ping" && typeof ShowData === "number") {
      if (Status === "Downloading" && window.speedClamp && window.speedClamp.download && window.speedClamp.download.enabled && ShowData > window.speedClamp.download.max) {
        ShowData = window.speedClamp.download.max;
      }
      if (Status === "Uploading" && window.speedClamp && window.speedClamp.upload && window.speedClamp.upload.enabled && ShowData > window.speedClamp.upload.max) {
        ShowData = window.speedClamp.upload.max;
      }
    }
    
    if (Display === "countDown") {
      var speed = ShowData.toFixed(0);
      updateModernSpeed(speed);
      return;
    }
    if (Display === "speedToZero") {
      if (typeof ShowData == "number") {
        ShowData = ShowData.toFixed(1);
      }
      if (ShowData <= 0) {
        ShowData = 0;
      }
      updateModernSpeed(ShowData);
      return;
    }
    if (Display === "Ping") {
      if (ShowData >= 1 && ShowData < 10000) {
        updateModernSpeed(Math.floor(ShowData));
      } else if (ShowData >= 0 && ShowData < 1) {
        if (ShowData == 0) {
          ShowData = 0;
        }
        updateModernSpeed(ShowData);
      }
    } else {
      if (ShowData == 0) {
        var speed = ShowData.toFixed(0);
        updateModernSpeed(speed);
      }
      if (ShowData <= 1 && ShowData > 0) {
        var speed = ShowData.toFixed(3);
        updateModernSpeed(speed);
      }
      if (ShowData > 1) {
        var speed = ShowData.toFixed(1);
        updateModernSpeed(speed);
      }
    }
  };
  openSpeedtestShow.prototype.GaugeProgresstoZero = function(currentSpeed, status) {
    var speed = currentSpeed;
    var Self = this;
    var duration = 1;
    if (speed >= 0) {
      var time = Date.now();
      var SpeedtoZero = 0 - speed;
      var interval = setInterval(function() {
        var timeNow = (Date.now() - time) / 1000;
        var speedToZero = easeOutQuint(timeNow, speed, SpeedtoZero, duration);
        Self.LiveSpeed(speedToZero, "speedToZero");
        Self.mainGaugeProgress(speedToZero);
        if (timeNow >= duration || speedToZero <= 0) {
          clearInterval(interval);
          Self.LiveSpeed(0, "speedToZero");
          Self.mainGaugeProgress(0);
          Status = status;
        }
      }, 16);
    }
  };
  // Legacy getNonlinearDegree function removed - no longer needed with custom gauge
  var openSpeedtestGet = function() {
    this.OverAllTimeAvg = window.performance.now();
    this.SpeedSamples = [];
    this.FinalSpeed;
  };
  openSpeedtestGet.prototype.reset = function() {
    this.OverAllTimeAvg = window.performance.now();
    this.SpeedSamples = [];
    this.FinalSpeed = 0;
  };
  openSpeedtestGet.prototype.ArraySum = function(Arr) {
    var array = Arr;
    if (array) {
      var sum = array.reduce(function(A, B) {
        if (typeof A === "number" && typeof B === "number") {
          return A + B;
        }
      }, 0);
      return sum;
    } else {
      return 0;
    }
  };
  openSpeedtestGet.prototype.AvgSpeed = function(Livespeed, Start, duration) {
    var Self = this;
    this.timeNow = (window.performance.now() - this.OverAllTimeAvg) / 1000;
    this.FinalSpeed;
    var StartRecoding = Start;
    StartRecoding = duration - StartRecoding;
    if (this.timeNow >= StartRecoding) {
      if (Livespeed > 0) {
        this.SpeedSamples.push(Livespeed);
      }
      Self.FinalSpeed = Self.ArraySum(Self.SpeedSamples) / Self.SpeedSamples.length;
    }
    
    // Apply speed clamps if enabled (only for the current test type)
    if (Status === "Downloading" && window.speedClamp && window.speedClamp.download && window.speedClamp.download.enabled && Self.FinalSpeed > window.speedClamp.download.max) {
      Self.FinalSpeed = window.speedClamp.download.max;
    }
    if (Status === "Uploading" && window.speedClamp && window.speedClamp.upload && window.speedClamp.upload.enabled && Self.FinalSpeed > window.speedClamp.upload.max) {
      Self.FinalSpeed = window.speedClamp.upload.max;
    }
    
    return Self.FinalSpeed;
  };
  openSpeedtestGet.prototype.uRandom = function(size, callback) {
    var size = size;
    var randomValue = new Uint32Array(262144);
    function getRandom() {
      var n = randomValue.length;
      for (var i = 0; i < n; i++) {
        randomValue[i] = Math.random() * 4294967296;
      }
      return randomValue;
    }
    var randomData = [];
    var genData = function(dataSize) {
      var dataSize = dataSize;
      for (var i = 0; i < dataSize; i++) {
        randomData[i] = getRandom();
      }
      return randomData;
    };
    return new Blob(genData(size), {type:"application/octet-stream"}, Callback(callback));
  };
  openSpeedtestGet.prototype.addEvt = function(o, e, f) {
    o.addEventListener(e, f);
  };
  openSpeedtestGet.prototype.remEvt = function(o, e, f) {
    o.removeEventListener(e, f);
  };
  

  
  var openSpeedtestEngine = function() {
    var Get = new openSpeedtestGet();
    var Show = new openSpeedtestShow();
    Show.testActuallyStarted = false; // Initialize test flag
    Show.app();
    var SendData;
    var myhostName = location.hostname;
    var key;
    var TestServerip;
    var downloadSpeed;
    var uploadSpeed;
    var dataUsedfordl;
    var dataUsedforul;
    var pingEstimate;
    var jitterEstimate;
    var logData;
    var return_data;
    var ReQ = [];
    var StartTime = [];
    var CurrentTime = [];
    var LiveSpeedArr;
    var dLoaded = 0;
    var uLoaded = 0;
    var currentSpeed = 0;
    var uploadTimeing;
    var downloadTimeing;
    var downloadTime;
    var uploadTime;
    var saveTestData;
    var stop = 0;
    function reSett() {
      StartTime = 0;
      CurrentTime = 0;
      LiveSpeedArr = 0;
      currentSpeed = 0;
    }
    var userAgentString;
    if (window.navigator.userAgent) {
      userAgentString = window.navigator.userAgent;
    } else {
      userAgentString = "Not Found";
    }
    var ulFinal = ulDuration * 0.6;
    var dlFinal = dlDuration * 0.6;
    function setFinal() {
      if (ulDuration * 0.6 >= 7) {
        ulFinal = 7;
      }
      if (dlDuration * 0.6 >= 7) {
        dlFinal = 7;
      }
    }
    setFinal();
    var launch = true;
    var init = true;


    
    // Modern start button functionality
    var modernStartButton = document.getElementById('goButton');
    
      function resetModernStartButton() {
    if (modernStartButton) {
      modernStartButton.classList.remove('running');
      modernStartButton.classList.remove('retry');
      modernStartButton.innerHTML = '<span class="go-text">GO</span>';
      modernStartButton.disabled = false;
    }
  }
    

    
    // Full reset function to prepare for a new test
    function fullReset() {
      // Clear any existing intervals/timers
      if (window.Engine) {
        clearInterval(window.Engine);
        window.Engine = null;
      }
      if (window.autoTest) {
        clearInterval(window.autoTest);
        window.autoTest = null;
      }
      
      // Reset all engine variables
      Status = "Loaded";
      ProG = "";
      launch = true;
      init = true;
      addEvent = true;
      stop = 0;
      
      // Reset test control variables
      OpenSpeedTestStart = undefined;
      SelectTest = false;
      Startit = 0;
      
      // Reset speed variables
      downloadSpeed = 0;
      uploadSpeed = 0;
      dataUsedfordl = 0;
      dataUsedforul = 0;
      pingEstimate = 0;
      jitterEstimate = 0;
      currentSpeed = 0;
      LiveSpeedArr = 0;
      
      // Reset global speed variables for streaming stats
      window.downloadSpeed = 0;
      window.uploadSpeed = 0;
      window.pingEstimate = 0;
      
      // Reset timing variables
      downloadTimeing = 0;
      uploadTimeing = 0;
      downloadTime = 0;
      uploadTime = 0;
      
      // Reset data variables
      dLoaded = 0;
      uLoaded = 0;
      dLoad = 0;
      dDiff = 0;
      dTotal = 0;
      dtLoad = 0;
      dtDiff = 0;
      dtTotal = 0;
      dRest = 0;
      uLoad = 0;
      uDiff = 0;
      uTotal = 0;
      utLoad = 0;
      utDiff = 0;
      utTotal = 0;
      uRest = 0;
      

      
      // Reset gauge lag variables for new test
      if (Show) {
        Show.gaugeStartTime = 0;
        Show.gaugeDisplaySpeed = 0;
        Show.gaugeTargetSpeed = 0;
        Show.gaugeTargetLocked = false;
        Show.gaugeSyncEnabled = false; // Disable gauge sync until test starts
      }
      
      // Reset arrays
      ReQ = [];
      StartTime = [];
      CurrentTime = [];
      uReQ = [];
      finalPing = [];
      pingServer = [];
      finalJitter = [];
      pingResult = [];
      jitterResult = [];
      
      // Reset ping/jitter variables
      pingSamplesSend = 0;
      pingSendStatus = -1;
      
      // Reset other test variables
      dReset = 0;
      some = undefined;
      
      // Reset objects
      Get.reset();
      Show.reset();
      
      // Reset UI elements
      resetModernProgress();
      
      // Enable thread configuration after reset
      if (typeof enableThreadConfig === 'function') {
        enableThreadConfig();
      }
      resetModernStartButton();
      
      // Reset gauge to zero
      var analogGauge = document.getElementById('speedGauge');
      if (analogGauge) {
        analogGauge.setAttribute('value', 0);
      }
      
      // Reset streaming stats to testing state
      setStreamingStatsToTesting();
      
      // Reset modern UI elements
      var downloadElement = document.getElementById('download-value');
      var uploadElement = document.getElementById('upload-value');
      var pingElement = document.getElementById('ping-value');
      var jitterElement = document.getElementById('jitter-value');
      
      if (downloadElement) downloadElement.textContent = '--';
      if (uploadElement) uploadElement.textContent = '--';
      if (pingElement) pingElement.textContent = '--';
      if (jitterElement) jitterElement.textContent = '--';
      
      // Reset status elements
      var downloadStatus = document.getElementById('download-status');
      var uploadStatus = document.getElementById('upload-status');
      var pingStatus = document.getElementById('ping-status');
      var jitterStatus = document.getElementById('jitter-status');
      
      if (downloadStatus) {
        downloadStatus.textContent = 'Ready';
        downloadStatus.className = 'metric-status';
      }
      if (uploadStatus) {
        uploadStatus.textContent = 'Ready';
        uploadStatus.className = 'metric-status';
      }
      if (pingStatus) {
        pingStatus.textContent = 'Ready';
        pingStatus.className = 'metric-status';
      }
      if (jitterStatus) {
        jitterStatus.textContent = 'Ready';
        jitterStatus.className = 'metric-status';
      }
      
      // Reset progress status
      updateModernStatus('Ready');
      
      // Hide any error messages
      var errorContainer = document.getElementById('modern-error-container');
      if (errorContainer) {
        errorContainer.classList.remove('show');
      }
      

    }
    

    
    if (modernStartButton) {
      Get.addEvt(modernStartButton, "click", function() {
        // Full reset to prepare for new test
        fullReset();
        
        // Update button state to show it's running
        modernStartButton.classList.add('running');
        modernStartButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        modernStartButton.disabled = true;
        
        // Reset modern progress bar
        resetModernProgress();
        
        // Start test with fade animation if function exists
        if (typeof startTestWithFade === 'function') {
          // Don't call startTestWithFade here - it's handled in the HTML file
          // startTestWithFade();
        } else {
          // Fallback to direct start
          runTasks();
        }
      });
    }
    Get.addEvt(document, "keypress", hiEnter);
    var addEvent = true;
    var getParams = function(url) {
      var params = {};
      var parser = document.createElement("a");
      parser.href = url;
      var query = parser.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        params[pair[0]] = decodeURIComponent(pair[1]);
      }
      return params;
    };
    var getCommand = getParams(window.location.href.toLowerCase());
    if (setPingSamples) {
      if (typeof getCommand.ping === "string" || typeof getCommand.p === "string") {
        var setPing;
        if (typeof getCommand.ping !== "undefined") {
          setPing = getCommand.ping;
        } else if (typeof getCommand.p !== "undefined") {
          setPing = getCommand.p;
        }
        if (setPing > 0) {
          pingSamples = setPing;
          pingSamples = setPing;
        }
      }
    }
    if (setPingTimeout) {
      if (typeof getCommand.out === "string" || typeof getCommand.o === "string") {
        var setOut;
        if (typeof getCommand.out !== "undefined") {
          setOut = getCommand.out;
        } else if (typeof getCommand.o !== "undefined") {
          setOut = getCommand.o;
        }
        if (setOut > 1) {
          pingTimeOut = setOut;
          pingTimeOut = setOut;
        }
      }
    }
    if (setHTTPReq) {
      if (typeof getCommand.xhr === "string" || typeof getCommand.x === "string") {
        var setThreads;
        if (typeof getCommand.xhr !== "undefined") {
          setThreads = getCommand.xhr;
        } else if (typeof getCommand.x !== "undefined") {
          setThreads = getCommand.x;
        }
        if (setThreads > 0 && setThreads <= 32) {
          dlThreads = setThreads;
          ulThreads = setThreads;
        }
      }
    }
    function isValidHttpUrl(str) {
      var regex = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
      if (!regex.test(str)) {
        return false;
      } else {
        return true;
      }
    }
    if (selectServer) {
      if (typeof getCommand.host === "string" || typeof getCommand.h === "string") {
        var severAddress;
        if (typeof getCommand.host !== "undefined") {
          severAddress = getCommand.host;
        } else if (typeof getCommand.h !== "undefined") {
          severAddress = getCommand.h;
        }
        if (isValidHttpUrl(severAddress)) {
          openSpeedTestServerList = [{ServerName:"Home", Download:severAddress + "/downloading", Upload:severAddress + "/upload", ServerIcon:"DefaultIcon",},];
        }
      }
    }
    var custom = parseInt(getCommand.stress);
    var customS = parseInt(getCommand.s);
    var runStress;
    var runStressCustom;
    if (typeof getCommand.stress === "string") {
      runStress = getCommand.stress;
      runStressCustom = custom;
    } else if (typeof getCommand.s === "string") {
      runStress = getCommand.s;
      runStressCustom = customS;
    }
    if (runStress && stressTest) {
      if (runStress === "low" || runStress === "l") {
        dlDuration = 300;
        ulDuration = 300;
      }
      if (runStress === "medium" || runStress === "m") {
        dlDuration = 600;
        ulDuration = 600;
      }
      if (runStress === "high" || runStress === "h") {
        dlDuration = 900;
        ulDuration = 900;
      }
      if (runStress === "veryhigh" || runStress === "v") {
        dlDuration = 1800;
        ulDuration = 1800;
      }
      if (runStress === "extreme" || runStress === "e") {
        dlDuration = 3600;
        ulDuration = 3600;
      }
      if (runStress === "day" || runStress === "d") {
        dlDuration = 86400;
        ulDuration = 86400;
      }
      if (runStress === "year" || runStress === "y") {
        dlDuration = 31557600;
        ulDuration = 31557600;
      }
      if (custom > 12 || customS > 12) {
        dlDuration = runStressCustom;
        ulDuration = runStressCustom;
      }
    }
    var overheadClean = parseInt(getCommand.clean);
    var overheadCleanC = parseInt(getCommand.c);
    var customOverHeadValue = 1;
    if (overheadClean) {
      customOverHeadValue = overheadClean;
    } else if (overheadCleanC) {
      customOverHeadValue = overheadCleanC;
    }
    if (enableClean) {
      if (typeof getCommand.clean === "string" || typeof getCommand.c === "string") {
        if (overheadClean >= 1 || overheadCleanC >= 1) {
          if (overheadClean < 5 || overheadCleanC < 5) {
            upAdjust = 1 + customOverHeadValue / 100;
            dlAdjust = 1 + customOverHeadValue / 100;
          }
        } else {
          upAdjust = 1;
          dlAdjust = 1;
        }
      }
    }
    var OpenSpeedTestRun = parseInt(getCommand.run);
    var OpenSpeedTestRunR = parseInt(getCommand.r);
    var OpenSpeedTestStart;
    if (enableRun) {
      if (typeof getCommand.run === "string" || typeof getCommand.r === "string") {
        if (OpenSpeedTestRun > 0) {
          OpenSpeedTestStart = OpenSpeedTestRun;
        } else if (OpenSpeedTestRunR > 0) {
          OpenSpeedTestStart = OpenSpeedTestRunR;
        } else {
          OpenSpeedTestStart = 0;
        }
      }
    }
    if (OpenSpeedTestStart >= 0) {
      if (launch) {
        runTasks();
      }
    }
    var runTest = getCommand.test;
    var runTestT = getCommand.t;
    var SelectTest = false;
    if (selectTest) {
      if (typeof runTest === "string" || typeof runTestT === "string") {
        var runTestC;
        if (runTest) {
          runTestC = runTest;
          SelectTest = runTest;
        } else if (runTestT) {
          runTestC = runTestT;
          SelectTest = runTestT;
        }
        if (runTestC === "download" || runTestC === "d") {
          uploadSpeed = 0;
          dataUsedforul = 0;
          SelectTest = "Download";
          if (launch) {
            runTasks();
          }
        } else if (runTestC === "upload" || runTestC === "u") {
          downloadSpeed = 0;
          dataUsedfordl = 0;
          SelectTest = "Upload";
          stop = 1;
          if (launch) {
            runTasks();
          }
        } else if (runTestC === "ping" || runTestC === "p") {
          uploadSpeed = 0;
          dataUsedforul = 0;
          downloadSpeed = 0;
          dataUsedfordl = 0;
          SelectTest = "Ping";
          if (launch) {
            runTasks();
          }
        } else {
          SelectTest = false;
        }
      }
    }
    var Startit = 0;
    function removeEvts() {


      Get.remEvt(document, "keypress", hiEnter);
    }

    function runTasks() {
      // Disable thread configuration during test
      disableThreadConfig();
      
      if (addEvent) {
        removeEvts();
        addEvent = false;
      }
      if (OpenSpeedTestStart >= 0) {
        launch = false;
        Show.userInterface();
        init = false;
        var AutoTme = Math.ceil(Math.abs(OpenSpeedTestStart));
        Show.showStatus("Automatic Test Starts in ...");
        window.autoTest = setInterval(countDownF, 1000);
      }
      function countDownF() {
        if (AutoTme >= 1) {
          AutoTme = AutoTme - 1;
          Show.LiveSpeed(AutoTme, "countDown");
        } else {
          if (AutoTme <= 0) {
            clearInterval(window.autoTest);
            launch = true;
            OpenSpeedTestStart = undefined;
            runTasks();
          }
        }
      }
      if (openSpeedTestServerList === "fetch" && launch === true) {
        launch = false;
        Show.showStatus("Fetching Server Info..");
        ServerConnect(6);
      }
      if (launch === true) {
        if (SelectTest === "Ping") {
          testRun();
        } else if (SelectTest === "Download") {
          testRun();
        } else if (SelectTest === "Upload") {
          testRun();
        } else if (SelectTest === false) {
          testRun();
        }
      }
    }
    
    // Thread configuration disable/enable functions
    function disableThreadConfig() {
      const threadBtn = document.getElementById('thread-mode-btn');
      const threadSwitch = document.getElementById('thread-type-btn');
      
      if (threadBtn) {
        threadBtn.classList.add('disabled');
      }
      if (threadSwitch) {
        threadSwitch.classList.add('disabled');
      }
    }
    
    function enableThreadConfig() {
      const threadBtn = document.getElementById('thread-mode-btn');
      const threadSwitch = document.getElementById('thread-type-btn');
      
      if (threadBtn) {
        threadBtn.classList.remove('disabled');
      }
      if (threadSwitch) {
        threadSwitch.classList.remove('disabled');
      }
    }
    
    // Make runTasks globally available
    window.runTasks = runTasks;
    window.disableThreadConfig = disableThreadConfig;
    window.enableThreadConfig = enableThreadConfig;
    var osttm = "\u2122";
    var myname = "OpenSpeedTest";
    var com = ".com";
    var ost = myname + osttm;
    function hiEnter(e) {
      if (e.key === "Enter") {
        runTasks();
      }
    }
    var showResult = 0;
    if (openChannel === "web") {
      showResult = webRe;
    }
    if (openChannel === "widget") {
      showResult = widgetRe;
    }
    if (openChannel === "selfwidget") {
      showResult = widgetRe;
      TestServerip = domainx;
      myhostName = TestServerip;
    }
    if (openChannel === "dev") {
    }
    function testRun() {
      if (init) {
        Show.userInterface();
        init = false;
      }
      OpenSpeedtest();
    }
    function OpenSpeedtest() {
      if (openChannel === "widget" || openChannel === "web") {
        ServerConnect(1);
      }
      function readyToUP() {
        uploadTime = window.performance.now();
        upReq();
      }
      window.Engine = setInterval(function() {
        if (Status === "Loaded") {
          Status = "busy";
          sendPing(0);
        }
        if (Status === "Ping") {
          Status = "busy";
          Show.showStatus("Milliseconds");
        }
        if (Status === "Download") {
          Show.showStatus("Initializing..");
          Get.reset();
          reSett();
          Show.reset();
          
          // Enable gauge sync for the test
          Show.gaugeSyncEnabled = true;
          
          // Reset only the download chart when starting download test
          resetSpecificChart('download');
          
          downloadTime = window.performance.now();
          downReq();
          Status = "initDown";
          
          // Update our new HTML download element to show testing status
          var downloadElement = document.getElementById('download-value');
          var downloadStatus = document.getElementById('download-status');
          if (downloadElement && downloadStatus) {
            downloadElement.textContent = '--';
            downloadStatus.textContent = 'Testing';
            downloadStatus.className = 'metric-status testing';
          }
        }
        if (Status === "Downloading") {
          if (Startit == 0) {
            Startit = 1;
            Show.showStatus("Testing download speed..");
            var extraTime = (window.performance.now() - downloadTime) / 1000;
            dReset = extraTime;
            Show.progress(1, dlDuration + 2.5);
            dlDuration += extraTime;
          }
          downloadTimeing = (window.performance.now() - downloadTime) / 1000;
          reportCurrentSpeed("dl");
          Show.showStatus("Mbps download");
          Show.mainGaugeProgress(currentSpeed);
          Show.LiveSpeed(currentSpeed);
          Show.Graph(currentSpeed, 0);
          downloadSpeed = Get.AvgSpeed(currentSpeed, dlFinal, dlDuration);
          if (downloadTimeing >= dlDuration && ProG == "done") {
            if (SelectTest) {
              Show.GaugeProgresstoZero(currentSpeed, "SendR");
              Show.showStatus("All done");
              resetModernStartButton();
            } else {
              Show.GaugeProgresstoZero(currentSpeed, "Upload");
            }
            Show.downloadResult(downloadSpeed);
            dataUsedfordl = dLoaded;
            stop = 1;
            Status = "busy";
            reSett();
            Get.reset();
          }
        }
        if (Status == "Upload") {
          if (stop === 1) {
            Status = "initup";
            Show.showStatus("Initializing..");
            Show.LiveSpeed("...", "speedToZero");
            SendData = Get.uRandom(ulDataSize, readyToUP);
            if (SelectTest) {
              Startit = 1;
            }
            
            // Enable gauge sync for upload test
            Show.gaugeSyncEnabled = true;
            
            // Reset gauge lag variables for upload test
            Show.gaugeStartTime = 0;
            Show.gaugeDisplaySpeed = 0;
            Show.gaugeTargetSpeed = 0;
            Show.gaugeTargetLocked = false;
            
            // Reset only the upload chart when starting upload test
            resetSpecificChart('upload');
            
            // Update our new HTML upload element to show testing status
            var uploadElement = document.getElementById('upload-value');
            var uploadStatus = document.getElementById('upload-status');
            if (uploadElement && uploadStatus) {
              uploadElement.textContent = '--';
              uploadStatus.textContent = 'Testing';
              uploadStatus.className = 'metric-status testing';
            }
          }
        }
        if (Status === "Uploading") {
          if (Startit == 1) {
            Startit = 2;
            Show.showStatus("Testing upload speed..");
            currentSpeed = 0;
            Get.reset();
            Show.reset();
            // Clear modern progress bar instantly before starting upload test
            updateModernProgress(0, 'upload');
            var extraUTime = (window.performance.now() - uploadTime) / 1000;
            uReset = extraUTime;
            Show.progress(false, ulDuration + 2.5);
            ulDuration += extraUTime;
          }
          Show.showStatus("Mbps upload");
          uploadTimeing = (window.performance.now() - uploadTime) / 1000;
          reportCurrentSpeed("up");
          Show.mainGaugeProgress(currentSpeed);
          Show.LiveSpeed(currentSpeed);
          Show.Graph(currentSpeed, 1);
          uploadSpeed = Get.AvgSpeed(currentSpeed, ulFinal, ulDuration);
          if (uploadTimeing >= ulDuration && stop == 1) {
            dataUsedforul = uLoaded;
            Show.uploadResult(uploadSpeed);
            Show.GaugeProgresstoZero(currentSpeed, "SendR");
            SendData = undefined;
            Show.showStatus("All done");
            resetModernStartButton();
            Status = "busy";
            stop = 0;
          }
        }
        if (Status === "Error") {
          Show.showStatus("Check your network connection status.");
          Show.ConnectionError();
          Status = "busy";
          clearInterval(Engine);
          // Legacy SVG elements removed - modern error handling is in place
        }
        if (Status === "SendR") {
          Show.showStatus("All done");
          resetModernStartButton();
          
          // Remove testing class from streaming stats so they can be updated with final results
          var streamingItems = ['streamingHD', 'streaming4K', 'videoChat', 'gaming'];
          streamingItems.forEach(function(id) {
            var element = document.getElementById(id);
            if (element) {
              element.classList.remove('testing');
            }
          });
          
          // Retry button is now triggered immediately when upload test completes
          // No need to call showRetryButton here anymore
          
          // Legacy SVG elements removed - modern UI handles completion
          if (location.hostname != myname.toLowerCase() + com) {
            if (saveData) {
              // NEW CODE - TESTING: build urlencoded payload for result posting
              try {
                var dMbps = (typeof downloadSpeed === 'number' && isFinite(downloadSpeed)) ? downloadSpeed : 0;
                var uMbps = (typeof uploadSpeed === 'number' && isFinite(uploadSpeed)) ? uploadSpeed : 0;
                var ddMb  = (typeof dataUsedfordl === 'number' && isFinite(dataUsedfordl)) ? (dataUsedfordl / 1048576) : 0;
                var udMb  = (typeof dataUsedforul === 'number' && isFinite(dataUsedforul)) ? (dataUsedforul / 1048576) : 0;
                var pMs   = (typeof pingEstimate === 'number' && isFinite(pingEstimate)) ? pingEstimate : 0;
                var jitMs = (typeof jitterEstimate === 'number' && isFinite(jitterEstimate)) ? jitterEstimate : 0;
                var host  = (typeof myhostName === 'string') ? myhostName : '';
                var uaStr = (typeof userAgentString === 'string') ? userAgentString : '';
                // Mirror the portal format keys where possible
                saveTestData =
                  'r=l' +
                  '&d='   + encodeURIComponent(dMbps) +
                  '&u='   + encodeURIComponent(uMbps) +
                  '&dd='  + encodeURIComponent(ddMb) +
                  '&ud='  + encodeURIComponent(udMb) +
                  '&p='   + encodeURIComponent(pMs) +
                  '&jit=' + encodeURIComponent(jitMs) +
                  '&do='  + encodeURIComponent(host) +
                  '&ua='  + encodeURIComponent(uaStr);
              } catch (e) {
                // Fallback to minimal payload
                saveTestData = 'r=l' + '&d=' + (downloadSpeed||0) + '&u=' + (uploadSpeed||0) + '&p=' + (pingEstimate||0);
              }
              ServerConnect(5);
            }
          } else {
            ServerConnect(3);
          }
          Status = "busy";
          clearInterval(Engine);
        }
      }, 100);
    }
    function downReq() {
      for (var i = 0; i < dlThreads; i++) {
        setTimeout(function(i) {
          SendReQ(i);
        }, dlDelay * i, i);
      }
    }
    function upReq() {
      for (var i = 0; i < ulThreads; i++) {
        setTimeout(function(i) {
          SendUpReq(i);
        }, ulDelay * i, i);
      }
    }
    var dLoad = 0;
    var dDiff = 0;
    var dTotal = 0;
    var dtLoad = 0;
    var dtDiff = 0;
    var dtTotal = 0;
    var dRest = 0;
    var dReset;
    var uReset;
    var uLoad = 0;
    var uDiff = 0;
    var uTotal = 0;
    var utLoad = 0;
    var utDiff = 0;
    var utTotal = 0;
    var uRest = 0;
    var dualReset;
    var neXT = dlDuration * 1000 - 6000;
    var dualupReset;
    var neXTUp = ulDuration * 1000 - 6000;
    function reportCurrentSpeed(now) {
      if (now === "dl") {
        var dTime = downloadTimeing * 1000;
        if (dTime > dReset * 1000 + dlFinal / 2 * 1000 && dRest === 0) {
          dRest = 1;
          dtTotal = dtTotal * 0.01;
          dTotal = dTotal * 0.01;
          dualReset = dTime + 10000;
        }
        if (dTime >= dualReset && dualReset < neXT) {
          dualReset += 10000;
          dtTotal = dtTotal * 0.01;
          dTotal = dTotal * 0.01;
        }
        dLoad = dLoaded <= 0 ? 0 : dLoaded - dDiff;
        dDiff = dLoaded;
        dTotal += dLoad;
        dtLoad = dtDiff = 0 ? 0 : dTime - dtDiff;
        dtDiff = dTime;
        dtTotal += dtLoad;
        if (dTotal > 0) {
          LiveSpeedArr = dTotal / dtTotal / 125 * upAdjust;
          currentSpeed = LiveSpeedArr;
        }
      }
      if (now === "up") {
        var Tym = uploadTimeing * 1000;
        if (Tym > uReset * 1000 + ulFinal / 2 * 1000 && uRest === 0) {
          uRest = 1;
          utTotal = utTotal * 0.1;
          uTotal = uTotal * 0.1;
          dualupReset = Tym + 10000;
        }
        if (Tym >= dualupReset && dualupReset < neXTUp) {
          dualupReset += 10000;
          utTotal = utTotal * 0.1;
          uTotal = uTotal * 0.1;
        }
        uLoad = uLoaded <= 0 ? 0 : uLoaded - uDiff;
        uDiff = uLoaded;
        uTotal += uLoad;
        utLoad = utDiff = 0 ? 0 : Tym - utDiff;
        utDiff = Tym;
        utTotal += utLoad;
        if (uTotal > 0) {
          LiveSpeedArr = uTotal / utTotal / 125 * upAdjust;
          currentSpeed = LiveSpeedArr;
        }
      }
    }
    function SendReQ(i) {
      var lastLoaded = 0;
      var OST = new XMLHttpRequest();
      ReQ[i] = OST;
      ReQ[i].open("GET", fianlPingServer.Download + "?n=" + Math.random(), true);
      ReQ[i].onprogress = function(e) {
        if (stop === 1) {
          ReQ[i].abort();
          ReQ[i] = null;
          ReQ[i] = undefined;
          delete ReQ[i];
          return false;
        }
        if (Status == "initDown") {
          Status = "Downloading";
        }
        var eLoaded = e.loaded <= 0 ? 0 : e.loaded - lastLoaded;
        if (isNaN(eLoaded) || !isFinite(eLoaded) || eLoaded < 0) {
          return false;
        }
        dLoaded += eLoaded;
        lastLoaded = e.loaded;
      };
      ReQ[i].onload = function(e) {
        if (lastLoaded === 0) {
          dLoaded += e.total;
        }
        if (Status == "initDown") {
          Status = "Downloading";
        }
        if (ReQ[i]) {
          ReQ[i].abort();
          ReQ[i] = null;
          ReQ[i] = undefined;
          delete ReQ[i];
        }
        if (stop === 0) {
          SendReQ(i);
        }
      };
      ReQ[i].onerror = function(e) {
        if (stop === 0) {
          SendReQ(i);
        }
      };
      ReQ[i].responseType = "arraybuffer";
      ReQ[i].send();
    }
    var uReQ = [];
    function SendUpReq(i) {
      var lastULoaded = 0;
      var OST = new XMLHttpRequest();
      uReQ[i] = OST;
      uReQ[i].open("POST", fianlPingServer.Upload + "?n=" + Math.random(), true);
      uReQ[i].upload.onprogress = function(e) {
        if (Status == "initup" && some === undefined) {
          var some;
          Status = "Uploading";
        }
        if (uploadTimeing >= ulDuration) {
          uReQ[i].abort();
          uReQ[i] = null;
          uReQ[i] = undefined;
          delete uReQ[i];
          return false;
        }
        var eLoaded = e.loaded <= 0 ? 0 : e.loaded - lastULoaded;
        if (isNaN(eLoaded) || !isFinite(eLoaded) || eLoaded < 0) {
          return false;
        }
        uLoaded += eLoaded;
        lastULoaded = e.loaded;
      };
      uReQ[i].onload = function() {
        if (lastULoaded === 0) {
          uLoaded += ulDataSize * 1048576;
          if (uploadTimeing >= ulDuration) {
            uReQ[i].abort();
            uReQ[i] = null;
            uReQ[i] = undefined;
            delete uReQ[i];
            return false;
          }
        }
        if (Status == "initup" && some === undefined) {
          var some;
          Status = "Uploading";
        }
        if (uReQ[i]) {
          uReQ[i].abort();
          uReQ[i] = null;
          uReQ[i] = undefined;
          delete uReQ[i];
        }
        if (stop === 1) {
          SendUpReq(i);
        }
      };
      uReQ[i].onerror = function(e) {
        if (uploadTimeing <= ulDuration) {
          SendUpReq(i);
        }
      };
      uReQ[i].setRequestHeader("Content-Type", "application/octet-stream");
      if (i > 0 && uLoaded <= 17000) {
      } else {
        uReQ[i].send(SendData);
      }
    }
    function sendPing() {
      readServerList();
    }
    var fianlPingServer;
    var statusPing;
    var statusPingFinal;
    var statusJitter;
    var statusJitterFinal;
    var statusPingTest;
    var pingSendStatus = -1;
    var finalPing = [];
    var pingServer = [];
    var finalJitter = [];
    var pingSendLength = openSpeedTestServerList.length;
    function readServerList() {
      pingSendLength = openSpeedTestServerList.length;
      Status = "Ping";
      performance.clearResourceTimings();
      
      // Update our new HTML elements to show testing status
      var pingElement = document.getElementById('ping-value');
      var pingStatus = document.getElementById('ping-status');
      var jitterElement = document.getElementById('jitter-value');
      var jitterStatus = document.getElementById('jitter-status');
      
      if (pingElement && pingStatus) {
        pingElement.textContent = '--';
        pingStatus.textContent = 'Testing';
        pingStatus.className = 'metric-status testing';
      }
      
      if (jitterElement && jitterStatus) {
        jitterElement.textContent = '--';
        jitterStatus.textContent = 'Testing';
        jitterStatus.className = 'metric-status testing';
      }
      if (pingSendStatus < pingSendLength - 1) {
        pingSendStatus++;
        if (statusPingTest != "Stop") {
          sendPingRequest(openSpeedTestServerList[pingSendStatus], readServerList);
        }
      } else {
        if (pingServer.length >= 1) {
          var finalLeastPingResult = Math.min.apply(Math, finalPing);
          var finalLeastPingResultIndex = finalPing.indexOf(finalLeastPingResult);
          fianlPingServer = pingServer[finalLeastPingResultIndex];
          statusPingFinal = finalLeastPingResult;
          statusJitterFinal = finalJitter[finalLeastPingResultIndex];
          statusPingTest = "Busy";
          Show.LiveSpeed(statusPingFinal, "Ping");
          Show.pingResults(statusPingFinal, "Ping");
          Show.jitterResult(statusJitterFinal, "Jitter");
          pingEstimate = statusPingFinal;
          jitterEstimate = statusJitterFinal;
          if (SelectTest) {
            if (SelectTest == "Ping") {
              Status = "SendR";
            } else {
              Status = SelectTest;
            }
          } else {
            Status = "Download";
          }
        } else {
          if (pingServer.Download) {
          } else {
            Status = "Error";
          }
        }
      }
    }
    function sendPingRequest(serverListElm, callback) {
      var pingSamplesSend = 0;
      var pingResult = [];
      var jitterResult = [];
      function sendNewPingReq() {
        if (pingSamplesSend < pingSamples) {
          pingSamplesSend++;
          if (statusPingTest != "Stop") {
            PingRequest();
          }
        } else {
          if (pingResult.length > 1) {
            jitterResult.sort(function(a, b) {
              return a - b;
            });
            jitterResult = jitterResult.slice(0, jitterResult.length * jitterFinalSample);
            jitterResult = jitterResult.reduce(function(acc, val) {
              return acc + val;
            }, 0) / jitterResult.length;
            var leastJitter = jitterResult.toFixed(1);
            var leastPing = Math.min.apply(Math, pingResult);
            finalPing.push(leastPing);
            pingServer.push(serverListElm);
            finalJitter.push(leastJitter);
            if (typeof callback === "function") {
              callback();
            }
          } else {
            if (typeof callback === "function") {
              callback();
            }
          }
        }
      }
      function PingRequest() {
        var OST = new XMLHttpRequest();
        var ReQ = OST;
        if (statusPingTest != "Stop") {
          ReQ.abort();
        }
        ReQ.open(pingMethod, serverListElm[pingFile] + "?n=" + Math.random(), true);
        ReQ.timeout = pingTimeOut;
        var startTime = window.performance.now();
        ReQ.send();
        ReQ.onload = function() {
          if (this.status === 200 && this.readyState === 4) {
            var endTime = Math.floor(window.performance.now() - startTime);
            var perfNum = performance.getEntries();
            perfNum = perfNum[perfNum.length - 1];
            var perfPing;
            if (perfNum.initiatorType === "xmlhttprequest") {
              perfPing = parseFloat(perfNum.duration.toFixed(1));
            } else {
              perfPing = endTime;
            }
            if (pingSamplesSend > 250) {
              perfPing = endTime;
            }
            if (perfPing <= 0) {
              statusPing = 0.1;
              pingResult.push(0.1);
            } else {
              statusPing = perfPing;
              pingResult.push(perfPing);
            }
            if (pingResult.length > 1) {
              var jitterCalc = Math.abs(pingResult[pingResult.length - 1] - pingResult[pingResult.length - 2]).toFixed(1);
              jitterResult.push(parseFloat(jitterCalc));
              statusJitter = jitterCalc;
              Show.LiveSpeed(perfPing, "Ping");
              Show.pingResults(perfPing, "Ping");
              Show.jitterResult(jitterCalc, "Jitter");
            }
            sendNewPingReq();
          }
          if (this.status === 404 && this.readyState === 4) {
            pingSamplesSend++;
            sendNewPingReq();
          }
        };
        ReQ.onerror = function(e) {
          pingSamplesSend++;
          sendNewPingReq();
        };
        ReQ.ontimeout = function(e) {
          pingSamplesSend++;
          sendNewPingReq();
        };
      }
      PingRequest();
    }
    var ServerConnect = function(auth) {
      var Self = this;
      var xhr = new XMLHttpRequest();
      var url = OpenSpeedTestdb;
      if (auth == 1) {
        url = webIP;
      }
      if (auth == 5) {
        url = saveDataURL;
      }

      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          return_data = xhr.responseText.trim();
          if (auth == 2) {
            key = return_data;
          }
          if (auth == 1) {
            TestServerip = return_data;
          }
          if (auth == 3) {
            setTimeout(function() {
              location.href = showResult + return_data;
            }, 1500);
          }
          if (auth == 6) {
            openSpeedTestServerList = JSON.parse(return_data);
            launch = true;
            runTasks();
          }

        }
      };
      if (auth == 2) {
        logData = "r=n";
      }
      if (auth == 3) {
        logData = "r=l" + "&d=" + downloadSpeed + "&u=" + uploadSpeed + "&dd=" + dataUsedfordl / 1048576 + "&ud=" + dataUsedforul / 1048576 + "&p=" + pingEstimate + "&do=" + myhostName + "&S=" + key + "&sip=" + TestServerip + "&jit=" + jitterEstimate + "&ua=" + userAgentString;
      }
      if (auth == 5) {
        logData = saveTestData;
      }
      if (auth == 6) {
        logData = "r=s";
      }
      xhr.send(logData);
    };
  };
  OpenSpeedTest.Start = function() {
    new openSpeedtestEngine();
  };
  
  // Initialize charts immediately when script loads

  
  // Modern progress bar functionality (global scope)
var currentProgressDirection = 'download'; // Track current direction

function updateModernProgress(percentage, direction) {
  var progressFill = document.getElementById('modern-progress-fill');
  if (progressFill) {
    if (direction === 'download') {
      // Download: server to person (right to left)
      // For right-to-left, we need to position the fill from the right
      progressFill.style.width = percentage + '%';
      progressFill.style.marginLeft = 'auto';
      progressFill.style.marginRight = '0';
    } else {
      // Upload: person to server (left to right)
      // For left-to-right, we need to position the fill from the left
      progressFill.style.width = percentage + '%';
      progressFill.style.marginLeft = '0';
      progressFill.style.marginRight = 'auto';
    }
  }
}
  
  function updateModernStatus(status) {
  var progressStatus = document.getElementById('modern-progress-status');
  if (progressStatus) {
    progressStatus.textContent = status;
  }
}

function updateModernSpeed(speed) {
  var progressSpeed = document.getElementById('modern-progress-speed');
  if (progressSpeed) {
    progressSpeed.textContent = speed;
  }
}

function showModernError() {
  var errorContainer = document.getElementById('modern-error-container');
  if (errorContainer) {
    errorContainer.classList.add('show');
  }
}

function hideModernError() {
  var errorContainer = document.getElementById('modern-error-container');
  if (errorContainer) {
    errorContainer.classList.remove('show');
  }
}
  
  function resetModernProgress() {
  updateModernProgress(0, 'download');
  updateModernStatus('Ready');
  updateModernSpeed('--');
  hideModernError();
}
  
  // Try to initialize charts as soon as possible
  function tryInitializeCharts() {
    // Check if charts are already initialized
    if (downloadChart && uploadChart) {
      return;
    }
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
      setTimeout(tryInitializeCharts, 100);
      return;
    }
    
    // Check if canvas elements exist
    const downloadCtx = document.getElementById('download-chart');
    const uploadCtx = document.getElementById('upload-chart');
    
    if (!downloadCtx || !uploadCtx) {
      setTimeout(tryInitializeCharts, 100);
      return;
    }
    
    initializeCharts();
  }
  
  // Start trying to initialize charts
  tryInitializeCharts();
  
  // Also try on DOM ready and window load as fallbacks
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(tryInitializeCharts, 100);
  });
  
  window.addEventListener('load', function() {
    setTimeout(tryInitializeCharts, 100);
  });
})(window.OpenSpeedTest = window.OpenSpeedTest || {});

// Set up window.onload after all functions are defined
window.onload = function() {
  // Legacy SVG loading removed - custom gauge is already in place
  ostOnload();
  
  // Initialize thread configuration
  initThreadConfiguration();
  
  // Ensure thread count is set correctly before starting
  updateThreadCount();
  
  OpenSpeedTest.Start();
};
