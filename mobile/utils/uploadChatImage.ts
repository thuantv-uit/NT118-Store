import type { ImagePickerAsset } from "expo-image-picker";

type UploadableImage = Pick<ImagePickerAsset, "uri" | "mimeType" | "fileName"> & {
  name?: string;
};

function getEnvOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export async function uploadChatImage(
  image: UploadableImage
): Promise<string> {
  if (!image?.uri) {
    throw new Error("Image uri is required");
  }

  const cloudName = getEnvOrThrow("EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME");
  const uploadPreset = getEnvOrThrow("EXPO_PUBLIC_CLOUDINARY_CHAT_PRESET");

  const formData = new FormData();
  formData.append("file", {
    uri: image.uri,
    type: image.mimeType || "image/jpeg",
    name: image.fileName || image.name || `chat-${Date.now()}.jpg`,
  } as any);
  formData.append("upload_preset", uploadPreset);

  if (process.env.EXPO_PUBLIC_CLOUDINARY_CHAT_FOLDER) {
    formData.append("folder", process.env.EXPO_PUBLIC_CLOUDINARY_CHAT_FOLDER);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message || "Failed to upload image");
  }

  return payload.secure_url;
}
