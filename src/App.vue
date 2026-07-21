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

// 64 chars = 2^6, no modulo bias when using Uint8Array
const RANDOM_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*(-_=+)';

const randomKey = (length) => {
  let result = '';
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += RANDOM_CHARS[array[i] & 63]; // 63 = 64 - 1, bitwise AND avoids modulo bias
  }
  return result;
}

const copyToClipboard = async (valueRef, copiedRef) => {
  if (!valueRef.value) return;
  try {
    await navigator.clipboard.writeText(valueRef.value)
    copiedRef.value = true
    setTimeout(() => {
      copiedRef.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

const secretKey = ref('')
const isSecretKeyCopied = ref(false)
const secretKeyLength = ref(50)

const generateSecretKey = () => {
  secretKey.value = randomKey(Number(secretKeyLength.value));
  isSecretKeyCopied.value = false;
}
const copySecretKey = () => copyToClipboard(secretKey, isSecretKeyCopied)

const jwtSigningKey = ref('')
const isJwtSigningKeyCopied = ref(false)
const jwtSigningKeyLength = ref(64)

const generateJwtSigningKey = () => {
  jwtSigningKey.value = randomKey(Number(jwtSigningKeyLength.value));
  isJwtSigningKeyCopied.value = false;
}
const copyJwtSigningKey = () => copyToClipboard(jwtSigningKey, isJwtSigningKeyCopied)

const fernetKey = ref('')
const isFernetKeyCopied = ref(false)

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
const copyFernetKey = () => copyToClipboard(fernetKey, isFernetKeyCopied)

onMounted(() => {
  generateSecretKey()
  generateJwtSigningKey()
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
      <p class="hint">{{ t('secretKeyHint') }}</p>
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
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h2 style="text-align: left; margin-top: 0; margin-bottom: 0.5rem;">JWT_SIGNING_KEY</h2>
        <div class="length-control" style="display: flex; align-items: center; gap: 10px;">
          <label for="jwt-length-slider" style="font-size: 0.9rem; color: #555;">{{ t('length') }} {{ jwtSigningKeyLength }}</label>
          <input
            id="jwt-length-slider"
            type="range"
            min="32"
            max="128"
            v-model="jwtSigningKeyLength"
            @input="generateJwtSigningKey"
            style="cursor: pointer;"
          >
        </div>
      </div>
      <p class="hint">{{ t('jwtSigningKeyHint') }}</p>
      <div class="key-box">
        <code>{{ jwtSigningKey }}</code>
      </div>

      <div class="controls">
        <button class="btn-primary" @click="generateJwtSigningKey">{{ t('generateNew') }}</button>
        <button class="btn-secondary" @click="copyJwtSigningKey">{{ t('copy') }}</button>
      </div>

      <div class="message">
        <span v-if="isJwtSigningKeyCopied">{{ t('copied') }}</span>
      </div>
    </div>

    <div class="card mt-2">
      <h2 style="text-align: left; margin-top: 0; margin-bottom: 0.5rem;">FIELD_ENCRYPTION_KEYS (Fernet)</h2>
      <p class="hint">{{ t('fernetKeyHint') }}</p>
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
