#!/bin/bash
for url in "$@"
do
  youtube-dl --extract-audio --audio-quality 0 --newline --audio-format mp3 \
           https://www.youtube.com/playlist?list=PL1C815DB73EC2678E | 
   grep --line-buffered -oP '^\[download\].*?\K([0-9.]+\%|#\d+ of \d)' 
done
