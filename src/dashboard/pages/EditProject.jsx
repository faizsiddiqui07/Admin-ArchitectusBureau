import React, { useEffect, useState } from "react";
import { MdClose, MdDelete, MdCloudUpload } from "react-icons/md";
import { FaImage, FaSpinner } from "react-icons/fa";
import uploadImage from "../helpers/uploadImage";
import DisplayImage from "../custom-components/DisplayImage";
import axios from "axios";
import { base_url } from "../../config/config";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EditProject = () => {
  const [data, setData] = useState({
    projectType: "",
    projectImage: [],
  });

  const navigate = useNavigate();
  const { project_id } = useParams();
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState();
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleOnChange = (name, value) => {
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUploadProjectImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, WebP)");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const uploadImageCloudinary = await uploadImage(file);
      if (uploadImageCloudinary?.url) {
        setData((prev) => ({
          ...prev,
          projectImage: [
            ...prev.projectImage,
            {
              url: uploadImageCloudinary?.url,
              public_id: uploadImageCloudinary?.public_id,
            },
          ],
        }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Image upload failed!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image!");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProjectImage = async (index, public_id) => {
    try {
      await axios.post(`${base_url}/api/delete-image`, { public_id });
      const newProjectImage = [...data.projectImage];
      newProjectImage.splice(index, 1);
      setData((preve) => {
        return {
          ...preve,
          projectImage: [...newProjectImage],
        };
      });
      toast.success("Image deleted successfully.");
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
      toast.error("Failed to delete image from Cloudinary.");
    }
  };

  // fetch categorywise project
  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${base_url}/api/getCategoryWiseProject/${project_id}`
      );
      const responseData = response.data;
      setData(responseData.data);
    } catch (error) {
      console.error("Failed to fetch project data", error);
      toast.error("Failed to load project data");
    } finally {
      setLoading(false);
    }
  };

  // Update projects
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!data.projectType) {
      toast.error("Please select a project type");
      return;
    }

    if (data.projectImage.length === 0) {
      toast.error("Please upload at least one project image");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.put(
        `${base_url}/api/updateProject/${project_id}`,
        data,
        {
          withCredentials: true,
        }
      );
      const responseData = response.data;
      if (responseData?.success) {
        toast.success(responseData?.message);
        navigate("/dashboard/allProjects");
      } else {
        toast.error(responseData?.message);
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    } finally {
      setSubmitting(false);
    }
  };

  const projectTypes = [
    "Residential",
    "Commercial & Corporate",
    "Hospitality & Tourism",
    "Recreational",
    "Urban Design & Public Spaces",
    "Township & Urban Settlement",
    "Healthcare",
    "Institutional",
    "Landscape",
    "Cultural & Religious",
    "Industrial",
    "Adaptive Reuse & Renovation",
    "Conceptual & Experimental",
    "Technology & Innovation",
    "Humanitarian & Social",
    "Climate Responsive",
    "Interior",
    "Art & Craft"
  ];

  useEffect(() => {
    fetchProjectData();
  }, [project_id]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-6 xs:p-8 shadow-2xl">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            <p className="text-gray-700 font-medium text-sm xs:text-base">Loading project data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-4 xs:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div>
            <h2 className="text-xl xs:text-2xl font-bold text-gray-900">Edit Project</h2>
            <p className="text-gray-600 text-[12px] xxs:text-sm mt-1">Update your project details</p>
          </div>
          <button
            onClick={() => navigate("/dashboard/allProjects")}
            className="p-2 hover:bg-gray-200 rounded-xl transition-colors duration-200 text-gray-500 hover:text-gray-700"
          >
            <MdClose className="w-5 xs:w-6 h-5 xs:h-6" />
          </button>
        </div>

        {/* Form */}
        <form 
          onSubmit={handleSubmit}
          className="p-4 xs:p-6 overflow-y-auto max-h-[calc(90vh-120px)]"
        >
          {/* Project Type with Shadcn Select */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Project Type <span className="text-red-500">*</span>
            </label>
            <Select
              value={data.projectType}
              onValueChange={(value) => handleOnChange("projectType", value)}
            >
              <SelectTrigger className="w-full h-12 border-2 border-gray-200 rounded-xl outline-none focus:ring-0 bg-white transition-all duration-200">
                <SelectValue placeholder="Select Project Type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 border-gray-200 bg-white max-h-60 overflow-y-auto">
                {projectTypes.map((type, index) => (
                  <SelectItem key={index} value={type} className="rounded-lg py-3">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Project Images <span className="text-red-500">*</span>
            </label>
            
            {/* Upload Area */}
            <label htmlFor="uploadImageInput" className="block cursor-pointer">
              <div className={`border-2 border-dashed border-gray-300 rounded-2xl p-6 xs:p-8 text-center transition-all duration-200 hover:border-amber-400 hover:bg-amber-50 group ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 xs:w-16 h-12 xs:h-16 bg-amber-100 rounded-full flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                    {uploading ? (
                      <div className="animate-spin rounded-full h-6 xs:h-8 w-6 xs:w-8 border-b-2 border-amber-600"></div>
                    ) : (
                      <MdCloudUpload className="w-6 xs:w-8 h-6 xs:h-8 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-base xs:text-lg font-medium text-gray-900 mb-1">
                      {uploading ? 'Uploading...' : 'Add More Images'}
                    </p>
                    <p className="text-xs xs:text-sm text-gray-500">
                      Click to browse or drag and drop
                    </p>
                    <p className="text-[10px] xs:text-xs text-gray-400 mt-1">
                      PNG, JPG, WebP up to 5MB
                    </p>
                  </div>
                </div>
              </div>
              <input
                type="file"
                id="uploadImageInput"
                className="hidden"
                onChange={handleUploadProjectImage}
                accept="image/jpeg,image/jpg,image/png,image/webp"
                disabled={uploading}
              />
            </label>

            {/* Uploaded Images */}
            {data.projectImage.length > 0 && (
              <div className="mt-4 xs:mt-6">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Current Images ({data.projectImage.length})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {data.projectImage.map((item, index) => (
                    <div 
                      key={index} 
                      className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200"
                    >
                      <img
                        src={item?.url}
                        alt={`Project ${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                        onClick={() => {
                          setOpenFullScreenImage(true);
                          setFullScreenImage(item.url);
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200?text=Image+Error';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProjectImage(index, item?.public_id);
                          }}
                          className="p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-200 hover:bg-red-600"
                        >
                          <MdDelete className="w-3 xs:w-4 h-3 xs:h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {data.projectImage.length === 0 && (
              <p className="text-red-500 text-xs xxs:text-sm mt-2 flex items-center gap-2">
                <FaImage className="w-3 xxs:w-4 h-3 xxs:h-4" />
                Please upload at least one project image
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/dashboard/allProjects")}
              className="flex-1 px-3 xxs:px-4 xs:px-6 py-2 xs:py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-xs xxs:text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || data.projectImage.length === 0 || !data.projectType}
              className="flex-1 px-3 xxs:px-4 xs:px-6 py-2 xs:py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-xs xxs:text-sm sm:text-base"
            >
              {submitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Updating Project...
                </div>
              ) : (
                "Update Project"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Full Screen Image Display */}
      {openFullScreenImage && (
        <DisplayImage
          onClose={() => setOpenFullScreenImage(false)}
          imgUrl={fullScreenImage}
        />
      )}
    </div>
  );
};

export default EditProject;