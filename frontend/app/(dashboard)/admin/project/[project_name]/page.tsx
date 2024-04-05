'use client';
import IconArrowBackward from '@/components/icon/icon-arrow-backward';
import { getCookieToken } from '@/components/layouts/AdminHeader';
import { Divider, Tag } from 'antd';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { date } from 'yup';

interface ProjectData {
    project_name: string;
    project_description: string;
    project_status: string;
    project_creation_date: any;
    project_start_date: any;
    project_end_date: any;
    assigned_employees: any[];
    modules: any[];
    additional_note: string;
}

const ProjectDetails = () => {
    const [data, setData] = useState<ProjectData | null>(null);
    const params = useSearchParams();
    const pid = params.get('pid');
    const token = getCookieToken();
    const colors = ['purple', 'green', 'blue'];
    const [employee, setEmployee] = useState(null);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const [active, setActive] = useState<number>(1);
    const togglePara = (value: number) => {
        setActive((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    const fetchProjectDetail = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND}/api/projectDetail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ pid }),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            const result = await response.json();
            setData(result);
            console.log(result);
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
        fetchProjectDetail();
    }, []);
    return (
        <>
            {/* <button type="button" className="btn btn-dark my-4"> */}
            <Link href={'/admin/all-projects'} className="inline-flex items-center gap-1 rounded-lg font-medium">
                <IconArrowBackward /> Back
            </Link>
            <Divider />
            {/* </button> */}
            <div className="space-y-8">
                <h2 className="text-[1rem]">
                    <span className="font-medium">Project Name :</span> {data?.project_name}
                </h2>
                <div>
                    <h2 className="text-[1rem] font-medium">Project Description : </h2>
                    {data?.project_description && <div className="mt-2 text-sm" dangerouslySetInnerHTML={{ __html: data.project_description }}></div>}
                </div>
                <h2 className="text-[1rem] font-medium">
                    Project Status :{' '}
                    <span className="">
                        <Tag className="mx-[0.2rem] px-3 tracking-wider" color={data?.project_status === '1' ? 'red' : 'green'}>
                            {data?.project_status === '1' ? 'Ongoing' : 'Completed'}
                        </Tag>
                    </span>
                </h2>
                <h2 className="text-[1rem]">
                    <span className="font-medium">Project Created On :</span> {new Date(data?.project_creation_date).toLocaleDateString('en-GB', options)}
                </h2>
                <h2 className="text-[1rem]">
                    <span className="font-medium">Project Start On :</span> {new Date(data?.project_start_date).toLocaleDateString('en-GB', options)}
                </h2>
                <h2 className="text-[1rem]">
                    <span className="font-medium">Project Ends On :</span> {new Date(data?.project_end_date).toLocaleDateString('en-GB', options)}
                </h2>
                <h2 className="font-medium">
                    Employee Assigned :{' '}
                    {data?.assigned_employees?.map((item: object, index: any) => (
                        <span className="" key={index}>
                            <Tag className="mx-[0.2rem] px-3 py-1 text-sm" color={colors[index % colors.length]} key={index}>
                                {item?.employee_name}
                            </Tag>
                        </span>
                    ))}
                </h2>
                <h2 className="text-3xl font-medium">Modules</h2>
                <div className="">
                    <div className="space-y-2 font-semibold">
                        {data?.modules?.map((item, index) => (
                            <div key={index} className="rounded border border-[#d3d3d3] dark:border-[#1b2e4b]">
                                <button type="button" className={`flex w-full items-center p-4 text-lg font-medium text-gray-900 dark:bg-[#1b2e4b] `} onClick={() => togglePara(index + 1)}>
                                    {item?.title}
                                </button>
                                <div>
                                    <AnimateHeight duration={300} height={active === index + 1 ? 'auto' : 0}>
                                        <div className="space-y-2 border-t border-[#d3d3d3] p-4 text-[13px] text-white-dark dark:border-[#1b2e4b]">
                                            <p className="text-lg font-normal text-gray-800">Description</p>
                                            <p>{item?.description}</p>
                                            <p className="text-lg font-normal text-gray-800">Sub Task</p>
                                            <div>
                                                {item.subtask?.map((task: object, index: number) => (
                                                    <p key={index}>{task?.subtask}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </AnimateHeight>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-[1rem] font-medium">Additional Note : </h2>
                    <h2 className="text-sm">{data?.additional_note}</h2>
                </div>
            </div>
        </>
    );
};

export default ProjectDetails;
