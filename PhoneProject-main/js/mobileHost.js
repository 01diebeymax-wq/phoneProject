// Mobile Host Controls for Video Call with Host-Specific Features
// This script adds mobile-optimized controls with host management capabilities

(function() {
  'use strict';

  // Only initialize on mobile devices
  function isMobileDevice() {
    return window.innerWidth <= 768;
  }

  // Initialize mobile host controls
  function initMobileHostControls() {
    if (!isMobileDevice()) return;

    createMobileHostControlBar();
    createHostMoreMenu();
    createMobileHostMeetingInfo();
    setupHostEventListeners();
    observeHostParticipantCount();
    injectMobileHostReactionStyles();
  }

  // Inject mobile-specific host reaction styles
  function injectMobileHostReactionStyles() {
    const existingStyles = document.getElementById('mobile-host-reaction-styles');
    if (existingStyles) return;

    const style = document.createElement('style');
    style.id = 'mobile-host-reaction-styles';
    style.textContent = `
      /* Mobile Host Reaction Overlay */
      .host-reaction-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 50;
      }

      /* Mobile Host Reaction Animations */
      .host-reaction-animation {
        position: absolute;
        z-index: 20;
        pointer-events: none;
        opacity: 0;
        transform: scale(0);
        transition: all 0.3s ease;
      }

      .host-reaction-animation.animate {
        opacity: 1;
        transform: scale(1);
        animation: hostReactionFloat 3s ease-out forwards;
      }

      .host-reaction-emoji {
        font-size: 28px;
        text-align: center;
        margin-bottom: 4px;
      }

      .host-reaction-name {
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        text-align: center;
        white-space: nowrap;
      }

      /* Host-specific emoji picker positioning */
      .host-emoji-picker {
        bottom: 80px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
      }

      .host-emoji-picker.show {
        transform: translateX(-50%) translateY(0) !important;
      }

      /* Mobile host reaction button in more menu */
      .host-menu-item.reaction-active {
        background: rgba(251, 191, 36, 0.2);
        border: 2px solid #fbbf24;
      }

      @keyframes hostReactionFloat {
        0% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        100% {
          opacity: 0;
          transform: scale(1.2) translateY(-30px);
        }
      }

      /* Host hand raised indicator on mobile */
      .host-hand-raised-indicator {
        position: absolute;
        top: 8px;
        right: 8px;
        background: #fbbf24;
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 11px;
        z-index: 10;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 4px;
        font-weight: 600;
      }

      /* Host hand raised indicator on self-view container */
      .host-self-view-container .host-hand-raised-indicator {
        top: 6px;
        right: 6px;
        font-size: 10px;
        padding: 3px 6px;
        animation: hostPulseHandRaised 2s ease-in-out infinite;
      }

      @keyframes hostPulseHandRaised {
        0%, 100% {
          transform: scale(1);
          box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
        }
        50% {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.6);
        }
      }

      /* Mobile host emoji picker adjustments */
      @media (max-width: 768px) {
        .host-emoji-picker {
          width: 90%;
          max-width: 320px;
        }

        .host-emoji-picker-content {
          flex-wrap: wrap;
          justify-content: center;
        }

        .host-emoji-btn {
          font-size: 28px;
          padding: 10px;
          min-width: 48px;
          min-height: 48px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Create the mobile host control bar with 5 buttons
  function createMobileHostControlBar() {
    const existingBar = document.getElementById('mobile-host-controls-bar');
    if (existingBar) existingBar.remove();

    const controlBar = document.createElement('div');
    controlBar.className = 'mobile-host-controls-bar';
    controlBar.id = 'mobile-host-controls-bar';

    controlBar.innerHTML = `
      <!-- More Menu Button -->
      <button class="mobile-host-control-btn more-menu" id="mobile-host-more-btn" aria-label="More host options">
        <i class="fas fa-ellipsis-h"></i>
      </button>

      <!-- Camera Toggle -->
      <button class="mobile-host-control-btn active" id="mobile-host-camera-btn" aria-label="Toggle camera">
        <i class="fas fa-video"></i>
      </button>

      <!-- Microphone Toggle -->
      <button class="mobile-host-control-btn active" id="mobile-host-mic-btn" aria-label="Toggle microphone">
        <i class="fas fa-microphone"></i>
      </button>

      <!-- Participants Button -->
      <button class="mobile-host-control-btn host-participants" id="mobile-host-participants-btn" aria-label="Manage participants">
        <i class="fas fa-users"></i>
        <span class="mobile-host-participant-badge" id="mobile-host-participant-count">0</span>
      </button>

      <!-- End Call Button -->
      <button class="mobile-host-control-btn end-call" id="mobile-host-end-call-btn" aria-label="End meeting for all">
        <i class="fas fa-phone-slash"></i>
      </button>
    `;

    document.body.appendChild(controlBar);
  }

  // Create the host more menu panel with host-specific options
  function createHostMoreMenu() {
    const existingMenu = document.getElementById('host-more-menu-container');
    if (existingMenu) existingMenu.remove();

    const menuContainer = document.createElement('div');
    menuContainer.id = 'host-more-menu-container';

    menuContainer.innerHTML = `
      <!-- Overlay -->
      <div class="host-more-menu-overlay" id="host-more-menu-overlay"></div>

      <!-- Menu Panel -->
      <div class="host-more-menu-panel" id="host-more-menu-panel">
        <div class="host-menu-handle"></div>
        <h3 class="host-menu-title">Host Options</h3>
        <br>

        <div class="host-menu-items-grid">
       
          

          <!-- Mute All Participants -->
          <button class="host-menu-item host-action" id="host-menu-mute-all">
            <div class="host-menu-item-icon">
              <i class="fas fa-microphone-slash"></i>
            </div>
            <div class="host-menu-item-label">Mute All</div>
          </button>

          <!-- Lock/Unlock Meeting -->
          <button class="host-menu-item" id="host-menu-lock-meeting">
            <div class="host-menu-item-icon">
              <i class="fas fa-lock"></i>
            </div>
            <div class="host-menu-item-label">Lock Meeting</div>
          </button>

          <!-- Start/Stop Recording -->
          <button class="host-menu-item" id="host-menu-record">
            <div class="host-menu-item-icon" style="color: red;">
              <i class="fas fa-circle"></i>
            </div>
            <div class="host-menu-item-label">Start Recording</div>
          </button>

          <!-- Screen Share -->
          <button class="host-menu-item" id="host-menu-screen-share">
            <div class="host-menu-item-icon">
              <i class="fas fa-desktop"></i>
            </div>
            <div class="host-menu-item-label">Share Screen</div>
          </button>

          <!-- Raise Hand -->
          <button class="host-menu-item" id="host-menu-raise-hand">
            <div class="host-menu-item-icon">
              <i class="fas fa-hand-paper"></i>
            </div>
            <div class="host-menu-item-label">Raise Hand</div>
          </button>

          <!-- Chat -->
          <button class="host-menu-item" id="host-menu-chat">
            <div class="host-menu-item-icon">
              <i class="fas fa-comment"></i>
            </div>
            <div class="host-menu-item-label">Chat</div>
          </button>

          <!-- Share Files -->
          <button class="host-menu-item" id="host-menu-share-files" onclick="cvaultPopUpFileShare()">
            <div class="host-menu-item-icon">
              <i class="fas fa-file"></i>
            </div>
            <div class="host-menu-item-label">Share Files</div>
          </button>

          <!-- Settings -->
          <button class="host-menu-item" id="host-menu-settings">
            <div class="host-menu-item-icon">
              <i class="fas fa-cog"></i>
            </div>
            <div class="host-menu-item-label">Settings</div>
          </button>

          <!-- Notes -->
          <button class="host-menu-item" id="host-menu-notes">
            <div class="host-menu-item-icon">
              <i class="fas fa-sticky-note"></i>
            </div>
            <div class="host-menu-item-label">Notes</div>
          </button>

          <!-- End Meeting for All -->
          <button class="host-menu-item danger" id="host-menu-end-for-all">
            <div class="host-menu-item-icon">
              <i class="fas fa-ban"></i>
            </div>
            <div class="host-menu-item-label">End for All</div>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(menuContainer);
  }

  // Create mobile host meeting info header
  function createMobileHostMeetingInfo() {
    const existingInfo = document.getElementById('mobile-host-meeting-info');
    if (existingInfo) existingInfo.remove();

    const meetingInfo = document.createElement('div');
    meetingInfo.className = 'mobile-host-meeting-info';
    meetingInfo.id = 'mobile-host-meeting-info';
    meetingInfo.style.display = "none";

    const meetingTitle = document.getElementById('meetingTitle')?.textContent || 'Host Meeting';
    const meetingTime = document.getElementById('meetingTime')?.textContent || '';

    meetingInfo.innerHTML = `
      <div>
        <h3>${meetingTitle}<span class="host-badge">HOST</span></h3>
        <div class="host-connection-indicator">
          <div class="host-connection-dot"></div>
          <span>Connected</span>
        </div>
      </div>
      <div class="time">${meetingTime}</div>
    `;

    document.body.appendChild(meetingInfo);

    // Update time periodically
    setInterval(() => {
      const timeElement = document.querySelector('.mobile-host-meeting-info .time');
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      if (timeElement) timeElement.textContent = timeString;
    }, 60000);
  }

  // Setup all host event listeners
  function setupHostEventListeners() {
    // More menu toggle
    const moreBtn = document.getElementById('mobile-host-more-btn');
    const overlay = document.getElementById('host-more-menu-overlay');
    const panel = document.getElementById('host-more-menu-panel');

    if (moreBtn && overlay && panel) {
      moreBtn.addEventListener('click', () => toggleHostMoreMenu());
      overlay.addEventListener('click', () => closeHostMoreMenu());
    }

    // Camera toggle
    const cameraBtn = document.getElementById('mobile-host-camera-btn');
    const desktopCameraBtn = document.getElementById('cameraBtn');

    if (cameraBtn) {
      cameraBtn.addEventListener('click', () => {
        if (desktopCameraBtn) {
          desktopCameraBtn.click();
        }
        toggleHostButtonState(cameraBtn);
      });

      // Sync with desktop button
      if (desktopCameraBtn) {
        syncHostButtonState(desktopCameraBtn, cameraBtn, 'fa-video', 'fa-video-slash');
      }
    }

    // Microphone toggle
    const micBtn = document.getElementById('mobile-host-mic-btn');
    const desktopMicBtn = document.getElementById('micBtn');

    if (micBtn) {
      micBtn.addEventListener('click', () => {
        if (desktopMicBtn) {
          desktopMicBtn.click();
        }
        toggleHostButtonState(micBtn);
      });

      // Sync with desktop button
      if (desktopMicBtn) {
        syncHostButtonState(desktopMicBtn, micBtn, 'fa-microphone', 'fa-microphone-slash');
      }
    }

    // Participants toggle
    const participantsBtn = document.getElementById('mobile-host-participants-btn');
    const desktopParticipantsBtn = document.getElementById('memberToggleBtn');

    if (participantsBtn && desktopParticipantsBtn) {
      participantsBtn.addEventListener('click', () => {
        desktopParticipantsBtn.click();
        closeHostMoreMenu();
      });
    }

    // End call
    const endCallBtn = document.getElementById('mobile-host-end-call-btn');
    const desktopEndCallBtn = document.getElementById('endCallBtn');

    if (endCallBtn && desktopEndCallBtn) {
      endCallBtn.addEventListener('click', () => {
        desktopEndCallBtn.click();
      });
    }

    // Host-specific menu items
    setupHostMenuItem('host-menu-admit-all', null, handleAdmitAll);
    setupHostMenuItem('host-menu-mute-all', null, handleMuteAll);
    setupHostMenuItem('host-menu-lock-meeting', 'vortex-primary-activator-3k7s', handleLockMeeting);
    setupHostMenuItem('host-menu-record', 'startCaptureBtn', closeHostMoreMenu);
    setupHostMenuItem('host-menu-screen-share', 'screenShareBtn');
    setupHostMenuItem('host-menu-raise-hand', 'rm-raiseHandBtn', handleHostRaiseHand);
    setupHostMenuItem('host-menu-chat', 'chat-btn', toggleChat);
    setupHostMenuItem('host-menu-share-files', 'floating-share-btn', closeHostMoreMenu);
    setupHostMenuItem('host-menu-settings', 'settings-btn');
    setupHostMenuItem('host-menu-notes', 'notesBtn', () => handleToolClick('notes'));
    setupHostMenuItem('host-menu-end-for-all', null, handleEndForAll);

    // Monitor for reaction manager initialization
    monitorHostReactionManager();
  }

  // Host-specific action handlers
  function handleAdmitAll() {
    // Emit admit all event to server
    if (window.socket) {
      window.socket.emit('admit-all-participants');
      showHostNotification('Admitted all participants from waiting room', 'success');
    }
    closeHostMoreMenu();
  }

  function handleMuteAll() {
    // Emit mute all event to server
    if (window.socket) {
      window.socket.emit('mute-all-participants');
      showHostNotification('Muted all participants', 'info');
    }
    closeHostMoreMenu();
  }

  function handleLockMeeting() {
    const lockBtn = document.getElementById('host-menu-lock-meeting');
    const desktopLockBtn = document.getElementById('vortex-primary-activator-3k7s');
    
    if (desktopLockBtn) {
      desktopLockBtn.click();
    }
    
    // Toggle lock state visually
    const isLocked = lockBtn.querySelector('.host-menu-item-label').textContent === 'Lock Meeting';
    lockBtn.querySelector('.host-menu-item-label').textContent = isLocked ? 'Unlock Meeting' : 'Lock Meeting';
    lockBtn.querySelector('i').className = isLocked ? 'fas fa-unlock' : 'fas fa-lock';
    
    showHostNotification(isLocked ? 'Meeting locked' : 'Meeting unlocked', 'info');
    closeHostMoreMenu();
  }

  function handleHostRaiseHand() {
    const desktopRaiseHandBtn = document.getElementById('rm-raiseHandBtn');
    if (desktopRaiseHandBtn) {
      desktopRaiseHandBtn.click();
      closeHostMoreMenu();
    } else {
      console.warn('Mobile Host: Raise hand button not found');
      // Fallback to legacy function
      if (typeof window.toggleHandRaise === 'function') {
        window.toggleHandRaise();
        closeHostMoreMenu();
      }
    }
  }

  function handleEndForAll() {
    if (confirm('Are you sure you want to end the meeting for everyone?')) {
      const desktopEndCallBtn = document.getElementById('endCallBtn');
      if (desktopEndCallBtn) {
        desktopEndCallBtn.click();
      }
    }
    closeHostMoreMenu();
  }

  // Monitor for ReactionManager and sync states
  function monitorHostReactionManager() {
    let checkCount = 0;
    const maxChecks = 20;

    const checkInterval = setInterval(() => {
      checkCount++;

      if (window.reactionManager || (window.hostMeetingInstance && window.hostMeetingInstance.reactionManager)) {
        clearInterval(checkInterval);
        console.log('Mobile Host: ReactionManager detected, syncing states');
        syncHostReactionStates();
      } else if (checkCount >= maxChecks) {
        clearInterval(checkInterval);
        console.warn('Mobile Host: ReactionManager not found after', maxChecks, 'attempts');
      }
    }, 500);
  }

  // Sync host reaction button states with desktop
  function syncHostReactionStates() {
    const reactionManager = window.reactionManager || window.hostMeetingInstance?.reactionManager;
    if (!reactionManager) return;

    // Monitor raise hand state
    const desktopRaiseHandBtn = document.getElementById('rm-raiseHandBtn');
    const menuRaiseHandBtn = document.getElementById('host-menu-raise-hand');

    if (desktopRaiseHandBtn && menuRaiseHandBtn) {
      const observer = new MutationObserver(() => {
        const isActive = desktopRaiseHandBtn.getAttribute('data-active') === 'true';
        if (isActive) {
          menuRaiseHandBtn.classList.add('reaction-active');
          menuRaiseHandBtn.querySelector('.host-menu-item-label').textContent = 'Lower Hand';
        } else {
          menuRaiseHandBtn.classList.remove('reaction-active');
          menuRaiseHandBtn.querySelector('.host-menu-item-label').textContent = 'Raise Hand';
        }
      });

      observer.observe(desktopRaiseHandBtn, {
        attributes: true,
        attributeFilter: ['data-active']
      });

      // Initial sync
      const isActive = desktopRaiseHandBtn.getAttribute('data-active') === 'true';
      if (isActive) {
        menuRaiseHandBtn.classList.add('reaction-active');
        menuRaiseHandBtn.querySelector('.host-menu-item-label').textContent = 'Lower Hand';
      }
    }
  }

  // Setup individual host menu item
  function setupHostMenuItem(menuItemId, desktopBtnId, callback) {
    const menuItem = document.getElementById(menuItemId);

    if (menuItem) {
      menuItem.addEventListener('click', () => {
        if (callback) {
          callback();
        } else if (desktopBtnId) {
          const desktopBtn = document.getElementById(desktopBtnId);
          if (desktopBtn) {
            desktopBtn.click();
          }
          closeHostMoreMenu();
        }
      });
    }
  }

  // Toggle host more menu
  function toggleHostMoreMenu() {
    const overlay = document.getElementById('host-more-menu-overlay');
    const panel = document.getElementById('host-more-menu-panel');
    const moreBtn = document.getElementById('mobile-host-more-btn');

    if (overlay && panel && moreBtn) {
      const isActive = overlay.classList.contains('active');

      if (isActive) {
        closeHostMoreMenu();
      } else {
        overlay.classList.add('active');
        panel.classList.add('active');
        moreBtn.classList.add('active');
      }
    }
  }

  // Close host more menu
  function closeHostMoreMenu() {
    const overlay = document.getElementById('host-more-menu-overlay');
    const panel = document.getElementById('host-more-menu-panel');
    const moreBtn = document.getElementById('mobile-host-more-btn');

    if (overlay && panel && moreBtn) {
      overlay.classList.remove('active');
      panel.classList.remove('active');
      moreBtn.classList.remove('active');
    }
  }

  // Toggle host button state (active/inactive)
  function toggleHostButtonState(button) {
    if (button.classList.contains('active')) {
      button.classList.remove('active');
      button.classList.add('inactive');
    } else {
      button.classList.remove('inactive');
      button.classList.add('active');
    }
  }

  // Sync mobile host button with desktop button state
  function syncHostButtonState(desktopBtn, mobileBtn, iconOn, iconOff) {
    const observer = new MutationObserver(() => {
      const isActive = desktopBtn.getAttribute('data-active') === 'true';
      const icon = mobileBtn.querySelector('i');

      if (isActive) {
        mobileBtn.classList.remove('inactive');
        mobileBtn.classList.add('active');
        if (icon) icon.className = `fas ${iconOn}`;
      } else {
        mobileBtn.classList.remove('active');
        mobileBtn.classList.add('inactive');
        if (icon) icon.className = `fas ${iconOff}`;
      }
    });

    observer.observe(desktopBtn, {
      attributes: true,
      attributeFilter: ['data-active']
    });

    // Initial sync
    const isActive = desktopBtn.getAttribute('data-active') === 'true';
    const icon = mobileBtn.querySelector('i');

    if (isActive) {
      mobileBtn.classList.add('active');
      if (icon) icon.className = `fas ${iconOn}`;
    } else {
      mobileBtn.classList.add('inactive');
      if (icon) icon.className = `fas ${iconOff}`;
    }
  }

  // Observe host participant count changes
  function observeHostParticipantCount() {
    const desktopCount = document.getElementById('participantCount');
    const mobileCount = document.getElementById('mobile-host-participant-count');

    if (desktopCount && mobileCount) {
      const observer = new MutationObserver(() => {
        mobileCount.textContent = desktopCount.textContent;
      });

      observer.observe(desktopCount, {
        childList: true,
        characterData: true,
        subtree: true
      });

      // Initial sync
      mobileCount.textContent = desktopCount.textContent;
    }
  }

  // Show host notification
  function showHostNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'host-notification-badge show';
    notification.innerHTML = `<i class="fas fa-crown"></i> ${message}`;
    
    // Set color based on type
    if (type === 'success') {
      notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    } else if (type === 'error') {
      notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    } else {
      notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
    }

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (isMobileDevice() && !document.getElementById('mobile-host-controls-bar')) {
        initMobileHostControls();
      } else if (!isMobileDevice()) {
        const mobileBar = document.getElementById('mobile-host-controls-bar');
        const menuContainer = document.getElementById('host-more-menu-container');
        const meetingInfo = document.getElementById('mobile-host-meeting-info');

        if (mobileBar) mobileBar.remove();
        if (menuContainer) menuContainer.remove();
        if (meetingInfo) meetingInfo.remove();
      }
    }, 250);
  });

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileHostControls);
  } else {
    // DOM is already loaded
    setTimeout(initMobileHostControls, 500);
  }
})();

// Mobile Host Meeting Enhancements - Enhanced WhatsApp-style Video Call for Host
class MobileHostMeetingEnhancer {
  constructor() {
    this.isMobile = this.detectMobile();
    this.selfViewPosition = 'top-right';
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.dragStartLeft = 0;
    this.dragStartTop = 0;
    this.hostSelfViewContainer = null;
    this.hostToolsPanel = null;
    this.hostStatusIndicators = [];

    if (this.isMobile) {
      this.init();
    }
  }

  detectMobile() {
    return window.innerWidth <= 768 ||
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  init() {
    console.log('Initializing mobile host meeting enhancements...');

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }

    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.adjustLayout(), 300);
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.adjustLayout(), 250);
    });
  }

  setup() {
    this.createMobileHostSelfView();
    this.enhanceHostToolsPanel();
    this.setupHostMainVideoView();
    this.addHostConnectionIndicator();
    this.observeHostParticipantChanges();
    this.createHostStatusIndicators();

    this.checkInterval = setInterval(() => {
      if (!this.hostSelfViewContainer || !document.body.contains(this.hostSelfViewContainer)) {
        this.createMobileHostSelfView();
      } else {
        this.applyMobileHostParticipantClasses();
      }
    }, 2000);
  }

  createHostStatusIndicators() {
    const statusContainer = document.createElement('div');
    statusContainer.className = 'host-status-indicators';
    statusContainer.id = 'host-status-indicators';
    document.body.appendChild(statusContainer);

    // Recording indicator
    const recordingIndicator = document.createElement('div');
    recordingIndicator.className = 'host-status-indicator recording';
    recordingIndicator.id = 'host-recording-indicator';
    recordingIndicator.innerHTML = '<i class="fas fa-circle"></i> Recording';
    recordingIndicator.style.display = 'none';
    statusContainer.appendChild(recordingIndicator);

    // Waiting room indicator
    const waitingRoomIndicator = document.createElement('div');
    waitingRoomIndicator.className = 'host-status-indicator waiting-room';
    waitingRoomIndicator.id = 'host-waiting-room-indicator';
    waitingRoomIndicator.innerHTML = '<i class="fas fa-clock"></i> Waiting Room';
    waitingRoomIndicator.style.display = 'none';
    statusContainer.appendChild(waitingRoomIndicator);

    // Locked indicator
    const lockedIndicator = document.createElement('div');
    lockedIndicator.className = 'host-status-indicator locked';
    lockedIndicator.id = 'host-locked-indicator';
    lockedIndicator.innerHTML = '<i class="fas fa-lock"></i> Meeting Locked';
    lockedIndicator.style.display = 'none';
    statusContainer.appendChild(lockedIndicator);
  }

  observeHostParticipantChanges() {
    const secondarySection = document.getElementById('secondaryVideosSection');
    if (!secondarySection) {
      setTimeout(() => this.observeHostParticipantChanges(), 1000);
      return;
    }

    const observer = new MutationObserver(() => {
      this.applyMobileHostParticipantClasses();
    });

    observer.observe(secondarySection, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style']
    });

    console.log('Mobile host participant observer initialized');
  }

  createMobileHostSelfView() {
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    let localVideoWrapper = null;

    videoWrappers.forEach(wrapper => {
      const socketId = wrapper.dataset.socketId;
      if (window.socket && socketId === window.socket.id) {
        localVideoWrapper = wrapper;
      }
    });

    if (!localVideoWrapper) {
      return;
    }

    if (!this.hostSelfViewContainer || !document.body.contains(this.hostSelfViewContainer)) {
      this.hostSelfViewContainer = document.createElement('div');
      const savedPosition = localStorage.getItem('hostSelfViewPosition') || this.selfViewPosition;
      this.selfViewPosition = savedPosition;
      this.hostSelfViewContainer.className = `host-self-view-container position-${this.selfViewPosition}`;
      document.body.appendChild(this.hostSelfViewContainer);
    }

    const videoFrame = localVideoWrapper.querySelector('.video-frame');
    const participantName = localVideoWrapper.querySelector('.participant-name');

    if (videoFrame) {
      const selfVideo = document.createElement('video');
      selfVideo.className = 'video-frame';
      selfVideo.autoplay = true;
      selfVideo.muted = true;
      selfVideo.playsinline = true;
      selfVideo.srcObject = videoFrame.srcObject;

      this.hostSelfViewContainer.innerHTML = '';
      this.hostSelfViewContainer.appendChild(selfVideo);

      if (participantName) {
        const nameClone = participantName.cloneNode(true);
        this.hostSelfViewContainer.appendChild(nameClone);
      }

      // Add host hand raised indicator container
      const handIndicator = document.createElement('div');
      handIndicator.className = 'host-hand-raised-indicator';
      handIndicator.id = 'mobile-host-self-hand-indicator';
      handIndicator.innerHTML = '<i class="fas fa-hand-paper"></i> Hand Raised';
      handIndicator.style.display = 'none';
      this.hostSelfViewContainer.appendChild(handIndicator);

      const updateStream = () => {
        if (videoFrame.srcObject && selfVideo.srcObject !== videoFrame.srcObject) {
          selfVideo.srcObject = videoFrame.srcObject;
        }
      };

      this.streamMonitor = setInterval(updateStream, 1000);

      // Monitor for host hand raise state changes
      this.monitorHostHandRaiseState();

      if (localVideoWrapper.parentElement &&
          localVideoWrapper.parentElement.classList.contains('secondary-videos-section')) {
        localVideoWrapper.style.display = 'none';
      }
    }

    this.setupHostDragFunctionality();
    this.applyMobileHostParticipantClasses();
  }

  monitorHostHandRaiseState() {
    // Check for host hand raise state periodically
    const checkHandRaise = () => {
      const desktopRaiseHandBtn = document.getElementById('rm-raiseHandBtn');
      const selfHandIndicator = document.getElementById('mobile-host-self-hand-indicator');
      
      if (desktopRaiseHandBtn && selfHandIndicator) {
        const isRaised = desktopRaiseHandBtn.getAttribute('data-active') === 'true';
        selfHandIndicator.style.display = isRaised ? 'block' : 'none';
      }
    };

    // Check immediately and then periodically
    checkHandRaise();
    this.handRaiseMonitor = setInterval(checkHandRaise, 500);

    // Also set up mutation observer for immediate updates
    const desktopRaiseHandBtn = document.getElementById('rm-raiseHandBtn');
    if (desktopRaiseHandBtn) {
      const observer = new MutationObserver(() => {
        checkHandRaise();
      });

      observer.observe(desktopRaiseHandBtn, {
        attributes: true,
        attributeFilter: ['data-active']
      });
    }
  }

  setupHostDragFunctionality() {
    if (!this.hostSelfViewContainer) return;

    this.hostSelfViewContainer.addEventListener('touchstart', (e) => this.handleHostDragStart(e), { passive: false });
    this.hostSelfViewContainer.addEventListener('touchmove', (e) => this.handleHostDragMove(e), { passive: false });
    this.hostSelfViewContainer.addEventListener('touchend', (e) => this.handleHostDragEnd(e), { passive: false });

    this.hostSelfViewContainer.addEventListener('mousedown', (e) => this.handleHostDragStart(e));
    document.addEventListener('mousemove', (e) => this.handleHostDragMove(e));
    document.addEventListener('mouseup', (e) => this.handleHostDragEnd(e));
  }

  handleHostDragStart(e) {
    if (!this.hostSelfViewContainer) return;

    this.isDragging = true;
    this.hostSelfViewContainer.classList.add('dragging');

    const touch = e.touches ? e.touches[0] : e;
    this.dragStartX = touch.clientX;
    this.dragStartY = touch.clientY;

    const rect = this.hostSelfViewContainer.getBoundingClientRect();
    this.dragStartLeft = rect.left;
    this.dragStartTop = rect.top;

    this.hostSelfViewContainer.classList.remove(
      'position-top-right',
      'position-top-left',
      'position-bottom-right',
      'position-bottom-left'
    );

    this.hostSelfViewContainer.style.left = `${rect.left}px`;
    this.hostSelfViewContainer.style.top = `${rect.top}px`;
    this.hostSelfViewContainer.style.right = 'auto';
    this.hostSelfViewContainer.style.bottom = 'auto';

    e.preventDefault();
    e.stopPropagation();
  }

  handleHostDragMove(e) {
    if (!this.isDragging || !this.hostSelfViewContainer) return;

    const touch = e.touches ? e.touches[0] : e;
    const deltaX = touch.clientX - this.dragStartX;
    const deltaY = touch.clientY - this.dragStartY;

    let newLeft = this.dragStartLeft + deltaX;
    let newTop = this.dragStartTop + deltaY;

    const rect = this.hostSelfViewContainer.getBoundingClientRect();
    const maxLeft = window.innerWidth - rect.width - 8;
    const maxTop = window.innerHeight - rect.height - 100;

    newLeft = Math.max(8, Math.min(newLeft, maxLeft));
    newTop = Math.max(60, Math.min(newTop, maxTop));

    this.hostSelfViewContainer.style.left = `${newLeft}px`;
    this.hostSelfViewContainer.style.top = `${newTop}px`;

    e.preventDefault();
    e.stopPropagation();
  }

  handleHostDragEnd(e) {
    if (!this.isDragging || !this.hostSelfViewContainer) return;

    this.isDragging = false;
    this.hostSelfViewContainer.classList.remove('dragging');

    this.snapHostToCorner();

    e.preventDefault();
    e.stopPropagation();
  }

  snapHostToCorner() {
    if (!this.hostSelfViewContainer) return;

    const rect = this.hostSelfViewContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const isLeft = centerX < window.innerWidth / 2;
    const isTop = centerY < window.innerHeight / 2;

    let position;
    if (isTop && isLeft) {
      position = 'top-left';
    } else if (isTop && !isLeft) {
      position = 'top-right';
    } else if (!isTop && isLeft) {
      position = 'bottom-left';
    } else {
      position = 'bottom-right';
    }

    this.selfViewPosition = position;

    this.hostSelfViewContainer.style.left = '';
    this.hostSelfViewContainer.style.top = '';
    this.hostSelfViewContainer.style.right = '';
    this.hostSelfViewContainer.style.bottom = '';

    this.hostSelfViewContainer.classList.remove(
      'position-top-right',
      'position-top-left',
      'position-bottom-right',
      'position-bottom-left'
    );
    this.hostSelfViewContainer.classList.add(`position-${position}`);

    localStorage.setItem('hostSelfViewPosition', position);
  }

  applyMobileHostParticipantClasses() {
    if (!this.isMobile) return;

    const secondarySection = document.getElementById('secondaryVideosSection');
    if (!secondarySection) return;

    // Count visible participants excluding self-view
    const visibleWrappers = Array.from(document.querySelectorAll('.secondary-videos-section .video-wrapper'))
      .filter(wrapper => {
        // Exclude hidden wrappers
        if (wrapper.style.display === 'none') return false;

        // Exclude self-view (local video)
        const socketId = wrapper.dataset.socketId;
        if (window.socket && socketId === window.socket.id) return false;

        return true;
      });

    const participantCount = visibleWrappers.length;

    // Remove all previous mobile host participant classes
    secondarySection.classList.remove(
      'mobile-host-participants-1',
      'mobile-host-participants-2',
      'mobile-host-participants-3',
      'mobile-host-participants-4',
      'mobile-host-participants-5',
      'mobile-host-participants-6',
      'mobile-host-participants-7',
      'mobile-host-participants-8',
      'mobile-host-participants-9',
      'mobile-host-participants-10',
      'mobile-host-participants-11',
      'mobile-host-participants-12',
      'mobile-host-participants-13',
      'mobile-host-participants-14',
      'mobile-host-participants-15'
    );

    // Apply the appropriate class based on participant count
    if (participantCount >= 1 && participantCount <= 15) {
      secondarySection.classList.add(`mobile-host-participants-${participantCount}`);
      console.log(`Applied mobile host layout for ${participantCount} participants`);
    } else if (participantCount > 15) {
      // For more than 15, use a scrollable grid
      secondarySection.classList.add('mobile-host-participants-15');
      console.log(`Applied mobile host layout for ${participantCount} participants (max 15 layout)`);
    }
  }

  enhanceHostToolsPanel() {
    const toolsPanel = document.getElementById('dimension-tools-overlay-4h9w');
    if (!toolsPanel) return;

    this.hostToolsPanel = toolsPanel;

    const header = toolsPanel.querySelector('.eclipse-header-9m2x');
    if (header && !header.querySelector('.popup-handle')) {
      const handle = document.createElement('div');
      handle.className = 'popup-handle';
      header.insertBefore(handle, header.firstChild);
    }

    let startY = 0;
    let currentY = 0;

    header?.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
    }, { passive: true });

    header?.addEventListener('touchmove', (e) => {
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      if (deltaY > 0 && toolsPanel.classList.contains('active')) {
        toolsPanel.style.transform = `translateY(${deltaY}px)`;
      }
    }, { passive: true });

    header?.addEventListener('touchend', () => {
      const deltaY = currentY - startY;

      if (deltaY > 100) {
        toolsPanel.classList.remove('active');
      }

      toolsPanel.style.transform = '';
      startY = 0;
      currentY = 0;
    }, { passive: true });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isActive = toolsPanel.classList.contains('active');
          if (isActive) {
            this.onHostToolsPanelOpen();
          }
        }
      });
    });

    observer.observe(toolsPanel, { attributes: true });
  }

  onHostToolsPanelOpen() {
    const grid = document.querySelector('.prism-tool-grid-4j8m');
    if (grid) {
      grid.scrollTop = 0;
    }
  }

  setupHostMainVideoView() {
    const updateMainVideo = () => {
      const mainSection = document.getElementById('mainVideoSection');
      const secondarySection = document.getElementById('secondaryVideosSection');

      if (!mainSection || !secondarySection) return;

      const videoWrappers = document.querySelectorAll('.video-wrapper');
      if (videoWrappers.length === 0) return;

      let remoteWrapper = null;
      videoWrappers.forEach(wrapper => {
        const socketId = wrapper.dataset.socketId;
        if (window.socket && socketId !== window.socket.id) {
          if (!remoteWrapper) {
            remoteWrapper = wrapper;
          }
        }
      });

      if (remoteWrapper && !mainSection.contains(remoteWrapper)) {
        mainSection.innerHTML = '';
        const clone = remoteWrapper.cloneNode(true);

        const originalVideo = remoteWrapper.querySelector('.video-frame');
        const clonedVideo = clone.querySelector('.video-frame');
        if (originalVideo && clonedVideo) {
          clonedVideo.srcObject = originalVideo.srcObject;
        }

        mainSection.appendChild(clone);
      }
    };

    setInterval(updateMainVideo, 2000);
    updateMainVideo();
  }

  addHostConnectionIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'host-connection-quality';
    indicator.innerHTML = '<i class="fas fa-wifi"></i> <span>Host Connection: Good</span>';
    document.body.appendChild(indicator);

    this.hostConnectionIndicator = indicator;

    if (window.socket) {
      window.socket.on('ping', () => {
        this.showHostConnectionStatus('good');
      });

      window.socket.on('disconnect', () => {
        this.showHostConnectionStatus('poor');
      });
    }
  }

  showHostConnectionStatus(status) {
    if (!this.hostConnectionIndicator) return;

    this.hostConnectionIndicator.classList.remove('good', 'poor');
    this.hostConnectionIndicator.classList.add(status);
    this.hostConnectionIndicator.classList.add('show');

    const text = this.hostConnectionIndicator.querySelector('span');
    if (text) {
      text.textContent = status === 'good' ? 'Host Connection: Good' : 'Host Connection: Poor';
    }

    setTimeout(() => {
      this.hostConnectionIndicator.classList.remove('show');
    }, 3000);
  }

  adjustLayout() {
    if (this.hostSelfViewContainer) {
      this.snapHostToCorner();
    }
  }

  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    if (this.streamMonitor) {
      clearInterval(this.streamMonitor);
    }
    if (this.handRaiseMonitor) {
      clearInterval(this.handRaiseMonitor);
    }
    if (this.hostSelfViewContainer) {
      this.hostSelfViewContainer.remove();
    }
    if (this.hostConnectionIndicator) {
      this.hostConnectionIndicator.remove();
    }
  }
}

// Auto-initialize when ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.mobileHostMeetingEnhancer = new MobileHostMeetingEnhancer();
  });
} else {
  window.mobileHostMeetingEnhancer = new MobileHostMeetingEnhancer();
}

// Export for manual control
window.MobileHostMeetingEnhancer = MobileHostMeetingEnhancer;