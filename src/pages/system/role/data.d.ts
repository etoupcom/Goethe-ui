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
    code?: string;
    name?: string;
    description?: string;
    project_id?: number;
    expire_at?: any;
}

export interface OptionParams {
    value: number;
    label: React.ReactNode;
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
