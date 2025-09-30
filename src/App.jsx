import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MainLayout from "./dashboard/layout/MainLayout";
import AdminIndex from "./dashboard/pages/AdminIndex";
import Login from "./dashboard/pages/Login";
import ProtectDashboard from "./middleware/ProtectDashboard";
import EditProduct from "./dashboard/pages/EditProject";
import notFoundImage from "../src/assets/404.png";
import AllProjects from "./dashboard/pages/AllProjects";
import CreateProject from "./dashboard/pages/CreateProject";
import Carrer from "./dashboard/pages/Carrer";
import Subscribers from "./dashboard/pages/Subscribers";
import ContactQuery from "./dashboard/pages/ContactQuery";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectDashboard />}>
            <Route path="" element={<MainLayout />}>
              <Route path="admin" element={<AdminIndex />} />
              <Route path="allProjects" element={<AllProjects />} />
              <Route path="project/create" element={<CreateProject />} />
              <Route path="project/edit/:project_id" element={<EditProduct />} />
              <Route path="career" element={<Carrer />} />
              <Route path="subscribers" element={<Subscribers />} />
              <Route path="contactQuery" element={<ContactQuery />} />
            </Route>
          </Route>
          <Route 
            path="*"
            element={
              <div className="w-full h-screen flex justify-center items-center">
                <img src={notFoundImage} alt="" />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
