import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { handleDemo } from "./routes/demo.js";
import { handleLogin, handleSignup, verifyAuth } from "./routes/auth.js";
import { handleAnalyze, handleGetHistory } from "./routes/analyze.js";

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept PDF, DOC, DOCX, and text files
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload PDF, DOC, DOCX, or TXT files.'));
    }
  }
});

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Basic health check
  app.get("/api/ping", (req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Demo route (legacy)
  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/signup", handleSignup);

  // Protected routes (require authentication)
  app.post("/api/analyze", verifyAuth, upload.single('resume'), (req, res) => {
    // Extract text from uploaded file or use provided text
    let resumeText = req.body.resumeText || '';
    
    if (req.file) {
      // In production, you would parse the file content here
      // For PDF: use pdf-parse library
      // For DOC/DOCX: use mammoth library
      // For now, we'll simulate file content
      resumeText = `[Resume content from ${req.file.originalname}]\n\nSample resume content for demonstration purposes. In production, this would be the actual extracted text from the uploaded file.`;
    }
    
    // Add extracted text to request body
    req.body.resumeText = resumeText;
    
    // Call the analyze handler
    handleAnalyze(req, res);
  });

  app.get("/api/history", verifyAuth, handleGetHistory);

  // Error handling middleware
  app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum size is 5MB.'
        });
      }
    }
    
    if (error.message.includes('Invalid file type')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  });

  return app;
}
