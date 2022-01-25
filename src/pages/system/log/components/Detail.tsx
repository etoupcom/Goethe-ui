import React from 'react';
import { Drawer, Button, Descriptions } from 'antd';
import { TableListParams } from '../data.d';
import moment from 'moment';

interface DetailProps {
    fields: TableListParams | undefined;
    visible: boolean;
    onCancel: () => void;
}

const Detail: React.FC<DetailProps> = (props) => {
    const { fields, visible, onCancel } = props;

    return (
        <Drawer
            width={800}
            visible={visible}
            onClose={onCancel}
            closable={true}
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
            {fields && (
                <Descriptions title="日志详情" bordered>
                    <Descriptions.Item label="姓名">{fields?.real_name}</Descriptions.Item>
                    <Descriptions.Item label="项目" span={2}>{fields?.project_name ? fields?.project_name : '-'}</Descriptions.Item>
                    <Descriptions.Item label="账号">{fields?.username}</Descriptions.Item>
                    <Descriptions.Item label="部门" span={2}>{fields?.department_name ? fields?.department_name : '-'}</Descriptions.Item>
                    <Descriptions.Item label="标题">{fields?.title}</Descriptions.Item>
                    <Descriptions.Item label="Host" span={2}>{fields?.host}</Descriptions.Item>
                    <Descriptions.Item label="操作日志" span={3}>
                        {fields?.remark}
                    </Descriptions.Item>
                    <Descriptions.Item label="操作时间" span={3}>
                        {moment(fields.created_at).format('YYYY.MM.DD HH:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>
            )}
        </Drawer>
    );
};

export default Detail;
