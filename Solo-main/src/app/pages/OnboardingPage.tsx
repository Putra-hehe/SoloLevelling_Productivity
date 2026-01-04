import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sword, BookOpen, Palette, Target, Calendar, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { UserClass } from '../types';

interface OnboardingPageProps {
  onComplete: (userClass: UserClass, goal: string, schedule: string[]) => void;
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [step, setStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<UserClass | null>(null);

  const goals = [
    { id: 'productivity', label: 'Boost Productivity', icon: Target },
    { id: 'health', label: 'Improve Health', icon: Target },
    { id: 'learning', label: 'Learn New Skills', icon: BookOpen },
    { id: 'creativity', label: 'Be More Creative', icon: Palette }
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const classes = [
    {
      id: 'warrior' as UserClass,
      name: 'Warrior',
      icon: Sword,
      description: 'Face challenges head-on with strength and discipline',
      color: 'from-red-500 to-orange-500',
      traits: ['Discipline', 'Strength', 'Endurance']
    },
    {
      id: 'scholar' as UserClass,
      name: 'Scholar',
      icon: BookOpen,
      description: 'Seek knowledge and wisdom through continuous learning',
      color: 'from-blue-500 to-cyan-500',
      traits: ['Knowledge', 'Wisdom', 'Focus']
    },
    {
      id: 'creator' as UserClass,
      name: 'Creator',
      icon: Palette,
      description: 'Build and create with imagination and innovation',
      color: 'from-purple-500 to-pink-500',
      traits: ['Creativity', 'Innovation', 'Expression']
    }
  ];

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      if (selectedClass && selectedGoal) {
        onComplete(selectedClass, selectedGoal, selectedSchedule);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return selectedGoal !== '';
      case 1:
        return selectedSchedule.length > 0;
      case 2:
        return selectedClass !== null;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-purple-950/10 to-cyan-950/10 px-4 py-8">
      <div className="w-full max-w-4xl">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step
                  ? 'w-12 bg-gradient-to-r from-purple-500 to-cyan-500'
                  : i < step
                  ? 'w-8 bg-primary/50'
                  : 'w-8 bg-secondary'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Goal Selection */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="text-center mb-8">
                  <h2 className="text-3xl mb-2">What's Your Main Goal?</h2>
                  <p className="text-muted-foreground">Choose what you want to focus on</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {goals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${
                        selectedGoal === goal.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <goal.icon className="w-8 h-8 mb-3 text-primary" />
                      <h4>{goal.label}</h4>
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 1: Schedule */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="text-center mb-8">
                  <h2 className="text-3xl mb-2">When Are You Most Active?</h2>
                  <p className="text-muted-foreground">Select the days you want to focus on your goals</p>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  {weekDays.map((day) => (
                    <button
                      key={day}
                      onClick={() => {
                        if (selectedSchedule.includes(day)) {
                          setSelectedSchedule(selectedSchedule.filter(d => d !== day));
                        } else {
                          setSelectedSchedule([...selectedSchedule, day]);
                        }
                      }}
                      className={`w-16 h-16 rounded-full border-2 transition-all ${
                        selectedSchedule.includes(day)
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Class Selection */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="text-center mb-8">
                  <h2 className="text-3xl mb-2">Choose Your Class</h2>
                  <p className="text-muted-foreground">Select your hero archetype</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {classes.map((classOption) => (
                    <button
                      key={classOption.id}
                      onClick={() => setSelectedClass(classOption.id)}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        selectedClass === classOption.id
                          ? 'border-primary bg-primary/10 scale-105'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${classOption.color} flex items-center justify-center shadow-lg`}>
                        <classOption.icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-center mb-2">{classOption.name}</h4>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        {classOption.description}
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {classOption.traits.map(trait => (
                          <span key={trait} className="text-xs px-2 py-1 rounded-full bg-secondary">
                            {trait}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white gap-2"
          >
            {step === 2 ? (
              <>
                Complete
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
