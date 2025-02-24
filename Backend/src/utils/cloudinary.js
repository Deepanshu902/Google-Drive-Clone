import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({ 
    cloud_name: 'dj6kl9cp3', 
    api_key: '568328796182512', 
    api_secret: 'TlocSA0SC4oElZyvqsKWyZv1phw' 
});

const uploadOnCloudinary = async (localFilePath,oldImagePublicId = null) => {
    try {
        if (!localFilePath) {
            console.log("🚨 No file path provided to Cloudinary upload function")
            return null
        };

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // Auto-detect the file type (image, video, etc.)
             folder: "google-drive-clone"
        });

        if (oldImagePublicId) { // delete old file 
            const deleteResponse = await cloudinary.uploader.destroy(oldImagePublicId);
            console.log("Old image deleted:", deleteResponse);
        }

        // Check if the file exists before deleting it
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); // Delete the local file after a successful upload
        }
        
        
        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error);

        // Attempt to delete the file only if it exists
        if (fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath); // Clean up the local file
            } catch (deleteError) {
                console.error("Error deleting file:", deleteError);
            }
        }

        return null;
    }
};

const deleteCloudinaryFile = async(publicid)=>{
    if(!publicid) return null

    const deleteResponse = await cloudinary.uploader.destroy(publicid)

    return deleteResponse
}

export { uploadOnCloudinary,deleteCloudinaryFile };
