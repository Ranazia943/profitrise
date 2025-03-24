import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from "../authcontext/AuthContext";
import { Link } from "react-router-dom"; // Import Link to use for redirection

const Usertask = () => {
  const [userPlans, setUserPlans] = useState([]); // Store user's purchased plans
  const [tasks, setTasks] = useState({}); // Store tasks for each plan
  const [loading, setLoading] = useState(true); // Loading state
  const { authUser } = useAuthContext(); // Authenticated user data from context
  const [taskInProgress, setTaskInProgress] = useState(null); // Store the current task being watched

  // Check if the URL is a YouTube link and if it contains a video ID
  const isYouTubeLink = (url) => {
    const youtubePattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/\S+|(?:v|e(?:mbed)?)\/|(?:watch\?v=))([a-zA-Z0-9_-]{11}))|(?:youtu\.be\/([a-zA-Z0-9_-]{11}))$/;
    return youtubePattern.test(url);
  };
  
  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/\S+|(?:v|e(?:mbed)?)\/|(?:watch\?v=))([a-zA-Z0-9_-]{11}))|(?:youtu\.be\/([a-zA-Z0-9_-]{11}))$/);
    return match ? (match[1] || match[2]) : null;
  };

  // Fetch user plans and tasks once user is authenticated
  useEffect(() => {
    if (authUser) {
      const fetchUserPlansAndTasks = async () => {
        try {
          const token = authUser.token || localStorage.getItem("token");

          if (!token) {
            console.error("No token found, authorization denied.");
            return;
          }

          const baseURL = import.meta.env.VITE_API_BASE_URL;

          // Fetch the user's plans
          const response = await fetch(`${baseURL}/api/userplan/user/${authUser._id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });

          const data = await response.json();
          console.log("API Response for user plans:", data); // Log the response for debugging

          if (response.ok) {
            setUserPlans(data.purchasedPlans); // Store purchased plans
            // Fetch tasks for each plan
            await fetchTasksForPlans(data.purchasedPlans);
            setLoading(false); // Set loading to false after data is fetched
          } else {
            console.error(data.message);
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching user plans:", error);
          setLoading(false);
        }
      };

      // Fetch tasks for each plan
      const fetchTasksForPlans = async (plans) => {
        const tasksData = {};
        try {
          // Use Promise.all to fetch tasks concurrently for all plans
          const taskRequests = plans.map(async (plan) => {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/${authUser._id}/${plan.planId}`);
            if (response.data.tasks) {
              tasksData[plan.planId] = response.data.tasks; // Store tasks for this plan
            }
          });

          // Wait for all task fetches to finish
          await Promise.all(taskRequests);
          setTasks(tasksData); // Update tasks state
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      };

      fetchUserPlansAndTasks();
    }
  }, [authUser]);

  // Function to handle the completion of a task (marking as completed and updating earnings)
  const handleTaskCompletion = async (taskId) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/complete`, {
        taskId,
      });

      if (response.data.message === "Task completed and earnings updated") {
        // Update the task status in the UI
        setTasks((prevTasks) => {
          const updatedTasks = { ...prevTasks };
          Object.keys(updatedTasks).forEach(planId => {
            updatedTasks[planId] = updatedTasks[planId].map(task => {
              if (task._id === taskId) {
                task.status = 'completed'; // Mark task as completed
              }
              return task;
            });
          });
          return updatedTasks;
        });

        // Reset taskInProgress after completion
        setTaskInProgress(null);
      }
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  // Handling when the user clicks a link (either YouTube video or website)
  const handleTaskClick = (taskId, url) => {
    if (isYouTubeLink(url) || url) {
      handleTaskCompletion(taskId); // Mark task as completed immediately
    }
  };

  if (loading) return <div>Loading...</div>; // Show loading message

  return (
    <div>
      <h2 className="text-2xl font-bold text-center my-4">User Purchased Plans</h2>
      <div className="cards w-[95%] mx-auto md:w-[90%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {userPlans && userPlans.length > 0 ? (
          userPlans.map((plan) => (
            <div key={plan.planId} className="p-4 border group rounded-lg hover:-translate-y-2 duration-300 overflow-hidden bg-white">
              <div className="my-4">
                <h2 className="text-center font-[700] text-xl my-2 rounded-lg text-black">{plan.name}</h2>
                <div className="wrapp flex justify-between items-end">
                  <div>
                    <p><span className="text-lg text-black font-[500]">Price: </span><span className="text-black font-[350] text-base">Rs. {plan.price}</span></p>
                    <p><span className="text-lg text-black font-[500]">Duration: </span><span className="text-black font-[350] text-base">{plan.duration} Days</span></p>
                    <p><span className="text-lg text-black font-[500]">Daily Profit: </span><span className="text-black font-[350] text-base">Rs. {plan.dailyProfit}</span></p>
                    <p><span className="text-lg text-black font-[500]">Total Profit: </span><span className="text-black font-[350] text-base">Rs. {plan.totalProfit}</span></p>
                    <p><span className="text-lg text-black font-[500]">Start Date: </span><span className="text-black font-[350] text-base">{new Date(plan.startDate).toLocaleDateString()}</span></p>
                    <p><span className="text-lg text-black font-[500]">End Date: </span><span className="text-black font-[350] text-base">{new Date(plan.endDate).toLocaleDateString()}</span></p>
<br></br>
                    <Link to="https://whatsapp.com/channel/0029VbA6tyqAYlUNjncADY1J" target="_blank" rel="noopener noreferrer">
        <div data-aos="zoom-in" data-aos-delay="100" data-aos-duration="500" className="text-center hover:-translate-y-1 duration-300 border w-[80px] sm:w-[100px] rounded-lg m-auto mb-4">
          <img src="/images/whatsapp.png" className="sm:w-5 sm:h-5 w-8 h-8 md:w-12 md:h-12 m-auto " alt="WhatsApp" />
          <p className="text-sm md:text-base font-[400]">Follow us</p>
        </div>
      </Link>
                  </div>
                </div>
                
              </div>

              {/* Display tasks for this plan */}
              {tasks[plan.planId] && tasks[plan.planId].length > 0 ? (
                tasks[plan.planId].map((task, index) => {
                  const videoId = isYouTubeLink(task.url) ? getYouTubeVideoId(task.url) : null;

                  return (
                    <div key={index} className="task-details">
                      <p><span className="font-bold">Task Name:</span> {task.type}</p>
                      <p><span className="font-bold">Price:</span> Rs. {task.price}</p>
                      {task.status === "pending" && (
                        <>
                          {isYouTubeLink(task.url) && videoId ? (
                            <div>
                              <iframe
                                width="560"
                                height="315"
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          ) : (
                            <a href={task.url} target="_blank" rel="noopener noreferrer" onClick={() => handleTaskClick(task._id, task.url)}>Visit Website</a>
                          )}
                        </>
                      )}
                      <p><span className="font-bold">Status:</span> {task.status}</p>

                      
                    </div>
                    
                  );
                })
              ) : (
                <p>No tasks available for this plan.</p>
              )}
            </div>
            
          ))
        ) : (
          <p className="text-center">You have not purchased any plans yet.</p>
        )}
      </div>

      {/* WhatsApp Group Link */}
    
    </div>
  );
};

export default Usertask;
