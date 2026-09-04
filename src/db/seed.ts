import { count, inArray } from "drizzle-orm";
import { db } from "@/db";
import { wrestlingMoves, type NewWrestlingMove } from "@/db/schema";

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`;

/**
 * Seed data — the single source of truth for the move catalog.
 *
 * `npm run db:push` creates the `wrestling_moves` table from
 * `src/db/schema.ts`; the rows below are written by `ensureSeeded()` on the
 * first app request afterwards. That means a fresh deploy (local or Railway)
 * is fully populated without running `node import-moves.mjs` against the API.
 */

/** The original curated hand-picked moves, seeded first (they win on slug clashes). */
const starterMoves: NewWrestlingMove[] = [
  {
    slug: "ddt",
    name: "DDT",
    category: "Power",
    difficulty: "Intermediate",
    imageUrl: px(27968317),
    origin: "Jake 'The Snake' Roberts",
    famousUsers: ["Jake Roberts", "Jon Moxley", "Drew McIntyre"],
    description:
      "A head-and-neck takedown in which the attacker traps the opponent's head under one arm, falls backward, and drives the opponent's forehead into the mat. One of the most versatile and copied moves in wrestling history, it can be hit from almost any position and instantly shifts the momentum of a match. Invented by Jake 'The Snake' Roberts in the 1980s, its meaning is still debated — fans joke it stands for 'Damien's Dinner Time.'",
  },
  {
    slug: "german-suplex",
    name: "German Suplex",
    category: "Power",
    difficulty: "Advanced",
    imageUrl: px(29714442),
    origin: "Karl Gotch",
    famousUsers: ["Kurt Angle", "Brock Lesnar", "Gunther"],
    description:
      "A powerful throw in which the attacker wraps both arms around the opponent's waist from behind and bridges their own back to hurl the opponent overhead onto their shoulders. Known for being chained together in rapid succession for devastating effect. Popularized in North America by Kurt Angle and Brock Lesnar, it remains the gold standard of technical power wrestling.",
  },
  {
    slug: "powerbomb",
    name: "Powerbomb",
    category: "Power",
    difficulty: "Advanced",
    imageUrl: px(29762867),
    origin: "Lou Thesz",
    famousUsers: ["Kevin Nash", "The Undertaker", "Sycho Sid"],
    description:
      "A finishing move in which the attacker hoists the opponent onto their shoulders, then drops them spine-first onto the mat. The sitout variation adds even more impact as the attacker drops into a seated position with the opponent. Famous variations include the Jackknife (Kevin Nash) and the Last Ride (The Undertaker). One of the most explosive crowd-pleasing finishers ever conceived.",
  },
  {
    slug: "tombstone-piledriver",
    name: "Tombstone Piledriver",
    category: "Power",
    difficulty: "Legendary",
    imageUrl: px(27968311),
    origin: "The Undertaker",
    famousUsers: ["The Undertaker", "Kane"],
    description:
      "A kneeling reverse piledriver in which the opponent is held upside down and driven head-first onto the mat. Devastating in appearance, it has finished more WrestleMania main events than almost any other maneuver. Synonymous with The Undertaker's legendary 21-match WrestleMania Streak, it is one of the most protected finishers in wrestling history.",
  },
  {
    slug: "chokeslam",
    name: "Chokeslam",
    category: "Power",
    difficulty: "Advanced",
    imageUrl: px(29762868),
    origin: "The Big Show",
    famousUsers: ["The Big Show", "Kane", "The Undertaker"],
    description:
      "A towering maneuver in which the attacker grabs the opponent by the throat with one hand, hoists them high into the air, and slams them onto their back. Usually reserved for the tallest and most powerful giants in the industry. Kane, The Big Show, and The Undertaker all used it as a signature finishing move throughout their careers.",
  },
  {
    slug: "spear",
    name: "Spear",
    category: "Power",
    difficulty: "Advanced",
    imageUrl: px(30513964),
    origin: "Goldberg",
    famousUsers: ["Goldberg", "Edge", "Roman Reigns", "Charlotte Flair"],
    description:
      "A full-speed takedown in which the attacker charges across the ring and drives their shoulder through the opponent's midsection. Deceptively simple, its impact comes from pure velocity and split-second timing. Used as a finisher by Goldberg, Edge, Roman Reigns, and Charlotte Flair, the Spear has become one of the most iconic tackles in wrestling.",
  },
  {
    slug: "sharpshooter",
    name: "Sharpshooter",
    category: "Submission",
    difficulty: "Advanced",
    imageUrl: px(11392044),
    origin: "Riki Chōshū (Scorpion Deathlock) — Bret Hart",
    famousUsers: ["Bret Hart", "Natalya", "The Rock"],
    description:
      "A leg-lock submission where the attacker steps through the opponent's legs, crosses them, and turns the opponent over while torquing the lower back and knees. Modeled after the Scorpion Deathlock of Japanese legend Riki Chōshū. Bret 'The Hitman' Hart's signature hold became world-famous at WrestleMania 13 during his legendary match with 'Stone Cold' Steve Austin.",
  },
  {
    slug: "figure-four-leglock",
    name: "Figure-Four Leglock",
    category: "Submission",
    difficulty: "Intermediate",
    imageUrl: px(38678683),
    origin: "Buddy Rogers",
    famousUsers: ["Ric Flair", "Charlotte Flair", "AJ Styles", "Greg Valentine"],
    description:
      "A famous leglock that twists the opponent's legs into the shape of the number four while applying pressure to the knee. The opponent can reverse the pressure by rolling onto their stomach. Immortalized by Ric 'The Nature Boy' Flair, who made the 'Woo!' and the leglock synonymous with championship wrestling for over 40 years.",
  },
  {
    slug: "ankle-lock",
    name: "Ankle Lock",
    category: "Submission",
    difficulty: "Intermediate",
    imageUrl: px(6765026),
    origin: "Ken Shamrock",
    famousUsers: ["Kurt Angle", "Ken Shamrock"],
    description:
      "A submission hold that hyper-extends the opponent's ankle, often entered directly or rolled through from a takedown. Kurt Angle's version added a grapevine of the leg and an aggressive 'ankle lock face' that fans loved. The hold ends matches quickly and has earned a reputation as one of the most legitimate submissions in the sport.",
  },
  {
    slug: "kimura-lock",
    name: "Kimura Lock",
    category: "Submission",
    difficulty: "Advanced",
    imageUrl: px(38506828),
    origin: "Masahiko Kimura (judo)",
    famousUsers: ["Brock Lesnar", "Kazushi Sakuraba"],
    description:
      "A double-wristlock that bends the opponent's arm behind their back and torques the shoulder joint. Named after judo legend Masahiko Kimura, who used it to defeat Hélio Gracie in 1951. Brock Lesnar revived it in modern wrestling and famously used it to dismantle John Cena at SummerSlam 2014.",
  },
  {
    slug: "walls-of-jericho",
    name: "Walls of Jericho",
    category: "Submission",
    difficulty: "Intermediate",
    imageUrl: px(11391978),
    origin: "Chris Jericho",
    famousUsers: ["Chris Jericho"],
    description:
      "A Boston crab variation in which the opponent's legs are crossed before the crab is applied, multiplying the pressure on the lower back and neck. The crossed legs make it far harder to escape than a traditional crab. Chris Jericho's signature submission, named after his band's debut album 'All Hail to the Walls of Jericho.'",
  },
  {
    slug: "cross-armbreaker",
    name: "Cross Armbreaker",
    category: "Submission",
    difficulty: "Advanced",
    imageUrl: px(33069392),
    origin: "Antonio Inoki",
    famousUsers: ["Alberto Del Rio", "Daniel Bryan", "Becky Lynch"],
    description:
      "A judo-style armbar in which the attacker traps the opponent's arm between their legs and hyper-extends the elbow. Applied from a flying pass or a lightning-quick transition, it can end a match in seconds. A staple of technical wrestlers from Antonio Inoki to Becky Lynch.",
  },
  {
    slug: "frog-splash",
    name: "Frog Splash",
    category: "High-Flying",
    difficulty: "Advanced",
    imageUrl: px(30513965),
    origin: "Art Barr (tribute popularized by Eddie Guerrero)",
    famousUsers: ["Eddie Guerrero", "Rey Mysterio", "Rob Van Dam"],
    description:
      "A splash from the top rope in which the wrestler leaps straight up, folds their arms and legs like a frog at the apex, and crashes down onto the prone opponent. The higher the leap, the harder the landing. Eddie Guerrero's tribute to Art Barr became one of the most beloved finishing moves of the modern era.",
  },
  {
    slug: "moonsault",
    name: "Moonsault",
    category: "High-Flying",
    difficulty: "Legendary",
    imageUrl: px(29878334),
    origin: "Keiji Muto (The Great Muta)",
    famousUsers: ["The Great Muta", "Io Shirai", "Charlotte Flair"],
    description:
      "A breathtaking backflip off the top rope onto a standing opponent. Invented by Keiji Muto as a springboard attack, it later evolved into a top-rope finisher. The Moonsault remains one of the most visually stunning and dangerous maneuvers ever performed in a wrestling ring.",
  },
  {
    slug: "619",
    name: "619",
    category: "High-Flying",
    difficulty: "Intermediate",
    imageUrl: px(33069260),
    origin: "Rey Mysterio",
    famousUsers: ["Rey Mysterio"],
    description:
      "A tornado swing around the ring ropes in which the attacker spins feet-first into the opponent's head through the middle and top ropes, usually followed by a springboard splash for the finish. The number 619 comes from Rey Mysterio's hometown area code of San Diego. One of the most crowd-pleasing set-ups in lucha libre.",
  },
  {
    slug: "shooting-star-press",
    name: "Shooting Star Press",
    category: "High-Flying",
    difficulty: "Legendary",
    imageUrl: px(30098562),
    origin: "Jushin Thunder Liger",
    famousUsers: ["Billy Kidman", "Evan Bourne", "Ricochet"],
    description:
      "Widely considered the most difficult maneuver in wrestling: a backflip performed from the top rope while flying forward across the ring, landing in a splash on the opponent. Requires elite gymnastics and flawless timing. Invented by Jushin Thunder Liger and mastered by only a handful of wrestlers worldwide.",
  },
  {
    slug: "rko",
    name: "RKO",
    category: "Signature",
    difficulty: "Advanced",
    imageUrl: px(30098561),
    origin: "Randy Orton",
    famousUsers: ["Randy Orton"],
    description:
      "A cutter variation in which Randy Orton leaps, grabs the opponent's neck, and drops into a three-quarter facelock, driving them face-first into the mat. Famous for coming 'outta nowhere' — it became the internet's favorite meme move. One of the most protected and instantly recognizable finishers in WWE history.",
  },
  {
    slug: "stone-cold-stunner",
    name: "Stone Cold Stunner",
    category: "Signature",
    difficulty: "Intermediate",
    imageUrl: px(30098566),
    origin: "Steve Austin",
    famousUsers: ["Steve Austin", "Kevin Owens"],
    description:
      "A three-quarter facelock jawbreaker in which the attacker pulls the opponent's head over their shoulder and drops to a seated position, rattling their jaw. Rarely seen without a kick to the midsection first. Steve Austin's finisher helped power the Attitude Era and sold millions of shirts.",
  },
  {
    slug: "sweet-chin-music",
    name: "Sweet Chin Music",
    category: "Signature",
    difficulty: "Intermediate",
    imageUrl: px(30513966),
    origin: "Chris Adams (superkick popularized by Shawn Michaels)",
    famousUsers: ["Shawn Michaels"],
    description:
      "A superkick — a high-impact side thrust kick to the jaw, delivered after the signature 'tuning up the band' corner stomp. Not technically a hold but one of the greatest finishing strikes ever. Shawn Michaels' finisher ended the careers of legends and retired Ric Flair at WrestleMania XXIV.",
  },
];

/**
 * The extended catalog — every entry of `moves-100.json`, mirrored here as
 * typed data so the database never depends on the HTTP import script.
 * `moves-100.json` is kept in the repo purely as the importer's payload file.
 */
const catalogMoves: NewWrestlingMove[] = [
  {
    slug: "vertical-suplex",
    name: "Vertical Suplex",
    category: "Power",
    difficulty: "Beginner",
    imageUrl: px(29762867),
    origin: "Catch wrestling (popularized by Lou Thesz)",
    famousUsers: ["Bret Hart", "Lou Thesz", "Triple H"],
    description:
      "The fundamental suplex every wrestler learns first: apply a front facelock, hoist the opponent upside down into a vertical position, pause for hang time, then fall backward to drive their shoulders into the mat. The delayed version builds unbearable crowd anticipation and shows off pure strength. Bret Hart's picture-perfect vertical suplex remains the gold standard.",
  },
  {
    slug: "belly-to-belly-suplex",
    name: "Belly-to-Belly Suplex",
    category: "Power",
    difficulty: "Intermediate",
    imageUrl: px(27968317),
    origin: "Catch wrestling / Judo",
    famousUsers: ["Kurt Angle", "Bayley", "The British Bulldog"],
    description:
      "A waistlock throw in which the attacker stands chest-to-chest with the opponent, wraps both arms around the waist, and launches them overhead onto their back. The overhead release version sends opponents flying across the ring. Kurt Angle's overhead belly-to-belly tosses and Bayley's Bayley-to-Belly made it famous worldwide.",
  },
  {
    slug: "dragon-suplex",
    name: "Dragon Suplex",
    category: "Power",
    difficulty: "Advanced",
    imageUrl: px(29714442),
    origin: "Tatsumi Fujinami",
    famousUsers: ["Tatsumi Fujinami", "Hiroshi Tanahashi", "Ultimo Dragon"],
    description:
      "A full-nelson suplex in which the attacker locks both of the opponent's arms from behind, then bridges backward to throw them overhead onto their neck and shoulders. Equal parts strength and technique, it is a staple of Japanese junior heavyweight classics. Invented by Tatsumi Fujinami, it is still one of puroresu's most respected throws.",
  },
  {
    slug: "tiger-suplex",
    name: "Tiger Suplex",
    category: "Power",
    difficulty: "Advanced",
    imageUrl: px(29762868),
    origin: "Satoru Sayama (Tiger Mask)",
    famousUsers: ["Tiger Mask", "Dynamite Kid", "Kota Ibushi"],
    description:
      "A double-chickenwing suplex: the attacker traps both of the opponent's arms behind their back, then bridges overhead to spike them onto their shoulders. Far more punishing than a standard suplex because the victim cannot break their fall. Created by the original Tiger Mask, Satoru Sayama, it became a junior heavyweight signature.",
  },
  {
    slug: "fisherman-suplex",
    name: "Fisherman Suplex",
    category: "Power",
    difficulty: "Intermediate",
    imageUrl: px(27968311),
    origin: "Mr. Perfect (Curt Hennig)",
    famousUsers: ["Mr. Perfect", "Dolph Ziggler", "Curtis Axel"],
    description:
      "A suplex in which the attacker hooks one of the opponent's legs while applying a front facelock, then bridges back to pin them with the leg trapped. The trapped leg makes the pin almost impossible to kick out of. Mr. Perfect's Perfect-Plex — a fisherman suplex with a leglock bridge — is the most famous version ever.",
  },
  {
    slug: "snap-suplex",
    name: "Snap Suplex",
    category: "Power",
    difficulty: "Beginner",
    imageUrl: px(30513964),
    origin: "Catch wrestling",
    famousUsers: ["Chris Benoit", "Dean Malenko", "William Regal"],
    description:
      "A lightning-fast vertical suplex executed in one explosive motion with no hang time. Used to rattle opponents quickly or chain into submission attempts and near falls. Technical masters like Chris Benoit, Dean Malenko and William Regal threw snap suplexes with machine-gun precision.",
  },
  {
    slug: "t-bone-suplex",
    name: "T-Bone Suplex",
    category: "Power",
    difficulty: "Intermediate",
    imageUrl: px(29762867),
    origin: "Shelton Benjamin (popularized)",
    famousUsers: ["Shelton Benjamin", "Davey Richards", "Eddie Edwards"],
    description:
      "The attacker drapes the opponent's arms across their own chest, lifts them horizontally, and throws them sideways to the mat. The T-shaped setup gives the move its name and produces a jarring sideways slam. Shelton Benjamin's explosive T-Bone made it a must-see highlight of Ruthless Aggression-era WWE.",
  },
  {
    slug: "brainbuster",
    name: "Brainbuster",
    category: "Power",
    difficulty: "Advanced",
    imageUrl: px(27968317),
    origin: "Killer Karl Kox",
    famousUsers: ["Sami Zayn", "Killer Karl Kox", "Steve Williams"],
    description:
      "A vertical suplex dropped straight down so the opponent lands on the top of their head instead of being guided to the mat. One of the most dangerous-looking basic throws in wrestling. Killer Karl Kox pioneered it, and Sami Zayn's 'Brainbustaaaah!' on the ring apron remains a legendary hardcore moment.",
  },
  {
    slug: "samoan-drop",
    name: "Samoan Drop",
    category: "Power",
    difficulty: "Intermediate",
    imageUrl: px(29714442),
    origin: "The Wild Samoans (Afa & Sika)",
    famousUsers: ["Rikishi", "Roman Reigns", "The Usos"],
    description:
      "The attacker hoists the opponent across the shoulders in a fireman's carry, then falls sideways to slam them to the mat. A staple of the Anoa'i wrestling dynasty passed down through generations. Rikishi, Rosey and Roman Reigns all used the Samoan Drop as a devastating signature slam.",
  },
  {
    slug: "body-slam",
    name: "Body Slam",
    category: "Power",
    difficulty: "Beginner",
    imageUrl: px(29762868),
    origin: "Catch wrestling",
    famousUsers: ["Hulk Hogan", "Bruno Sammartino", "John Cena"],
    description:
      "The most basic and iconic slam: scoop the opponent horizontally and drop them back-first onto the mat. Simple, safe and endlessly versatile — it opens matches and sets up bigger offense. Hulk Hogan bodyslamming the 500-pound Andre the Giant at WrestleMania III is the most famous moment in wrestling history.",
  },
  {
    slug: "spinebuster",
    name: "Spinebuster",
    category: "Power",
    difficulty: "Intermediate",
    imageUrl: px(27968311),
    origin: "Arn Anderson",
    famousUsers: ["Arn Anderson", "Triple H", "Batista"],
    description:
      "The attacker grabs the opponent by the legs and slams them down spine-first with a forward drive. Arn Anderson's Spinebuster — often set up by ducking a clothesline — is the most imitated version. Triple H adopted it as a signature setup for the Pedigree, and Batista used a brutal power variation.",
  },
  {
    slug: "jackhammer",
    name: "Jackhammer",
    category: "Power",
    difficulty: "Advanced",
    imageUrl: px(30513964),
    origin: "Goldberg",
    famousUsers: ["Goldberg"],
    description:
      "A vertical suplex powerslam: Goldberg hoists the opponent straight up with one arm and drives them down with explosive force. Usually follows a running shoulder tackle in Goldberg's legendary two-move finishing sequence. Its trail of destruction made Goldberg WCW's biggest homegrown star in 1998.",
  },
  {
    slug: "gorilla-press-slam",
    name: "Gorilla Press Slam",
    category: "Power",
    difficulty: "Advanced",
    imageUrl: px(29762867),
    origin: "Gorilla Monsoon",
    famousUsers: ["Gorilla Monsoon", "The Ultimate Warrior", "Braun Strowman"],
    description:
      "A pure strength display: the attacker military-presses the opponent overhead with both arms, holds them aloft, then slams them to the mat. Named after Gorilla Monsoon, who pressed 400-pounders overhead in the 1960s and 70s. The Ultimate Warrior's press slam on The Honky Tonk Man won him the Intercontinental Title.",
  },
  {
    slug: "sidewalk-slam",
    name: "Sidewalk Slam",
    category: "Power",
    difficulty: "Intermediate",
    imageUrl: px(27968317),
    origin: "Big Boss Man (popularized)",
    famousUsers: ["Big Boss Man", "Kane", "Ezekiel Jackson"],
    description:
      "A side-carry slam in which the attacker scoops the opponent horizontally across the chest and drops them back-first. A favorite of powerhouse enforcers and agile big men alike. Big Boss Man's version — often delivered onto the concrete floor — was one of the Attitude Era's nastiest-looking slams.",
  },
  {
    slug: "running-powerslam",
    name: "Running Powerslam",
    category: "Power",
    difficulty: "Intermediate",
    imageUrl: px(29714442),
    origin: "The British Bulldog",
    famousUsers: ["The British Bulldog", "Braun Strowman", "Davey Boy Smith Jr."],
    description:
      "A front powerslam delivered at full sprint: scoop the opponent and drive them down while running. The British Bulldog's Running Powerslam was poetry in motion and won him the first European Championship. Braun Strowman revived it as a freight-train finisher for a new generation.",
  },
  {
    slug: "fallaway-slam",
    name: "Fallaway Slam",
    category: "Power",
    difficulty: "Intermediate",
    imageUrl: px(29762868),
    origin: "Vader (popularized)",
    famousUsers: ["Vader", "Braun Strowman", "Nia Jax"],
    description:
      "The attacker lifts the opponent like a bodyslam, then falls backward, launching the victim overhead behind them. The throw distance makes it spectacular — opponents sail several feet through the air. Vader's crushing Fallaway Slam and Braun Strowman's long-distance tosses defined monster offense.",
  },
  {
    slug: "uranage-slam",
    name: "Uranage Slam",
    category: "Power",
    difficulty: "Intermediate",
    imageUrl: px(27968311),
    origin: "Judo (Ura Nage)",
    famousUsers: ["The Rock", "Big E", "Kane"],
    description:
      "A side slam from judo's ura-nage: lift the opponent across the body and throw them down on their back with a twist. The Rock's Rock Bottom is the most famous uranage in history. Big E's Big Ending and Kane's side slam variations all spring from this fundamental throw.",
  },
  {
    slug: "attitude-adjustment",
    name: "Attitude Adjustment",
    category: "Power",
    difficulty: "Advanced",
    imageUrl: px(30513964),
    origin: "John Cena",
    famousUsers: ["John Cena"],
    description:
      "John Cena's fireman's carry slam: hoist the opponent across the shoulders and throw them forward to the mat. Originally called the F-U as a shot at Brock Lesnar's F-5, it was renamed during WWE's PG era. Cena has hit the AA on giants like Big Show and Edge to win world championships.",
  },
  {
    slug: "f-5",
    name: "F-5",
    category: "Power",
    difficulty: "Legendary",
    imageUrl: px(29762867),
    origin: "Brock Lesnar",
    famousUsers: ["Brock Lesnar"],
    description:
      "Brock Lesnar's fireman's carry facebuster: swing the opponent off the shoulders and spin them face-first into the mat. Named after the most violent tornado rating, it befits Lesnar's freak-athlete destruction. The F-5 has finished John Cena, Roman Reigns and The Undertaker on the biggest stages.",
  },
  {
    slug: "batista-bomb",
    name: "Batista Bomb",
    category: "Power",
    difficulty: "Advanced",
    imageUrl: px(27968317),
    origin: "Batista",
    famousUsers: ["Batista"],
    description:
      "Batista's sitout bomb: hoist the opponent high on the shoulders, then drop into a seated position driving them spine-first into the mat. The Animal's slow, deliberate setup — shaking the ropes — made arenas erupt. It won Batista six world championships and headlined multiple WrestleManias.",
  },
  {
    slug: "pedigree",
    name: "Pedigree",
    category: "Power",
    difficulty: "Advanced",
    imageUrl: px(29714442),
    origin: "Triple H",
    famousUsers: ["Triple H", "Seth Rollins"],
    description:
      "Triple H's double-underhook facebuster: trap both arms, then jump and drive the opponent's face into the mat. One of the most protected finishers of the Attitude and Ruthless Aggression eras. Seth Rollins borrowed it during his Authority run, extending the Pedigree's championship legacy.",
  },
  {
    slug: "rock-bottom",
    name: "Rock Bottom",
    category: "Power",
    difficulty: "Advanced",
    imageUrl: px(29762868),
    origin: "The Rock",
    famousUsers: ["The Rock"],
    description:
      "The Rock's uranage side slam: hoist the opponent and drive them down on their back in one smooth motion. Often followed by the People's Elbow in wrestling's most electrifying finishing sequence. The Rock Bottom has laid out Stone Cold, Triple H and Hulk Hogan on the grandest stages.",
  },
  {
    slug: "emerald-flowsion",
    name: "Emerald Flowsion",
    category: "Power",
    difficulty: "Legendary",
    imageUrl: px(27968311),
    origin: "Mitsuharu Misawa",
    famousUsers: ["Mitsuharu Misawa"],
    description:
      "Mitsuharu Misawa's full-nelson sitout driver: lock the arms from behind, lift, and drop into a seated spike. Among the most protected finishers in Japanese history — kickouts were almost unthinkable. Named after the emerald green of Misawa's tights, it symbolizes the King's Road style's peak.",
  },
  {
    slug: "death-valley-driver",
    name: "Death Valley Driver",
    category: "Power",
    difficulty: "Advanced",
    imageUrl: px(30513964),
    origin: "Louie Spicolli",
    famousUsers: ["Louie Spicolli", "Perry Saturn", "Tommy Dreamer"],
    description:
      "A fireman's carry dropped forward so the opponent crashes face and chest-first into the mat. Invented by 'Flyboy' Louie Spicolli and named after the California desert. Perry Saturn's version and Tommy Dreamer's hardcore variations made it an ECW and cruiserweight staple.",
  },
  {
    slug: "michinoku-driver",
    name: "Michinoku Driver",
    category: "Power",
    difficulty: "Advanced",
    imageUrl: px(29762867),
    origin: "Taka Michinoku",
    famousUsers: ["Taka Michinoku", "Beth Phoenix"],
    description:
      "Taka Michinoku's sitout scoop-slam driver: scoop the opponent and drop into a seated position driving them head-first down. The Michinoku Driver II is the definitive version. Beth Phoenix's Glam Slam — the very same move — made it a dominant women's finisher in WWE.",
  },
  {
    slug: "tiger-driver",
    name: "Tiger Driver",
    category: "Power",
    difficulty: "Legendary",
    imageUrl: px(27968317),
    origin: "Satoru Sayama (Tiger Mask)",
    famousUsers: ["Tiger Mask", "Mitsuharu Misawa"],
    description:
      "A double-chickenwing driver: trap both arms behind the back and drive the opponent head-first into the mat. The Tiger Driver '91 — Mitsuharu Misawa's kneeling version — is one of the most feared moves ever used. Its devastating legacy means modern wrestlers treat it with extreme respect.",
  },
  {
    slug: "texas-piledriver",
    name: "Texas Piledriver",
    category: "Power",
    difficulty: "Advanced",
    imageUrl: px(29714442),
    origin: "Buddy Rogers",
    famousUsers: ["Buddy Rogers", "Paul Orndorff", "Jerry Lawler"],
    description:
      "The classic piledriver: trap the opponent's head between the thighs, then sit or kneel to spike them head-first into the mat. One of wrestling's oldest and most controversial moves, long banned in WWE for safety. Buddy Rogers pioneered it, and Paul Orndorff and Jerry Lawler kept it feared for decades.",
  },
  {
    slug: "package-piledriver",
    name: "Package Piledriver",
    category: "Power",
    difficulty: "Legendary",
    imageUrl: px(29762868),
    origin: "Terry Gordy",
    famousUsers: ["Kevin Owens", "Terry Gordy"],
    description:
      "A piledriver with the opponent's legs folded over their own head, compressing them into a 'package' before the spike. Considered even more dangerous than a standard piledriver. Kevin Owens used it to win championships on the indies before WWE banned it, and Terry Gordy pioneered its use in Japan.",
  },
  {
    slug: "burning-hammer",
    name: "Burning Hammer",
    category: "Power",
    difficulty: "Legendary",
    imageUrl: px(27968311),
    origin: "Kenta Kobashi",
    famousUsers: ["Kenta Kobashi"],
    description:
      "Kenta Kobashi's Argentine-backbreaker-rack inverted driver: carry the opponent across the shoulders and drop them head-first in one twisting motion. Used only a handful of times in his entire career — each one ended matches instantly. The most protected finisher in wrestling history.",
  },
  {
    slug: "blue-thunder-bomb",
    name: "Blue Thunder Bomb",
    category: "Power",
    difficulty: "Intermediate",
    imageUrl: px(30513964),
    origin: "Sami Zayn (popularized)",
    famousUsers: ["Sami Zayn"],
    description:
      "A sitout sambo-style slam: trap the opponent in a waistlock and spin them down into a high-impact sitout bomb. A cruiserweight and junior heavyweight favorite for its speed and snap. Sami Zayn's Blue Thunder Bomb — often hit out of nowhere — is its most famous modern version.",
  },
  {
    slug: "boston-crab",
    name: "Boston Crab",
    category: "Submission",
    difficulty: "Beginner",
    imageUrl: px(38506828),
    origin: "Catch wrestling",
    famousUsers: ["Rick Martel", "Bruno Sammartino"],
    description:
      "The classic back submission: trap both of the opponent's legs and lean back, bending their spine past its limit. A staple of old-school wrestling and amateur catch tradition. Rick Martel's Boston Crab was a feared 1980s finisher, and it remains the foundation for an entire family of elevated crab variations.",
  },
  {
    slug: "stf",
    name: "STF",
    category: "Submission",
    difficulty: "Intermediate",
    imageUrl: px(11392044),
    origin: "Lou Thesz",
    famousUsers: ["John Cena", "Masahiro Chono", "Lou Thesz"],
    description:
      "The Stepover Toehold Facelock: trap one leg in a toehold, step over, and crank back on the opponent's face and neck. Invented by Lou Thesz, perfected in Japan by Masahiro Chono, and made mainstream by John Cena's STFU. Cena's wing-flapping application became one of WWE's most recognized submission visuals.",
  },
  {
    slug: "crossface",
    name: "Crossface",
    category: "Submission",
    difficulty: "Advanced",
    imageUrl: px(38678683),
    origin: "Chris Benoit (Crippler Crossface)",
    famousUsers: ["Chris Benoit", "Daniel Bryan", "Asuka"],
    description:
      "A brutal face-and-neck crank: trap the opponent's arm with the legs and wrench back on the chin and face. Chris Benoit's Crippler Crossface won the World Heavyweight Championship at WrestleMania XX. Daniel Bryan's Yes Lock and Asuka's Asuka Lock evolved from this devastating hold.",
  },
  {
    slug: "rings-of-saturn",
    name: "Rings of Saturn",
    category: "Submission",
    difficulty: "Advanced",
    imageUrl: px(6765026),
    origin: "Perry Saturn",
    famousUsers: ["Perry Saturn"],
    description:
      "Perry Saturn's double-underhook leg-trap submission: hook both arms and use the legs to hyper-extend one into a crossface-style armbar. One of the most unique and painful-looking holds of the late 1990s. Saturn's dreadlocked intensity made the Rings of Saturn an unforgettable ECW and WCW weapon.",
  },
  {
    slug: "texas-cloverleaf",
    name: "Texas Cloverleaf",
    category: "Submission",
    difficulty: "Intermediate",
    imageUrl: px(11391978),
    origin: "Dory Funk Jr.",
    famousUsers: ["Dory Funk Jr.", "Dean Malenko", "Sheamus"],
    description:
      "A leglock in which the attacker weaves the opponent's legs into a cloverleaf shape and sits back, torquing knees and lower back. Invented by Dory Funk Jr. and mastered by technician Dean Malenko. Sheamus revived it as the Cloverleaf, tapping out top stars with it on the grandest stages.",
  },
  {
    slug: "hells-gate",
    name: "Hell's Gate",
    category: "Submission",
    difficulty: "Advanced",
    imageUrl: px(33069392),
    origin: "The Undertaker",
    famousUsers: ["The Undertaker"],
    description:
      "The Undertaker's gogoplata: trap the opponent's arm and press the shin across their throat from guard position. Debuted in 2008 and controversially 'banned' by storyline authority before returning as a Deadman signature. Few sights were scarier than the lights dropping and Hell's Gate being locked in.",
  },
  {
    slug: "triangle-choke",
    name: "Triangle Choke",
    category: "Submission",
    difficulty: "Advanced",
    imageUrl: px(38506828),
    origin: "Judo / Brazilian Jiu-Jitsu",
    famousUsers: ["Daniel Bryan", "Josh Barnett"],
    description:
      "The judo and jiu-jitsu classic adapted for pro wrestling: trap the opponent's head and arm between the legs in a triangle and squeeze. A legitimate fight-ender borrowed from MMA's rise. Daniel Bryan and Josh Barnett — both elite grapplers — used it to blend shoot credibility into worked matches.",
  },
  {
    slug: "sleeper-hold",
    name: "Sleeper Hold",
    category: "Submission",
    difficulty: "Beginner",
    imageUrl: px(11392044),
    origin: "Catch wrestling",
    famousUsers: ["Roddy Piper", "Brutus Beefcake"],
    description:
      "A rear chinlock compressing the carotid arteries until the opponent fades into unconsciousness. Its drama is unmatched: the referee raising the limp arm once, twice, three times. Roddy Piper's Sleeper finished legends, and Brutus Beefcake's version — followed by the barber routine — made it iconic.",
  },
  {
    slug: "cobra-clutch",
    name: "Cobra Clutch",
    category: "Submission",
    difficulty: "Intermediate",
    imageUrl: px(38678683),
    origin: "Sgt. Slaughter",
    famousUsers: ["Sgt. Slaughter", "Ted DiBiase"],
    description:
      "A half-nelson with the opponent's arm trapped: lock one arm behind their back and crank the neck sideways. Sgt. Slaughter's Cobra Clutch won him the WWF Championship from the Ultimate Warrior. Ted DiBiase's Million Dollar Dream is the grounded, money-making evolution of this hold.",
  },
  {
    slug: "full-nelson",
    name: "Full Nelson",
    category: "Submission",
    difficulty: "Beginner",
    imageUrl: px(6765026),
    origin: "Amateur wrestling",
    famousUsers: ["Chris Masters", "Bobby Lashley"],
    description:
      "Both arms threaded under the opponent's armpits with hands locked on the neck — total upper-body control. Chris Masters' Masterlock was famously 'unbreakable' until Bobby Lashley shattered the Masterlock Challenge. Lashley's Hurt Lock version later won him the WWE Championship.",
  },
  {
    slug: "camel-clutch",
    name: "Camel Clutch",
    category: "Submission",
    difficulty: "Beginner",
    imageUrl: px(11391978),
    origin: "Gory Guerrero",
    famousUsers: ["The Iron Sheik", "Scott Steiner"],
    description:
      "Sit on the opponent's lower back, grab their chin, and arch them backward like a bow. The Iron Sheik's Camel Clutch won him the WWF Championship from Bob Backlund and launched Hulkamania. Scott Steiner's Steiner Recliner is the same hold, flexed with Big Poppa Pump arrogance.",
  },
  {
    slug: "surfboard-stretch",
    name: "Surfboard Stretch",
    category: "Submission",
    difficulty: "Beginner",
    imageUrl: px(33069392),
    origin: "Catch wrestling",
    famousUsers: ["Bruno Sammartino", "Pedro Morales"],
    description:
      "Stand on the opponent's back while pulling both arms and a leg upward, stretching them like a surfboard. A classic wear-down hold from the catch wrestling era that doubles as body propaganda for the villain. Bruno Sammartino and Pedro Morales stretched challengers with it for decades.",
  },
  {
    slug: "abdominal-stretch",
    name: "Abdominal Stretch",
    category: "Submission",
    difficulty: "Beginner",
    imageUrl: px(38506828),
    origin: "Catch wrestling",
    famousUsers: ["Nick Bockwinkel", "Mike Rotunda"],
    description:
      "Trap the opponent's arm and leg while pulling the torso sideways, stretching the obliques past their limit. A staple heel hold, usually applied with a handful of tights for leverage. Old-school technicians used it to stall, taunt the crowd, and set up bigger offense.",
  },
  {
    slug: "octopus-hold",
    name: "Octopus Hold",
    category: "Submission",
    difficulty: "Advanced",
    imageUrl: px(11392044),
    origin: "Antonio Inoki",
    famousUsers: ["Antonio Inoki", "Tatsumi Fujinami"],
    description:
      "A standing marvel: wrap one leg around the opponent's neck and arm while trapping the other arm, stretching them in multiple directions at once. Antonio Inoki's Octopus Hold was a display of grappling genius. Few holds look more painful or require more flexibility from both wrestlers.",
  },
  {
    slug: "indian-deathlock",
    name: "Indian Deathlock",
    category: "Submission",
    difficulty: "Intermediate",
    imageUrl: px(38678683),
    origin: "Catch wrestling",
    famousUsers: ["Chief Jay Strongbow", "Tatanka"],
    description:
      "Trap the opponent's legs in a grapevined leg trap while applying pressure to the knees and hips. A classic catch wrestling control hold with a controversial name from another era. Chief Jay Strongbow and Tatanka used it as both a tribute and a weapon.",
  },
  {
    slug: "spinning-toe-hold",
    name: "Spinning Toe Hold",
    category: "Submission",
    difficulty: "Beginner",
    imageUrl: px(6765026),
    origin: "Dory Funk Sr.",
    famousUsers: ["Terry Funk", "Dory Funk Jr."],
    description:
      "Grab the opponent's foot and spin in circles, twisting the ankle and knee with centrifugal force. Dory Funk Sr. originated it; Terry Funk turned it into hardcore theater, spinning wildly before collapsing into the hold. One of wrestling's oldest and most beloved signature submissions.",
  },
  {
    slug: "calf-killer",
    name: "Calf Killer",
    category: "Submission",
    difficulty: "Intermediate",
    imageUrl: px(11391978),
    origin: "AJ Styles",
    famousUsers: ["AJ Styles"],
    description:
      "AJ Styles' calf slicer: trap the opponent's leg and drive the shin into the calf muscle while pulling back on the foot. A legitimate catch wrestling compression lock that drops opponents instantly. Styles' Calf Killer made world champions tap and added a deadly ground game to the Phenomenal One.",
  },
  {
    slug: "dragon-sleeper",
    name: "Dragon Sleeper",
    category: "Submission",
    difficulty: "Advanced",
    imageUrl: px(33069392),
    origin: "Tatsumi Fujinami",
    famousUsers: ["Tatsumi Fujinami", "Ultimo Dragon"],
    description:
      "A sleeper combined with a full nelson bridge: trap the arms and arch the opponent backward over the knee. Invented by Tatsumi Fujinami as the ultimate dragon-style submission. Its combination of choke and backbend makes it one of puroresu's most elegant finishers.",
  },
  {
    slug: "fujiwara-armbar",
    name: "Fujiwara Armbar",
    category: "Submission",
    difficulty: "Advanced",
    imageUrl: px(38506828),
    origin: "Yoshiaki Fujiwara",
    famousUsers: ["Yoshiaki Fujiwara", "Zack Sabre Jr."],
    description:
      "A short kneeling armbar: trap the opponent's wrist and drive the elbow joint downward with full bodyweight. Invented by catch legend Yoshiaki Fujiwara and weaponized by Zack Sabre Jr. Unlike a flying armbar, it is applied cold on the mat — a true technician's fight-ender.",
  },
  {
    slug: "hammerlock",
    name: "Hammerlock",
    category: "Submission",
    difficulty: "Beginner",
    imageUrl: px(11392044),
    origin: "Catch wrestling",
    famousUsers: ["William Regal", "Dean Malenko"],
    description:
      "Twist the opponent's arm up behind their back, torquing the shoulder and elbow. The most fundamental arm control in wrestling, taught on day one of training. William Regal and Dean Malenko built entire matches around hammerlocks, proving basics beat flash when applied with cruelty.",
  },
  {
    slug: "bear-hug",
    name: "Bear Hug",
    category: "Submission",
    difficulty: "Beginner",
    imageUrl: px(38678683),
    origin: "Catch wrestling",
    famousUsers: ["Superstar Billy Graham", "Mark Henry"],
    description:
      "Wrap both arms around the opponent's torso and squeeze the ribs until they submit or suffocate. Pro wrestling's classic strongman submission — pure crushing power. Superstar Billy Graham's Bear Hug and Mark Henry's World's Strongest version made audiences feel every rib crack.",
  },
  {
    slug: "mandible-claw",
    name: "Mandible Claw",
    category: "Submission",
    difficulty: "Intermediate",
    imageUrl: px(6765026),
    origin: "Mankind (Mick Foley, popularized)",
    famousUsers: ["Mankind"],
    description:
      "Drive the middle and ring fingers under the opponent's tongue, pressing the mandibular nerve to cause unbearable pain. Mankind's deranged finisher, applied with the sock puppet Mr. Socko for comedy-horror effect. Mick Foley won his first WWF Championship with the Claw applied, in one of the loudest pops in history.",
  },
  {
    slug: "million-dollar-dream",
    name: "Million Dollar Dream",
    category: "Submission",
    difficulty: "Intermediate",
    imageUrl: px(11391978),
    origin: "Ted DiBiase",
    famousUsers: ["Ted DiBiase"],
    description:
      "Ted DiBiase's grounded Cobra Clutch: trap the arm and squeeze the neck until the victim sleeps. The Million Dollar Man bought titles, lackeys and main events — but the Dream was priceless. It finished Jake Roberts, Randy Savage and countless challengers to DiBiase's fortune.",
  },
  {
    slug: "tazmission",
    name: "Tazmission",
    category: "Submission",
    difficulty: "Advanced",
    imageUrl: px(33069392),
    origin: "Taz",
    famousUsers: ["Taz"],
    description:
      "Taz's kata-ha-jime: a half-nelson choke squeezing the blood from the opponent's brain. The Human Suplex Machine tapped out giants and legends alike in ECW. The Tazmission's no-nonsense brutality made 'Beat me if you can, survive if I let you' a believable threat.",
  },
  {
    slug: "muta-lock",
    name: "Muta Lock",
    category: "Submission",
    difficulty: "Advanced",
    imageUrl: px(38506828),
    origin: "The Great Muta",
    famousUsers: ["The Great Muta"],
    description:
      "The Great Muta's bridging leglock: trap one leg in a deathlock and bridge backward, bending the knee and spine simultaneously. A beautiful and excruciating creation from Japan's most mysterious star. The green mist got the fame, but the Muta Lock got the submissions.",
  },
  {
    slug: "diving-crossbody",
    name: "Diving Crossbody",
    category: "High-Flying",
    difficulty: "Beginner",
    imageUrl: px(30513965),
    origin: "The Dynamite Kid (popularized)",
    famousUsers: ["Dynamite Kid", "Owen Hart"],
    description:
      "Leap from the top rope and crash onto the opponent with full bodyweight in a cross-body press. The Dynamite Kid's diving crossbody set the template for every high-flyer after him. Simple, fast and effective — it wins matches from opening bouts to main events.",
  },
  {
    slug: "diving-elbow-drop",
    name: "Diving Elbow Drop",
    category: "High-Flying",
    difficulty: "Intermediate",
    imageUrl: px(29878334),
    origin: "Randy Savage (popularized)",
    famousUsers: ["Randy Savage", "Shawn Michaels", "CM Punk"],
    description:
      "Climb the turnbuckles, point to the sky, and drop the point of the elbow through the opponent's chest. Randy Savage's top-rope elbow — with the preening and the robes — is the most beautiful move ever performed. Shawn Michaels and CM Punk later used it as tribute to the Macho Man.",
  },
  {
    slug: "diving-leg-drop",
    name: "Diving Leg Drop",
    category: "High-Flying",
    difficulty: "Intermediate",
    imageUrl: px(33069260),
    origin: "Hulk Hogan (popularized)",
    famousUsers: ["Hulk Hogan", "Jeff Hardy"],
    description:
      "Leap from the top rope and drive the leg across the opponent's throat or chest. Hulk Hogan's Atomic Leg Drop — running, then diving — finished giants for two decades. Its simplicity is its genius: the crowd counts along as the leg comes crashing down.",
  },
  {
    slug: "diving-headbutt",
    name: "Diving Headbutt",
    category: "High-Flying",
    difficulty: "Advanced",
    imageUrl: px(30098562),
    origin: "Harley Race",
    famousUsers: ["Harley Race", "Chris Benoit", "Daniel Bryan"],
    description:
      "A top-rope dive landing head-first on the prone opponent — maximum impact at maximum cost. Harley Race pioneered it; Chris Benoit's version was tragically iconic; Daniel Bryan's flying goat headbutt paid tribute. Modern wrestling has largely retired it for brain safety.",
  },
  {
    slug: "diving-splash",
    name: "Diving Splash",
    category: "High-Flying",
    difficulty: "Beginner",
    imageUrl: px(30513965),
    origin: "Jimmy Snuka",
    famousUsers: ["Jimmy Snuka", "Vader"],
    description:
      "Climb to the top and splash down belly-first onto the opponent. Jimmy 'Superfly' Snuka's splash from steel cages defined 1980s daredevilry. Vader's 400-pound Vader Bomb proved that even monsters could fly — and that gravity is undefeated.",
  },
  {
    slug: "senton-bomb",
    name: "Senton Bomb",
    category: "High-Flying",
    difficulty: "Advanced",
    imageUrl: px(29878334),
    origin: "Japanese junior heavyweight scene",
    famousUsers: ["Jeff Hardy", "Matt Hardy"],
    description:
      "Jump from the top rope and land back-first across the opponent's chest. The basic senton becomes a bomb with height and rotation. Jeff Hardy's daredevil sentons from ladders and balconies turned a simple splash into must-see chaos.",
  },
  {
    slug: "swanton-bomb",
    name: "Swanton Bomb",
    category: "High-Flying",
    difficulty: "Legendary",
    imageUrl: px(33069260),
    origin: "Jeff Hardy",
    famousUsers: ["Jeff Hardy"],
    description:
      "Jeff Hardy's twisting high-angle senton from the top rope, ladders, and twenty-foot stage sets. Named after his hometown of Swanton, North Carolina. No move captures Jeff Hardy's beautiful self-destruction better — every Swanton looks like it might be his last.",
  },
  {
    slug: "phoenix-splash",
    name: "Phoenix Splash",
    category: "High-Flying",
    difficulty: "Legendary",
    imageUrl: px(30098562),
    origin: "Hayabusa",
    famousUsers: ["Hayabusa", "Ricochet"],
    description:
      "A 450 splash with a full corkscrew twist — the diver spins 180 degrees mid-air before landing. Hayabusa's breathtaking innovation set an impossible standard for daredevils. Ricochet's modern phoenix variations carry the torch for the fallen innovator.",
  },
  {
    slug: "lionsault",
    name: "Lionsault",
    category: "High-Flying",
    difficulty: "Advanced",
    imageUrl: px(30513965),
    origin: "Chris Jericho (popularized)",
    famousUsers: ["Chris Jericho", "Kenny Omega"],
    description:
      "A springboard backflip press: bounce off the middle rope, flip backward through the air, and crash onto the prone opponent. Chris Jericho named it after his Lionheart persona and rode it to championships worldwide. Kenny Omega's picture-perfect version remains a show-stealing signature.",
  },
  {
    slug: "450-splash",
    name: "450 Splash",
    category: "High-Flying",
    difficulty: "Legendary",
    imageUrl: px(29878334),
    origin: "Lucha libre",
    famousUsers: ["Eddie Guerrero", "Justin Gabriel"],
    description:
      "A top-rope splash with a full 450-degree rotation — one and a quarter flips before impact. A lucha libre innovation that became the daredevil benchmark of the 2000s. Eddie Guerrero's and Justin Gabriel's 450s proved that gravity is just a suggestion.",
  },
  {
    slug: "red-arrow",
    name: "Red Arrow",
    category: "High-Flying",
    difficulty: "Legendary",
    imageUrl: px(33069260),
    origin: "Pac (Neville)",
    famousUsers: ["Pac"],
    description:
      "Pac's corkscrew backflip senton from the top rope — a full twist while flipping backward onto the opponent. The former Neville's finisher was so spectacular it needed no other setup. Widely considered the most beautiful aerial finisher of the modern era.",
  },
  {
    slug: "coup-de-grace",
    name: "Coup de Grace",
    category: "High-Flying",
    difficulty: "Advanced",
    imageUrl: px(30098562),
    origin: "Finn Bálor",
    famousUsers: ["Finn Bálor"],
    description:
      "Finn Balor's top-rope double foot stomp: leap and drive both boots through the opponent's chest. The Demon King's mercy shot — its French name means the finishing blow. Simple, brutal and always hit with Balor's balletic precision.",
  },
  {
    slug: "missile-dropkick",
    name: "Missile Dropkick",
    category: "High-Flying",
    difficulty: "Intermediate",
    imageUrl: px(30513965),
    origin: "The Dynamite Kid (popularized)",
    famousUsers: ["Dynamite Kid", "Kofi Kingston"],
    description:
      "A top-rope dropkick launched like a missile at a standing opponent. The Dynamite Kid's missile dropkick revolutionized what light heavyweights could do. Kofi Kingston's trusty top-rope version has turned countless matches around.",
  },
  {
    slug: "van-terminator",
    name: "Van Terminator",
    category: "High-Flying",
    difficulty: "Legendary",
    imageUrl: px(29878334),
    origin: "Rob Van Dam",
    famousUsers: ["Rob Van Dam"],
    description:
      "Rob Van Dam's coast-to-coast dropkick: run the ropes, leap over the entire ring, and dropkick a chair into the seated opponent's face. The coolest move of the early 2000s, full stop. RVD's Van Terminator won ECW and WWE fans in a single flight.",
  },
  {
    slug: "suicide-dive",
    name: "Suicide Dive",
    category: "High-Flying",
    difficulty: "Intermediate",
    imageUrl: px(33069260),
    origin: "Mexican lucha libre",
    famousUsers: ["Eddie Guerrero", "Seth Rollins"],
    description:
      "A headfirst dive through the ropes onto opponents gathered on the floor. Born in lucha libre, adopted by daredevils everywhere, and now a staple of every multi-man match. Eddie Guerrero's topes and Seth Rollins' daredevil dives made the outside as dangerous as the ring.",
  },
  {
    slug: "tope-con-hilo",
    name: "Tope Con Hilo",
    category: "High-Flying",
    difficulty: "Advanced",
    imageUrl: px(30098562),
    origin: "Mexican lucha libre",
    famousUsers: ["El Solitario", "Atlantis"],
    description:
      "An over-the-top-rope headfirst dive, clearing the ropes entirely before crashing onto the floor. The 'tope with thread' is lucha libre's purest expression of courage. El Solitario and Atlantis turned this death-defying dive into an art form.",
  },
  {
    slug: "plancha",
    name: "Plancha",
    category: "High-Flying",
    difficulty: "Intermediate",
    imageUrl: px(30513965),
    origin: "Mexican lucha libre",
    famousUsers: ["Rey Mysterio", "Juventud Guerrera"],
    description:
      "An over-the-top crossbody dive onto opponents on the floor. The word simply means 'plank' — and the diver goes in flat and fearless. Rey Mysterio and Juventud Guerrera's planchas brought lucha libre's aerial war to American audiences.",
  },
  {
    slug: "hurricanrana",
    name: "Hurricanrana",
    category: "High-Flying",
    difficulty: "Intermediate",
    imageUrl: px(29878334),
    origin: "Huracán Ramírez (lucha libre)",
    famousUsers: ["Rey Mysterio", "Kalisto"],
    description:
      "A headscissors takedown: wrap the legs around the head and flip the opponent to the mat with a snap of the hips. Named after luchador Huracán Ramírez. Rey Mysterio's lightning hurricanranas and Kalisto's acrobatic versions made it a cruiserweight essential.",
  },
  {
    slug: "dragonrana",
    name: "Dragonrana",
    category: "High-Flying",
    difficulty: "Legendary",
    imageUrl: px(33069260),
    origin: "Dragon Kid",
    famousUsers: ["Dragon Kid", "Ricochet"],
    description:
      "A top-rope front-flip headscissors takedown — the diver somersaults forward while taking the opponent over. Dragon Kid's jaw-dropping innovation remains one of wrestling's rarest sights. Only the most gifted aerialists have ever attempted it successfully.",
  },
  {
    slug: "frankensteiner",
    name: "Frankensteiner",
    category: "High-Flying",
    difficulty: "Advanced",
    imageUrl: px(30098562),
    origin: "Scott Steiner",
    famousUsers: ["Scott Steiner", "Bron Breakker"],
    description:
      "Scott Steiner's top-rope headscissors takedown: backflip over the standing opponent while flipping them head-first to the mat. Big Poppa Pump's most athletic creation from his varsity days. Bron Breakker revived it as a tribute, Steiner math and all.",
  },
  {
    slug: "superkick",
    name: "Superkick",
    category: "Signature",
    difficulty: "Intermediate",
    imageUrl: px(30098566),
    origin: "Chris Adams",
    famousUsers: ["Shawn Michaels", "The Young Bucks", "The Usos"],
    description:
      "A lightning side-thrust kick to the jaw — wrestling's most spammed and most beloved strike. From Shawn Michaels' tuned-up classic to the Young Bucks' superkick parties, it ends matches and starts memes. The Usos' superkick volleys made it tag team gospel.",
  },
  {
    slug: "big-boot",
    name: "Big Boot",
    category: "Signature",
    difficulty: "Beginner",
    imageUrl: px(30098561),
    origin: "Hulk Hogan (popularized)",
    famousUsers: ["Hulk Hogan", "Kevin Nash"],
    description:
      "A giant's simplest weapon: lift the leg and drive the boot through the opponent's face. Hulk Hogan's Big Boot set up the leg drop in wrestling's most famous finishing sequence. Kevin Nash's seven-foot version made it look like a car crash.",
  },
  {
    slug: "dropkick",
    name: "Dropkick",
    category: "Signature",
    difficulty: "Beginner",
    imageUrl: px(30513966),
    origin: "Abe Coleman",
    famousUsers: ["Rocky Johnson", "Rey Mysterio", "Finn Bálor"],
    description:
      "Jump and drive both boots into the opponent's chest, then land flat on the back. Invented by Abe Coleman in the 1930s and perfected by generations since. Rocky Johnson's picture-perfect dropkick and Finn Balor's corner shotgun version show its timeless range.",
  },
  {
    slug: "enzuigiri",
    name: "Enzuigiri",
    category: "Signature",
    difficulty: "Intermediate",
    imageUrl: px(30098566),
    origin: "Antonio Inoki (popularized)",
    famousUsers: ["Antonio Inoki", "Chris Jericho"],
    description:
      "A step-up spinning kick to the back of the opponent's head — its Japanese name means 'brain slice.' Antonio Inoki's enzuigiri was a legitimate match-ender in the 1970s. Chris Jericho's springboard variation brought the brain slice to WWE audiences.",
  },
  {
    slug: "pele-kick",
    name: "Pele Kick",
    category: "Signature",
    difficulty: "Advanced",
    imageUrl: px(30098561),
    origin: "Tajiri (popularized)",
    famousUsers: ["Tajiri", "AJ Styles"],
    description:
      "A backflip kick launched while holding the ropes, named after soccer's bicycle kick king. Tajiri's lightning Pele struck out of nowhere in ECW and WWE. AJ Styles' early-career version announced a future phenomenal star.",
  },
  {
    slug: "shining-wizard",
    name: "Shining Wizard",
    category: "Signature",
    difficulty: "Advanced",
    imageUrl: px(30513966),
    origin: "Keiji Muto (The Great Muta)",
    famousUsers: ["The Great Muta"],
    description:
      "Step up the opponent's bent knee and drive the other shin into their face. The Great Muta's Shining Wizard — named after his theme music — is puroresu's coolest strike. Its knee-assisted launch makes a simple knee strike look like dark magic.",
  },
  {
    slug: "brogue-kick",
    name: "Brogue Kick",
    category: "Signature",
    difficulty: "Intermediate",
    imageUrl: px(30098566),
    origin: "Sheamus",
    famousUsers: ["Sheamus"],
    description:
      "Sheamus's running bicycle kick, chambered like a soccer volley and fired into the jaw. The Celtic Warrior's Brogue Kick has knocked out world champions in seconds. Its 18-second WrestleMania knockout of Daniel Bryan is legendary.",
  },
  {
    slug: "claymore-kick",
    name: "Claymore Kick",
    category: "Signature",
    difficulty: "Advanced",
    imageUrl: px(30098561),
    origin: "Drew McIntyre",
    famousUsers: ["Drew McIntyre"],
    description:
      "Drew McIntyre's leaping single-leg dropkick, launched after a dramatic countdown stalk. Named after the Scottish greatsword, it hits like one. The Claymore slayed Brock Lesnar and carried McIntyre to the WWE Championship at WrestleMania 36.",
  },
  {
    slug: "trouble-in-paradise",
    name: "Trouble in Paradise",
    category: "Signature",
    difficulty: "Intermediate",
    imageUrl: px(30513966),
    origin: "Kofi Kingston",
    famousUsers: ["Kofi Kingston"],
    description:
      "Kofi Kingston's spinning jumping back kick, spun a full 360 degrees into the jaw. The Boom Squad's finisher won Kofi the WWE Championship at WrestleMania 35. Few moves match its combination of beauty, speed and KofiMania magic.",
  },
  {
    slug: "black-mass",
    name: "Black Mass",
    category: "Signature",
    difficulty: "Advanced",
    imageUrl: px(30098566),
    origin: "Aleister Black",
    famousUsers: ["Aleister Black"],
    description:
      "Aleister Black's spinning back heel kick, fired from a kneeling meditation pose. The Dutch destroyer's strike looks like it separates souls from bodies. One Black Mass can end any match — the lights go out and somebody stays down.",
  },
  {
    slug: "curb-stomp",
    name: "Curb Stomp",
    category: "Signature",
    difficulty: "Advanced",
    imageUrl: px(30098561),
    origin: "Seth Rollins",
    famousUsers: ["Seth Rollins"],
    description:
      "Stomp the back of the kneeling opponent's head, driving their face into the canvas. Seth Rollins' Curb Stomp was so brutal WWE banned it for years before fan demand brought it back. The Architect's blackout stomp has ended WrestleMania main events.",
  },
  {
    slug: "go-to-sleep",
    name: "Go To Sleep",
    category: "Signature",
    difficulty: "Legendary",
    imageUrl: px(30513966),
    origin: "KENTA (popularized by CM Punk)",
    famousUsers: ["CM Punk", "KENTA"],
    description:
      "Lift the opponent into a fireman's carry, then kick them off the shoulders into a facebuster drop. Innovated by KENTA in Japan and made global by CM Punk's straight-edge reign. The GTS won world titles and symbolized the Summer of Punk.",
  },
  {
    slug: "diamond-cutter",
    name: "Diamond Cutter",
    category: "Signature",
    difficulty: "Intermediate",
    imageUrl: px(30098566),
    origin: "Diamond Dallas Page",
    famousUsers: ["Diamond Dallas Page"],
    description:
      "Diamond Dallas Page's jumping three-quarter facelock — grab the head mid-leap and drive the face into the mat. The original 'out of nowhere' cutter, flashed with DDP's diamond hand sign. It made a 40-year-old rookie into a WCW World Champion.",
  },
  {
    slug: "twist-of-fate",
    name: "Twist of Fate",
    category: "Signature",
    difficulty: "Intermediate",
    imageUrl: px(30098561),
    origin: "Jeff Hardy",
    famousUsers: ["Jeff Hardy", "Matt Hardy"],
    description:
      "A front-facelock cutter: hook the head and twist down, driving the face into the mat. Jeff Hardy's Twist of Fate — often from ladders and cages — set up the Swanton Bomb. Matt Hardy added the Twist of Hate, making it a family finishing tradition.",
  },
  {
    slug: "neckbreaker",
    name: "Neckbreaker",
    category: "Signature",
    difficulty: "Beginner",
    imageUrl: px(30513966),
    origin: "Catch wrestling",
    famousUsers: ["Goldust", "Billy Gunn"],
    description:
      "Drop the opponent's neck across the shoulder or knee from a headlock. One of wrestling's most versatile basics — it can be hit standing, running, swinging or flipping. Goldust's Shattered Dreams may be infamous, but his snap neckbreaker was pure gold.",
  },
  {
    slug: "bulldog",
    name: "Bulldog",
    category: "Signature",
    difficulty: "Beginner",
    imageUrl: px(30098566),
    origin: "The British Bulldog (popularized)",
    famousUsers: ["The British Bulldog", "Billy Gunn"],
    description:
      "Hook the opponent in a headlock, run the ropes, and leap to drive their face into the mat. The British Bulldog's running bulldog was power and speed in one package. Billy Gunn's Fameasser — a leaping leg-drop bulldog — is its cockiest evolution.",
  },
  {
    slug: "backbreaker",
    name: "Backbreaker",
    category: "Signature",
    difficulty: "Beginner",
    imageUrl: px(30098561),
    origin: "Catch wrestling",
    famousUsers: ["Kevin Owens", "Rhea Ripley"],
    description:
      "Hoist the opponent and drop their spine across an extended knee. A timeless wear-down move that weakens the back for submission finishes. Kevin Owens' apron backbreakers and Rhea Ripley's brutal variations prove basics still break bodies.",
  },
  {
    slug: "clothesline",
    name: "Clothesline",
    category: "Signature",
    difficulty: "Beginner",
    imageUrl: px(30513966),
    origin: "Catch wrestling",
    famousUsers: ["JBL", "Stan Hansen"],
    description:
      "Extend the arm and run through the opponent's throat, flipping them inside out. JBL's Clothesline from Hell — thrown with a full swing of the arm — knocked out champions for years. The running clothesline remains wrestling's purest expression of momentum.",
  },
  {
    slug: "lariat",
    name: "Lariat",
    category: "Signature",
    difficulty: "Intermediate",
    imageUrl: px(30098566),
    origin: "Stan Hansen",
    famousUsers: ["Stan Hansen", "Hulk Hogan"],
    description:
      "A stiff running forearm smash across the throat, thrown like a weapon rather than a lockup. Stan Hansen's Western Lariat was so stiff it reportedly injured Bruno Sammartino's neck. Hulk Hogan's Axe Bomber is the same Western gun, fired in red and yellow.",
  },
  {
    slug: "styles-clash",
    name: "Styles Clash",
    category: "Signature",
    difficulty: "Legendary",
    imageUrl: px(30098561),
    origin: "AJ Styles",
    famousUsers: ["AJ Styles"],
    description:
      "AJ Styles' inverted mat slam: hoist the opponent belly-to-back, then drop face-first to the mat. The Phenomenal One's finisher looks like it breaks necks — and demands total trust. It won Styles WWE Championships and tore down Tokyo Domes.",
  },
  {
    slug: "phenomenal-forearm",
    name: "Phenomenal Forearm",
    category: "Signature",
    difficulty: "Advanced",
    imageUrl: px(30513966),
    origin: "AJ Styles",
    famousUsers: ["AJ Styles"],
    description:
      "AJ Styles' springboard leaping forearm smash, launched over the ropes onto a standing opponent. Born from Styles' daredevil X-Division days. The Phenomenal Forearm won the WWE Championship and remains the prettiest strike in the sport.",
  },
  {
    slug: "one-winged-angel",
    name: "One Winged Angel",
    category: "Signature",
    difficulty: "Legendary",
    imageUrl: px(30098566),
    origin: "Kenny Omega",
    famousUsers: ["Kenny Omega"],
    description:
      "Kenny Omega's electric-chair one-handed driver: hoist the opponent on the shoulders, grip the neck one-handed, and spike them down. Named after the Sephiroth theme from Final Fantasy VII. The most protected finisher of the modern era — almost nobody kicks out.",
  },
  {
    slug: "rainmaker",
    name: "Rainmaker",
    category: "Signature",
    difficulty: "Legendary",
    imageUrl: px(30098561),
    origin: "Kazuchika Okada",
    famousUsers: ["Kazuchika Okada"],
    description:
      "Kazuchika Okada's wrist-clutch short-arm lariat: trap the wrist, whip the opponent in, and strike them down. The Rainmaker made Okada NJPW's ace and defined 2010s wrestling. Its money-rain pose made every slow-motion replay iconic.",
  },
  {
    slug: "peoples-elbow",
    name: "People's Elbow",
    category: "Signature",
    difficulty: "Intermediate",
    imageUrl: px(30513966),
    origin: "The Rock",
    famousUsers: ["The Rock"],
    description:
      "The most electrifying move in sports entertainment: delay, hip shake, run the ropes, and drop an elbow across the chest. The Rock's People's Elbow drew bigger pops than most finishers. It only works if you're the Great One — and only he is.",
  },
  {
    slug: "angle-slam",
    name: "Angle Slam",
    category: "Signature",
    difficulty: "Advanced",
    imageUrl: px(30098566),
    origin: "Kurt Angle",
    famousUsers: ["Kurt Angle"],
    description:
      "Kurt Angle's overhead belly-to-belly suplex: hoist Olympic-style and launch the opponent overhead. The Olympic gold medalist's intensity made every Angle Slam look like it ended careers. Three 'you suck' chants optional but encouraged.",
  },
];

/** Everything that gets seeded: starters first, then the catalog, de-duped by slug. */
const allMoves: NewWrestlingMove[] = [...starterMoves, ...catalogMoves];
const moves: NewWrestlingMove[] = allMoves.filter(
  (move, i) => allMoves.findIndex((other) => other.slug === move.slug) === i,
);

/**
 * Makes sure every move in `moves` exists in the database.
 *
 * Safe to call on every request. A fully populated database only ever pays for
 * one `count(*)` — the same fast path the original "seed only if empty" check
 * had — and the lookup for *which* slugs are missing (one indexed query, at
 * most one row per seed move) only runs while rows are actually absent.
 *
 * That means: an empty database gets the whole catalog, a database created
 * before this file grew gets back-filled with the new moves, and moves a user
 * deleted on purpose stay deleted once the table is at catalog size.
 */
export async function ensureSeeded(): Promise<void> {
  const [totals] = await db.select({ n: count() }).from(wrestlingMoves);
  if ((totals?.n ?? 0) >= moves.length) return;

  const present = await db
    .select({ slug: wrestlingMoves.slug })
    .from(wrestlingMoves)
    .where(
      inArray(
        wrestlingMoves.slug,
        moves.map((move) => move.slug),
      ),
    );

  const have = new Set(present.map((row) => row.slug));
  const missing = moves.filter((move) => !have.has(move.slug));

  // Insert in chunks to stay portable across Postgres drivers.
  for (let i = 0; i < missing.length; i += 25) {
    await db
      .insert(wrestlingMoves)
      .values(missing.slice(i, i + 25))
      .onConflictDoNothing({ target: wrestlingMoves.slug });
  }
}

/** Count of moves currently in the database (used for live stats). */
export async function getMoveCount(): Promise<number> {
  const [row] = await db.select({ n: count() }).from(wrestlingMoves);
  return row?.n ?? 0;
}
