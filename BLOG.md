# "Drinking Our Own Champagne" with Cloudinary Video Player

[Code Repo](https://github.com/cloudinary-training/podcasts)

[Podcast Website](https://cloudinary.com/podcasts)

This is a story about using your company's product to solve your organization's problem.  "Drinking Our Own Champagne" refers to our use of the Cloudinary Video Player to serve videos created by the training organization.   Using your company's software in-house was made famous by Microsoft's use of the term "Eating your own dog food".  Microsoft used this term because they were asking employees to use alpha and beta versions of their products.  In this story, we are using production Video Player code.

## The Problem

A cross functional team including employees from Customer Training and Marketing are working on an initiative that involves releasing video podcasts weekly.  The subject matter is split between two podcast brands: **Dev Jams** and **MX Matters**.  **Dev Jams** is an opportunity for us to showcase projects created by our customer, and to get to know them better.  **MX Matters** provides a platform to share information about our evolving product line from our Product team.  

The video podcasts are about an hour in length.  We provide access to this content through YouTube, Spotify, Apple, ... <not sure all>.  We also host a web page through the [cloudinary.com](https://www.cloudinary.com/podcasts) website that allows users to view the video.  Because the videos are longer than 1 minute, and we want to prevent buffering, we are using a feature of the Cloudinary Video Player called Adaptive Bitrate Streaming  (ABS).

## What is ABS 
Adaptive Bitrate Streaming is a technique for streaming video that can be run in the application layer of the internet: HTTP.  Essentially the video server "chunks" up the video and the client browser reads in chunks using AJAX.  It works by detecting a users bandwidth on the client side, and then adjusting the quality of the streaming accordingly.  If the client's network supports a heavier load, the size of the chunks and the quality of the video will be greater.  For a client with a lower bandwidth network, the chunks can be made smaller.  The net result is that when the viewer clicks on the Video Player start control, video is immediately streamed.

Not only does the Cloudinary Video Player help with ABS, but Cloudinary can create the "chunks" on the server so that they are all available when needed.

There are several implementations of ABS, such as Dynamic Adaptive Streaming Over HTTP (MPEG-DASH) and Apple's HTTP Live Streaming (HLS). The different implementations use different algorithms to provide that highest bitrate possible, given the network in which streaming is occurring.  

Browsers support video containers, such as `mp4`. Containers are often referred to as formats. Containers use codecs, which are algorithms for compression.  The `H.264` codec is considered Universal as it is used in many containers and therefore usable in many browsers and devices. Learn more about containers and codecs [here](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter).

HLS requires a manifest, which is basically a list that points to a set of chunked files.  The HLS manifest has an extension of `m3u8` and a sample is shown below.  You can see that it is a listing of `ts` files that contain the video chunks.  While `ts` and `m3u8` are not natively supported in all browsers, the Cloudinary Video Player makes it possible to use HLS with `H.264`.

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

If you look closely at the path of these files, and you're familiar with Cloudinary URL's, you'll notice these are files served from Cloudinary. They have 2 transformations.  The first is for an audio frequency that guarantees a moving mouth matches the audio what the listener hears: `af_441000`. The second provides a file format of `ts`, so that the file can be fetched into the browser based on the HLS manifest.  These are actually both transformations created eagerly and explicitly from the original `mp4` file uploaded to Cloudinary. Eager transformations are those that are created asynchronously and Explicit transformation are those that are created after the upload of the asset is complete.  We'll look at the workflow for this next.

```bash
/cloudinary-marketing/video/upload/af_44100/v1/podcast/devjams/ep3-ryanfiller-videoplayer.ts	
```

## Workflow

Creating, editing, uploading and transforming the videos for the podcasts are handled by Customer Training.  After that, there is a handoff to Marketing to have them published on the Podcast website.  Marketing works with an Agency to code and build the website pages.  The image below describes this workflow.

![Podcast Production and Delivery Workflow](./workflow.jpg)


By modularizing this workflow, we are able to let different people work on different aspects of the final product.  The five step process is described below.


1. The video is recorded using [Zoom Record](https://support.zoom.us/hc/en-us/sections/200208179-Recording).  
1. Next, the video is processed by [Descript](https://www.descript.com/), a tools that aids in cleaning up and transcribing the language used.  
1. The video is then enhanced with visuals in a post processing phase.  Once the video is ready it is uploaded as an `mp4` to Cloudinary.
1. Once the video is in Cloudinary, a script can be run to create the transformations (chunking and audio syncing) that prepares the video for streaming to the Video Player.
1. After the derived video files have been created, the public id is handed off to the web developers at the  A[Agency](https://www.msinteractive.com/) that works on the website.

We'll look at the code used to created the derived video chunks and the code used to render the video player in the next sections.

## Script to Create Derived Video for Use with ABS

The script shown below is used to create derived assets that can be requested by the Video Player to enable Adaptive Bitrate Streaming.

The code is setup as a function that accepts the Cloudinary public ID for the original video that was uploaded.

The function specifies and `eager` transformation.  As mentioned earlier, `eager` transformations are those that can be applied to assets that are already uploaded, as opposed to on-the-fly transformations that are apply to the original uploaded asset.  Eager transformations can by synchronous or asynchronous. Processing an hour long video takes time and many derived videos files are created, so it makes sense for this to be asynchronous.  In order to be notified that the entire process is complete, the `eager_notification_url` key is set with a website that can capture and report such notifications.  [webhook.site](https://webhook.site) is a website that can capture and report such notifications and its free to use.

This code uses the [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration).  The Node SDK function, `cloudinary.uploader.explicit`, calls upon the [Upload API explicit method ](https://cloudinary.com/documentation/image_upload_api_reference#explicit_method) to act on a previously uploaded Video with the public ID provided as a parameter to the `explicityHDProfile` function. 

The options specify that the asset is a video.  The `eager` key provides an array of transformations.  The first transformation is a [`streaming_profile`](https://cloudinary.com/documentation/admin_api#adaptive_streaming_profiles), which a is a collection of transformations that can be used to create ABS transformations per the quality indicated (`hd`) and the format (`m3u8`).  
We also provide transformations for `audio_frequency` of `44100`.  This help the audio to match the speaker's lip movement.

The `type` of `upload` is the default and makes the video assets public.  The `invalidate` set to `true` indicates that previously cached versions, if there are any, of these derived files should be invalidates so that they can be replaced.


```JavaScript
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

function explictHDProfile(publicId) {
  const options = {
    resource_type: "video",
    eager: [
      { streaming_profile: "hd", format: "m3u8" },
      {
        format: "mp4",
        transformation: [{ audio_frequency: 44100 }],
      },
      {
        format: "mp4",
        transformation: [{ audio_frequency: 44100 }, { video_codec: "h264" }],
      },
      {
        format: "m3u8",
        transformation: [{ audio_frequency: 44100 }],
      },
    ],
    eager_async: true,
    eager_notification_url:
      "https://webhook.site/",
    type: "upload",
    invalidate: true,
  };
  cloudinary.uploader.explicit(publicId, options, function (error, result) {
    if (error) console.log("error", error);
    else console.log(result);
  });
}

```


## Web Page Uses Fancybox

“The challenge for this project was to build a single modal and video player in which the content would dynamically change based on the thumbnail clicked.
There were many approaches that seemed to work when we were dealing with just a single video implementation, but when it came to reloading the player with a new video on the fly we ran into a few walls along the way, and had to step back and rethink our approach.
The result was to setup and instance of the player including all parameters and transformations done explicitly through JavaScript, as adding a mix of JS and inline to the player created issues. We then used data attributes to set the poster and source on click of the desired item, the poster also had to be set before the video source or it would not work.
Fortunately I had the privilege of working hands on with Becky to get through these issues, two minds are always better than one when it comes to problem solving. we now have a modal based player that loads videos on demand and is scalable for any number of videos. ”  Sean Massa from Moonstone






## web page to test


