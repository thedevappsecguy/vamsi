const notesList = document.getElementById("notes-list");
const notesStatus = document.getElementById("notes-status");

function setStatus(title, description, icon = "history_edu") {
    if (!notesStatus) {
        return;
    }

    const iconNode = notesStatus.querySelector(".notes-icon");
    const titleNode = notesStatus.querySelector(".notes-title");
    const descriptionNode = notesStatus.querySelector(".notes-desc");

    if (iconNode) {
        iconNode.textContent = icon;
    }

    if (titleNode) {
        titleNode.textContent = title;
    }

    if (descriptionNode) {
        descriptionNode.textContent = description;
    }

    notesStatus.hidden = false;
}

function hideStatus() {
    if (notesStatus) {
        notesStatus.hidden = true;
    }
}

function isSafeRelativeHref(href) {
    return typeof href === "string"
        && href.length > 0
        && !href.startsWith("//")
        && !href.includes(":")
        && !href.startsWith("#");
}

function formatDate(dateValue) {
    if (typeof dateValue === "string" && /[A-Za-z]{3}\s+\d{1,2},\s+\d{4}/.test(dateValue)) {
        return dateValue;
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Undated";
    }

    return new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "numeric"
    }).format(date);
}

function getSortTimestamp(dateValue) {
    const date = new Date(dateValue);
    return Number.isNaN(date.getTime()) ? Number.NEGATIVE_INFINITY : date.getTime();
}

function createTag(label) {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = label;
    return tag;
}

function createNoteRow(note) {
    const article = document.createElement("article");
    article.className = "glass-card note-row";

    const link = document.createElement("a");
    link.className = "note-row-link";
    link.href = note.href;

    const date = document.createElement("span");
    date.className = "note-row-date";
    date.textContent = formatDate(note.date);

    const main = document.createElement("div");
    main.className = "note-row-main";

    const title = document.createElement("h3");
    title.className = "note-row-title";
    title.textContent = note.title;

    const summary = document.createElement("p");
    summary.className = "note-row-summary";
    summary.textContent = note.summary;

    main.append(title, summary);

    const tags = document.createElement("div");
    tags.className = "note-row-tags";

    for (const label of note.tags) {
        tags.appendChild(createTag(label));
    }

    const cta = document.createElement("span");
    cta.className = "note-row-cta";
    cta.textContent = "Open";

    link.append(date, main, tags, cta);
    article.appendChild(link);

    return article;
}

function validateNote(note) {
    return note
        && typeof note.title === "string"
        && typeof note.summary === "string"
        && typeof note.date === "string"
        && Array.isArray(note.tags)
        && isSafeRelativeHref(note.href);
}

async function loadNotes() {
    if (!notesList || !notesStatus) {
        return;
    }

    try {
        const response = await fetch("notes.json", { cache: "no-store" });

        if (!response.ok) {
            throw new Error(`Unexpected response: ${response.status}`);
        }

        const notes = await response.json();
        const safeNotes = Array.isArray(notes)
            ? notes
                .filter(validateNote)
                .sort((left, right) => getSortTimestamp(right.date) - getSortTimestamp(left.date))
            : [];

        if (!safeNotes.length) {
            setStatus(
                "No Notes Yet",
                "Add entries to notes.json and create matching static note pages under notes/."
            );
            return;
        }

        const fragment = document.createDocumentFragment();

        for (const note of safeNotes) {
            fragment.appendChild(createNoteRow(note));
        }

        notesList.replaceChildren(fragment);
        hideStatus();
    } catch (error) {
        console.error("Failed to load notes:", error);
        setStatus(
            "Notes Unavailable",
            "The note index could not be loaded. Check that notes.json is present and served with the site.",
            "error"
        );
    }
}

loadNotes();
