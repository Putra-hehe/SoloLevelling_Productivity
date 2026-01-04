import { motion } from 'motion/react';
import { User as UserIcon, Bell, Palette, LogOut, Trash2 } from 'lucide-react';
import { User } from '../types';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';

interface SettingsPageProps {
  user: User;
  onLogout: () => void;
  onUpdateProfile: (name: string, email: string) => void;
}

export function SettingsPage({ user, onLogout, onUpdateProfile }: SettingsPageProps) {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </motion.div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <UserIcon className="w-5 h-5 text-primary" />
            <h3>Profile</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                defaultValue={user.name}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user.email}
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Class</Label>
              <div className="p-3 rounded-lg bg-secondary border border-border">
                <span className="capitalize">{user.userClass}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Level</Label>
              <div className="p-3 rounded-lg bg-secondary border border-border">
                <span>Level {user.level} • {user.totalXP} Total XP</span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => onUpdateProfile(user.name, user.email)}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-primary" />
            <h3>Notifications</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Quest Reminders</p>
                <p className="text-sm text-muted-foreground">Get notified about upcoming quests</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Habit Reminders</p>
                <p className="text-sm text-muted-foreground">Daily reminders for your habits</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">XP & Level Up</p>
                <p className="text-sm text-muted-foreground">Celebrate your achievements</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Focus Session</p>
                <p className="text-sm text-muted-foreground">Reminders to take breaks</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-5 h-5 text-primary" />
            <h3>Appearance</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="font-medium mb-3">Theme</p>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-2 border-primary text-left">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-cyan-500 mb-2" />
                  <p className="text-sm font-medium">Dark (Active)</p>
                </button>
                <button className="p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors text-left opacity-50">
                  <div className="w-8 h-8 rounded bg-white mb-2" />
                  <p className="text-sm font-medium">Light (Coming Soon)</p>
                </button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Data & Privacy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="mb-6">Data & Privacy</h3>

          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Export Data
            </Button>

            <Button variant="outline" className="w-full justify-start text-destructive border-destructive/50 hover:bg-destructive/10">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full justify-start text-destructive border-destructive/50 hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </Card>
      </motion.div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center text-sm text-muted-foreground"
      >
        <p>LEVELDAY v1.0.0</p>
        <p className="mt-1">Level up your life, one quest at a time</p>
      </motion.div>
    </div>
  );
}
