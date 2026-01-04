import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, Coffee, Zap, Trophy } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface FocusSessionPageProps {
  onComplete: (duration: number, xpEarned: number) => void;
}

export function FocusSessionPage({ onComplete }: FocusSessionPageProps) {
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleSessionComplete = () => {
    setIsActive(false);
    
    if (!isBreak) {
      const xp = duration === 25 ? 30 : duration === 45 ? 50 : 100;
      onComplete(duration, xp);
      setCompletedSessions(prev => prev + 1);
      
      // Auto-start break
      setIsBreak(true);
      setTimeLeft(5 * 60);
    } else {
      setIsBreak(false);
      setTimeLeft(duration * 60);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
    setIsBreak(false);
  };

  const handleDurationChange = (newDuration: string) => {
    const dur = parseInt(newDuration);
    setDuration(dur);
    setTimeLeft(dur * 60);
    setIsActive(false);
    setIsBreak(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl mb-2">Focus Session</h1>
        <p className="text-muted-foreground">Stay focused and earn bonus XP</p>
      </motion.div>

      {/* Timer Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-12 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-purple-500/20 text-center">
          {/* Status */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {isBreak ? (
              <>
                <Coffee className="w-5 h-5 text-cyan-400" />
                <span className="text-sm text-cyan-400 font-medium">Break Time</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-purple-400 font-medium">Focus Mode</span>
              </>
            )}
          </div>

          {/* Timer Display */}
          <motion.div
            key={`${minutes}-${seconds}`}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-8xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-8"
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </motion.div>

          {/* Progress Ring */}
          <div className="mb-8">
            <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Duration Selector (only when not active) */}
          {!isActive && !isBreak && (
            <div className="mb-8 max-w-xs mx-auto">
              <Select value={duration.toString()} onValueChange={handleDurationChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 minutes (Pomodoro)</SelectItem>
                  <SelectItem value="45">45 minutes (Deep Work)</SelectItem>
                  <SelectItem value="90">90 minutes (Flow State)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={toggleTimer}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-8"
            >
              {isActive ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </>
              )}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={resetTimer}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>

          {/* XP Info */}
          {!isBreak && (
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span>
                Complete to earn <span className="text-purple-400 font-medium">
                  +{duration === 25 ? 30 : duration === 45 ? 50 : 100} XP
                </span>
              </span>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto"
      >
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">{completedSessions}</div>
          <p className="text-sm text-muted-foreground">Sessions Today</p>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 text-center">
          <div className="text-3xl font-bold text-cyan-400 mb-2">{completedSessions * duration}</div>
          <p className="text-sm text-muted-foreground">Minutes Focused</p>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {completedSessions * (duration === 25 ? 30 : duration === 45 ? 50 : 100)}
          </div>
          <p className="text-sm text-muted-foreground">XP Earned</p>
        </Card>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-6 bg-card/30 backdrop-blur-sm border-border/50">
          <h3 className="mb-3">Focus Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Eliminate distractions before starting your session</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Take short breaks to maintain productivity</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Longer sessions earn more XP but require more focus</span>
            </li>
          </ul>
        </Card>
      </motion.div>
    </div>
  );
}
