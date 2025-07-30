'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, ImageIcon, Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface ReceiptData {
  amount?: number;
  merchant?: string;
  category?: string;
  description?: string;
  date?: string;
}

interface ReceiptUploadProps {
  onProcessed: (data: ReceiptData) => void;
}

export function ReceiptUpload({ onProcessed }: ReceiptUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<
    'idle' | 'uploading' | 'processing' | 'success' | 'error'
  >('idle');

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast('Please upload an image file.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast('Please upload an image smaller than 5MB.');
        return;
      }

      setProcessingStatus('uploading');
      setIsProcessing(true);

      try {
        // Create preview
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          setUploadedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        setProcessingStatus('processing');

        // Convert to base64 for API
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        // Send to API for processing
        const response = await fetch('/api/analyze-receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        });

        if (!response.ok) {
          throw new Error('Failed to process receipt');
        }

        const result: ReceiptData = await response.json();
        setProcessingStatus('success');
        onProcessed(result);
      } catch (error) {
        console.error('Receipt processing error:', error);
        setProcessingStatus('error');
        toast('Could not extract data from receipt. Please try again or enter manually.');
      } finally {
        setIsProcessing(false);
      }
    },
    [onProcessed, toast],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    multiple: false,
  });

  const getStatusIcon = () => {
    switch (processingStatus) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="w-8 h-8 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      default:
        return <Upload className="w-8 h-8 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (processingStatus) {
      case 'uploading':
        return 'Uploading image...';
      case 'processing':
        return 'Analyzing receipt with AI...';
      case 'success':
        return 'Receipt processed successfully!';
      case 'error':
        return 'Processing failed. Please try again.';
      default:
        return isDragActive
          ? 'Drop the receipt here...'
          : 'Drag & drop a receipt image, or click to select';
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${isProcessing ? 'pointer-events-none opacity-75' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center space-y-4">
          {getStatusIcon()}

          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">{getStatusText()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Supports PNG, JPG, JPEG, GIF, WebP (max 5MB)
            </p>
          </div>

          {!isProcessing && (
            <Button variant="outline" size="sm">
              <ImageIcon className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          )}
        </div>
      </div>

      {uploadedImage && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Uploaded Receipt:
          </p>
          <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <Image
              src={uploadedImage || '/placeholder.svg'}
              alt="Uploaded receipt"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {processingStatus === 'processing' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                AI is analyzing your receipt...
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300">
                This may take a few seconds
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
