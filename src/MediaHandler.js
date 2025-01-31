import cloudinary from "./cloudinaryconfig";



export const uploadMedia = async (file, width, height) => {
    const formData = new FormData();
    formData.append('file', file);
    await cloudinary.uploader.upload(formData, {
        public_id: file.name,
    }).catch(err => console.log(err));

    return cloudinary.url(file.name, {
        secure: true,
        transformation: [
            { width, height, crop: "fill" }
        ]
    });

}







