import { loadAsset } from '../src/game/AssetManager';

export const loadCustomCharacter = async (files) => {
  let objFile, fbxFile, textureFile;

  for (const file of files) {
    if (file.name.endsWith('.obj')) {
      objFile = file;
    } else if (file.name.endsWith('.fbx')) {
      fbxFile = file;
    } else if (file.name.endsWith('.jpg') || file.name.endsWith('.png')) {
      textureFile = file;
    }
  }

  if (!objFile || !fbxFile || !textureFile) {
    throw new Error('Missing required files for custom character');
  }

  const objUrl = await loadAsset(objFile, 'obj');
  const fbxUrl = await loadAsset(fbxFile, 'fbx');
  const textureUrl = await loadAsset(textureFile, 'texture');

  return {
    name: objFile.name.split('.')[0],
    objUrl,
    fbxUrl,
    textureUrl,
  };
};

export const getCharacterById = (id) => {
  // Implement logic to retrieve character data by ID
};

export const getAllCharacters = () => {
  // Implement logic to retrieve all available characters
};