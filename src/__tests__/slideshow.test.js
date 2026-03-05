/**
 * slideshow.test.js
 * TDD 測試套件 — 先寫測試，再確保實作通過
 *
 * 執行：npm test
 */

'use strict';

const {
  SCENES_DATA,
  DEFAULT_INTERVAL,
  wrapIndex,
  createState,
  goTo,
  next,
  prev,
  toggleAuto,
  getCurrentScene,
  validateScene
} = require('../../src/slideshow');

// ════════════════════════════════════════════════════════════
// 1. 工具函式：wrapIndex
// ════════════════════════════════════════════════════════════
describe('wrapIndex', () => {
  test('正常範圍內的索引原樣回傳', () => {
    expect(wrapIndex(0, 5)).toBe(0);
    expect(wrapIndex(3, 5)).toBe(3);
    expect(wrapIndex(4, 5)).toBe(4);
  });

  test('等於 total 時繞回 0', () => {
    expect(wrapIndex(5, 5)).toBe(0);
  });

  test('超過 total 時正確繞回', () => {
    expect(wrapIndex(6, 5)).toBe(1);
    expect(wrapIndex(10, 5)).toBe(0);
  });

  test('負數索引向前繞回', () => {
    expect(wrapIndex(-1, 5)).toBe(4);
    expect(wrapIndex(-5, 5)).toBe(0);
    expect(wrapIndex(-6, 5)).toBe(4);
  });
});

// ════════════════════════════════════════════════════════════
// 2. 狀態初始化：createState
// ════════════════════════════════════════════════════════════
describe('createState', () => {
  const mockScenes = [
    { region: 'A', title: 'T1', desc: 'D1', img: 'i1', thumb: 't1' },
    { region: 'B', title: 'T2', desc: 'D2', img: 'i2', thumb: 't2' }
  ];

  test('初始索引為 0', () => {
    const state = createState(mockScenes);
    expect(state.current).toBe(0);
  });

  test('預設自動播放為 true', () => {
    const state = createState(mockScenes);
    expect(state.isAuto).toBe(true);
  });

  test('total 等於 scenes 長度', () => {
    const state = createState(mockScenes);
    expect(state.total).toBe(mockScenes.length);
  });

  test('使用預設間隔時間', () => {
    const state = createState(mockScenes);
    expect(state.interval).toBe(DEFAULT_INTERVAL);
  });

  test('可自訂間隔時間', () => {
    const state = createState(mockScenes, 3000);
    expect(state.interval).toBe(3000);
  });

  test('空陣列拋出錯誤', () => {
    expect(() => createState([])).toThrow();
  });

  test('非陣列輸入拋出錯誤', () => {
    expect(() => createState(null)).toThrow();
    expect(() => createState('string')).toThrow();
  });
});

// ════════════════════════════════════════════════════════════
// 3. 導航：goTo / next / prev
// ════════════════════════════════════════════════════════════
describe('goTo', () => {
  const scenes = Array.from({ length: 5 }, (_, i) => ({
    region: `R${i}`, title: `T${i}`, desc: `D${i}`, img: `img${i}`, thumb: `th${i}`
  }));
  let state;

  beforeEach(() => { state = createState(scenes); });

  test('跳至指定索引', () => {
    const s = goTo(state, 3);
    expect(s.current).toBe(3);
  });

  test('不修改原始狀態（不可變）', () => {
    goTo(state, 3);
    expect(state.current).toBe(0);
  });

  test('超出範圍時自動繞回', () => {
    expect(goTo(state, 5).current).toBe(0);
    expect(goTo(state, 6).current).toBe(1);
  });

  test('負數索引向前繞回', () => {
    expect(goTo(state, -1).current).toBe(4);
  });
});

describe('next', () => {
  const scenes = Array.from({ length: 3 }, (_, i) => ({
    region: `R${i}`, title: `T${i}`, desc: `D${i}`, img: `img${i}`, thumb: `th${i}`
  }));

  test('前進至下一張', () => {
    const s = createState(scenes);
    expect(next(s).current).toBe(1);
  });

  test('最後一張呼叫 next 繞回第一張', () => {
    const s = goTo(createState(scenes), 2);
    expect(next(s).current).toBe(0);
  });
});

describe('prev', () => {
  const scenes = Array.from({ length: 3 }, (_, i) => ({
    region: `R${i}`, title: `T${i}`, desc: `D${i}`, img: `img${i}`, thumb: `th${i}`
  }));

  test('回到上一張', () => {
    const s = goTo(createState(scenes), 2);
    expect(prev(s).current).toBe(1);
  });

  test('第一張呼叫 prev 繞回最後一張', () => {
    const s = createState(scenes);
    expect(prev(s).current).toBe(2);
  });
});

// ════════════════════════════════════════════════════════════
// 4. 自動播放：toggleAuto
// ════════════════════════════════════════════════════════════
describe('toggleAuto', () => {
  const scenes = [{ region: 'A', title: 'T', desc: 'D', img: 'i', thumb: 't' }];

  test('初始為 true，切換後變 false', () => {
    const s = createState(scenes);
    expect(toggleAuto(s).isAuto).toBe(false);
  });

  test('連續切換兩次回到原始值', () => {
    const s = createState(scenes);
    expect(toggleAuto(toggleAuto(s)).isAuto).toBe(true);
  });

  test('不修改原始狀態', () => {
    const s = createState(scenes);
    toggleAuto(s);
    expect(s.isAuto).toBe(true);
  });
});

// ════════════════════════════════════════════════════════════
// 5. 取得目前景點：getCurrentScene
// ════════════════════════════════════════════════════════════
describe('getCurrentScene', () => {
  const scenes = [
    { region: 'A', title: 'T1', desc: 'D1', img: 'i1', thumb: 't1' },
    { region: 'B', title: 'T2', desc: 'D2', img: 'i2', thumb: 't2' }
  ];

  test('初始回傳第一個景點', () => {
    const s = createState(scenes);
    expect(getCurrentScene(s)).toEqual(scenes[0]);
  });

  test('跳轉後回傳正確景點', () => {
    const s = goTo(createState(scenes), 1);
    expect(getCurrentScene(s)).toEqual(scenes[1]);
  });
});

// ════════════════════════════════════════════════════════════
// 6. 景點驗證：validateScene
// ════════════════════════════════════════════════════════════
describe('validateScene', () => {
  const valid = { region: '冰島', title: '極光', desc: '美麗', img: 'http://img', thumb: 'http://th' };

  test('完整景點通過驗證', () => {
    expect(validateScene(valid)).toBe(true);
  });

  test('缺少欄位失敗', () => {
    const { img, ...noImg } = valid;
    expect(validateScene(noImg)).toBe(false);
  });

  test('空字串欄位失敗', () => {
    expect(validateScene({ ...valid, title: '' })).toBe(false);
  });

  test('空白字串欄位失敗', () => {
    expect(validateScene({ ...valid, region: '   ' })).toBe(false);
  });

  test('null 輸入失敗', () => {
    expect(validateScene(null)).toBe(false);
  });

  test('非物件輸入失敗', () => {
    expect(validateScene('string')).toBe(false);
    expect(validateScene(42)).toBe(false);
  });
});

// ════════════════════════════════════════════════════════════
// 7. SCENES_DATA 資料完整性
// ════════════════════════════════════════════════════════════
describe('SCENES_DATA', () => {
  test('景點數量至少 1 筆', () => {
    expect(SCENES_DATA.length).toBeGreaterThan(0);
  });

  test('每筆景點均通過 validateScene 驗證', () => {
    SCENES_DATA.forEach((scene, i) => {
      expect(validateScene(scene)).toBe(true);
    });
  });

  test('每筆 img 與 thumb 均為合法 URL 格式', () => {
    SCENES_DATA.forEach((scene) => {
      expect(scene.img).toMatch(/^https?:\/\/.+/);
      expect(scene.thumb).toMatch(/^https?:\/\/.+/);
    });
  });

  test('region 欄位包含中文國名', () => {
    SCENES_DATA.forEach((scene) => {
      // region 格式為 "中文 · English"
      expect(scene.region).toMatch(/·/);
    });
  });

  test('所有 title 長度在 2–30 字之間', () => {
    SCENES_DATA.forEach((scene) => {
      expect(scene.title.length).toBeGreaterThanOrEqual(2);
      expect(scene.title.length).toBeLessThanOrEqual(30);
    });
  });

  test('DEFAULT_INTERVAL 為正整數（毫秒）', () => {
    expect(typeof DEFAULT_INTERVAL).toBe('number');
    expect(DEFAULT_INTERVAL).toBeGreaterThan(0);
    expect(Number.isInteger(DEFAULT_INTERVAL)).toBe(true);
  });
});
