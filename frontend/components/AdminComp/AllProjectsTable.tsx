'use client';
import { Button, Card, DatePicker, Form, Input, Modal, Select, Space, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { getCookieToken } from '../layouts/AdminHeader';
import { CloseOutlined } from '@ant-design/icons';
import Link from 'next/link';
import IconPencil from '../icon/icon-pencil';
import IconEye from '../icon/icon-eye';
import Swal from 'sweetalert2';
import IconTrash from '../icon/icon-trash';
import TextArea from 'antd/es/input/TextArea';
import IconPlusCircle from '../icon/icon-plus-circle';
import IconPlus from '../icon/icon-plus';
import dayjs from 'dayjs';
import moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Project {
    project_name: string;
    project_id: string;
    project_description: string;
    assigned_employee_id: string[];
    assigned_employees: { employee_name: string }[];
    project_start_date: string;
    project_end_date: string;
    project_status: string;
}

const AllProjectsTable: React.FC = () => {
    const [data, setData] = useState<Project[]>();
    const [submitting, setSubmitting] = useState(false);
    const token = getCookieToken();
    const colors = ['purple', 'green', 'blue'];
    const [employee, setEmployee] = useState(null);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const [rowProjectsId, setRowProjectsId] = useState([]);
    const [rowselected, setRowselected] = useState(false);
    const projectIds = rowProjectsId.map((obj) => obj.project_id);
    const [updateProjectId, setUpdateProjectId] = useState(null);
    const [render, setRender] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [form] = Form.useForm();

    const showUpdateModal = (data) => {
        setUpdateProjectId(data.project_id);
        setIsUpdateModalOpen(true);
        form.setFieldsValue(data);
        form.setFieldValue('project_start_date', dayjs(moment(data.project_start_date).format('MM/DD/YYYY'), 'MM/DD/YYYY'));
        form.setFieldValue('project_end_date', dayjs(moment(data.project_end_date).format('MM/DD/YYYY'), 'MM/DD/YYYY'));
        const updatedData = { ...data };
        updatedData.modules.forEach((module: any) => {
            module.subtask.forEach((subtask: any) => {
                subtask.dueDate = dayjs(moment(subtask.dueDate).format('MM/DD/YYYY'), 'MM/DD/YYYY');
            });
        });

        form.setFieldValue('modules', updatedData.modules);
        console.log(data);
        console.log(updatedData);
    };

    const handleUpdateOk = () => {
        setIsUpdateModalOpen(false);
    };
    const handleUpdateCancel = () => {
        setIsUpdateModalOpen(false);
    };

    const rowSelection = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            setRowProjectsId(selectedRows);
            if (selectedRowKeys.length > 0) {
                setRowselected(true);
            } else {
                setRowselected(false);
            }
        },
    };

    const ExpandableConfig = {
        expandedRowRender: (record: any) => (
            <div>
                <div className=" flex items-center gap-2 pb-2">
                    <h2 className="items-center gap-2 text-[1.2rem] font-medium">All modules from the project</h2>
                    <div className="cursor-pointer active:scale-90">
                        <IconEye />
                    </div>
                </div>

                {record.modules.map((module: any, index: any) => (
                    <div key={index} className="my-1.5 flex gap-5 rounded-xl bg-white px-3 py-2 shadow-md">
                        <h2 className="text-[0.95rem]">{module.title}</h2>
                        <Tag color={module?.confusion === '1' ? 'purple' : module?.confusion === '2' ? 'orange' : module?.confusion === '3' ? 'red' : module?.confusion === '4' ? 'green' : 'gray'}>
                            {module?.confusion === '1'
                                ? 'On Going'
                                : module?.confusion === '2'
                                ? 'Doubt'
                                : module?.confusion === '3'
                                ? 'Waiting for client'
                                : module?.confusion === '4'
                                ? 'Completed'
                                : 'No Status'}
                        </Tag>
                        {/* {module.subtask.map((item, index) => (
                  <h3 className="bg-white p-2 my-1">{item.subtask}</h3>
                ))} */}
                    </div>
                ))}
            </div>
        ),
        rowExpandable: (record: any) => record.name !== 'Not Expandable',
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'project_name',
            key: 'project_name',
            fixed: 'left',
            render: (text: string, record: Project) => <Link href={`/admin/project/${record.project_name}?pid=${record.project_id}`}>{text}</Link>,
        },
        {
            title: 'Description',
            dataIndex: 'project_description',
            key: 'project_description',
            render: (text: string) => (
                <div
                    dangerouslySetInnerHTML={{
                        __html: text,
                    }}
                    className="line-clamp-2 text-xs leading-tight text-gray-800"
                ></div>
            ),
        },
        {
            title: 'Employees',
            dataIndex: 'assigned_employee_id',
            key: 'assigned_employee_id',
            render: (_: any, record: Project) => (
                <div>
                    {record?.assigned_employees?.map((item, index) => (
                        <Tag key={index} color={colors[index % colors.length]} className="m-[0.1rem] px-2 py-1">
                            <span className="text-sm">{item?.employee_name}</span>
                        </Tag>
                    ))}
                </div>
            ),
        },
        {
            title: 'Start',
            dataIndex: 'project_start_date',
            key: 'project_start_date',
            render: (text: string) => new Date(text).toLocaleDateString('en-GB', options),
        },
        {
            title: 'End',
            dataIndex: 'project_end_date',
            key: 'project_end_date',
            render: (text: string) => new Date(text).toLocaleDateString('en-GB', options),
        },
        {
            title: 'Status',
            dataIndex: 'project_status',
            key: 'project_status',
            render: (text: string, record: Project) => {
                let statusText = '';
                let color = '';

                if (text === '1') {
                    statusText = 'Ongoing';
                    color = 'orange';
                } else if (text === '2') {
                    statusText = 'Completed';
                    color = 'green';
                } else if (text === '3') {
                    statusText = 'Pending From Client';
                    color = 'red';
                } else {
                    statusText = 'Unknown';
                    color = 'gray';
                }

                return (
                    <Tag className="m-[0.1rem] px-3 py-1 font-medium" color={color}>
                        {statusText}
                    </Tag>
                );
            },
        },
        {
            title: 'Action',
            render: (_: any, record: Project) => (
                <Space size="small">
                    <div onClick={() => showUpdateModal(record)} className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 active:scale-75">
                        <IconPencil />
                    </div>
                    {/* <div className="bg-red-600 p-[0.4rem] rounded-full cursor-pointer transition-all ease-in-out hover:scale-110 duration-300 active:scale-75">
                <Popover
                  title="Confirm Delete"
                  trigger="click"
                  content={
                    <>
                      <div className="space-y-2">
                        <h3>Are you sure you want to delete this project ?</h3>
                        <div className="flex gap-2 items-center justify-end">
                          <Button
                            type="primary"
                            danger
                            onClick={() => handleDelete(record.project_id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </>
                  }
                >
                  <Trash2 size={15} color="#fff" />
                </Popover>
              </div> */}
                    <Link href={`/admin/project/${record.project_name}?pid=${record.project_id}`}>
                        <div className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 active:scale-75">
                            <IconEye />
                        </div>
                    </Link>
                </Space>
            ),
        },
    ];

    const fetchAllProjects = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND}/api/getAllProjects`, {
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
            // console.log(result);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND}/api/getAllEmployees`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }
            const result = await response.json();
            setEmployee(result);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchAllProjects();
    }, [render]);

    const onUpdate = async (values: object) => {
        console.log('Success:', values);
        setSubmitting(true);
        try {
            const response = await fetch(`${process.env.BACKEND}/api/updateProject/${updateProjectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                setRender(!render);
                Swal.fire({
                    title: 'Success!',
                    text: 'Updation Success!',
                    icon: 'success',
                }).then(() => {
                    setIsUpdateModalOpen(!isUpdateModalOpen);
                });
            } else if (response.status === 404) {
                Swal.fire({
                    title: '404',
                    text: 'Updation Failed!',
                    icon: 'error',
                });
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
        } finally {
            setSubmitting(false);
        }
    };

    const onUpdateFailed = (errorInfo: any) => {};

    const handleMultipleDelete = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND}/api/deleteMultipleProjects`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ids: projectIds }),
            });
            if (response.ok) {
                setRender(!render);
                setRowselected(false);
                Swal.fire({
                    title: 'Success',
                    text: 'Project Deleted!',
                    icon: 'success',
                });
            }
        } catch (error) {
            console.log('Error Deleting Product', error);
        }
    };

    return (
        <div>
            <div className="flex">
                <h2 className="pb-2 text-xl font-medium">All Projects</h2>
                <div className="mx-3 inline-block">
                    {rowselected ? (
                        <>
                            <div
                                onClick={handleMultipleDelete}
                                className="flex scale-100 cursor-pointer items-center gap-1 rounded-xl bg-red-400 px-4 py-1.5 text-sm text-white
                  transition-all duration-500 ease-in-out"
                            >
                                <h2 className="">Delete</h2>
                                <IconTrash />
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <Table
                expandable={ExpandableConfig}
                rowSelection={rowSelection}
                dataSource={data}
                columns={columns}
                pagination={false}
                scroll={{
                    x: 1300,
                }}
            />
            <Modal
                title="Update Project Details"
                open={isUpdateModalOpen}
                onOk={handleUpdateOk}
                width={1000}
                style={{
                    top: 30,
                }}
                footer={null}
                onCancel={handleUpdateCancel}
            >
                <div>
                    <Form
                        form={form}
                        name="add_projects"
                        size="large"
                        layout="vertical"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onUpdate}
                        onFinishFailed={onUpdateFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Name"
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
                            label="Description"
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
                            label="Start"
                            name="project_start_date"
                            rules={[
                                {
                                    required: false,
                                    message: 'Please input your project start!',
                                },
                            ]}
                        >
                            <DatePicker format={'MM/DD/YYYY'} />
                        </Form.Item>

                        <Form.Item
                            label="Deadline"
                            name="project_end_date"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your deadline!',
                                },
                            ]}
                        >
                            <DatePicker format={'MM/DD/YYYY'} />
                        </Form.Item>

                        <Form.Item
                            label="Employee"
                            name="assigned_employee_id"
                            rules={[
                                {
                                    required: false,
                                    message: 'Please select Employee!',
                                },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Assign Employee"
                                options={employee?.map((name: any) => ({
                                    label: name?.employee_name,
                                    value: name?.employee_id,
                                }))} // Convert names to options format
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
                                                <Form.Item label="Module Description" name={[field.name, 'description']} key={`${field.key}-description`}>
                                                    <TextArea className="!h-60" />
                                                </Form.Item>

                                                {/* Nest Form.List */}
                                                <Form.Item label="Sub Task" key={`${field.key}-subtask`}>
                                                    <Form.List name={[field.name, 'subtask']}>
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
                                                                            <Input placeholder={`Sub Task ` + (index + 1)} className="min-w-[700px]" />
                                                                        </Form.Item>
                                                                        <Form.Item noStyle name={[subField.name, 'dueDate']} key={`${subField.key}-dueDate`}>
                                                                            <DatePicker placeholder="Due Date" format={'MM/DD/YYYY'} />
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
                                                                    <IconPlus />
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
                            <Form.Item label="Project Status" name="project_status" rules={[{ required: true, message: 'Please select a status!' }]}>
                                <Select>
                                    <Select.Option value="1">On Going</Select.Option>
                                    <Select.Option value="3">Pending From Client</Select.Option>
                                    <Select.Option value="2">Completed</Select.Option>
                                </Select>
                            </Form.Item>
                        </div>

                        <Form.Item label="Additional Note" name="additional_note">
                            <TextArea placeholder="Add additional note for the Employee" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="bg-admin h-11 px-8" loading={submitting}>
                                {submitting ? <span>Updating...</span> : <span>Update</span>}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};

export default AllProjectsTable;
