import { useState } from "react";

import { useUpAvif } from "upavif";
import { Loader2 } from "lucide-react";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const [quality, setQuality] = useState(0.75);

  const { uploadAvif, uploadWebp, status, error, uploadResult } = useUpAvif();

  const isLoading = status === "uploading";

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleAvifUpload = async () => {
    if (selectedFile) {
      await uploadAvif(selectedFile, { quality });
    }
  };

  const handleWebpUpload = async () => {
    if (selectedFile) {
      await uploadWebp(selectedFile, { quality });
    }
  };

  const handleDownload = async () => {
    if (!uploadResult?.directLink) return;

    try {
      const response = await fetch(uploadResult.directLink);
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      link.download = uploadResult.fileName || "converted-image";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading image:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-neutral-900 shadow-2xl rounded-2xl p-8 w-full max-w-md border border-neutral-800">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Image Converter & Uploader
        </h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-neutral-200 bg-neutral-800 text-white mb-4 rounded"
        />

        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-400 mb-2">
            Quality: {Math.round(quality * 100)}%
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer "
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAvifUpload}
            disabled={isLoading || !selectedFile}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition font-medium text-black ${
              isLoading || !selectedFile
                ? "bg-neutral-600 cursor-not-allowed"
                : "bg-white hover:bg-neutral-200"
            }`}
          >
            {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
            {isLoading ? "Converting..." : "Convert to AVIF"}
          </button>
          <button
            onClick={handleWebpUpload}
            disabled={isLoading || !selectedFile}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition font-medium text-black ${
              isLoading || !selectedFile
                ? "bg-neutral-600 cursor-not-allowed"
                : "bg-white hover:bg-neutral-200"
            }`}
          >
            {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
            {isLoading ? "Converting..." : "Convert to WebP"}
          </button>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-400 font-medium text-center">
            Error: {error}
          </p>
        )}

        {status === "success" && uploadResult && (
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Conversion Complete:</h3>
            <img
              src={uploadResult.directLink}
              alt="Converted and uploaded"
              className="mx-auto max-w-full rounded-lg shadow-md border border-neutral-700"
            />
            <button
              onClick={handleDownload}
              className="mt-4 inline-block bg-white hover:bg-neutral-200 text-black px-4 py-2 rounded text-sm font-medium"
            >
              Download Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
