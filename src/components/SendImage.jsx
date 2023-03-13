import React, { useState } from "react";
import { MdAddPhotoAlternate } from "react-icons/md";
import { storage } from "../firebase";
import { useEffect } from "react";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const SendImage = () => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const uploadImage = async () => {
      const date = new Date().getTime();
      const storageRef = ref(storage, `${"chatImage/" + date}`);

      try {
        await uploadBytesResumable(storageRef, image).then(() => {
          getDownloadURL(storageRef).then(async (downloadURL) => {
            console.log(downloadURL);
          });
        });
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    uploadImage();
  }, [image]);

  return (
    <>
      <label className="label w-[10%] flex justify-center bg-slate-600 ">
        <MdAddPhotoAlternate
          className=" hover:scale-[130%]  transition-transform ease-out"
          size={30}
        />
        <input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          className="hidden p-0 m-0"
        />
      </label>
    </>
  );
};

export default SendImage;
