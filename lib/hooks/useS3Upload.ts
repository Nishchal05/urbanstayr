import { useState } from "react";

export function useS3Upload() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to upload file");
    
    const { key, publicUrl } = await res.json();

    setUploading(false);
    setProgress(100);
    return { key, publicUrl };
  };

  return { upload, uploading, progress };
}