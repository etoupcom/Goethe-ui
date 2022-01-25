import React, { useEffect, useState } from 'react';
import { Drawer, Button, Descriptions, message } from 'antd';
import { DetailFormItem } from '../data.d';
import { detail } from '../service';

interface DetailFormProps {
    visible: boolean;
    fields: DetailFormItem;
    onCancel: () => void;
}

const DetailForm: React.FC<DetailFormProps> = (props) => {
    const { visible, fields, onCancel } = props;
    const [item, setItem] = useState<any>();

    useEffect(() => {
        if (Object.keys(fields).length > 0) {
            detail({ id: fields.id }).then((res: any) => {
                if (res.status === 'success') {
                    setItem(res.data)
                } else {
                    message.error(res.message)
                }
            })
        }
    }, [props.fields]);

    return (
        <Drawer
            width={850}
            visible={visible}
            maskClosable={true}
            onClose={onCancel}
            footer={
                <div
                    style={{
                        textAlign: 'right',
                        marginRight: 10
                    }}
                >
                    <>
                        <Button
                            onClick={onCancel}
                        >
                            关闭
                        </Button>
                    </>
                </div>
            }
        >
            {item && (
                <Descriptions title="公告详情" bordered>
                    <Descriptions.Item label="姓名">{item?.real_name ? item?.real_name : '-'}</Descriptions.Item>
                    <Descriptions.Item label="单位">{item?.department_name ? item?.department_name : '-'}</Descriptions.Item>
                    <Descriptions.Item label="岗位">{item?.job_name ? item?.job_name : '-'}</Descriptions.Item>
                    <Descriptions.Item label="项目名称" span={2}>{item?.project_name ? item?.project_name : '-'}</Descriptions.Item>
                    <Descriptions.Item label="建议类别" span={1}>{item?.type_name ? item?.type_name : '-'}</Descriptions.Item>
                    <Descriptions.Item label="问题现状" span={3}>{item?.problem ? item?.problem : '-'}</Descriptions.Item>
                    <Descriptions.Item label="问题现状资料地址" span={3}>
                        {
                            item?.problem_path ? (
                                <a href={item?.problem_path} target="_blank">查看资料</a>
                            ) : (
                                <span>-</span>
                            )
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="方法措施" span={3}>{item?.measure ? item?.measure : '-'}</Descriptions.Item>
                    <Descriptions.Item label="方法措施资料地址" span={3}>
                        {
                            item?.measure_path ? (
                                <a href={item?.measure_path} target="_blank">查看资料</a>
                            ) : (
                                <span>-</span>
                            )
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="预期效果" span={3}>{item?.effect ? item?.effect : '-'}</Descriptions.Item>
                    <Descriptions.Item label="预期效果资料地址" span={3}>
                        {
                            item?.effect_path ? (
                                <a href={item?.effect_path} target="_blank">查看资料</a>
                            ) : (
                                <span>-</span>
                            )
                        }
                    </Descriptions.Item>
                </Descriptions>
            )}
        </Drawer>
    );
};

export default DetailForm;
