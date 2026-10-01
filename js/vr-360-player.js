/**
 * RDVS STUDIOS — Interactive 360° Spherical Media Player
 * Supports 360° equirectangular video and photography with full look-around controls:
 * - Mouse drag / touch swipe (yaw & pitch) with inertia/damping
 * - Mouse wheel / pinch-to-zoom (FOV adjustment)
 * - Minimalist on-screen D-pad compass controls (Look Up, Down, Left, Right, Center Reset)
 * - Zoom in / Zoom out buttons
 * - Subtle auto-rotation drift when idle
 * - Pure high-performance WebGL, zero external dependencies
 */

class VR360Viewer {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) {
      throw new Error('[VR360] Container element not found');
    }

    this.options = Object.assign({
      src: '',
      videoElement: null,
      poster: '',
      isVideo: true,
      autoplay: false,
      muted: true,
      loop: false,
      defaultFov: 75,
      minFov: 40,
      maxFov: 100,
      autoRotate: false,
      autoRotateSpeed: 0.05,
      showControls: true,
      showDpad: true,
      showZoom: true,
      showBadge: true,
      showDragHint: true,
      onTimeUpdate: null,
      onEnded: null,
      onVolumeChange: null
    }, options);

    // Camera state
    this.yaw = 0;         // Horizontal rotation in degrees
    this.pitch = 0;       // Vertical rotation in degrees (-85 to 85)
    this.fov = this.options.defaultFov;
    this.targetYaw = 0;
    this.targetPitch = 0;
    this.targetFov = this.options.defaultFov;

    // Interaction state
    this.isDragging = false;
    this.pointerStartX = 0;
    this.pointerStartY = 0;
    this.startYaw = 0;
    this.startPitch = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.lastPointerTime = 0;
    this.pinchStartDist = 0;
    this.pinchStartFov = this.fov;
    this.hasInteracted = false;
    this.activeKeyHeld = null;
    this.keyInterval = null;

    // Rendering & animation
    this.gl = null;
    this.canvas = null;
    this.program = null;
    this.texture = null;
    this.animId = null;
    this.isRunning = false;
    this.video = null;
    this.image = null;
    this.isReady = false;

    this.init();
  }

  init() {
    this.setupDOM();
    this.initWebGL();
    this.setupMedia();
    this.setupEvents();
    this.start();
  }

  setupDOM() {
    this.container.classList.add('vr-360-container');

    // Create WebGL canvas
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'vr-360-canvas';
    this.canvas.setAttribute('aria-label', 'Interactive 360 panoramic viewer');
    this.container.appendChild(this.canvas);

    if (this.options.showControls) {
      this.createControls();
    }
  }

  createControls() {
    const overlay = document.createElement('div');
    overlay.className = 'vr-360-overlay';

    // 1. 360 Panoramic Badge
    if (this.options.showBadge) {
      const badge = document.createElement('div');
      badge.className = 'vr-360-badge';
      badge.innerHTML = `
        <svg class="vr-badge-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8">
          <circle cx="12" cy="12" r="9"/>
          <path d="M3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>
        </svg>
        <span>360° ${this.options.isVideo ? 'Video' : 'View'}</span>
      `;
      overlay.appendChild(badge);
    }

    // 2. Center Drag Hint
    if (this.options.showDragHint) {
      this.dragHint = document.createElement('div');
      this.dragHint.className = 'vr-drag-hint';
      this.dragHint.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6">
          <path d="M12 2v20M2 12h20M7 7l-5 5 5 5M17 7l5 5-5 5M7 7l5-5 5 5M7 17l5 5 5-5"/>
        </svg>
        <span>Drag to look around</span>
      `;
      overlay.appendChild(this.dragHint);

      // Auto-hide hint after 4 seconds
      setTimeout(() => this.dismissHint(), 4000);
    }

    // 3. Look-Around Directional D-Pad (Compass Widget)
    if (this.options.showDpad) {
      const dpad = document.createElement('div');
      dpad.className = 'vr-look-controls';
      dpad.setAttribute('role', 'group');
      dpad.setAttribute('aria-label', 'Look around 360');

      dpad.innerHTML = `
        <button type="button" class="vr-btn vr-btn-up" data-dir="up" title="Look Up" aria-label="Look Up">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
        <div class="vr-btn-row">
          <button type="button" class="vr-btn vr-btn-left" data-dir="left" title="Look Left" aria-label="Look Left">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button type="button" class="vr-btn vr-btn-center" data-dir="center" title="Reset View" aria-label="Reset View">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <circle cx="12" cy="12" r="8" stroke-dasharray="2 3"></circle>
            </svg>
          </button>
          <button type="button" class="vr-btn vr-btn-right" data-dir="right" title="Look Right" aria-label="Look Right">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        <button type="button" class="vr-btn vr-btn-down" data-dir="down" title="Look Down" aria-label="Look Down">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      `;

      // Bind button hold and clicks
      dpad.querySelectorAll('.vr-btn').forEach(btn => {
        const dir = btn.getAttribute('data-dir');
        const startAction = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.dismissHint();
          if (dir === 'center') {
            this.resetView();
          } else {
            this.panDirection(dir, 15);
            this.startHoldingDirection(dir);
          }
        };

        const stopAction = (e) => {
          e.preventDefault();
          this.stopHoldingDirection();
        };

        btn.addEventListener('pointerdown', startAction);
        btn.addEventListener('pointerup', stopAction);
        btn.addEventListener('pointerleave', stopAction);
        btn.addEventListener('pointercancel', stopAction);
      });

      overlay.appendChild(dpad);
    }

    // 4. Zoom Controls & Fullscreen
    const secondaryControls = document.createElement('div');
    secondaryControls.className = 'vr-secondary-controls';

    if (this.options.showZoom) {
      const zoomGroup = document.createElement('div');
      zoomGroup.className = 'vr-zoom-group';
      zoomGroup.innerHTML = `
        <button type="button" class="vr-btn vr-btn-zoom-in" title="Zoom In" aria-label="Zoom In">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button type="button" class="vr-btn vr-btn-zoom-out" title="Zoom Out" aria-label="Zoom Out">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      `;

      zoomGroup.querySelector('.vr-btn-zoom-in').addEventListener('click', (e) => {
        e.stopPropagation();
        this.zoomBy(-10);
      });
      zoomGroup.querySelector('.vr-btn-zoom-out').addEventListener('click', (e) => {
        e.stopPropagation();
        this.zoomBy(10);
      });

      secondaryControls.appendChild(zoomGroup);
    }

    // Fullscreen button
    const fsBtn = document.createElement('button');
    fsBtn.type = 'button';
    fsBtn.className = 'vr-btn vr-btn-fullscreen';
    fsBtn.title = 'Toggle Fullscreen';
    fsBtn.setAttribute('aria-label', 'Toggle Fullscreen');
    fsBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
      </svg>
    `;
    fsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleFullscreen();
    });
    secondaryControls.appendChild(fsBtn);

    overlay.appendChild(secondaryControls);
    this.container.appendChild(overlay);
  }

  dismissHint() {
    if (this.dragHint && !this.hasInteracted) {
      this.hasInteracted = true;
      this.dragHint.classList.add('dismissed');
      setTimeout(() => {
        if (this.dragHint && this.dragHint.parentNode) {
          this.dragHint.parentNode.removeChild(this.dragHint);
          this.dragHint = null;
        }
      }, 600);
    }
  }

  panDirection(dir, amount = 12) {
    this.dismissHint();
    if (dir === 'up') this.targetPitch = Math.min(85, this.targetPitch + amount);
    if (dir === 'down') this.targetPitch = Math.max(-85, this.targetPitch - amount);
    if (dir === 'left') this.targetYaw -= amount;
    if (dir === 'right') this.targetYaw += amount;
  }

  startHoldingDirection(dir) {
    this.stopHoldingDirection();
    this.keyInterval = setInterval(() => {
      this.panDirection(dir, 3.5);
    }, 30);
  }

  stopHoldingDirection() {
    if (this.keyInterval) {
      clearInterval(this.keyInterval);
      this.keyInterval = null;
    }
  }

  zoomBy(delta) {
    this.dismissHint();
    this.targetFov = Math.max(this.options.minFov, Math.min(this.options.maxFov, this.targetFov + delta));
  }

  resetView() {
    this.dismissHint();
    this.targetYaw = 0;
    this.targetPitch = 0;
    this.targetFov = this.options.defaultFov;
    this.velocityX = 0;
    this.velocityY = 0;
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (this.container.requestFullscreen) {
        this.container.requestFullscreen();
      } else if (this.container.webkitRequestFullscreen) {
        this.container.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  initWebGL() {
    const gl = this.canvas.getContext('webgl', { alpha: false, antialias: true }) ||
               this.canvas.getContext('experimental-webgl', { alpha: false, antialias: true });
    if (!gl) {
      console.warn('[VR360] WebGL not supported, falling back to 2D canvas/video');
      return;
    }
    this.gl = gl;

    // Shaders
    const vsSource = `
      attribute vec3 a_position;
      attribute vec2 a_texCoord;
      uniform mat4 u_matrix;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_texCoord;
        gl_Position = u_matrix * vec4(a_position, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec2 v_texCoord;
      uniform sampler2D u_texture;
      void main() {
        gl_FragColor = texture2D(u_texture, v_texCoord);
      }
    `;

    const compileShader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('[VR360] Shader compile error:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[VR360] Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    this.program = program;

    // Build Inverted UV Sphere (Inside-Out)
    const { positions, texCoords, indices } = this.createSphereGeometry(100, 64, 32);

    // Position Buffer
    this.posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // TexCoord Buffer
    this.texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

    // Index Buffer
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    this.indexCount = indices.length;

    // Shader attribute / uniform locations
    this.aPosition = gl.getAttribLocation(program, 'a_position');
    this.aTexCoord = gl.getAttribLocation(program, 'a_texCoord');
    this.uMatrix = gl.getUniformLocation(program, 'u_matrix');
    this.uTexture = gl.getUniformLocation(program, 'u_texture');

    // Create Texture
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    // Placeholder 1x1 black pixel until video / image ready
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([10, 10, 10, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
  }

  createSphereGeometry(radius, lonSegments, latSegments) {
    const positions = [];
    const texCoords = [];
    const indices = [];

    for (let lat = 0; lat <= latSegments; lat++) {
      const theta = (lat * Math.PI) / latSegments;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= lonSegments; lon++) {
        const phi = (lon * 2 * Math.PI) / lonSegments;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        // Invert X so the camera inside the sphere views correct unmirrored imagery
        const x = -radius * sinTheta * cosPhi;
        const y = radius * cosTheta;
        const z = radius * sinTheta * sinPhi;

        positions.push(x, y, z);
        texCoords.push(lon / lonSegments, lat / latSegments);
      }
    }

    for (let lat = 0; lat < latSegments; lat++) {
      for (let lon = 0; lon < lonSegments; lon++) {
        const first = lat * (lonSegments + 1) + lon;
        const second = first + lonSegments + 1;

        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }

    return { positions, texCoords, indices };
  }

  setupMedia() {
    if (this.options.isVideo) {
      if (this.options.videoElement) {
        this.video = this.options.videoElement;
      } else {
        this.video = document.createElement('video');
        this.video.src = this.options.src;
        this.video.poster = this.options.poster || '';
        this.video.muted = this.options.muted;
        this.video.autoplay = this.options.autoplay;
        this.video.loop = this.options.loop;
        this.video.playsInline = true;
        this.video.setAttribute('playsinline', '');
        this.video.preload = 'auto';
      }

      // Hide default video element visually, but keep in DOM for playback events
      this.video.style.display = 'none';
      if (!this.video.parentNode) {
        this.container.appendChild(this.video);
      }

      this.video.addEventListener('canplay', () => {
        this.isReady = true;
      });

      this.video.addEventListener('timeupdate', () => {
        if (this.options.onTimeUpdate) this.options.onTimeUpdate(this.video);
      });

      this.video.addEventListener('ended', () => {
        if (this.options.onEnded) this.options.onEnded(this.video);
      });

      this.video.addEventListener('volumechange', () => {
        if (this.options.onVolumeChange) this.options.onVolumeChange(this.video);
      });
    } else {
      // 360 Image Mode
      this.image = new Image();
      this.image.crossOrigin = 'anonymous';
      this.image.onload = () => {
        this.isReady = true;
        if (this.gl && this.texture) {
          const gl = this.gl;
          gl.bindTexture(gl.TEXTURE_2D, this.texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
        }
      };
      this.image.src = this.options.src;
    }
  }

  setupEvents() {
    // Pointer Drag Controls
    this.container.addEventListener('pointerdown', (e) => {
      // Don't intercept button clicks
      if (e.target.closest('.vr-btn, .vr-360-overlay a')) return;

      this.dismissHint();
      this.isDragging = true;
      this.container.classList.add('is-dragging');
      this.pointerStartX = e.clientX;
      this.pointerStartY = e.clientY;
      this.startYaw = this.targetYaw;
      this.startPitch = this.targetPitch;
      this.velocityX = 0;
      this.velocityY = 0;
      this.lastPointerTime = performance.now();
      this.container.setPointerCapture(e.pointerId);
    });

    this.container.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;

      const now = performance.now();
      const dt = Math.max(1, now - this.lastPointerTime);
      const dx = e.clientX - this.pointerStartX;
      const dy = e.clientY - this.pointerStartY;

      // Sensitivity scaled by current FOV
      const sensitivity = (this.fov / 75) * 0.15;

      const newYaw = this.startYaw - dx * sensitivity;
      const newPitch = Math.max(-85, Math.min(85, this.startPitch + dy * sensitivity));

      this.velocityX = (newYaw - this.targetYaw) / dt;
      this.velocityY = (newPitch - this.targetPitch) / dt;

      this.targetYaw = newYaw;
      this.targetPitch = newPitch;
      this.lastPointerTime = now;
    });

    const endDrag = (e) => {
      if (this.isDragging) {
        this.isDragging = false;
        this.container.classList.remove('is-dragging');
        try {
          this.container.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }
    };

    this.container.addEventListener('pointerup', endDrag);
    this.container.addEventListener('pointercancel', endDrag);

    // Scroll Wheel Zoom
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.dismissHint();
      const delta = Math.sign(e.deltaY) * 4;
      this.zoomBy(delta);
    }, { passive: false });

    // Touch Pinch Zoom
    this.container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        this.pinchStartDist = Math.hypot(dx, dy);
        this.pinchStartFov = this.targetFov;
      }
    }, { passive: true });

    this.container.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        if (this.pinchStartDist > 0) {
          const ratio = this.pinchStartDist / dist;
          this.targetFov = Math.max(this.options.minFov, Math.min(this.options.maxFov, this.pinchStartFov * ratio));
        }
      }
    }, { passive: true });

    // Keyboard Navigation
    window.addEventListener('keydown', (e) => {
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
        return;
      }
      if (!this.isRunning) return;

      if (e.key === 'ArrowLeft') { this.panDirection('left'); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { this.panDirection('right'); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { this.panDirection('up'); e.preventDefault(); }
      else if (e.key === 'ArrowDown') { this.panDirection('down'); e.preventDefault(); }
      else if (e.key === '+' || e.key === '=') { this.zoomBy(-5); e.preventDefault(); }
      else if (e.key === '-' || e.key === '_') { this.zoomBy(5); e.preventDefault(); }
      else if (e.key === '0' || e.key.toLowerCase() === 'r') { this.resetView(); e.preventDefault(); }
    });

    // Resize Observer
    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
    });
    this.resizeObserver.observe(this.container);
  }

  resize() {
    if (!this.canvas || !this.gl) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.gl.viewport(0, 0, width, height);
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.resize();

    const loop = () => {
      if (!this.isRunning) return;
      this.render();
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  pause() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    if (this.video && !this.video.paused) {
      this.video.pause();
    }
  }

  resume() {
    if (!this.isRunning) {
      this.start();
    }
    if (this.video && this.video.paused && this.options.autoplay) {
      this.video.play().catch(() => {});
    }
  }

  render() {
    const gl = this.gl;
    if (!gl || !this.program) return;

    // Apply inertia or auto-rotation
    if (!this.isDragging) {
      if (Math.abs(this.velocityX) > 0.001 || Math.abs(this.velocityY) > 0.001) {
        this.targetYaw += this.velocityX * 16;
        this.targetPitch = Math.max(-85, Math.min(85, this.targetPitch + this.velocityY * 16));
        this.velocityX *= 0.92;
        this.velocityY *= 0.92;
      } else if (this.options.autoRotate) {
        this.targetYaw += this.options.autoRotateSpeed;
      }
    }

    // Smooth lerp to targets
    this.yaw += (this.targetYaw - this.yaw) * 0.12;
    this.pitch += (this.targetPitch - this.pitch) * 0.12;
    this.fov += (this.targetFov - this.fov) * 0.12;

    // Update video texture if playing and has data
    if (this.options.isVideo && this.video && this.video.readyState >= this.video.HAVE_CURRENT_DATA) {
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.video);
    }

    // Clear buffer
    gl.clearColor(0.04, 0.04, 0.04, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(this.program);

    // Compute MVP Matrix
    const aspect = this.canvas.width / (this.canvas.height || 1);
    const projMatrix = this.createPerspectiveMatrix((this.fov * Math.PI) / 180, aspect, 0.1, 1000.0);
    const viewMatrix = this.createViewMatrix((this.pitch * Math.PI) / 180, (this.yaw * Math.PI) / 180);
    const mvpMatrix = this.multiplyMatrices(projMatrix, viewMatrix);

    gl.uniformMatrix4fv(this.uMatrix, false, mvpMatrix);

    // Bind Buffers & Draw
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
    gl.enableVertexAttribArray(this.aPosition);
    gl.vertexAttribPointer(this.aPosition, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
    gl.enableVertexAttribArray(this.aTexCoord);
    gl.vertexAttribPointer(this.aTexCoord, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(this.uTexture, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
  }

  // 4x4 Matrix Mathematics
  createPerspectiveMatrix(fovRad, aspect, near, far) {
    const f = 1.0 / Math.tan(fovRad / 2);
    const rangeInv = 1.0 / (near - far);

    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
    ]);
  }

  createViewMatrix(pitchRad, yawRad) {
    // Camera stays at (0,0,0) looking out inside sphere
    const cosPitch = Math.cos(pitchRad);
    const sinPitch = Math.sin(pitchRad);
    const cosYaw = Math.cos(yawRad);
    const sinYaw = Math.sin(yawRad);

    // Combine Rx(pitch) * Ry(yaw)
    return new Float32Array([
      cosYaw, sinPitch * sinYaw, -cosPitch * sinYaw, 0,
      0, cosPitch, sinPitch, 0,
      sinYaw, -sinPitch * cosYaw, cosPitch * cosYaw, 0,
      0, 0, 0, 1
    ]);
  }

  multiplyMatrices(a, b) {
    const out = new Float32Array(16);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += a[k * 4 + i] * b[j * 4 + k];
        }
        out[j * 4 + i] = sum;
      }
    }
    return out;
  }

  destroy() {
    this.pause();
    this.stopHoldingDirection();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    const overlay = this.container.querySelector('.vr-360-overlay');
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    this.container.classList.remove('vr-360-container', 'is-dragging');
  }
}

// Global Factory / Registry
window.VR360 = {
  create: (container, options) => new VR360Viewer(container, options),
  initAll: () => {
    document.querySelectorAll('[data-vr-360="true"]').forEach(el => {
      if (!el._vr360Instance) {
        const src = el.getAttribute('data-src') || el.getAttribute('src');
        const isVideo = el.getAttribute('data-is-video') !== 'false';
        const poster = el.getAttribute('data-poster') || '';
        el._vr360Instance = new VR360Viewer(el, { src, isVideo, poster, autoplay: false });
      }
    });
  }
};
