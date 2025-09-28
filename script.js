// THEME TOGGLE
(function(){
  const toggles = document.querySelectorAll('#theme-toggle');
  function applyTheme(theme){
    if(theme === 'dark') document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }
  const saved = localStorage.getItem('theme') || 'light';
  applyTheme(saved);

  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  });
})();

// AGENDA: (if page has search/filter elements)
(function(){
  const search = document.getElementById('agenda-search');
  const filterDay = document.getElementById('agenda-filter-day');
  const filterType = document.getElementById('agenda-filter-type');
  const list = document.getElementById('agenda-list');
  if(!list) return;

  function filterAgenda(){
    const q = search ? search.value.trim().toLowerCase() : '';
    const dayVal = filterDay ? filterDay.value : 'all';
    const typeVal = filterType ? filterType.value : 'all';
    const cards = list.querySelectorAll('.session-card');

    cards.forEach(card => {
      const txt = card.textContent.toLowerCase();
      const day = card.getAttribute('data-day') || '';
      const type = card.getAttribute('data-type') || '';
      const matchQ = q === '' || txt.includes(q);
      const matchDay = dayVal === 'all' || day === dayVal;
      const matchType = typeVal === 'all' || type === typeVal;
      if(matchQ && matchDay && matchType) card.style.display = '';
      else card.style.display = 'none';
    });
  }
  if(search) search.addEventListener('input', filterAgenda);
  if(filterDay) filterDay.addEventListener('change', filterAgenda);
  if(filterType) filterType.addEventListener('change', filterAgenda);
})();

// SPEAKER MODAL helpers
function openModalFromCard(button){
  const card = button.closest('.profile-card');
  if(!card) return;
  const name = card.getAttribute('data-name') || '';
  const role = card.getAttribute('data-role') || '';
  const bio = card.getAttribute('data-bio') || '';
  const img = card.querySelector('img') ? card.querySelector('img').src : 'images/speaker-placeholder-1.png';

  const modal = document.getElementById('profile-modal');
  if(!modal) return;
  modal.querySelector('#modal-name').textContent = name;
  modal.querySelector('#modal-role').textContent = role;
  modal.querySelector('#modal-bio').textContent = bio;
  modal.querySelector('#modal-photo').src = img;
  modal.style.display = 'flex';
}
function closeModal(){
  const modal = document.getElementById('profile-modal');
  if(modal) modal.style.display = 'none';
}

// UPDATES refresh (dummy)
(function(){
  const btn = document.getElementById('refresh-updates');
  const list = document.getElementById('updates-list');
  if(!btn || !list) return;
  btn.addEventListener('click', () => {
    const li = document.createElement('li');
    const now = new Date();
    const time = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
    li.innerHTML = `<strong>[${time}]</strong> New announcement: Check info desk`;
    list.prepend(li);
  });
})();

// Optional: Basic install prompt handling
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // show a simple toast/button (optional)
  // You can implement a custom UI to prompt install using deferredPrompt.prompt()
});
