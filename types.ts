
export interface FileInfo {
  id: string;
  file: File;
  path: string;
  category: string;
  summary: string;
}

export interface CategorizedFile {
  fileName: string;
  category: string;
  summary: string;
}
