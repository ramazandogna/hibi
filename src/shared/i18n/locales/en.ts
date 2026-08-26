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
      label: 'Scale',
      group: 'How you feel',
      streak: 'avg this week',
      hint: 'A daily journal entry rated 1 to 5, so a month gets a shape.',
    },
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
    weeklyTargetHint: 'Days per week you are aiming for. Four you keep beats seven you drop.',
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
    guideHint: 'Replay the introduction to every screen.',
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
    emailPlaceholder: 'you@example.com',
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

  tip: {
    dismiss: 'Dismiss tip',
    one: 'Missing one day rarely breaks a habit. Missing two starts to.',
    two: 'Habits stick faster when they follow something you already do every day.',
    three: 'Writing down why you slipped is what turns a streak into a story.',
    four: 'Small targets beat ambitious ones: four days a week you keep beats seven you drop.',
    five: 'Rating how you feel takes five seconds and gives next month a shape.',
    six: 'Quitting is a streak too — every clean day counts as progress.',
  },

  notFound: {
    title: 'Nothing here',
    description: 'That page does not exist, or it moved.',
    action: 'Back to today',
  },

  onboarding: {
    skip: 'Skip',
    next: 'Next',
    start: 'Start tracking',
    progress: 'Step {current} of {total}',
    welcomeTitle: 'Welcome to Hibi',
    welcomeBody:
      'Hibi is a quiet daily tracker. One tap marks a day, one line records why, and a year of those taps turns into something you can actually read. Here is the whole app in a minute.',
    kindsTitle: 'Three ways to track',
    kindsBody:
      'Every habit is one of three modes, and the mode decides what a day means. The colour follows it everywhere in the app, so you can read a screen without labels.',
    buildTitle: 'Green — habits to build',
    buildBody:
      'Things you want to do more of: reading, walking, writing code. Marking a day fills the square, and consecutive days build a streak. You set a weekly target instead of demanding all seven, because four days you keep beat seven you drop.',
    quitTitle: 'Red — things to quit',
    quitBody:
      'Things you want to do less of: smoking, late-night scrolling, sugar. Here a marked day counts as a clean day, and the streak is how long you have stayed clean. Slipping once resets the count, not the progress.',
    scaleTitle: 'Blue — how you feel',
    scaleBody:
      'A daily journal rated 1 to 5. Instead of yes or no, you pick a level and write a line about why. The shade of each square follows the rating, so a rough month looks different from a good one at a glance.',
    createTitle: 'Creating a habit',
    createBody:
      'The button above the tab bar opens the form from any screen. Give it a name, pick the mode, and for green habits choose how many days a week you are aiming for. The mode is locked afterwards — changing it would reinterpret every day you already recorded.',
    todayTitle: 'The Today screen',
    todayBody:
      'Each row shows the last five days plus a large button for today. Tap the button to mark today, or tap one of the small squares to fix a day you missed. Blue habits open a picker instead, and Hibi keeps asking until you have rated the day.',
    notesTitle: 'Notes are the point',
    notesBody:
      'Whenever you mark a day, Hibi offers a note. There is also one note per day for everything else. These are what make next year worth reading: a streak tells you what happened, a note tells you why.',
    detailTitle: 'Inside a habit',
    detailBody:
      'Tap any habit row to open it. You get the current streak, your best run, the last thirty days as a percentage, and every note you have written for that habit in one list.',
    weekTitle: 'The Week screen',
    weekBody:
      'Seven columns, one row per habit, grouped by mode. Each group shows how many of its planned days you completed and which habit carried the week. Tap a day header to open that day in full.',
    yearTitle: 'The Year screen',
    yearBody:
      'One square per day for the whole year. Days carrying a note get a marker you can tap to read what you wrote. It is the screen that makes a year of small taps feel like something.',
    settingsTitle: 'Make it yours',
    settingsBody:
      'Settings holds the theme, whether your week starts on Monday or Sunday, and the language. Your data is yours: export everything as JSON at any time, or delete all of it and keep the account.',
    doneTitle: 'That is all of it',
    doneBody:
      'You can replay this guide any time from Settings. Start with one habit — the second one is much easier to add once the first has a streak.',
  },
}

export default en
