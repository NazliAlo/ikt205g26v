import { render } from '@testing-library/react-native';
import React from 'react';
import MainScreen from '../app/main-screen';

test('viser ikke notater hvis bruker ikke er logget inn', () => {
  const { queryByText } = render(<MainScreen />);
  expect(queryByText('Jobb notater')).toBeNull();
});