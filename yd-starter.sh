#!/bin/bash
for url in "$@"
do
  youtube-dl --extract-audio --audio-quality 0 --newline --audio-format mp3 \
           $url | 
   grep --line-buffered -oP '^\[download\].*?\K([0-9.]+\%|#\d+ of \d)' 
done
