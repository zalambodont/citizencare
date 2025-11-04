import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Box,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from 'react-i18next';

interface AISuggestionDialogProps {
  open: boolean;
  suggestion: string;
  loading: boolean;
  error: string | null;
  onAccept: (text: string) => void;
  onDiscard: () => void;
  onRefresh: (editedContext: string) => void;
}

export const AISuggestionDialog: React.FC<AISuggestionDialogProps> = ({
  open,
  suggestion,
  loading,
  error,
  onAccept,
  onDiscard,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const [editedText, setEditedText] = React.useState(suggestion);
  const [hasBeenEdited, setHasBeenEdited] = React.useState(false);

  React.useEffect(() => {
    setEditedText(suggestion);
    setHasBeenEdited(false);
  }, [suggestion]);

  const handleTextChange = (newText: string) => {
    setEditedText(newText);
    setHasBeenEdited(newText !== suggestion);
  };

  const handleAccept = () => {
    onAccept(editedText);
  };

  return (
    <Dialog open={open} onClose={onDiscard} maxWidth="md" fullWidth>
      <DialogTitle>{t('aiDialog.title')}</DialogTitle>
      <DialogContent>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {!loading && !error && suggestion && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="info" variant="outlined">
              {t('aiDialog.editHint')}
            </Alert>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                startIcon={<RefreshIcon />}
                onClick={() => onRefresh(editedText)}
                variant="text"
                size="small"
                sx={{
                  color: hasBeenEdited ? 'primary.main' : 'text.disabled',
                  '&:hover': {
                    backgroundColor: hasBeenEdited ? 'action.hover' : 'transparent',
                  },
                }}
              >
                {t('aiDialog.regenerate')}
              </Button>
            </Box>
            <TextField
              multiline
              rows={8}
              fullWidth
              value={editedText}
              onChange={(e) => handleTextChange(e.target.value)}
              variant="outlined"
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onDiscard}>{t('aiDialog.discard')}</Button>
        <Button
          onClick={handleAccept}
          variant="contained"
          disabled={loading || !!error || !editedText}
        >
          {t('aiDialog.accept')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
