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
      "https://webhook.site",
    type: "upload",
    invalidate: true,
  };
  cloudinary.uploader.explicit(publicId, options, function (error, result) {
    if (error) console.log("error", error);
    else console.log(result);
  });
}

explictHDProfile("beverly-hillbillies");

