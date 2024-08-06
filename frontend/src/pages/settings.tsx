import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/card';
import { Label } from '@/components/label';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Avatar, AvatarFallback } from '@/components/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Alert, AlertTitle, AlertDescription } from '@/components/alert';

const url = (name: string, wrap = false) =>
  `${wrap ? 'url(' : ''}https://awv3node-homepage.surge.sh/build/assets/${name}.svg${wrap ? ')' : ''}`;

export default function SettingsPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [newsOutlets, setNewsOutlets] = useState<string[]>([]);
  const [firstName, setFirstName] = useState('');

  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: '',
    variant: 'default' as 'default' | 'destructive'
  });

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  const showAlert = (message: string, variant: 'default' | 'destructive') => {
    setAlertInfo({
      show: true,
      message,
      variant
    });
    setTimeout(() => setAlertInfo({ show: false, message: '', variant: 'default' }), 3000);
  };

  const fetchUserPreferences = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (response.status === 200) {
        const data = response.data;
        setCategories(data.preferences.categories || []);
        setNewsOutlets(data.preferences.news_outlets || []);
        setFirstName(data.first_name || '');
        localStorage.setItem('first_name', data.first_name || '');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        showAlert(
          error.response.data.error || 'An error occurred fetching preferences',
          'destructive'
        );
      } else {
        showAlert('An unexpected error occurred fetching preferences', 'destructive');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        'http://127.0.0.1:5000/api/preferences',
        {
          categories,
          news_outlets: newsOutlets
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );
      if (response.status === 200) {
        showAlert('Preferences updated successfully', 'default');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        showAlert(
          error.response.data.error || 'An error occurred updating preferences',
          'destructive'
        );
      } else {
        showAlert('An unexpected error occurred updating preferences', 'destructive');
      }
    }
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
        <Card
          className="w-full max-w-2xl bg-gray-800/50 border-gray-700/30"
          style={{ width: '400px' }}
        >
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 bg-gray-700">
                <AvatarFallback className="text-white text-lg">
                  {firstName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold text-white">User Settings</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage your news preferences
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="categories" className="text-white">
                  News Categories
                </Label>
                <Input
                  id="categories"
                  type="text"
                  placeholder="Enter categories separated by commas"
                  className="bg-gray-700 text-white border-gray-600"
                  value={categories.join(', ')}
                  onChange={(e) =>
                    setCategories(e.target.value.split(',').map((cat) => cat.trim()))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newsOutlets" className="text-white">
                  News Outlets
                </Label>
                <Input
                  id="newsOutlets"
                  type="text"
                  placeholder="Enter news outlets separated by commas"
                  className="bg-gray-700 text-white border-gray-600"
                  value={newsOutlets.join(', ')}
                  onChange={(e) =>
                    setNewsOutlets(e.target.value.split(',').map((outlet) => outlet.trim()))
                  }
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#20575A] hover:bg-[#20575A]/50 transition-colors duration-200 text-white"
              >
                Save Changes
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
