import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaEye, 
  FaTrash, 
  FaDownload,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaVenusMars,
  FaBirthdayCake,
  FaIdCard,
  FaFilter,
  FaSearch,
  FaSort,
  FaFilePdf,
  FaChevronLeft,
  FaChevronRight,
  FaUserTie,
  FaTimes,
  FaUsers,
  FaChartBar,
  FaSync
} from "react-icons/fa";
import { base_url } from "../../config/config";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Career = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCareerData();
  }, []);

  const fetchCareerData = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      const response = await axios.get(`${base_url}/api/getCarrer`);
      setData(response.data.data || []);
      toast.success("Career applications loaded successfully");
    } catch (error) {
      console.error("Error fetching career data:", error);
      toast.error("Failed to fetch career applications");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filter and search applications
  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phoneNumber?.includes(searchTerm) ||
      item.address?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = genderFilter === "all" || item.gender === genderFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Sort applications
  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const showPdf = (pdf) => {
    if (pdf) {
      window.open(`${base_url}/${pdf}`, "_blank");
    } else {
      toast.error("No resume available");
    }
  };

  const downloadResume = async (application) => {
    if (application.resume) {
      try {
        const response = await fetch(`${base_url}/${application.resume}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume-${application.firstName}-${application.lastName}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("Resume downloaded successfully");
      } catch (error) {
        console.error("Error downloading resume:", error);
        toast.error("Failed to download resume");
      }
    } else {
      toast.error("No resume available");
    }
  };

  const handleDeleteCareer = async (id) => {
    if (window.confirm("Are you sure you want to delete this career application?")) {
      try {
        await axios.delete(`${base_url}/api/delete-carrer/${id}`);
        toast.success("Career application deleted successfully");
        setData(data.filter(item => item._id !== id));
      } catch (error) {
        console.error("Error deleting career application:", error);
        toast.error("Failed to delete career application");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading career applications...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-4">
            <div>
              <h1 className="text-2xl xs:text-3xl font-bold text-gray-900">
                Career Applications
              </h1>
              <p className="text-gray-600 mt-2">Manage and review job applications</p>
            </div>
            <button
              onClick={fetchCareerData}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FaSync className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardContent className="p-4 xxs:p-5 xs:p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Search */}
                <div className="relative flex-1 min-w-[250px]">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search applications by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white outline-none focus:ring-0 transition-all duration-200"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Gender Filter with Shadcn Select */}
                <div className="w-full sm:w-48">
                  <Select value={genderFilter} onValueChange={(value) => {
                    setGenderFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-full h-12 border-2 border-gray-200 rounded-xl bg-white focus:ring-0 outline-none transition-all duration-200">
                      <SelectValue placeholder="All Genders" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 border-gray-200 bg-white">
                      <SelectItem value="all" className="rounded-lg">All Genders</SelectItem>
                      <SelectItem value="male" className="rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Male
                        </div>
                      </SelectItem>
                      <SelectItem value="female" className="rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                          Female
                        </div>
                      </SelectItem>
                      <SelectItem value="other" className="rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Other
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results Count */}
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-amber-100 text-amber-800">
                {filteredData.length} applications found
              </Badge>
            </div>

            {/* Active Filters */}
            {(searchTerm || genderFilter !== 'all') && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setGenderFilter('all');
                    }}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <Badge className="bg-amber-500 text-white">
                      Search: "{searchTerm}"
                      <button 
                        onClick={() => setSearchTerm("")} 
                        className="ml-2 hover:text-amber-200"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {genderFilter !== 'all' && (
                    <Badge className="bg-blue-500 text-white">
                      Gender: {genderFilter}
                      <button 
                        onClick={() => setGenderFilter("all")} 
                        className="ml-2 hover:text-blue-200"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-amber-50 to-amber-100">
                <tr>
                  {[
                    { key: 'firstName', label: 'Applicant' },
                    { key: 'email', label: 'Contact' },
                    { key: 'gender', label: 'Gender' },
                    { key: 'age', label: 'Age' },
                    { key: 'address', label: 'Address' },
                    { label: 'Resume' },
                    { label: 'Actions' }
                  ].map((header, index) => (
                    <th
                      key={index}
                      className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-amber-900 uppercase tracking-wider cursor-pointer hover:bg-amber-200 transition-colors"
                      onClick={() => header.key && handleSort(header.key)}
                    >
                      <div className="flex items-center gap-2">
                        {header.label}
                        {header.key && (
                          <FaSort className={`w-3 h-3 transition-transform ${
                            sortConfig.key === header.key && sortConfig.direction === 'asc' ? 'rotate-180' : ''
                          }`} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentApplications.length > 0 ? (
                  currentApplications.map((item, index) => (
                    <motion.tr
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-amber-50/50 transition-all duration-200 group"
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                            <FaUser className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 group-hover:text-amber-900 transition-colors">
                              {item.salutation} {item.firstName} {item.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{item.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="w-3 h-3 text-amber-500" />
                            <span className="text-gray-600 text-sm">{item.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaPhone className="w-3 h-3 text-amber-500" />
                            <span className="text-gray-600 text-sm">{item.phoneNumber}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <Badge variant="outline" className="capitalize">
                          {item.gender}
                        </Badge>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaBirthdayCake className="w-4 h-4 text-amber-500" />
                          <span>{item.age} years</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2 max-w-[200px]">
                          <FaMapMarkerAlt className="w-4 h-4 text-amber-500 flex-shrink-0" />
                          <span className="text-gray-600 text-sm truncate" title={item.address}>
                            {item.address}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          {item.resume ? (
                            <>
                              <button
                                onClick={() => showPdf(item.resume)}
                                className="p-2 bg-green-500 rounded-lg hover:bg-green-600 text-white transition-all duration-200 shadow hover:shadow-md transform hover:scale-105"
                                title="View Resume"
                              >
                                <FaEye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => downloadResume(item)}
                                className="p-2 bg-amber-500 rounded-lg hover:bg-amber-600 text-white transition-all duration-200 shadow hover:shadow-md transform hover:scale-105"
                                title="Download Resume"
                              >
                                <FaDownload className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-500">
                              No Resume
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedApplication(item)}
                            className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 text-white transition-all duration-200 shadow hover:shadow-md transform hover:scale-105"
                            title="View Details"
                          >
                            <FaIdCard className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCareer(item._id)}
                            className="p-2 bg-red-500 rounded-lg hover:bg-red-600 text-white transition-all duration-200 shadow hover:shadow-md transform hover:scale-105"
                            title="Delete Application"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center">
                      <div className="text-gray-400">
                        <FaUserTie className="w-8 xxs:w-10 sm:w-16 h-8 xxs:h-10 sm:h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg sm:text-xl font-medium text-gray-500 mb-2">No applications found</p>
                        <p className="text-gray-400">No career applications match your current filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-white">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-700">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedData.length)} of {sortedData.length} applications
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-50 hover:border-amber-200 transition-colors"
                  >
                    <FaChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === pageNum
                            ? 'bg-amber-600 text-white shadow-lg'
                            : 'text-gray-600 hover:bg-amber-100 hover:text-amber-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-50 hover:border-amber-200 transition-colors"
                  >
                    <FaChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedApplication(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
                    <p className="text-amber-600 mt-1">
                      {selectedApplication.salutation} {selectedApplication.firstName} {selectedApplication.lastName}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="p-2 hover:bg-amber-200 rounded-xl transition-colors text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaUser className="w-5 h-5 text-amber-500" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                        <p className="mt-1 text-gray-900 font-medium">
                          {selectedApplication.salutation} {selectedApplication.firstName} {selectedApplication.lastName}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Gender & Age</label>
                        <p className="mt-1 text-gray-900 capitalize">
                          {selectedApplication.gender}, {selectedApplication.age} years
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="mt-1 text-gray-900">{selectedApplication.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="mt-1 text-gray-900">{selectedApplication.phoneNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt className="w-5 h-5 text-amber-500" />
                    Address
                  </h4>
                  <p className="text-gray-700 bg-amber-50 p-4 rounded-xl border border-amber-200">
                    {selectedApplication.address}
                  </p>
                </div>

                {/* Resume Actions */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaFilePdf className="w-5 h-5 text-amber-500" />
                    Resume
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {selectedApplication.resume ? (
                      <>
                        <button
                          onClick={() => showPdf(selectedApplication.resume)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <FaEye className="w-4 h-4" />
                          View Resume
                        </button>
                        <button
                          onClick={() => downloadResume(selectedApplication)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <FaDownload className="w-4 h-4" />
                          Download Resume
                        </button>
                      </>
                    ) : (
                      <p className="text-gray-500 italic bg-gray-100 p-4 rounded-xl text-center">
                        No resume uploaded by the applicant
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Career;