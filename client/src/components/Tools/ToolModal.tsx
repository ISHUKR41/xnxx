import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { MergePDFTool } from './PDFTools/MergePDFTool';
import { SplitPDFTool } from './PDFTools/SplitPDFTool';
import { CompressPDFTool } from './PDFTools/CompressPDFTool';
import { PDFToWordTool } from './PDFTools/FixedPDFToWordTool';
import { PDFToPowerPointTool } from './PDFTools/PDFToPowerPointTool';
import { ResizeImageTool } from './ImageTools/EnhancedResizeImageTool';
import CropImageTool from '../ImageTools/CropImageTool';
import CompressImageTool from '../ImageTools/CompressImageTool';
import ConvertImageTool from '../ImageTools/ConvertImageTool';
import { TextToPDFTool } from './TextTools/EnhancedTextToPDFTool';
import { ProtectPDFTool } from './PDFTools/ProtectPDFTool';
import NotepadTool from './TextTools/NotepadTool';
import TextSummarizerTool from './TextTools/TextSummarizerTool';

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolId: string;
  toolTitle: string;
}

export const ToolModal: React.FC<ToolModalProps> = ({ isOpen, onClose, toolId, toolTitle }) => {
  const renderTool = () => {
    switch (toolId) {
      case 'merge-pdf':
        return <MergePDFTool />;
      case 'split-pdf':
        return <SplitPDFTool />;
      case 'compress-pdf':
        return <CompressPDFTool />;
      case 'protect-pdf':
        return <ProtectPDFTool />;
      case 'pdf-to-word':
        return <PDFToWordTool />;
      case 'pdf-to-powerpoint':
        return <PDFToPowerPointTool />;
      case 'resize-image':
        return <ResizeImageTool />;
      case 'crop-image':
        return <CropImageTool />;
      case 'compress-image':
        return <CompressImageTool />;
      case 'convert-image':
        return <ConvertImageTool />;
      case 'text-to-pdf':
        return <TextToPDFTool />;
      case 'notepad':
        return <NotepadTool />;
      case 'text-summary':
        return <TextSummarizerTool />;
      default:
        return (
          <div className="text-center py-12 bg-black">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-2xl font-bold mb-2 text-white">Tool Coming Soon!</h3>
            <p className="text-gray-300 mb-6">
              We're working hard to bring you this tool. It will be available very soon!
            </p>
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white">Close</Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-black border-gray-600">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold text-white">{toolTitle}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-gray-700">
            <X className="w-6 h-6" />
          </Button>
        </DialogHeader>
        <div className="mt-4 bg-black">
          {renderTool()}
        </div>
      </DialogContent>
    </Dialog>
  );
};