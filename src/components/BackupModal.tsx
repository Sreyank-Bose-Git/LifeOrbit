import React, { useState } from "react";
import { X, Download, Upload, RefreshCw, Check, Copy, CheckCircle2 } from "lucide-react";
import { storage } from "../lib/storage";

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onRefreshData,
}) => {
  const [jsonContent, setJsonContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const raw = storage.exportDatabaseJSON();
    setJsonContent(raw);

    // Also trigger direct file download
    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lifeorbit-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!jsonContent) {
      const raw = storage.exportDatabaseJSON();
      setJsonContent(raw);
      navigator.clipboard.writeText(raw);
    } else {
      navigator.clipboard.writeText(jsonContent);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    if (!jsonContent.trim()) return;
    const success = storage.importDatabaseJSON(jsonContent);
    if (success) {
      setImportStatus("Database restored successfully! Reloading state...");
      setTimeout(() => {
        onRefreshData();
        onClose();
      }, 1200);
    } else {
      setImportStatus("Failed to parse JSON backup. Please check formatting.");
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset database to initial sample endeavors?")) {
      storage.resetDefaults();
      onRefreshData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#0D0D0D] rounded-3xl max-w-xl w-full border border-white/10 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Local-First Database & Cross-Device Sync</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            All your endeavors, time-blocks, habits, milestones, and XP are stored locally on your device in real-time with zero cloud lag. You can export a snapshot backup to transfer between your phone, tablet, and desktop, or restore previous states.
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleExport}
              className="flex items-center justify-center space-x-2 py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-bold text-xs rounded-xl shadow-xs transition"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download JSON Backup</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center justify-center space-x-2 py-2.5 px-3 bg-white/5 hover:bg-white/10 text-slate-200 font-semibold text-xs rounded-xl border border-white/5 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied to Clipboard!" : "Copy JSON Data"}</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              JSON Database Data (Paste to restore or view)
            </label>
            <textarea
              value={jsonContent}
              onChange={(e) => setJsonContent(e.target.value)}
              placeholder="Paste exported backup JSON here to restore across devices..."
              rows={6}
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {importStatus && (
            <p className={`text-xs font-semibold ${importStatus.includes("success") ? "text-emerald-400" : "text-rose-400"}`}>
              {importStatus}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleResetDefaults}
              className="text-xs text-slate-500 hover:text-red-400 underline font-medium"
            >
              Reset to Sample Data
            </button>

            <button
              onClick={handleImport}
              disabled={!jsonContent.trim()}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 disabled:opacity-50 text-black font-bold text-xs rounded-xl shadow-xs transition"
            >
              Restore / Import Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
