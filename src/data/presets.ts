import type { ItemInput } from '../services/items';

/** 定番商品カタログ。label＝ピッカーの見出し、category＝アプリの分類（食料品/日用品/その他）。 */
export const PRESET_GROUPS: { label: string; items: ItemInput[] }[] = [
  {
    label: '食料品',
    items: [
      // 野菜
      { name: 'にんじん', brand: '', category: '食料品', icon: 'carrot' },
      { name: 'じゃがいも', brand: '', category: '食料品', icon: 'potato' },
      { name: 'たまねぎ', brand: '', category: '食料品', icon: 'onion' },
      { name: 'トマト', brand: '', category: '食料品', icon: 'tomato' },
      { name: 'きゅうり', brand: '', category: '食料品', icon: 'cucumber' },
      { name: 'キャベツ', brand: '', category: '食料品', icon: 'cabbage' },
      { name: 'なす', brand: '', category: '食料品', icon: 'eggplant' },
      { name: 'ピーマン', brand: '', category: '食料品', icon: 'greenpepper' },
      { name: 'だいこん', brand: '', category: '食料品', icon: 'daikon' },
      { name: 'とうもろこし', brand: '', category: '食料品', icon: 'corn' },
      // 果物
      { name: 'りんご', brand: '', category: '食料品', icon: 'apple' },
      { name: 'バナナ', brand: '', category: '食料品', icon: 'banana' },
      { name: 'みかん', brand: '', category: '食料品', icon: 'mandarin' },
      { name: 'いちご', brand: '', category: '食料品', icon: 'strawberry' },
      { name: 'ぶどう', brand: '', category: '食料品', icon: 'grapes' },
      // 肉・魚・卵
      { name: 'たまご', brand: '', category: '食料品', icon: 'egg' },
      { name: '牛肉', brand: '', category: '食料品', icon: 'meat' },
      { name: '鶏肉', brand: '', category: '食料品', icon: 'chicken' },
      { name: '魚', brand: '', category: '食料品', icon: 'fish' },
      { name: 'ハム', brand: '', category: '食料品', icon: 'ham' },
      // 乳製品・パン
      { name: '牛乳', brand: '', category: '食料品', icon: 'milk' },
      { name: 'パン', brand: '', category: '食料品', icon: 'bread' },
      { name: 'チーズ', brand: '', category: '食料品', icon: 'cheese' },
      { name: 'ヨーグルト', brand: '', category: '食料品', icon: 'yogurt' },
      // 主食・大豆
      { name: '米', brand: '', category: '食料品', icon: 'rice' },
      { name: '豆腐', brand: '', category: '食料品', icon: 'tofu' },
      { name: '納豆', brand: '', category: '食料品', icon: 'natto' },
      // 調味料
      { name: 'しょうゆ', brand: '', category: '食料品', icon: 'soysauce' },
      { name: '塩', brand: '', category: '食料品', icon: 'salt' },
      { name: '砂糖', brand: '', category: '食料品', icon: 'sugar' },
      { name: 'サラダ油', brand: '', category: '食料品', icon: 'oil' },
      { name: 'ケチャップ', brand: '', category: '食料品', icon: 'ketchup' },
      { name: 'マヨネーズ', brand: '', category: '食料品', icon: 'mayo' },
      // 飲料
      { name: '水', brand: '', category: '食料品', icon: 'water' },
      { name: 'お茶', brand: '', category: '食料品', icon: 'tea' },
      { name: 'コーヒー', brand: '', category: '食料品', icon: 'coffee' },
      { name: 'ビール', brand: '', category: '食料品', icon: 'beer' },
    ],
  },
  {
    label: '日用品',
    items: [
      { name: 'トイレットペーパー', brand: '', category: '日用品', icon: 'toiletpaper' },
      { name: 'ティッシュ', brand: '', category: '日用品', icon: 'tissue' },
      { name: 'キッチンペーパー', brand: '', category: '日用品', icon: 'kitchenpaper' },
      { name: '歯ブラシ', brand: '', category: '日用品', icon: 'toothbrush' },
      { name: '歯磨き粉', brand: '', category: '日用品', icon: 'toothpaste' },
      { name: 'ハンドソープ', brand: '', category: '日用品', icon: 'soap' },
      { name: 'シャンプー', brand: '', category: '日用品', icon: 'shampoo' },
      { name: '食器用洗剤', brand: '', category: '日用品', icon: 'dishsoap' },
      { name: '洗濯洗剤', brand: '', category: '日用品', icon: 'laundry' },
      { name: '柔軟剤', brand: '', category: '日用品', icon: 'softener' },
      { name: 'ゴミ袋', brand: '', category: '日用品', icon: 'trashbag' },
      { name: '電池', brand: '', category: '日用品', icon: 'battery' },
    ],
  },
];
