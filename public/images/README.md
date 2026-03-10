# Exercise images

Each stretch can show a **static image** plus the existing **instruction cue** as the “how to” description.

## Adding images

1. Add image files to this folder (`public/images/`).
2. Name each file by **exercise id** with a `.jpg` extension (e.g. `cat-cow.jpg`). You can also use `.png` or `.webp` if you update `getImageUrl` in `src/lib/exerciseImages.ts` to match.
3. No code changes are required for new images.

**Exercise ids and file names:**

| Exercise              | File name              |
|-----------------------|------------------------|
| Cat-Cow               | `cat-cow.jpg`          |
| Figure Four Stretch   | `figure-four.png`      |
| Glute Bridge          | `glute-bridge.jpg`     |
| Hip Circles           | `hip-rotations.jpg`    |
| Seated Hamstring      | `hamstring-stretch.jpg` |
| Child's Pose          | `childs-pose.jpg`     |
| Standing Quad         | `quad-stretch.jpg`     |
| Wall Calf Stretch    | `calf-stretch.jpg`     |
| World's Greatest      | `worlds-greatest.jpg` |

If an image is missing or fails to load, the card shows a “No image” placeholder. The **description** (how to do the stretch) is always the exercise’s instruction cue and appears on the card and in the expanded view.

## Sourcing images

Use your own photos, stock photos (with the right license), or free image sites. Prefer clear shots that show the stretch or pose. The description text is already in the app (instruction cue); the image is a visual aid.
