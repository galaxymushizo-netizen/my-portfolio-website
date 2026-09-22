import { bi } from "@/lib/types";
import type { Bilingual } from "@/lib/types";

export const DEFAULT_SYMBOLS = "⌁ ◉ ⟁ ☍ ✦ ⌘ ⊹";

export const DEFAULT_SETTINGS = {
  siteTitle: "Galaxy — Builder in Public",
  siteDescription: bi(
    "A young technology builder, student and experimenter. Projects, thoughts and a life still being assembled.",
    "Mjenzi wa teknolojia, mwanafunzi na mjaribuji. Miradi, mawazo na maisha bado yanaundwa.",
  ),
  heroKicker: bi("Galaxy · builder, student, experimenter", "Galaxy · mjenzi, mwanafunzi, mjaribuji"),
  heroTitle: bi(
    "I am still becoming.",
    "Bado ninaendelea kuwa.",
  ),
  heroSubtitle: bi(
    "I build small things, break them, learn why they broke, and build again. This is my notebook, my workshop and my open letter to the internet.",
    "Mimi hujenga vitu vidogo, navunja, najifunza kwa nini vilivunjika, kisha najenga tena. Hapa ni daftari langu, karakana yangu na barua yangu ya wazi kwa intaneti.",
  ),
  landingQuestion: bi("What do I do?", "Mimi hufanya nini?"),
  landingHint: bi(
    "Choose a door. Each one leads somewhere different.",
    "Chagua mlango. Kila mmoja unaongoza mahali tofauti.",
  ),
  pathWork: bi("Explore my work", "Tazama kazi zangu"),
  pathWorkHint: bi("Projects, experiments, things I shipped and things I abandoned.", "Miradi, majaribio, nilivyomaliza na nilivyoacha."),
  pathMe: bi("Know me", "Nifahamu"),
  pathMeHint: bi("The person behind the code, and why any of this matters.", "Mtu aliye nyuma ya kodi, na kwa nini haya yote yana maana."),
  pathConnect: bi("Connect with me", "Wasiliana nami"),
  pathConnectHint: bi("Say hello, ask a question, or start something together.", "Sema habari, uliza swali, au tuanze kitu pamoja."),
  philosophy: bi(
    "You don't have to be great to start, but you need to start to be great.",
    "Huhitaji kuwa mkubwa ili kuanza, lakini unahitaji kuanza ili uwe mkubwa.",
  ),
  symbols: DEFAULT_SYMBOLS,
  metaImage: null as string | null,
};

export const DEFAULT_PROFILE = {
  name: "Galaxy",
  tagline: bi("Young technology builder & student", "Mjenzi wa teknolojia na mwanafunzi"),
  shortBio: bi(
    "I build things on the internet while still learning how the internet works.",
    "Mimi hujenga vitu kwenye intaneti huku bado nikijifunza jinsi intaneti inavyofanya kazi.",
  ),
  bio: bi(
    "I am Galaxy. I am a student, and I am someone who cannot stop building things.\n\nI did not start with a plan. I started with curiosity and a slow laptop. The first programs I wrote barely worked, and I was unreasonably proud of them. That pride is the whole engine: build something small, watch it move, want to build something bigger.\n\nSince then I have built tools for schools, small utilities for everyday problems, and educational experiments for children who are learning English. None of them are perfect. All of them taught me something I could not have learned by reading alone.\n\nI am also drawn to the quieter questions. Why do people trust some software and abandon other software? What makes an interface feel honest? What does it do to a young mind to grow up surrounded by machines that seem to think? Technology, philosophy and psychology are not three separate interests to me — they are three angles on the same thing: how humans and the systems they build shape each other.\n\nI am not finished. This website is not a monument, it is a workshop with the lights on.",
    "Mimi ni Galaxy. Mimi ni mwanafunzi, na mimi ni mtu ambaye hawezi kuacha kujenga vitu.\n\nSikuanza na mpango. Nilianza na udadisi na kompyuta ndogo ya polepole. Programu za kwanza nilizoandika zilifanya kazi kwa shida, na nilijivunia sana. Kiburi hicho ndicho injini nzima: jenga kitu kidogo, kione kikisogea, utake kujenga kitu kikubwa zaidi.\n\nTangu wakati huo nimejenga zana za shule, huduma ndogo kwa matatizo ya kila siku, na majaribio ya elimu kwa watoto wanaojifunza Kiingereza. Hakuna kamilifu. Yote yalinifundisha kitu ambacho nisingejifunza kwa kusoma peke yangu.\n\nPia navutiwa na maswali ya utulivu zaidi. Kwa nini watu huamini programu fulani na kuacha nyingine? Ni nini hufanya kiolesura kionekane cha ukweli? Inafanya nini kwa akili ya kijana kukua akiwa amezungukwa na mashine zinazoonekana kufikiri? Teknolojia, falsafa na saikolojia si mambo matatu tofauti kwangu — ni pembe tatu za kitu kimoja: jinsi binadamu na mifumo wanayojenga wanavyoundana.\n\nSijamaliza. Tovuti hii si mnara wa ukumbusho, ni karakana iliyo na taa zimewashwa.",
  ),
  photoUrl: null as string | null,
  learning: bi(
    "• How databases actually behave under real load, not just in tutorials\n• Designing interfaces that feel calm instead of loud\n• The psychology of habit — why people return to some tools and forget others\n• Writing clearly, in English and in Swahili",
    "• Jinsi hifadhidata zinavyofanya kazi chini ya mzigo halisi, si katika mafunzo tu\n• Kubuni violesura vinavyohisi utulivu badala ya kelele\n• Saikolojia ya mazoea — kwa nini watu hurudi kwenye zana fulani na kusahau nyingine\n• Kuandika kwa uwazi, kwa Kiingereza na Kiswahili",
  ),
  building: bi(
    "• Kadilink — one clean page that holds everything that matters\n• Small tools for schools: results entry and nursery management\n• Safari Stars — helping children learn English through play\n• This website, which I rebuild a little every month",
    "• Kadilink — ukurasa mmoja safi unaoshikilia kila kitu muhimu\n• Zana ndogo za shule: kuingiza matokeo na usimamizi wa shule ya awali\n• Safari Stars — kuwasaidia watoto kujifunza Kiingereza kupitia mchezo\n• Tovuti hii, ambayo naijenga upya kidogo kila mwezi",
  ),
  goals: bi(
    "• Ship work that a real person uses every single week\n• Understand people as well as I understand code\n• Write in public, even when the thought is unfinished",
    "• Kutoa kazi ambayo mtu halisi huitumia kila wiki\n• Kuelewa watu vizuri kama ninavyoelewa kodi\n• Kuandika hadharani, hata wazo linapokuwa halijakamilika",
  ),
  location: bi("Tanzania · East Africa", "Tanzania · Afrika Mashariki"),
  email: "galaxymushizo@gmail.com",
  whatsapp: "+255699279126",
  resumeUrl: null as string | null,
};

type SeedProject = {
  slug: string;
  name: string;
  shortDescription: Bilingual;
  fullDescription: Bilingual;
  status: string;
  category: string;
  technologies: string[];
  featured: boolean;
  projectDate: string;
  githubUrl: string | null;
  liveUrl: string | null;
};

export const DEFAULT_PROJECTS: SeedProject[] = [
  {
    slug: "kadilink",
    name: "Kadilink",
    shortDescription: bi(
      "One clean page that holds everything that matters about you.",
      "Ukurasa mmoja safi unaoshikilia kila kitu muhimu kukuhusu.",
    ),
    fullDescription: bi(
      "Kadilink is my attempt at a simple idea: a person should be able to share who they are with a single link.\n\nI started it because I kept sending people five different links to explain one thing. While building it I have been learning how to model data properly, how to keep an interface fast on a slow phone, and how to say no to features that only look impressive.\n\nIt is still growing. I would rather ship something honest and keep improving it than wait for a perfect version that never arrives.",
      "Kadilink ni jaribio langu la wazo rahisi: mtu aweze kushirikisha yeye ni nani kwa kiungo kimoja.\n\nNilianza kwa sababu nilikuwa ninatuma watu viungo vitano tofauti kueleza kitu kimoja. Ninapoijenga nimekuwa nikijifunza jinsi ya kupanga data vizuri, jinsi ya kuweka kiolesura haraka kwenye simu ya polepole, na jinsi ya kukataa vipengele vinavyoonekana vya kuvutia tu.\n\nBado inakua. Napendelea kutoa kitu cha ukweli na kuendelea kuboresha kuliko kungojea toleo kamilifu ambalo haliji.",
    ),
    status: "in-progress",
    category: "web",
    technologies: ["Next.js", "PostgreSQL", "TypeScript", "Tailwind CSS"],
    featured: true,
    projectDate: "2025",
    githubUrl: null,
    liveUrl: null,
  },
  {
    slug: "bluetooth-finder",
    name: "Bluetooth Finder",
    shortDescription: bi(
      "A small utility experiment for tracking down nearby Bluetooth devices.",
      "Jaribio dogo la zana ya kutafuta vifaa vya Bluetooth vilivyo karibu.",
    ),
    fullDescription: bi(
      "Bluetooth Finder began as an annoyance: losing things that are technically nearby but practically invisible.\n\nThe project is my playground for understanding signal strength, device discovery and the messy reality of hardware that behaves differently on every phone. It is a utility, but really it is a lesson in patience.",
      "Bluetooth Finder ilianza kama kero: kupoteza vitu ambavyo kimsingi vipo karibu lakini havionekani.\n\nMradi huu ni uwanja wangu wa kuelewa nguvu ya mawimbi, ugunduzi wa vifaa na uhalisia mchafu wa maunzi yanayofanya kazi tofauti kwenye kila simu. Ni zana, lakini kwa kweli ni somo la uvumilivu.",
    ),
    status: "in-progress",
    category: "tool",
    technologies: ["Bluetooth", "Mobile", "Experiment"],
    featured: false,
    projectDate: "2025",
    githubUrl: null,
    liveUrl: null,
  },
  {
    slug: "safari-stars",
    name: "Safari Stars",
    shortDescription: bi(
      "An educational project that helps children learn English through play.",
      "Mradi wa elimu unaowasaidia watoto kujifunza Kiingereza kupitia mchezo.",
    ),
    fullDescription: bi(
      "Safari Stars is built for children who are meeting English for the first time.\n\nThe design rule is simple: every screen should be understandable without reading. Words, images and rewards have to agree with each other, because a confused child closes the app and never returns.\n\nThis project taught me more about design than any tutorial. When your user is six years old, clarity is not a nice-to-have — it is the entire product.",
      "Safari Stars imejengwa kwa watoto wanaokutana na Kiingereza kwa mara ya kwanza.\n\nKanuni ya usanifu ni rahisi: kila skrini ieleweke bila kusoma. Maneno, picha na zawadi lazima zikubaliane, kwa sababu mtoto aliyechanganyikiwa hufunga programu na harudi tena.\n\nMradi huu ulinifundisha zaidi kuhusu usanifu kuliko mafunzo yoyote. Mtumiaji wako anapokuwa na miaka sita, uwazi si jambo la hiari — ndio bidhaa nzima.",
    ),
    status: "in-progress",
    category: "education",
    technologies: ["Education", "Design", "Web"],
    featured: false,
    projectDate: "2025",
    githubUrl: null,
    liveUrl: null,
  },
  {
    slug: "results-entry-system",
    name: "Results Entry System",
    shortDescription: bi(
      "A system for entering and managing student results without the paperwork.",
      "Mfumo wa kuingiza na kusimamia matokeo ya wanafunzi bila makaratasi.",
    ),
    fullDescription: bi(
      "Teachers were recording results in books and then retyping them later. I wanted to remove the second step.\n\nBuilding this forced me to think about the boring parts that actually matter: validation, who is allowed to change what, and what happens when the network drops in the middle of saving.\n\nIt is quiet, unglamorous software. It is also the kind of software that gives someone their evening back.",
      "Walimu walikuwa wakirekodi matokeo kwenye vitabu kisha kuyaandika upya baadaye. Nilitaka kuondoa hatua ya pili.\n\nKuijenga kulilazimisha nifikirie sehemu za kuchosha ambazo kwa kweli ni muhimu: uthibitishaji, nani anaruhusiwa kubadilisha nini, na nini hutokea mtandao unapokatika wakati wa kuhifadhi.\n\nNi programu tulivu, isiyo ya kuvutia. Pia ni aina ya programu inayomrudishia mtu jioni yake.",
    ),
    status: "live",
    category: "system",
    technologies: ["PostgreSQL", "Next.js", "Forms", "Reporting"],
    featured: false,
    projectDate: "2024",
    githubUrl: null,
    liveUrl: null,
  },
  {
    slug: "nursery-management",
    name: "Nursery Management",
    shortDescription: bi(
      "A management system for nursery and early-childhood schools.",
      "Mfumo wa usimamizi wa shule za awali na elimu ya utotoni.",
    ),
    fullDescription: bi(
      "A nursery school runs on a hundred small records: attendance, fees, guardians, notes home. Most of it lives on paper.\n\nThis system is my attempt at putting those records somewhere they can be found, without making the software so heavy that nobody uses it.\n\nThe hardest problem was not technical. It was deciding what to leave out.",
      "Shule ya awali inaendeshwa na rekodi ndogo mia moja: mahudhurio, ada, walezi, barua za nyumbani. Mengi yake yapo kwenye karatasi.\n\nMfumo huu ni jaribio langu la kuweka rekodi hizo mahali zinapoweza kupatikana, bila kufanya programu kuwa nzito kiasi kwamba hakuna anayeitumia.\n\nTatizo gumu zaidi halikuwa la kiufundi. Lilikuwa kuamua ni nini cha kuacha.",
    ),
    status: "in-progress",
    category: "system",
    technologies: ["PostgreSQL", "Next.js", "Admin Tools"],
    featured: false,
    projectDate: "2025",
    githubUrl: null,
    liveUrl: null,
  },
  {
    slug: "flow-money-tracker",
    name: "Flow Money Tracker",
    shortDescription: bi(
      "A personal finance and productivity tracker built around one question: where did it go?",
      "Kifuatiliaji cha fedha na tija kilichojengwa karibu na swali moja: kilikwenda wapi?",
    ),
    fullDescription: bi(
      "Flow started because I could never explain where my month went.\n\nIt is deliberately small: record, review, adjust. No charts that look like a spaceship dashboard. The interesting part is behavioural — the tool only works if recording takes less effort than forgetting.\n\nI use it myself, which means I find its bugs faster than I would like.",
      "Flow ilianza kwa sababu sikuweza kueleza mwezi wangu ulikwenda wapi.\n\nNi dogo kwa makusudi: rekodi, pitia, rekebisha. Hakuna chati zinazoonekana kama dashibodi ya chombo cha anga. Sehemu ya kuvutia ni kitabia — zana inafanya kazi tu ikiwa kurekodi kunachukua juhudi ndogo kuliko kusahau.\n\nNaitumia mwenyewe, ambayo inamaanisha napata hitilafu zake haraka kuliko ningependa.",
    ),
    status: "in-progress",
    category: "productivity",
    technologies: ["Next.js", "PostgreSQL", "Habits"],
    featured: false,
    projectDate: "2025",
    githubUrl: null,
    liveUrl: null,
  },
];

export const DEFAULT_TIMELINE = [
  {
    year: "01",
    title: bi("The beginning", "Mwanzo"),
    body: bi(
      "A curious student with limited resources and too many questions. I did not know what a stack was. I knew that a machine had done exactly what I told it to, and that felt like magic.",
      "Mwanafunzi mwenye udadisi, rasilimali chache na maswali mengi mno. Sikujua stack ni nini. Nilijua tu kwamba mashine ilifanya kile nilichoiambia, na hilo lilihisi kama uchawi.",
    ),
  },
  {
    year: "02",
    title: bi("First broken things", "Vitu vya kwanza vilivyovunjika"),
    body: bi(
      "My first real programs barely worked. Broken layouts, errors I could not read, code that I was proud of and would delete a year later. This is where I learned that confusion is a normal part of the process.",
      "Programu zangu za kwanza za kweli zilifanya kazi kwa shida. Miundo iliyovunjika, hitilafu nisizoweza kusoma, kodi niliyoijivunia na kuifuta mwaka mmoja baadaye. Hapa ndipo nilijifunza kwamba mkanganyiko ni sehemu ya kawaida ya mchakato.",
    ),
  },
  {
    year: "03",
    title: bi("Building for real people", "Kujenga kwa watu halisi"),
    body: bi(
      "Schools needed help with records and results. I built systems for entering and managing student information. Suddenly the code had consequences: a teacher's evening, a child's report card.",
      "Shule zilihitaji msaada na rekodi na matokeo. Nilijenga mifumo ya kuingiza na kusimamia taarifa za wanafunzi. Ghafla kodi ilikuwa na matokeo: jioni ya mwalimu, ripoti ya mtoto.",
    ),
  },
  {
    year: "04",
    title: bi("Teaching children", "Kuwafundisha watoto"),
    body: bi(
      "Safari Stars pushed me to make English learning playful for children. Designing for a six-year-old exposes every lazy decision you have ever made.",
      "Safari Stars ilinisukuma kufanya kujifunza Kiingereza kuwa mchezo kwa watoto. Kubuni kwa mtoto wa miaka sita hufichua kila uamuzi wa uvivu uliowahi kufanya.",
    ),
  },
  {
    year: "05",
    title: bi("Questions beyond code", "Maswali zaidi ya kodi"),
    body: bi(
      "I started reading philosophy and psychology seriously. Why do people trust some systems? What makes technology feel human — or inhuman? The questions changed how I build.",
      "Nilianza kusoma falsafa na saikolojia kwa uzito. Kwa nini watu huamini mifumo fulani? Ni nini hufanya teknolojia ihisike kibinadamu — au isiyo ya kibinadamu? Maswali yalibadilisha jinsi ninavyojenga.",
    ),
  },
  {
    year: "06",
    title: bi("Building in public", "Kujenga hadharani"),
    body: bi(
      "This website is the current chapter. Not a monument, a workshop with the lights on. I show work that is finished and work that is still becoming.",
      "Tovuti hii ni sura ya sasa. Si mnara wa ukumbusho, ni karakana iliyo na taa zimewashwa. Naonyesha kazi iliyokamilika na kazi ambayo bado inaundwa.",
    ),
  },
  {
    year: "→",
    title: bi("Still becoming", "Bado ninaendelea kuwa"),
    body: bi(
      "I have not mastered anything yet. What I have is a habit: start, build, learn, improve, repeat. That habit is the only thing I would call an achievement.",
      "Sijabobea kitu chochote bado. Nilicho nacho ni mazoea: anza, jenga, jifunza, boresha, rudia. Mazoea hayo ndio kitu pekee nitakachoita mafanikio.",
    ),
  },
];

export const DEFAULT_SKILLS = [
  { name: "Next.js", category: "craft", level: 72 },
  { name: "TypeScript", category: "craft", level: 68 },
  { name: "PostgreSQL", category: "craft", level: 60 },
  { name: "Tailwind CSS", category: "craft", level: 80 },
  { name: "Interface design", category: "craft", level: 70 },
  { name: "Systems thinking", category: "thinking", level: 65 },
  { name: "Writing", category: "thinking", level: 62 },
  { name: "Psychology", category: "thinking", level: 48 },
];

export const DEFAULT_LINKS = [
  { label: "GitHub", url: "https://github.com/", kind: "social" },
  { label: "X", url: "https://x.com/", kind: "social" },
  { label: "WhatsApp", url: "https://wa.me/255699279126", kind: "contact" },
  { label: "Email", url: "mailto:galaxymushizo@gmail.com", kind: "contact" },
];

export const DEFAULT_THOUGHTS = [
  {
    slug: "you-dont-have-to-be-great-to-start",
    title: bi(
      "You don't have to be great to start",
      "Huhitaji kuwa mkubwa ili kuanza",
    ),
    excerpt: bi(
      "Starting badly is still starting. The version of you that can build the good thing only exists after the bad one.",
      "Kuanza vibaya bado ni kuanza. Toleo lako linaloweza kujenga kitu kizuri lipo tu baada ya kile kibaya.",
    ),
    content: bi(
      "For a long time I waited until I felt ready.\n\nReady is a moving target. Every project I have finished began as something I did not fully understand. Kadilink started as a link in a notes app. The nursery system started as a spreadsheet someone complained about.\n\nThe pattern I now trust is simple: build the small honest version, put it in front of one real person, and let their confusion be your specification.\n\nYou don't have to be great to start, but you need to start to be great. I have found no way around it.",
      "Kwa muda mrefu nilingoja hadi nijisikie tayari.\n\nTayari ni shabaha inayosogea. Kila mradi niliomaliza ulianza kama kitu ambacho sikukielewa kabisa. Kadilink ilianza kama kiungo kwenye programu ya maelezo. Mfumo wa shule ya awali ulianza kama lahajedwali ambalo mtu alilalamikia.\n\nMuundo ninaouamini sasa ni rahisi: jenga toleo dogo la ukweli, liweke mbele ya mtu mmoja halisi, na mkanganyiko wake uwe ndio vipimo vyako.\n\nHuhitaji kuwa mkubwa ili kuanza, lakini unahitaji kuanza ili uwe mkubwa. Sijapata njia ya kuizunguka.",
    ),
    coverImage: null as string | null,
    category: "growth",
    published: true,
  },
];

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@galaxy.dev";
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "galaxy";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "start-building-2026";
