export const loadAsset = (file, type) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target.result;
      resolve(result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    switch (type) {
      case 'obj':
      case 'fbx':
        reader.readAsArrayBuffer(file);
        break;
      case 'texture':
        reader.readAsDataURL(file);
        break;
      default:
        reject(new Error('Unsupported file type'));
    }
  });
};

export const preloadAssets = (assetList) => {
  // Implement asset preloading logic
};

export const unloadAsset = (assetId) => {
  // Implement asset unloading logic
};