KEEP THIS FOLDER — the two videos were left out of the zip, not deleted.

The zip had a size limit, and these two files are 33 MB between them and
unchanged since v7. Copy them back from your existing project before you build:

    public/media/cpt-seeds-story.mp4       (15 MB)
    public/media/seed-expedition.mp4       (18 MB)

Without them the About page and the CPT Seeds section show their poster images
and no video. Nothing breaks; the video simply does not play.

The poster images (.jpg) ARE in this zip, so you only need the two .mp4 files.

If you re-record either video, compress it first — a raw phone recording is
20 MB or more and makes the page feel broken on a slow connection:

  ffmpeg -i input.mp4 -vf "scale=432:-2,fps=24" -c:v libx264 -preset veryslow \
    -crf 32 -pix_fmt yuv420p -c:a aac -b:a 48k -ac 1 -movflags +faststart out.mp4
