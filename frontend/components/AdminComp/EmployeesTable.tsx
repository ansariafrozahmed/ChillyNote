'use client';
import { Button, Form, Input, InputNumber, Modal, Popover, Select, Space, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { getCookieToken } from '../layouts/AdminHeader';
import Swal from 'sweetalert2';
import IconEye from '../icon/icon-eye';
import IconTrash from '../icon/icon-trash';
import IconPencil from '../icon/icon-pencil';
import IconTrashLines from '../icon/icon-trash-lines';
import { useForm } from 'antd/es/form/Form';

const getColor = (role: string) => {
    switch (role) {
        case 'developer':
            return 'cyan';
        case 'seo':
            return 'green';
        case 'social-media':
            return 'purple';
        default:
            return 'cyan';
    }
};

const EmployeesTable: React.FC = () => {
    const [form] = useForm();
    const [data, setData] = useState();
    const token = getCookieToken();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectKey, setSelectedKey] = useState(null);
    const [profileId, setProfileId] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [showProfile, setShowProfile] = useState(false);

    const showModal = (data: any) => {
        setProfileId(data?.employee_id);
        setProfileData(data);
        setSubmitting(false);
        setIsModalOpen(true);
        if (data) {
            setSelectedKey(data.uid);
            form.setFieldsValue(data);
        } else {
            form.resetFields();
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setShowProfile(false);
        form.resetFields();
        setSelectedKey(null);
    };

    const columns = [
        {
            title: 'Id',
            dataIndex: 'employee_id',
            key: 'employee_id',
        },
        {
            title: 'Name',
            dataIndex: 'employee_name',
            key: 'employee_name',
        },
        {
            title: 'Email',
            dataIndex: 'employee_email',
            key: 'employee_email',
        },
        {
            title: 'Designation',
            dataIndex: 'employee_designation',
            key: 'employee_designation',
            render: (text: any, record: any) => (
                <Tag key={record.uid} className="m-[0.1rem] px-2 py-1 text-[0.95rem]" color={getColor(record.employee_role)}>
                    {text}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record: any) => (
                <Space size="middle">
                    <div
                        onClick={() => {
                            setSelectedKey(record.uid);
                            showModal(record);
                        }}
                        className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 active:scale-75"
                    >
                        <IconPencil className="" />
                    </div>
                    <div className="cursor-pointer transition-all  duration-300 ease-in-out hover:scale-110 active:scale-75">
                        <Popover
                            title="Confirm Delete"
                            trigger="click"
                            content={
                                <>
                                    <div className="w-52 space-y-2">
                                        <h3>
                                            Are you sure you want to delete employe <span className="font-medium text-blue-500">{record?.employee_name}</span> ?
                                        </h3>
                                        <div className="flex items-center justify-end gap-2">
                                            <Button type="primary" danger onClick={() => handleDelete(record.uid)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            }
                        >
                            <div>
                                <IconTrashLines className="text-red-500" />
                            </div>
                        </Popover>
                    </div>
                    <div
                        onClick={() => {
                            setShowProfile(true);
                            showModal(record);
                        }}
                        className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 active:scale-75"
                    >
                        <IconEye />
                    </div>
                </Space>
            ),
        },
    ];

    const fetchEmployeeData = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND}/api/getAllEmployees`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error Fetching Data:', error);
        }
    };

    const handleSubmit = async (values: object) => {
        setSubmitting(true);

        if (selectKey) {
            console.log('SUCCESS', values);
            try {
                const response = await fetch(`${process.env.BACKEND}/api/updateEmployee/${selectKey}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    setSubmitting(false);
                    handleCancel();
                    Swal.fire({
                        title: 'Success!',
                        text: 'Updation Success!',
                        icon: 'success',
                    });
                } else if (response.status === 404) {
                    Swal.fire({
                        title: '404',
                        text: 'Updation Failed!',
                        icon: 'error',
                    });
                } else if (response.status === 401) {
                    console.log('Unauthorized: You are not authorized to access this resource.');
                } else {
                    Swal.fire({
                        title: '500!',
                        text: 'Updation Failed!',
                        icon: 'error',
                    });
                }
            } catch (error) {
                console.log(error, 'INTERNAL SERVER ERROR');
                Swal.fire({
                    title: 'Failed!',
                    text: 'Internal Server Error!',
                    icon: 'error',
                });
            }
        } else {
            try {
                const response = await fetch(`${process.env.BACKEND}/api/addEmployees`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(values),
                });

                if (response.ok) {
                    setIsModalOpen(false);
                    Swal.fire({
                        title: 'Success',
                        text: 'Employee Added & Notified on Mail!',
                        icon: 'success',
                    });
                } else if (response.status === 400) {
                    Swal.fire({
                        title: 'Invalid Email',
                        text: 'Email Already Exists',
                        icon: 'error',
                    });
                } else if (response.status === 401) {
                    Swal.fire({
                        title: 'Invalid Email',
                        text: 'Employee ID already exists',
                        icon: 'error',
                    });
                } else {
                    Swal.fire({
                        title: 'Something Went Wrong',
                        text: 'Please try Again',
                        icon: 'error',
                    });
                }
            } catch (error) {
                console.log(error);
            } finally {
                setSubmitting(false);
                form.resetFields();
            }
        }
    };

    const handleDelete = async (id: string) => {
        console.log(id);
        try {
            const response = await fetch(`${process.env.BACKEND}/api/deleteEmployee/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setSubmitting(!submitting);
                Swal.fire({
                    title: 'Success',
                    text: 'Employee Deleted!',
                    icon: 'success',
                });
            } else if (response.status === 401) {
                console.error('Unauthorized: You are not authorized to access this resource.');
                // Log error for unauthorized access
            } else {
                throw new Error('Failed to delete employee');
            }
        } catch (error) {
            console.error('Error Deleting Employee:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to delete employee',
                icon: 'error',
            });
        }
    };

    const addEmployeeFailed = () => {};

    useEffect(() => {
        fetchEmployeeData();
    }, [submitting]);

    return (
        <>
            <div className=" flex items-center justify-start gap-2">
                <button type="button" onClick={showModal} className="btn btn-dark my-4">
                    Add New
                </button>
                <button type="button" className="btn btn-dark my-4">
                    Total Employees
                    <span className="badge my-0 bg-white-light text-black ltr:ml-4 rtl:mr-4">{data ? data.length : '0'}</span>
                </button>
            </div>
            <Table scroll={{ x: 1000 }} columns={columns} dataSource={data} pagination={false} />
            {/* ----- */}
            {/* MODAL */}
            {/* ----- */}
            <Modal title="Employee detail..." footer={null} open={isModalOpen} style={{ top: 20 }} onCancel={handleCancel}>
                {showProfile ? (
                    <>
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="h-28 w-28 overflow-hidden rounded-full bg-gray-100">
                                <img src="https://avatarairlines.com/wp-content/uploads/2020/05/Male-placeholder.jpeg" className="h-full w-full object-cover" alt="Profile Picture" />
                            </div>
                            <div className="text-center">
                                <h2 className="text-center text-xl font-semibold text-gray-800">{profileData?.employee_name}</h2>
                                <h3 className="text-gray-700">
                                    <a href={`mailto:${profileData?.employee_email}`}>{profileData?.employee_email}</a>
                                </h3>
                            </div>
                            <Tag color="green" className="px-4 py-1.5 text-[0.95rem]">
                                {profileData?.employee_designation}
                            </Tag>
                        </div>
                    </>
                ) : (
                    <Form
                        form={form}
                        className="mt-8"
                        name="New Employee Form"
                        size="large"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={handleSubmit}
                        onFinishFailed={addEmployeeFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Name"
                            name="employee_name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your employee name!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="employee_email"
                            rules={[
                                {
                                    type: 'email',
                                    required: true,
                                    message: 'Please input your employee email!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        {!selectKey && (
                            <Form.Item
                                label="Password"
                                name="employee_password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your employee password!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                        )}

                        <Form.Item
                            label="Designation"
                            name="employee_designation"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your employee designation!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Employee Id"
                            name="employee_id"
                            rules={[
                                {
                                    type: 'number',
                                    required: true,
                                    message: 'Please input your employee id!',
                                },
                            ]}
                        >
                            <InputNumber />
                        </Form.Item>

                        <Form.Item
                            label="Select Role"
                            name="employee_role"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your employee role!',
                                },
                            ]}
                        >
                            <Select>
                                <Select.Option value="developer">Developer</Select.Option>
                                <Select.Option value="seo">SEO Executive</Select.Option>
                                <Select.Option value="social-media">Social Media</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Button type="default" className="bg-admin btn btn-primary px-5 text-white" htmlType="submit" loading={submitting}>
                                {submitting ? <span>{selectKey ? 'Updating' : 'Adding'} Employee...</span> : <span>{selectKey ? 'Update' : 'Add'} Employee</span>}
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </>
    );
};

export default EmployeesTable;
