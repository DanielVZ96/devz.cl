(() => {
    const article = document.querySelector("article");
    const indicators = document.querySelectorAll("[data-reading-remaining]");
    if (!article || !indicators.length) return;

    let frame;
    let hideTimer;
    const blob = indicators[0].closest(".sky-blob");

    const update = () => {
        frame = undefined;
        const articleTop = article.getBoundingClientRect().top + window.scrollY;
        const articleEnd = Math.max(articleTop + article.offsetHeight - window.innerHeight, articleTop + 1);
        const progress = Math.min(1, Math.max(0, (window.scrollY - articleTop) / (articleEnd - articleTop)));
        const remaining = Math.round((1 - progress) * 100);

        indicators.forEach((indicator) => {
            indicator.textContent = `${remaining}% left`;
            indicator.setAttribute("aria-label", `${remaining} percent of the article left`);
        });
    };

    const scheduleUpdate = () => {
        if (frame) return;
        frame = requestAnimationFrame(update);
    };

    const showWhileScrolling = () => {
        blob?.classList.add("is-scrolling");
        window.clearTimeout(hideTimer);
        hideTimer = window.setTimeout(() => {
            blob?.classList.remove("is-scrolling");
        }, 2400);
        scheduleUpdate();
    };

    update();
    window.addEventListener("scroll", showWhileScrolling, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
})();
