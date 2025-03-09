# Contributing to BK-fighter-3D

We're excited that you're interested in contributing to BK-fighter-3D! This document outlines the process for contributing to our project, with a focus on maintaining and improving performance.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your contribution
4. Make your changes
5. Push your changes to your fork
6. Submit a pull request

## Development Setup

1. Ensure you have Node.js and npm installed
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`

## Performance Considerations

When contributing to BK-fighter-3D, please keep the following performance guidelines in mind:

1. Use React.memo for pure functional components to prevent unnecessary re-renders
2. Implement useMemo for expensive computations
3. Use object pooling for frequently created/destroyed objects
4. Optimize Three.js rendering by using appropriate settings and efficient techniques
5. Consider implementing Level of Detail (LOD) for 3D models where appropriate
6. Optimize asset loading and management
7. Use efficient data structures and algorithms for game logic

For more detailed information on our optimization strategies, please refer to the [optimization documentation](doc/optimization.md).

## Coding Standards

- Follow the existing code style
- Use meaningful variable and function names
- Write clear comments for complex logic
- Ensure your code is properly formatted (we recommend using Prettier)
- Write performant code, considering the guidelines mentioned above

## Testing

- Write tests for new features
- Ensure all tests pass before submitting a pull request
- Run tests with `npm test`
- Include performance tests for critical components or functions

## Submitting Changes

1. Push your changes to your fork
2. Submit a pull request to the main repository
3. Describe your changes in detail in the pull request description
4. Link any relevant issues
5. Include before/after performance metrics if your changes affect game performance

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

Thank you for contributing to BK-fighter-3D and helping us create a high-performance 3D fighting game!