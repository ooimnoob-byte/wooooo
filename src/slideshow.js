/**
 * slideshow.js — 核心邏輯模組（純函式，無 DOM 依賴）
 * 可在瀏覽器與 Node.js (Jest) 中使用
 */

// ── 景點資料 ──────────────────────────────────────────────
const SCENES_DATA = [
  {
    biome: 'polar',
    region: "冰島 · Iceland",
    title: "極光下的冰原",
    desc: "在冰島的冬夜，絢爛的北極光如絲帶般舞動在漆黑的天際，照亮了無邊無際的雪原大地。",
    img: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1800&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=120&auto=format&fit=crop"
  },
  {
    biome: 'mountain',
    region: "挪威 · Norway",
    title: "峽灣的藍色晨曦",
    desc: "挪威峽灣以其壯麗的地形聞名，晨霧中的靜謐水面倒映著高聳的山壁，宛如一幅天然油畫。",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&auto=format&fit=crop"
  },
  {
    biome: 'forest',
    region: "日本 · Japan",
    title: "富士山下的櫻花",
    desc: "每年三月，富士山腳下的河口湖岸，粉白色的櫻花盛開如雲，與雄偉的富士山相互輝映。",
    img: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1800&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=120&auto=format&fit=crop"
  },
  {
    biome: 'mountain',
    region: "加拿大 · Canada",
    title: "班夫的翡翠湖",
    desc: "班夫國家公園路易絲湖的湖水因冰川粉末折射而呈現迷人的碧藍翠綠，四季皆美不勝收。",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=120&auto=format&fit=crop"
  },
  {
    biome: 'mountain',
    region: "紐西蘭 · New Zealand",
    title: "米佛峽灣的晨霧",
    desc: "米佛峽灣被譽為「世界第八大奇景」，垂直的岩壁、瀑布與清晨薄霧共同構成震撼人心的景象。",
    img: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1800&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=120&auto=format&fit=crop"
  },
  {
    biome: 'mountain',
    region: "秘魯 · Peru",
    title: "馬丘比丘的雲霧",
    desc: "古印加帝國遺址馬丘比丘隱藏在安地斯山脈雲霧之中，每當朝陽穿透雲層，石砌城廓宛如從天而降。",
    img: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1800&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=120&auto=format&fit=crop"
  },
  {
    biome: 'desert',
    region: "摩洛哥 · Morocco",
    title: "撒哈拉沙漠日落",
    desc: "夕陽在撒哈拉沙漠的沙丘上投下金橙色的長影，駝隊緩緩走過，勾勒出永恆的沙漠剪影。",
    img: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1800&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=120&auto=format&fit=crop"
  },
  {
    biome: 'desert',
    region: "美國 · USA",
    title: "大峽谷的黃昏",
    desc: "科羅拉多大峽谷在黃昏時分被渲染成紅、橙、紫的層次，億萬年的地質歷史在此刻靜默展開。",
    img: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=1800&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=120&auto=format&fit=crop"
  },
  {
    biome: 'forest',
    region: "義大利 · Italy",
    title: "托斯卡尼的金色麥浪",
    desc: "夏日的托斯卡尼丘陵，金黃麥田與柏樹成列的農莊交織出文藝復興畫作中才有的田園詩境。",
    img: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=1800&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=120&auto=format&fit=crop"
  },
  {
    biome: 'ocean',
    region: "馬爾地夫 · Maldives",
    title: "水上屋與清澈藍海",
    desc: "印度洋上的馬爾地夫，珊瑚礁環繞的環礁湖透出多層次的藍綠色澤，是離天堂最近的地方。",
    img: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1800&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=120&auto=format&fit=crop"
  },
  {
    biome: 'mountain',
    region: "中國 · China",
    title: "張家界的石林奇峰",
    desc: "湖南張家界的石英砂岩柱群高聳入雲，曾啟發《阿凡達》的浮空山靈感，置身其中如夢似幻。",
    img: "https://images.unsplash.com/photo-1537531393714-6e23f5a7c878?w=1800&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1537531393714-6e23f5a7c878?w=120&auto=format&fit=crop"
  },
  {
    biome: 'savanna',
    region: "肯亞 · Kenya",
    title: "馬賽馬拉的日出大草原",
    desc: "黎明時分，東非大草原染上金色光芒，象群緩緩行經地平線，演繹著生命最原始的壯麗詩篇。",
    img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1800&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=120&auto=format&fit=crop"
  }
];

const DEFAULT_INTERVAL = 7000;

// ── 生態域分類定義 ──────────────────────────────────────────
const BIOMES = [
  { key: 'all',      label: '全部',     emoji: '🌍' },
  { key: 'polar',    label: '極地',     emoji: '❄️' },
  { key: 'mountain', label: '山岳峽灣', emoji: '🏔️' },
  { key: 'desert',   label: '沙漠峽谷', emoji: '🌵' },
  { key: 'ocean',    label: '熱帶海洋', emoji: '🌊' },
  { key: 'savanna',  label: '熱帶草原', emoji: '🦁' },
  { key: 'forest',   label: '溫帶森林', emoji: '🌿' }
];

// ── 純函式：索引環繞 ────────────────────────────────────────
/**
 * 將 index 環繞在 [0, total) 範圍內
 * @param {number} index
 * @param {number} total
 * @returns {number}
 */
function wrapIndex(index, total) {
  return ((index % total) + total) % total;
}

// ── 不可變狀態管理 ──────────────────────────────────────────
/**
 * 建立初始幻燈片狀態
 * @param {Array} scenes
 * @param {number} [interval]
 * @returns {Object} state
 */
function createState(scenes, interval) {
  if (!Array.isArray(scenes) || scenes.length === 0) {
    throw new Error('scenes 必須是非空陣列');
  }
  return {
    current: 0,
    isAuto: true,
    total: scenes.length,
    interval: interval || DEFAULT_INTERVAL,
    scenes: scenes
  };
}

/**
 * 跳至指定索引（自動環繞）
 * @param {Object} state
 * @param {number} index
 * @returns {Object} 新狀態
 */
function goTo(state, index) {
  const newIndex = wrapIndex(index, state.total);
  return Object.assign({}, state, { current: newIndex });
}

/** 前進至下一張 */
function next(state) {
  return goTo(state, state.current + 1);
}

/** 回到上一張 */
function prev(state) {
  return goTo(state, state.current - 1);
}

/** 切換自動播放狀態 */
function toggleAuto(state) {
  return Object.assign({}, state, { isAuto: !state.isAuto });
}

/** 取得目前景點資料 */
function getCurrentScene(state) {
  return state.scenes[state.current];
}

/**
 * 驗證景點物件欄位是否完整（含 biome）
 * @param {*} scene
 * @returns {boolean}
 */
function validateScene(scene) {
  if (!scene || typeof scene !== 'object') return false;
  var required = ['region', 'title', 'desc', 'img', 'thumb', 'biome'];
  return required.every(function (key) {
    return typeof scene[key] === 'string' && scene[key].trim().length > 0;
  });
}

/**
 * 依生態域篩選景點
 * @param {Array} scenes
 * @param {string} biome - biome key，'all' 或空值表示回傳全部
 * @returns {Array}
 */
function filterByBiome(scenes, biome) {
  if (!biome || biome === 'all') return scenes.slice();
  return scenes.filter(function (s) { return s.biome === biome; });
}

/**
 * 從陣列中隨機取一個元素，可排除指定索引
 * @param {Array} arr
 * @param {number} [excludeIndex] - 要排除的索引（可選）
 * @returns {*} 隨機成員，陣列為空時回傳 null
 */
function pickRandom(arr, excludeIndex) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  if (arr.length === 1) return arr[0];
  var candidates = excludeIndex !== undefined
    ? arr.filter(function (_, i) { return i !== excludeIndex; })
    : arr;
  if (candidates.length === 0) return arr[arr.length - 1];
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * 取得景點陣列中出現的所有 biome key（不重複，依出現順序）
 * @param {Array} scenes
 * @returns {string[]}
 */
function getBiomes(scenes) {
  var seen = new Set();
  return scenes
    .map(function (s) { return s.biome; })
    .filter(function (b) { return b && !seen.has(b) && seen.add(b); });
}

// ── CommonJS export（Node.js / Jest 環境）──────────────────
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SCENES_DATA,
    BIOMES,
    DEFAULT_INTERVAL,
    wrapIndex,
    createState,
    goTo,
    next,
    prev,
    toggleAuto,
    getCurrentScene,
    validateScene,
    filterByBiome,
    pickRandom,
    getBiomes
  };
}
