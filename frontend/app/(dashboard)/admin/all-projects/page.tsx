import AllProjectsTable from '@/components/AdminComp/AllProjectsTable';
import NoOfProjects from '@/components/AdminComp/NoOfProjects';
import React from 'react';

const AllProjects = () => {
    return (
        <div>
            <NoOfProjects />
            <AllProjectsTable />
        </div>
    );
};

export default AllProjects;
