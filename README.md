# Survey Site

A small survey form (HTML/CSS/JS) that saves responses to Firebase Firestore, plus a page to view them later. No server or build step required.

## Files

- `index.html` / `style.css` — the survey form
- `script.js` — sends form answers to Firestore
- `responses.html` / `responses.js` — lists saved responses
- `firebase-config.js` — your Firebase project keys (edit this)

## 1. Install Git and connect GitHub

```bash
git --version
```

If that errors, install Git from git-scm.com, then set your identity once:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Create a free account at github.com if you don't have one, then create a new **empty** repository there (no README, no .gitignore) — call it `survey-site`. Copy the URL it gives you, e.g. `https://github.com/yourname/survey-site.git`.

## 2. Turn this folder into a Git repo

From inside this project folder:

```bash
git init
git add .
git commit -m "Initial survey site"
git branch -M main
git remote add origin https://github.com/yourname/survey-site.git
git push -u origin main
```

What each command does:
- `git init` — starts tracking this folder as a repo
- `git add .` — stages all files for the next commit
- `git commit -m "..."` — saves a snapshot with a message
- `git remote add origin ...` — links your local repo to the one on GitHub
- `git push -u origin main` — uploads your commit; after this, `git push` alone is enough

Any time you change a file later: `git add .` → `git commit -m "describe the change"` → `git push`.

## 3. Set up Firebase (free) to store responses

1. Go to console.firebase.google.com → **Add project** → name it anything → finish the wizard.
2. In the left sidebar, go to **Build → Firestore Database → Create database**. Start in **test mode** for now.
3. Go to **Project settings** (gear icon) → scroll to **Your apps** → click the `</>` (web) icon → register the app (no need for Firebase Hosting).
4. Copy the `firebaseConfig` object it shows you.
5. Paste those values into `firebase-config.js` in this project, replacing the placeholders.

### Lock down access before sharing the link publicly

Test mode allows anyone to read *and* write with no limits, which is fine while you're building but not once the link is public. In Firestore → **Rules**, use something like:

```
rules_set = service cloud.firestore {
  match /databases/{database}/documents {
    match /responses/{doc} {
      allow create: if true;   // anyone can submit
      allow read: if false;    // nobody can read without you changing this
    }
  }
}
```

Then only view responses yourself via the Firebase console (Firestore Database → Data tab), or temporarily set `allow read: if true` while you check `responses.html`, and turn it back off after.

## 4. Test it locally

Opening `index.html` directly in a browser works for a quick look, but some browsers block Firestore requests from `file://` pages. If you hit issues, run a tiny local server instead:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## 5. Put it online with GitHub Pages (free hosting)

After pushing your code (step 2), go to your repo on GitHub → **Settings → Pages** → under "Build and deployment", set **Source: Deploy from a branch**, branch **main**, folder **/(root)** → **Save**. GitHub gives you a live URL after a minute, like `https://yourname.github.io/survey-site/`.

From now on, every `git push` updates the live site within a minute or two.

## 6. Customize the survey

Add or edit questions in `index.html` inside `<form id="survey-form">` — give each input a `name`, then add that field to the `entry` object in `script.js` so it gets saved. Add a matching column in `responses.js` if you want it to show up in the table.
