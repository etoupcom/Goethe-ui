import { Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { OptionParams } from '../data.d'

const RoleSelect: React.FC<{
    /** Value 和 onChange 会被自动注入 */
    value: string;
    role: OptionParams[];
    onChange?: (value: string) => void;
}> = (props) => {
    const { role } = props
    const [options, setOptions] = useState<OptionParams[]>([]);

    useEffect(() => {
        if (role) {
            const options = role.map((v: any) => { return { value: v.name, label: v.name } })
            setOptions(options);
        }
    }, []);

    return <Select allowClear placeholder='请选择项目' options={options} value={props.value} onChange={props.onChange} />;
};

export default RoleSelect;