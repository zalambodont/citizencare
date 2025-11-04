import { render, screen, fireEvent } from '@testing-library/react';
import { AISuggestionDialog } from '../AISuggestionDialog';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('AISuggestionDialog', () => {
  it('calls onRefresh with edited text when the refresh button is pressed', () => {
    const onAccept = jest.fn();
    const onDiscard = jest.fn();
    const onRefresh = jest.fn();

    render(
      <AISuggestionDialog
        open
        suggestion="Sample suggestion"
        loading={false}
        error={null}
        onAccept={onAccept}
        onDiscard={onDiscard}
        onRefresh={onRefresh}
      />
    );

    const refreshButton = screen.getByRole('button', { name: 'aiDialog.refresh' });
    fireEvent.click(refreshButton);

    expect(onRefresh).toHaveBeenCalledTimes(1);
    expect(onRefresh).toHaveBeenCalledWith('Sample suggestion');
  });
});
