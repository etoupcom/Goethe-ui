import React, { useState, useEffect } from 'react';
import { Drawer, Button, Row, Col, Form, Input, Select, TreeSelect, DatePicker, message } from 'antd';
import { useAccess, Access } from 'umi';
import { UpdatedFormItem, RoleItem } from '../data.d';
import { FormInstance } from 'antd/lib/form';
import Upload from '@/components/Upload'
import moment from 'moment'

import { info } from '../service'

interface UpdatedFormProps {
    fields: any;
    visible: boolean;
    onCancel: (form: FormInstance) => void;
    onUpdated: (values: UpdatedFormItem, form: FormInstance) => void;
}

const UpdatedForm: React.FC<UpdatedFormProps> = (props) => {
    const { fields, visible, onCancel, onUpdated } = props;
    const [department, setDepartment] = useState<any>();
    const [project, setProject] = useState<any>([]);
    const [birthday, setBirthday] = useState<any>();
    const [duty, setDuty] = useState<any>();
    const [fileList, setFileList] = useState<any>([]);
    const [role, setRole] = useState<RoleItem[]>([]);
    const access = useAccess();
    const [form] = Form.useForm();

    useEffect(() => {
        if (Object.keys(fields).length > 0) {
            setFileList([
                {
                    uid: '-1',
                    name: '用户照片',
                    status: 'done',
                    url: fields.path,
                    thumbUrl: fields.path,
                },
            ])
            form.setFieldsValue({
                id: fields.id,
                real_name: fields.real_name,
                mobile: fields.mobile,
                role: fields.role,
                path: fields.path,
                files: [fields.path],
                department_id: fields.department_id,
                sex: fields.sex ? fields.sex : undefined,
                email: fields.email ? fields.email : undefined,
                telephone: fields.telephone ? fields.telephone : undefined,
                birthday: fields.birthday ? moment(fields.birthday) : undefined,
                first_duty_date: fields.first_duty_date ? moment(fields.first_duty_date) : undefined,
                remark: fields.remark ? fields.remark : undefined,
            })
            info().then((res: any) => {
                if (res.status === 'success') {
                    setDepartment(res.data.department)
                    setProject(res.data.project.map((v: any) => { return { value: v.id, label: v.name } }))
                    setRole(res.data.role)
                }
            })
        }
    }, [fields]);

    const onFinish = () => {
        form.validateFields().then((item: any) => {
            onUpdated({ ...item, id: fields.id, birthday, first_duty_date: duty }, form)
        }).catch(err => {
            const { errorFields } = err
            if (errorFields.length > 0) {
                message.error('请完成必填项内容')
            }
        })
    }

    const handleBirthdayChange = (v: any, vs: any) => {
        setBirthday(vs)
    }

    const handleDutyChange = (v: any, vs: any) => {
        setDuty(vs)
    }

    const handleDone = (e: any) => {
        let { file, fileList } = e
        if (file.status === 'done') {
            fileList = fileList.map((file: any) => {
                console.log(file)
                if (file.response) {
                    file.url = file.response.url
                    file.thumbUrl = file.response.thumbUrl
                }
                return file;
            })
            let files = fileList.map((v: any) => v.url)
            form.setFieldsValue({
                ...form,
                files,
                path: files[0]
            });
        }
        setFileList(fileList)
    }

    const handleRemove = (e: any) => {
        let files = form.getFieldValue('files')
        files.splice(files.findIndex((item: string) => item === e.url), 1)
        form.setFieldsValue({
            ...form,
            files,
            path: ''
        });
    }

    return (
        <Drawer
            title="更新人员"
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
                            name="path"
                            label="上传照片"
                            rules={[{ required: true, message: '请上传用户登记照片' }]}
                        >

                            <Upload
                                fileList={fileList}
                                onDone={handleDone}
                                onRemove={handleRemove}
                            />
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
                            name="mobile"
                            label="用户账号"
                            rules={[{ required: true, message: '请填写手机号，用于登录' }]}
                        >
                            <Input allowClear placeholder="请填写手机号，用于登录" />
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
                            >
                                {
                                    role.length > 0 && role.map((v: RoleItem) => <Select.Option key={v.name} value={v.name}>{v.name}</Select.Option>)
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="password"
                            label="登录密码"
                        >
                            <Input type='password' allowClear placeholder="请填写登录密码" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="confirm"
                            label="确认密码"
                        >
                            <Input type='password' allowClear placeholder="请填写确认密码" />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            name="first_duty_date"
                            label="上岗日期"
                        >
                            <DatePicker style={{ width: '100%' }} onChange={handleDutyChange} />
                        </Form.Item>
                    </Col>
                    <Access accessible={access.canSuper ? access.canSuper : false}>
                        <Col span={24}>
                            <Form.Item
                                name="project_id"
                                label="所属项目"
                            >
                                <Select allowClear style={{ width: '100%' }} placeholder='请选择用户所属项目' options={project} />
                            </Form.Item>
                        </Col>
                    </Access>
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
                            name="sex"
                            label="用户性别"
                        >
                            <Select style={{ width: '100%' }} placeholder='请选择用户性别'>
                                <Select.Option value="10">男</Select.Option>
                                <Select.Option value="20">女</Select.Option>
                            </Select>
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
        </Drawer >
    );
};

export default UpdatedForm;
