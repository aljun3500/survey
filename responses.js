const container = document.getElementById('responses-container');

function formatDate(timestamp) {
  if (!timestamp || !timestamp.toDate) return '—';
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

    let rows = '';
    snapshot.forEach((doc) => {
      const r = doc.data();
      rows += `
        <tr>
          <td>${escapeHtml(r.name)}</td>
          <td>${r.rating ?? '—'}</td>
          <td>${escapeHtml(r.comments) || '—'}</td>
          <td>${formatDate(r.createdAt)}</td>
        </tr>`;
    });

    container.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Rating</th>
            <th>Comments</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  })
  .catch((err) => {
    console.error('Error loading responses:', err);
    container.innerHTML = '<p class="empty-state">Could not load responses. Check the console for details.</p>';
  });
