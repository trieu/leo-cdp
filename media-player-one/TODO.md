
# Basic features for video player
* Autoplay when in-view  => DONE
* support Google Analytics  => DONE
* support HLS, adaptive streaming => DONE
* Custome CSS videojs themes => DONE
* Watermark image => DONE
* UI/UX for playing video from Facebook => DONE
* Support Vimeo (https://github.com/vimeo/player.js https://github.com/videojs/videojs-vimeo) => DONE
* Support DailyMotion (https://developer.dailymotion.com/player) => WORKING

# Advanced ad features
* Delay time show ads using config => DONE
* TVC Ad Position Configs (JSON for Pre-roll, Mid-roll, Post-roll) => DONE
* Display Banner Ad support
* support VMAP, delay show ads after specific time
* BackUp Ad Config => DONE

# Playlist
* Parse JSON playlist data and display as slideshow (pause video, show playlist)
* Autoplay all tracks from playlist
* Make CORS Ajax for new data when finish all tracks from playlist
* https://medium.com/recombee-blog/machine-learning-for-recommender-systems-part-1-algorithms-evaluation-and-cold-start-6f696683d0ed

# Refactoring
* Rename to Mediaplayer.one => DONE
* Gulp build script for distribution, CSS and build pipeline => DONE

# Fullscreen support
* https://codepen.io/bfred-it/pen/GgOvLM

# 360 Video Support
* https://github.com/flimshaw/Valiant360
* https://github.com/google/marzipano/tree/master/demos/video-multi-res
* https://www.omnivirt.com/360-video-player

# Netlife
* Play ad every 4 minutes (mid) => DONE
* No Preroll => DONE
* Can play postroll => DONE

* Stream test https://bitmovin.com/mpeg-dash-hls-examples-sample-streams/
* Gulp Setup: https://medium.com/devux/minifying-your-css-js-html-files-using-gulp-2113d7fcbd16

# CDN
* https://www.jsdelivr.com/

#How to merge dev branch into master: 
git branch -f master v2player
git push origin +v2player:master