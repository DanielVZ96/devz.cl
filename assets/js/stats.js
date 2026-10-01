const scaleToggles = document.querySelectorAll('.stats-scale-toggle');
const chartViews = document.querySelectorAll('[data-stats-chart-view]');

for (const scaleToggle of scaleToggles) {
    if (!chartViews.length) continue;
    scaleToggle.hidden = false;
    scaleToggle.addEventListener('click', () => {
        const logarithmic = scaleToggle.getAttribute('aria-pressed') !== 'true';
        for (const toggle of scaleToggles) {
            toggle.setAttribute('aria-pressed', String(logarithmic));
            toggle.textContent = `Logarithmic scale: ${logarithmic ? 'on' : 'off'}`;
        }
        for (const view of chartViews) {
            view.hidden = view.dataset.statsChartView !== (logarithmic ? 'logarithmic' : 'linear');
        }
    });
}
