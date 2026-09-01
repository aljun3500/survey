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

  // Fitts's Law: put the cursor where the user needs it, so there's zero
  // travel distance to start typing the next answer.
  const activePage = pages.find((p) => Number(p.dataset.page) === pageNum);
  const firstField = activePage.querySelector('textarea, input');
  if (firstField) firstField.focus();
}

nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage += 1;
    showPage(currentPage);
  }
});

backBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage -= 1;
    showPage(currentPage);
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.textContent = '';

  const entry = {
    name: form.name.value.trim(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  for (let i = 1; i <= 15; i++) {
    entry[`q${i}`] = form[`q${i}`].value.trim();
  }

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

// Focus the very first field on initial load, so typing can start immediately.
form.name.focus();
