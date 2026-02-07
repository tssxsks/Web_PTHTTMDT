import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load đúng .env ở BE/
dotenv.config({ path: path.join(__dirname, "../.env") });

const cloudinaryV2 = cloudinary.v2;

// Check env trước khi config (tránh crash)
if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error("Missing Cloudinary env vars. Check BE/.env (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)");
}

// Configure cloudinary
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// (optional) ping
cloudinaryV2.api.ping()
  .then(() => console.log("Cloudinary OK"))
  .catch(err => console.error("Cloudinary FAIL:", err?.message || err));

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,
  params: async () => ({
    folder: "shoe-store",
    resource_type: "image",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  }),
});

// Storage for product images
export const upload = multer({ storage });

// Storage for banners
const bannerStorage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,
  params: async () => ({
    folder: "banners",
    resource_type: "image",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 1200, height: 400, crop: "limit" }],
  }),
});

export const uploadBanner = multer({ storage: bannerStorage });

// Storage for main types
const mainTypeStorage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,
  params: async () => ({
    folder: "maintypes",
    resource_type: "image",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 400, height: 400, crop: "limit" }],
  }),
});

export const uploadMainType = multer({ storage: mainTypeStorage });

export { cloudinaryV2 as cloudinary };
