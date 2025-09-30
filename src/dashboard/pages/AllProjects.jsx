import React from "react";
import { Link } from "react-router-dom";
import ProjectComponent from "../custom-components/ProjectComponent";

const AllProjects = () => {
  return ( 
    <div className="min-h-screen bg-gray-50 p-3 xs:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col xxs:flex-row xxs:items-center xxs:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl xs:text-3xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600 mt-1 xs:mt-2">Manage your project portfolio</p>
            </div>
            <Link
              className="inline-flex items-center justify-center px-3 xs:px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium shadow-sm"
              to={"/dashboard/project/create"}
            >
              Create Project
            </Link>
          </div>
        </div>

        {/* Projects Component */}
        <div className="overflow-hidden">
          <ProjectComponent />
        </div>
      </div>
    </div>
  );
};

export default AllProjects;
