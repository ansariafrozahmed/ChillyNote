'use client';
import IconPlusCircle from '@/components/icon/icon-plus-circle';
import { getCookieToken } from '@/components/layouts/AdminHeader';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Form, Input, Select, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import Swal from 'sweetalert2';

const AddNewProject = () => {
    const router = useRouter();
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [employees, setEmployees] = useState([]);

    const token = getCookieToken();

    const fetchAllEmployee = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND}/api/getAllEmployees`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch all employees');
            }
            const result = await response.json();
            setEmployees(result);
            // console.log(result);
        } catch (error) {
            console.error('Error fetching all employees:', error);
            // Handle error here, e.g., set error state, show error message, etc.
        }
    };

    const onFinish = async (values: object) => {
        // console.log(values);
        setSubmitting(true);
        try {
            const response = await fetch(`${process.env.BACKEND}/api/addNewProjectWithEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                // console.log("SUCESS");
                Swal.fire({
                    title: 'Success!',
                    text: 'Project Added!',
                    icon: 'success',
                }).then(() => {
                    router.push('/admin/all-projects');
                });
            }
        } catch (error) {
            // console.log(error);
            Swal.fire({
                title: 'Failed!',
                text: 'Project Failed!',
                icon: 'error',
            });
        } finally {
            form.resetFields();
            setSubmitting(false);
        }
    };

    const onFinishFailed = (errorInfo: any) => {};

    useEffect(() => {
        fetchAllEmployee();
    }, []);
    return (
        <div>
            <Form form={form} name="add_projects" size="large" layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                <Form.Item
                    label="Project Name"
                    name="project_name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your project name!',
                        },
                    ]}
                >
                    <Input placeholder="Enter project name!" />
                </Form.Item>

                <Form.Item
                    label="Project Description"
                    name="project_description"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your description!',
                        },
                    ]}
                >
                    <ReactQuill theme="snow" className="h-52 pb-10" />
                </Form.Item>

                <Form.Item
                    label="Project Start"
                    name="project_start"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your project start!',
                        },
                    ]}
                >
                    <DatePicker />
                </Form.Item>

                <Form.Item
                    label="Project Deadline"
                    name="project_end"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your deadline!',
                        },
                    ]}
                >
                    <DatePicker />
                </Form.Item>

                <Form.Item
                    label="Assign Employee"
                    name="assigned_employee_id"
                    rules={[
                        {
                            required: false,
                            message: 'Please select Employee!',
                        },
                    ]}
                >
                    <Select
                        showSearch={false}
                        mode="multiple"
                        style={{
                            width: '100%',
                        }}
                        placeholder="Assign Employee"
                        options={employees?.map((item) => ({
                            label: item?.employee_name,
                            value: item?.employee_id,
                        }))}
                    />
                </Form.Item>

                <div className="rounded-xl bg-gray-100 px-3 py-6">
                    <h2 className="mb-3 text-lg">
                        <span className="text-red-600">*</span> Modules
                    </h2>
                    <Form.List name="modules">
                        {(fields, { add, remove }) => (
                            <div
                                style={{
                                    display: 'flex',
                                    rowGap: 16,
                                    flexDirection: 'column',
                                }}
                            >
                                {fields.map((field) => (
                                    <Card
                                        size="small"
                                        title={`Module ${field.name + 1}`}
                                        key={field.key}
                                        extra={
                                            <CloseOutlined
                                                onClick={() => {
                                                    remove(field.name);
                                                }}
                                            />
                                        }
                                    >
                                        <Form.Item label="Module Title" name={[field.name, 'title']} key={`${field.key}-title`}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Module Description"
                                            name={[field.name, 'description']}
                                            key={`${field.key}-description`}
                                            rules={[
                                                {
                                                    required: false,
                                                },
                                            ]}
                                        >
                                            <TextArea className="!h-24" />
                                        </Form.Item>

                                        {/* Nest Form.List */}
                                        <Form.Item label="Sub Task" key={`${field.key}-subtask`}>
                                            <Form.List name={[field.name, 'subtask']} rules={[{ required: false }]}>
                                                {(subFields, subOpt) => (
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            rowGap: 16,
                                                        }}
                                                    >
                                                        {subFields.map((subField, index) => (
                                                            <Space key={subField.key}>
                                                                <Form.Item noStyle name={[subField.name, 'subtask']} key={`${subField.key}-subtask`}>
                                                                    <Input placeholder={`Sub Task ` + (index + 1)} className="min-w-[500px]" />
                                                                </Form.Item>
                                                                <Form.Item
                                                                    noStyle
                                                                    name={[subField.name, 'assigned_employee_id']}
                                                                    key={`${subField.key}-assigned_employee_id`}
                                                                    rules={[
                                                                        {
                                                                            required: false,
                                                                            message: 'Please select Employee!',
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Select
                                                                        allowClear
                                                                        className="min-w-[150px] max-w-[150px]"
                                                                        showSearch={false}
                                                                        mode="multiple"
                                                                        style={{
                                                                            width: '100%',
                                                                        }}
                                                                        placeholder="Employee"
                                                                        options={employees?.map((item) => ({
                                                                            label: item?.employee_name,
                                                                            value: item?.employee_id,
                                                                        }))}
                                                                    />
                                                                </Form.Item>
                                                                <Form.Item noStyle name={[subField.name, 'dueDate']} key={`${subField.key}-dueDate`}>
                                                                    <DatePicker placeholder="Due Date" />
                                                                </Form.Item>

                                                                <CloseOutlined
                                                                    onClick={() => {
                                                                        subOpt.remove(subField.name);
                                                                    }}
                                                                />
                                                            </Space>
                                                        ))}
                                                        <Button type="dashed" onClick={() => subOpt.add()} block className="flex items-center justify-center gap-1">
                                                            Add Sub Task
                                                            <IconPlusCircle />
                                                        </Button>
                                                    </div>
                                                )}
                                            </Form.List>
                                        </Form.Item>
                                    </Card>
                                ))}

                                <Button className="flex items-center justify-center gap-2" type="dashed" onClick={() => add()} block>
                                    <IconPlusCircle />
                                    Add Modules
                                </Button>
                            </div>
                        )}
                    </Form.List>
                </div>

                <div className="mt-5">
                    <Form.Item label="Project Status" name="status" rules={[{ required: true, message: 'Please select a status!' }]}>
                        <Select>
                            <Select.Option value="1">On Going</Select.Option>
                            <Select.Option value="3">Pending From Client</Select.Option>
                            <Select.Option value="2">Completed</Select.Option>
                        </Select>
                    </Form.Item>
                </div>

                <Form.Item label="Additional Note" name="note">
                    <TextArea placeholder="Add additional note for the Employee" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={submitting} className="bg-admin h-11 px-8">
                        {submitting ? <span>Submitting...</span> : <span>Submit</span>}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddNewProject;
