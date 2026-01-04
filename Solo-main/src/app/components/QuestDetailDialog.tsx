import { useEffect, useState } from 'react';
import { Quest, Subtask } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, Tag, Trophy, CheckCircle2, Circle, Plus, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { getDifficultyColor, getXPForDifficulty } from '../utils/xp';

interface QuestDetailDialogProps {
  quest: Quest | null;
  open: boolean;
  onClose: () => void;
  onSave: (quest: Quest) => void;
  onComplete: (questId: string) => void;
  onDelete: (questId: string) => void;
}

export function QuestDetailDialog({ quest, open, onClose, onSave, onComplete, onDelete }: QuestDetailDialogProps) {
  const [editedQuest, setEditedQuest] = useState<Quest | null>(quest);
  const [newTag, setNewTag] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  // Keep internal edit state in sync when the selected quest changes.
  useEffect(() => {
    setEditedQuest(quest);
    setNewTag('');
    setNewSubtask('');
  }, [quest?.id, open]);

  if (!quest || !editedQuest) return null;

  const handleAddTag = () => {
    if (newTag.trim()) {
      setEditedQuest({
        ...editedQuest,
        tags: [...editedQuest.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEditedQuest({
      ...editedQuest,
      tags: editedQuest.tags.filter(t => t !== tag)
    });
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      const subtask: Subtask = {
        id: Date.now().toString(),
        title: newSubtask.trim(),
        completed: false
      };
      setEditedQuest({
        ...editedQuest,
        subtasks: [...editedQuest.subtasks, subtask]
      });
      setNewSubtask('');
    }
  };

  const handleToggleSubtask = (subtaskId: string) => {
    setEditedQuest({
      ...editedQuest,
      subtasks: editedQuest.subtasks.map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      )
    });
  };

  const handleRemoveSubtask = (subtaskId: string) => {
    setEditedQuest({
      ...editedQuest,
      subtasks: editedQuest.subtasks.filter(st => st.id !== subtaskId)
    });
  };

  const handleSave = () => {
    onSave(editedQuest);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quest Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editedQuest.title}
              onChange={(e) => setEditedQuest({ ...editedQuest, title: e.target.value })}
              placeholder="Quest name"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editedQuest.description || ''}
              onChange={(e) => setEditedQuest({ ...editedQuest, description: e.target.value })}
              placeholder="Quest description"
              rows={3}
            />
          </div>

          {/* Difficulty & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select
                value={editedQuest.difficulty}
                onValueChange={(value: any) => {
                  // When difficulty changes, also update the XP reward
                  const diff = value as any;
                  setEditedQuest({
                    ...editedQuest,
                    difficulty: diff,
                    xpReward: getXPForDifficulty(diff)
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy (+10 XP)</SelectItem>
                  <SelectItem value="normal">Normal (+25 XP)</SelectItem>
                  <SelectItem value="hard">Hard (+50 XP)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={editedQuest.dueDate?.split('T')[0] || ''}
                onChange={(e) => setEditedQuest({ ...editedQuest, dueDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
              />
            </div>
          </div>

          {/* XP Reward preview */}
          <div className="text-sm text-muted-foreground">
            XP Reward: <span className="font-medium">{editedQuest.xpReward}</span>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button onClick={handleAddTag} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {editedQuest.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {editedQuest.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Subtasks */}
          <div className="space-y-2">
            <Label>Subtasks</Label>
            <div className="flex gap-2">
              <Input
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add a subtask"
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
              />
              <Button onClick={handleAddSubtask} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {editedQuest.subtasks.length > 0 && (
              <div className="space-y-2 mt-3">
                {editedQuest.subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                    <button onClick={() => handleToggleSubtask(subtask.id)}>
                      {subtask.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    <span className={`flex-1 ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {subtask.title}
                    </span>
                    <button onClick={() => handleRemoveSubtask(subtask.id)}>
                      <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            {quest.status !== 'completed' && (
              <Button
                onClick={() => {
                  onComplete(quest.id);
                  onClose();
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Complete Quest
              </Button>
            )}
            <Button onClick={handleSave}>
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onDelete(quest.id);
                onClose();
              }}
              className="text-destructive ml-auto"
            >
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
