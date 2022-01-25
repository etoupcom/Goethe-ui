import React from 'react';
import { Select } from 'antd';
import { SelectParams } from '../data.d'

const DepartmentSelect: React.FC<{
    /** Value 和 onChange 会被自动注入 */
    value: string;
    department: SelectParams[];
    onChange?: (value: string) => void;
}> = (props) => {
    const { department } = props
    return <Select allowClear placeholder='请选择部门' options={department} value={props.value} onChange={props.onChange} />;
};

export default DepartmentSelect;