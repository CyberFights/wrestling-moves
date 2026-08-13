import { count } from "drizzle-orm";
import { db } from "@/db";
import { wrestlingMoves, type NewWrestlingMove } from "@/db/schema";

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`;

const moves: NewWrestlingMove[] = [
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
 * Seeds the database if the moves table is empty. Safe to call on every
 * request — it short-circuits once any rows exist.
 */
export async function ensureSeeded(): Promise<void> {
  const [row] = await db.select({ n: count() }).from(wrestlingMoves);
  if ((row?.n ?? 0) > 0) return;

  // Insert in chunks to stay portable across Postgres drivers.
  for (let i = 0; i < moves.length; i += 10) {
    await db
      .insert(wrestlingMoves)
      .values(moves.slice(i, i + 10))
      .onConflictDoNothing({ target: wrestlingMoves.slug });
  }
}

/** Count of moves currently in the database (used for live stats). */
export async function getMoveCount(): Promise<number> {
  const [row] = await db.select({ n: count() }).from(wrestlingMoves);
  return row?.n ?? 0;
}
