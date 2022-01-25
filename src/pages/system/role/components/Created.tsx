import React from 'react';
import { Drawer, Button, Row, Col, Form, Input, Select, message } from 'antd';
import { CreatedFormItem, OptionParams } from '../data.d';
import { FormInstance } from 'antd/lib/form';

interface CreatedFormProps {
    options: OptionParams[];
    visible: boolean;
    onCancel: (form: FormInstance) => void;
    onCreated: (values: CreatedFormItem, form: FormInstance) => void;
}

const CreatedForm: React.FC<CreatedFormProps> = (props) => {
    const { options, visible, onCancel, onCreated } = props;
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

    return (
        <Drawer
            title="新建角色"
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
                            style={{
                                marginRight: 10
                            }}
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
                            name="code"
                            label="角色标识"
                            rules={[{ required: true, message: '请填写角色标识' }]}
                        >
                            <Input allowClear placeholder="请填写角色标识" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="name"
                            label="角色名称"
                            rules={[{ required: true, message: '请填写角色名称' }]}
                        >
                            <Input allowClear placeholder="请填写角色名称" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="description"
                            label="角色简介"
                            rules={[{ required: true, message: '请填写角色简介' }]}
                        >
                            <Input.TextArea rows={4} placeholder="请填写角色简介" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="project_id"
                            label="所属项目"
                        >
                            <Select allowClear placeholder='请选择所属项目' options={options} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );
};

export default CreatedForm;
