import React, { useState, useEffect } from 'react';
import { Drawer, Button, Row, Col, Form, Input, Select, TreeSelect, DatePicker, message } from 'antd';
import { CreatedFormItem, RoleItem } from '../data.d';
import { FormInstance } from 'antd/lib/form';
import { info } from '../service'

interface CreatedFormProps {
    visible: boolean;
    onCancel: (form: FormInstance) => void;
    onCreated: (values: CreatedFormItem, form: FormInstance) => void;
}

const CreatedForm: React.FC<CreatedFormProps> = (props) => {
    const { visible, onCancel, onCreated } = props;
    const [department, setDepartment] = useState<any>();
    const [project, setProject] = useState<any>([]);
    const [date, setDate] = useState<any>();
    const [role, setRole] = useState<RoleItem[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            info().then((res: any) => {
                if (res.status === 'success') {
                    setDepartment(res.data.department)
                    setProject(res.data.project.map((v: any) => { return { value: v.id, label: v.name } }))
                    setRole(res.data.role)
                }
            })
        }
    }, [visible]);

    const onFinish = () => {
        form.validateFields().then((fields: any) => {
            onCreated({ ...fields, birthday: date }, form)
        }).catch(err => {
            const { errorFields } = err
            if (errorFields.length > 0) {
                message.error('请完成必填项内容')
            }
        })
    }

    const handleChange = () => {

    }

    const handleBirthdayChange = (v: any, vs: any) => {
        setDate(vs)
    }

    const onChange = (value: any) => {

    }

    return (
        <Drawer
            title="新建用户"
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
                            name="mobile"
                            label="用户账号"
                            rules={[{ required: true, message: '请填写手机号，用于登录' }]}
                        >
                            <Input allowClear placeholder="请填写手机号，用于登录" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="real_name"
                            label="用户姓名"
                            rules={[{ required: true, message: '请填写用户真实姓名' }]}
                        >
                            <Input allowClear placeholder="请填写用户真实姓名" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="password"
                            label="登录密码"
                            rules={[{ required: true, message: '请填写登录密码' }]}
                        >
                            <Input type='password' allowClear placeholder="请填写登录密码" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="confirm"
                            label="确认密码"
                            rules={[{ required: true, message: '请填写确认密码' }]}
                        >
                            <Input type='password' allowClear placeholder="请填写确认密码" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="department_id"
                            label="所属部门"
                            rules={[{ required: true, message: '请选择所属部门' }]}
                        >
                            <TreeSelect
                                style={{ width: '100%' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeData={department}
                                placeholder="请选择所属部门"
                                treeDefaultExpandAll
                                onChange={onChange}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="role"
                            label="用户角色"
                            rules={[{ required: true, message: '请选择用户角色' }]}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                                placeholder="请选择用户角色"
                                onChange={handleChange}
                            >
                                {
                                    role.length > 0 && role.map((v: RoleItem) => <Select.Option key={v.code} value={v.name}>{v.name}</Select.Option>)
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="project_id"
                            label="所属项目"
                        >
                            <Select allowClear style={{ width: '100%' }} placeholder='请选择用户所属项目' options={project} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="sex"
                            label="用户性别"
                        >
                            <Select style={{ width: '100%' }} placeholder='请选择用户性别' onChange={handleChange}>
                                <Select.Option value="10">男</Select.Option>
                                <Select.Option value="20">女</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="birthday"
                            label="出生日期"
                        >
                            <DatePicker style={{ width: '100%' }} onChange={handleBirthdayChange} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="telephone"
                            label="座机号码"
                        >
                            <Input allowClear placeholder="请填写座机号码" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="email"
                            label="用户邮箱"
                        >
                            <Input allowClear placeholder="请填写用户邮箱" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="remark"
                            label="用户简历"
                        >
                            <Input.TextArea rows={4} placeholder="请填写用户简历" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );
};

export default CreatedForm;
