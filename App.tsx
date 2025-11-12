
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { FileInfo } from './types';
import { categorizeFiles } from './services/geminiService';
import { FileIcon, FolderIcon, UploadCloudIcon, BrainCircuitIcon } from './components/icons';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      // FIX: Explicitly type `file` as `File` to resolve type inference issue.
      const newFileInfos: FileInfo[] = Array.from(selectedFiles).map((file: File) => ({
        id: `${file.name}-${file.lastModified}`,
        file,
        path: (file as any).webkitRelativePath || file.name,
        category: 'Uncategorized',
        summary: 'Not yet analyzed.',
      }));

      setFiles(prevFiles => {
        const existingFileIds = new Set(prevFiles.map(f => f.id));
        const uniqueNewFiles = newFileInfos.filter(nf => !existingFileIds.has(nf.id));
        return [...prevFiles, ...uniqueNewFiles];
      });
      setError(null);
    }
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (files.length === 0) {
      setError("Please add some files first.");
      return;
    }
    
    const uncategorizedFiles = files.filter(f => f.category === 'Uncategorized').map(f => f.file);

    if(uncategorizedFiles.length === 0) {
      setError("All files have already been analyzed.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const categorizedData = await categorizeFiles(uncategorizedFiles);
      setFiles(prevFiles => {
        const categorizedMap = new Map(categorizedData.map(d => [d.fileName, d]));
        return prevFiles.map(fileInfo => {
          const categorized = categorizedMap.get(fileInfo.file.name);
          if (categorized) {
            return {
              ...fileInfo,
              category: categorized.category,
              summary: categorized.summary,
            };
          }
          return fileInfo;
        });
      });
      setSelectedFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  }, [files]);

  const categories = useMemo(() => {
    const allCategories = new Set(files.map(f => f.category));
    return ['All', ...Array.from(allCategories)];
  }, [files]);

  const filteredFiles = useMemo(() => {
    if (selectedCategory === 'All') {
      return files;
    }
    return files.filter(f => f.category === selectedCategory);
  }, [files, selectedCategory]);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <BrainCircuitIcon className="h-8 w-8 text-brand-primary" />
          <h1 className="text-2xl font-bold tracking-tight">AI File Organizer</h1>
        </div>
      </header>

      <div className="flex flex-col md:flex-row" style={{ height: 'calc(100vh - 65px)' }}>
        <aside className="w-full md:w-64 lg:w-72 bg-gray-800 p-4 border-r border-gray-700 overflow-y-auto">
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              multiple
              // @ts-ignore
              webkitdirectory="true"
              directory="true"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <UploadCloudIcon className="h-5 w-5" />
              Add Files / Folder
            </button>
            <button
              onClick={handleAnalyzeClick}
              disabled={isLoading || files.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader /> : <BrainCircuitIcon className="h-5 w-5" />}
              Analyze Files
            </button>
            {error && <p className="text-red-400 text-sm bg-red-900/50 p-2 rounded-md">{error}</p>}
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-400">Categories</h2>
            <ul className="space-y-1">
              {categories.map(category => (
                <li key={category}>
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-brand-primary/20 text-brand-primary font-bold'
                        : 'hover:bg-gray-700/50'
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 overflow-hidden">
          <div className="lg:col-span-2 xl:col-span-3 p-4 overflow-y-auto">
             {files.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <UploadCloudIcon className="w-24 h-24 mb-4" />
                  <h2 className="text-2xl font-semibold">Your file hub is empty</h2>
                  <p>Click "Add Files / Folder" to get started.</p>
                </div>
             ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {filteredFiles.map(fileInfo => (
                  <div
                    key={fileInfo.id}
                    onClick={() => setSelectedFile(fileInfo)}
                    className={`bg-gray-800 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedFile?.id === fileInfo.id ? 'border-brand-primary shadow-lg' : 'border-gray-700 hover:border-brand-primary/50'}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <FileIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />
                      <p className="text-sm font-medium truncate text-gray-200" title={fileInfo.file.name}>{fileInfo.file.name}</p>
                    </div>
                    <div className="text-xs text-gray-400 truncate" title={fileInfo.path}>{fileInfo.path}</div>
                     <span className={`mt-2 inline-block text-xs font-semibold px-2 py-1 rounded-full ${fileInfo.category === 'Uncategorized' ? 'bg-gray-600 text-gray-200' : 'bg-blue-900/50 text-blue-300'}`}>
                      {fileInfo.category}
                    </span>
                  </div>
                ))}
              </div>
             )}
          </div>

          <aside className="lg:col-span-1 xl:col-span-1 bg-gray-800/50 border-l border-gray-700 p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-300">File Details</h2>
            {selectedFile ? (
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold text-gray-400">Name</h3>
                  <p className="text-gray-200 break-words">{selectedFile.file.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-400">Full Path</h3>
                  <p className="text-gray-200 break-words">{selectedFile.path}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-400">Size</h3>
                  <p className="text-gray-200">{formatBytes(selectedFile.file.size)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-400">Type</h3>
                  <p className="text-gray-200">{selectedFile.file.type || 'Unknown'}</p>
                </div>
                 <div>
                  <h3 className="font-semibold text-gray-400">Last Modified</h3>
                  <p className="text-gray-200">{new Date(selectedFile.file.lastModified).toLocaleString()}</p>
                </div>
                <div className="pt-2 border-t border-gray-700">
                  <h3 className="font-semibold text-gray-400">AI Category</h3>
                  <p className="text-brand-primary font-bold">{selectedFile.category}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-400">AI Summary</h3>
                  <p className="text-gray-300 italic">{selectedFile.summary}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-gray-500">
                <p>Select a file to see its details.</p>
              </div>
            )}
          </aside>
        </main>
      </div>
    </div>
  );
};

export default App;
