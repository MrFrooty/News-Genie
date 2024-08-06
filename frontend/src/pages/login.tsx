import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/card';
import { Label } from '@/components/label';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Alert, AlertTitle, AlertDescription } from '@/components/alert';

const url = (name: string, wrap = false) =>
  `${wrap ? 'url(' : ''}https://awv3node-homepage.surge.sh/build/assets/${name}.svg${wrap ? ')' : ''}`;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: '',
    variant: 'default' as 'default' | 'destructive'
  });

  const showAlert = (message: string, variant: 'default' | 'destructive') => {
    setAlertInfo({
      show: true,
      message,
      variant
    });
    setTimeout(() => setAlertInfo({ show: false, message: '', variant: 'default' }), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      showAlert("Passwords don't match", 'destructive');
      return;
    }

    if (!isLogin && password.length < 8) {
      showAlert('Password must be at least 8 characters long', 'destructive');
      return;
    }

    if (!isLogin && !firstName) {
      showAlert('First name is required', 'destructive');
      return;
    }

    const endpoint = isLogin ? '/api/login' : '/api/register';

    try {
      const response = await axios.post(`http://127.0.0.1:5000${endpoint}`, {
        email,
        password,
        first_name: firstName
      });

      if (response.status === 200 || response.status === 201) {
        if (isLogin) {
          localStorage.setItem('access_token', response.data.access_token);
          localStorage.setItem('user_name', response.data.first_name);
          showAlert('Login successful', 'default');
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          setIsLogin(true);
          showAlert('Registration successful. Please log in.', 'default');
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        showAlert(error.response.data.error || 'An error occurred', 'destructive');
      } else {
        showAlert('An unexpected error occurred', 'destructive');
      }
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
  };

  return (
    <div
      className="min-h-screen bg-[#253237] flex items-center justify-center"
      style={{
        backgroundImage: url('stars', true),
        backgroundSize: 'cover'
      }}
    >
      <motion.div
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1 }}
      >
        <Card className="w-[400px] bg-gray-800/50 border-gray-700/30 overflow-hidden">
          <div className="flex border-b border-gray-700">
            <button
              className={`flex-1 py-2 text-center ${
                isLogin ? 'bg-gray-700 text-white' : 'text-gray-400'
              }`}
              onClick={() => {
                setIsLogin(true);
                resetForm();
              }}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 text-center ${
                !isLogin ? 'bg-gray-700 text-white' : 'text-gray-400'
              }`}
              onClick={() => {
                setIsLogin(false);
                resetForm();
              }}
            >
              Register
            </button>
          </div>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">
              {isLogin ? 'Login' : 'Register'}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {isLogin ? 'Enter your credentials to access your account' : 'Create a new account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    required
                    className="bg-gray-700 text-white border-gray-600 rounded"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="bg-gray-700 text-white border-gray-600 rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  className="bg-gray-700 text-white border-gray-600 rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <Label htmlFor="confirmPassword" className="text-white">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      className="bg-gray-700 text-white border-gray-600 rounded"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <Button
                type="submit"
                className="w-full bg-[#20575A] hover:bg-[#20575A]/50 transition-colors duration-200 text-white rounded"
              >
                {isLogin ? 'Login' : 'Register'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
      <AnimatePresence>
        {alertInfo.show && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 right-8 w-auto z-50"
            style={{ transform: 'translateX(100%)' }}
          >
            <Alert variant={alertInfo.variant} className="border bg-background text-foreground">
              <AlertTitle className="text-lg font-semibold">
                {alertInfo.variant === 'destructive' ? 'Error' : 'Success'}
              </AlertTitle>
              <AlertDescription className="text-sm">{alertInfo.message}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
