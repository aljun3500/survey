const container = document.getElementById('responses-container');

const QUESTIONS = {
  q1: "How would you describe your college life so far?",
  q2: "What is the biggest challenge you face as a college student?",
  q3: "How do you manage your time between studying and personal life?",
  q4: "What is your favorite part about being in college?",
  q5: "What is the most difficult subject or experience you have encountered?",
  q6: "How do you deal with stress and pressure from school?",
  q7: "What motivates you to continue studying?",
  q8: "How has college changed you as a person?",
  q9: "What advice would you give to incoming college students?",
  q10: "What are your goals after finishing college?",
  q11: "How do you make friends and build relationships in college?",
  q12: "What is one memorable experience you have had in college?",
  q13: "Do you think college life is different from what you expected? Why?",
  q14: "How do you balance your school responsibilities and hobbies?",
  q15: "What skills have you learned from being a college student?"
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
          <p class="response-meta">Submitted ${formatDate(r.createdAt)}</p>
          ${qaHtml}
        </div>`;
    });

    container.innerHTML = cards;
  })
  .catch((err) => {
    console.error('Error loading responses:', err);
    container.innerHTML = '<p class="empty-state">Could not load responses. Check the console for details.</p>';
  });
