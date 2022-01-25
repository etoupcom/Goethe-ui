import React from 'react';
import { Select } from 'antd';
import { SelectParams } from '../data.d'

const JobSelect: React.FC<{
    /** Value 和 onChange 会被自动注入 */
    value: string;
    job: SelectParams[];
    onChange?: (value: string) => void;
}> = (props) => {
    const { job } = props
    return <Select allowClear placeholder='请选择岗位' options={job} value={props.value} onChange={props.onChange} />;
};

export default JobSelect;