const form = document.getElementById('survey-form');
const statusEl = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');
const backBtn = document.getElementById('back-btn');
const pageIndicator = document.getElementById('page-indicator');
const thankYou = document.getElementById('thank-you');

const pages = Array.from(document.querySelectorAll('.survey-page'));
const totalPages = pages.length;
let currentPage = 1;

function showPage(pageNum) {
  pages.forEach((p) => {
    p.hidden = Number(p.dataset.page) !== pageNum;
  });
  pageIndicator.textContent = `Page ${pageNum} of ${totalPages}`;
  backBtn.hidden = pageNum === 1;
  nextBtn.hidden = pageNum === totalPages;
  submitBtn.hidden = pageNum !== totalPages;

  const activePage = pages.find((p) => Number(p.dataset.page) === pageNum);
  const firstField = activePage.querySelector('input, select, textarea');
  if (firstField) firstField.focus();
}

function identityIsComplete() {
  return form.name.value.trim() && form.yearLevel.value && form.section.value.trim();
}

nextBtn.addEventListener('click', () => {
  if (currentPage === 1 && !identityIsComplete()) {
    statusEl.textContent = 'Please fill in your name, year level, and section before continuing.';
    return;
  }
  statusEl.textContent = '';
  if (currentPage < totalPages) {
    currentPage += 1;
    showPage(currentPage);
  }
});

backBtn.addEventListener('click', () => {
  statusEl.textContent = '';
  if (currentPage > 1) {
    currentPage -= 1;
    showPage(currentPage);
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.textContent = '';

  const q3Choice = form.querySelector('input[name="q3"]:checked');

  const entry = {
    name: form.name.value.trim(),
    yearLevel: form.yearLevel.value,
    section: form.section.value.trim(),
    q1: form.q1.value.trim(),
    q2: form.q2.value.trim(),
    q3: q3Choice ? q3Choice.value : '',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    await db.collection('responses').add(entry);
    form.hidden = true;
    thankYou.hidden = false;
  } catch (err) {
    console.error('Error saving response:', err);
    statusEl.textContent = 'Something went wrong saving your response. Please try again.';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send feedback';
  }
});

form.name.focus();
