
import React from 'react';

export const FileIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
  </svg>
);

export const FolderIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z"></path>
  </svg>
);

export const UploadCloudIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
    <path d="M12 12v9"></path>
    <path d="m16 16-4-4-4 4"></path>
  </svg>
);

export const BrainCircuitIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 5a3 3 0 1 0-5.993.129"></path><path d="M12 5a3 3 0 1 1 5.993.129"></path>
        <path d="M12 15a3 3 0 1 0-5.993.129"></path><path d="M12 15a3 3 0 1 1 5.993.129"></path>
        <path d="M12 5a3 3 0 1 0-5.993.129"></path><path d="M12 5a3 3 0 1 1 5.993.129"></path>
        <path d="M12 15a3 3 0 1 0-5.993.129"></path><path d="M12 15a3 3 0 1 1 5.993.129"></path>
        <path d="M12 21a3 3 0 1 0-5.993.129"></path><path d="M12 21a3 3 0 1 1 5.993.129"></path>
        <path d="m14.5 5.5.9.9"></path><path d="m9.5 5.5-.9.9"></path>
        <path d="m14.5 15.5.9.9"></path><path d="m9.5 15.5-.9.9"></path>
        <path d="M12 8v4"></path><path d="M12 18v-1"></path>
        <path d="m10.037 12.5.9.9"></path><path d="m13.037 12.5-.9.9"></path>
    </svg>
);
