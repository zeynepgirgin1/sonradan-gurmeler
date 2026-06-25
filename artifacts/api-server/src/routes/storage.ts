import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config();

const router: IRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

/**
 * POST /upload
 *
 * Accepts a multipart/form-data request with a `file` field.
 * Uploads to Cloudinary and returns the public URL.
 */
router.post("/upload", upload.single("file"), async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "No file provided" });
    return;
  }

  if (!process.env.CLOUDINARY_URL) {
    req.log.error("CLOUDINARY_URL environment variable is not set");
    res.status(500).json({ error: "Image upload not configured" });
    return;
  }

  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "sonradan-gurmeler",
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) reject(error ?? new Error("Upload failed"));
          else resolve(result as { secure_url: string });
        },
      );
      stream.end(req.file!.buffer);
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    req.log.error({ err: error }, "Cloudinary upload failed");
    res.status(500).json({ error: "Failed to upload image" });
  }
});

export default router;
