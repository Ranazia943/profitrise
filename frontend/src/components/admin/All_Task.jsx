import DashboardIcon from '@mui/icons-material/Dashboard';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Groups2Icon from '@mui/icons-material/Groups2';
// import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useState ,useEffect} from "react";
import { Link } from "react-router-dom";
import WorkIcon from '@mui/icons-material/Work';
import ForumIcon from '@mui/icons-material/Forum';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { CurrencyExchange, Delete, Edit } from '@mui/icons-material';
import { CircularProgress, Typography, Paper, Button, Box, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';  // Import react-hot-toast
import dayjs from 'dayjs';  // Import dayjs to format the date
import axios from 'axios';
const All_Task = () => {
  const { planId } = useParams();  
  const [side, setSide] = useState(false)
  const [isactive, setIsactive] = useState(0)
  const [isopentoggle, setIsopentoggle] = useState(false)// Retrieve planId from the URL params
  const [tasks, setTasks] = useState([]);  // Store tasks
  const [loading, setLoading] = useState(true);  // Track loading state
  const [error, setError] = useState('');  // Track error state
  const [fetchedDate, setFetchedDate] = useState('');  // Track the date when the tasks were fetched
  const isopen = (ind)=>{
    setIsactive(ind)
    setIsopentoggle(!isopentoggle)
}
  // Fetch tasks when the component is mounted or when planId changes
  useEffect(() => {
    const fetchTasks = async () => {
      if (!planId) {
        setError('Invalid Plan ID');
        setLoading(false);
        return;
      }

      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;  // Ensure this is correct
        const response = await axios.get(`${baseURL}/api/tasks/${planId}`);
        setTasks(response.data.tasks);
        setFetchedDate(dayjs().format('MMMM D, YYYY h:mm A'));  // Set the current date when tasks are fetched
      } catch (err) {
        setError('Error fetching tasks.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();  // Call fetch tasks function
  }, [planId]);  // Dependency array ensures fetching when planId changes

  // Handle task deletion
  const deleteTask = async (taskId) => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      await axios.delete(`${baseURL}/api/tasks/${taskId}`);
      // Remove the deleted task from the state
      setTasks(tasks.filter((task) => task.taskId !== taskId));
      toast.success('Task deleted successfully');  // Show success toast
    } catch (err) {
      console.error(err);
      setError('Error deleting task.');
    }
  };

  // Loading state
  if (loading) {
    return <CircularProgress />;
  }

  // Error state
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

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
            <div className="dashboard-side min-h-screen ">
            <div className="close-icon bg-white inline-block">
             <i onClick={()=>setSide(true)} className="fa-solid fa-bars m-2 text-lg side-menu"></i>
            </div>
       <div className=" text-center" data-aos="fade-right"  data-aos-easing="linear" data-aos-duration="1800">
       <h2 className="text-2xl font-extrabold bg-gradient-to-tr from-cyan-300 via-cyan-100 inline-block px-16 rounded-full text-gray-600 py-4">Plans</h2>
       </div>
        <div>
        <div className="plan-wrapper">
      

    <Paper elevation={3} style={{ padding: '20px', marginBottom:'50px', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold', color: '#333' }}>
        Tasks for Plan: {tasks.length > 0 ? tasks[0].planName : 'No tasks available'}
      </Typography>

      {/* Display the date when tasks were fetched */}
      <Typography variant="body2" style={{ fontStyle: 'italic', marginBottom: '20px' }}>
        Tasks fetched on: {fetchedDate}
      </Typography>

      <Grid container spacing={2}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.taskId}>  {/* Responsive layout */}
            <Box sx={{
              mb: 2,
              p: 3,
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#fff',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1)',
                boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
              },
            }}>
              <Typography variant="h6" style={{ fontWeight: 'bold', color: '#333' }}>{task.type} Task</Typography>
              <Typography variant="body2" style={{ color: '#555', marginBottom: '10px' }}>
                <strong>Price:</strong> ${task.price}
              </Typography>
              <Typography variant="body2" style={{ color: '#555', marginBottom: '10px' }}>
                <strong>URL:</strong> <a href={task.url} target="_blank" rel="noopener noreferrer" style={{ color: '#007BFF' }}>{task.url}</a>
              </Typography>
              <Button
                variant="contained"
                color="error"
                sx={{ mt: 2 }}
                onClick={() => deleteTask(task.taskId)}  // Call delete task function
                style={{ textTransform: 'none' }}
              >
                Delete Task
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
    </div></div></div></div>
    
  );
};

export default All_Task;
