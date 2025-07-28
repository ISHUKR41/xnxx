import { Router } from 'express';
import { comprehensiveToolsController } from '../controllers/comprehensiveToolsController';
import { uploadSingle, uploadMultiple, uploadFields } from '../middleware/upload';

const router = Router();

// ===== PDF TOOLS ROUTES =====

// Core PDF Operations
router.post('/pdf/merge', uploadMultiple, comprehensiveToolsController.mergePDF.bind(comprehensiveToolsController));
router.post('/pdf/split', uploadSingle, comprehensiveToolsController.splitPDF.bind(comprehensiveToolsController));
router.post('/pdf/compress', uploadSingle, comprehensiveToolsController.compressPDF.bind(comprehensiveToolsController));
router.post('/pdf/rotate', uploadSingle, comprehensiveToolsController.rotatePDF.bind(comprehensiveToolsController));
router.post('/pdf/protect', uploadSingle, comprehensiveToolsController.protectPDF.bind(comprehensiveToolsController));
router.post('/pdf/unlock', uploadSingle, comprehensiveToolsController.unlockPDF.bind(comprehensiveToolsController));

// PDF Image Conversion
router.post('/pdf/to-jpg', uploadSingle, comprehensiveToolsController.pdfToJPG.bind(comprehensiveToolsController));
router.post('/pdf/to-png', uploadSingle, comprehensiveToolsController.pdfToPNG.bind(comprehensiveToolsController));
router.post('/pdf/from-images', uploadMultiple, comprehensiveToolsController.imageToPDF.bind(comprehensiveToolsController));

// PDF Enhancement
router.post('/pdf/watermark', uploadSingle, comprehensiveToolsController.addWatermark.bind(comprehensiveToolsController));
router.post('/pdf/page-numbers', uploadSingle, comprehensiveToolsController.addPageNumbers.bind(comprehensiveToolsController));
router.post('/pdf/ocr', uploadSingle, comprehensiveToolsController.performOCR.bind(comprehensiveToolsController));

// Office Conversion
router.post('/pdf/from-office', uploadSingle, comprehensiveToolsController.officeToPDF.bind(comprehensiveToolsController));

// ===== IMAGE TOOLS ROUTES =====

router.post('/image/resize', uploadSingle, comprehensiveToolsController.resizeImage.bind(comprehensiveToolsController));
router.post('/image/crop', uploadSingle, comprehensiveToolsController.cropImage.bind(comprehensiveToolsController));
router.post('/image/compress', uploadSingle, comprehensiveToolsController.compressImage.bind(comprehensiveToolsController));
router.post('/image/convert', uploadSingle, comprehensiveToolsController.convertImageFormat.bind(comprehensiveToolsController));
router.post('/image/rotate', uploadSingle, comprehensiveToolsController.rotateImage.bind(comprehensiveToolsController));
router.post('/image/flip', uploadSingle, comprehensiveToolsController.flipImage.bind(comprehensiveToolsController));
router.post('/image/enhance', uploadSingle, comprehensiveToolsController.enhanceImage.bind(comprehensiveToolsController));
router.post('/image/remove-background', uploadSingle, comprehensiveToolsController.removeBackground.bind(comprehensiveToolsController));
router.post('/image/upscale', uploadSingle, comprehensiveToolsController.upscaleImage.bind(comprehensiveToolsController));
router.post('/image/watermark-image', uploadFields, comprehensiveToolsController.addImageWatermark.bind(comprehensiveToolsController));
router.post('/image/watermark-text', uploadSingle, comprehensiveToolsController.addTextWatermarkToImage.bind(comprehensiveToolsController));

// ===== TEXT TOOLS ROUTES =====

router.post('/text/to-pdf', comprehensiveToolsController.textToPDF.bind(comprehensiveToolsController));
router.post('/text/extract-from-pdf', uploadSingle, comprehensiveToolsController.extractTextFromPDF.bind(comprehensiveToolsController));

// ===== UTILITY TOOLS ROUTES =====

router.post('/utility/qr-code', comprehensiveToolsController.generateQRCode.bind(comprehensiveToolsController));
router.post('/utility/password', comprehensiveToolsController.generatePassword.bind(comprehensiveToolsController));
router.post('/utility/hash', comprehensiveToolsController.hashText.bind(comprehensiveToolsController));
router.post('/utility/base64-encode', comprehensiveToolsController.encodeBase64.bind(comprehensiveToolsController));
router.post('/utility/base64-decode', comprehensiveToolsController.decodeBase64.bind(comprehensiveToolsController));

export default router;