import React from 'react';
import IconEye from '../icon/icon-eye';
import Link from 'next/link';

const NoOfProjects = () => {
    return (
        <div className="mb-6 grid grid-cols-1 gap-6 text-white sm:grid-cols-2 xl:grid-cols-4">
            <div className="panel bg-gradient-to-r from-violet-500 to-violet-400">
                <div className="flex justify-between">
                    <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Total Projects</div>
                    <Link href={'/admin/all-projects'}>
                        <IconEye />
                    </Link>
                </div>
                <div className="mt-2 flex items-center">
                    <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3">10</div>
                </div>
            </div>
            {/* --------------- */}
            <div className="panel bg-gradient-to-r from-green-500 to-green-400">
                <div className="flex justify-between">
                    <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Completed Projects</div>
                    <Link href={'/admin/all-projects'}>
                        <IconEye />
                    </Link>
                </div>
                <div className="mt-2 flex items-center">
                    <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3">10</div>
                </div>
            </div>
            {/* --------------- */}
            <div className="panel bg-gradient-to-r from-orange-500 to-orange-400">
                <div className="flex justify-between">
                    <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">OnGoing Projects</div>
                    <Link href={'/admin/all-projects'}>
                        <IconEye />
                    </Link>
                </div>
                <div className="mt-2 flex items-center">
                    <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3">10</div>
                </div>
            </div>
            {/* --------------- */}
            <div className="panel bg-gradient-to-r from-red-500 to-red-400">
                <div className="flex justify-between">
                    <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Client Pending Projects</div>
                    <Link href={'/admin/all-projects'}>
                        <IconEye />
                    </Link>
                </div>
                <div className="mt-2 flex items-center">
                    <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3">10</div>
                </div>
            </div>
            {/* --------------- */}
        </div>
    );
};

export default NoOfProjects;
