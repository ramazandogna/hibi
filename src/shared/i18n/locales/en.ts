/**
 * The message schema.
 *
 * Every other locale is typed as `typeof en`, so a missing or misspelled key is
 * a compile error rather than a raw key rendered on screen.
 */
const en = {
  common: {
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving…',
    saved: 'Saved',
    skip: 'Skip',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    tryAgain: 'Try again',
    loading: 'Loading…',
    delete: 'Delete',
    deletePermanently: 'Delete permanently',
    export: 'Export',
    edit: 'Edit',
    archive: 'Archive',
    restore: 'Restore',
    moveUp: 'Move {name} up',
    moveDown: 'Move {name} down',
    openItem: 'Open {name}',
  },

  nav: {
    main: 'Main',
    today: 'Today',
    week: 'Week',
    year: 'Year',
    profile: 'Profile',
  },

  topbar: {
    settings: 'Settings',
    premium: 'Premium',
  },

  premium: {
    title: 'Hibi Premium',
    subtitle: 'A few things that need a server behind them. Not available yet.',
    reminders: 'Reminders that arrive at the right hour',
    recaps: 'Yearly recaps you can actually read',
    insights: 'Insights across all of your habits',
    soon: 'Coming soon',
  },

  kind: {
    build: {
      label: 'Build',
      group: 'Habits to build',
      streak: 'day streak',
      hint: 'Something you want to do more often. Every day you do it counts.',
    },
    quit: {
      label: 'Quit',
      group: 'Things to quit',
      streak: 'clean days',
      hint: 'Something you want to do less. Days you stay clean are the streak.',
    },
    scale: {
      label: 'Rate',
      group: 'How you feel',
      streak: 'avg this week',
      hint: 'A daily journal entry rated 1 to 5, so a month gets a shape.',
    },
  },

  day: {
    today: 'Today',
    yesterday: 'Yesterday',
    yesterdayShort: 'Yest.',
  },

  level: {
    1: 'Rough',
    2: 'Low',
    3: 'OK',
    4: 'Good',
    5: 'Great',
  },

  today: {
    loadingHabits: 'Loading habits…',
    emptyTitle: 'Nothing tracked yet',
    emptyDescription: 'Pick one to start with — you can rename or remove it later.',
    thisDay: 'This day',
    addNote: 'Add a note',
    howWasIt: 'How was it?',
    todayLabel: 'today',
    suggestionCode: 'Write code',
    suggestionScroll: 'Late-night scrolling',
    suggestionFeel: 'How I feel',
  },

  week: {
    previous: 'Previous week',
    next: 'Next week',
    notesThisWeek: 'Notes this week',
    noData: 'No data for this week.',
    review: '{completed} of {planned} days · {percent}%',
    strongest: 'strongest {name}',
  },

  year: {
    previous: 'Previous year',
    next: 'Next year',
    thatDay: 'That day',
    hasNote: 'has a note — tap to read',
    noteLegend: 'Days with a note — tap to read',
    less: 'Less',
    more: 'More',
  },

  habit: {
    new: 'New habit',
    newSubtitle: 'Name it, pick how it should be tracked, and you are done.',
    edit: 'Edit habit',
    name: 'Name',
    namePlaceholder: 'Write code',
    mode: 'Mode',
    modeLocked: 'Tracking mode cannot be changed — it would reinterpret your history.',
    weeklyTarget: 'Weekly target',
    weeklyTargetHint:
      'How many days a week counts as a win. Set it below seven and Hibi judges the habit by the week instead of by today — a quiet Tuesday stops looking like failure, and four days you keep beat seven you drop.',
    create: 'Create habit',
    saveChanges: 'Save changes',
    archiveHabit: 'Archive habit',
    archiveSection: 'Archive',
    deleteTitle: 'Delete habit',
    deleteWithCount: 'Delete {name} and its {count} entries?',
    deleteWithOne: 'Delete {name} and its single entry?',
    deleteWithNone: 'Delete {name}? It has no entries yet.',
    deleteUnknown: 'Delete {name} and its history?',
    deleteWarning: 'This cannot be undone.',
    loadingHabit: 'Loading habit…',
    missing: 'This habit no longer exists.',
    notes: 'Notes',
    activity: 'Activity',
    since: 'Tracking since {date}',
    noNotesTitle: 'Nothing written down yet',
    noNotes: 'No notes yet. Add one when you check this habit off.',
  },

  entry: {
    markedDay: '{name} is marked for this day. Edit the note, or remove the mark.',
    removeMark: 'Remove mark',
    removeEntry: 'Remove entry',
    notePrompt: 'Anything to remember about {name} today?',
    optional: 'Optional',
    saveNote: 'Save note',
    standOut: 'Why does this day stand out?',
    feelToday: 'Why does today feel like this?',
    checkInTitle: "How's your {name} today?",
    checkInHint: 'Pick a level, then write a line about why.',
    completed: '{done} of {total} completed',
    levelLabel: '{value} — {label}',
  },

  note: {
    label: 'Note',
    placeholder: 'What happened today?',
  },

  streak: {
    startToday: 'Start today',
    toYourBest: '{count} to your best',
    dontBreak: "Don't break it",
  },

  stats: {
    thisWeek: '{done}/{target} this week',
    weekDone: 'Week complete',
    weekLeft: '{count} to go',
    weeksOnTarget: 'weeks on target',
    avgThisWeek: 'avg this week',
    avgLastWeek: 'avg last week',
    daysTracked: 'days tracked',
    bestRun: 'best run',
    last30: 'last 30 days',
    noData: 'No data yet',
    avgSummary: 'avg {value} this week',
    streakSummary: '{count} {label}',
  },

  profile: {
    title: 'Profile',
    signOut: 'Sign out',
    notSignedIn: 'not signed in',
    trackingSince: 'Tracking since {date}',
    activeHabits: 'active habits',
    archived: 'archived',
    account: 'Account',
    yourHabits: 'Your habits',
    displayName: 'Display name',
    displayNamePlaceholder: 'Your name',
    displayNameHint: 'Shown only to you, for now.',
  },

  settings: {
    title: 'Settings',
    appearance: 'Appearance',
    theme: 'Theme',
    themeSystem: 'System',
    themeLight: 'Light',
    themeDark: 'Dark',
    calendar: 'Calendar',
    weekStart: 'Week starts on',
    monday: 'Monday',
    sunday: 'Sunday',
    language: 'Language',
    languageSystem: 'System',
    languageHint: 'Dates and numbers follow the language you pick.',
    help: 'Help',
    guide: 'App guide',
    guideHint: 'Ninety seconds on why habits work, and how Hibi tracks them.',
    replayGuide: 'Replay',
    data: 'Your data',
    export: 'Export everything as JSON',
    exportHint: 'One JSON file with every habit, entry and note.',
    deleteData: 'Delete my data',
    deleteDataTitle: 'Delete your data',
    deleteDataBody:
      'This removes every habit, entry and note. Your account stays, so you can start over. It cannot be undone.',
    typeEmail: 'Type your email to confirm',
  },

  auth: {
    welcomeBack: 'Welcome back',
    pickUp: 'Pick up where you left off.',
    startTracking: 'Start tracking',
    startTrackingHint: 'Build, quit, and notice how you feel.',
    google: 'Continue with Google',
    or: 'or',
    email: 'Email',
    emailPlaceholder: "you{'@'}example.com",
    password: 'Password',
    confirmPassword: 'Confirm password',
    passwordHint: 'At least 8 characters',
    rememberMe: 'Keep me signed in on this device',
    signIn: 'Sign in',
    signingIn: 'Signing in...',
    noAccount: 'No account yet?',
    createOne: 'Create one',
    createAccount: 'Create account',
    creatingAccount: 'Creating account...',
    alreadyHave: 'Already have an account?',
    checkInbox: 'Check your inbox — we sent a confirmation link to {email}.',
  },

  authError: {
    invalid_credentials: 'Email or password is incorrect.',
    email_not_confirmed: 'Please confirm your email address, then sign in.',
    user_already_exists: 'An account with this email already exists.',
    email_exists: 'An account with this email already exists.',
    weak_password: 'Please choose a stronger password.',
    over_request_rate_limit: 'Too many attempts. Please wait a moment and try again.',
    over_email_send_rate_limit: 'Too many attempts. Please wait a moment and try again.',
    signup_disabled: 'New sign-ups are currently disabled.',
    user_banned: 'This account has been suspended.',
    generic: 'Something went wrong. Please try again.',
  },

  validation: {
    nameRequired: 'Name is required.',
    nameMax: 'Name must be 40 characters or fewer.',
    emailInvalid: 'Enter a valid email address.',
    passwordMin: 'Password must be at least 8 characters.',
    passwordsMismatch: 'Passwords do not match!',
  },

  offline: "You're offline — changes won't be saved.",

  error: {
    title: 'This screen ran into a problem',
    body: 'The rest of the app is fine — switch tabs, or try this screen again.',
    retry: 'Try again',
    reload: 'Reload the app',
  },

  install: {
    title: 'Put Hibi on your Home Screen',
    body: 'It opens without a browser bar, and reminders keep arriving once the tab is closed.',
    action: 'Install',
    later: 'Not now',
    iosTitle: 'Add Hibi to your Home Screen',
    iosBody:
      'Tap the Share button in Safari, then Add to Home Screen. Notifications only work once you open Hibi from there.',
    settingsRow: 'Install the app',
    installed: 'Hibi is installed on this device.',
  },

  notify: {
    section: 'Reminders',
    sectionHint: 'Two a day: one to open it, one to close it. Nothing else, ever.',
    toggle: 'Daily reminders',
    schedule: 'Morning 08:00 · Evening 21:00',
    background: 'Works with the app closed.',
    foregroundOnly: 'Only while Hibi is open in a tab.',
    enable: 'Turn on reminders',
    enabled: 'Reminders are on',
    test: 'Send a test',
    denied: 'Your browser is blocking notifications for Hibi.',
    deniedHelp:
      'Open the padlock beside the address bar, allow notifications, then come back to this screen.',
    unsupported: 'This browser cannot show notifications.',
    iosTitle: 'One step first on iPhone',
    iosBody:
      'Safari only allows notifications once Hibi is on your Home Screen. Tap the Share button, then Add to Home Screen, and open Hibi from there.',

    nudgeTitle: 'Let Hibi tap you on the shoulder',
    nudgeBody:
      'The hardest part of a habit is remembering it exists. Two notifications a day — what you planned this morning, what is still open tonight — and nothing else.',
    nudgeAction: 'Allow notifications',
    nudgeLater: 'Not now',

    morningTitle1: 'A new square to fill',
    morningTitle2: 'Today is yours to shape',
    morningTitle3: 'The line is still unbroken',
    morningBuild: '{count} to build',
    morningQuit: '{count} to stay clean from',
    morningNone: 'Nothing tracked yet. One habit is enough to start.',
    morningPush1: 'Start with the easiest one.',
    morningPush2: 'Small and done beats big and skipped.',
    morningPush3: 'You do not find the time. You take it.',

    eveningTitle1: 'Before the day closes',
    eveningTitle2: 'One last look',
    eveningTitle3: 'How did today go?',
    eveningLeft: '{count} still open.',
    eveningAllDone: 'Everything marked.',
    eveningNone: 'Nothing marked today.',
    eveningPushLeft1: 'Five minutes is enough.',
    eveningPushLeft2: 'Do the smallest one and the day still counts.',
    eveningPushLeft3: 'Half a habit beats a blank square.',
    eveningPushDone1: 'That is what a good day looks like.',
    eveningPushDone2: 'The line holds. Sleep on it.',
    eveningPushDone3: 'Nothing left to do — rare, and worth noticing.',
    eveningPushNone1: 'Missing one day costs almost nothing. Missing two starts to.',
    eveningPushNone2: 'There is still time to make it one.',
    eveningPushNone3: 'Tomorrow is easier if today is not a zero.',

    testTitle: 'This is what a reminder looks like',
    testBody: 'Short, quiet, and twice a day at most.',
  },

  pwa: {
    updateTitle: 'A new version is ready',
    updateBody: 'Reload when you are at a good stopping point.',
    reload: 'Reload',
    later: 'Later',
    offlineReady: 'Hibi is ready to work offline.',
  },

  notFound: {
    title: 'Nothing here',
    description: 'That page does not exist, or it moved.',
    action: 'Back to today',
  },

  onboarding: {
    skip: 'Skip',
    next: 'Next',
    start: 'Start with one',
    progress: '{current} / {total}',
    discover: 'Take the tour',
    discoverHint: 'Ninety seconds — why this works, and what the colours mean.',

    coverTitle: 'ひび means days',
    coverBody:
      'Not goals, not systems, not productivity. Days — one after another, each one a small square you either fill or you do not. Give this ninety seconds and it will show you why that turns out to be enough.',

    habitualValue: '43%',
    habitualLabel: 'of daily behaviour, on autopilot',
    habitualTitle: 'You already run on habits',
    habitualBody:
      'A diary study of ordinary life found that roughly 43% of what people did was performed almost every day, in the same place, without deciding to. You never chose whether to live by habit. You only choose which ones.',
    habitualSource: 'Wood, Quinn & Kashy (2002), Journal of Personality and Social Psychology',

    sixtysixValue: '66',
    sixtysixLabel: 'days to automatic, median',
    sixtysixRange: 'though it ran from 18 to 254',
    sixtysixTitle: 'Twenty-one days is a myth',
    sixtysixBody:
      'Researchers at University College London followed people forming one new habit and measured when it stopped taking effort. The median was 66 days, and the spread was enormous. If yours feels slow, you are not failing — you are inside the range.',
    sixtysixSource:
      'Lally, van Jaarsveld, Potts & Wardle (2010), European Journal of Social Psychology',

    missTitle: 'One missed day costs almost nothing',
    missBody:
      'The same study checked what happened when someone skipped: a single missed opportunity had no measurable effect on how the habit formed. What ends a streak is rarely the gap. It is deciding the gap means something. Hibi draws it as one pale square in a wall of colour — exactly as important as it is.',
    missSource:
      'Lally et al. (2010) — a single missed opportunity did not materially affect habit formation',

    compoundUp: '37.8×',
    compoundDown: '0.03×',
    compoundTitle: 'The boring day is the whole point',
    compoundBody:
      'Get one percent better every day for a year and you end up thirty-seven times better. Slip one percent a day and you end up near zero. Nothing dramatic happens on any single day — which is exactly why a tracker beats motivation.',
    compoundNote: 'Arithmetic, not a study: 1.01³⁶⁵ ≈ 37.8 and 0.99³⁶⁵ ≈ 0.03.',

    tapHint: 'Tap a mode to see what it means',
    modesTitle: 'Three ways to mark a day',
    modesBody:
      'Every habit is one of three modes, and the mode decides what a filled square means. The colour follows it everywhere in the app, so you can read a whole screen without reading a word. Tap one.',

    cueTrigger: 'After my coffee',
    cueAction: 'Read 20 pages',
    cueTitle: 'Name the moment, not the goal',
    cueBody:
      'Across 94 studies, people who decided in advance exactly when and where they would act were substantially more likely to follow through — one of the most dependable effects in behavioural science. So call it “Read after coffee”, not “Read more”. Let the cue do the remembering.',
    cueSource:
      'Gollwitzer & Sheeran (2006), Advances in Experimental Social Psychology — 94 studies, a medium-to-large effect',

    recordNoteDate: '12 March',
    recordNoteBody:
      'Skipped the gym and wrote instead. Turns out I do not hate mornings, I hate rushing them.',
    recordTitle: 'The tracking is the intervention',
    recordBody:
      'A meta-analysis of 138 studies found that monitoring progress toward a goal makes reaching it more likely — and the effect was larger when the progress was physically recorded. Marking the day is not admin you do after the work. It is part of the work.',
    recordSource: 'Harkin et al. (2016), Psychological Bulletin — 138 studies',

    yearTitle: 'Then one day you scroll back',
    yearBody:
      'Every square you fill is one pixel of a picture you cannot see yet. A month in, it looks like noise. A year in, it looks like evidence — and the days you left a note on are the ones you will actually stop at.',

    startTitle: 'Start with one',
    startBody:
      'Not five. One, small enough that a bad day cannot stop it. The second habit is far easier to add once the first has a line worth protecting.',
  },
}

export default en
