import React from 'react';
import { Drawer, Button, Descriptions, Tag, Row, Col, Image } from 'antd';
import { DetailParams } from '../data.d';
import moment from 'moment';

interface DetailProps {
    fields: DetailParams | undefined;
    visible: boolean;
    onCancel: () => void;
}

const Detail: React.FC<DetailProps> = (props) => {
    const { fields, visible, onCancel } = props;
    const type_options = [
        {
            value: 10,
            label: '全员通知',
        },
        {
            value: 20,
            label: '部门通知',
        },
        {
            value: 30,
            label: '人员通知',
        },
    ]
    const type = () => {
        const option = type_options.find((v: any) => v.value === fields?.type)
        return (
            <Tag color="green" key={option?.value}>{option?.label}</Tag>
        )
    }
    const status_options = [
        {
            value: 10,
            label: '待发布',
        },
        {
            value: 40,
            label: '已撤回',
        },
        {
            value: 80,
            label: '已发布',
        },
    ]
    const status = () => {
        const option = status_options.find((v: any) => v.value === fields?.status)
        return (
            <Tag color="blue" key={option?.value}>{option?.label}</Tag>
        )
    }
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
                <Descriptions title="公告详情">
                    <Descriptions.Item label="时间">
                        {moment(fields.created_at).format('YYYY.MM.DD HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="类别">{fields?.type ? type() : '-'}</Descriptions.Item>
                    <Descriptions.Item label="状态">{fields?.status ? status() : '-'}</Descriptions.Item>
                    <Descriptions.Item label="标题" span={3}>{fields?.title}</Descriptions.Item>
                    <Descriptions.Item label="内容" span={3}>{fields?.content ? fields?.content : '-'}</Descriptions.Item>
                    {
                        fields.files && fields.files.length > 0 && (
                            <Descriptions.Item label="图片" span={3}>
                                <Row gutter={16}>
                                    {fields.files.map((v: any, i: number) => (
                                        <Col key={i} className="gutter-row" span={6}>
                                            <Image src={v} />
                                        </Col>
                                    ))}
                                </Row>
                            </Descriptions.Item>
                        )
                    }
                </Descriptions>
            )}
        </Drawer>
    );
};

export default Detail;
