const _TOOLTIPS: Record<string, string> = {
  // Common Work
  beggar: "Struggle day and night for a couple of copper coins. It feels like you are at the brink of death each day.",
  farmer: "Plow the fields and grow the crops. It's not much but it's honest work.",
  fisherman: "Reel in various fish and sell them for a handful of coins. A relaxing but still a poor paying job.",
  miner: "Delve into dangerous caverns and mine valuable ores. The pay is quite meager compared to the risk involved.",
  blacksmith: "Smelt ores and carefully forge weapons for the military. A respectable and OK paying commoner job.",
  merchant: "Travel from town to town, bartering fine goods. The job pays decently well and is a lot less manually-intensive.",

  // Military
  squire: "Carry around your knight's shield and sword along the battlefield. Very meager pay but the work experience is quite valuable.",
  footman: "Put down your life to battle with enemy soldiers. A courageous, respectable job but you are still worthless in the grand scheme of things.",
  veteranFootman: "More experienced and useful than the average footman, take out the enemy forces in battle with your might. The pay is not that bad.",
  knight: "Slash and pierce through enemy soldiers with ease, while covered in steel from head to toe. A decently paying and very respectable job.",
  veteranKnight: "Utilising your unmatched combat ability, slaugher enemies effortlessly. Most footmen in the military would never be able to acquire such a well paying job like this.",
  eliteKnight: "Obliterate squadrons of enemy soldiers in one go with extraordinary proficiency, while equipped with the finest gear. Such a feared unit on the battlefield is paid extremely well.",
  holyKnight: "Collapse entire armies in mere seconds with your magically imbued blade. The handful of elite knights who attain this level of power are showered with coins.",
  legendaryKnight: "Feared worldwide, obliterate entire nations in a blink of an eye. Roughly every century, only one holy knight is worthy of receiving such an esteemed title.",

  // The Arcane Association
  student: "Study the theory of mana and practice basic spells. There is minor pay to cover living costs, however, this is a necessary stage in becoming a mage.",
  apprenticeMage: "Under the supervision of a mage, perform basic spells against enemies in battle. Generous pay will be provided to cover living costs.",
  mage: "Turn the tides of battle through casting intermediate spells and mentor other apprentices. The pay for this particular job is extremely high.",
  wizard: "Utilise advanced spells to ravage and destroy entire legions of enemy soldiers. Only a small percentage of mages deserve to attain this role and are rewarded with an insanely high pay.",
  masterWizard: "Blessed with unparalleled talent, perform unbelievable feats with magic at will. It is said that a master wizard has enough destructive power to wipe an empire off the map.",
  chairman: "As you walk amongst your fellow Master Wizards, who in recognition of your vast power have just elected you Chairman of the Arcane Association, you receive this anonymous note: \"We have followed your progress with great interest. Many have walked this path, but few have used the amulet you now wear to its full potential. But you are not the first to make it this far. Strive on. We will contact you, when the time is right.\"",
  illustriousChairman: "Master of life and war. Renowned throughout the magical and non-magical worlds alike, an Illustrious Chairman is completely free to follow their own path of discovery and ambition. On the other hand, there is that curious note to investigate...",

  // The Order of Discovery
  juniorCaretaker: "A low-level administrator of the ancient Order of Discovery has offered you a job. Cleaning shit-stained chamber pots and mopping kitchen floors isn't glamorous work, but it gives you the rare chance to peruse the Order's world-class library of exotic books. Who cares if touching the books is an offense worthy of expulsion?",
  leadCaretaker: "Witty placeholder, my name is.",
  freshman: "Your leadership of the caretaking team has proven you have a modicum of brain cells. A teacher you frequently see has vouched for your potential. Your studies are long and often boring, but you can sense there are great secrets within these halls waiting to be discovered.",
  sophomore: "Rhyming is crime-ing, and feature delay is not the way.",
  junior: "Try as I do, these temporary tooltips are poo.",
  senior: "Forget me not, for this author shall not.",
  probation: "Having completed your basic studies, the Order grants you a bottom-of-the-barrel position as research associate to an old member of little renown. Any major misstep will probably result in your banishment from the halls of knowledge.",

  // Nobility
  baronet: "A tooltip, a thought. Helpful, I am not.",
  baron: "The finest $3 pizza modern food science can conceive",
  viceCount: "Because Viscount sounds gross.",
  count: "Are these placeholder tooltips infuriating?",
  duke: "Good.",
  grandDuke: "The nobility cares not for your tooltip desires. ",
  archDuke: "Even grander than the most grand Grand Duke your granddad could....Grand.",
  lord: "Oh lord, please let Gottmilk write the real tooltips already. These are too painful to endure.",
  highLord: "Is it April 20th?",
  king: "Now to find yourself a nice Queen. Or two. Or three.",
  highKing: "Even higher. Even nobler.",
  emperorOfMankind: "Go outside.",

  // Fundamentals
  concentration: "Improve your learning speed through practising intense concentration activities.",
  productivity: "Learn to procrastinate less at work and receive more job experience per day.",
  bargaining: "Study the tricks of the trade and persuasive skills to lower any type of expense.",
  meditation: "Fill your mind with peace and tranquility to tap into greater happiness from within.",

  // Combat
  strength: "Condition your body and strength through harsh training. Stronger individuals are paid more in the military.",
  battleTactics: "Create and revise battle strategies, improving experience gained in the military.",
  muscleMemory: "Strengthen your neurons through habit and repetition, improving strength gains throughout the body.",

  // Magic
  manaControl: "Strengthen your mana channels throughout your body, aiding you in becoming a more powerful magical user.",
  immortality: "Lengthen your lifespan through the means of magic. However, is this truly the immortality you have tried seeking for...?",
  timeWarping: "Bend space and time through forbidden techniques, resulting in a faster gamespeed.",
  superImmortality: "Through harnessing ancient, forbidden techniques, lengthen your lifespan drastically beyond comprehension.",

  // Mind
  novelKnowledge: "A mind needs training. Your time spent absorbing new ideas and worldviews has increased your ability to assimilate new ideas and make connections between seemingly unrelated concepts.",
  unusualInsight: "Your training in the more mundane affairs of the non-magical world have developed your critical analysis skills. As you gain knowledge, magical concepts which seemed inscrutable and mysterious are becoming more relatable to the physical world around you.",
  tradePsychology: "Writers pour their souls into the written word. Your extensive reading combined with your countless years spent interacting with people have lent you unparalleled insight into the way mankind views the positive and the negative events of this world. An ethical scholar would refrain from abusing this knowledge for financial gain.",
  flow: "Intense bouts of concentration warp your perception of time",
  magicalEngineering: "The potential routes of experimentation are infinite. The questions, limitless. What should a budding Chairman focus on in order to enhance their knowledge of both life and magic? In medieval times, biology is limited by the tools of the time. Without microscopes and advanced chemistry, it is almost impossible to fully grasp the concept of cellular life and the underlying mechanisms governing DNA, metabolism, and degradation of biological structures. Magical Engineering is a worthy pursuit for a Chairman looking to use Magic to build the tools of future scientific inquiry.",
  scalesOfThought: "Up to this point, a Chairman's experience with Magic is almost entirely on the human scale. A budding apprentice learns to extend the life of a flower. A mage learns to incinerate man, horse, and siege engine. Master Wizards learn to shake the earth and obscure the vision of their human opponents with natural phenomena and magic alike. A Chairman must learn to shift their focus from the scale of humanity to both higher highs and lower lows. A Chairman seeking immortality must investigate the smallest structures of existence, must continue probing deeper and uncovering astounding knowledge and even more astounding questions. Scales of Thought will enhance Mana Control and Chairman experience gain rates by a substantial rate. By probing nature on a deeper level, a Chairman gains unparalleled understanding which influences every magical action pursuit.",
  magicalBiology: "Through Magical Biology, a Chairman seeks to leverage their new inventions and new frames of thought to directly probe, change, experiment and observe the effects of magic on various cellular structures to enhance their vitality and vigor. Magical Biology is the final step towards immortality.",

  // Dark Magic
  darkInfluence: "Encompass yourself with formidable power bestowed upon you by evil, allowing you to pick up and absorb any job or skill with ease.",
  evilControl: "Tame the raging and growing evil within you, improving evil gain in-between rebirths.",
  intimidation: "Learn to emit a devilish aura which strikes extreme fear into other merchants, forcing them to give you heavy discounts.",
  demonTraining: "A mere human body is too feeble and weak to withstand evil. Train with forbidden methods to slowly manifest into a demon, capable of absorbing knowledge rapidly.",
  bloodMeditation: "Grow and culture the evil within you through the sacrifise of other living beings, drastically increasing evil gain.",
  demonsWealth: "Through the means of dark magic, multiply the raw matter of the coins you receive from your job.",

  // Housing
  homeless: "Sleep on the uncomfortable, filthy streets while almost freezing to death every night. It cannot get any worse than this.",
  tent: "A thin sheet of tattered cloth held up by a couple of feeble, wooden sticks. Horrible living conditions but at least you have a roof over your head.",
  woodenHut: "Shabby logs and dirty hay glued together with horse manure. Much more sturdy than a tent, however, the stench isn't very pleasant.",
  cottage: "Structured with a timber frame and a thatched roof. Provides decent living conditions for a fair price.",
  house: "A building formed from stone bricks and sturdy timber, which contains a few rooms. Although quite expensive, it is a comfortable abode.",
  largeHouse: "Much larger than a regular house, which boasts even more rooms and multiple floors. The building is quite spacious but comes with a hefty price tag.",
  smallManor: "Your rising status has granted you access to a small countryside manor. With the manor comes two hundred acres of farmland and the associated serfs, grain mill, and a small river for irrigation. The attendant tells you of a beautiful hollow in some nearby woods where you can relax and meditate.",
  smallPalace: "A very rich and meticulously built structure rimmed with fine metals such as silver. Extremely high expenses to maintain for a lavish lifestyle.",
  grandPalace: "A grand residence completely composed of gold and silver. Provides the utmost luxurious and comfortable living conditions possible for a ludicrous price.",

  // Items
  ragClothing: "After weeks of freezing on the streets, you're making enough money to buy some cheap clothes. They're not much, but they'll keep you warm enough to focus.",
  book: "A place to write down all your thoughts and discoveries, allowing you to learn a lot more quickly.",
  basicFarmTools: "A set of rusty iron tools to help loosen soil, shape wood, and attach things. Where did you even find this junk?",
  cheapFishingRod: "You found this cracked fishing rod partially buried by the shore. It needs some major TLC, but it'll help you reel in bigger fish.",
  dumbbells: "Heavy tools used in strenuous exercise to toughen up and accumulate strength even faster than before. ",
  minersLantern: "After weeks of feeling your way through pitch black tunnels, bandaging scraped hands, and getting smacked in the face by your fellow miner's pickaxes, you have the bright idea to purchase a lantern. Hopefully some light will help illuminate additional mineral deposits and geological phenomena.",
  crappyAnvil: "You're pretty sure this lumpy hunk of iron used to be someone's chamber pot.",
  breechBellows: "Cobbled together with two sticks and a pair of old trousers, this tool boosts the heat and efficiency of your forge.",
  packHorse: "This sweet chestnut horse will haul you and your trade goods to distant cities where your novel fabrics and knick knacks will fetch a tidy profit.",
  smallShop: "Your first shop. This cozy storefront lies on the main street of a medium-sized walled town. Commoners, nobles, and military patrols all pass along this street, so at the very least people will know your store exists.",
  weaponOutlet: "A busy military means a busy weapons store. One of the liuetenants who frequents your small shop recently let slip that a long military campaign is imminent. Naturally, a savy merchant such as yourself sees the business opportunity provided by war.",
  personalSquire: "Assists you in completing day to day activities, giving you more time to be productive at work.",
  steelLongsword: "A fine blade used to slay enemies even quicker in combat and therefore gain more experience.",
  butler: "Keeps your household clean at all times and also prepares three delicious meals per day, leaving you in a happier, stress-free mood.",
  sapphireCharm: "Embedded with a rare sapphire, this charm activates more mana channels within your body, providing a much easier time learning magic.",
  studyDesk: "A dedicated area which provides many fine stationary and equipment designed for furthering your progress in research.",
  library: "Stores a collection of books, each containing vast amounts of information from basic life skills to complex magic spells.",
  smallField: "After a pitched battle between bickering barons, your fellow farmer lost his leg and two eldest sons. With a wife and small children to take care of, he says he'll entrust his land to you in exchange for using the proceeds to take care of his family.",
  oxDrivenPlow: "With your newfound land and tools, you've become relatively wealthy. For a peasant farmer, at least. Tale of your achievements has reached the ears of the local lord, who has granted permission for you to rent one of his oxen plow teams and associated gear.",
  livestockDerivedFertilizer: "It's poo.",
};

const JOB_IDS = [
  'beggar', 'farmer', 'fisherman', 'miner', 'blacksmith', 'merchant',
  'squire', 'footman', 'veteranFootman', 'knight', 'veteranKnight', 'eliteKnight', 'holyKnight', 'legendaryKnight',
  'student', 'apprenticeMage', 'mage', 'wizard', 'masterWizard', 'chairman', 'illustriousChairman',
  'juniorCaretaker', 'leadCaretaker', 'freshman', 'sophomore', 'junior', 'senior', 'probation',
  'baronet', 'baron', 'viceCount', 'count', 'duke', 'grandDuke', 'archDuke', 'lord', 'highLord', 'king', 'highKing', 'emperorOfMankind',
];

const SKILL_IDS = [
  'concentration', 'productivity', 'bargaining', 'meditation',
  'strength', 'battleTactics', 'muscleMemory',
  'manaControl', 'immortality', 'timeWarping', 'superImmortality',
  'novelKnowledge', 'unusualInsight', 'tradePsychology', 'flow', 'magicalEngineering', 'scalesOfThought', 'magicalBiology',
  'darkInfluence', 'evilControl', 'intimidation', 'demonTraining', 'bloodMeditation', 'demonsWealth',
];

const ITEM_IDS = [
  'homeless', 'tent', 'woodenHut', 'cottage', 'house', 'largeHouse', 'smallManor', 'smallPalace', 'grandPalace',
  'ragClothing', 'book', 'basicFarmTools', 'cheapFishingRod', 'dumbbells', 'minersLantern', 'crappyAnvil', 'breechBellows',
  'packHorse', 'smallShop', 'weaponOutlet', 'personalSquire', 'steelLongsword', 'butler', 'sapphireCharm', 'studyDesk',
  'library', 'smallField', 'oxDrivenPlow', 'livestockDerivedFertilizer',
];

function pick(obj: Record<string, string>, keys: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  keys.forEach(k => { if (obj[k] !== undefined) result[k] = obj[k]; });
  return result;
}

export const JOB_TOOLTIPS = pick(_TOOLTIPS, JOB_IDS);
export const SKILL_TOOLTIPS = pick(_TOOLTIPS, SKILL_IDS);
export const ITEM_TOOLTIPS = pick(_TOOLTIPS, ITEM_IDS);
