'use client';
import { QRCodeCanvas } from 'qrcode.react';
import { useParams } from 'next/navigation';

export default function QRCodePage() {
  const params = useParams();
  const id = params.id as string;
  
  // Generate the form URL for the QR code
  const formUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/form/${id}`;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8 text-center">Form QR Code</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <QRCodeCanvas 
          value={formUrl} 
          size={256} 
          bgColor="#FFFFFF" 
          fgColor="#000000" 
          level="M"
        />
      </div>
      <p className="mt-4 text-sm text-gray-600 text-center max-w-md">
        Scan this QR code to access the form directly
      </p>
      <p className="mt-2 text-xs text-gray-500 break-all">
        {formUrl}
      </p>
    </div>
  );
}