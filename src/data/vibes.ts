import type {
  MoodId,
  MoodOption,
  Palette,
  ParticleSpec,
  VibeInput,
  WeatherId,
  WeatherOption,
} from '../types'

export const MOODS: MoodOption[] = [
  { id: 'still', char: '静', label: '平静', en: 'STILL', note: '留一点白' },
  { id: 'light', char: '轻', label: '轻快', en: 'LIGHT', note: '把肩膀放松' },
  { id: 'tired', char: '倦', label: '疲惫', en: 'TIRED', note: '先照顾呼吸' },
  { id: 'spark', char: '燃', label: '燃起', en: 'SPARK', note: '先点燃第一秒' },
  { id: 'tender', char: '柔', label: '柔软', en: 'TENDER', note: '允许被接住' },
]

export const WEATHERS: WeatherOption[] = [
  { id: 'clear', char: '晴', label: '晴天', en: 'CLEAR', icon: 'clear' },
  { id: 'rain', char: '雨', label: '下雨', en: 'RAIN', icon: 'rain' },
  { id: 'mist', char: '雾', label: '起雾', en: 'MIST', icon: 'mist' },
  { id: 'snow', char: '雪', label: '下雪', en: 'SNOW', icon: 'snow' },
  { id: 'night', char: '夜', label: '深夜', en: 'NIGHT', icon: 'night' },
]

export const MOOD_MAP = Object.fromEntries(MOODS.map((mood) => [mood.id, mood])) as Record<
  MoodId,
  MoodOption
>

export const WEATHER_MAP = Object.fromEntries(
  WEATHERS.map((weather) => [weather.id, weather]),
) as Record<WeatherId, WeatherOption>

export const DEFAULT_INPUT: VibeInput = {
  mood: 'tired',
  weather: 'rain',
  keywords: ['旧书'],
}

export interface PaletteSeed extends Palette {
  colors: Palette['colors']
}

export const PALETTES: Record<WeatherId, PaletteSeed[]> = {
  rain: [
    {
      mode: 'dark',
      accent: '#d8a36d',
      colors: [
        { hex: '#07131a', name: '深海' },
        { hex: '#11252e', name: '湿墙' },
        { hex: '#2b4a54', name: '雨幕' },
        { hex: '#8ea7a4', name: '雾灯' },
        { hex: '#ece3d4', name: '暖瓷' },
      ],
    },
    {
      mode: 'dark',
      accent: '#d68e73',
      colors: [
        { hex: '#0b1220', name: '午夜' },
        { hex: '#1c2b3a', name: '蓝调' },
        { hex: '#405d6b', name: '潮汐' },
        { hex: '#9db5b6', name: '雨声' },
        { hex: '#f2ece2', name: '云母' },
      ],
    },
    {
      mode: 'dark',
      accent: '#dda66b',
      colors: [
        { hex: '#172326', name: '站台' },
        { hex: '#30464a', name: '苔痕' },
        { hex: '#6f8a87', name: '雾青' },
        { hex: '#c3cfc7', name: '旧银' },
        { hex: '#f4ede1', name: '奶白' },
      ],
    },
  ],
  clear: [
    {
      mode: 'light',
      accent: '#c96f5a',
      colors: [
        { hex: '#f7f1e3', name: '米白' },
        { hex: '#efe2c8', name: '奶油' },
        { hex: '#e9b87a', name: '蜜糖' },
        { hex: '#c96f5a', name: '陶土' },
        { hex: '#263238', name: '墨青' },
      ],
    },
    {
      mode: 'light',
      accent: '#c97853',
      colors: [
        { hex: '#edf5f5', name: '天光' },
        { hex: '#d4e7e7', name: '浅雾' },
        { hex: '#9cc4c4', name: '湖水' },
        { hex: '#4f7f86', name: '深青' },
        { hex: '#1f3438', name: '夜航' },
      ],
    },
    {
      mode: 'light',
      accent: '#8c5e58',
      colors: [
        { hex: '#f8efdf', name: '纸白' },
        { hex: '#f2d6b3', name: '杏色' },
        { hex: '#e8a87c', name: '落日' },
        { hex: '#8c5e58', name: '旧玫瑰' },
        { hex: '#2f2a2a', name: '咖啡' },
      ],
    },
  ],
  mist: [
    {
      mode: 'light',
      accent: '#8a6f55',
      colors: [
        { hex: '#eef0ea', name: '雾白' },
        { hex: '#dfe4da', name: '苔灰' },
        { hex: '#b9c6b7', name: '山岚' },
        { hex: '#7f9384', name: '松针' },
        { hex: '#2f3a33', name: '深林' },
      ],
    },
    {
      mode: 'light',
      accent: '#a4785c',
      colors: [
        { hex: '#e8e7df', name: '石膏' },
        { hex: '#d3d6ca', name: '麦秆' },
        { hex: '#a9b6a5', name: '雾竹' },
        { hex: '#6e7f73', name: '青苔' },
        { hex: '#2c3832', name: '墨绿' },
      ],
    },
    {
      mode: 'light',
      accent: '#b07a5d',
      colors: [
        { hex: '#f2eee6', name: '晨白' },
        { hex: '#e3e4da', name: '露灰' },
        { hex: '#c5d0c4', name: '水松' },
        { hex: '#8c9d91', name: '石绿' },
        { hex: '#3b4640', name: '岩黑' },
      ],
    },
  ],
  snow: [
    {
      mode: 'light',
      accent: '#9e7a5f',
      colors: [
        { hex: '#f4f6f5', name: '雪白' },
        { hex: '#e3ebea', name: '冰蓝' },
        { hex: '#c2d4d4', name: '霜影' },
        { hex: '#859fa4', name: '冷杉' },
        { hex: '#31444a', name: '深潭' },
      ],
    },
    {
      mode: 'light',
      accent: '#a9785b',
      colors: [
        { hex: '#f7f4ed', name: '宣纸' },
        { hex: '#e7e9e2', name: '雪线' },
        { hex: '#cdd8cf', name: '冷苔' },
        { hex: '#98a9a0', name: '远山' },
        { hex: '#3f4d47', name: '松墨' },
      ],
    },
    {
      mode: 'light',
      accent: '#6f8fa3',
      colors: [
        { hex: '#eef4f7', name: '冰川' },
        { hex: '#dce8ef', name: '薄雾' },
        { hex: '#b4ccd8', name: '湖蓝' },
        { hex: '#7897a8', name: '钢蓝' },
        { hex: '#2b3d49', name: '夜海' },
      ],
    },
  ],
  night: [
    {
      mode: 'dark',
      accent: '#c98b9f',
      colors: [
        { hex: '#090b14', name: '墨夜' },
        { hex: '#151a2b', name: '靛青' },
        { hex: '#2d3554', name: '午夜蓝' },
        { hex: '#b58b9b', name: '玫瑰灰' },
        { hex: '#f2e3ce', name: '月白' },
      ],
    },
    {
      mode: 'dark',
      accent: '#e0a45f',
      colors: [
        { hex: '#100d18', name: '夜紫' },
        { hex: '#241b31', name: '深梅' },
        { hex: '#5b3157', name: '霓虹' },
        { hex: '#d4788c', name: '胭脂' },
        { hex: '#f6e4cf', name: '香槟' },
      ],
    },
    {
      mode: 'dark',
      accent: '#c39a63',
      colors: [
        { hex: '#0c1113', name: '黑松' },
        { hex: '#1c2627', name: '深巷' },
        { hex: '#3b4a44', name: '铜绿' },
        { hex: '#c39a63', name: '琥珀' },
        { hex: '#f4e8d4', name: '米金' },
      ],
    },
  ],
}

export const WEATHER_COPY: Record<
  WeatherId,
  { titles: string[]; footnotes: string[] }
> = {
  clear: {
    titles: [
      '阳光把今天\n晒得很轻',
      '天空蓝得\n刚刚好',
      '把日子摊开\n晒一晒',
      '今天的光\n很会照顾人',
    ],
    footnotes: [
      '光落在桌上，像有人替你留了一个位置。',
      '今天适合把小事，也过成值得记住的事。',
    ],
  },
  rain: {
    titles: [
      '雨把城市\n调成了静音',
      '适合把心事\n交给雨声',
      '窗外在下雨\n世界慢半拍',
      '雨落在\n不必赶路的地方',
    ],
    footnotes: [
      '雨声会把没说完的话，慢慢接住。',
      '如果今天不想说话，就让窗外的声音替你说。',
    ],
  },
  mist: {
    titles: [
      '雾把远方\n藏了起来',
      '看不清的时候\n就先感受',
      '世界起了雾\n正好慢慢走',
      '让轮廓\n暂时消失',
    ],
    footnotes: [
      '看不清的地方，不一定需要一个答案。',
      '雾散之前，先允许自己待在这里。',
    ],
  },
  snow: {
    titles: [
      '雪落得很轻\n像没有发生',
      '世界安静得\n刚刚好',
      '把声音\n留在雪里',
      '白到极处\n反而温柔',
    ],
    footnotes: [
      '世界把音量调低了，你也可以。',
      '有些安静，不需要被填满。',
    ],
  },
  night: {
    titles: [
      '夜色替我们\n留了一盏灯',
      '城市睡了\n心事还醒着',
      '把今天\n还给夜晚',
      '天黑以后\n光更诚实',
    ],
    footnotes: [
      '夜里适合诚实，也适合什么都不想。',
      '把今天放下，明天会自己来。',
    ],
  },
}

export const MOOD_COPY: Record<MoodId, string[]> = {
  still: [
    '不急着回答什么，让呼吸替你把今天放慢。',
    '把声音调低一点，听见自己也算一种进展。',
    '今天不需要意义，安静本身就是答案。',
    '留一点空白，给还没发生的好事。',
  ],
  light: [
    '把肩膀放松，今天适合轻装经过人间。',
    '不必用力快乐，微微发亮就很好。',
    '把步子迈小一点，风会替你赶上。',
    '允许自己无所事事，云也是这么过的。',
  ],
  tired: [
    '今天不必发光，能把自己安稳地放回此刻就好。',
    '电量低的时候，就先只照顾呼吸。',
    '你已经走了很远，允许自己在这里停一会儿。',
    '世界可以等一等，你先把自己接住。',
  ],
  spark: [
    '让心里的火先烧起来，路会自己亮。',
    '今天不解释，只出发。',
    '把犹豫留在原地，你带风走。',
    '不必等万事俱备，先点燃第一秒。',
  ],
  tender: [
    '对自己温柔一点，你也是需要被照顾的人。',
    '把心事放轻一点，今天适合被好好接住。',
    '允许自己柔软，那是你最有力量的部分。',
    '慢一点没关系，爱会找到你的节奏。',
  ],
}

interface ListeningBase {
  genre: string
  bpm: [number, number]
  textures: string[]
  scene: string
}

export const LISTENING: Record<WeatherId, ListeningBase> = {
  clear: {
    genre: 'Indie Folk / City Pop',
    bpm: [92, 116],
    textures: ['木吉他', '轻快鼓刷', '午后蝉鸣'],
    scene: '适合：骑车穿过树影，让风灌进袖口',
  },
  rain: {
    genre: 'Rainy Lo-fi / Ambient',
    bpm: [60, 74],
    textures: ['潮湿钢琴', '黑胶底噪', '远处雷声'],
    scene: '适合：关掉顶灯，只留一盏台灯',
  },
  mist: {
    genre: 'Dream Pop / Slowcore',
    bpm: [64, 80],
    textures: ['朦胧合成器', '呼吸感混响', '低语人声'],
    scene: '适合：在雾里散步，不设目的地',
  },
  snow: {
    genre: 'Ambient / Neo-Classical',
    bpm: [50, 66],
    textures: ['颗粒钢琴', '远处钟声', '雪地脚步'],
    scene: '适合：捧一杯热的，看窗外',
  },
  night: {
    genre: 'Neo-Soul / Bedroom Pop',
    bpm: [70, 96],
    textures: ['暖色贝斯', '黑胶颗粒', '城市底噪'],
    scene: '适合：只开一盏灯，慢一点',
  },
}

export const MOOD_LISTENING: Record<
  MoodId,
  { delta: number; texture: string; note: string }
> = {
  still: { delta: -4, texture: '留白', note: '克制 / 内省 / 不打扰' },
  light: { delta: 8, texture: '轻盈节拍', note: '松弛 / 明亮 / 有点风' },
  tired: { delta: -8, texture: '柔软低频', note: '低电量 / 被照顾 / 不着急' },
  spark: { delta: 12, texture: '锐利合成器', note: '向上 / 带电 / 现在就出发' },
  tender: { delta: -2, texture: '暖色弦乐', note: '柔软 / 亲密 / 靠近一点' },
}

export const PARTICLES: Record<WeatherId, ParticleSpec> = {
  clear: { kind: 'dust', density: 0.7, speed: 0.5 },
  rain: { kind: 'rain', density: 1.15, speed: 1 },
  mist: { kind: 'mist', density: 0.65, speed: 0.25 },
  snow: { kind: 'snow', density: 0.85, speed: 0.4 },
  night: { kind: 'ember', density: 0.6, speed: 0.55 },
}

export const KEYWORD_MAP: Record<string, string> = {
  海风: '#6f9fb2',
  旧书: '#b08a5a',
  咖啡: '#8a604a',
  霓虹: '#d96f8e',
  森林: '#6f8b73',
  晚霞: '#d98264',
  公路: '#7a828c',
  雨声: '#7e9aa8',
  黑胶: '#8a6d5c',
  月光: '#aebbcb',
}

export const KEYWORD_CHOICES = Object.entries(KEYWORD_MAP).map(([label, color]) => ({
  label,
  color,
}))

export const MOOD_LABELS = MOODS.map((mood) => mood.id)
export const WEATHER_LABELS = WEATHERS.map((weather) => weather.id)
