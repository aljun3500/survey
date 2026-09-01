const container = document.getElementById('responses-container');

const QUESTIONS = {
  q1: "What kind of financial assistance would help you most as a college student?",
  q2: "What suggestions can you give to help college students experiencing financial difficulties?",
  q3: "Which of the following expenses is the most difficult for you to afford?"
};

function formatDate(timestamp) {
  if (!timestamp || !timestamp.toDate) return 'just now';
  return timestamp.toDate().toLocaleString();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

db.collection('responses')
  .orderBy('createdAt', 'desc')
  .get()
  .then((snapshot) => {
    if (snapshot.empty) {
      container.innerHTML = '<p class="empty-state">No responses yet. Once someone submits the survey, it will show up here.</p>';
      return;
    }

    let cards = '';
    snapshot.forEach((doc) => {
      const r = doc.data();
      const name = r.name ? escapeHtml(r.name) : 'Anonymous';
      const meta = [r.yearLevel, r.section].filter(Boolean).map(escapeHtml).join(' • ');

      let qaHtml = '';
      Object.keys(QUESTIONS).forEach((key) => {
        const answer = r[key];
        qaHtml += `
          <div class="qa-pair">
            <p class="qa-question">${escapeHtml(QUESTIONS[key])}</p>
            <p class="qa-answer ${answer ? '' : 'empty'}">${answer ? escapeHtml(answer) : 'No answer'}</p>
          </div>`;
      });

      cards += `
        <div class="response-card">
          <h3>${name}</h3>
          <p class="response-meta">${meta ? meta + ' • ' : ''}Submitted ${formatDate(r.createdAt)}</p>
          ${qaHtml}
        </div>`;
    });

    container.innerHTML = cards;
  })
  .catch((err) => {
    console.error('Error loading responses:', err);
    container.innerHTML = '<p class="empty-state">Could not load responses. Check the console for details.</p>';
  });
