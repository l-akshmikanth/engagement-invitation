// Countdown, terminal interactions, share actions, petals & reveal logic
(function(){
  const targetDateIST = '2025-10-13T07:00:00Z'; // 12:30 PM IST = 07:00 UTC
  const countdownEl = document.getElementById('countdown-timer');
  const postMsg = document.getElementById('post-countdown-message');
  const countdownSection = document.getElementById('countdown-section');
  const surpriseSection = document.getElementById('surprise');

  function pad(n){ return n.toString().padStart(2,'0'); }

  function buildBoxes(){
    const labels = ['Days','Hours','Minutes','Seconds'];
    labels.forEach(l => {
      const box = document.createElement('div');
      box.className = 'flex flex-col items-center bg-white/70 backdrop-blur-sm px-4 py-3 rounded-md shadow border border-gold/30 min-w-[80px]';
      box.innerHTML = `<span class="value text-2xl font-semibold text-gold">00</span><span class="text-xs mt-1 tracking-wide">${l}</span>`;
      countdownEl.appendChild(box);
    });
  }
  buildBoxes();

  function updateCountdown(){
    const now = new Date().getTime();
    const target = new Date(targetDateIST).getTime();
    let diff = target - now;
    if(diff <= 0){
      clearInterval(timer);
      countdownEl.classList.add('opacity-0','transition');
      setTimeout(()=>{
        countdownEl.remove();
        postMsg.classList.remove('hidden');
        document.body.classList.add('reveal-active');
        launchLotusPetals();
        revealSurprise();
      }, 800);
      return;
    }
    const d = Math.floor(diff / (1000*60*60*24));
    diff -= d*24*60*60*1000;
    const h = Math.floor(diff / (1000*60*60));
    diff -= h*60*60*1000;
    const m = Math.floor(diff / (1000*60));
    diff -= m*60*1000;
    const s = Math.floor(diff / 1000);
    const values = [d,h,m,s];
    [...countdownEl.querySelectorAll('.value')].forEach((el,i)=> el.textContent = pad(values[i]));
  }
  const timer = setInterval(updateCountdown,1000); updateCountdown();

  // Lotus petals after countdown
  function launchLotusPetals(){
    const container = document.getElementById('lotus-petals');
    for(let i=0;i<25;i++){
      const p = document.createElement('div');
      p.className='petal';
      p.style.left = Math.random()*100+'%';
      p.style.animationDelay = (Math.random()*5)+'s';
      p.style.animationDuration = 5+ Math.random()*6 + 's';
      container.appendChild(p);
    }
  }

  // Surprise reveal section
  function revealSurprise(){
    surpriseSection.classList.remove('hidden');
    const photo = document.getElementById('reveal-photo');
    // If an image exists, set it as background
    // photo.style.background = 'url(assets/images/couple_photo.jpg) center/cover';
    setTimeout(()=> photo.style.opacity = 1, 400);
  }

  // Terminal logic
  const form = document.getElementById('terminal-form');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');

  const QA = {
    'who is the bride?': 'Maanya.',
    'who is the groom?': 'Lakshmikanth.',
    'where is the venue?': 'Sampradaya Convention Hall, Near Pandavapura Railway Station (see map above).',
    'when is the engagement?': '13 Oct 2025 at 12:30 PM IST.',
  };

  const EasterEggResponse = 'Secret marriage date: 8 March 2026 (shh!)';

  function appendLine(text, cls=''){ const div=document.createElement('div'); div.textContent=text; if(cls) div.className=cls; output.appendChild(div); output.scrollTop = output.scrollHeight; }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = input.value.trim(); if(!q) return;
    appendLine('$ '+q,'text-green-400');
    const key = q.toLowerCase();
    if(key === 'help'){
      showHelp();
    } else if(key.includes('marriage')){
      typeWriter(EasterEggResponse);
    } else if(QA[key]) {
      appendLine(QA[key]);
    } else {
      appendLine('Sorry, I do not know. Try: "Who is the bride?"');
    }
    input.value='';
  });

  function showHelp(){
    appendLine('Available commands:', 'text-gold-300');
    Object.keys(QA).forEach(k => appendLine('- '+k));
    appendLine("Hint: ask about 'marriage' for a secret.");
  }

  function typeWriter(text){
    const span = document.createElement('div');
    span.className='typewriter text-pink-300';
    output.appendChild(span);
    let i=0;
    const interval = setInterval(()=>{
      span.textContent = text.slice(0,i+1);
      i++;
      output.scrollTop = output.scrollHeight;
      if(i>=text.length){ clearInterval(interval); span.classList.remove('typewriter'); }
    }, 60);
  }

  // Scroll celebration events (petals throughout scroll)
  let scrollSpawned = 0;
  window.addEventListener('scroll', () => {
    const celebration = document.getElementById('celebration');
    const rect = celebration.getBoundingClientRect();
    if(rect.top < window.innerHeight && scrollSpawned < 1){
      spawnScrollingPetals();
      fadeInTimeline();
      scrollSpawned++;
    }
  });

  function spawnScrollingPetals(){
    for(let i=0;i<30;i++){
      const p=document.createElement('div');
      p.className='petal falling';
      p.style.left=Math.random()*100+'vw';
      p.style.animationDelay=Math.random()*10+'s';
      p.style.animationDuration= 8+Math.random()*6+'s';
      document.body.appendChild(p);
      setTimeout(()=> p.remove(), 16000);
    }
  }

  function fadeInTimeline(){
    const t = document.getElementById('timeline');
    t.classList.remove('opacity-0');
    t.classList.add('opacity-100');
  }

  // Share buttons
  const shareHandlers = {
    whatsapp: () => {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent('Join us for our engagement on 13 Oct 2025!');
      window.open(`https://wa.me/?text=${text}%20${url}`,'_blank');
    },
    email: () => {
      const subject = encodeURIComponent('Engagement Invitation - 13 Oct 2025');
      const body = encodeURIComponent('With the blessings of God, we invite you to our engagement on 13 Oct 2025. Venue: Sampradaya Convention Hall, Near Pandavapura Railway Station.');
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    },
    copy: () => {
      navigator.clipboard.writeText(window.location.href).then(()=>{
        alert('Link copied to clipboard!');
      });
    }
  };

  document.querySelectorAll('[data-share]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-share');
      shareHandlers[type]?.();
    });
  });

  // Audio removed as per user preference

  /* ---------- Scroll Reveal System ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        if(entry.target.matches('[data-petals]')){
          spawnNamePetals(entry.target.querySelector('.petal-layer'));
        }
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Name Petals Effect ---------- */
  function spawnNamePetals(layer){
    if(!layer) return;
    const TOTAL = 18;
    const rect = layer.getBoundingClientRect();
    for(let i=0;i<TOTAL;i++){
      const p = document.createElement('div');
      p.className='name-petal';
      const angle = (Math.random()*Math.PI*2);
      const radius = 60 + Math.random()*80;
      const tx = Math.cos(angle)*radius;
      const ty = Math.sin(angle)*radius;
      p.style.setProperty('--tx', tx+'px');
      p.style.setProperty('--ty', ty+'px');
      p.style.left = (rect.width/2 - 12) + 'px';
      p.style.top = (rect.height/2 - 12) + 'px';
      p.style.animationDelay = (Math.random()*0.8)+'s';
      layer.appendChild(p);
      setTimeout(()=> p.remove(), 6000);
    }
  }
})();
