// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const burger = document.getElementById('navBurger');
const navLinks = document.querySelector('.nav-links');
if (burger) {
  burger.addEventListener('click', () => {
    const isOpen = navLinks.style.display === 'flex';
    if (isOpen) {
      navLinks.style.display = '';
    } else {
      navLinks.style.display = 'flex';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.flexDirection = 'column';
      navLinks.style.background = '#0B0E14';
      navLinks.style.padding = '20px 24px';
      navLinks.style.borderBottom = '1px solid #232B3D';
      navLinks.style.gap = '18px';
    }
  });
}

// Scroll-reveal for deploy log entries and project cards
const revealTargets = document.querySelectorAll('.entry, .project-card, .metric, .contact-card, .impact-card, .award-card');

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(14px)';
  el.style.transition = `opacity .5s ease ${Math.min(i * 0.03, 0.3)}s, transform .5s ease ${Math.min(i * 0.03, 0.3)}s`;
  io.observe(el);
});

// Render a GitHub-accurate dark contribution calendar
(async function loadContribCalendar() {
  const totalEl = document.getElementById('ghCalTotal');
  const monthsEl = document.getElementById('ghCalMonths');
  const gridEl = document.getElementById('ghCalGrid');
  if (!totalEl || !gridEl) return;

  try {
    const res = await fetch('https://github-contributions-api.jogruber.de/v4/rajat4665?y=last');
    if (!res.ok) throw new Error('API error: ' + res.status);
    const data = await res.json();
    const days = data.contributions || [];
    if (!days.length) throw new Error('No contribution data');

    const total = days.reduce((sum, d) => sum + d.count, 0);
    totalEl.textContent = total.toLocaleString() + ' contributions in the last year';

    const firstDate = new Date(days[0].date + 'T00:00:00Z');
    let row = firstDate.getUTCDay(); // 0 = Sun
    let col = 0;
    let lastMonth = -1;
    const monthMarkers = [];
    let cellsHTML = '';

    days.forEach((d) => {
      const dateObj = new Date(d.date + 'T00:00:00Z');
      const month = dateObj.getUTCMonth();
      if (month !== lastMonth) {
        monthMarkers.push({ col, label: dateObj.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }) });
        lastMonth = month;
      }
      cellsHTML += `<span class="gh-cell-day" data-level="${d.level}" style="grid-row:${row + 1};grid-column:${col + 1}" title="${d.count} contributions on ${d.date}"></span>`;
      row++;
      if (row > 6) { row = 0; col++; }
    });

    gridEl.innerHTML = cellsHTML;

    const pitch = 15; // 11px cell + 4px gap
    monthsEl.innerHTML = monthMarkers.map(m =>
      `<span class="gh-cal-month-label" style="left:${m.col * pitch}px">${m.label}</span>`
    ).join('');
    monthsEl.style.width = `${(col + 1) * pitch}px`;

  } catch (err) {
    totalEl.textContent = 'Contribution calendar unavailable right now';
    gridEl.innerHTML = `<span style="grid-column:1/-1;color:var(--text-faint);font-size:13px;">View live activity on <a href="https://github.com/rajat4665" target="_blank" rel="noopener" class="inline-link">GitHub</a>.</span>`;
  }
})();

// Fetch top repos from GitHub's public API
(async function loadTopRepos() {
  const grid = document.getElementById('reposGrid');
  if (!grid) return;

  const langColors = {
    Python: '#F2B33D', JavaScript: '#F2D33D', TypeScript: '#4FD1C5',
    HTML: '#E34F26', CSS: '#4FD1C5', Java: '#B07219', Shell: '#89E051'
  };

  try {
    const res = await fetch('https://api.github.com/users/rajat4665/repos?sort=pushed&per_page=100');
    if (!res.ok) throw new Error('GitHub API error: ' + res.status);
    const repos = await res.json();

    const top = repos
      .filter(r => !r.fork)
      .sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at) - new Date(a.pushed_at)))
      .slice(0, 6);

    if (!top.length) {
      grid.innerHTML = `<div class="repo-fallback">No public repositories found &mdash; check <a href="https://github.com/rajat4665" target="_blank" rel="noopener" class="inline-link">github.com/rajat4665</a> directly.</div>`;
      return;
    }

    grid.innerHTML = top.map(r => {
      const dotColor = langColors[r.language] || '#7C8698';
      return `
        <a class="repo-card" href="${r.html_url}" target="_blank" rel="noopener">
          <div class="repo-name">${r.name}</div>
          <p class="repo-desc">${r.description ? r.description : 'No description provided.'}</p>
          <div class="repo-meta">
            ${r.language ? `<span><span class="lang-dot" style="background:${dotColor}"></span>${r.language}</span>` : ''}
            <span>&#9733; ${r.stargazers_count}</span>
            <span>&#8944; ${r.forks_count}</span>
          </div>
        </a>`;
    }).join('');

    // Re-run reveal animation on newly injected cards
    const newCards = grid.querySelectorAll('.repo-card');
    newCards.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity .5s ease, transform .5s ease';
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  } catch (err) {
    grid.innerHTML = `<div class="repo-fallback">Couldn't load repos right now &mdash; view them directly on <a href="https://github.com/rajat4665" target="_blank" rel="noopener" class="inline-link">GitHub</a>.</div>`;
  }
})();

// Respect reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealTargets.forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.transition = 'none';
  });
}
