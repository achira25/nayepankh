/* NayePankh Foundation — main.js */

/* ── Dark Mode ─────────────────────────────── */
const html     = document.documentElement;
const themeBtn = document.getElementById('themeBtn');

const saved = localStorage.getItem('np-theme') || 'light';
html.setAttribute('data-theme', saved);

themeBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('np-theme', next);
  rebuildCharts();
});

/* ── Sticky header ─────────────────────────── */
const hdr = document.getElementById('siteHeader');
const onScroll = () => hdr.classList.toggle('stuck', scrollY > 80);
window.addEventListener('scroll', onScroll, { passive: true });

/* ── Hamburger ─────────────────────────────── */
const burger  = document.getElementById('hamburger');
const hdrNav  = document.getElementById('hdrNav');
burger.addEventListener('click', () => hdrNav.classList.toggle('open'));
hdrNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => hdrNav.classList.remove('open')));

/* ── Scroll reveal ─────────────────────────── */
const revealIO = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } }),
  { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
);
document.querySelectorAll('.js-reveal').forEach(el => revealIO.observe(el));

/* ── Counter ───────────────────────────────── */
function runCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const fmt    = el.dataset.format;
  const suffix = el.dataset.suffix || '';
  const dur    = 2000;
  const start  = performance.now();

  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3); // ease out cubic
    const v = Math.round(e * target);

    if (fmt === 'lakh') {
      el.textContent = v >= 100000 ? (v / 100000).toFixed(1) + 'L' + suffix : v.toLocaleString('en-IN') + suffix;
    } else {
      el.textContent = v.toLocaleString('en-IN') + suffix;
    }
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

const counterIO = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) { runCounter(e.target); counterIO.unobserve(e.target); } }),
  { threshold: 0.4 }
);
document.querySelectorAll('.counter').forEach(el => counterIO.observe(el));

/* ── Donate amounts ────────────────────────── */
document.querySelectorAll('.da').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.da').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* ── Contact form ──────────────────────────── */
function submitForm(e) {
  e.preventDefault();
  const ok = document.getElementById('cfOk');
  ok.classList.add('show');
  e.target.reset();
  setTimeout(() => ok.classList.remove('show'), 5000);
}

/* ── ML Tabs ───────────────────────────────── */
document.querySelectorAll('.ml-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ml-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.ml-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + tab.dataset.panel).classList.add('active');
  });
});

/* ── Charts ────────────────────────────────── */
const charts = {};

function palette() {
  const dark = html.getAttribute('data-theme') === 'dark';
  return {
    saffron: dark ? '#F07030' : '#E8600A',
    sage:    dark ? '#7AAA90' : '#5C7A6B',
    red:     dark ? '#E05040' : '#C0392B',
    blue:    '#4A90C4',
    text:    dark ? '#F0EBE0' : '#0D1117',
    muted:   dark ? 'rgba(240,235,224,.4)' : 'rgba(13,17,23,.35)',
    grid:    dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.07)',
    surf:    dark ? '#161B22' : '#fff',
  };
}

function base(p) {
  return {
    responsive: true,
    plugins: {
      legend: { labels: { color: p.muted, font: { family: 'DM Sans', size: 12 }, boxWidth: 12, padding: 14 } },
      tooltip: { backgroundColor: p.surf, titleColor: p.text, bodyColor: p.muted, borderColor: p.grid, borderWidth: 1 },
    },
    scales: {
      x: { grid: { color: p.grid }, ticks: { color: p.muted, font: { family: 'DM Sans', size: 11 } } },
      y: { grid: { color: p.grid }, ticks: { color: p.muted, font: { family: 'DM Sans', size: 11 } } },
    },
    animation: { duration: 600 },
    interaction: { intersect: false, mode: 'index' },
  };
}

function makeGrowth() {
  const p = palette();
  if (charts.g) charts.g.destroy();
  const ctx = document.getElementById('chartGrowth');
  if (!ctx) return;
  charts.g = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['2019','2020','2021','2022','2023','2024','2025','2026'],
      datasets: [
        { label: 'Actual',        data: [500,1200,3500,12000,35000,80000,150000,null], borderColor: p.saffron, backgroundColor: p.saffron+'22', pointBackgroundColor: p.saffron, pointRadius: 5, tension: 0.4, fill: true },
        { label: 'Linear Reg.',   data: [400,2000,5000,14000,30000,70000,140000,220000], borderColor: p.sage, borderDash:[6,4], pointRadius: 3, tension: 0.4 },
        { label: 'Polynomial',    data: [600,1800,4800,13000,34000,75000,155000,240000], borderColor: p.blue, borderDash:[3,3], pointRadius: 3, tension: 0.4 },
      ]
    },
    options: { ...base(p), plugins: { ...base(p).plugins, title: { display: false } } }
  });
}

function makeCities() {
  const p = palette();
  if (charts.c) charts.c.destroy();
  const ctx = document.getElementById('chartCities');
  if (!ctx) return;
  charts.c = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Kanpur','Ghaziabad','Lucknow','Agra','Others'],
      datasets: [{ data: [34,28,18,12,8], backgroundColor: [p.saffron,p.sage,p.blue,p.red,'#8B7355'], borderColor: p.surf, borderWidth: 3, hoverOffset: 8 }]
    },
    options: {
      responsive: true,
      cutout: '60%',
      plugins: {
        legend: { position: 'right', labels: { color: p.muted, font: { family: 'DM Sans', size: 12 }, padding: 14 } },
        tooltip: { backgroundColor: p.surf, titleColor: p.text, bodyColor: p.muted, borderColor: p.grid, borderWidth: 1 },
      },
      animation: { animateRotate: true, duration: 700 },
    }
  });
}

function makeImpact() {
  const p = palette();
  if (charts.i) charts.i.destroy();
  const ctx = document.getElementById('chartImpact');
  if (!ctx) return;
  charts.i = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Food Drive','Education','Clothes','Sanitary','Medical','Awareness'],
      datasets: [
        { label: 'Predicted', data: [92,88,79,85,76,81], backgroundColor: p.saffron+'CC', borderRadius: 4, borderSkipped: false },
        { label: 'Actual',    data: [89,85,77,82,74,79], backgroundColor: p.sage+'CC',    borderRadius: 4, borderSkipped: false },
      ]
    },
    options: { ...base(p), scales: { ...base(p).scales, y: { ...base(p).scales.y, max: 100, title: { display: true, text: 'Score / 100', color: p.muted, font: { size: 11 } } } } }
  });
}

function makeCompare() {
  const p = palette();
  if (charts.m) charts.m.destroy();
  const ctx = document.getElementById('chartCompare');
  if (!ctx) return;
  charts.m = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Accuracy','Speed','Interpretability','Scalability','Robustness'],
      datasets: [
        { label: 'Linear Reg.',    data: [78,95,90,85,72], borderColor: p.sage,    backgroundColor: p.sage+'22',    pointBackgroundColor: p.sage },
        { label: 'Random Forest',  data: [95,72,65,88,92], borderColor: p.saffron, backgroundColor: p.saffron+'22', pointBackgroundColor: p.saffron },
        { label: 'SVM',            data: [88,65,58,70,85], borderColor: p.blue,    backgroundColor: p.blue+'22',    pointBackgroundColor: p.blue },
        { label: 'Neural Net',     data: [93,55,45,95,90], borderColor: p.red,     backgroundColor: p.red+'22',     pointBackgroundColor: p.red },
      ]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          min: 0, max: 100,
          ticks: { color: p.muted, font: { size: 10 }, stepSize: 25, showLabelBackdrop: false },
          grid: { color: p.grid },
          pointLabels: { color: p.muted, font: { size: 11, family: 'DM Sans' } },
          angleLines: { color: p.grid },
        }
      },
      plugins: {
        legend: { labels: { color: p.muted, font: { family: 'DM Sans', size: 12 }, boxWidth: 12, padding: 14 } },
        tooltip: { backgroundColor: p.surf, titleColor: p.text, bodyColor: p.muted },
      },
      animation: { duration: 600 },
    }
  });
}

function rebuildCharts() {
  makeGrowth(); makeCities(); makeImpact(); makeCompare();
}

// Init charts when ML section enters viewport
const mlIO = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) { rebuildCharts(); mlIO.disconnect(); }
}, { threshold: 0.05 });
mlIO.observe(document.getElementById('ml'));
