import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/card';
import { Label } from '@/components/label';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { motion } from 'framer-motion';

const url = (name: string, wrap = false) =>
  `${wrap ? 'url(' : ''}https://awv3node-homepage.surge.sh/build/assets/${name}.svg${wrap ? ')' : ''}`;

export default function LoginPage() {
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
        <Card className="w-full max-w-md bg-gray-800/50 border-gray-700/30">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">Login</CardTitle>
            <CardDescription className="text-gray-300">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="bg-gray-700 text-white border-gray-600"
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
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#20575A] hover:bg-[#20575A]/50 transition-colors duration-200 text-white"
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
