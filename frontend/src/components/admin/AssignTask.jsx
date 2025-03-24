import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, CircularProgress, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Groups2Icon from '@mui/icons-material/Groups2';
// import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { Link } from "react-router-dom";
import WorkIcon from '@mui/icons-material/Work';
import ForumIcon from '@mui/icons-material/Forum';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

import { CurrencyExchange, Delete } from '@mui/icons-material';
import { useParams, useNavigate } from "react-router-dom";

const AssignTask = () => {
  const { userId, planId } = useParams();
   const [side, setSide] = useState(false)
      const [isactive, setIsactive] = useState(0)
      const [isopentoggle, setIsopentoggle] = useState(false)  // Extract userId and planId from URL
  const [taskDetails, setTaskDetails] = useState({
    userId: userId,
    planId: planId,
    type: '',  // Empty initial value for task type
    price: '',  // Empty initial value for task price
    url: '',  // Empty initial value for task URL
  });
  const [loading, setLoading] = useState(false);
  const [taskCreated, setTaskCreated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User ID from useParams:", userId);  // Check if userId is correctly extracted
    console.log("Plan ID from useParams:", planId);  // Check if planId is correctly extracted
  }, [userId, planId]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails({
      ...taskDetails,
      [name]: name === 'price' ? parseFloat(value) : value,  // Ensure price is a number
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    console.log("Submitting task with data:", taskDetails);  // Log task data
  
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL; // Get base URL from env variable
      const response = await axios.post(`${baseURL}/api/tasks/create`, {
        userId: taskDetails.userId,
        planId: taskDetails.planId,
        taskName: taskDetails.type,  // Send dynamic task name
        taskPrice: taskDetails.price,  // Send dynamic task price
        taskUrl: taskDetails.url,  // Send dynamic task URL
      });
  
      if (response.status === 201) {
        setTaskCreated(true);
        setTimeout(() => {
          navigate(`/admin/dashboard/userdetail/${userId}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    } finally {
      setLoading(false);
    }
  };
  
  return (

     <div>
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
            <div>
        {/* Sidebar code here */}

        <div className="dashboard-side min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold bg-green-400 inline-block px-16 rounded-full text-white py-4">Assign Task</h2>
          </div>
          <div className="card-wrapper">
            <div className="card-main mt-10 md:w-[90%] mx-auto grid gap-2 md:gap-4">
              <form onSubmit={handleSubmit}>
                <TextField
                  name="type"  // Task type (website visit or youtube video)
                  label="Task Type (Website visit or YouTube video)"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={taskDetails.type}
                  onChange={handleChange}
                  required
                />

                <TextField
                  name="price"  // Price of the task (should be a number)
                  label="Task Price"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={taskDetails.price}
                  onChange={handleChange}
                  required
                />

                <TextField
                  name="url"  // URL for the task
                  label="Task URL"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={taskDetails.url}
                  onChange={handleChange}
                  required
                />

                <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
                  {loading ? <CircularProgress size={24} /> : 'Assign Task'}
                </Button>
              </form>

              {taskCreated && (
                <Typography variant="h6" color="green" mt={2}>
                  Task assigned successfully! Redirecting...
                </Typography>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AssignTask;
