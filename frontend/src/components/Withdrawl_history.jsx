import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from "../authcontext/AuthContext"; // Import useAuthContext

const TaskCount = () => {
  const { taskId } = useParams(); // Retrieve taskId from URL
  const { authUser } = useAuthContext(); // Get authUser from AuthContext
  const [taskDetails, setTaskDetails] = useState(null);  // Store task details
  const [answer, setAnswer] = useState('');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [num1, setNum1] = useState(null);
  const [num2, setNum2] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [userId, setUserId] = useState(''); // Assume you get this from context or props

  // Fetch task details when taskId changes or on component mount
  useEffect(() => {
    if (!authUser) {
      console.log('User is not authenticated yet');
      return; // Avoid running further if authUser is not available
    }

    // Log the userId and taskId to the console
    console.log('User ID from authContext:', authUser?.id); // Logs userId
    console.log('Task ID from URL:', taskId); // Logs taskId

    const randomNum1 = Math.floor(Math.random() * 10) + 1;
    const randomNum2 = Math.floor(Math.random() * 10) + 1;
    setNum1(randomNum1);
    setNum2(randomNum2);
    setCorrectAnswer(randomNum1 + randomNum2); // Sum of the two numbers

    setUserId(authUser?.id || ''); // Set the userId from the context

    // Fetch the task details from the server
    const fetchTaskDetails = async () => {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      try {
        const response = await fetch(`${baseURL}/api/tasks/task/${taskId}`);
        if (response.ok) {
          const task = await response.json();
          setTaskDetails(task);  // Set the task details in state
        } else {
          setMessage('Failed to load task details.');
        }
      } catch (error) {
        console.error('Error fetching task details:', error);
        setMessage('Error fetching task details.');
      }
    };

    fetchTaskDetails();
  }, [authUser, taskId]); // Run when authUser or taskId changes

  const question = `${num1} + ${num2} = ?`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate taskId format using regular expression (MongoDB ObjectId is a 24-character hex string)
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    if (!objectIdPattern.test(taskId)) {
      setMessage('Invalid taskId format.');
      return;
    }
  
    if (!answer || isNaN(answer)) {
      setMessage('Please enter a valid answer!');
      return;
    }
  
    if (parseInt(answer) !== correctAnswer) {
      setMessage('Incorrect answer. Please try again.');
      setProgress(0); // Reset the progress bar to 0 if the answer is incorrect
      return;
    }
  
    // If the answer is correct
    setProgress(100); // Mark task as completed visually
    setMessage('Correct! Task completed successfully.');
  
    // Fetch base URL from environment variables (VITE_API_BASE_URL)
    const baseURL = import.meta.env.VITE_API_BASE_URL;
  
    try {
      const response = await fetch(`${baseURL}/api/userplan/earnings/add-task-price`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId, // Log userId here
          taskId: taskId, // Pass the taskId from URL
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        setMessage('Earnings updated successfully!');
      } else {
        setMessage('Failed to update earnings.');
      }
    } catch (error) {
      console.error('Error updating earnings:', error);
      setMessage('Failed to update earnings.');
    }
  };

  // Display task details when available
  if (!taskDetails) {
    return <div>Loading task details...</div>;
  }

  return (
    <div className="task-count-container">
      <h2>Complete Your Task</h2>
      <div className="progress-bar">
        <progress value={progress} max="100"></progress>
        <span>{progress}%</span>
      </div>

      <div>
        <p><strong>Task Price:</strong> ${taskDetails.price}</p>

        <p><strong>Question:</strong> {question}</p>

        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Enter your answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default TaskCount;
