import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Button from '@mui/material/Button';
import useLogin from './Hooks/useLogin';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { loading, login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div>
      <Toaster />
      <div className="wrapper flex mb-28 justify-center items-center min-h-[85vh]">
        <div className="font-[sans-serif] max-md:mr-2 max-md:ml-2 max-w-6xl mx-auto relative bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-3xl overflow-hidden mt-4">
          <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-[#16a904]" />
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-[#1cc608]" />
          <div className="grid md:grid-cols-2 place-items-center gap-6 py-8 px-6">
            <div className="text-center flex flex-col items-center justify-center">
              <img src="/images/min.jpg" className="shrink-0" alt="Logo" />
            </div>
          <form onSubmit={handleSubmit} className="rounded-tl-3xl rounded-bl-3xl">
  <h2 className="text-2xl text-[#16a904] font-bold text-center mb-6">Login</h2>
  <div className="max-w-md mx-auto space-y-4 relative">
    <input
      type="text"
      name="email"
      value={email || ""}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Email"
      className="w-full bg-gray-100 rounded-md py-3 px-4 text-sm outline-blue-600 focus-within:bg-transparent"
    />
    <input
      type="password"
      name="password"
      value={password || ""}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Enter Password"
      className="w-full bg-gray-100 rounded-md py-3 px-4 text-sm outline-blue-600 focus-within:bg-transparent"
    />
    <Button
      variant="contained"
      type="submit"
      sx={{ background: "#16a904" }}
      className="w-full"
      disabled={loading}
    >
      {loading ? "Logging In..." : "Submit"}
    </Button>
  </div>
  <div className="flex items-center justify-end">
                  <p>If you don't have any account!</p>
                  <Link to="/register" className="text-[#16a904] ml-2 hover:underline hover:underline-offset-2">
                    Register
                  </Link>
                </div>
                <Link to="/forgot_password" className="text-[#16a904] ml-2 hover:underline hover:underline-offset-2"><p className='mb-6'>Forget Password</p></Link>
</form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
