# rajat-sharma-portfolio

Personal portfolio site for Rajat Sharma — Senior Software Engineer (Django / DRF / AWS).

Static HTML/CSS/JS, no build step, auto-deployed to GitHub Pages via GitHub Actions on every push to `main`.

## 1. Create the private repo

I can't create the GitHub repo directly from this chat (no GitHub connection here), but this takes under a minute with the GitHub CLI:

```bash
# from inside this project folder
gh auth login                      # one-time, if not already logged in
gh repo create rajat-sharma-portfolio --private --source=. --remote=origin --push
```

If you don't have `gh` installed, do it via the website instead:

1. Go to https://github.com/new
2. Repository name: `rajat-sharma-portfolio`
3. Visibility: **Private**
4. Don't initialize with a README (this project already has one)
5. Create repo, then run:

```bash
cd rajat-sharma-portfolio
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/rajat4665/rajat-sharma-portfolio.git
git push -u origin main
```

## 2. Turn on GitHub Pages

Even on a private repo, GitHub Pages works fine (Pages sites are public URLs, but your source stays private):

1. In the repo: **Settings → Pages**
2. Under "Build and deployment", set **Source** to **GitHub Actions**
3. Push to `main` (or re-run the workflow from the **Actions** tab)
4. Your site will be live at:
   `https://rajat4665.github.io/rajat-sharma-portfolio/`

> Note: GitHub Pages on private repos requires **GitHub Pro, Team, or Enterprise**. If your account is on the free plan, either make the repo public (code stays visible, which is normal for a portfolio) or deploy to Netlify/Vercel instead — both deploy straight from a private repo for free. Ask me if you'd like a Netlify/Vercel workflow instead of Pages.

## 3. Local preview

No build tools needed — just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```

## Project structure

```
.
├── index.html
├── assets/
│   ├── css/styles.css
│   ├── js/script.js
│   └── files/Rajat_Sharma_CV.pdf   # linked from the nav "resume.pdf" button
└── .github/workflows/deploy.yml    # GitHub Pages deploy on push to main
```

## Updating your resume

The "Download resume" buttons point to `assets/files/Rajat_Sharma_CV.pdf` and use the `download`
attribute, so clicking them always downloads the file (never just opens it in a new tab, even on
mobile browsers that would otherwise preview PDFs inline).

To update your CV later: just replace that file with your new version, **keeping the same filename**
(`Rajat_Sharma_CV.pdf`), commit, and push. No HTML changes needed. If you want a different filename,
update both `href` and `download` attributes on the two `resume.pdf` / "Download resume" links in
`index.html` to match.

## Updating content

All content lives directly in `index.html` — experience entries are under `#experience`,
projects under `#projects`, skills under `#skills`. No CMS, no data file, just edit the HTML directly.
