jQuery(document).ready(function () {
  jQuery(".fancybox").fancybox();
  // Initialize player
  var cloudinaryCld = cloudinary.Cloudinary.new({
    cloud_name: "cloudinary-training",
  });
  var options = {
    sourceTypes: ["hls", "mp4"],
    bigPlayButton: "init",
    muted: false,
    sourceTransformation: {
      "hls": [{ streaming_profile: "hd" }],
      "mp4": [{ quality: "auto" }],
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
