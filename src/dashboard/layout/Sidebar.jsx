import React, { useContext, useState, useEffect } from "react";
import { 
  AiFillDashboard, 
  AiOutlinePlus,
  AiOutlineProject
} from "react-icons/ai";
import { BiNews } from "react-icons/bi";
import { FaUser, FaRegUser } from "react-icons/fa";
import { RiMessage2Line } from "react-icons/ri";
import { MdOutlinePictureAsPdf } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import storeContext from "../../context/storeContext";
import { IoLogOutOutline, IoChevronDown } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/new-logo2.png"

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { store, dispatch } = useContext(storeContext);
  const [projectsOpen, setProjectsOpen] = useState(false);

  // Automatically open projects dropdown when on projects-related routes
  useEffect(() => {
    const projectsRoutes = [
      '/dashboard/allProjects',
      '/dashboard/project/create',
      '/dashboard/project/edit'
    ];
    
    // Check if current path starts with any projects route
    const shouldOpen = projectsRoutes.some(route => 
      pathname.startsWith(route)
    );
    
    setProjectsOpen(shouldOpen);
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem("BureauToken");
    dispatch({ type: "logout", payload: "" });
    navigate("/login");
  };

  const menuItems = [
    {
      path: "/dashboard/admin",
      icon: <AiFillDashboard className="text-xl" />,
      label: "Dashboard",
      exact: true
    },
    {
      type: "dropdown",
      icon: <AiOutlineProject className="text-xl" />,
      label: "Projects",
      open: projectsOpen,
      toggle: () => setProjectsOpen(!projectsOpen),
      items: [
        {
          path: "/dashboard/allProjects",
          icon: <BiNews className="text-lg" />,
          label: "All Projects"
        },
        {
          path: "/dashboard/project/create",
          icon: <AiOutlinePlus className="text-lg" />,
          label: "Add Project"
        }
      ]
    },
    {
      path: "/dashboard/career",
      icon: <MdOutlinePictureAsPdf className="text-xl" />,
      label: "Career"
    },
    {
      path: "/dashboard/subscribers",
      icon: <FaRegUser className="text-xl" />,
      label: "Subscribers"
    },
    {
      path: "/dashboard/contactQuery",
      icon: <RiMessage2Line className="text-xl" />,
      label: "Contact Query"
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) return pathname === path;
    return pathname.startsWith(path);
  };

  // Check if any projects submenu item is active
  const isProjectsSubmenuActive = () => {
    const projectsRoutes = [
      '/dashboard/allProjects',
      '/dashboard/project/create',
      '/dashboard/project/edit'
    ];
    return projectsRoutes.some(route => pathname.startsWith(route));
  };

  const MenuItem = ({ item, level = 0 }) => {
    if (item.type === "dropdown") {
      const isDropdownActive = isProjectsSubmenuActive();
      
      return (
        <li>
          <button
            onClick={item.toggle}
            className={`w-full px-4 py-3 rounded-xl flex items-center justify-between transition-all duration-200 ${
              item.open || isDropdownActive
                ? 'bg-amber-50 text-amber-600 border border-amber-200' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </div>
            <IoChevronDown 
              className={`w-4 h-4 transition-transform ${item.open || isDropdownActive ? 'rotate-180' : ''}`} 
            />
          </button>
          {(item.open || isDropdownActive) && (
            <ul className="ml-4 mt-1 space-y-1">
              {item.items.map((subItem, index) => (
                <li key={index}>
                  <Link
                    to={subItem.path}
                    onClick={onClose}
                    className={`px-4 py-2.5 rounded-lg flex items-center space-x-3 transition-all duration-200 ${
                      isActive(subItem.path)
                        ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {subItem.icon}
                    <span className="text-sm">{subItem.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li>
        <Link
          to={item.path}
          onClick={onClose}
          className={`px-4 py-3 rounded-xl flex items-center space-x-3 transition-all duration-200 ${
            isActive(item.path, item.exact)
              ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          {item.icon}
          <span className="font-medium">{item.label}</span>
        </Link>
      </li>
    );
  };

  return (
    <div className="w-64 h-full bg-white flex flex-col border-r border-gray-100 fixed left-0 top-0 bottom-0 overflow-y-auto">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-100 px-6 shrink-0">
        <Link to={""} onClick={onClose}>
          <div className="flex items-center space-x-3">
            <img src={logo} alt="" />
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <MenuItem key={index} item={item} />
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100 shrink-0">
        <button
          onClick={logout}
          className="w-full px-4 py-3 rounded-xl flex items-center space-x-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
        >
          <IoLogOutOutline className="text-xl" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;