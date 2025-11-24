(function() {
    'use strict';

    function safeRemove(el) {
        if (el && el.parentNode) el.remove();
    }

    function hide(sel) {
        document.querySelectorAll(sel).forEach(el => el.style.setProperty('display', 'none', 'important'));
    }

    /* ---------- Remove rating graphs ---------- */
    function removeGraphs() {
        hide('#rating-graph, .rating-graph, .rating-graph-container, .graph-container, .cf-rating-graph');
        hide('svg.rating-graph, svg.ratings-chart');
        hide('canvas');
    }

    /* ---------- Remove contest rating lines from profile ---------- */
    function removeContestRatingLine() {
        document.querySelectorAll('dt, dd, span, div, li').forEach(el => {
            const t = (el.textContent || '').toLowerCase().trim();
            if (!t) return;
            if (t.startsWith('contest rating') || t.includes('communityrating')) {
                const row = el.closest('li') || el.closest('tr') || el.closest('div') || el;
                safeRemove(row);
            }
        });
    }

    /* ---------- Remove rating-change column and last column from contests table ---------- */
    function scrubContestsTable() {
        document.querySelectorAll('table').forEach(table => {
            const ths = Array.from(table.querySelectorAll('th'));
            if (!ths.length) return;

            const headers = ths.map(h => (h.textContent || '').toLowerCase().trim());
            if (!headers.some(h => h.includes('contest'))) return;

            const removeIdxs = new Set();
            headers.forEach((h, i) => {
                if (h.includes('rating change') || h === 'rating') removeIdxs.add(i);
            });
            removeIdxs.add(headers.length - 1); // last column

            Array.from(removeIdxs).sort((a,b)=>b-a).forEach(idx => {
                if (ths[idx]) safeRemove(ths[idx]);
            });

            table.querySelectorAll('tr').forEach(tr => {
                const tds = Array.from(tr.querySelectorAll('td'));
                Array.from(removeIdxs).sort((a,b)=>b-a).forEach(idx => {
                    if (tds[idx]) safeRemove(tds[idx]);
                });
            });
        });
    }

    /* ---------- Remove ratings from mini-profile box ---------- */
    function removeMiniBoxRating() {
        const boxes = document.querySelectorAll('.userinfo, .userbox, .userbox-outer, .profileinfo, .sidebar, #sidebar');
        boxes.forEach(box => {
            Array.from(box.children).forEach(child => {
                const t = (child.textContent || '').toLowerCase();
                if (!t) return;
                if (t.includes('rating') || t.includes('contest rating') || t.includes('communityrating')) {
                    safeRemove(child);
                }
            });
        });
    }

    /* ---------- Restore all handles ---------- */
    function restoreHandles() {
        document.querySelectorAll('a[href*="/profile/"]').forEach(a => {
            a.style.setProperty('color', 'black', 'important');
            a.style.setProperty('font-weight', 'bold', 'important');
            a.style.setProperty('text-shadow', 'none', 'important');
        });
    }

    /* ---------- Main cleanup ---------- */
    function cleanAll() {
        try {
            removeGraphs();
            removeContestRatingLine();
            scrubContestsTable();
            removeMiniBoxRating();
            restoreHandles();
        } finally {
            // Ensure page is visible even if cleanup fails
            document.documentElement.style.visibility = 'visible';
        }
    }

    // Run immediately
    cleanAll();

    // Observe dynamically inserted content
    const root = document.querySelector('#page-content') || document.body;
    const observer = new MutationObserver(() => cleanAll());
    observer.observe(root, { childList: true, subtree: true });
})();