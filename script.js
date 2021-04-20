jQuery(document).ready(function () {
  jQuery(".fancybox").fancybox();
  // Initialize player
  var cloudinaryCld = cloudinary.Cloudinary.new({
    cloud_name: "cloudinary-training",
  });
  var options = {
    sourceTypes: ["hls", "mp4"],
    bigPlayButton: "init",
    muted: true,
    sourceTransformation: {
      hls: [{ streaming_profile: "podcast_hd_h264" }],
      mp4: [{ audio_frequency: 44100 }, { quality: "auto" }],
    },
    playbackRates: [0.5, 1, 1.5, 2],
  };
  var media = cloudinaryCld.videoPlayer("sample-video-id", options);
  jQuery(document).on("click", ".fancybox.video-trigger", function () {
    var videoID = jQuery(this).data("video-id");
    var videoPoster = jQuery(this).data("video-poster");
    media.posterOptions({ publicId: videoPoster });
    media.source({ publicId: videoID });
  });
});
