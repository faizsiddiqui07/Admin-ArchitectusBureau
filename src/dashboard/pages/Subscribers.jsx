import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiPhone, 
  FiSearch, 
  FiDownload, 
  FiRefreshCw,
  FiUser,
  FiCalendar,
  FiTrash2,
  FiEye,
  FiSend,
  FiChevronLeft,
  FiChevronRight,
  FiUsers,
  FiClock,
  FiMessageSquare,
  FiXCircle,
  FiMail,
  FiSmartphone,
  FiFilter
} from "react-icons/fi";
import { base_url } from "../../config/config";
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

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [refreshing, setRefreshing] = useState(false);
  const [phoneFilter, setPhoneFilter] = useState("all");

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      const response = await axios.get(`${base_url}/api/getSubscribers`);
      setSubscribers(response.data.data || []);
      toast.success("Subscribers loaded successfully");
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast.error("Failed to fetch subscribers");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Filter subscribers
  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = 
      subscriber.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.phone?.includes(searchTerm);

    const matchesPhoneFilter = 
      phoneFilter === "all" || 
      (phoneFilter === "withPhone" && subscriber.phone) ||
      (phoneFilter === "withoutPhone" && !subscriber.phone);

    return matchesSearch && matchesPhoneFilter;
  });

  // Sort subscribers
  const sortedSubscribers = [...filteredSubscribers].sort((a, b) => {
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
  const currentSubscribers = sortedSubscribers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedSubscribers.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscriber?')) {
      try {
        await axios.delete(`${base_url}/api/deleteSubscriber/${id}`);
        setSubscribers(prev => prev.filter(sub => sub._id !== id));
        toast.success("Subscriber deleted successfully");
      } catch (error) {
        console.error("Error deleting subscriber:", error);
        toast.error("Failed to delete subscriber");
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['Email', 'Phone', 'Subscription Date', 'Subscription Time'];
    const csvData = sortedSubscribers.map(subscriber => [
      subscriber.email,
      subscriber.phone || 'N/A',
      new Date(subscriber.createdAt).toLocaleDateString(),
      new Date(subscriber.createdAt).toLocaleTimeString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Subscribers exported successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading subscribers...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-4">
            <div>
              <h1 className="text-2xl xs:text-3xl font-bold text-gray-900">
                Newsletter Subscribers
              </h1>
              <p className="text-gray-600 mt-2">Manage your newsletter and communication subscribers</p>
            </div>
            <button
              onClick={fetchSubscribers}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
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
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by email or phone number..."
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
                      <FiXCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Items Per Page */}
                <div className="w-full sm:w-32">
                  <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                    setItemsPerPage(parseInt(value));
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-full h-12 border-2 border-gray-200 rounded-xl bg-white focus:ring-0 outline-none transition-all duration-200">
                      <SelectValue placeholder="Per Page" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 border-gray-200 bg-white">
                      <SelectItem value="5" className="rounded-lg">5 per page</SelectItem>
                      <SelectItem value="10" className="rounded-lg">10 per page</SelectItem>
                      <SelectItem value="20" className="rounded-lg">20 per page</SelectItem>
                      <SelectItem value="50" className="rounded-lg">50 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={exportToCSV}
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-amber-200 text-amber-700 bg-white rounded-xl hover:bg-amber-50 hover:border-amber-300 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FiDownload className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {/* Active Filters */}
            {(searchTerm || phoneFilter !== 'all') && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setPhoneFilter('all');
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
                  {phoneFilter !== 'all' && (
                    <Badge className="bg-green-500 text-white">
                      {phoneFilter === 'withPhone' ? 'With Phone' : 'Email Only'}
                      <button 
                        onClick={() => setPhoneFilter("all")} 
                        className="ml-2 hover:text-green-200"
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

        {/* Subscribers Table */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-amber-50 to-amber-100">
                <tr>
                  {[
                    { key: 'email', label: 'Subscriber' },
                    { key: 'phone', label: 'Phone' },
                    { key: 'createdAt', label: 'Subscription Date' },
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
                          <FiFilter className={`w-3 h-3 transition-transform ${
                            sortConfig.key === header.key && sortConfig.direction === 'asc' ? 'rotate-180' : ''
                          }`} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentSubscribers.length > 0 ? (
                  currentSubscribers.map((subscriber, index) => (
                    <motion.tr
                      key={subscriber._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-amber-50/50 transition-all duration-200 group"
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                            <FiUser className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 group-hover:text-amber-900 transition-colors">
                              {subscriber.email}
                            </p>
                            <p className="text-sm text-gray-500">Newsletter Subscriber</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {subscriber.phone ? (
                          <div className="flex items-center gap-2">
                            <FiPhone className="w-4 h-4 text-green-500" />
                            <span className="text-gray-600 font-medium">{subscriber.phone}</span>
                          </div>
                        ) : (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            No phone
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiCalendar className="w-4 h-4 text-amber-500" />
                            {new Date(subscriber.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FiClock className="w-3 h-3 text-amber-400" />
                            {new Date(subscriber.createdAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedSubscriber(subscriber)}
                            className="p-2 bg-amber-500 rounded-lg hover:bg-amber-600 text-white transition-all duration-200 shadow hover:shadow-md transform hover:scale-105"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(subscriber._id)}
                            className="p-2 bg-red-500 rounded-lg hover:bg-red-600 text-white transition-all duration-200 shadow hover:shadow-md transform hover:scale-105"
                            title="Delete Subscriber"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <div className="text-gray-400">
                        <FiUsers className="w-8 xxs:w-10 sm:w-16 h-8 xxs:h-10 sm:h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg sm:text-xl font-medium text-gray-500 mb-2">No subscribers found</p>
                        <p className="text-gray-400">No subscribers match your current search criteria.</p>
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
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedSubscribers.length)} of {sortedSubscribers.length} subscribers
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-50 hover:border-amber-200 transition-colors"
                  >
                    <FiChevronLeft className="w-4 h-4" />
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
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Subscriber Detail Modal */}
      <AnimatePresence>
        {selectedSubscriber && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedSubscriber(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Subscriber Details</h3>
                    <p className="text-amber-600 mt-1">Newsletter Subscriber</p>
                  </div>
                  <button
                    onClick={() => setSelectedSubscriber(null)}
                    className="p-2 hover:bg-amber-200 rounded-xl transition-colors text-gray-500 hover:text-gray-700"
                  >
                    <FiXCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                    <FiUser className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{selectedSubscriber.email}</p>
                    <p className="text-gray-500">Active Subscriber</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                      <label className="text-sm font-medium text-amber-700">Email Address</label>
                      <p className="mt-1 text-gray-900 font-medium">{selectedSubscriber.email}</p>
                    </div>
                    
                    <div className={`p-4 rounded-xl border ${
                      selectedSubscriber.phone 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-amber-50 border-amber-200'
                    }`}>
                      <label className={`text-sm font-medium ${
                        selectedSubscriber.phone ? 'text-green-700' : 'text-amber-700'
                      }`}>
                        Phone Number
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedSubscriber.phone || 'Not provided'}
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                      <label className="text-sm font-medium text-purple-700">Subscription Date</label>
                      <p className="mt-1 text-gray-900">
                        {new Date(selectedSubscriber.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <a
                    href={`mailto:${selectedSubscriber.email}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <FiSend className="w-4 h-4" />
                    Send Email
                  </a>
                  {selectedSubscriber.phone && (
                    <a
                      href={`https://wa.me/${selectedSubscriber.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <FiMessageSquare className="w-4 h-4" />
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Subscribers;