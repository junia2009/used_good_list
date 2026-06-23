import type { ItemInput } from '../services/items';

/** 定番商品カタログ（カテゴリ別）。icon は内蔵イラストの識別子。 */
export const PRESET_GROUPS: { label: string; items: ItemInput[] }[] = [
  {
    label: '野菜',
    items: [
      { name: 'にんじん', brand: '', category: '食品', icon: 'carrot' },
      { name: 'じゃがいも', brand: '', category: '食品', icon: 'potato' },
      { name: 'たまねぎ', brand: '', category: '食品', icon: 'onion' },
      { name: 'トマト', brand: '', category: '食品', icon: 'tomato' },
      { name: 'きゅうり', brand: '', category: '食品', icon: 'cucumber' },
      { name: 'キャベツ', brand: '', category: '食品', icon: 'cabbage' },
    ],
  },
  {
    label: '日用品',
    items: [
      { name: 'トイレットペーパー', brand: '', category: '日用品', icon: 'toiletpaper' },
      { name: 'ティッシュ', brand: '', category: '日用品', icon: 'tissue' },
      { name: '洗剤', brand: '', category: '日用品', icon: 'detergent' },
      { name: '歯ブラシ', brand: '', category: '日用品', icon: 'toothbrush' },
      { name: 'ハンドソープ', brand: '', category: '日用品', icon: 'soap' },
      { name: 'ゴミ袋', brand: '', category: '日用品', icon: 'trashbag' },
    ],
  },
];
