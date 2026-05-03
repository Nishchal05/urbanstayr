import { useState } from "react";

export function useS3Upload() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    setProgress(0);

    // Step 1: Get presigned URL from your API
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
        size: file.size,
      }),
    });

    if (!res.ok) throw new Error("Failed to get upload URL");
    const { presignedUrl, key, publicUrl } = await res.json();

    // Step 2: Upload directly to S3 using the presigned URL
    await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    setUploading(false);
    setProgress(100);
    return { key, publicUrl };
  };

  return { upload, uploading, progress };
}