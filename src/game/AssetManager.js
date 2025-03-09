import { TextureLoader, AudioLoader, GLTFLoader } from 'three';

class AssetManager {
  constructor() {
    this.textureLoader = new TextureLoader();
    this.audioLoader = new AudioLoader();
    this.modelLoader = new GLTFLoader();
    this.assets = new Map();
    this.loadingPromises = new Map();
  }

  async loadTexture(key, url) {
    if (this.assets.has(key)) return this.assets.get(key);
    if (this.loadingPromises.has(key)) return this.loadingPromises.get(key);

    const promise = new Promise((resolve, reject) => {
      this.textureLoader.load(url, 
        (texture) => {
          this.assets.set(key, texture);
          resolve(texture);
        },
        undefined,
        (error) => reject(`Error loading texture ${key}: ${error.message}`)
      );
    });

    this.loadingPromises.set(key, promise);
    return promise;
  }

  async loadAudio(key, url) {
    if (this.assets.has(key)) return this.assets.get(key);
    if (this.loadingPromises.has(key)) return this.loadingPromises.get(key);

    const promise = new Promise((resolve, reject) => {
      this.audioLoader.load(url, 
        (buffer) => {
          this.assets.set(key, buffer);
          resolve(buffer);
        },
        undefined,
        (error) => reject(`Error loading audio ${key}: ${error.message}`)
      );
    });

    this.loadingPromises.set(key, promise);
    return promise;
  }

  async loadModel(key, url) {
    if (this.assets.has(key)) return this.assets.get(key);
    if (this.loadingPromises.has(key)) return this.loadingPromises.get(key);

    const promise = new Promise((resolve, reject) => {
      this.modelLoader.load(url, 
        (gltf) => {
          this.assets.set(key, gltf);
          resolve(gltf);
        },
        undefined,
        (error) => reject(`Error loading model ${key}: ${error.message}`)
      );
    });

    this.loadingPromises.set(key, promise);
    return promise;
  }

  getAsset(key) {
    return this.assets.get(key);
  }

  async loadAll(assetManifest) {
    const loadPromises = [];
    for (const [key, asset] of Object.entries(assetManifest)) {
      switch (asset.type) {
        case 'texture':
          loadPromises.push(this.loadTexture(key, asset.url));
          break;
        case 'audio':
          loadPromises.push(this.loadAudio(key, asset.url));
          break;
        case 'model':
          loadPromises.push(this.loadModel(key, asset.url));
          break;
        default:
          console.warn(`Unknown asset type for ${key}`);
      }
    }
    await Promise.all(loadPromises);
  }
}

export default AssetManager;