module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf|fbx)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/images',
          outputPath: 'static/images/',
        },
      },
    });

    return config;
  },
};