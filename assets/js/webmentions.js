(() => {
    const webmentionRootSelector = "[data-webmentions]";
    const endpoint = "https://webmention.io/api/mentions.jf2";

    const formatDate = (value) => {
        if (!value) {
            return "";
        }

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(date);
    };

    const safeUrl = (value) => {
        if (!value) {
            return null;
        }

        try {
            const url = new URL(value);
            if (url.protocol !== "http:" && url.protocol !== "https:") {
                return null;
            }
            return url.toString();
        } catch {
            return null;
        }
    };

    const sourceLabel = (entry) => {
        const authorName = entry?.author?.name?.trim();
        if (authorName) {
            return authorName;
        }

        const sourceUrl = safeUrl(entry?.url);
        if (sourceUrl) {
            try {
                return new URL(sourceUrl).hostname;
            } catch {
                return sourceUrl;
            }
        }

        return "Unknown source";
    };

    const sortByDate = (entries) =>
        [...entries].sort((left, right) => {
            const leftDate = new Date(left.published || left["wm-received"] || 0).getTime();
            const rightDate = new Date(right.published || right["wm-received"] || 0).getTime();
            return leftDate - rightDate;
        });

    const buildCard = (entry, kind) => {
        const item = document.createElement("article");
        item.className = "webmentions__item";

        const header = document.createElement("header");
        header.className = "webmentions__item-header";

        const author = document.createElement("strong");
        const authorUrl = safeUrl(entry?.author?.url) || safeUrl(entry?.url);

        if (authorUrl) {
            const link = document.createElement("a");
            link.href = authorUrl;
            link.rel = "nofollow noopener noreferrer";
            link.target = "_blank";
            link.textContent = sourceLabel(entry);
            author.append(link);
        } else {
            author.textContent = sourceLabel(entry);
        }

        header.append(author);

        const meta = document.createElement("span");
        meta.className = "webmentions__item-meta";

        const kindLabel =
            kind === "comments"
                ? "Comment"
                : {
                      "like-of": "Liked",
                      "repost-of": "Reposted",
                      "bookmark-of": "Bookmarked",
                      "mention-of": "Mentioned",
                      rsvp: "RSVP",
                  }[entry?.["wm-property"]] || "Reaction";

        const dateLabel = formatDate(entry?.published || entry?.["wm-received"]);
        meta.textContent = dateLabel ? `${kindLabel} · ${dateLabel}` : kindLabel;
        header.append(meta);

        item.append(header);

        const contentText = entry?.content?.text?.trim();
        if (contentText) {
            const content = document.createElement("p");
            content.className = "webmentions__item-content";
            content.textContent = contentText;
            item.append(content);
        }

        const source = safeUrl(entry?.url);
        if (source) {
            const footer = document.createElement("footer");
            footer.className = "webmentions__item-footer";

            const link = document.createElement("a");
            link.href = source;
            link.rel = "nofollow noopener noreferrer";
            link.target = "_blank";
            link.textContent = "Open source";
            footer.append(link);
            item.append(footer);
        }

        return item;
    };

    const renderGroup = (root, name, entries) => {
        const group = root.querySelector(`[data-webmentions-group="${name}"]`);
        const list = root.querySelector(`[data-webmentions-list="${name}"]`);

        if (!group || !list) {
            return;
        }

        if (!entries.length) {
            group.hidden = true;
            return;
        }

        list.replaceChildren(...entries.map((entry) => buildCard(entry, name)));
        group.hidden = false;
    };

    const loadWebmentions = async (root) => {
        const status = root.querySelector("[data-webmentions-status]");
        const groups = root.querySelector("[data-webmentions-groups]");
        const target = root.dataset.webmentionTarget || window.location.href;

        try {
            const requestUrl = new URL(endpoint);
            requestUrl.searchParams.set("target", target);
            requestUrl.searchParams.set("sort-by", "published");
            requestUrl.searchParams.set("sort-dir", "up");

            const response = await fetch(requestUrl.toString(), {
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Webmention request failed with ${response.status}`);
            }

            const data = await response.json();
            const entries = Array.isArray(data?.children) ? data.children : [];

            const comments = sortByDate(
                entries.filter((entry) => entry?.["wm-property"] === "in-reply-to"),
            );

            const reactions = sortByDate(
                entries.filter((entry) =>
                    ["like-of", "repost-of", "bookmark-of", "mention-of", "rsvp"].includes(
                        entry?.["wm-property"],
                    ),
                ),
            );

            if (!comments.length && !reactions.length) {
                status.textContent = "No webmentions yet.";
                groups.hidden = true;
                return;
            }

            renderGroup(root, "comments", comments);
            renderGroup(root, "reactions", reactions);

            if (status) {
                status.hidden = true;
            }

            if (groups) {
                groups.hidden = false;
            }
        } catch (error) {
            console.error("Unable to load webmentions", error);
            if (status) {
                status.textContent = "Unable to load webmentions right now.";
            }
            if (groups) {
                groups.hidden = true;
            }
        }
    };

    document.querySelectorAll(webmentionRootSelector).forEach((root) => {
        void loadWebmentions(root);
    });
})();
