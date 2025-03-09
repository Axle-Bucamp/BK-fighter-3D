# Contributing to BK-fighter-3D

We're excited that you're interested in contributing to BK-fighter-3D! This document outlines the process for contributing to our project.

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
3. Start the development server with `npm start`

## Coding Standards

- Follow the existing code style
- Use meaningful variable and function names
- Write clear comments for complex logic
- Ensure your code is properly formatted (we recommend using Prettier)

## Performance Considerations

When contributing, please keep in mind the recent optimizations and try to maintain or improve performance:

- Use object pooling for frequently created/destroyed objects
- Implement LOD (Level of Detail) for complex 3D models
- Optimize shaders and use instanced rendering where appropriate
- Be mindful of memory usage and implement proper resource management
- Consider touch input optimization for mobile devices

## Testing

- Write tests for new features
- Ensure all tests pass before submitting a pull request
- Run tests with `npm test`

## Submitting Changes

1. Push your changes to your fork
2. Submit a pull request to the main repository
3. Describe your changes in detail in the pull request description
4. Link any relevant issues

## Code Review Process

- All contributions will be reviewed by the maintainers
- Address any comments or requested changes promptly
- Be open to constructive feedback and be willing to make changes to your code

## Reporting Issues

- Use the GitHub issue tracker to report bugs
- Provide a clear and detailed description of the issue
- Include steps to reproduce the bug
- Mention your environment (OS, browser, etc.)

## Feature Requests

- Use the GitHub issue tracker to suggest new features
- Clearly describe the feature and its potential benefits
- Be open to discussion about the feature's implementation

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

Thank you for contributing to BK-fighter-3D!