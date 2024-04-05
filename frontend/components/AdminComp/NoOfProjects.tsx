'use client';
import React, { useEffect, useState } from 'react';
import { getCookieToken } from '../layouts/AdminHeader';

// 1 for ongoing
// 2 for completed
// 3 for pending from client

const NoOfProjects = () => {
    const [data, setData] = useState<any | undefined>([]);
    const token = getCookieToken();

    const fetchProjectStatus = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND}/api/getAllProjects`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch project status');
            }

            const result = await response.json();
            console.log(result);

            setData(result);
        } catch (error) {
            console.error('Error fetching project status:', error);
        }
    };

    useEffect(() => {
        fetchProjectStatus();
    }, []);

    return (
        <div className="mb-6 grid grid-cols-1 gap-6 text-white sm:grid-cols-2 xl:grid-cols-4">
            <div className="panel bg-gradient-to-r from-violet-500 to-violet-400">
                <div className="flex justify-between">
                    <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Total Projects</div>
                    {/* <Link href={'/admin/all-projects'}>
                        <IconEye />
                    </Link> */}
                </div>
                <div className="mt-2 flex items-center">
                    <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3">{data?.length}</div>
                </div>
            </div>
            {/* --------------- */}
            <div className="panel bg-gradient-to-r from-green-500 to-green-400">
                <div className="flex justify-between">
                    <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Completed Projects</div>
                    {/* <Link href={'/admin/all-projects'}>
                        <IconEye />
                    </Link> */}
                </div>
                <div className="mt-2 flex items-center">
                    <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3">
                        {data && data?.filter((project: any) => project.project_status === '2').length < 10
                            ? `0${data?.filter((project: any) => project.project_status === '2').length}`
                            : data?.filter((project: any) => project.project_status === '2').length}
                    </div>
                </div>
            </div>
            {/* --------------- */}
            <div className="panel bg-gradient-to-r from-orange-500 to-orange-400">
                <div className="flex justify-between">
                    <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">OnGoing Projects</div>
                    {/* <Link href={'/admin/all-projects'}>
                        <IconEye />
                    </Link> */}
                </div>
                <div className="mt-2 flex items-center">
                    <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3">
                        {data && data?.filter((project: any) => project.project_status === '1').length < 10
                            ? `0${data?.filter((project: any) => project.project_status === '1').length}`
                            : data?.filter((project: any) => project.project_status === '1').length}
                    </div>
                </div>
            </div>
            {/* --------------- */}
            <div className="panel bg-gradient-to-r from-red-500 to-red-400">
                <div className="flex justify-between">
                    <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Client Pending Projects</div>
                    {/* <Link href={'/admin/all-projects'}>
                        <IconEye />
                    </Link> */}
                </div>
                <div className="mt-2 flex items-center">
                    <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3">
                        {data && data?.filter((project: any) => project.project_status === '3').length < 10
                            ? `0${data?.filter((project: any) => project.project_status === '3').length}`
                            : data?.filter((project: any) => project.project_status === '3').length}
                    </div>
                </div>
            </div>
            {/* --------------- */}
        </div>
    );
};

export default NoOfProjects;
