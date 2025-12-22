// utils/cloudinaryUpload.ts
export async function uploadToCloudinary(file: File): Promise<{secure_url : string ; document_public_id : string}> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "registration_uploads"); // ← Replace with your Cloudinary unsigned preset
  formData.append("folder", "agencies/documents"); // optional

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dl83bpmyz/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Upload failed");
  }

  const data = await response.json();
  const info = {secure_url : data.secure_url , document_public_id : data.public_id}
  return info; 
}