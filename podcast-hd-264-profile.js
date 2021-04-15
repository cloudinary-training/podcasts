require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.api
  .create_streaming_profile("podcast_hd_h264", {
    display_name: "Custom podcast h264",
    representations: [
      {
        transformation: [
          {
            width: 320,
            height: 240,
            video_codec: "h264",
            bit_rate: "192k",
            crop: "limit",
            audio_frequency: 44100
          },
        ],
      },
      {
        transformation: [
          {
            width: 480,
            height: 270,
            video_codec: "h264",
            bit_rate: "800k",
            crop: "limit",
            audio_frequency: 44100
          },
        ],
      },
      {
        transformation: [
          {
            width: 640,
            height: 360,
            video_codec: "h264",
            bit_rate: "2m",
            crop: "limit",
            audio_frequency: 44100
          },
        ],
      },
      {
        transformation: [
          {
            width: 960,
            height: 540,
            video_codec: "h264",
            bit_rate: "3500k",
            crop: "limit",
            audio_frequency: 44100
          },
        ],
      },
      {
        transformation: [
          {
            width: 1280,
            height: 720,
            video_codec: "h264",
            bit_rate: "5500k",
            crop: "limit",
            audio_frequency: 44100
          },
        ],
      },
    ],
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => console.log(error));
