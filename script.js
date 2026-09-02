const QUESTIONS = [
  { id: 'q1', prompt: null, text: 'How do financial problems affect your studies and academic performance?' },
  { id: 'q2', prompt: 'Think about your own experience.', text: 'What are the biggest financial challenges you experience as a college student? Which one affects you the most, and why?' },
  { id: 'q3', prompt: null, text: 'Have financial difficulties ever caused you to miss classes, activities, or school requirements? If yes, how?' },
  { id: 'q4', prompt: null, text: 'How do financial problems affect your stress, focus, or motivation as a student?' },
  { id: 'q5', prompt: 'Think about your own experience.', text: 'What strategies do you use to manage your financial problems while continuing your studies? Which strategy helps you most, and why?' }
];

const MIN_WORDS = 3;

const screens = {
  identity: document.getElementById('screen-identity'),
  question: document.getElementById('screen-question'),
  review: document.getElementById('screen-review'),
  done: document.getElementById('screen-done')
};

const identityStatus = document.getElementById('identity-status');
const beginBtn = document.getElementById('begin-btn');

const questionContent = document.getElementById('question-content');
const questionStatus = document.getElementById('question-status');
const continueBtn = document.getElementById('continue-btn');
const progressLabel = document.getElementById('progress-label');
const progressPercent = document.getElementById('progress-percent');
const progressFill = document.getElementById('progress-fill');

const checkpointOverlay = document.getElementById('checkpoint-overlay');
const checkpointContinueBtn = document.getElementById('checkpoint-continue-btn');

const submitBtn = document.getElementById('submit-btn');
const submitStatus = document.getElementById('submit-status');

let identity = { name: '', yearLevel: '', section: '' };
let currentIndex = 0;
const answers = {};
const questionTimes = {};
let surveyStartTime = null;
let questionStartTime = null;

// Only one screen is ever un-hidden at a time. Nothing else is rendered
// into the DOM until it's needed, so there is no other markup around
// that could accidentally become visible.
function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    el.hidden = key !== name;
  });
}

// The current question's markup is generated fresh each time - there is
// no pool of pre-built question divs sitting in the page to leak through.
function renderQuestion(index) {
  const q = QUESTIONS[index];
  const promptHtml = q.prompt ? `<p class="reflection-prompt">${q.prompt}</p>` : '';

  questionContent.classList.remove('fade-in');
  void questionContent.offsetWidth; // restart the animation each time
  questionContent.innerHTML = `
    <div class="question">
      ${promptHtml}
      <label class="q-label" for="answer">
        <span class="q-num">${index + 1}</span>${q.text}
      </label>
      <textarea id="answer" rows="6" placeholder="Type your answer here..."></textarea>
    </div>`;
  questionContent.classList.add('fade-in');

  questionStatus.textContent = '';
  continueBtn.hidden = true;

  const percent = Math.round(((index + 1) / QUESTIONS.length) * 100);
  progressLabel.textContent = `Question ${index + 1} of ${QUESTIONS.length}`;
  progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;

  const answerField = document.getElementById('answer');
  answerField.addEventListener('input', () => {
    continueBtn.hidden = answerField.value.trim().length === 0;
  });
  answerField.focus();

  questionStartTime = Date.now();
}

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

beginBtn.addEventListener('click', () => {
  const name = document.getElementById('name').value.trim();
  const yearLevel = document.getElementById('yearLevel').value;
  const section = document.getElementById('section').value.trim();

  if (!name || !yearLevel || !section) {
    identityStatus.textContent = 'Please fill in your name, year level, and section before continuing.';
    return;
  }

  identity = { name, yearLevel, section };
  identityStatus.textContent = '';

  surveyStartTime = Date.now();
  currentIndex = 0;
  showScreen('question');
  renderQuestion(currentIndex);
});

function advanceToNextQuestion() {
  currentIndex += 1;
  if (currentIndex < QUESTIONS.length) {
    renderQuestion(currentIndex);
  } else {
    showScreen('review');
  }
}

continueBtn.addEventListener('click', () => {
  const answerField = document.getElementById('answer');
  const value = answerField.value.trim();

  if (!value || wordCount(value) < MIN_WORDS) {
    questionStatus.textContent = 'Please take a moment to answer this question before continuing.';
    return;
  }

  const q = QUESTIONS[currentIndex];
  answers[q.id] = value;
  questionTimes[`${q.id}TimeMs`] = Date.now() - questionStartTime;

  // The reflection checkpoint only appears for the two questions that
  // carry a "Think about your own experience" prompt (Q2 and Q5).
  if (q.prompt) {
    checkpointOverlay.hidden = false;
  } else {
    advanceToNextQuestion();
  }
});

checkpointContinueBtn.addEventListener('click', () => {
  checkpointOverlay.hidden = true;
  advanceToNextQuestion();
});

submitBtn.addEventListener('click', async () => {
  submitStatus.textContent = '';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  const totalTimeMs = Date.now() - surveyStartTime;

  const entry = {
    name: identity.name,
    yearLevel: identity.yearLevel,
    section: identity.section,
    q1: answers.q1 || '',
    q2: answers.q2 || '',
    q3: answers.q3 || '',
    q4: answers.q4 || '',
    q5: answers.q5 || '',
    ...questionTimes,
    totalTimeMs,
    surveyStartedAt: new Date(surveyStartTime).toISOString(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    await db.collection('responses').add(entry);
    showScreen('done');
  } catch (err) {
    console.error('Error saving response:', err);
    submitStatus.textContent = 'Something went wrong saving your response. Please try again.';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
  }
});

document.getElementById('name').focus();
