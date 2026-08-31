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

  day: {
    today: '今日',
    yesterday: '昨日',
    yesterdayShort: '昨日',
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
    noteLegend: 'メモのある日 — タップで読む',
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
    weeklyTargetHint:
      '週に何日できれば達成とみなすか。7 未満にすると、Hibi はその習慣を「今日」ではなく「その週」で見ます。何もしなかった火曜日が失敗に見えなくなり、続く 4 日は続かない 7 日に勝ります。',
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
    activity: '記録',
    since: '{date} から記録中',
    noNotesTitle: 'まだ何も書かれていません',
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
    thisWeek: '今週 {done}/{target}',
    weekDone: '今週は達成',
    weekLeft: 'あと {count} 日',
    weeksOnTarget: '目標達成の週',
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
    guideHint: '習慣がなぜ効くのか、Hibi がそれをどう記録するのか。90 秒。',
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

  error: {
    title: 'この画面で問題が発生しました',
    body: 'アプリのほかの部分は動いています。タブを切り替えるか、もう一度お試しください。',
    retry: 'もう一度試す',
    reload: 'アプリを再読み込み',
  },

  install: {
    title: 'Hibi をホーム画面に',
    body: 'アドレスバーなしで開き、タブを閉じてもリマインダーが届きます。',
    action: 'インストール',
    later: '今はしない',
    iosTitle: 'Hibi をホーム画面に追加',
    iosBody:
      'Safari の共有ボタンから「ホーム画面に追加」を選んでください。通知はそこから開いたときにだけ届きます。',
    settingsRow: 'アプリをインストール',
    installed: 'この端末に Hibi はインストール済みです。',
  },

  notify: {
    section: 'リマインダー',
    sectionHint: '1 日 2 回。1 日を開く合図と、閉じる合図。それ以外は送りません。',
    toggle: '毎日のリマインダー',
    schedule: '朝 08:00 ・ 夜 21:00',
    background: 'アプリを閉じていても届きます。',
    foregroundOnly: 'Hibi をタブで開いている間だけ。',
    enable: 'リマインダーをオンにする',
    enabled: 'リマインダーはオンです',
    test: 'テスト送信',
    denied: 'ブラウザが Hibi の通知をブロックしています。',
    deniedHelp: 'アドレスバー横の鍵アイコンを開いて通知を許可し、この画面に戻ってください。',
    unsupported: 'このブラウザは通知を表示できません。',
    iosTitle: 'iPhone ではもうひとつだけ',
    iosBody:
      'Safari は、Hibi をホーム画面に追加したあとでのみ通知を許可します。共有ボタンから「ホーム画面に追加」を選び、そこから Hibi を開いてください。',

    nudgeTitle: 'Hibi にそっと声をかけさせてください',
    nudgeBody:
      '習慣のいちばん難しいところは、その存在を思い出すことです。1 日 2 回だけ — 朝は今日やると決めたこと、夜はまだ残っていること。それ以外は何も送りません。',
    nudgeAction: '通知を許可する',
    nudgeLater: '今はしない',

    morningTitle1: '今日、埋める新しいマス',
    morningTitle2: '今日をつくるのはあなたです',
    morningTitle3: '線はまだ途切れていません',
    morningBuild: '育てる習慣 {count} 件',
    morningQuit: '我慢すること {count} 件',
    morningNone: 'まだ記録がありません。習慣ひとつあれば始められます。',
    morningPush1: 'いちばん簡単なものから。',
    morningPush2: '小さくてもやったほうが、大きくても飛ばすより勝ります。',
    morningPush3: '時間は見つけるものではなく、取るものです。',

    eveningTitle1: '一日が終わる前に',
    eveningTitle2: '最後にもう一度',
    eveningTitle3: '今日はどうでしたか？',
    eveningLeft: 'まだ {count} 件残っています。',
    eveningAllDone: 'すべて記録済みです。',
    eveningNone: '今日はまだ何も記録されていません。',
    eveningPushLeft1: '5 分あれば足ります。',
    eveningPushLeft2: 'いちばん小さいものをひとつ。それで今日は成立します。',
    eveningPushLeft3: '半分でも、空のマスよりずっといい。',
    eveningPushDone1: 'よい一日とは、こういう日のことです。',
    eveningPushDone2: '線は保たれました。安心して休んでください。',
    eveningPushDone3: 'やることは残っていません。珍しくて、気づく価値のある日です。',
    eveningPushNone1: '1 日休んでも、ほとんど失いません。2 日目から崩れ始めます。',
    eveningPushNone2: '1 件にするなら、まだ間に合います。',
    eveningPushNone3: '今日がゼロでなければ、明日はずっと楽です。',

    testTitle: 'リマインダーはこう表示されます',
    testBody: '短く、静かに、多くても 1 日 2 回。',
  },

  pwa: {
    updateTitle: '新しいバージョンがあります',
    updateBody: 'きりのよいところで再読み込みしてください。',
    reload: '再読み込み',
    later: 'あとで',
    offlineReady: 'Hibi はオフラインでも使えます。',
  },

  notFound: {
    title: 'ここには何もありません',
    description: 'そのページは存在しないか、移動しました。',
    action: '今日に戻る',
  },

  onboarding: {
    skip: 'スキップ',
    next: '次へ',
    start: 'ひとつから始める',
    progress: '{current} / {total}',
    discover: 'アプリを知る',
    discoverHint: '90 秒 — なぜ効くのか、色が何を意味するのか。',

    coverTitle: 'ひび — 日々のこと',
    coverBody:
      '目標でも、仕組みでも、生産性でもありません。日々です。ひとつずつ並ぶ小さなマスを、埋めるか埋めないか。90 秒だけください。それで十分だという理由をお見せします。',

    habitualValue: '43%',
    habitualLabel: '毎日の行動が、自動操縦',
    habitualTitle: 'あなたはすでに習慣で動いています',
    habitualBody:
      '日常生活を記録した研究では、人の行動のおよそ 43% が、ほぼ毎日、同じ場所で、決断を挟まずに行われていました。習慣で生きるかどうかを選んだことはありません。選べるのは、どの習慣かだけです。',
    habitualSource: 'Wood, Quinn & Kashy (2002), Journal of Personality and Social Psychology',

    sixtysixValue: '66',
    sixtysixLabel: '日で自動化、中央値',
    sixtysixRange: 'ただし 18 日から 254 日まで幅があった',
    sixtysixTitle: '「21 日」は神話です',
    sixtysixBody:
      'ロンドン大学の研究者が、ひとつの新しい習慣を身につける人々を追跡し、それが努力を要さなくなる時点を測りました。中央値は 66 日、ばらつきは非常に大きいものでした。あなたのペースが遅く感じても、失敗ではありません。範囲の内側です。',
    sixtysixSource:
      'Lally, van Jaarsveld, Potts & Wardle (2010), European Journal of Social Psychology',

    missTitle: '1 日休んでも、失うものはほとんどない',
    missBody:
      '同じ研究は、1 日飛ばしたときに何が起きるかも調べています。1 回の見送りは、習慣の形成に測定できるほどの影響を与えませんでした。連続を終わらせるのは空白そのものではなく、その空白に意味を与える判断です。Hibi はそれを、色の壁のなかの淡いマス 1 つとして描きます。ちょうどその重みで。',
    missSource: 'Lally ら (2010) — 1 回の見送りは習慣形成に実質的な影響を与えなかった',

    compoundUp: '37.8×',
    compoundDown: '0.03×',
    compoundTitle: '退屈な 1 日こそが本題',
    compoundBody:
      '1 年間、毎日 1% ずつ良くなれば、37 倍になります。毎日 1% ずつ落ちれば、ほぼゼロです。どの 1 日にも劇的なことは起きません。記録が意欲に勝つ理由は、まさにそこにあります。',
    compoundNote: '研究ではなく算数です：1.01³⁶⁵ ≈ 37.8、0.99³⁶⁵ ≈ 0.03。',

    tapHint: 'タップすると意味が表示されます',
    modesTitle: '1 日を記録する 3 つの方法',
    modesBody:
      'すべての習慣は 3 つのモードのいずれかで、モードが「埋まったマス」の意味を決めます。色はアプリ全体で共通なので、文字を読まずに画面全体を読み取れます。どれかに触れてみてください。',

    cueTrigger: 'コーヒーのあとに',
    cueAction: '20 ページ読む',
    cueTitle: '目標ではなく、きっかけに名前をつける',
    cueBody:
      '94 の研究を通じて、いつ・どこで行動するかをあらかじめ決めた人は、実行に移す確率が明らかに高いことが分かっています。行動科学でもっとも再現性の高い効果のひとつです。だから「もっと読む」ではなく「コーヒーのあとに読む」と名づけましょう。思い出す仕事は、きっかけに任せます。',
    cueSource:
      'Gollwitzer & Sheeran (2006), Advances in Experimental Social Psychology — 94 研究、中〜大の効果',

    recordNoteDate: '3 月 12 日',
    recordNoteBody:
      'ジムをやめて、代わりに書いた。朝が嫌いなのではなく、朝を急かされるのが嫌いなだけらしい。',
    recordTitle: '記録することが、介入そのもの',
    recordBody:
      '138 の研究のメタ分析は、目標への進捗を記録することがその達成の可能性を高めると示しました。しかも、進捗を実際に書き留めたときのほうが効果は大きくなりました。1 日に印をつけるのは、作業のあとの事務仕事ではありません。作業の一部です。',
    recordSource: 'Harkin ら (2016), Psychological Bulletin — 138 研究',

    yearTitle: 'そしてある日、さかのぼる',
    yearBody:
      '埋めたマスはすべて、まだ見えていない絵の 1 ピクセルです。1 か月ではただのノイズに見えます。1 年経つと、証拠に見えます。そして本当に手を止めるのは、メモを残した日です。',

    startTitle: 'ひとつから始める',
    startBody:
      '5 つではなく、1 つ。調子の悪い日でも止まらないくらい小さなものを。守る価値のある線が 1 本できてしまえば、2 つ目はずっと簡単です。',
  },
}

export default ja
