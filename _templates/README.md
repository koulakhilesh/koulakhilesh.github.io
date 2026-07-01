# Content templates

Ready-to-copy starter files for each content type. This folder is **tracked in git**
but **excluded from the Jekyll build** (see `exclude` in `_config.yml`), so nothing here
appears on the live site until you copy it into the right folder.

## How to publish content

| Template | Copy to | Becomes |
|---|---|---|
| `post.md` | `_posts/YYYY-MM-DD-your-title.md` | A blog post at `/writing/your-title/` |
| `project.md` | `_projects/your-project.md` | A project at `/projects/your-project/` |
| `making.md` | `_making/your-entry.md` | A making entry at `/making/your-entry/` |

`project-2.md` is a second project example (different tech stack) for reference.

### Notes
- **Posts** must be named `YYYY-MM-DD-title.md`.
- For **projects**, set `featured: true` to surface it on the homepage.
- For **making**, `kind` can be `writeup` or `gallery`; add an `image:` path to give it a
  thumbnail in the gallery.
- Until you add real content, each section on the site shows a tidy empty-state placeholder.
