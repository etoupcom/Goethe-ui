import http from '@/utils/http';
import { TableListParams, FormValueType, DetailFormItem } from './data.d';

export async function list(params?: TableListParams) {
    return http('/propose/index/list', {
        params,
    });
}

export async function detail(params: DetailFormItem) {
    return http('/propose/index/detail', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function freeze(params: FormValueType) {
    return http('/propose/index/freeze', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function unfreeze(params: FormValueType) {
    return http('/propose/index/unfreeze', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function generate() {
    return http('/propose/index/generate')
}

export async function excel() {
    return http('/propose/index/export');
}

export async function items() {
    return http('/propose/index/items');
}