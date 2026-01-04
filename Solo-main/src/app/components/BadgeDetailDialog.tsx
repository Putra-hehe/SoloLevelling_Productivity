import { Badge as BadgeType } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { BadgeCard } from './BadgeCard';

interface BadgeDetailDialogProps {
  /**
   * The badge to display in the dialog. If null, nothing is rendered.
   */
  badge: BadgeType | null;
  /**
   * Whether the dialog is open. This value is controlled by the parent.
   */
  open: boolean;
  /**
   * Handler invoked when the dialog requests to close. Consumers should
   * set `open` to false and clear the selected badge accordingly.
   */
  onClose: () => void;
}

/**
 * A simple dialog that shows detailed information about a badge. It
 * leverages the existing `BadgeCard` component for visual presentation
 * and surfaces the description and requirement in a larger format.
 */
export function BadgeDetailDialog({ badge, open, onClose }: BadgeDetailDialogProps) {
  if (!badge) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{badge.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {/* Render the badge card for a large preview */}
          <div className="flex justify-center">
            <BadgeCard badge={badge} />
          </div>
          {/* Description */}
          <p className="text-sm text-muted-foreground text-center">
            {badge.description}
          </p>
          {/* Requirement */}
          {badge.requirement && (
            <p className="text-xs text-center text-muted-foreground italic">
              Requirement: {badge.requirement}
            </p>
          )}
          {/* Unlock date */}
          {!badge.isLocked && badge.unlockedAt && (
            <p className="text-xs text-center text-purple-400">
              Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}