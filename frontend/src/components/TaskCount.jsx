import { useState } from 'react';

const TaskCount = () => {
  const [answer, setAnswer] = useState('');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [num1, setNum1] = useState(Math.floor(Math.random() * 10) + 1);
  const [num2, setNum2] = useState(Math.floor(Math.random() * 10) + 1);
  const [correctAnswer, setCorrectAnswer] = useState(num1 + num2);

  const question = `${num1} + ${num2} = ?`;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the answer is correct
    if (parseInt(answer) === correctAnswer) {
      setProgress(100); // Set progress to 100% if the answer is correct
      setMessage('Correct answer! Task completed.'); // Display success message
    } else {
      setMessage('Incorrect answer. Please try again.'); // Display error message if the answer is incorrect
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{
        fontSize: '1.8rem',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#333'
      }}>Complete Your Task</h2>

      <div style={{ width: '100%', marginBottom: '20px' }}>
        <progress style={{
          width: '100%',
          height: '20px',
          borderRadius: '10px',
          backgroundColor: '#ddd'
        }} value={progress} max="100"></progress>
        <span style={{
          display: 'block',
          textAlign: 'center',
          marginTop: '5px',
          fontSize: '1rem',
          color: '#333'
        }}>{progress}%</span>
      </div>

      <div style={{
        width: '100%',
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333'
      }}>
        <p><strong>Question:</strong> {question}</p>
      </div>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}>
        <input
          type="number"
          placeholder="Enter your answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          style={{
            padding: '10px',
            fontSize: '1rem',
            marginBottom: '15px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '80%',
            maxWidth: '300px'
          }}
        />
        <button type="submit" style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '10px 20px',
          fontSize: '1.2rem',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}>
          Submit
        </button>
      </form>

      {message && <p style={{
        marginTop: '20px',
        color: '#e74c3c',
        fontSize: '1.1rem',
        textAlign: 'center'
      }}>{message}</p>}
    </div>
  );
};

export default TaskCount;
