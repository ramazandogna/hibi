import type en from './en'

const tr: typeof en = {
  common: {
    close: 'Kapat',
    cancel: 'Vazgeç',
    save: 'Kaydet',
    saving: 'Kaydediliyor…',
    saved: 'Kaydedildi',
    skip: 'Geç',
    back: 'Geri',
    next: 'İleri',
    done: 'Tamam',
    tryAgain: 'Tekrar dene',
    loading: 'Yükleniyor…',
    delete: 'Sil',
    deletePermanently: 'Kalıcı olarak sil',
    export: 'Dışa aktar',
    edit: 'Düzenle',
    archive: 'Arşivle',
    restore: 'Geri al',
    moveUp: '{name} yukarı taşı',
    moveDown: '{name} aşağı taşı',
    openItem: '{name} aç',
  },

  nav: {
    main: 'Ana menü',
    today: 'Bugün',
    week: 'Hafta',
    year: 'Yıl',
    profile: 'Profil',
  },

  topbar: {
    settings: 'Ayarlar',
    premium: 'Premium',
  },

  premium: {
    title: 'Hibi Premium',
    subtitle: 'Arkasında sunucu isteyen birkaç özellik. Henüz hazır değil.',
    reminders: 'Doğru saatte gelen hatırlatmalar',
    recaps: 'Gerçekten okunabilen yıllık özetler',
    insights: 'Tüm alışkanlıklarını kapsayan analizler',
    soon: 'Yakında',
  },

  kind: {
    build: {
      label: 'Yap',
      group: 'Kazanılacak alışkanlıklar',
      streak: 'günlük seri',
      hint: 'Daha sık yapmak istediğin şeyler. İşaretlediğin her gün sayılır.',
    },
    quit: {
      label: 'Bırak',
      group: 'Bırakılacaklar',
      streak: 'temiz gün',
      hint: 'Daha az yapmak istediğin şeyler. Temiz kaldığın günler seriyi büyütür.',
    },
    scale: {
      label: 'Puanla',
      group: 'Nasıl hissediyorsun',
      streak: 'bu haftaki ort.',
      hint: '1–5 arası puanladığın günlük not. Bir ay böylece bir şekil kazanır.',
    },
  },

  day: {
    today: 'Bugün',
    yesterday: 'Dün',
    yesterdayShort: 'Dün',
  },

  level: {
    1: 'Kötü',
    2: 'Düşük',
    3: 'İdare eder',
    4: 'İyi',
    5: 'Harika',
  },

  today: {
    loadingHabits: 'Alışkanlıklar yükleniyor…',
    emptyTitle: 'Henüz bir kayıt yok',
    emptyDescription: 'Başlamak için birini seç — sonra adını değiştirebilir ya da silebilirsin.',
    thisDay: 'Bu gün',
    addNote: 'Not ekle',
    howWasIt: 'Nasıldı?',
    todayLabel: 'bugün',
    suggestionCode: 'Kod yaz',
    suggestionScroll: 'Gece geç saatte telefon',
    suggestionFeel: 'Nasıl hissediyorum',
  },

  week: {
    previous: 'Önceki hafta',
    next: 'Sonraki hafta',
    notesThisWeek: 'Bu haftanın notları',
    noData: 'Bu hafta için veri yok.',
    review: '{planned} günün {completed} tanesi · %{percent}',
    strongest: 'en güçlüsü {name}',
  },

  year: {
    previous: 'Önceki yıl',
    next: 'Sonraki yıl',
    thatDay: 'O gün',
    hasNote: 'notu var — okumak için dokun',
    noteLegend: 'Not bırakılan günler — okumak için dokun',
    less: 'Az',
    more: 'Çok',
  },

  habit: {
    new: 'Yeni alışkanlık',
    newSubtitle: 'Bir ad ver, nasıl takip edileceğini seç, bu kadar.',
    edit: 'Alışkanlığı düzenle',
    name: 'Ad',
    namePlaceholder: 'Kod yaz',
    mode: 'Mod',
    modeLocked: 'Takip modu değiştirilemez — geçmişinin anlamını baştan yazardı.',
    weeklyTarget: 'Haftalık hedef',
    weeklyTargetHint:
      'Haftada kaç gün yaparsan başarı sayılır. Yediden düşük seçersen Hibi alışkanlığı bugüne göre değil haftaya göre değerlendirir — boş geçen bir salı artık başarısızlık gibi görünmez, ve tutabildiğin dört gün bıraktığın yediden iyidir.',
    create: 'Alışkanlık oluştur',
    saveChanges: 'Değişiklikleri kaydet',
    archiveHabit: 'Alışkanlığı arşivle',
    archiveSection: 'Arşiv',
    deleteTitle: 'Alışkanlığı sil',
    deleteWithCount: '{name} ve ona ait {count} kayıt silinsin mi?',
    deleteWithOne: '{name} ve ona ait tek kayıt silinsin mi?',
    deleteWithNone: '{name} silinsin mi? Henüz hiç kaydı yok.',
    deleteUnknown: '{name} ve tüm geçmişi silinsin mi?',
    deleteWarning: 'Bu işlem geri alınamaz.',
    loadingHabit: 'Alışkanlık yükleniyor…',
    missing: 'Bu alışkanlık artık mevcut değil.',
    notes: 'Notlar',
    activity: 'Etkinlik',
    since: '{date} tarihinden beri takipte',
    noNotesTitle: 'Henüz bir şey yazılmamış',
    noNotes: 'Henüz not yok. Bu alışkanlığı işaretlerken bir not bırakabilirsin.',
  },

  entry: {
    markedDay: '{name} bu gün için işaretli. Notu düzenleyebilir ya da işareti kaldırabilirsin.',
    removeMark: 'İşareti kaldır',
    removeEntry: 'Kaydı kaldır',
    notePrompt: 'Bugün {name} hakkında hatırlanacak bir şey var mı?',
    optional: 'İsteğe bağlı',
    saveNote: 'Notu kaydet',
    standOut: 'Bu günü farklı kılan neydi?',
    feelToday: 'Bugün neden böyle hissettiriyor?',
    checkInTitle: 'Bugün {name} nasıl?',
    checkInHint: 'Bir seviye seç, sonra nedenini bir cümleyle yaz.',
    completed: '{total} görevin {done} tanesi tamam',
    levelLabel: '{value} — {label}',
  },

  note: {
    label: 'Not',
    placeholder: 'Bugün ne oldu?',
  },

  streak: {
    startToday: 'Bugün başla',
    toYourBest: 'Rekoruna {count} kaldı',
    dontBreak: 'Sakın bozma',
  },

  stats: {
    thisWeek: 'bu hafta {done}/{target}',
    weekDone: 'Bu hafta tamam',
    weekLeft: '{count} gün kaldı',
    weeksOnTarget: 'hedefi tutan hafta',
    avgThisWeek: 'bu haftaki ort.',
    avgLastWeek: 'geçen haftaki ort.',
    daysTracked: 'takip edilen gün',
    bestRun: 'en uzun seri',
    last30: 'son 30 gün',
    noData: 'Henüz veri yok',
    avgSummary: 'bu hafta ort. {value}',
    streakSummary: '{count} {label}',
  },

  profile: {
    title: 'Profil',
    signOut: 'Çıkış yap',
    notSignedIn: 'giriş yapılmadı',
    trackingSince: '{date} tarihinden beri takipte',
    activeHabits: 'aktif alışkanlık',
    archived: 'arşivlenmiş',
    account: 'Hesap',
    yourHabits: 'Alışkanlıkların',
    displayName: 'Görünen ad',
    displayNamePlaceholder: 'Adın',
    displayNameHint: 'Şimdilik yalnızca sana görünüyor.',
  },

  settings: {
    title: 'Ayarlar',
    appearance: 'Görünüm',
    theme: 'Tema',
    themeSystem: 'Sistem',
    themeLight: 'Açık',
    themeDark: 'Koyu',
    calendar: 'Takvim',
    weekStart: 'Hafta başlangıcı',
    monday: 'Pazartesi',
    sunday: 'Pazar',
    language: 'Dil',
    languageSystem: 'Sistem',
    languageHint: 'Tarihler ve sayılar seçtiğin dile göre biçimlenir.',
    help: 'Yardım',
    guide: 'Uygulama rehberi',
    guideHint:
      'Alışkanlıkların neden işe yaradığı ve Hibi’nin bunu nasıl takip ettiği — doksan saniye.',
    replayGuide: 'Tekrar izle',
    data: 'Verilerin',
    export: 'Her şeyi JSON olarak dışa aktar',
    exportHint: 'Tüm alışkanlık, kayıt ve notları içeren tek bir JSON dosyası.',
    deleteData: 'Verilerimi sil',
    deleteDataTitle: 'Verilerini sil',
    deleteDataBody:
      'Bu işlem tüm alışkanlıkları, kayıtları ve notları siler. Hesabın kalır, sıfırdan başlayabilirsin. Geri alınamaz.',
    typeEmail: 'Onaylamak için e-postanı yaz',
  },

  auth: {
    welcomeBack: 'Tekrar hoş geldin',
    pickUp: 'Kaldığın yerden devam et.',
    startTracking: 'Takibe başla',
    startTrackingHint: 'Kazan, bırak ve nasıl hissettiğini fark et.',
    google: 'Google ile devam et',
    or: 'veya',
    email: 'E-posta',
    emailPlaceholder: "sen{'@'}ornek.com",
    password: 'Parola',
    confirmPassword: 'Parolayı doğrula',
    passwordHint: 'En az 8 karakter',
    rememberMe: 'Bu cihazda oturumum açık kalsın',
    signIn: 'Giriş yap',
    signingIn: 'Giriş yapılıyor...',
    noAccount: 'Hesabın yok mu?',
    createOne: 'Hemen oluştur',
    createAccount: 'Hesap oluştur',
    creatingAccount: 'Hesap oluşturuluyor...',
    alreadyHave: 'Zaten hesabın var mı?',
    checkInbox: 'Gelen kutunu kontrol et — {email} adresine bir onay bağlantısı gönderdik.',
  },

  authError: {
    invalid_credentials: 'E-posta veya parola hatalı.',
    email_not_confirmed: 'Lütfen önce e-posta adresini onayla, sonra giriş yap.',
    user_already_exists: 'Bu e-posta ile bir hesap zaten var.',
    email_exists: 'Bu e-posta ile bir hesap zaten var.',
    weak_password: 'Lütfen daha güçlü bir parola seç.',
    over_request_rate_limit: 'Çok fazla deneme. Biraz bekleyip tekrar dene.',
    over_email_send_rate_limit: 'Çok fazla deneme. Biraz bekleyip tekrar dene.',
    signup_disabled: 'Yeni kayıtlar şu anda kapalı.',
    user_banned: 'Bu hesap askıya alınmış.',
    generic: 'Bir şeyler ters gitti. Lütfen tekrar dene.',
  },

  validation: {
    nameRequired: 'Ad zorunlu.',
    nameMax: 'Ad en fazla 40 karakter olabilir.',
    emailInvalid: 'Geçerli bir e-posta adresi gir.',
    passwordMin: 'Parola en az 8 karakter olmalı.',
    passwordsMismatch: 'Parolalar eşleşmiyor!',
  },

  offline: 'Çevrimdışısın — değişiklikler kaydedilmeyecek.',

  install: {
    title: "Hibi'yi ana ekranına ekle",
    body: 'Adres çubuğu olmadan açılır ve sekme kapalıyken de hatırlatmalar gelmeye devam eder.',
    action: 'Yükle',
    later: 'Şimdi değil',
    iosTitle: "Hibi'yi ana ekrana ekle",
    iosBody:
      "Safari'de Paylaş butonuna dokun, sonra Ana Ekrana Ekle'yi seç. Bildirimler ancak Hibi'yi oradan açtığında çalışır.",
    settingsRow: 'Uygulamayı yükle',
    installed: 'Hibi bu cihazda kurulu.',
  },

  notify: {
    section: 'Hatırlatmalar',
    sectionHint: 'Günde iki tane. Biri günü açar, biri kapatır.',
    toggle: 'Günlük hatırlatmalar',
    schedule: 'Sabah 08:00 · Akşam 21:00',
    background: 'Uygulama kapalıyken de gelir.',
    foregroundOnly: 'Şimdilik yalnızca Hibi açıkken gelir.',
    enable: 'Hatırlatmaları aç',
    enabled: 'Hatırlatmalar açık',
    test: 'Deneme gönder',
    denied: 'Tarayıcın Hibi için bildirimleri engelliyor.',
    deniedHelp: 'Adres çubuğundaki kilide dokun, bildirimlere izin ver, buraya dön.',
    unsupported: 'Bu tarayıcı bildirim gösteremiyor.',
    iosTitle: "iPhone'da önce bir adım",
    iosBody:
      "Safari, bildirimlere ancak Hibi ana ekrandayken izin veriyor. Paylaş butonuna dokun, Ana Ekrana Ekle'yi seç ve Hibi'yi oradan aç.",

    nudgeTitle: 'Hibi hatırlatsın mı?',
    nudgeBody: 'Günde iki bildirim: sabah ne var, akşam ne kaldı. Fazlası yok.',
    nudgeAction: 'İzin ver',
    nudgeLater: 'Şimdi değil',

    morningTitle1: 'Yeni bir kare',
    morningTitle2: 'Günü sen yazıyorsun',
    morningTitle3: 'Seri devam ediyor',
    morningBuild: '{count} yapılacak',
    morningQuit: '{count} bırakılacak',
    morningNone: 'Henüz alışkanlık yok. Bir tane yeter.',
    morningPush1: 'En kolayından başla.',
    morningPush2: 'Küçük olsun, ama olsun.',
    morningPush3: 'Zaman bulunmaz, ayrılır.',

    eveningTitle1: 'Gün kapanmadan',
    eveningTitle2: 'Son bir bakış',
    eveningTitle3: 'Bugün nasıldı?',
    eveningLeft: 'Geriye {count} kaldı.',
    eveningAllDone: 'Hepsi tamam.',
    eveningNone: 'Bugün hiçbirini işaretlemedin.',
    eveningPushLeft1: 'Beş dakikan var mı?',
    eveningPushLeft2: 'En küçüğünü yap, gün sayılsın.',
    eveningPushLeft3: 'Bir tanesi bile boş kareden iyi.',
    eveningPushDone1: 'İyi bir gün böyle görünür.',
    eveningPushDone2: 'Seri sende. İyi geceler.',
    eveningPushDone3: 'Bugün hiçbir şey eksik kalmadı.',
    eveningPushNone1: 'Bir gün önemli değil. İki gün olmaya başlar.',
    eveningPushNone2: 'Hâlâ vakit var.',
    eveningPushNone3: 'Sıfır olmasın, yarın kolaylaşır.',

    testTitle: 'Hatırlatmalar böyle görünür',
    testBody: 'Kısa, sessiz, günde en fazla iki kez.',
  },

  pwa: {
    updateTitle: 'Yeni sürüm hazır',
    updateBody: 'Uygun bir yerde durduğunda yeniden yükle.',
    reload: 'Yeniden yükle',
    later: 'Sonra',
    offlineReady: 'Hibi artık çevrimdışı çalışabilir.',
  },

  notFound: {
    title: 'Burada bir şey yok',
    description: 'Bu sayfa mevcut değil ya da taşınmış.',
    action: "Bugün'e dön",
  },

  onboarding: {
    skip: 'Geç',
    next: 'İleri',
    start: 'Bir tane ile başla',
    progress: '{current} / {total}',
    discover: 'Uygulamayı tanı',
    discoverHint: 'Doksan saniye — bunun neden işe yaradığı ve renklerin anlamı.',

    coverTitle: 'ひび, “günler” demek',
    coverBody:
      'Hedef değil, sistem değil, verimlilik hiç değil. Günler — arka arkaya, her biri ya doldurduğun ya doldurmadığın küçük bir kare. Doksan saniye ver; bunun neden yettiğini göstereceğiz.',

    habitualValue: '%43',
    habitualLabel: 'günlük davranış, otomatik pilotta',
    habitualTitle: 'Zaten alışkanlıklarla yaşıyorsun',
    habitualBody:
      'Sıradan hayatı izleyen bir günlük çalışması, insanların yaptıklarının yaklaşık %43’ünün neredeyse her gün, aynı yerde ve karar verilmeden gerçekleştiğini buldu. Alışkanlıkla yaşayıp yaşamayacağını hiç seçmedin. Yalnızca hangileriyle yaşayacağını seçiyorsun.',
    habitualSource: 'Wood, Quinn & Kashy (2002), Journal of Personality and Social Psychology',

    sixtysixValue: '66',
    sixtysixLabel: 'günde otomatikleşiyor, medyan',
    sixtysixRange: 'ama aralık 18 ile 254 gün arasıydı',
    sixtysixTitle: '21 gün efsanesi',
    sixtysixBody:
      'University College London’daki araştırmacılar tek bir yeni alışkanlık edinen insanları izledi ve o davranışın ne zaman çaba istemez hâle geldiğini ölçtü. Medyan 66 gündü ve dağılım muazzamdı. Seninki yavaş ilerliyorsa başarısız olmuyorsun — aralığın içindesin.',
    sixtysixSource:
      'Lally, van Jaarsveld, Potts & Wardle (2010), European Journal of Social Psychology',

    missTitle: 'Bir günü kaçırmak neredeyse hiçbir şeye mal olmuyor',
    missBody:
      'Aynı çalışma bir günün atlandığı durumları da inceledi: tek bir kaçırılmış fırsatın alışkanlığın oluşumu üzerinde ölçülebilir bir etkisi olmadı. Bir seriyi bitiren şey nadiren boşluktur; o boşluğa anlam yüklemektir. Hibi onu renk dolu bir duvardaki tek soluk kare olarak çizer — tam olarak hak ettiği kadar önemli.',
    missSource:
      'Lally ve ark. (2010) — tek bir kaçırılmış fırsat alışkanlık oluşumunu kayda değer biçimde etkilemedi',

    compoundUp: '37,8×',
    compoundDown: '0,03×',
    compoundTitle: 'Asıl mesele o sıkıcı gün',
    compoundBody:
      'Bir yıl boyunca her gün yüzde bir iyileş, sonunda otuz yedi kat iyi olursun. Her gün yüzde bir geri kay, sonunda sıfıra yakınsın. Hiçbir tek günde dramatik bir şey olmuyor — bir takip aracının motivasyonu yenmesinin sebebi tam olarak bu.',
    compoundNote: 'Bir çalışma değil, aritmetik: 1,01³⁶⁵ ≈ 37,8 ve 0,99³⁶⁵ ≈ 0,03.',

    tapHint: 'Ne anlama geldiğini görmek için birine dokun',
    modesTitle: 'Bir günü işaretlemenin üç yolu',
    modesBody:
      'Her alışkanlık üç moddan biridir ve mod, dolu bir karenin ne anlama geldiğini belirler. Renk uygulamanın her yerinde aynı kalır; böylece tek kelime okumadan bütün bir ekranı okuyabilirsin. Birine dokun.',

    cueTrigger: 'Kahvemden sonra',
    cueAction: '20 sayfa oku',
    cueTitle: 'Hedefi değil, anı adlandır',
    cueBody:
      '94 çalışma boyunca, ne zaman ve nerede harekete geçeceğine önceden karar verenlerin sözünü tutma olasılığı belirgin biçimde daha yüksekti — davranış biliminin en güvenilir bulgularından biri. O yüzden adı “Daha çok oku” değil, “Kahveden sonra oku” olsun. Hatırlamayı ipucuna bırak.',
    cueSource:
      'Gollwitzer & Sheeran (2006), Advances in Experimental Social Psychology — 94 çalışma, orta-büyük etki',

    recordNoteDate: '12 Mart',
    recordNoteBody:
      'Spor salonunu atladım, onun yerine yazdım. Meğer sabahlardan nefret etmiyormuşum, aceleye getirmekten nefret ediyormuşum.',
    recordTitle: 'Kaydın kendisi müdahaledir',
    recordBody:
      '138 çalışmanın meta-analizi, bir hedefe doğru ilerlemeyi takip etmenin o hedefe ulaşma olasılığını artırdığını buldu — ve ilerleme fiilen kaydedildiğinde etki daha büyüktü. Günü işaretlemek, işten sonra yaptığın angarya değil. İşin bir parçası.',
    recordSource: 'Harkin ve ark. (2016), Psychological Bulletin — 138 çalışma',

    yearTitle: 'Sonra bir gün geriye kaydırıyorsun',
    yearBody:
      'Doldurduğun her kare, henüz göremediğin bir resmin tek pikseli. Bir ay sonra gürültü gibi duruyor. Bir yıl sonra kanıt gibi — ve gerçekten durup bakacağın günler, not bıraktıkların olacak.',

    startTitle: 'Bir tane ile başla',
    startBody:
      'Beş değil. Kötü bir günün durduramayacağı kadar küçük, tek bir tane. İlkinin korumaya değer bir çizgisi oluştuğunda ikincisini eklemek çok daha kolay.',
  },
}

export default tr
