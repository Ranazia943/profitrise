import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; // For showing toast notifications
import { useAuthContext } from "../../authcontext/AuthContext";
import DashboardIcon from '@mui/icons-material/Dashboard';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Groups2Icon from '@mui/icons-material/Groups2';
// import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { Link, Navigate } from "react-router-dom";
import WorkIcon from '@mui/icons-material/Work';
import ForumIcon from '@mui/icons-material/Forum';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { CurrencyExchange, Logout } from '@mui/icons-material';

const Add_user = () => {
  const { authUser,setAuthUser } = useAuthContext();

  const [formData, setFormData] = useState({
    username: authUser?.username || "",
    email: authUser?.email || "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [side, setSide] = useState(false)
  const [isactive, setIsactive] = useState(0)
  const [isopentoggle, setIsopentoggle] = useState(false)
  const isopen = (ind)=>{
    setIsactive(ind)
    setIsopentoggle(!isopentoggle)
}
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input change
 
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authUser) {
      setMessage("User not logged in!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      let imageUrl = null;

      // Upload image to Cloudinary if provided
      
      // Prepare the data for profile update
      const updatedData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        image: imageUrl, // Include the image URL if available
      };

      const baseURL = import.meta.env.VITE_API_BASE_URL; // Use your backend's base URL
      const response = await axios.put(
        `${baseURL}/api/auth/profile/${authUser._id}`,
        updatedData
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setMessage("Profile updated successfully!");
      } else {
        toast.error(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating the profile.");
      setMessage("An error occurred.");
    }
  };
  const logout = () => {
   
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setAuthUser(null);
      toast.success("Logout successful!", { duration: 1000 });
      Navigate("/login");
  
  };
  return (
    <div className="dashboard-wrapper">
 <div id="sidebar-wrapper" className={`${side ? "open":""}`}>
            <div className="sidebar">
            <div className="close-icon flex justify-start ml-4  mt-4">
             <i onClick={()=>setSide(false)} className="fa-solid border-2 px-1 rounded-md fa-xmark text-xl side-menu"></i>
            </div>
            <ul className=" p-2 text-white">
                <li id="cc" className={`flex justify-between p-2 rounded-lg my-2 ${isactive===0 ? "activ" : ""}`} onClick={()=>isopen(0)}>
                  <Link to='/admin/dashboard'>
                  <div className=" flex justify-center space-x-2">
                        <DashboardIcon/> <p className=" cursor-pointer">DashBoard</p>
                    </div>
                  </Link>
                    {/* <div className="arrow">
                        <KeyboardArrowRightIcon/>
                    </div> */}
                </li>
                <li className=" my-2">
                   <div id="cc" className={`flex justify-between p-2 rounded-lg ${isactive===1 ? "activ" : ""}`} onClick={()=>isopen(1)}>
                   <div className=" flex justify-center  space-x-2">
                        <WorkIcon/> <p className=" cursor-pointer">users</p>
                    </div>
                    <div className="arrow">
                        {isopentoggle && isactive===1 ? <KeyboardArrowDownIcon/> : <KeyboardArrowRightIcon/>}
                    </div>
                   </div>
                    <div className={`submenu-wrapper ${isactive===1 && isopentoggle===true ? "colaps":"colapsd"}`}>
                        <ul className="submenu text-start pl-8 border-l-2 mt-2">
                        <li className="my-2"><Link to="/admin/dashboard/allusers">ALL users</Link></li>
                        <li className="my-2"><Link to="/admin/dashboard/adduser">Update Profile</Link></li>
                        </ul>
                    </div>
                </li>
                <li className=" my-2">
                   <div id="cc" className={`flex justify-between p-2 rounded-lg ${isactive===2 ? "activ" : ""}`} onClick={()=>isopen(2)}>
                   <div className=" flex justify-center  space-x-2">
                        <Groups2Icon/> <p className=" cursor-pointer">Plans</p>
                    </div>
                    <div className="arrow">
                    {isopentoggle && isactive===2 ? <KeyboardArrowDownIcon/> : <KeyboardArrowRightIcon/>}
                    </div>
                   </div>
                    <div className={`submenu-wrapper ${isactive===2 && isopentoggle===true ? "colaps":"colapsd"}`}>
                        <ul className="submenu text-start pl-8 border-l-2 mt-2">
                        <li className="my-2"><Link to="/admin/dashboard/allplans">All Plans</Link></li>
                        <li className="my-2"><Link to="/admin/dashboard/addplan">Add Plan</Link></li>
                        </ul>
                    </div>
                </li>
                <li className=" my-2">
                   <div id="cc" className={`flex justify-between p-2 rounded-lg ${isactive===3 ? "activ" : ""}`} onClick={()=>isopen(3)}>
                   <div className=" flex justify-center  space-x-2">
                        <WorkspacePremiumIcon/> <p className=" cursor-pointer">About</p>
                    </div>
                    <div className="arrow">
                    {isopentoggle && isactive===3 ? <KeyboardArrowDownIcon/> : <KeyboardArrowRightIcon/>}
                    </div>
                   </div>
                    <div className={`submenu-wrapper ${isactive===3 && isopentoggle===true ? "colaps":"colapsd"}`}>
                        <ul className="submenu text-start pl-8 border-l-2 mt-2">
                        <li className="my-2"><Link to="/admin/dashboard/aboutdetail">About Details</Link></li>
                        <li className="my-2"><Link to="/admin/dashboard/add_aboutdetail">Add Detail</Link></li>
                        </ul>
                    </div>
                </li>
              
                <li id="cc" className={`flex justify-between p-2 rounded-lg my-2 ${isactive===0 ? "activ" : ""}`} onClick={()=>isopen(0)}>
                  <Link to='/admin/dashboard/support'>
                  <div className=" flex justify-center space-x-2">
                        <ForumIcon/> <p className=" cursor-pointer">Support</p>
                    </div>
                  </Link>
                    {/* <div className="arrow">
                        <KeyboardArrowRightIcon/>
                    </div> */}
                </li>
                <li id="cc" className={`flex justify-between p-2 rounded-lg my-2 ${isactive===0 ? "activ" : ""}`} onClick={()=>isopen(0)}>
                  <Link to='/admin/dashboard/requests'>
                  <div className=" flex justify-center space-x-2">
                        <SportsKabaddiIcon/> <p className=" cursor-pointer">Plan Requests</p>
                    </div>
                  </Link>
                    {/* <div className="arrow">
                        <KeyboardArrowRightIcon/>
                    </div> */}
                </li>
                <li id="cc" className={`flex justify-between p-2 rounded-lg my-2 ${isactive===0 ? "activ" : ""}`} onClick={()=>isopen(0)}>
                  <Link to='/admin/dashboard/withdraw'>
                  <div className=" flex justify-center space-x-2">
                        <CurrencyExchange/> <p className=" cursor-pointer">Withraw Rquests</p>
                    </div>
                  </Link>
                </li>


                <li id="cc" className={`flex justify-between p-2 rounded-lg my-2 ${isactive===0 ? "activ" : ""}`} onClick={()=>isopen(0)}>
                  <Link to='/admin/dashboard/sendmail'>
                  <div className=" flex justify-center space-x-2">
                        <CurrencyExchange/> <p className=" cursor-pointer">Email Setting</p>
                    </div>
                  </Link>
                </li>

               
            </ul>
            </div>
        </div>

      <div className="dashboard-side min-h-screen">
      <div className="close-icon bg-white inline-block">
             <i onClick={()=>setSide(true)} className="fa-solid fa-bars m-2 text-lg side-menu"></i>
            </div>
        <div
          className="text-center"
          data-aos="fade-right"
          data-aos-easing="linear"
          data-aos-duration="1800"
        >
          <h2 className="text-2xl font-extrabold bg-gradient-to-tr from-cyan-300 via-cyan-100 inline-block px-16 rounded-full text-gray-600 py-4">
           Update Profile
          </h2>
        </div>
        <div className="flex flex-col justify-center font-[sans-serif] p-4">
          <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8">
            <div className="text-center mb-12">
              <h2 className="text-center font-[800] text-2xl">Update Profile</h2>
            </div>
            <form onSubmit={handleSubmit}>
  <div className="space-y-6">
    <div>
      <label className="text-gray-800 text-sm mb-2 block">Name</label>
      <input
        name="username"
        type="text"
        value={formData.username}
        onChange={handleInputChange}
        className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
        placeholder="Enter Name"
      />
    </div>
    <div>
      <label className="text-gray-800 text-sm mb-2 block">Email</label>
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
        placeholder="Enter Email"
      />
    </div>
    <div>
      <label className="text-gray-800 text-sm mb-2 block">Password</label>
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleInputChange}
        className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
        placeholder="Enter Password"
      />
    </div>
    <div>
      <label className="text-gray-800 text-sm mb-2 block">Confirm Password</label>
      <input
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
        placeholder="Confirm Password"
      />
    </div>
  </div>
  
  {/* Error message for password mismatch */}
  {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
    <div className="mt-4 text-red-600 text-center">
      Passwords do not match!
    </div>
  )}
  
  <div className="!mt-12">
    <button
      type="submit"
      className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
    >
      Update Profile
    </button>
  </div>
  <div className="flex justify-end mt-4">
    <button
      onClick={logout}
      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
    >
      <Logout />
      <p className="cursor-pointer">Logout</p>
    </button>
  </div>
</form>

{/* Additional message after submit */}
{message && <p className="text-center mt-4 text-red-600">{message}</p>}
</div>
        </div>
      </div>
    </div>
  );
};

export default Add_user;
