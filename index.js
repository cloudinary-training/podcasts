require("dotenv").config();
const cloudinary = require("cloudinary").v2;
console.log(cloudinary.config().cloud_name);

// use explicit because upload takes place at a different
// time and is performed by a different person
function explictHDProfile(publicId) {
  const options = {
    resource_type: "video",
    eager: [
      { streaming_profile: "hd", format: "m3u8" },
      {
        format: "mp4",
        transformation: [{ quality: "auto" }],
      },
    ],
    eager_async: true,
    eager_notification_url:
      "https://webhook.site/20d13ebe-105c-4f04-9719-7e1e55f6ad94",
    type: "upload",
    invalidate: true,
  };
  cloudinary.uploader.explicit(publicId, options, function (error, result) {
    if (error) console.log("error", error);
    else console.log(result);
  });
}

explictHDProfile("podcast/mx_matters/mx-matters-episode5-Contentful_Drft02")