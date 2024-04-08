'use client';
import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import IconPencil from '@/components/icon/icon-pencil';
import Link from 'next/link';
import IconEye from '@/components/icon/icon-eye';
import { getCookieToken } from '@/components/layouts/EmployeeHeader';

interface DataType {
    project_id: string;
    project_name: string;
    project_description: string;
    assigned_employee_id: string;
    assigned_employees: { employee_name: string }[];
    project_start_date: string;
    project_end_date: string;
    project_status: string;
}

const MyProjects: React.FC = () => {
    const [data, setData] = useState<DataType[]>([]);
    const token = getCookieToken();
    const colors = ['purple', 'green', 'blue'];
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Project Name',
            dataIndex: 'project_name',
            key: 'project_name',
            fixed: 'left',
            render: (text: string, record: DataType) => <Link href={`/employee/project/${record.project_name}?pid=${record.project_id}`}>{text}</Link>,
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
                    className="line-clamp-2 leading-tight text-gray-800"
                ></div>
            ),
        },
        {
            title: 'Employees',
            dataIndex: 'assigned_employee_id',
            key: 'assigned_employee_id',
            render: (_: any, record: DataType) => (
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
            render: (text: string, record: DataType) => {
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
            render: (_: any, record: DataType) => (
                <Space size="small">
                    <div
                        //  onClick={() => showUpdateModal(record)}
                        className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 active:scale-75"
                    >
                        <IconPencil />
                    </div>
                    <Link href={`/employee/project/${record.project_name}?pid=${record.project_id}`}>
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

    useEffect(() => {
        fetchAllProjects();
    }, []);

    return (
        <>
            <h2 className="pb-2 text-xl font-medium">All Projects</h2>
            <Table
                dataSource={data}
                columns={columns}
                pagination={false}
                scroll={{
                    x: 1300,
                }}
            />
        </>
    );
};

export default MyProjects;
