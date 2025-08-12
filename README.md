# Teaching Topics — Click to Learn (No‑Code Editing)

A tiny, free app you can host on **GitHub Pages**. It loads your content from `topics.json`, so you can add/edit topics without touching HTML/CSS/JS.

## What you get
- **Search + filters** (Subject, Phase) and clickable **tags**
- **Cards** for each topic; **modal** with full details + links
- **One file to edit**: `topics.json` (keep it valid JSON)

---

## Quick start (5–10 minutes)

1. **Create a new GitHub repo** (e.g., `teaching-topics`).
2. **Upload all files** from this ZIP to the repo root (`index.html`, `styles.css`, `script.js`, `topics.json`, `README.md`).
   - In GitHub, click **Add file → Upload files**.
3. **Enable GitHub Pages**  
   - Go to **Settings → Pages**  
   - Under *Source*, choose **Deploy from a branch**  
   - Select **main** and **/(root)** folder → **Save**  
   - Wait 1–2 minutes, your site will be live at the URL GitHub shows you.
4. Open the site. Try the search and filters, click a card, and read the modal.

---

## Editing content (no coding)

Open **`topics.json`** in GitHub and click the ✏️ edit icon. Add, change, or delete topic objects. Then **Commit changes** — your site updates automatically.

Each topic looks like this:

```json
{
  "id": "unique-id",
  "title": "Title here",
  "subject": "English",
  "phase": ["Foundation Phase"],
  "ages": "5–9",
  "tags": ["Creative Writing", "Idea Generation"],
  "summary": "Short summary appears on the card.",
  "content": "Longer text appears in the modal. Use new lines to separate points.",
  "links": [{ "label": "Helpful resource", "url": "https://example.com" }],
  "lastUpdated": "2025-08-12"
}
```

**Notes**
- `phase` can be a single string **or** an array of strings (e.g., `["Foundation Phase","Intermediate Phase"]`).
- You can leave out any field you don’t need; the app will hide empty fields.
- Keep `topics.json` **valid JSON** (no trailing commas, double quotes around keys & strings).
- If something breaks, paste your JSON into an online *JSON validator* to spot mistakes quickly.

---

## Customise the look
- Edit colours and spacing in **`styles.css`**.
- Change the site title in `<title>` and the page header inside **`index.html`**.

---

## Common tweaks
- **Add more filters**: add a new property (e.g., `"grade": "Grade 3"`) to each topic, then copy the Subject/Phase approach in `script.js` to build a new `<select>`.
- **Reorder cards**: change the order of objects in `topics.json` or sort in `script.js`.
- **Link to downloadable files**: upload PDFs to your repo and add their links in each topic’s `links` array.

---

## FAQ

**Q: Can I use this without coding knowledge?**  
Yes. You only edit `topics.json` (like a filled-in form).

**Q: Is this really free?**  
Yes. GitHub Pages hosts static sites for free.

**Q: Can I add images?**  
Yes. Upload images to the repo and link them in the `content` (use full links) or add an `image` field and extend the card layout in `index.html` if you like.

**Q: Can we collaborate?**  
Yes. You can invite collaborators on GitHub. Only one person should edit `topics.json` at a time to avoid merge conflicts.

---

Happy teaching!
