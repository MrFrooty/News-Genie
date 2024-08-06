import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/card';
import { Label } from '@/components/label';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { motion } from 'framer-motion';

const url = (name: string, wrap = false) =>
  `${wrap ? 'url(' : ''}https://awv3node-homepage.surge.sh/build/assets/${name}.svg${wrap ? ')' : ''}`;

export default function SettingsPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [newsOutlets, setNewsOutlets] = useState<string[]>([]);

  useEffect(() => {
    // Fetch user preferences when component mounts
    fetchUserPreferences();
  }, []);

  const fetchUserPreferences = async () => {
    try {
      const response = await fetch('/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
        setNewsOutlets(data.news_outlets || []);
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          categories,
          news_outlets: newsOutlets
        })
      });
      if (response.ok) {
        alert('Preferences updated successfully');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
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
            <CardTitle className="text-2xl font-bold text-white">User Settings</CardTitle>
            <CardDescription className="text-gray-300">
              Manage your news preferences
            </CardDescription>
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
    </div>
  );
}
