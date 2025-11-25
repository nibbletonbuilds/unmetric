(function() {
    'use strict';

    function safeRemove(el) {
        if (el && el.parentNode) el.remove();
    }

    function hideSelector(sel) {
        document.querySelectorAll(sel).forEach(el => el.style.setProperty('display','none','important'));
    }

    /* ---------- Remove entire rating graph including axes ---------- */
    function removeGraphs() {
        hideSelector('#rating-graph');
        hideSelector('.rating-graph');
        hideSelector('.rating-graph-container');
        hideSelector('.graph-container');
        hideSelector('.cf-rating-graph');
        hideSelector('svg.rating-graph');
        hideSelector('svg.ratings-chart');
        hideSelector('canvas');
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

    /* ---------- Scrub only rating-change and last column in contests table ---------- */
    function scrubContestsTable() {
        document.querySelectorAll('table').forEach(table => {
            const ths = Array.from(table.querySelectorAll('th'));
            if (!ths.length) return;

            const headers = ths.map(h => (h.textContent || '').toLowerCase().trim());
            if (!headers.some(h => h.includes('contest'))) return;

            const removeIdxs = new Set();
            headers.forEach((h,i) => {
                if (h.includes('rating change')) removeIdxs.add(i);
            });
            removeIdxs.add(headers.length-1); // last column

            // Only remove the targeted columns
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

    /* ---------- NEW: Remove “New rating” column on /contests/with/<handle> ONLY ---------- */
    function removeNewRatingColumn() {
        if (!location.pathname.startsWith('/contests/with/')) return;

        document.querySelectorAll('table').forEach(table => {
            const ths = Array.from(table.querySelectorAll('th'));
            if (!ths.length) return;

            const headers = ths.map(h => (h.textContent || '').toLowerCase().trim());
            const idx = headers.findIndex(h => h === 'new rating' || h.includes('new rating'));

            if (idx === -1) return;

            // remove header cell
            if (ths[idx]) safeRemove(ths[idx]);

            // remove column cells
            table.querySelectorAll('tr').forEach(tr => {
                const tds = tr.querySelectorAll('td');
                if (tds[idx]) safeRemove(tds[idx]);
            });
        });
    }

    /* ---------- Remove rating from mini-profile ---------- */
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

    /* ---------- Restore handles to black bold ---------- */
    function restoreHandles() {
        document.querySelectorAll('a[href*="/profile/"]').forEach(a => {
            a.style.setProperty('color','black','important');
            a.style.setProperty('font-weight','bold','important');
            a.style.setProperty('text-shadow','none','important');
        });
    }

    /* ---------- Hide page body initially to prevent flicker ---------- */
    document.documentElement.style.visibility = 'hidden';

    /* ---------- Run cleanup ---------- */
    function cleanAll() {
        removeGraphs();
        removeContestRatingLine();
        scrubContestsTable();

        removeNewRatingColumn();   // ← ★ ONLY NEW LINE ADDED

        removeMiniBoxRating();
        restoreHandles();
        document.documentElement.style.visibility = 'visible';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', cleanAll);
    } else {
        cleanAll();
    }

    // Observe dynamically inserted content
    const root = document.querySelector('#page-content') || document.body;
    const observer = new MutationObserver(cleanAll);
    observer.observe(root, { childList: true, subtree: true });
})();