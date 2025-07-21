export interface FileUpload {
    id: number;
    fileName: string;
    originalFileName: string;
    fileUrl: string;
    fileSize: number;
    contentType: string;
    uploadedAt: Date;
    categoryId?: number;
    tags: string[];
}
