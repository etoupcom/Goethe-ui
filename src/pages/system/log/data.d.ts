export interface TableListParams {
    id?: number;
    key?: number;
    value?: number;
    user_id?: number;
    project_id?: number;
    department_id?: number;
    username?: string;
    real_name?: string;
    project_name?: string;
    department_name?: string;
    role?: string;
    host?: string;
    title?: string;
    remark?: string;
    type?: number;
    status?: number;
    created_at?: Date
}

export interface ProjectParams {
    id?: number;
    name?: string;
}

export interface OptionParams {
    value: number;
    label: React.ReactNode;
}

export interface TreeSelectParams {
    value: number;
    title: React.ReactNode;
    children: TreeSelectParams[]
}
