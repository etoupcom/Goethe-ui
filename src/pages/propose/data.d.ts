export interface TableListItem {
    id?: number;
    key?: number;
    name?: string;
    description?: string;
    status?: number;
    updated_at?: Date;
    created_at?: Date;
}

export interface CreatedFormItem {
    name: string;
    description: string;
}

export interface UpdatedFormItem {
    id?: number;
    name?: string;
    description?: string;
    expire_at?: any;
}

export interface DetailFormItem {
    id?: number;
    name?: string;
    description?: string;
    expire_at?: any;
}

export interface SelectParams {
    value: number;
    label: string;
}

export interface TreeSelectParams {
    value: number;
    title: React.ReactNode;
    children: TreeSelectParams[]
}

export type FormValueType = {
    key?: number;
    remark?: string;
};

export interface BindItem {
    id?: number;
    permissions?: Key[];
}

export interface TableListPagination {
    total: number;
    pageSize: number;
    current: number;
}

export interface TableListData {
    list: TableListItem[];
    pagination: Partial<TableListPagination>;
}

export interface TableListParams {
    status?: string;
    name?: string;
    desc?: string;
    key?: number;
    pageSize?: number;
    currentPage?: number;
    filter?: { [key: string]: any[] };
    sorter?: { [key: string]: any };
}
