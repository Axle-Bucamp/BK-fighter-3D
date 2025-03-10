import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class AssetManager {
  constructor() {
    this.textureLoader = new THREE.TextureLoader();
    this.objLoader = new OBJLoader();
    this.fbxLoader = new FBXLoader();
    this.gltfLoader = new GLTFLoader();
    this.loadedAssets = new Map();
  }

  async loadTexture(url) {
    if (this.loadedAssets.has(url)) {
      return this.loadedAssets.get(url);
    }

    const texture = await new Promise((resolve, reject) => {
      this.textureLoader.load(url, resolve, undefined, reject);
    });

    this.loadedAssets.set(url, texture);
    return texture;
  }

  async loadModel(url) {
    if (this.loadedAssets.has(url)) {
      return this.loadedAssets.get(url);
    }

    let loader;
    if (url.endsWith('.obj')) {
      loader = this.objLoader;
    } else if (url.endsWith('.fbx')) {
      loader = this.fbxLoader;
    } else if (url.endsWith('.gltf') || url.endsWith('.glb')) {
      loader = this.gltfLoader;
    } else {
      throw new Error(`Unsupported model format: ${url}`);
    }

    const model = await new Promise((resolve, reject) => {
      loader.load(url, resolve, undefined, reject);
    });

    this.loadedAssets.set(url, model);
    return model;
  }

  async loadCharacterAssets(character) {
    const [model, animation, texture] = await Promise.all([
      this.loadModel(character.model),
      this.loadModel(character.animation),
      this.loadTexture(character.texture)
    ]);

    return { model, animation, texture };
  }
}

export default new AssetManager();