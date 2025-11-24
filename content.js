(function() {
    const HIDE_CLASSES = [
        "user-gray", "user-green", "user-cyan", "user-blue", "user-violet",
        "user-orange", "user-red", "user-admin", "user-unrated", "user-legendary",
        "rating", "rank"
    ];

    function nukeRatings() {
        // Strip colored classes
        document.querySelectorAll("a[href*='/profile/']").forEach(el => {
            el.style.color = "black";
            HIDE_CLASSES.forEach(cls => el.classList.remove(cls));
        });

        // Remove rating numbers and title text
        document.querySelectorAll(".rating, .rank").forEach(el => {
            el.style.display = "none";
        });

        // Remove rating graph
        const graph = document.querySelector("#profile-content .info__row");
        if (graph) graph.remove();

        // Hide rating change tables
        document.querySelectorAll("table.rating-table, .datatable.ratings").forEach(el => {
            el.remove();
        });
    }

    // Run instantly + observe dynamic loads
    nukeRatings();

    const observer = new MutationObserver(() => nukeRatings());
    observer.observe(document.body, { childList: true, subtree: true });
})();