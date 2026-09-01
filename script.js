const form = document.getElementById('survey-form');
const statusEl = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');
const thankYou = document.getElementById('thank-you');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.textContent = '';

  const rating = form.querySelector('input[name="rating"]:checked');

  const entry = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    rating: rating ? Number(rating.value) : null,
    comments: form.comments.value.trim(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  if (!entry.name || !entry.rating) {
    statusEl.textContent = 'Please add your name and a rating before sending.';
    return;
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
