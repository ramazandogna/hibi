/**
 * Reminder copy for the sender.
 *
 * A deliberate duplicate of the client catalogue rather than an import: this
 * runs in Deno with no bundler and no access to `src/`, and only these few
 * strings are needed. Keep the wording in step with `src/shared/i18n/locales/`
 * when it changes — the tone matters more than the exact words matching.
 */
export type Locale = 'en' | 'tr' | 'ja' | 'zh'
export type Slot = 'morning' | 'evening'

type Copy = {
  morningTitle: string[]
  morningBuild: string
  morningQuit: string
  morningNone: string
  morningPush: string[]
  eveningTitle: string[]
  eveningLeft: string
  eveningAllDone: string
  eveningNone: string
  pushLeft: string[]
  pushDone: string[]
  pushNone: string[]
}

const COPY: Record<Locale, Copy> = {
  en: {
    morningTitle: ['A new square to fill', 'Today is yours to shape', 'The line is still unbroken'],
    morningBuild: '{count} to build',
    morningQuit: '{count} to stay clean from',
    morningNone: 'Nothing tracked yet. One habit is enough to start.',
    morningPush: [
      'Start with the easiest one.',
      'Small and done beats big and skipped.',
      'You do not find the time. You take it.',
    ],
    eveningTitle: ['Before the day closes', 'One last look', 'How did today go?'],
    eveningLeft: '{count} still open.',
    eveningAllDone: 'Everything marked.',
    eveningNone: 'Nothing marked today.',
    pushLeft: [
      'Five minutes is enough.',
      'Do the smallest one and the day still counts.',
      'Half a habit beats a blank square.',
    ],
    pushDone: [
      'That is what a good day looks like.',
      'The line holds. Sleep on it.',
      'Nothing left to do — rare, and worth noticing.',
    ],
    pushNone: [
      'Missing one day costs almost nothing. Missing two starts to.',
      'There is still time to make it one.',
      'Tomorrow is easier if today is not a zero.',
    ],
  },
  tr: {
    morningTitle: ['Yeni bir kare', 'Günü sen yazıyorsun', 'Seri devam ediyor'],
    morningBuild: 'kazanılacak {count}',
    morningQuit: 'bırakılacak {count}',
    morningNone: 'Henüz alışkanlık yok. Bir tane yeter.',
    morningPush: [
      'En kolayından başla.',
      'Küçük ama yapılmış olan kazanır.',
      'Zaman bulunmaz, ayrılır.',
    ],
    eveningTitle: ['Gün kapanmadan', 'Son bir bakış', 'Bugün nasıldı?'],
    eveningLeft: '{count} tanesi açık.',
    eveningAllDone: 'Hepsi tamam.',
    eveningNone: 'Bugün hiç işaret yok.',
    pushLeft: [
      'Beş dakikan var mı?',
      'En küçüğünü yap, gün sayılsın.',
      'Yarısı bile boş kareden iyi.',
    ],
    pushDone: [
      'İyi bir gün böyle görünür.',
      'Seri sende. İyi geceler.',
      'Bugün hiçbir şey eksik kalmadı.',
    ],
    pushNone: [
      'Bir gün önemli değil. İki gün olmaya başlar.',
      'Hâlâ vakit var.',
      'Sıfır olmasın, yarın kolaylaşır.',
    ],
  },
  ja: {
    morningTitle: [
      '今日、埋める新しいマス',
      '今日をつくるのはあなたです',
      '線はまだ途切れていません',
    ],
    morningBuild: '育てる習慣 {count} 件',
    morningQuit: '我慢すること {count} 件',
    morningNone: 'まだ記録がありません。習慣ひとつあれば始められます。',
    morningPush: [
      'いちばん簡単なものから。',
      '小さくてもやったほうが勝ります。',
      '時間は見つけるものではなく、取るものです。',
    ],
    eveningTitle: ['一日が終わる前に', '最後にもう一度', '今日はどうでしたか？'],
    eveningLeft: 'まだ {count} 件残っています。',
    eveningAllDone: 'すべて記録済みです。',
    eveningNone: '今日はまだ何も記録されていません。',
    pushLeft: [
      '5 分あれば足ります。',
      'いちばん小さいものをひとつ。',
      '半分でも、空のマスよりいい。',
    ],
    pushDone: [
      'よい一日とは、こういう日です。',
      '線は保たれました。おやすみなさい。',
      'やることは残っていません。',
    ],
    pushNone: [
      '1 日休んでもほとんど失いません。2 日目から崩れます。',
      'まだ間に合います。',
      '今日がゼロでなければ、明日は楽です。',
    ],
  },
  zh: {
    morningTitle: ['又一个等着被填满的方块', '今天由你来塑造', '这条线还没断'],
    morningBuild: '{count} 个要养成',
    morningQuit: '{count} 个要忍住',
    morningNone: '还没有任何记录。一个习惯就够开始了。',
    morningPush: [
      '从最容易的那个开始。',
      '做成的小事，胜过跳过的大事。',
      '时间不是找出来的，是拿出来的。',
    ],
    eveningTitle: ['在这一天结束之前', '最后看一眼', '今天过得怎么样？'],
    eveningLeft: '还有 {count} 个没完成。',
    eveningAllDone: '全部已记录。',
    eveningNone: '今天还没有任何记录。',
    pushLeft: ['五分钟就够了。', '做最小的那一个，这一天照样算数。', '做一半也胜过空着的方块。'],
    pushDone: ['好日子就是这个样子。', '这条线守住了，安心睡吧。', '没有待办了——难得。'],
    pushNone: [
      '漏掉一天几乎不用付出代价，漏掉两天才会。',
      '现在还来得及。',
      '今天不是零，明天就轻松得多。',
    ],
  },
}

/** Same rule as the client: deterministic by day, so it varies but never mid-day. */
function pick(items: string[], dayOfYear: number): string {
  return items[dayOfYear % items.length] ?? items[0] ?? ''
}

export function buildMessage(
  locale: Locale,
  slot: Slot,
  dayOfYear: number,
  facts: { build: number; quit: number; open: number; done: number },
): { title: string; body: string } {
  const copy = COPY[locale] ?? COPY.en

  if (slot === 'morning') {
    const parts: string[] = []
    if (facts.build > 0) parts.push(copy.morningBuild.replace('{count}', String(facts.build)))
    if (facts.quit > 0) parts.push(copy.morningQuit.replace('{count}', String(facts.quit)))

    const lead = parts.length > 0 ? `${parts.join(' · ')}.` : copy.morningNone

    return {
      title: pick(copy.morningTitle, dayOfYear),
      body: `${lead} ${pick(copy.morningPush, dayOfYear)}`,
    }
  }

  const title = pick(copy.eveningTitle, dayOfYear)

  if (facts.open === 0 && facts.done > 0) {
    return { title, body: `${copy.eveningAllDone} ${pick(copy.pushDone, dayOfYear)}` }
  }

  if (facts.done === 0) {
    return { title, body: `${copy.eveningNone} ${pick(copy.pushNone, dayOfYear)}` }
  }

  return {
    title,
    body: `${copy.eveningLeft.replace('{count}', String(facts.open))} ${pick(copy.pushLeft, dayOfYear)}`,
  }
}
