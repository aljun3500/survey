const container = document.getElementById('responses-container');

const QUESTIONS = {
  q1: "How do financial problems affect your studies and academic performance?",
  q2: "What are the biggest financial challenges you experience as a college student?",
  q3: "Have financial difficulties ever caused you to miss classes, activities, or school requirements?",
  q4: "How do financial problems affect your stress, focus, or motivation as a student?",
  q5: "What strategies do you use to manage your financial problems while continuing your studies?"
};

function formatDate(timestamp) {
  if (!timestamp || !timestamp.toDate) return 'just now';
  return timestamp.toDate().toLocaleString();
}

function formatDuration(ms) {
  if (!ms && ms !== 0) return null;
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
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
      const metaParts = [r.yearLevel, r.section].filter(Boolean).map(escapeHtml);
      const totalTime = formatDuration(r.totalTimeMs);
      if (totalTime) metaParts.push(`Took ${totalTime}`);
      metaParts.push(`Submitted ${formatDate(r.createdAt)}`);

      let qaHtml = '';
      Object.keys(QUESTIONS).forEach((key) => {
        const answer = r[key];
        const time = formatDuration(r[`${key}TimeMs`]);
        qaHtml += `
          <div class="qa-pair">
            <p class="qa-question">${escapeHtml(QUESTIONS[key])}</p>
            <p class="qa-answer ${answer ? '' : 'empty'}">${answer ? escapeHtml(answer) : 'No answer'}</p>
            ${time ? `<p class="qa-time">${time} spent on this question</p>` : ''}
          </div>`;
      });

      cards += `
        <div class="response-card">
          <h3>${name}</h3>
          <p class="response-meta">${metaParts.join(' • ')}</p>
          ${qaHtml}
        </div>`;
    });

    container.innerHTML = cards;
  })
  .catch((err) => {
    console.error('Error loading responses:', err);
    container.innerHTML = '<p class="empty-state">Could not load responses. Check the console for details.</p>';
  });
