import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";

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
 * Parse cloudinary://API_KEY:API_SECRET@CLOUD_NAME into config parts.
 */
function parseCloudinaryUrl(rawUrl: string): { cloud_name: string; api_key: string; api_secret: string } | null {
  try {
    // Strip accidental "CLOUDINARY_URL=" prefix if user pasted the whole line
    let url = rawUrl.trim();
    if (url.toLowerCase().startsWith("cloudinary_url=")) {
      url = url.slice("cloudinary_url=".length);
    }
    // Replace cloudinary:// with https:// so Node URL parser handles it correctly
    const normalised = url.replace(/^cloudinary:\/\//, "https://");
    const parsed = new URL(normalised);
    return {
      api_key: decodeURIComponent(parsed.username),
      api_secret: decodeURIComponent(parsed.password),
      cloud_name: parsed.hostname,
    };
  } catch {
    return null;
  }
}

/**
 * POST /upload
 *
 * Accepts multipart/form-data with a `file` field.
 * Uploads to Cloudinary and returns the public secure URL.
 */
router.post("/upload", upload.single("file"), async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "No file provided" });
    return;
  }

  const rawUrl = process.env.CLOUDINARY_URL;
  if (!rawUrl) {
    res.status(500).json({ error: "Image upload not configured (missing CLOUDINARY_URL)" });
    return;
  }

  const config = parseCloudinaryUrl(rawUrl);
  if (!config) {
    res.status(500).json({ error: "Invalid CLOUDINARY_URL format. Expected: cloudinary://API_KEY:API_SECRET@CLOUD_NAME" });
    return;
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const crypto = await import("node:crypto");
    const signStr = `folder=sonradan-gurmeler&timestamp=${timestamp}${config.api_secret}`;
    const signature = crypto.createHash("sha256").update(signStr).digest("hex");

    const formData = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    formData.append("file", blob, req.file.originalname);
    formData.append("api_key", config.api_key);
    formData.append("folder", "sonradan-gurmeler");
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${config.cloud_name}/image/upload`,
      { method: "POST", body: formData },
    );

    if (!uploadRes.ok) {
      const err = await uploadRes.json().catch(() => ({})) as Record<string, unknown>;
      req.log.error({ err }, "Cloudinary API error");
      res.status(500).json({ error: "Image upload failed" });
      return;
    }

    const data = await uploadRes.json() as { secure_url: string };
    res.json({ url: data.secure_url });
  } catch (error) {
    req.log.error({ err: error }, "Cloudinary upload failed");
    res.status(500).json({ error: "Failed to upload image" });
  }
});

export default router;
