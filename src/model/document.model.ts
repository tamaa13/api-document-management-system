export class UploadDocumentRequest {
    title: string;
    file: Express.Multer.File;
    token: any
}

export class UploadDocumentResponse {
    userId: number;
    title: string;
    fileUrl: string;
}

export class DeleteDocumentRequest {
    documentId: number
    token: any
}

export class DeleteDocumentResponse {
    documentId: number
    response: string
}

export class findDocumentByIdRequest {
    documentId: number
    token: any
}

export class findDocumentByIdResponse {
    id: number
    title: string
    fileUrl: string
}

export class getAllDocumentsRequest {
    page?: number
    title?: string
    token: any
}

export class getAllDocumentsResponse {
    currentPage: number
    totalPage: number
    limit: number
    documents: findDocumentByIdResponse[] | string
}