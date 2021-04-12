# "Drinking Our Own Champagne" with Cloudinary Video Player

A cross functional team including people from Customer Training and Marketing have been working on an initiative to release video podcasts weekly.  The subject matter is split between two podcast brands: Dev Jams and MX Matters.  Dev Jams is an opportunity for us to showcase project created by our customer, and to get to know them better.  MX Matters provides a platform to share information about our evolving product line from our Product team.  

The video podcasts are about an hour in length.  We provide access to this content through YouTube, Spotify, Apple, ... <not sure all>.  We also host a web page through the cloudinary.com website that allows users to view the video.  Because the videos are longer than 1 minute, and we want to prevent buffering, we are using a feature of the Cloudinary Video Player named Adaptive Bitrate Streaming  (ABS).

## What is ABS 
Adaptive Bitrate Streaming is an technique for streaming video that can be run in the application layer of the internet.  Essentially the video server "chunks" up the video and the client browser reads in chunks using AJAX.  It works by detecting a users bandwidth on the client side, and then adjusting the quality of the streaming accordingly.  If the client's network supports a heavier load, the size of the chunks and the quality of the video will be greater.  For a lower bandwidth network, the chunks can be made smaller.  The net result is that when the viewer click on the start control, video is immediately available.

Not only does the Cloudinary Video Player help with ABS, but Cloudinary can create the "chunks" on the server so that they are all ready when needed.

There are several flavors of ABS, such as Dynamic Adaptive Streaming Over HTTP (MPEG-DASH) and Apple's HTTP Live Streaming (HLS). It's possible to create configurations that make use of multiple ABS protocols.  For the purpose of the Video Podcasts describe here, we decided to use HLS, as it a preferred protocol and supports the H.264 Codec.  While this codec does not run natively in all browsers, the Video Player allows it to be used in all browsers.

The H.264 Codec is a standard for coding and compression.  In terms of files, it requires a manifest that points to a set of chunked files.  The HLS manifest has an extension of `m3u8` and looks like this (portion shown below).  You can see that it is a listing of `ts` files that contain the video chunks.

```bash
#EXTM3U
#EXT-X-VERSION:4
#EXT-X-TARGETDURATION:4
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-PLAYLIST-TYPE:VOD
#EXTINF:3.960000,
#EXT-X-BYTERANGE:177096@0
ep3-ryanfiller-videoplayer.ts
#EXTINF:3.960000,
#EXT-X-BYTERANGE:450260@177096
ep3-ryanfiller-videoplayer.ts
#EXTINF:3.960000,
#EXT-X-BYTERANGE:198904@627356
ep3-ryanfiller-videoplayer.ts
#EXTINF:3.960000,
#EXT-X-BYTERANGE:191572@826260
ep3-ryanfiller-videoplayer.ts
#EXTINF:3.960000,
#EXT-X-BYTERANGE:202100@1017832
ep3-ryanfiller-videoplayer.ts
#EXTINF:3.960000,
#EXT-X-BYTERANGE:193452@1219932
ep3-ryanfiller-videoplayer.ts
#EXTINF:3.960000,
#EXT-X-BYTERANGE:205860@1413384
ep3-ryanfiller-videoplayer.ts
#EXTINF:3.960000,
#EXT-X-BYTERANGE:207364@1619244

```

If you inspect your browser's network tab you'll see a lot of `.ts` files being loaded and even pre-loaded. 

![Network tab .ts files](./network-ts.jpg)

If you look closely at the path of these files, and you're familiar with Cloudinary URL's, you'll notice these are files served from Cloudinary. They have 2 transformations.  The first is for an audio frequency that guarantees a moving mouth matches the audio what the listener hears: `af_441000`. The second provides  a format of `ts`, so that the file can be fetched into the browser based on the HLS manifest.  These are actually both transformations created eagerly and explicitly from the original `mp4` file uploaded to Cloudinary. Eager transformations are those that are created asynchronously and Explicit transformation are those that are created after the upload of the asset is complete.  We'll look at the workflow for this next.

```bash
/cloudinary-marketing/video/upload/af_44100/v1/podcast/devjams/ep3-ryanfiller-videoplayer.ts	
```

## Workflow


## Web Page Uses Fancybox

“The challenge for this project was to build a single modal and video player in which the content would dynamically change based on the thumbnail clicked.
There were many approaches that seemed to work when we were dealing with just a single video implementation, but when it came to reloading the player with a new video on the fly we ran into a few walls along the way, and had to step back and rethink our approach.
The result was to setup and instance of the player including all parameters and transformations done explicitly through JavaScript, as adding a mix of JS and inline to the player created issues. We then used data attributes to set the poster and source on click of the desired item, the poster also had to be set before the video source or it would not work.
Fortunately I had the privilege of working hands on with Becky to get through these issues, two minds are always better than one when it comes to problem solving. we now have a modal based player that loads videos on demand and is scalable for any number of videos. ”  Sean Massa from Moonstone


## working with agency that supports cloudinary website

## script to create transformations


## web page to test


## Links to site