import React, { useEffect } from 'react';
import { Drawer, Button, Row, Col, Form, Input, Select, message } from 'antd';
import { UpdatedFormItem, OptionParams } from '../data.d';
import { FormInstance } from 'antd/lib/form';

interface UpdatedFormProps {
    options: OptionParams[];
    visible: boolean;
    fields: UpdatedFormItem;
    onCancel: () => void;
    onUpdated: (values: UpdatedFormItem, form: FormInstance) => void;
}

const UpdatedForm: React.FC<UpdatedFormProps> = (props) => {
    const { options, visible, fields, onCancel, onUpdated } = props;
    const [form] = Form.useForm();

    useEffect(() => {
        if (Object.keys(fields).length > 0) {
            form.setFieldsValue({ ...fields, project_id: fields.project_id ? fields.project_id : undefined })
        }
    }, [fields]);

    const onFinish = () => {
        form.validateFields().then((item: any) => {
            onUpdated({ ...item, id: fields.id }, form)
        }).catch(err => {
            const { errorFields } = err
            if (errorFields.length > 0) {
                message.error('请完成必填项内容')
            }
        })
    }

    return (
        <Drawer
            title="更新角色"
            width={450}
            visible={visible}
            onClose={onCancel}
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
                            onClick={onCancel}
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

export default UpdatedForm;
