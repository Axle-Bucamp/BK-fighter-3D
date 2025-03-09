import { TextureLoader, AudioLoader, GLTFLoader } from 'three';

class AssetManager {
  constructor() {
    this.textures = new Map();
    this.audio = new Map();
    this.models = new Map();
    this.textureLoader = new TextureLoader();
    this.audioLoader = new AudioLoader();
    this.modelLoader = new GLTFLoader();
  }

  async loadTexture(key, url) {
    if (this.textures.has(key)) {
      return this.textures.get(key);
    }
    const texture = await this.textureLoader.loadAsync(url);
    texture.anisotropy = 16; // Improve texture quality
    this.textures.set(key, texture);
    return texture;
  }

  async loadAudio(key, url) {
    if (this.audio.has(key)) {
      return this.audio.get(key);
    }
    const buffer = await this.audioLoader.loadAsync(url);
    this.audio.set(key, buffer);
    return buffer;
  }

  async loadModel(key, url) {
    if (this.models.has(key)) {
      return this.models.get(key);
    }
    const gltf = await this.modelLoader.loadAsync(url);
    this.models.set(key, gltf.scene);
    return gltf.scene;
  }

  getTexture(key) {
    return this.textures.get(key);
  }

  getAudio(key) {
    return this.audio.get(key);
  }

  getModel(key) {
    return this.models.get(key);
  }

  async preloadAssets(assetManifest) {
    const loadPromises = [];
    for (const asset of assetManifest) {
      switch (asset.type) {
        case 'texture':
          loadPromises.push(this.loadTexture(asset.key, asset.url));
          break;
        case 'audio':
          loadPromises.push(this.loadAudio(asset.key, asset.url));
          break;
        case 'model':
          loadPromises.push(this.loadModel(asset.key, asset.url));
          break;
      }
    }
    await Promise.all(loadPromises);
  }
}

export default AssetManager;