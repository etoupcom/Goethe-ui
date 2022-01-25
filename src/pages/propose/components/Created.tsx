import React from 'react';
import { Drawer, Button, Row, Col, Form, Input, Select, message } from 'antd';
import { CreatedFormItem } from '../data.d';
import { FormInstance } from 'antd/lib/form';

interface CreatedFormProps {
    visible: boolean;
    onCancel: (form: FormInstance) => void;
    onCreated: (values: CreatedFormItem, form: FormInstance) => void;
}

const CreatedForm: React.FC<CreatedFormProps> = (props) => {
    const { visible, onCancel, onCreated } = props;
    const [form] = Form.useForm();

    const onFinish = () => {
        form.validateFields().then((fields: any) => {
            onCreated(fields, form)
        }).catch(err => {
            const { errorFields } = err
            if (errorFields.length > 0) {
                message.error('请完成必填项内容')
            }
        })
    }

    const onChange = () => {

    }

    return (
        <Drawer
            title="新建项目"
            width={450}
            visible={visible}
            onClose={() => onCancel(form)}
            maskClosable={false}
            footer={
                <div
                    style={{
                        textAlign: 'right',
                        marginRight: 10
                    }}
                >
                    <>
                        <Button
                            onClick={() => onCancel(form)}
                            style={{
                                marginRight: 10
                            }}
                        >
                            关闭
                        </Button>
                        <Button
                            type="primary"
                            onClick={onFinish}
                        >
                            保存
                        </Button>
                    </>
                </div>
            }
        >
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Form.Item
                            name="name"
                            label="项目名称"
                            rules={[{ required: true, message: '请填写项目名称' }]}
                        >
                            <Input allowClear placeholder="请填写项目名称" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="path"
                            label="链接地址"
                        >
                            <Input allowClear placeholder="请填写项目后台管理链接地址" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="description"
                            label="项目简介"
                        >
                            <Input.TextArea allowClear rows={4} placeholder="请填写项目简介" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="duration"
                            label="使用时长"
                            initialValue={'365'}
                        >
                            <Select allowClear style={{ width: '100%' }} onChange={onChange}>
                                <Select.Option value="30">试用一月</Select.Option>
                                <Select.Option value="365">使用一年</Select.Option>
                                <Select.Option value="0">永久使用</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );
};

export default CreatedForm;
