import { Edit } from '@mui/icons-material';
import { Button } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import { useAuthContext } from "../authcontext/AuthContext";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-hot-toast' // useNavigate for redirecting
import Loading from "./Loading"; // Import Loading component

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  '@media (max-width:768px)': { width: '95%' },
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  padding: 2,
};

const Account = () => {
  const [open, setOpen] = useState(false);
  const [Teamdata, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // Simulating data load completion after 3 seconds
    }, 1000);
  }, []);
  const { authUser } = useAuthContext();
  const navigate = useNavigate();

  // Open and close modals
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (authUser) {
      const fetchTeamData = async () => {
        try {
          const token = authUser.token || localStorage.getItem("token");
          if (!token) return alert("Unauthorized, please login.");

          const baseURL = import.meta.env.VITE_API_BASE_URL;
          const response = await fetch(`${baseURL}/api/userplan/user/${authUser._id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });

          const data = await response.json();
          if (response.ok) {
            setTeamData(data);
            setLoading(false);
          } else {
            console.error(data.message);
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      };

      fetchTeamData();
    }
  }, [authUser]);

  if (loading) {
    return <div> <Loading /></div>;
  }

  if (!Teamdata) {
    return <div> <Loading /></div>;
  }

  const { user, totalBalance, purchasedPlans } = Teamdata;

  // Handle input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image change
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }

    try {
      const userId = authUser._id;
      if (!userId) return alert("You need to be logged in to update your profile.");

      let imageUrl = null;
      if (selectedImage) {
        const formDataImage = new FormData();
        formDataImage.append("file", selectedImage);
        formDataImage.append("upload_preset", "ml_default"); // Cloudinary preset

        const res = await axios.post("https://api.cloudinary.com/v1_1/dqqejge0d/image/upload", formDataImage);
        imageUrl = res.data.secure_url; // Store the image URL
      }

      const updatedData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        image: imageUrl, // Include image URL if available
      };

      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.put(`${baseURL}/api/auth/profile/${userId}`, updatedData);

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        handleClose();
        navigate("/account");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      toast.error("Error updating profile:", error);
      alert("Error updating profile!");
    }
  };

  // If no authUser, show loading message
  
  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
    <div>
      <Modal open={open} onClose={handleClose} aria-labelledby="update-profile-modal">
        <Box sx={style}>
          <h2 id="update-profile-modal" className="text-xl font-[600] text-center my-4">Update Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Name"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full bg-gray-100 rounded-md py-3 px-4 text-sm outline-blue-600 focus-within:bg-transparent"
              />
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-gray-100 rounded-md py-3 px-4 text-sm outline-blue-600 focus-within:bg-transparent"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-gray-100 rounded-md py-3 px-4 text-sm outline-blue-600 focus-within:bg-transparent"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full bg-gray-100 rounded-md py-3 px-4 text-sm outline-blue-600 focus-within:bg-transparent"
              />
              <input
                type="file"
                className="file:bg-gray-800 file:text-white w-full p-1.5 rounded-md file:outline-none file:border-none border file:p-1 file:font-[400] file:rounded-sm"
                onChange={handleImageChange}
              />
            </div>
            <div className="text-center mt-6 space-x-2">
              <Button onClick={handleClose} variant="contained" sx={{ marginTop: "10px" }}>Cancel</Button>
              <Button type="submit" variant="contained" sx={{ marginTop: "10px" }}>Submit</Button>
            </div>
          </form>
        </Box>
      </Modal>

      <h2 className="text-4xl font-[800] mt-20 mb-10 text-center">My Account</h2>
      <div className="wrapper">
        <div className="card flex max-md:flex-col max-md:gap-10 relative p-4 items-center w-[90%] m-auto border">
          <div className="absolute top-2 left-2">
            <Tooltip title="Edit Profile" placement="top">
              <Button variant='contained' onClick={handleOpen}><Edit /></Button>
            </Tooltip>
          </div>
        
          <div className="sec-1 md:w-[30%] lg:w-[20%]">
            <img src={user.image} className="w-40 h-40 m-auto" alt="Profile" />
            <div className="text-center">
              <h2 className="text-xl font-[600]">{user.username}</h2>
              <p className="text-lg font-[400] font-sans">{user.email}</p>
            </div>
          </div>
          <div className="sec-2 md:w-[70%] lg:w-[80%]">
            <div className="cards text-black grid grid-cols-2 min-[650px]:grid-cols-4 gap-4">
              <Link to="/plan">
                <div className="text-center bg-white py-4 rounded-lg border shadow-md hover:-translate-y-2 duration-300 hover:shadow-xl">
                  <h2 className="text-base lg:text-xl font-[600]">Total Plans</h2>
                  <p className="text-lg font-[400]">{purchasedPlans.length}</p>
                </div>
              </Link>
              <div className="text-center bg-white py-4 rounded-lg border shadow-md hover:-translate-y-2 duration-300 hover:shadow-xl">
                <h2 className="text-base lg:text-xl font-[600]">Total Balance</h2>
                <p className="text-lg font-[400]">Rs. {totalBalance}</p>
              </div>
              <Link to="/withdrawl_history" className="text-center bg-white py-4 rounded-lg border shadow-md hover:-translate-y-2 duration-300 hover:shadow-xl">
                <h2 className="text-base lg:text-xl font-[600]">Withdrawal History</h2>
              </Link>
              <Link to="/recharge" className="text-center bg-white py-4 rounded-lg border shadow-md hover:-translate-y-2 duration-300 hover:shadow-xl">
                <h2 className="text-base lg:text-xl font-[600]">Recharge History</h2>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>

)}
</div>
);
};


export default Account;
