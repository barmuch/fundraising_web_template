import cloudinary from '../configs/cloudinary.js'

export const upload = async (files, preset) => {
    const imageFiles = files
    const uploadImages = []
    imageFiles.forEach((file) => {
        uploadImages.push(
            cloudinary.uploader.upload(file.path, {
                upload_preset: preset,
            })
        )
    })
    const uploadResponse = await Promise.all(uploadImages)
    const images = uploadResponse.map((image) => ({
        url: image.secure_url,
        filename: image.original_filename,
        public_id: image.public_id,
    }))

    return images
}

export const destroy = async (arrayOfPublicIds) => {
    const deleteImages = []
    arrayOfPublicIds.forEach((publicId) => {
        deleteImages.push(cloudinary.uploader.destroy(publicId))
    })
    await Promise.all(deleteImages)
}
