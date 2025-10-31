import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PhoneInput } from '../PhoneInput';

describe('PhoneInput', () => {
  it('prefixes the country calling code and strips non-digits', () => {
    const handleChange = jest.fn();
    const handleBlur = jest.fn();

    render(
      <PhoneInput
        label="Phone"
        value="+971 "
        onChange={handleChange}
        onBlur={handleBlur}
        countryCallingCode="+971"
      />
    );

    const input = screen.getByLabelText('Phone');

    fireEvent.change(input, { target: { value: '0-5@0 123 4567' } });

    expect(handleChange).toHaveBeenCalledWith('+971 0501234567');
  });
});
