const glow = document.querySelector('.cursor-glow');
const heroArt = document.querySelector('.hero-art');
const toast = document.querySelector('.toast');
const visual = document.querySelector('.hero-visual');

window.addEventListener('pointermove', (event) => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

visual.addEventListener('pointermove', (event) => {
  const rect = visual.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  heroArt.style.transform = `translate(${x * 16}px, ${y * 13 - 8}px) rotate(${x * 2}deg)`;
});

visual.addEventListener('pointerleave', () => { heroArt.style.transform = ''; });

document.querySelectorAll('[data-product]').forEach((product) => {
  product.addEventListener('pointerenter', () => {
    toast.textContent = `${product.dataset.product} — tell me you want the full story.`;
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 3600);
  });
});

const sound = document.querySelector('.sound-toggle');
let audioContext;
let audioLoop;

function playPixelTone(frequency, startOffset, duration, type = 'square') {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const start = audioContext.currentTime + startOffset;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.045, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

function playPixelLoop() {
  playPixelTone(261.63, 0, 0.16);
  playPixelTone(329.63, 0.18, 0.16);
  playPixelTone(392, 0.36, 0.24, 'triangle');
}

sound.addEventListener('click', () => {
  const active = sound.classList.toggle('active');
  sound.setAttribute('aria-pressed', String(active));
  sound.lastChild.textContent = active ? ' STOP THE BEAT' : ' MAKE SOME NOISE';

  if (active) {
    audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
    audioContext.resume();
    playPixelLoop();
    audioLoop = window.setInterval(playPixelLoop, 820);
  } else {
    window.clearInterval(audioLoop);
    audioLoop = undefined;
  }

  toast.textContent = active ? 'Pixel beat is playing. Click again to stop it.' : 'Pixel beat paused.';
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2600);
});

const contactSection = document.querySelector('.contact-section');
const contactObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    contactSection.classList.add('in-view');
    contactObserver.disconnect();
  }
}, { threshold: 0.2 });
contactObserver.observe(contactSection);
