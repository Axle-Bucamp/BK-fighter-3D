import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import StartScreen from '../StartScreen';

describe('StartScreen', () => {
  test('renders without errors', () => {
    render(<StartScreen onStartGame={() => {}} />);
    expect(screen.getByTestId('start-screen')).toBeInTheDocument();
  });

  test('displays the game title', () => {
    render(<StartScreen onStartGame={() => {}} />);
    expect(screen.getByText('Burger vs. Jean')).toBeInTheDocument();
  });

  test('renders game mode options', () => {
    render(<StartScreen onStartGame={() => {}} />);
    expect(screen.getByLabelText('Game Mode:')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Game Mode:' })).toBeInTheDocument();
  });

  test('renders difficulty options', () => {
    render(<StartScreen onStartGame={() => {}} />);
    expect(screen.getByLabelText('Difficulty:')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Difficulty:' })).toBeInTheDocument();
  });

  test('renders Start Game button and triggers onStartGame when clicked', () => {
    const mockOnStartGame = jest.fn();
    render(<StartScreen onStartGame={mockOnStartGame} />);
    
    const startButton = screen.getByRole('button', { name: 'Start Game' });
    expect(startButton).toBeInTheDocument();
    
    fireEvent.click(startButton);
    expect(mockOnStartGame).toHaveBeenCalledTimes(1);
  });
});