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
    guideHint: '重新观看各个界面的介绍。',
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

  notFound: {
    title: '这里什么都没有',
    description: '该页面不存在，或者已经移动。',
    action: '回到今天',
  },

  onboarding: {
    skip: '跳过',
    next: '下一步',
    start: '开始记录',
    progress: '第 {current} / {total} 步',
    welcomeTitle: '欢迎使用 Hibi',
    welcomeBody:
      'Hibi 是一个安静的每日记录工具。轻点一下标记一天，写一行记下原因，一年的轻点会变成真正值得回看的东西。下面用一分钟带你看完整个应用。',
    kindsTitle: '三种记录方式',
    kindsBody:
      '每个习惯都属于三种模式之一，模式决定了「一天」的含义。颜色在整个应用中保持一致，所以不看文字也能读懂一屏。',
    buildTitle: '绿色 — 想养成的习惯',
    buildBody:
      '你想多做的事：阅读、散步、写代码。标记一天就会填满方块，连续的天数形成记录。你设定的是每周目标，而不是要求七天全勤，因为坚持住的四天胜过放弃的七天。',
    quitTitle: '红色 — 想戒掉的事',
    quitBody:
      '你想少做的事：抽烟、深夜刷手机、吃糖。在这里，被标记的一天代表「清白的一天」，连续记录就是你坚持了多久。偶尔破功只会清零数字，不会清零进步。',
    scaleTitle: '蓝色 — 今天的感受',
    scaleBody:
      '用 1 到 5 评分的每日日记。不是「是或否」，而是选一个等级，再写一句原因。方块的深浅跟随评分，所以难熬的一个月和顺利的一个月一眼就能区分。',
    createTitle: '创建习惯',
    createBody:
      '标签栏上方的按钮可以在任何界面打开表单。取个名字、选好模式，绿色习惯还要选每周目标天数。模式创建后会锁定——更改它会改变你已经记录的每一天的含义。',
    todayTitle: '「今天」界面',
    todayBody:
      '每一行显示最近五天，外加一个用于今天的大按钮。点按大按钮记录今天，点按小方块补记漏掉的日子。蓝色习惯会打开评分选择器，在你评分之前 Hibi 会一直询问。',
    notesTitle: '笔记才是关键',
    notesBody:
      '每次标记一天，Hibi 都会顺便邀请你写笔记；此外每天还有一条通用笔记。它们才是让明年值得回看的东西：记录告诉你发生了什么，笔记告诉你为什么。',
    detailTitle: '习惯详情',
    detailBody:
      '点按任意习惯行即可打开。你会看到当前连续记录、最长记录、最近三十天的完成率，以及为这个习惯写过的全部笔记。',
    weekTitle: '「本周」界面',
    weekBody:
      '七列，每个习惯一行，按模式分组。每组会显示计划天数中完成了多少，以及哪个习惯撑起了这一周。点按星期标题可以完整打开那一天。',
    yearTitle: '「年度」界面',
    yearBody:
      '整年每天一个方块。写过笔记的日子带有标记，点按即可阅读当时写下的内容。正是这个界面，让一年的细小记录变得有分量。',
    settingsTitle: '按你的方式来',
    settingsBody:
      '设置里可以调整主题、每周从周一还是周日开始，以及语言。数据属于你：随时可以导出为 JSON，也可以在保留账户的情况下删除全部数据。',
    doneTitle: '就是这些',
    doneBody:
      '你随时可以在设置里重看这份指南。先从一个习惯开始——第一个跑起来之后，加第二个会容易得多。',
  },
}

export default zh
