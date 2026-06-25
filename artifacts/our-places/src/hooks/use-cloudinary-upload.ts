import { useState } from "react";

interface UseCloudinaryUploadOptions {
  onSuccess: (url: string) => void;
  onError: () => void;
}

export function useCloudinaryUpload({ onSuccess, onError }: UseCloudinaryUploadOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File): Promise<void> => {
    setIsUploading(true);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append("file", file);

      setProgress(40);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      setProgress(80);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error ?? "Upload failed");
      }

      const data = (await response.json()) as { url: string };
      setProgress(100);
      onSuccess(data.url);
    } catch {
      onError();
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return { uploadFile, isUploading, progress };
}
