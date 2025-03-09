# BK-fighter-3D

BK-fighter-3D is a 3D fighting game featuring Burger and Jean characters, built with React, Three.js, and React Three Fiber.

## Recent Optimizations and Improvements

We've recently implemented several optimizations to improve performance and resource management:

1. **Renderer Optimization:**
   - WebGL2 renderer for better performance on supported devices
   - Adaptive resolution scaling based on device performance

2. **Asset Loading and Management:**
   - Efficient AssetLoader class for managing game assets
   - Texture compression and mipmapping for faster loading and reduced memory usage

3. **Object Pooling:**
   - Implemented for frequently created/destroyed objects (e.g., projectiles, particles)
   - Reduced garbage collection overhead and improved memory management

4. **Level of Detail (LOD):**
   - LOD support for character models
   - Dynamic mesh simplification for less important objects

5. **Occlusion Culling:**
   - Basic occlusion culling to avoid rendering objects not visible to the camera
   - Spatial partitioning (octree) for more efficient visibility checks

6. **Shader Optimization:**
   - Custom, optimized shaders for character and environment rendering
   - Instanced rendering for repeated elements

7. **Physics Optimization:**
   - Simplified physics system for distant objects
   - Fixed timestep for physics calculations

8. **Memory Management:**
   - Texture atlasing to reduce draw calls and memory usage
   - Efficient data storage using typed arrays

9. **Frame Rate Management:**
   - Frame rate capping to prevent excessive GPU usage on high-end devices
   - Adaptive quality settings based on current frame rate

10. **Touch Input Optimization:**
    - Touch input prediction and smoothing for more responsive controls
    - Passive event listeners for touch events to improve scrolling performance

These optimizations result in smoother gameplay and better resource management across various devices.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## Contributing

We welcome contributions! Please see our [CONTRIBUTE.md](CONTRIBUTE.md) file for details on how to get started.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.