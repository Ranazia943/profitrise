import { useState ,useEffect} from "react";
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
import { CurrencyExchange, Logout,  } from '@mui/icons-material';
import { Button } from "@mui/material"; // Add this line if it's missing

const Add_Plan = () => {
  const [plans, setPlans] = useState([]);
   
  const [side, setSide] = useState(false)
  const [isactive, setIsactive] = useState(0)
  const [isopentoggle, setIsopentoggle] = useState(false)
  const isopen = (ind)=>{
    setIsactive(ind)
    setIsopentoggle(!isopentoggle)
}
    // To store the predefined plans
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    dailyProfit: "",
    totalProfit: "",
  });

  const [message, setMessage] = useState(""); // Message state for success/error

  useEffect(() => {
    // Fetch predefined plan names from the backend or static list
    const predefinedPlans = [
      'Start',
      'Basic',
      'Gold',
      'Platinum',
      'Diamond',
    ];

    setPlans(predefinedPlans); // Set the predefined plans to state
  }, []);

  // Handle plan selection change
  const handlePlanSelect = (event) => {
    const selectedPlan = event.target.value;
    setFormData({
      ...formData,
      name: selectedPlan, // set the selected plan name
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset message before submitting

    // Validate form data before sending
    if (!formData.name || !formData.price || !formData.duration || !formData.dailyProfit || !formData.totalProfit) {
      setMessage("All fields are required.");
      return;
    }

    const formDataToSend = {
      ...formData,
      price: Number(formData.price),
      totalProfit: Number(formData.totalProfit),
      duration: Number(formData.duration),
    };

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;

      // First, check if the plan already exists
      const checkResponse = await fetch(`${baseURL}/api/plan/check/${formData.name}`);
      const checkData = await checkResponse.json();

      if (!checkResponse.ok) {
        toast.error(`Plan "${formData.name}" already exists.`);
        return;
      }

      // Now proceed with the actual plan creation
      const response = await fetch(`${baseURL}/api/plan/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Plan added successfully!");
        toast.success("Plan added successfully!", {
          duration: 4000,
          position: "top-center",
         
          style: {
            background: "#4CAF50",
            color: "white",
            borderRadius: "8px",
          },
        });
        setFormData({
          name: "",
          price: "",
          duration: "",
          dailyProfit: "",
          totalProfit: "",
        });
      } else {
        setMessage(data.message || "Failed to add the plan.");
      }
    } catch (error) {
      setMessage("Error creating plan. Please try again later.");
    }
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
        <div className="max-w-4xl mx-auto font-[sans-serif] p-6">
        <div className="text-center mb-16">
          <h4 className="text-gray-800 text-lg font-[600] mt-6">Create Your Plan</h4>
        </div>
        <form onSubmit={handleSubmit}>
      
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Select Plan</label>
              <select
                name="name"
                value={formData.name}
                onChange={handlePlanSelect}
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                required
              >
                <option value="">-- Select Plan --</option>
                {plans.map((plan, index) => (
                  <option key={index} value={plan}>
                    {plan}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Price</label>
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                placeholder="50000"
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Duration</label>
              <input
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleInputChange}
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                placeholder="60"
                required
              />
            </div>

            {/* Daily Profit */}
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Daily Profit</label>
              <input
                name="dailyProfit"
                type="number"
                value={formData.dailyProfit}
                onChange={handleInputChange}
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                placeholder="200"
                required
              />
            </div>

            {/* Total Profit */}
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Total Profit</label>
              <input
                name="totalProfit"
                type="number"
                value={formData.totalProfit}
                onChange={handleInputChange}
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                placeholder="500000"
                required
              />
            </div>
          </div>

          <div className="!mt-12">
            <Button variant="contained" type="submit">Create Plan</Button>
          </div>
        </form>

        {/* Show message here */}
       
      </div>
    </div>
    </div>
  );
};

export default Add_Plan;
