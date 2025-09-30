import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaChartLine, FaClock, FaCheckCircle, FaPauseCircle, FaProjectDiagram } from "react-icons/fa";
import { base_url } from "../../config/config";
import storeContext from "../../context/storeContext";
import axios from "axios";

const AdminIndex = () => {
  const { store } = useContext(storeContext);
  const [projects, setProjects] = useState([]);
  const [pendingNewCount, setPendingNewCount] = useState(0);
  const [activeNewCount, setActiveNewCount] = useState(0);
  const [deactiveNewCount, setDeactiveNewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const get_projects = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${base_url}/api/get-project`, {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
      });
      setProjects(data.data);
      categorizeNews(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const categorizeNews = (newsList) => {
    let pendingCount = 0;
    let activeCount = 0;
    let deactiveCount = 0;

    newsList.forEach((newsItem) => {
      if (newsItem.status === "pending") {
        pendingCount++;
      } else if (newsItem.status === "active") {
        activeCount++;
      } else if (newsItem.status === "deactive") {
        deactiveCount++;
      }
    });

    setPendingNewCount(pendingCount);
    setActiveNewCount(activeCount);
    setDeactiveNewCount(deactiveCount);
  };

  useEffect(() => {
    get_projects();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        class: "bg-yellow-100 text-yellow-800 border-yellow-200", 
        label: "Pending",
        icon: FaClock
      },
      active: { 
        class: "bg-green-100 text-green-800 border-green-200", 
        label: "Active",
        icon: FaCheckCircle
      },
      deactive: { 
        class: "bg-red-100 text-red-800 border-red-200", 
        label: "Inactive",
        icon: FaPauseCircle
      }
    };
    
    return statusConfig[status] || statusConfig.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 xs:p-6"> 
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl xs:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1 xs:mt-2">Welcome to your project management dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-8">
          {[
            { 
              label: 'Total Projects', 
              value: projects.length, 
              color: 'bg-gradient-to-r from-purple-500 to-purple-600',
              icon: FaProjectDiagram,
              description: 'All projects'
            },
            { 
              label: 'Pending Projects', 
              value: pendingNewCount, 
              color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
              icon: FaClock,
              description: 'Awaiting approval'
            },
            { 
              label: 'Active Projects', 
              value: activeNewCount, 
              color: 'bg-gradient-to-r from-green-500 to-green-600',
              icon: FaCheckCircle,
              description: 'Live projects'
            },
            { 
              label: 'Inactive Projects', 
              value: deactiveNewCount, 
              color: 'bg-gradient-to-r from-red-500 to-red-600',
              icon: FaPauseCircle,
              description: 'Paused projects'
            }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.color} rounded-2xl p-3 xs:p-4 sm:p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-200`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl xxs:text-2xl font-bold mb-2">{stat.value}</p>
                    <p className="text-base xxs:text-lg font-semibold mb-1">{stat.label}</p>
                    <p className="text-white/80 text-sm">{stat.description}</p>
                  </div>
                  <div className="w-12 h-12 hidden bg-white/20 rounded-full xxs:flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Projects Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-3 xxs:px-4 sm:px-6 py-4 border-b border-amber-200 bg-gradient-to-r from-amber-100 to-amber-50">
            <div className="flex items-end xxs:items-center justify-between ">
              <div>
                <h3 className="text-base xxs:text-lg font-semibold text-gray-900">Recent Projects</h3>
                <p className="text-gray-600 text-xs xs:text-sm mt-1">Latest project updates and status</p>
              </div>
              <span className="text-xs xs:text-sm text-gray-500">
                Showing {Math.min(projects.length, 10)} of {projects.length} projects
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-3 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-3 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Project Type
                  </th>
                  <th className="px-3 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-3 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.slice(0, 10).map((project, index) => {
                  const statusConfig = getStatusBadge(project.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <tr 
                      key={project._id} 
                      className="hover:bg-gray-50/50 transition-all duration-200"
                    >
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {project.projectType}
                        </div>
                        {project.projectName && (
                          <div className="text-xs text-gray-500 mt-1">
                            {project.projectName}
                          </div>
                        )}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <div className="relative w-16 h-16">
                          <img
                            src={project.projectImage[0]?.url || project.projectImage[0]}
                            className="w-16 h-16 object-cover rounded-xl border-2 border-gray-200"
                            alt={project.projectName}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-2 px-2 xxs:px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.class}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`http://localhost:5173/category/${project.slug}`}
                            target="_blank"
                            className="p-2 xxs:p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md group/action"
                            title="View Project"
                          >
                            <FaEye className="w-3 xs:w-4 h-3 xs:h-4 group-hover/action:scale-110 transition-transform" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {projects.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaProjectDiagram className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4">
                Get started by creating your first project to see it here.
              </p>
              <Link
                to="/dashboard/project/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors"
              >
                <FaProjectDiagram className="w-4 h-4" />
                Create First Project
              </Link>
            </div>
          )}

          {/* View All Projects Link */}
          {projects.length > 10 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="text-center">
                <Link
                  to="/dashboard/allProjects"
                  className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
                >
                  View All Projects
                  <FaEye className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminIndex;