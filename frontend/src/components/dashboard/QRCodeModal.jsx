import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Download, QrCode } from 'lucide-react';

const QRCodeModal = ({ link, onClose }) => {
  if (!link) return null;

  const fullShortUrl = `${window.location.origin}/r/${link.slug}`;

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-canvas-element');
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `qrcode-${link.slug}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-white border border-slate-200/80 p-6 shadow-corporate-hover">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-indigo-600" />
            <h3 className="font-heading text-lg font-bold text-slate-900">QR Code Generator</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Canvas */}
        <div className="flex flex-col items-center justify-center bg-slate-50 p-5 rounded-2xl mb-4 border border-slate-200 shadow-inner">
          <QRCodeCanvas
            id="qr-canvas-element"
            value={fullShortUrl}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Link Info */}
        <div className="text-center mb-6 space-y-1">
          <p className="text-xs font-mono text-indigo-600 truncate font-semibold">{fullShortUrl}</p>
          <p className="text-[11px] font-mono text-slate-500 truncate max-w-full">
            Target: {link.longUrl}
          </p>
        </div>

        {/* Download Button */}
        <button
          onClick={downloadQRCode}
          className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs uppercase tracking-wider shadow-indigo-btn hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Vector PNG
        </button>
      </div>
    </div>
  );
};

export default QRCodeModal;
