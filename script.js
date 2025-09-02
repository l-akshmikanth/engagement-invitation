// Lightweight script for countdown (IST), terminal typing, share and tiny animations
(function(){
  const EVENT_ISO = '2025-10-13T12:30:00+05:30';
  const eventDate = new Date(EVENT_ISO);

  // Helpers
  function pad(n){return String(n).padStart(2,'0')}

  // Countdown
  function updateCountdown(){
    const now = new Date();
    const diff = eventDate - now;
    if(diff <= 0){
      document.querySelectorAll('[data-unit]').forEach(el=>el.textContent='00');
      return;
    }
    const secs = Math.floor(diff/1000);
    const days = Math.floor(secs/86400);
    const hours = Math.floor((secs%86400)/3600);
    const mins = Math.floor((secs%3600)/60);
    const s = secs%60;
    document.querySelector('[data-unit="days"]').textContent = days;
    document.querySelector('[data-unit="hours"]').textContent = pad(hours);
    document.querySelector('[data-unit="minutes"]').textContent = pad(mins);
    document.querySelector('[data-unit="seconds"]').textContent = pad(s);
  }

  // Start countdown tick
  if(document.getElementById('countdown')){
    updateCountdown();
    setInterval(updateCountdown,1000);
  }

  // Terminal typing effect
  const terminalLines = [
    '> booting relationship.kernel',
    '> handshakes passed',
    '> dependency lock: trust@stable, respect@latest',
    '> deploying engagement --time 2025-10-13T12:30:00+05:30',
    '> status: SUCCESS ✅'
  ];

  function typeInTerminal(el, lines, delay=40){
    const code = el.querySelector('code');
    let i=0, li=0, txt='';
    function step(){
      if(li>=lines.length) return;
      const line = lines[li];
      if(i<=line.length){
        code.textContent = lines.slice(0,li).join('\n') + (li? '\n':'') + line.slice(0,i);
        i++;
        setTimeout(step, delay + Math.random()*20);
      } else {
        li++; i=0; setTimeout(step, 300);
      }
    }
    step();
  }

  const term = document.getElementById('terminal');
  if(term){
    typeInTerminal(term, terminalLines, 28);
    // uptime bar progress toward event
    const fill = document.getElementById('uptime-fill');
    function updateUptime(){
      const now = new Date();
      const total = eventDate - new Date();
      // progress from now toward event (0% -> now, 100% -> event)
      // to show some motion, compute percent of month? Use days until event relative to 180 days window
      const daysLeft = Math.max(0, Math.round((eventDate - now)/86400000));
      const pct = Math.max(0, Math.min(100, 100 - (daysLeft/180)*100));
      fill.style.width = pct + '%';
    }
    updateUptime(); setInterval(updateUptime, 60000);
  }

  // Simple share handlers
  const shareBtn = document.getElementById('share-btn');
  if(shareBtn){
    shareBtn.addEventListener('click', async ()=>{
      const url = location.href;
      const title = document.title;
      if(navigator.share){
        try{ await navigator.share({title, url}); }
        catch(e){}
      } else {
        // fallback: copy link
        try{ await navigator.clipboard.writeText(url); alert('Link copied to clipboard'); }
        catch(e){ prompt('Copy this link', url); }
      }
    });
  }

  // Add to calendar (ICS download)
  const addCal = document.getElementById('add-calendar');
  if(addCal){
    addCal.addEventListener('click', ()=>{
      // compute UTC start/end from eventDate (IST provided in ISO)
      const dtStart = formatICS(eventDate);
      const dtEnd = formatICS(new Date(eventDate.getTime() + 2*60*60*1000)); // 2 hour event
      const icsLines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//engagement-invitation//EN',
        'BEGIN:VEVENT',
        `UID:engagement-20251013-${dtStart}@example.com`,
        `DTSTAMP:${formatICS(new Date())}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        'SUMMARY:Engagement – Lakshmikanth & Maanya',
        'LOCATION:Sampradaya Convention Hall, Near Pandavapura Railway Station',
        'DESCRIPTION:Engagement Ceremony',
        'END:VEVENT',
        'END:VCALENDAR'
      ];
      const ics = icsLines.join('\r\n');
      const blob = new Blob([ics],{type:'text/calendar'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href=url; a.download='engagement-lakshmikanth-maanya.ics'; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
  }

  function formatICS(d){
    function z(n){return String(n).padStart(2,'0')}
    return d.getUTCFullYear()+z(d.getUTCMonth()+1)+z(d.getUTCDate())+'T'+z(d.getUTCHours())+z(d.getUTCMinutes())+z(d.getUTCSeconds())+'Z';
  }

  // Intersection animations (simple)
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('in-view');
    });
  },{threshold:0.12});
  document.querySelectorAll('.commit, .section-title, .terminal, .hero-title').forEach(el=>io.observe(el));

})();
