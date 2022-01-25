import React from 'react';
import { TreeSelect } from 'antd';
import { TreeSelectParams } from '../data.d'

const DepartmentSelect: React.FC<{
    /** Value 和 onChange 会被自动注入 */
    value: string;
    department: TreeSelectParams[];
    onChange?: (value: string) => void;
}> = (props) => {
    const { department } = props
    return <TreeSelect allowClear placeholder='请选择项目' treeData={department} value={props.value} onChange={props.onChange} />;
};

export default DepartmentSelect;