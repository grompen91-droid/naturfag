# Video files

Production clips are hosted on **Vercel Blob**; URLs live in `public/quiz.json`.

For **local dev** without hitting Blob, keep MP4s here (`klipp1.mp4`, `klipp2.mp4`) and set in `.env.local`:

```bash
VITE_USE_LOCAL_VIDEOS=true
```

Re-upload after changing a file (requires `BLOB_READ_WRITE_TOKEN` from the linked project):

```bash
vercel blob put public/videos/klipp1.mp4 -a public -p videos/klipp1.mp4
vercel blob put public/videos/klipp2.mp4 -a public -p videos/klipp2.mp4
```

Recommended: 720p H.264 MP4.
