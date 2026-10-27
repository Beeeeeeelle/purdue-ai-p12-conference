const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const conferenceStart = new Date('2026-11-02T08:30:00-05:00');
const now = new Date();
const days = Math.ceil((conferenceStart - now) / 86400000);
const countdown = document.querySelector('#days-to-go');
const urgencyHeading = document.querySelector('#urgency-heading');
const urgencyAction = document.querySelector('#urgency-action');

if (countdown && days > 1 && days < 14) {
  countdown.textContent = `Only ${days} days until November 2. Registration is still open.`;
} else if (countdown && days === 1) {
  countdown.textContent = 'The conference is tomorrow. Registration is still open.';
} else if (countdown && days === 0) {
  countdown.textContent = 'The conference is today.';
} else if (countdown && days < 0) {
  if (urgencyHeading) urgencyHeading.textContent = 'Thank you for joining us.';
  countdown.textContent = 'Conference materials and resources will be posted here.';
  if (urgencyAction) urgencyAction.hidden = true;
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

const scheduleSearch = document.querySelector('#schedule-search');
const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
const scheduleCards = Array.from(document.querySelectorAll('.program-card'));
const programBlocks = Array.from(document.querySelectorAll('.program-block'));
const resultsCount = document.querySelector('#schedule-results');
const noResults = document.querySelector('#schedule-no-results');
let activeSlot = 'all';

function updateScheduleResults() {
  if (!scheduleCards.length) return;
  const query = (scheduleSearch?.value || '').trim().toLowerCase();
  let visible = 0;

  scheduleCards.forEach((card) => {
    const matchesSlot = activeSlot === 'all' || card.dataset.slot === activeSlot;
    const matchesQuery = !query || (card.dataset.search || '').includes(query);
    const show = matchesSlot && matchesQuery;
    card.hidden = !show;
    if (show) visible += 1;
  });

  programBlocks.forEach((block) => {
    block.hidden = !Array.from(block.querySelectorAll('.program-card')).some((card) => !card.hidden);
  });

  if (resultsCount) {
    const label = visible === 1 ? 'room listing' : 'room listings';
    resultsCount.textContent = `Showing ${visible} ${label}.`;
  }
  if (noResults) noResults.hidden = visible !== 0;
}

if (scheduleSearch) scheduleSearch.addEventListener('input', updateScheduleResults);

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeSlot = button.dataset.filter || 'all';
    filterButtons.forEach((candidate) => {
      const active = candidate === button;
      candidate.classList.toggle('active', active);
      candidate.setAttribute('aria-pressed', String(active));
    });
    updateScheduleResults();
  });
});
