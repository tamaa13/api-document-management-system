import { z } from "zod";


export const ShareDocumentRequest = z.object({
    documentId: z.number(),
    sharedWithUserIds: z.array(z.number()),
    token: z.any()
});

export type ShareDocumentRequest = z.infer<typeof ShareDocumentRequest>;

export const ShareDocumentResponse = z.object({
    response: z.string()
});

export type ShareDocumentResponse = z.infer<typeof ShareDocumentResponse>;

export const getAllSharedDocumentRequest = z.object({
    token: z.string()
});

export type getAllSharedDocumentRequest = z.infer<typeof getAllSharedDocumentRequest>;
