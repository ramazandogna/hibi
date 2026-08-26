import type en from './en'

const ja: typeof en = {
  common: {
    close: '閉じる',
    cancel: 'キャンセル',
    save: '保存',
    saving: '保存中…',
    saved: '保存しました',
    skip: 'スキップ',
    back: '戻る',
    next: '次へ',
    done: '完了',
    tryAgain: 'もう一度試す',
    loading: '読み込み中…',
    delete: '削除',
    deletePermanently: '完全に削除',
    export: '書き出す',
    edit: '編集',
    archive: 'アーカイブ',
    restore: '元に戻す',
    moveUp: '{name} を上へ',
    moveDown: '{name} を下へ',
    openItem: '{name} を開く',
  },

  nav: {
    main: 'メインナビゲーション',
    today: '今日',
    week: '週',
    year: '年',
    profile: 'プロフィール',
  },

  topbar: {
    settings: '設定',
    premium: 'プレミアム',
  },

  premium: {
    title: 'Hibi プレミアム',
    subtitle: 'サーバーが必要な機能です。まだ利用できません。',
    reminders: 'ちょうどよい時間に届くリマインダー',
    recaps: 'ちゃんと読み返せる年間まとめ',
    insights: 'すべての習慣を横断する分析',
    soon: '近日公開',
  },

  kind: {
    build: {
      label: '育てる',
      group: '育てたい習慣',
      streak: '日連続',
      hint: 'もっと続けたいこと。実行した日がそのまま記録になります。',
    },
    quit: {
      label: 'やめる',
      group: 'やめたいこと',
      streak: 'クリーンな日',
      hint: '減らしたいこと。我慢できた日が連続記録になります。',
    },
    scale: {
      label: '気分',
      group: '今の気分',
      streak: '今週の平均',
      hint: '1〜5 で評価する毎日の記録。ひと月の形が見えてきます。',
    },
  },

  level: {
    1: 'つらい',
    2: '低い',
    3: 'ふつう',
    4: 'よい',
    5: '最高',
  },

  today: {
    loadingHabits: '習慣を読み込み中…',
    emptyTitle: 'まだ記録がありません',
    emptyDescription: 'まずは一つ選んでください。名前の変更も削除も後からできます。',
    thisDay: 'この日',
    addNote: 'メモを追加',
    howWasIt: '今日はどうでしたか？',
    todayLabel: '今日',
    suggestionCode: 'コードを書く',
    suggestionScroll: '夜更かしのスマホ',
    suggestionFeel: '今の気分',
  },

  week: {
    previous: '前の週',
    next: '次の週',
    notesThisWeek: '今週のメモ',
    noData: 'この週のデータはありません。',
    review: '{planned} 日中 {completed} 日 ・ {percent}%',
    strongest: '最も好調 {name}',
  },

  year: {
    previous: '前の年',
    next: '次の年',
    thatDay: 'その日',
    hasNote: 'メモあり — タップして読む',
    less: '少',
    more: '多',
  },

  habit: {
    new: '新しい習慣',
    newSubtitle: '名前を付けて、記録方法を選ぶだけです。',
    edit: '習慣を編集',
    name: '名前',
    namePlaceholder: 'コードを書く',
    mode: 'モード',
    modeLocked: '記録モードは変更できません。過去の記録の意味が変わってしまうためです。',
    weeklyTarget: '週の目標',
    weeklyTargetHint: '週に何日を目指すか。続く 4 日は、続かない 7 日に勝ります。',
    create: '習慣を作成',
    saveChanges: '変更を保存',
    archiveHabit: '習慣をアーカイブ',
    archiveSection: 'アーカイブ',
    deleteTitle: '習慣を削除',
    deleteWithCount: '{name} と {count} 件の記録を削除しますか？',
    deleteWithOne: '{name} と 1 件の記録を削除しますか？',
    deleteWithNone: '{name} を削除しますか？記録はまだありません。',
    deleteUnknown: '{name} と履歴をすべて削除しますか？',
    deleteWarning: 'この操作は取り消せません。',
    loadingHabit: '習慣を読み込み中…',
    missing: 'この習慣はもう存在しません。',
    notes: 'メモ',
    noNotes: 'まだメモがありません。この習慣を記録するときに書けます。',
  },

  entry: {
    markedDay: '{name} はこの日に記録済みです。メモを編集するか、記録を取り消せます。',
    removeMark: '記録を取り消す',
    removeEntry: '記録を削除',
    notePrompt: '今日の {name} について残しておきたいことはありますか？',
    optional: '任意',
    saveNote: 'メモを保存',
    standOut: 'この日が特別だった理由は？',
    feelToday: '今日そう感じたのはなぜ？',
    checkInTitle: '今日の{name}はどうですか？',
    checkInHint: 'レベルを選んで、理由を一行書いてください。',
    completed: '{total} 件中 {done} 件完了',
    levelLabel: '{value} — {label}',
  },

  note: {
    label: 'メモ',
    placeholder: '今日は何がありましたか？',
  },

  streak: {
    startToday: '今日から始める',
    toYourBest: '自己最高まであと {count}',
    dontBreak: '途切れさせないで',
  },

  stats: {
    avgThisWeek: '今週の平均',
    avgLastWeek: '先週の平均',
    daysTracked: '記録した日数',
    bestRun: '最長記録',
    last30: '直近 30 日',
    noData: 'まだデータがありません',
    avgSummary: '今週の平均 {value}',
    streakSummary: '{count} {label}',
  },

  profile: {
    title: 'プロフィール',
    signOut: 'サインアウト',
    notSignedIn: '未サインイン',
    trackingSince: '{date} から記録中',
    activeHabits: '進行中の習慣',
    archived: 'アーカイブ済み',
    account: 'アカウント',
    yourHabits: 'あなたの習慣',
    displayName: '表示名',
    displayNamePlaceholder: 'あなたの名前',
    displayNameHint: '今のところ自分だけに表示されます。',
  },

  settings: {
    title: '設定',
    appearance: '外観',
    theme: 'テーマ',
    themeSystem: 'システム',
    themeLight: 'ライト',
    themeDark: 'ダーク',
    calendar: 'カレンダー',
    weekStart: '週の開始曜日',
    monday: '月曜日',
    sunday: '日曜日',
    language: '言語',
    languageSystem: 'システム',
    languageHint: '日付と数値は選んだ言語に合わせて表示されます。',
    help: 'ヘルプ',
    guide: 'アプリガイド',
    guideHint: '各画面の紹介をもう一度見る。',
    replayGuide: 'もう一度見る',
    data: 'あなたのデータ',
    export: 'すべてを JSON で書き出す',
    exportHint: 'すべての習慣・記録・メモを含む 1 つの JSON ファイル。',
    deleteData: 'データを削除',
    deleteDataTitle: 'データを削除',
    deleteDataBody:
      'すべての習慣・記録・メモを削除します。アカウントは残るのでやり直せます。取り消しはできません。',
    typeEmail: '確認のためメールアドレスを入力',
  },

  auth: {
    welcomeBack: 'おかえりなさい',
    pickUp: '続きからどうぞ。',
    startTracking: '記録を始める',
    startTrackingHint: '育てて、やめて、気分の変化に気づく。',
    google: 'Google で続ける',
    or: 'または',
    email: 'メールアドレス',
    emailPlaceholder: "you{'@'}example.com",
    password: 'パスワード',
    confirmPassword: 'パスワードの確認',
    passwordHint: '8 文字以上',
    rememberMe: 'この端末でサインインしたままにする',
    signIn: 'サインイン',
    signingIn: 'サインイン中...',
    noAccount: 'アカウントをお持ちでない方',
    createOne: '新規作成',
    createAccount: 'アカウントを作成',
    creatingAccount: '作成中...',
    alreadyHave: 'すでにアカウントをお持ちですか？',
    checkInbox: '受信トレイをご確認ください。{email} に確認リンクを送りました。',
  },

  authError: {
    invalid_credentials: 'メールアドレスまたはパスワードが正しくありません。',
    email_not_confirmed: 'メールアドレスを確認してからサインインしてください。',
    user_already_exists: 'このメールアドレスのアカウントは既に存在します。',
    email_exists: 'このメールアドレスのアカウントは既に存在します。',
    weak_password: 'より強いパスワードを選んでください。',
    over_request_rate_limit: '試行回数が多すぎます。少し待ってからお試しください。',
    over_email_send_rate_limit: '試行回数が多すぎます。少し待ってからお試しください。',
    signup_disabled: '現在、新規登録は停止しています。',
    user_banned: 'このアカウントは停止されています。',
    generic: '問題が発生しました。もう一度お試しください。',
  },

  validation: {
    nameRequired: '名前は必須です。',
    nameMax: '名前は 40 文字以内で入力してください。',
    emailInvalid: '有効なメールアドレスを入力してください。',
    passwordMin: 'パスワードは 8 文字以上にしてください。',
    passwordsMismatch: 'パスワードが一致しません。',
  },

  offline: 'オフラインです — 変更は保存されません。',

  tip: {
    dismiss: 'ヒントを閉じる',
    one: '1 日休んでも習慣はめったに崩れません。崩れ始めるのは 2 日目からです。',
    two: 'すでに毎日していることの直後に置くと、習慣は早く定着します。',
    three: 'つまずいた理由を書き残すことが、記録を物語に変えます。',
    four: '小さな目標のほうが強い。続く週 4 日は、続かない 7 日に勝ります。',
    five: '気分の評価は 5 秒。それが来月の形をつくります。',
    six: 'やめることも連続記録です — クリーンな 1 日はすべて前進です。',
  },

  notFound: {
    title: 'ここには何もありません',
    description: 'そのページは存在しないか、移動しました。',
    action: '今日に戻る',
  },

  onboarding: {
    skip: 'スキップ',
    next: '次へ',
    start: '記録を始める',
    progress: 'ステップ {current} / {total}',
    welcomeTitle: 'Hibi へようこそ',
    welcomeBody:
      'Hibi は静かな毎日の記録アプリです。ワンタップで 1 日を記録し、一行で理由を残す。1 年分のタップは、読み返す価値のあるものになります。1 分でアプリ全体を紹介します。',
    kindsTitle: '3 つの記録方法',
    kindsBody:
      'すべての習慣は 3 つのモードのいずれかで、モードが「1 日」の意味を決めます。色はアプリ全体で共通なので、ラベルを読まなくても画面を把握できます。',
    buildTitle: '緑 — 育てたい習慣',
    buildBody:
      '読書、散歩、コードを書くなど、もっと増やしたいこと。記録するとマスが埋まり、連続した日が記録になります。7 日すべてを課すのではなく週の目標を決めます。続く 4 日は、続かない 7 日に勝るからです。',
    quitTitle: '赤 — やめたいこと',
    quitBody:
      '喫煙、夜更かし、砂糖など、減らしたいこと。ここでは記録した日が「クリーンな日」で、連続記録は我慢できている長さです。一度崩れてもリセットされるのは数字だけで、進歩ではありません。',
    scaleTitle: '青 — 今の気分',
    scaleBody:
      '1〜5 で評価する毎日の日記です。はい / いいえではなくレベルを選び、理由を一行書きます。マスの濃さが評価に対応するので、つらい月とよい月がひと目で違って見えます。',
    createTitle: '習慣をつくる',
    createBody:
      'タブバーの上のボタンから、どの画面でもフォームを開けます。名前を付け、モードを選び、緑の習慣なら週に何日を目指すか決めます。モードは後から変更できません。変更すると記録済みの日の意味が変わってしまうためです。',
    todayTitle: '「今日」の画面',
    todayBody:
      '各行に直近 5 日分と、今日用の大きなボタンが並びます。ボタンで今日を記録し、小さなマスで逃した日を後から直せます。青い習慣ではピッカーが開き、評価が入るまで Hibi が尋ね続けます。',
    notesTitle: '本題はメモ',
    notesBody:
      '1 日を記録するたびに Hibi はメモを提案します。さらに、それ以外のことのために 1 日 1 件のメモがあります。来年読み返す価値をつくるのはこれです。記録は「何が」を、メモは「なぜ」を伝えます。',
    detailTitle: '習慣の中身',
    detailBody:
      '習慣の行をタップして開きます。現在の連続記録、最長記録、直近 30 日の割合、そしてその習慣について書いたすべてのメモが 1 つのリストで見られます。',
    weekTitle: '「週」の画面',
    weekBody:
      '7 つの列、習慣ごとに 1 行、モード別にまとまっています。各グループは予定した日数のうち何日達成したか、どの習慣が週を支えたかを示します。曜日の見出しをタップするとその日を詳しく開けます。',
    yearTitle: '「年」の画面',
    yearBody:
      '1 年分を 1 日 1 マスで表示します。メモのある日には印が付き、タップすると書いた内容を読めます。小さなタップの積み重ねが形になる画面です。',
    settingsTitle: '自分好みに',
    settingsBody:
      '設定にはテーマ、週の開始曜日、言語があります。データはあなたのものです。いつでも JSON で書き出せますし、アカウントを残したまますべて削除もできます。',
    doneTitle: '以上です',
    doneBody:
      'このガイドは設定からいつでも見返せます。まずは習慣を 1 つだけ。最初の記録が伸び始めると、2 つ目はずっと簡単になります。',
  },
}

export default ja
