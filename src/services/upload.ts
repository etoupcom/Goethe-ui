import http from '@/utils/http';
interface UploadParams {
    documentType: number,
    key: string,
}
export interface TokenParams {
    host: string,
    accessId: string,
    signature: string,
    policy: string,
    key: string;
}

export interface ItemParams {
    uid: string;
    name: string;
    url: string;
    thumbUrl: string;
}

export async function fetchOSSUploadToken(data: UploadParams) {
    return http('/common/file/fetchOSSUploadToken', {
        method: 'POST',
        data
    });
}