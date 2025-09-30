import React, { useContext, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaTimes,
  FaSlidersH,
} from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import axios from "axios";
import storeContext from "../../context/storeContext";
import toast from "react-hot-toast";
import { base_url } from "../../config/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProjectComponent = () => {
  const { store } = useContext(storeContext);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState('newest');

  // Derived statistics from projects
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === "active").length,
    pending: projects.filter(p => p.status === "pending").length,
    inactive: projects.filter(p => p.status === "deactive").length,
  };

  const getProjects = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${base_url}/api/get-project`, {
        headers: { Authorization: `Bearer ${store.token}` },
      });
      setProjects(data.data);
      setFilteredProjects(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching projects:", error);
    }
  }, [store.token]);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  const calculatePages = () => Math.ceil(filteredProjects.length / perPage);

  useEffect(() => {
    setPage(1);
  }, [filteredProjects, perPage]);

  // Get unique project types for filter
  const projectTypes = [
    ...new Set(projects.map((project) => project.projectType)),
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setSortBy('newest');
  };

  // Combined filter function
  const applyFilters = useCallback(() => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((project) =>
        project.projectType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.projectName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter((project) => project.status === statusFilter);
    }

    // Filter by project type
    if (typeFilter && typeFilter !== 'all') {
      filtered = filtered.filter(
        (project) => project.projectType === typeFilter
      );
    }

    // Apply sorting
    if (sortBy === 'newest') {
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      filtered = [...filtered].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'name') {
      filtered = [...filtered].sort((a, b) => a.projectType?.localeCompare(b.projectType));
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter, typeFilter, sortBy]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUpdateStatus = async (status, projectId) => {
    try {
      setSelectedProjectId(projectId);
      const { data } = await axios.put(
        `${base_url}/api/updateProjectStatus/${projectId}`,
        { status },
        { headers: { Authorization: `Bearer ${store.token}` } }
      );
      toast.success(data.message);
      getProjects();
    } catch (error) {
      console.error("Error updating project status:", error);
      toast.error("Failed to update project status");
    } finally {
      setSelectedProjectId("");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`${base_url}/api/delete-project/${projectId}`, {
          headers: { Authorization: `Bearer ${store.token}` },
        });
        toast.success("Project deleted successfully");
        getProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
        toast.error("Failed to delete project");
      }
    }
  };

  const paginatedProjects = filteredProjects.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        class: "bg-blue-50 text-blue-700 border-blue-200",
        label: "Pending",
        dot: "bg-blue-500",
      },
      active: {
        class: "bg-green-50 text-green-700 border-green-200",
        label: "Active",
        dot: "bg-green-500",
      },
      deactive: {
        class: "bg-red-50 text-red-700 border-red-200",
        label: "Inactive",
        dot: "bg-red-500",
      },
    };

    return statusConfig[status] || statusConfig.pending;
  };

  return (
    <div className="">
      {/* Header with Stats */}
      <div className="mb-8">
        {/* Premium Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-md border border-white/20 p-3 xxs:p-4 sm:p-6 lg:p-8">
          {/* Enhanced Filters Grid */}
          <div className="space-y-4">
            {/* Search Row */}
            <div className="relative group">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2  w-4 h-4 transition-colors" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search projects type..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-gray-400 text-gray-700"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full h-12 border-2 outline-none focus:ring-0 rounded-2xl bg-white/50 backdrop-blur-sm transition-all duration-300">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-2 border-gray-200 bg-white/95 backdrop-blur-sm">
                    <SelectItem value="all" className="rounded-lg">All Status</SelectItem>
                    <SelectItem value="pending" className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="active" className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="deactive" className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Inactive
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Project Type Filter */}
              <div className="space-y-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full h-12 border-2 border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-0 outline-none transition-all duration-300">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-2 border-gray-200 bg-white/95 backdrop-blur-sm">
                    <SelectItem value="all" className="rounded-lg">All Types</SelectItem>
                    {projectTypes.map((type, index) => (
                      <SelectItem key={index} value={type} className="rounded-lg capitalize">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By Filter */}
              <div className="space-y-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full h-12 border-2 border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-0 outline-none transition-all duration-300">
                    <SelectValue placeholder="Newest First" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-2 border-gray-200 bg-white/95 backdrop-blur-sm">
                    <SelectItem value="newest" className="rounded-lg">Newest First</SelectItem>
                    <SelectItem value="oldest" className="rounded-lg">Oldest First</SelectItem>
                    <SelectItem value="name" className="rounded-lg">Project Type</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full h-12 px-6 bg-gradient-to-r from-gray-100 to-gray-50 border-2 border-gray-200 text-gray-700 rounded-2xl hover:from-gray-200 hover:to-gray-100 hover:border-gray-300 hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center gap-2 group"
                >
                  <FaTimes className="w-4 h-4 transition-transform group-hover:scale-110" />
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Active Filters */}
          {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
            <div className="mt-6 pt-6 border-t border-gray-200/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                <button
                  onClick={clearFilters}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-sm font-medium shadow-lg shadow-amber-500/25">
                    Search: "{searchTerm}"
                    <button 
                      onClick={() => setSearchTerm("")} 
                      className="hover:text-amber-200 transition-colors duration-200 ml-1"
                    >
                      ×
                    </button>
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium shadow-lg shadow-blue-500/25">
                    Status: {statusFilter}
                    <button 
                      onClick={() => setStatusFilter("all")} 
                      className="hover:text-blue-200 transition-colors duration-200 ml-1"
                    >
                      ×
                    </button>
                  </span>
                )}
                {typeFilter !== 'all' && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-sm font-medium shadow-lg shadow-green-500/25">
                    Type: {typeFilter}
                    <button 
                      onClick={() => setTypeFilter("all")} 
                      className="hover:text-green-200 transition-colors duration-200 ml-1"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/60 overflow-hidden">
        {/* Table Header */}
        <div className="px-3 xxs:px-4 sm:px-6 py-4 border-b border-amber-200 bg-gradient-to-r from-amber-100 to-amber-50">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            Projects ({filteredProjects.length})
          </h3>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-3 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  #
                </th>
                <th className="px-3 md:px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Project Type
                </th>
                <th className="px-3 md:px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-3 md:px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 md:px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {!loading &&
                paginatedProjects.map((project, index) => {
                  const statusConfig = getStatusBadge(project.status);
                  return (
                    <tr
                      key={project._id}
                      className="hover:bg-gray-50/50 transition-all duration-200 group"
                    >
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {(page - 1) * perPage + index + 1}
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-4 text-center whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {project.projectType}
                        </div>
                        {project.projectName && (
                          <div className="text-xs text-gray-500 mt-1">
                            {project.projectName}
                          </div>
                        )}
                      </td>
                      <td className="px-3 md:px-6 py-4 flex justify-center whitespace-nowrap">
                        <div className="relative w-16 h-16 group/image">
                          <img
                            src={
                              project.projectImage[0]?.url ||
                              project.projectImage[0]
                            }
                            className="w-16 h-16 object-cover rounded-xl border-2 border-gray-200 group-hover/image:border-amber-300 transition-all duration-200 shadow-sm"
                            alt={project.projectName}
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/80?text=No+Image";
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-4 text-center whitespace-nowrap">
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              project.status === "active"
                                ? "deactive"
                                : "active",
                              project._id
                            )
                          }
                          disabled={selectedProjectId === project._id}
                          className={`inline-flex items-center gap-2 px-2 xxs:px-3 sm:px-4 py-1 xxs:py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer ${
                            statusConfig.class
                          } ${
                            selectedProjectId === project._id
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:shadow-md hover:scale-105"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${statusConfig.dot}`}
                          ></div>
                          {selectedProjectId === project._id
                            ? "Updating..."
                            : statusConfig.label}
                        </button>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center items-center gap-2">
                          <Link
                            to={`https://architectusbureau.com/category/${project.slug}`}
                            target="_blank"
                            className="p-2 xxs:p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md group/action"
                            title="View Project"
                          >
                            <FaEye className="w-3 sm:w-4 h-3 sm:h-4 group-hover/action:scale-110 transition-transform" />
                          </Link>
                          <Link
                            to={`/dashboard/project/edit/${project._id}`}
                            className="p-2 xxs:p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-sm hover:shadow-md group/action"
                            title="Edit Project"
                          >
                            <FaEdit className="w-3 sm:w-4 h-3 sm:h-4 group-hover/action:scale-110 transition-transform" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProject(project._id)}
                            className="p-2 xxs:p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md group/action"
                            title="Delete Project"
                          >
                            <FaTrash className="w-3 sm:w-4 h-3 sm:h-4 group-hover/action:scale-110 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading projects...</p>
            <p className="text-gray-500 text-sm mt-1">
              Please wait while we fetch your projects
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && paginatedProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 sm:w-24 h-16 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="w-7 sm:w-10 h-7 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              {projects.length === 0
                ? "You haven't created any projects yet. Get started by creating your first project."
                : "No projects match your current filters. Try adjusting your search criteria."}
            </p>
            {(searchTerm || statusFilter || typeFilter) && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Pagination */}
      {!loading && paginatedProjects.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/60 p-6 mt-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Show</span>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(parseInt(e.target.value));
                  setPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg transition-all duration-200 bg-gray-50"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
              <span className="text-sm text-gray-700">entries per page</span>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-xs xxs:text-sm text-gray-700">
                Showing{" "}
                <span className="font-semibold">
                  {(page - 1) * perPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(page * perPage, filteredProjects.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold">{filteredProjects.length}</span>{" "}
                projects
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => page > 1 && setPage(page - 1)}
                  disabled={page === 1}
                  className={`p-1 xxs:p-2 xs:p-3 rounded-xl border transition-all duration-200 ${
                    page === 1
                      ? "text-gray-300 cursor-not-allowed border-gray-200"
                      : "text-gray-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 cursor-pointer border-gray-300"
                  }`}
                >
                  <IoIosArrowBack className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1">
                  <span className="p-1 xxs:p-2 xs:p-3 py-1 text-xs xxs:text-sm font-medium text-gray-700">
                    Page {page} of {calculatePages()}
                  </span>
                </div>

                <button
                  onClick={() => page < calculatePages() && setPage(page + 1)}
                  disabled={page === calculatePages()}
                  className={`p-1 xxs:p-2 xs:p-3 rounded-xl border transition-all duration-200 ${
                    page === calculatePages()
                      ? "text-gray-300 cursor-not-allowed border-gray-200"
                      : "text-gray-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 cursor-pointer border-gray-300"
                  }`}
                >
                  <IoIosArrowForward className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default ProjectComponent;