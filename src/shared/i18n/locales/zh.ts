import type en from './en'

const zh: typeof en = {
  common: {
    close: '关闭',
    cancel: '取消',
    save: '保存',
    saving: '保存中…',
    saved: '已保存',
    skip: '跳过',
    back: '返回',
    next: '下一步',
    done: '完成',
    tryAgain: '重试',
    loading: '加载中…',
    delete: '删除',
    deletePermanently: '永久删除',
    export: '导出',
    edit: '编辑',
    archive: '归档',
    restore: '恢复',
    moveUp: '将 {name} 上移',
    moveDown: '将 {name} 下移',
    openItem: '打开 {name}',
  },

  nav: {
    main: '主导航',
    today: '今天',
    week: '本周',
    year: '年度',
    profile: '我的',
  },

  topbar: {
    settings: '设置',
    premium: '会员',
  },

  premium: {
    title: 'Hibi 会员',
    subtitle: '这些功能需要服务器支持，暂未开放。',
    reminders: '在合适时间送达的提醒',
    recaps: '真正值得一读的年度回顾',
    insights: '覆盖全部习惯的数据洞察',
    soon: '敬请期待',
  },

  kind: {
    build: {
      label: '养成',
      group: '想养成的习惯',
      streak: '天连续',
      hint: '你想多做的事。每做到一天就记一天。',
    },
    quit: {
      label: '戒除',
      group: '想戒掉的事',
      streak: '天清白',
      hint: '你想少做的事。坚持住的日子就是你的连续记录。',
    },
    scale: {
      label: '心情',
      group: '今天的感受',
      streak: '本周平均',
      hint: '每天用 1 到 5 评分的日记，一个月就有了形状。',
    },
  },

  level: {
    1: '很糟',
    2: '偏低',
    3: '一般',
    4: '不错',
    5: '很好',
  },

  today: {
    loadingHabits: '正在加载习惯…',
    emptyTitle: '还没有任何记录',
    emptyDescription: '先挑一个开始吧——之后随时可以改名或删除。',
    thisDay: '这一天',
    addNote: '添加笔记',
    howWasIt: '今天怎么样？',
    todayLabel: '今天',
    suggestionCode: '写代码',
    suggestionScroll: '深夜刷手机',
    suggestionFeel: '我的感受',
  },

  week: {
    previous: '上一周',
    next: '下一周',
    notesThisWeek: '本周笔记',
    noData: '本周没有数据。',
    review: '{planned} 天中完成 {completed} 天 · {percent}%',
    strongest: '表现最好：{name}',
  },

  year: {
    previous: '上一年',
    next: '下一年',
    thatDay: '那一天',
    hasNote: '有笔记 — 点按查看',
    less: '少',
    more: '多',
  },

  habit: {
    new: '新建习惯',
    newSubtitle: '起个名字，选好记录方式，就完成了。',
    edit: '编辑习惯',
    name: '名称',
    namePlaceholder: '写代码',
    mode: '模式',
    modeLocked: '记录模式无法更改——那会改变你已有记录的含义。',
    weeklyTarget: '每周目标',
    weeklyTargetHint: '你打算每周做几天。坚持住的四天胜过放弃的七天。',
    create: '创建习惯',
    saveChanges: '保存更改',
    archiveHabit: '归档习惯',
    archiveSection: '归档',
    deleteTitle: '删除习惯',
    deleteWithCount: '删除 {name} 及其 {count} 条记录？',
    deleteWithOne: '删除 {name} 及其 1 条记录？',
    deleteWithNone: '删除 {name}？它还没有任何记录。',
    deleteUnknown: '删除 {name} 及其全部历史记录？',
    deleteWarning: '此操作无法撤销。',
    loadingHabit: '正在加载习惯…',
    missing: '该习惯已不存在。',
    notes: '笔记',
    activity: '记录',
    since: '自 {date} 起记录',
    noNotesTitle: '还没有写下任何东西',
    noNotes: '还没有笔记。打卡这个习惯时可以顺手写一条。',
  },

  entry: {
    markedDay: '{name} 这一天已打卡。可以修改笔记，或取消打卡。',
    removeMark: '取消打卡',
    removeEntry: '删除记录',
    notePrompt: '今天关于 {name} 有什么想记下来的吗？',
    optional: '选填',
    saveNote: '保存笔记',
    standOut: '这一天为什么特别？',
    feelToday: '今天为什么是这种感觉？',
    checkInTitle: '今天的{name}怎么样？',
    checkInHint: '先选一个等级，再写一句原因。',
    completed: '已完成 {done} / {total}',
    levelLabel: '{value} — {label}',
  },

  note: {
    label: '笔记',
    placeholder: '今天发生了什么？',
  },

  streak: {
    startToday: '今天开始',
    toYourBest: '距最佳记录还差 {count}',
    dontBreak: '别断掉',
  },

  stats: {
    avgThisWeek: '本周平均',
    avgLastWeek: '上周平均',
    daysTracked: '记录天数',
    bestRun: '最长记录',
    last30: '最近 30 天',
    noData: '暂无数据',
    avgSummary: '本周平均 {value}',
    streakSummary: '{count} {label}',
  },

  profile: {
    title: '我的',
    signOut: '退出登录',
    notSignedIn: '未登录',
    trackingSince: '自 {date} 起记录',
    activeHabits: '进行中的习惯',
    archived: '已归档',
    account: '账户',
    yourHabits: '你的习惯',
    displayName: '显示名称',
    displayNamePlaceholder: '你的名字',
    displayNameHint: '目前只有你自己能看到。',
  },

  settings: {
    title: '设置',
    appearance: '外观',
    theme: '主题',
    themeSystem: '跟随系统',
    themeLight: '浅色',
    themeDark: '深色',
    calendar: '日历',
    weekStart: '每周开始于',
    monday: '星期一',
    sunday: '星期日',
    language: '语言',
    languageSystem: '跟随系统',
    languageHint: '日期和数字会按你选择的语言显示。',
    help: '帮助',
    guide: '应用指南',
    guideHint: '九十秒：习惯为什么有效，以及 Hibi 如何记录它们。',
    replayGuide: '重新观看',
    data: '你的数据',
    export: '导出全部为 JSON',
    exportHint: '一个包含所有习惯、记录和笔记的 JSON 文件。',
    deleteData: '删除我的数据',
    deleteDataTitle: '删除你的数据',
    deleteDataBody: '这会删除全部习惯、记录和笔记。账户会保留，你可以重新开始。此操作无法撤销。',
    typeEmail: '输入你的邮箱以确认',
  },

  auth: {
    welcomeBack: '欢迎回来',
    pickUp: '从上次的地方继续。',
    startTracking: '开始记录',
    startTrackingHint: '养成、戒除，并留意自己的感受。',
    google: '使用 Google 继续',
    or: '或',
    email: '邮箱',
    emailPlaceholder: "you{'@'}example.com",
    password: '密码',
    confirmPassword: '确认密码',
    passwordHint: '至少 8 个字符',
    rememberMe: '在此设备上保持登录',
    signIn: '登录',
    signingIn: '正在登录...',
    noAccount: '还没有账户？',
    createOne: '立即创建',
    createAccount: '创建账户',
    creatingAccount: '正在创建...',
    alreadyHave: '已经有账户了？',
    checkInbox: '请查收邮件——我们已向 {email} 发送了确认链接。',
  },

  authError: {
    invalid_credentials: '邮箱或密码不正确。',
    email_not_confirmed: '请先确认邮箱地址，然后再登录。',
    user_already_exists: '该邮箱已注册。',
    email_exists: '该邮箱已注册。',
    weak_password: '请选择更强的密码。',
    over_request_rate_limit: '尝试次数过多，请稍候再试。',
    over_email_send_rate_limit: '尝试次数过多，请稍候再试。',
    signup_disabled: '目前已关闭新用户注册。',
    user_banned: '该账户已被停用。',
    generic: '出了点问题，请重试。',
  },

  validation: {
    nameRequired: '名称不能为空。',
    nameMax: '名称不能超过 40 个字符。',
    emailInvalid: '请输入有效的邮箱地址。',
    passwordMin: '密码至少需要 8 个字符。',
    passwordsMismatch: '两次输入的密码不一致！',
  },

  offline: '你已离线——更改不会被保存。',

  tip: {
    dismiss: '关闭提示',
    one: '漏掉一天很少会毁掉习惯，漏掉两天才会。',
    two: '把新习惯接在你每天已经会做的事情后面，它会更快扎根。',
    three: '写下自己为什么中断，才把记录变成故事。',
    four: '小目标胜过大目标：坚持住的四天，胜过放弃的七天。',
    five: '给感受打个分只要五秒，却让下个月有了形状。',
    six: '戒除也是一种连续记录——每一个清白的日子都是进展。',
  },

  pwa: {
    updateTitle: '有新版本了',
    updateBody: '在合适的时候重新加载即可。',
    reload: '重新加载',
    later: '稍后',
    offlineReady: 'Hibi 现在可以离线使用了。',
  },

  notFound: {
    title: '这里什么都没有',
    description: '该页面不存在，或者已经移动。',
    action: '回到今天',
  },

  onboarding: {
    skip: '跳过',
    next: '下一步',
    start: '先从一个开始',
    progress: '{current} / {total}',
    discover: '了解这个应用',
    discoverHint: '九十秒 —— 它为什么有效，以及颜色代表什么。',

    coverTitle: 'ひび，意思是「日子」',
    coverBody:
      '不是目标，不是系统，更不是效率。是日子——一天接一天，每天一个小方块，你要么填上，要么不填。给它九十秒，它会告诉你为什么这就够了。',

    habitualValue: '43%',
    habitualLabel: '的日常行为，处于自动驾驶',
    habitualTitle: '你本来就靠习惯在过日子',
    habitualBody:
      '一项记录日常生活的研究发现，人们所做的事情中约有 43% 几乎每天都在同一地点发生，中间没有做过任何决定。你从未选择过要不要靠习惯生活，你能选的只是靠哪些习惯。',
    habitualSource: 'Wood, Quinn & Kashy (2002), Journal of Personality and Social Psychology',

    sixtysixValue: '66',
    sixtysixLabel: '天变成自动，中位数',
    sixtysixRange: '但区间是 18 到 254 天',
    sixtysixTitle: '「21 天」是个传说',
    sixtysixBody:
      '伦敦大学学院的研究者跟踪了正在养成一个新习惯的人，测量它何时不再需要费力。中位数是 66 天，而离散程度极大。如果你觉得自己慢，你并没有失败——你就在这个区间里。',
    sixtysixSource:
      'Lally, van Jaarsveld, Potts & Wardle (2010), European Journal of Social Psychology',

    missTitle: '漏掉一天，几乎不用付出代价',
    missBody:
      '同一项研究也检查了漏掉一天会怎样：单次错过对习惯的形成没有可测量的影响。终结一段记录的，很少是那个空缺，而是你决定那个空缺意味着什么。Hibi 把它画成一整面颜色里的一个浅色方块——恰如它本来的分量。',
    missSource: 'Lally 等 (2010) — 单次错过并未实质性影响习惯的形成',

    compoundUp: '37.8×',
    compoundDown: '0.03×',
    compoundTitle: '关键正是那个乏味的一天',
    compoundBody:
      '一年里每天进步百分之一，最后会好三十七倍；每天退步百分之一，最后接近于零。任何单独的一天都不会发生什么戏剧性的事——这正是记录能胜过动力的原因。',
    compoundNote: '这是算术，不是研究：1.01³⁶⁵ ≈ 37.8，0.99³⁶⁵ ≈ 0.03。',

    modesTitle: '记录一天的三种方式',
    modesBody:
      '每个习惯都属于三种模式之一，模式决定了一个填满的方块意味着什么。颜色在整个应用中保持一致，所以你不读一个字也能读懂整屏。点一下试试。',

    cueTrigger: '喝完咖啡后',
    cueAction: '读 20 页',
    cueTitle: '给时机命名，而不是给目标',
    cueBody:
      '在 94 项研究中，事先明确「什么时候、在哪里」行动的人，真正做到的可能性明显更高——这是行为科学中最稳定的效应之一。所以把它叫作「喝完咖啡后读书」，而不是「多读点书」。让时机替你记住。',
    cueSource:
      'Gollwitzer & Sheeran (2006), Advances in Experimental Social Psychology — 94 项研究，中到大的效应',

    recordNoteDate: '3 月 12 日',
    recordNoteBody: '没去健身房，改成写东西。原来我讨厌的不是早晨，是被早晨催着走。',
    recordTitle: '记录本身就是干预',
    recordBody:
      '一项涵盖 138 项研究的元分析发现，监控自己朝目标的进展会提高达成的可能性——而且当进展被实际记录下来时，效应更大。给一天打上标记不是做完事之后的杂务，它就是这件事的一部分。',
    recordSource: 'Harkin 等 (2016), Psychological Bulletin — 138 项研究',

    yearTitle: '然后某一天，你往回翻',
    yearBody:
      '你填上的每个方块，都是一幅你还看不见的图上的一个像素。一个月后它像噪点，一年后它像证据——而你真正会停下来看的，是那些留了笔记的日子。',

    startTitle: '先从一个开始',
    startBody:
      '不是五个，是一个，小到糟糕的一天也拦不住它。等第一个习惯有了一条值得守护的线，加第二个会容易得多。',
  },
}

export default zh
