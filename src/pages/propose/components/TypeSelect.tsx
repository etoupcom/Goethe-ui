import React from 'react';
import { Select } from 'antd';
import { SelectParams } from '../data.d'

const TypeSelect: React.FC<{
    /** Value 和 onChange 会被自动注入 */
    value: string;
    options: SelectParams[];
    onChange?: (value: string) => void;
}> = (props) => {
    const { options } = props
    return <Select allowClear placeholder='请选择岗位' options={options} value={props.value} onChange={props.onChange} />;
};

export default TypeSelect;