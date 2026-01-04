import { useEffect, useState } from 'react';
import { Quest, Subtask, QuestDifficulty } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Plus, X } from 'lucide-react';
import { getXPForDifficulty } from '../utils/xp';

interface QuestCreateDialogProps {
  /**
   * Whether the dialog is open or not. Controlled by the parent.
   */
  open: boolean;
  /**
   * Called when the dialog should be closed without creating a quest.
   */
  onClose: () => void;
  /**
   * Called with the new quest when the user clicks the create button.
   */
  onCreate: (quest: Quest) => void;

  /**
   * Optional prefilled due date (ISO string). Useful when creating a quest
   * from the calendar view.
   */
  defaultDueDate?: string;
}

/**
 * A dialog that allows the user to create a new quest. The form
 * mirrors the fields available in the QuestDetailDialog, but instead
 * of updating an existing quest it constructs a new quest object and
 * invokes the onCreate callback. Once created, the dialog closes
 * automatically.
 */
export function QuestCreateDialog({ open, onClose, onCreate, defaultDueDate }: QuestCreateDialogProps) {
  // Form state for each field. We initialise sensible defaults.
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('normal');
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState('');

  // When the dialog opens, prefill due date if provided.
  useEffect(() => {
    if (!open) return;
    if (defaultDueDate) {
      setDueDate(defaultDueDate);
    }
  }, [open, defaultDueDate]);

  // Reset the form whenever the dialog closes.
  useEffect(() => {
    if (open) return;
    resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Derived XP reward based on selected difficulty.
  const xpReward = getXPForDifficulty(difficulty);

  /**
   * Add a tag to the local tag list. Ignores empty input.
   */
  const handleAddTag = () => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    setTags([...tags, trimmed]);
    setNewTag('');
  };

  /**
   * Remove a tag from the local list.
   */
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  /**
   * Add a subtask to the local subtask list. Each subtask is given
   * a unique id based on the current timestamp. Ignores empty input.
   */
  const handleAddSubtask = () => {
    const trimmed = newSubtask.trim();
    if (!trimmed) return;
    const subtask: Subtask = {
      id: Date.now().toString(),
      title: trimmed,
      completed: false
    };
    setSubtasks([...subtasks, subtask]);
    setNewSubtask('');
  };

  /**
   * Toggle the completed state of a subtask.
   */
  const handleToggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map(st => (st.id === id ? { ...st, completed: !st.completed } : st))
    );
  };

  /**
   * Remove a subtask from the list.
   */
  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };

  /**
   * Reset all form fields to their default values. Useful after a
   * quest has been created to ensure subsequent uses of the dialog
   * start from a clean state.
   */
  function resetForm() {
    setTitle('');
    setDescription('');
    setDifficulty('normal');
    setDueDate(undefined);
    setTags([]);
    setNewTag('');
    setSubtasks([]);
    setNewSubtask('');
  }

  /**
   * When the user clicks the create button, assemble a new Quest
   * object and invoke onCreate. Afterwards the form is reset and
   * the dialog closed.
   */
  const handleCreate = () => {
    const quest: Quest = {
      id: crypto.randomUUID(),
      title: title.trim() || 'Untitled Quest',
      description: description.trim() || undefined,
      difficulty,
      status: 'pending',
      xpReward,
      dueDate,
      tags,
      subtasks,
      createdAt: new Date().toISOString()
    };
    onCreate(quest);
    resetForm();
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
          <DialogTitle>Create New Quest</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="new-quest-title">Title</Label>
            <Input
              id="new-quest-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Quest name"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="new-quest-description">Description</Label>
            <Textarea
              id="new-quest-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Quest description"
              rows={3}
            />
          </div>

          {/* Difficulty & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select
                value={difficulty}
                onValueChange={(value: any) => {
                  const diff = value as QuestDifficulty;
                  setDifficulty(diff);
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
              <Label htmlFor="new-quest-due-date">Due Date</Label>
              <Input
                id="new-quest-due-date"
                type="date"
                value={dueDate?.split('T')[0] || ''}
                onChange={(e) =>
                  setDueDate(
                    e.target.value ? new Date(e.target.value).toISOString() : undefined
                  )
                }
              />
            </div>
          </div>

          {/* XP Reward preview */}
          <div className="text-sm text-muted-foreground">
            XP Reward: <span className="font-medium">{xpReward}</span>
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
            {tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {tags.map((tag) => (
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
            {subtasks.length > 0 && (
              <div className="space-y-2 mt-3">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center justify-between gap-2 border border-border rounded p-2"
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleSubtask(subtask.id)}
                        className="w-5 h-5 flex items-center justify-center border border-border rounded-full bg-background"
                      >
                        {subtask.completed ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : null}
                      </button>
                      <span className={subtask.completed ? 'line-through text-muted-foreground' : ''}>
                        {subtask.title}
                      </span>
                    </div>
                    <button onClick={() => handleRemoveSubtask(subtask.id)}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => { resetForm(); onClose(); }}>
              Cancel
            </Button>
            <Button onClick={handleCreate} className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
              Create Quest
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}