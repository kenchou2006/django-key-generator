<script setup>
import { ref, onMounted } from 'vue'

import en from './locales/en.js'
import zh from './locales/zh.js'

const getBrowserLang = () => {
  const lang = navigator.language || navigator.userLanguage || '';
  return lang.toLowerCase().includes('zh') ? 'zh' : 'en';
}

const currentLang = ref(getBrowserLang())
const translations = { en, zh }
const t = (key) => translations[currentLang.value][key]

const secretKey = ref('')
const isSecretKeyCopied = ref(false)
const secretKeyLength = ref(50)

const fernetKey = ref('')
const isFernetKeyCopied = ref(false)

const generateSecretKey = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)';
  let result = '';
  const length = Number(secretKeyLength.value);
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  secretKey.value = result;
  isSecretKeyCopied.value = false;
}

const generateFernetKey = () => {
  // 生成 32 bytes 隨機資料
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  
  // 轉為 base64
  let binary = '';
  for (let i = 0; i < array.byteLength; i++) {
    binary += String.fromCharCode(array[i]);
  }
  const base64 = btoa(binary);
  
  // 轉為 url-safe base64
  const urlSafeBase64 = base64.replace(/\+/g, '-').replace(/\//g, '_');
  
  fernetKey.value = urlSafeBase64;
  isFernetKeyCopied.value = false;
}

const copySecretKey = async () => {
  if (!secretKey.value) return;
  try {
    await navigator.clipboard.writeText(secretKey.value)
    isSecretKeyCopied.value = true
    setTimeout(() => {
      isSecretKeyCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

const copyFernetKey = async () => {
  if (!fernetKey.value) return;
  try {
    await navigator.clipboard.writeText(fernetKey.value)
    isFernetKeyCopied.value = true
    setTimeout(() => {
      isFernetKeyCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

onMounted(() => {
  generateSecretKey()
  generateFernetKey()
})
</script>

<template>
  <div class="container" style="position: relative;">
    <div style="position: absolute; top: 0; right: 0;">
      <select v-model="currentLang" style="padding: 0.3rem 0.5rem; border-radius: 4px; border: 1px solid #ddd; background: white;">
        <option value="zh">繁體中文</option>
        <option value="en">English</option>
      </select>
    </div>

    <h1>{{ t('title') }}</h1>
    
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h2 style="margin: 0;">SECRET_KEY</h2>
        <div class="length-control" style="display: flex; align-items: center; gap: 10px;">
          <label for="length-slider" style="font-size: 0.9rem; color: #555;">{{ t('length') }} {{ secretKeyLength }}</label>
          <input 
            id="length-slider" 
            type="range" 
            min="50" 
            max="100" 
            v-model="secretKeyLength" 
            @input="generateSecretKey"
            style="cursor: pointer;"
          >
        </div>
      </div>
      <div class="key-box">
        <code>{{ secretKey }}</code>
      </div>
      
      <div class="controls">
        <button class="btn-primary" @click="generateSecretKey">{{ t('generateNew') }}</button>
        <button class="btn-secondary" @click="copySecretKey">{{ t('copy') }}</button>
      </div>

      <div class="message">
        <span v-if="isSecretKeyCopied">{{ t('copied') }}</span>
      </div>
    </div>

    <div class="card mt-2">
      <h2 style="text-align: left; margin-top: 0; margin-bottom: 1rem;">FIELD_ENCRYPTION_KEYS (Fernet)</h2>
      <div class="key-box">
        <code>{{ fernetKey }}</code>
      </div>
      
      <div class="controls">
        <button class="btn-primary" @click="generateFernetKey">{{ t('generateNew') }}</button>
        <button class="btn-secondary" @click="copyFernetKey">{{ t('copy') }}</button>
      </div>

      <div class="message">
        <span v-if="isFernetKeyCopied">{{ t('copied') }}</span>
      </div>
    </div>
  </div>
</template>
