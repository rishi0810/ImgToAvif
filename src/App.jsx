import { useState } from "react";
import { useAvifConverter } from "upavif"; 
import { Loader2 } from "lucide-react";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { convertAndUpload, isLoading, error, avifUrl } = useAvifConverter();

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadClick = async () => {
    if (selectedFile) {
      await convertAndUpload(selectedFile);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-neutral-900 shadow-2xl rounded-2xl p-8 w-full max-w-md border border-neutral-800">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Image to AVIF Converter
        </h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-neutral-200 bg-neutral-800 text-white mb-4 rounded"
        />

        <button
          onClick={handleUploadClick}
          disabled={isLoading || !selectedFile}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition font-medium text-black ${
            isLoading || !selectedFile
              ? "bg-neutral-600 cursor-not-allowed"
              : "bg-white hover:bg-neutral-200"
          }`}
        >
          {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
          {isLoading ? "Uploading..." : "Convert & Upload"}
        </button>

        {error && (
          <p className="mt-4 text-sm text-red-400 font-medium text-center">
            Error: {error}
          </p>
        )}

        {avifUrl && (
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold mb-2">
              Converted Image:
            </h3>
            <img
              src={avifUrl}
              alt="Converted to AVIF"
              className="mx-auto max-w-full rounded-lg shadow-md border border-neutral-700"
            />
            <a
              href={avifUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-white underline hover:text-neutral-300 text-sm"
            >
              Open AVIF image
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
