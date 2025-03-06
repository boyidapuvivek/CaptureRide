import React from "react";
import { useState } from "react";

const UploadToCloudinary = async (imageUri) => {
  const data = new FormData();
  data.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: "upload.jpg",
  });
  data.append("upload_preset", "CaptureRide");
  data.append("cloud_name", "dwmdooor4");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dwmdooor4/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const jsonResponse = await response.json();
    return jsonResponse.secure_url;
  } catch (err) {
    console.log("Uplode Error :", err);
    return null;
  }
};

export default UploadToCloudinary;
