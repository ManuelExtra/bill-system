const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const CustomError = require("./customError");
const config = require("../config/sysConfig");
const path = require("path");

import { Request } from "express";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default {
  upload: (req: Request) => {
    var form = new formidable.IncomingForm({
      multiples: true,
      // maxFileSize: 25 * 1024 * 1024,
      // uploadDir: path.resolve(__dirname, '../../images')
    });

    return new Promise((res, rej) => {
      form.parse(req, function (err: Error, fields: any, file: any) {
        try {
          if (err) throw err;
          if (!file.image) throw new CustomError("No Image provided!.", 400);

          const images: Array<any> = Array.isArray(file.image)
            ? file.image
            : [file.image];

          if (images[0].name == "")
            throw new CustomError("Image is required!", 400);

          const validationError = validateImage(images);
          if (validationError) throw new CustomError(validationError, 400);

          return res(
            Promise.all(
              images.map(
                (image) =>
                  new Promise((resolve, reject) => {
                    cloudinary.uploader.upload(
                      image.filepath,
                      function (error: Error, result: any) {
                        if (error) return reject(error);

                        return resolve(result.secure_url);
                      }
                    );
                  })
              )
            )
          );
        } catch (error) {
          rej(error);
        }
      });
    });
  },
};

const validateImage = (imageArr: any) => {
  const maxNumberOfImages = config.MAXIMUM_NUMBER_OF_IMAGES_TO_UPLOAD;
  const validImageFormats = config.VALID_IMAGE_FORMATS;
  const maxUploadImageSize = config.MAX_UPLOAD_IMAGE_SIZE;

  if (imageArr.length > maxNumberOfImages)
    return `Exceeded number of files. Expected maximum is ${maxNumberOfImages}.`;

  // Check if they are all images
  const isValidFormat = imageArr.every((image: any) =>
    validImageFormats.includes(
      image.originalFilename.split(".")[
        image.originalFilename.split(".").length - 1
      ]
    )
  );
  if (!isValidFormat)
    return `Unsupported image format detected. Images must be in ${validImageFormats.join(
      ", "
    )}`;

  // Check if they dont exceed the file size
  const isValidSize = imageArr.every(
    (image: any) => image.size <= maxUploadImageSize
  );
  if (!isValidSize)
    return `Image max file size exceeded. Expected max file size is ${
      maxUploadImageSize / 1024
    } KB.`;

  return null;
};
