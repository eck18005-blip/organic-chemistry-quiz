// ─── QUESTION BANK ───────────────────────────────────────────────────────────
// Sourced from: BYU-Idaho CHEM 351 — Units 2 & 3 practice/exam/review materials
// Answer images should live at /public/answers/<id>.png
// Structure images at /public/structures/<id>.png
// Where no image exists yet, answerText provides a text fallback.

export interface Question {
    id: string;
    chapter: number;
    lesson: string;
    topic: string;
    type: string;
    format: string;
    prompt: string;
    reagents: string | null;
    structureImage: string | null;
    answerText: string;
    difficulty: number;
    tags: string[];
  }
  
  export const questionBank: Question[] = [
  
    // ════════════════════════════════════════════════════════════════════
    // CHAPTER 6 — An Overview of Organic Reactions
    // ════════════════════════════════════════════════════════════════════
  
    // 6.1 Kinds of Organic Reactions
    { id:'c6-1-01', chapter:6, lesson:'6.1', topic:'Kinds of Organic Reactions',
      type:'identify', format:'classify-reaction',
      prompt:'Classify this reaction type: CH₂=CH₂ + HBr → CH₃CH₂Br',
      reagents:null, structureImage:null,
      answerText:'Addition reaction — a reagent adds across a double bond.',
      difficulty:1, tags:['addition','classification'] },
  
    { id:'c6-1-02', chapter:6, lesson:'6.1', topic:'Kinds of Organic Reactions',
      type:'identify', format:'classify-reaction',
      prompt:'Classify this reaction type: CH₃CH₂Br + KOH → CH₂=CH₂ + KBr + H₂O',
      reagents:null, structureImage:null,
      answerText:'Elimination reaction — atoms are removed from adjacent carbons to form a π bond.',
      difficulty:1, tags:['elimination','classification'] },
  
    { id:'c6-1-03', chapter:6, lesson:'6.1', topic:'Kinds of Organic Reactions',
      type:'identify', format:'classify-reaction',
      prompt:'Classify this reaction type: CH₃Br + NaOH → CH₃OH + NaBr',
      reagents:null, structureImage:null,
      answerText:'Substitution reaction — one group replaces another on the carbon skeleton.',
      difficulty:1, tags:['substitution','classification'] },
  
    // 6.2 Mechanisms
    { id:'c6-2-01', chapter:6, lesson:'6.2', topic:'Reaction Mechanisms',
      type:'short-answer', format:'explain',
      prompt:'What is the rate-limiting step of an SN1 reaction? What is the rate law?',
      reagents:null, structureImage:null,
      answerText:'The slow step is formation of the carbocation. Rate = k[substrate]. The rate depends only on the concentration of the substrate.',
      difficulty:2, tags:['SN1','rate-law','carbocation'] },
  
    { id:'c6-2-02', chapter:6, lesson:'6.2', topic:'Reaction Mechanisms',
      type:'short-answer', format:'explain',
      prompt:'What is the rate law for an SN2 reaction? What determines which mechanism (SN1 vs SN2) a reaction follows?',
      reagents:null, structureImage:null,
      answerText:'Rate = k[substrate][nucleophile]. SN2 is favored by 1° substrates, strong nucleophiles, and polar aprotic solvents. SN1 is favored by 3° substrates, weak nucleophiles, and polar protic solvents.',
      difficulty:2, tags:['SN2','rate-law','mechanism-selection'] },
  
    // 6.3 Polar Reactions
    { id:'c6-3-01', chapter:6, lesson:'6.3', topic:'Polar Reactions',
      type:'identify', format:'label',
      prompt:'In the reaction CH₃Br + OH⁻ → CH₃OH + Br⁻, identify the nucleophile, electrophile, and leaving group.',
      reagents:null, structureImage:null,
      answerText:'Nucleophile: OH⁻ | Electrophile: CH₃Br (the carbon bearing Br) | Leaving group: Br⁻',
      difficulty:1, tags:['nucleophile','electrophile','leaving-group'] },
  
    { id:'c6-3-02', chapter:6, lesson:'6.3', topic:'Polar Reactions',
      type:'identify', format:'label',
      prompt:'Identify the nucleophile and leaving group: cyclopentyl-CH₂I + NaN₃ → cyclopentyl-CH₂N₃ + NaI',
      reagents:null, structureImage:null,
      answerText:'Nucleophile: N₃⁻ (azide ion) | Leaving group: I⁻',
      difficulty:1, tags:['nucleophile','leaving-group','azide'] },
  
    { id:'c6-3-03', chapter:6, lesson:'6.3', topic:'Polar Reactions',
      type:'identify', format:'label',
      prompt:'Identify the nucleophile and leaving group: TsO-CH₂CH(Et)₂ + CH₃OH → H₃CO-CH₂CH(Et)₂ + TsOH',
      reagents:null, structureImage:null,
      answerText:'Nucleophile: CH₃OH (methanol) | Leaving group: ⁻OTs (tosylate)',
      difficulty:2, tags:['nucleophile','leaving-group','tosylate'] },
  
    { id:'c6-3-04', chapter:6, lesson:'6.3', topic:'Polar Reactions',
      type:'identify', format:'label',
      prompt:'Identify the nucleophile and leaving group: bicyclo[4.3.0]nonan-1-ol + HCl → chloro product + H₂O',
      reagents:null, structureImage:null,
      answerText:'Nucleophile: Cl⁻ | Leaving group: H₂O',
      difficulty:2, tags:['nucleophile','leaving-group','alcohol'] },
  
    // 6.4 Addition of HBr to Ethylene
    { id:'c6-4-01', chapter:6, lesson:'6.4', topic:'Addition of HBr to Alkenes',
      type:'draw-product', format:'give-reagents',
      prompt:'Draw the product. What mechanism does this follow?',
      reagents:'CH₂=CH₂  +  HBr  →',
      structureImage:null,
      answerText:'CH₃CH₂Br (bromoethane). Electrophilic addition — H⁺ adds to one carbon forming a carbocation, then Br⁻ attacks.',
      difficulty:1, tags:['addition','HBr','ethylene','electrophilic-addition'] },
  
    // 6.5 Curved Arrows
    { id:'c6-5-01', chapter:6, lesson:'6.5', topic:'Curved Arrows in Mechanisms',
      type:'draw-mechanism', format:'show-arrows',
      prompt:'Use curved arrows to show the SN2 mechanism. Label it SN2 and write the rate law.',
      reagents:'1-pentanol  +  HBr  →  1-bromopentane  +  H₂O',
      structureImage:null,
      answerText:'SN2: curved arrow from OH lone pair to H of HBr, then curved arrow from C–O bond to O (protonation gives oxonium), then Br⁻ attacks C from back face as OH₂ leaves. Rate = k[substrate][Br⁻].',
      difficulty:3, tags:['SN2','curved-arrows','mechanism','rate-law'] },
  
    { id:'c6-5-02', chapter:6, lesson:'6.5', topic:'Curved Arrows in Mechanisms',
      type:'draw-mechanism', format:'show-arrows',
      prompt:'Show the complete SN1 mechanism using curved arrows. Label the rate-limiting step and write the rate law.',
      reagents:'1-methylcyclohexanol  +  HBr  →  1-bromo-1-methylcyclohexane  +  H₂O',
      structureImage:null,
      answerText:'Step 1 (slow, rate-limiting): protonation of OH to give oxonium. Step 2: loss of H₂O to give tertiary carbocation. Step 3: Br⁻ attacks carbocation. Rate = k[substrate].',
      difficulty:3, tags:['SN1','curved-arrows','mechanism','carbocation','rate-law'] },
  
    { id:'c6-5-03', chapter:6, lesson:'6.5', topic:'Curved Arrows in Mechanisms',
      type:'draw-mechanism', format:'show-arrows',
      prompt:'Show the complete SN2 mechanism using curved arrows. Give the stereochemical outcome.',
      reagents:'(R)-iodocyclohexane  +  NaCN  →  (in DMSO)',
      structureImage:null,
      answerText:'SN2: curved arrow from CN⁻ lone pair to C–I carbon, simultaneous curved arrow from C–I bond to I. Product is (S)-cyanocyclohexane. 100% inversion of configuration (Walden inversion). Rate = k[substrate][CN⁻].',
      difficulty:3, tags:['SN2','inversion','stereochemistry','NaCN','DMSO'] },
  
    // 6.6 Radical Reactions
    { id:'c6-6-01', chapter:6, lesson:'6.6', topic:'Radical Reactions',
      type:'draw-mechanism', format:'show-arrows',
      prompt:'Show the initiation and propagation steps for this free radical halogenation.',
      reagents:'cyclohexane  +  Cl₂  →  (hν)  →  chlorocyclohexane  +  HCl',
      structureImage:null,
      answerText:'Initiation: Cl–Cl → 2 Cl• (homolytic). Propagation: Cl• + C–H → HCl + cyclohexyl radical; cyclohexyl radical + Cl–Cl → chlorocyclohexane + Cl•.',
      difficulty:3, tags:['radical','halogenation','free-radical','initiation','propagation'] },
  
    { id:'c6-6-02', chapter:6, lesson:'6.6', topic:'Radical Reactions',
      type:'draw-product', format:'give-reagents',
      prompt:'Draw the major product of this free-radical bromination. Explain your regiochemical choice.',
      reagents:'methylcyclohexane  +  Br₂  →  (hν, CH₃OH)',
      structureImage:null,
      answerText:'(Bromomethyl)cyclohexane — Br₂/hν brominates the most stable radical position (benzylic-like tertiary or the methyl group for selectivity). Bromine is highly selective.',
      difficulty:2, tags:['radical','bromination','regioselectivity'] },
  
    // 6.7–6.9 Energy & Thermodynamics
    { id:'c6-7-01', chapter:6, lesson:'6.7', topic:'Reaction Equilibria and Rates',
      type:'short-answer', format:'explain',
      prompt:'Describe the effect of solvent choice on the rates of SN1 and SN2 reactions. Give examples of good solvents for each.',
      reagents:null, structureImage:null,
      answerText:'SN1: polar protic solvents (H₂O, CH₃OH, CH₃CH₂OH) stabilize both the carbocation and leaving group by solvation. SN2: polar aprotic solvents (DMSO, DMF, acetone, acetonitrile) free the nucleophile, increasing reactivity.',
      difficulty:2, tags:['solvent','SN1','SN2','polar-protic','polar-aprotic'] },
  
    // ════════════════════════════════════════════════════════════════════
    // CHAPTER 7 — Alkenes: Structure and Reactivity
    // ════════════════════════════════════════════════════════════════════
  
    // 7.2 Degree of Unsaturation
    { id:'c7-2-01', chapter:7, lesson:'7.2', topic:'Degree of Unsaturation',
      type:'short-answer', format:'calculate',
      prompt:'A compound has molecular formula C₁₅H₁₉F₂NO and is fully hydrogenated to give C₁₅H₂₇F₂NO. How many rings and double bonds did the original compound have?',
      reagents:null, structureImage:null,
      answerText:'Original DoU = (15+1)−(19/2)+(1/2) = 6. Hydrogenated DoU = (15+1)−(27/2)+(1/2) = 2. The 4 H₂ consumed reveal 4 π bonds. Since total DoU = 6 and π bonds = 4, there are 2 rings.',
      difficulty:3, tags:['degree-of-unsaturation','DoU','molecular-formula'] },
  
    // 7.3 Naming Alkenes
    { id:'c7-3-01', chapter:7, lesson:'7.3', topic:'Naming Alkenes',
      type:'name-compound', format:'give-structure-name-it',
      prompt:'Give the complete IUPAC name including stereodescriptors.',
      reagents:null,
      structureImage:'structures/c7-3-01.png',
      answerText:'cis-4-chlorocyclohexanol',
      difficulty:2, tags:['IUPAC','naming','cyclohexane','cis-trans'] },
  
    { id:'c7-3-02', chapter:7, lesson:'7.3', topic:'Naming Alkenes',
      type:'draw-structure', format:'name-to-structure',
      prompt:'Draw the complete bond-line structure for the following compound.',
      reagents:'(3E,5S,6E,8S)-4-allyl-3,8-dichloronona-3,6-diene-1,5-diol',
      structureImage:null,
      answerText:'A nine-carbon chain with: double bonds at C3 (E) and C6 (E); Cl at C3 and C8; OH at C1 and C5 (S); allyl group at C4.',
      difficulty:4, tags:['IUPAC','naming','stereodescriptors','diene','diol'] },
  
    { id:'c7-3-03', chapter:7, lesson:'7.3', topic:'Naming Alkenes',
      type:'name-compound', format:'give-structure-name-it',
      prompt:'Provide the IUPAC name for this compound (stereochemistry required).',
      reagents:null,
      structureImage:'structures/c7-3-03.png',
      answerText:'(1R,4S,5R)-5-isopropylcyclohex-2-ene-1,4-diol',
      difficulty:3, tags:['IUPAC','naming','cyclohexene','diol','stereodescriptors'] },
  
    { id:'c7-3-04', chapter:7, lesson:'7.3', topic:'Naming Alkenes',
      type:'name-compound', format:'give-structure-name-it',
      prompt:'Give the complete IUPAC name including all stereodescriptors.',
      reagents:null,
      structureImage:'structures/c7-3-04.png',
      answerText:'(3S,4S,6R,9R)-4-bromo-3-isobutyl-9-methylundecane-1,6,11-triol',
      difficulty:4, tags:['IUPAC','naming','stereodescriptors','triol'] },
  
    { id:'c7-3-05', chapter:7, lesson:'7.3', topic:'Naming Alkenes',
      type:'draw-structure', format:'name-to-structure',
      prompt:'Draw the bond-line structure.',
      reagents:'(2S,3E,4S,5E)-2-bromo-4-cyclohexyl-5-ethyloct-5-ena-1,3-diol',
      structureImage:null,
      answerText:'Eight-carbon chain; OH at C1 and C3 (S); Br at C2; double bond at C3–C4 (E) and C5–C6 (E); cyclohexyl at C4; ethyl at C5.',
      difficulty:4, tags:['IUPAC','naming','draw-structure','stereodescriptors'] },
  
    // 7.4–7.5 Stereoisomerism / E,Z
    { id:'c7-5-01', chapter:7, lesson:'7.5', topic:'E,Z Designation of Alkenes',
      type:'short-answer', format:'explain',
      prompt:'When do you use E and Z designations instead of cis/trans? Provide one example of each.',
      reagents:null, structureImage:null,
      answerText:'E/Z are used when both alkene carbons bear two different substituents. Example with E/Z: (CH₃)(H)C=C(Br)(Cl) — can assign E or Z using CIP priorities. Example without: CH₃CH=CHCH₃ — cis/trans works because both sides have H.',
      difficulty:2, tags:['E-Z','stereoisomerism','CIP','alkene'] },
  
    // 7.6 Stability of Alkenes
    { id:'c7-6-01', chapter:7, lesson:'7.6', topic:'Stability of Alkenes',
      type:'rank', format:'order',
      prompt:'Arrange the following alkenes in order of lowest to highest heats of hydrogenation (least stable to most stable). Draw your answer.',
      reagents:'2-methylbut-2-ene, 2-methylbut-1-ene, 3-methylbut-1-ene, cyclohexene, 2,3-dimethylbut-2-ene',
      structureImage:null,
      answerText:'Lowest ΔH°H₂ (most stable) → highest ΔH°H₂ (least stable): 2,3-dimethylbut-2-ene < 2-methylbut-2-ene < cyclohexene < 2-methylbut-1-ene < 3-methylbut-1-ene. More substituted = more stable = lower heat of hydrogenation.',
      difficulty:3, tags:['stability','heat-of-hydrogenation','substitution','alkene'] },
  
    // 7.7–7.8 Electrophilic Addition & Markovnikov
    { id:'c7-7-01', chapter:7, lesson:'7.7', topic:'Electrophilic Addition Reactions',
      type:'draw-product', format:'give-reagents',
      prompt:'Draw the major product. Apply Markovnikov\'s rule.',
      reagents:'CH₃CH=CH₂  +  HBr  →',
      structureImage:null,
      answerText:'2-bromopropane (CH₃CHBrCH₃). Markovnikov: H adds to the carbon with more H\'s (C1), giving secondary carbocation at C2, which is attacked by Br⁻.',
      difficulty:2, tags:['Markovnikov','addition','HBr','regioselectivity','alkene'] },
  
    { id:'c7-7-02', chapter:7, lesson:'7.7', topic:'Electrophilic Addition Reactions',
      type:'draw-product', format:'give-reagents',
      prompt:'Draw the major product. Apply Markovnikov\'s rule.',
      reagents:'CH₃CH=CH₂  +  H₂O  →  (H₃O⁺ catalyst)',
      structureImage:null,
      answerText:'2-propanol (CH₃CHOHCH₃). Markovnikov hydration: H⁺ adds to C1 giving secondary carbocation at C2, then water attacks.',
      difficulty:2, tags:['Markovnikov','hydration','alcohol','acid-catalyzed'] },
  
    { id:'c7-8-01', chapter:7, lesson:'7.8', topic:'Markovnikov\'s Rule',
      type:'draw-product', format:'give-reagents',
      prompt:'Predict the major product. Be sure to apply Markovnikov\'s rule.',
      reagents:'2-methylpropene  +  HCl  →',
      structureImage:null,
      answerText:'2-chloro-2-methylpropane (tert-butyl chloride). H adds to CH₂= end giving tertiary carbocation at C2, attacked by Cl⁻.',
      difficulty:2, tags:['Markovnikov','HCl','tertiary-carbocation','addition'] },
  
    { id:'c7-8-02', chapter:7, lesson:'7.8', topic:'Markovnikov\'s Rule',
      type:'short-answer', format:'explain',
      prompt:'A chemist wants to prepare enantiopure (S)-2-cyanobutane from (R)-2-butanol. He treats (R)-2-butanol with HBr to get 2-bromobutane, then reacts it with NaCN. He gets a racemic mixture. What went wrong? Design a better synthesis.',
      reagents:null, structureImage:null,
      answerText:'Problem: HBr with a secondary alcohol proceeds via SN1 (carbocation formation → racemization). Better route: (R)-2-butanol → TsCl/pyridine → (R)-2-butyl tosylate → NaCN/DMSO (SN2, 100% inversion) → (S)-2-cyanobutane. Tosylate avoids carbocation and preserves stereochemistry.',
      difficulty:4, tags:['SN1','SN2','stereochemistry','synthesis','tosylate','racemization'] },
  
    // 7.9 Carbocation Structure and Stability
    { id:'c7-9-01', chapter:7, lesson:'7.9', topic:'Carbocation Structure and Stability',
      type:'rank', format:'order',
      prompt:'Rank from least stable to most stable: methyl cation, ethyl cation, isopropyl cation, tert-butyl cation.',
      reagents:null, structureImage:null,
      answerText:'Least → Most stable: CH₃⁺ (methyl, 0°) < CH₃CH₂⁺ (ethyl, 1°) < (CH₃)₂CH⁺ (isopropyl, 2°) < (CH₃)₃C⁺ (tert-butyl, 3°). More alkyl groups = more hyperconjugation/inductive stabilization.',
      difficulty:2, tags:['carbocation','stability','ranking','hyperconjugation'] },
  
    // 7.11 Carbocation Rearrangements
    { id:'c7-11-01', chapter:7, lesson:'7.11', topic:'Carbocation Rearrangements',
      type:'draw-product', format:'give-reagents',
      prompt:'Predict the major product of this SN1 reaction. Check for carbocation rearrangements!',
      reagents:'1-methylcyclohexanol  +  HBr  →  (SN1)',
      structureImage:null,
      answerText:'1-bromo-1-methylcyclohexane. The tertiary carbocation at C1 is already tertiary — no rearrangement needed. Br⁻ attacks the tertiary carbocation.',
      difficulty:3, tags:['SN1','carbocation-rearrangement','ring','tertiary'] },
  
    { id:'c7-11-02', chapter:7, lesson:'7.11', topic:'Carbocation Rearrangements',
      type:'draw-product', format:'give-reagents',
      prompt:'Predict the major product. Remember to check for 1,2-hydride or 1,2-methyl shifts!',
      reagents:'2-methyl-1-pentene  +  HBr  →',
      structureImage:null,
      answerText:'2-bromo-2-methylpentane (major) via tertiary carbocation. Or if rearrangement occurs: 1,2-hydride shift to give more stable carbocation. Always check if carbocation can rearrange to a more stable one.',
      difficulty:3, tags:['carbocation-rearrangement','1,2-hydride-shift','Markovnikov','HBr'] },
  
    // ════════════════════════════════════════════════════════════════════
    // CHAPTER 8 — Alkenes: Reactions and Synthesis
    // ════════════════════════════════════════════════════════════════════
  
    // 8.1 Preparing Alkenes — Elimination
    { id:'c8-1-01', chapter:8, lesson:'8.1', topic:'Preparing Alkenes: Elimination',
      type:'draw-product', format:'give-reagents',
      prompt:'Draw the major alkene product (Zaitsev product) of this elimination reaction.',
      reagents:'2-chloro-2-methylbutane  +  KOC(CH₃)₃  →  (E2)',
      structureImage:null,
      answerText:'2-methylbut-2-ene (Zaitsev product — most substituted alkene). The strong, bulky base causes E2 elimination preferentially to the more substituted side.',
      difficulty:3, tags:['E2','Zaitsev','elimination','alkene-preparation'] },
  
    { id:'c8-1-02', chapter:8, lesson:'8.1', topic:'Preparing Alkenes: Elimination',
      type:'draw-product', format:'give-reagents',
      prompt:'Draw the major product of this elimination. Label it E1 or E2.',
      reagents:'2-methylcyclohexanol  +  H₂SO₄  →  (heat)',
      structureImage:null,
      answerText:'1-methylcyclohexene (major, most substituted, Zaitsev). Mechanism is E1 (acid-catalyzed dehydration via carbocation). Minor product: methylenecyclohexane.',
      difficulty:2, tags:['E1','dehydration','Zaitsev','H2SO4','alcohol'] },
  
    { id:'c8-1-03', chapter:8, lesson:'8.1', topic:'Preparing Alkenes: Elimination',
      type:'draw-product', format:'give-reagents',
      prompt:'Draw the major product. This involves a 1,2-methyl shift — show the rearrangement!',
      reagents:'2-methylcyclopentanol  +  H₂SO₄  →  (heat)',
      structureImage:null,
      answerText:'1-methylcyclopentene via carbocation, then 1,2-methyl/hydride shift to give 1-methylcyclopentyl cation, then elimination to methylenecyclopentane or ring-expanded cyclohexene. Show the ring expansion via carbocation rearrangement.',
      difficulty:4, tags:['E1','carbocation-rearrangement','ring-expansion','dehydration'] },
  
    { id:'c8-1-04', chapter:8, lesson:'8.1', topic:'Preparing Alkenes: Elimination',
      type:'draw-mechanism', format:'show-arrows',
      prompt:'Show the complete mechanism using curved arrows.',
      reagents:'1-methylcyclopentanol  +  H₂SO₄  →  (heat)',
      structureImage:null,
      answerText:'Step 1: O lone pair attacks H of H₂SO₄ (protonation). Step 2: H₂O leaves to form tertiary cyclopentyl carbocation (slow step). Step 3: base (HSO₄⁻) removes β-H; C–H electrons form C=C. Product: 1-methylcyclopentene.',
      difficulty:3, tags:['E1','mechanism','curved-arrows','dehydration','H2SO4'] },
  
    // 8.2 Halogenation
    { id:'c8-2-01', chapter:8, lesson:'8.2', topic:'Halogenation of Alkenes',
      type:'draw-product', format:'give-reagents',
      prompt:'Draw the product. What stereochemistry is expected?',
      reagents:'cyclohexene  +  Br₂  →  (CCl₄)',
      structureImage:null,
      answerText:'trans-1,2-dibromocyclohexane (racemic mixture of R,R and S,S enantiomers). Anti addition via bromonium ion intermediate.',
      difficulty:2, tags:['halogenation','Br2','anti-addition','bromonium-ion','stereochemistry'] },
  
    { id:'c8-2-02', chapter:8, lesson:'8.2', topic:'Halogenation of Alkenes',
      type:'draw-product', format:'give-reagents',
      prompt:'Draw the major product. Note: this is a multi-step synthesis.',
      reagents:'methylenecyclohexane  →  1) Br₂/hν  →  2) KOC(CH₃)₃/HOC(CH₃)₃',
      structureImage:null,
      answerText:'1-methylenecyclohexane after radical bromination at allylic position then E2 elimination. Step 1: allylic radical bromination gives bromomethylenecyclohexane. Step 2: E2 gives diene (1-methylene-2-methylenecyclohexane or similar).',
      difficulty:4, tags:['radical-bromination','allylic','E2','multi-step','synthesis'] },
  
    // 8.3 Halohydrin Formation
    { id:'c8-3-01', chapter:8, lesson:'8.3', topic:'Halohydrin Formation',
      type:'draw-product', format:'give-reagents',
      prompt:'Draw the product and give its stereochemistry.',
      reagents:'cyclopentene  +  Br₂  +  H₂O  →',
      structureImage:null,
      answerText:'trans-2-bromocyclopentan-1-ol (racemic mixture). Anti addition: bromonium ion forms, then water attacks from opposite face at the more substituted carbon (Markovnikov-like).',
      difficulty:3, tags:['halohydrin','Br2-H2O','anti-addition','Markovnikov','stereochemistry'] },
  
    // 8.4 Oxymercuration–Demercuration
    { id:'c8-4-01', chapter:8, lesson:'8.4', topic:'Hydration by Oxymercuration',
      type:'draw-product', format:'give-reagents',
      prompt:'Draw the product. Which regiochemistry does oxymercuration–demercuration give?',
      reagents:'propene  →  1) Hg(OAc)₂, H₂O  →  2) NaBH₄',
      structureImage:null,
      answerText:'2-propanol (Markovnikov product). Oxymercuration–demercuration gives Markovnikov addition of water WITHOUT carbocation rearrangement. No stereochemistry at the new C–O bond.',
      difficulty:2, tags:['oxymercuration','hydration','Markovnikov','no-rearrangement'] },
  
    // 8.5 Hydroboration–Oxidation
    { id:'c8-5-01', chapter:8, lesson:'8.5', topic:'Hydration by Hydroboration',
      type:'draw-product', format:'give-reagents',
      prompt:'Draw the product. Compare the regiochemistry and stereochemistry to oxymercuration.',
      reagents:'propene  →  1) BH₃·THF  →  2) H₂O₂, NaOH',
      structureImage:null,
      answerText:'1-propanol (anti-Markovnikov). Hydroboration gives syn addition of BH₃ across the double bond — boron goes to less hindered carbon. Oxidation replaces B with OH with retention. Result: anti-Markovnikov, syn addition.',
      difficulty:3, tags:['hydroboration','anti-Markovnikov','syn-addition','BH3','regioselectivity'] },
  
    { id:'c8-5-02', chapter:8, lesson:'8.5', topic:'Hydration by Hydroboration',
      type:'draw-product', format:'give-reagents',
      prompt:'Draw the complete product including stereochemistry.',
      reagents:'1-methylcyclopentanol  →  1) H₂SO₄/heat  →  2) BH₃·THF  →  3) H₂O₂/NaOH',
      structureImage:null,
      answerText:'Step 1: dehydration gives 1-methylcyclopentene. Step 2–3: hydroboration–oxidation gives trans-2-methylcyclopentan-1-ol (anti-Markovnikov, syn addition, racemic mixture at C1 and C2).',
      difficulty:4, tags:['hydroboration','anti-Markovnikov','syn','multi-step','dehydration'] },
  
    // 8.6 Hydrogenation
    { id:'c8-6-01', chapter:8, lesson:'8.6', topic:'Reduction: Hydrogenation',
      type:'draw-product', format:'give-reagents',
      prompt:'Draw the product. What stereochemistry results from catalytic hydrogenation of 1,2-dimethylcyclopentene?',
      reagents:'1,2-dimethylcyclopentene  +  H₂  →  (Pd catalyst)',
      structureImage:null,
      answerText:'cis-1,2-dimethylcyclopentane (only). Hydrogenation is syn addition — both H atoms add from the same face of the double bond. Only cis product forms.',
      difficulty:3, tags:['hydrogenation','syn-addition','stereochemistry','cis','Pd'] },
  
    { id:'c8-6-02', chapter:8, lesson:'8.6', topic:'Reduction: Hydrogenation',
      type:'short-answer', format:'explain',
      prompt:'Compound X is C₅H₁₀O, optically active. It consumes one equivalent of H₂ to give C₅H₁₂O, also optically active. Which compound fits? Explain.',
      reagents:null, structureImage:null,
      answerText:'CH₃CHCH₂CH=CH₂ | OH. Compound D: 1-penten-4-ol (chiral center at C4). When the terminal alkene is hydrogenated, the chiral center at C4 is preserved, so the product is still chiral.',
      difficulty:4, tags:['hydrogenation','chirality','optically-active','degree-of-unsaturation'] },
  
    // 8.7 Epoxidation
    { id:'c8-7-01', chapter:8, lesson:'8.7', topic:'Epoxidation and Hydroxylation',
      type:'draw-product', format:'give-reagents',
      prompt:'Draw the product and show the stereochemistry.',
      reagents:'2-methylpropene  +  peroxyacetic acid  →',
      structureImage:null,
      answerText:'2-methylpropene oxide (epoxide). Syn addition — the O bridges both carbons from the same face. Concerted one-step mechanism.',
      difficulty:2, tags:['epoxidation','peroxyacid','syn-addition','mCPBA'] },
  
    { id:'c8-7-02', chapter:8, lesson:'8.7', topic:'Epoxidation and Hydroxylation',
      type:'draw-product', format:'give-reagents',
      prompt:'Draw the product(s). What is the stereochemical relationship between them?',
      reagents:'1-methylcyclohexene  +  OsO₄  →  (then NaHSO₃, H₂O)',
      structureImage:null,
      answerText:'cis-1-methylcyclohexane-1,2-diol (racemic mixture of R,R and S,S). OsO₄ hydroxylation is syn addition — both OH groups add from the same face.',
      difficulty:3, tags:['dihydroxylation','OsO4','syn-addition','diol','stereochemistry'] },
  
    // 8.8 Ozonolysis
    { id:'c8-8-01', chapter:8, lesson:'8.8', topic:'Alkene Cleavage: Ozonolysis',
      type:'draw-product', format:'give-reagents',
      prompt:'Draw all products of ozonolysis.',
      reagents:'cyclododecyne  →  1) O₃  →  2) H₂O',
      structureImage:null,
      answerText:'Dodecanedioic acid (a 12-carbon dicarboxylic acid, HOOC-(CH₂)₁₀-COOH). Ozonolysis of a cyclic alkene with H₂O workup cleaves the ring and gives two carbonyl groups (aldehydes or acids depending on workup).',
      difficulty:3, tags:['ozonolysis','O3','ring-cleavage','carbonyl','dicarboxylic-acid'] },
  
    { id:'c8-8-02', chapter:8, lesson:'8.8', topic:'Alkene Cleavage: Ozonolysis',
      type:'draw-product', format:'give-reagents',
      prompt:'Draw the product(s) and identify whether it is a meso compound.',
      reagents:'bicyclo[2.2.1]hept-2-ene (norbornene)  →  1) O₃  →  2) Zn, H₂O',
      structureImage:null,
      answerText:'A bicyclic dialdehyde (meso compound). Zn/H₂O workup gives aldehyde. The product has an internal plane of symmetry — it is a meso compound.',
      difficulty:4, tags:['ozonolysis','meso','bicyclic','norbornene','Zn-workup'] },
  
    // 8.9 Synthesis Problems
    { id:'c8-syn-01', chapter:8, lesson:'8.9', topic:'Synthesis: Multi-Step',
      type:'draw-synthesis', format:'retrosynthesis',
      prompt:'Design a multi-step synthesis. Show all reagents and intermediates.',
      reagents:'Starting material: cyclohexene  →  Target: cyclohexyl azide (N₃ on ring)',
      structureImage:null,
      answerText:'cyclohexene → (Cl₂/hν) → chlorocyclohexane → (NaN₃/DMSO, SN2) → cyclohexyl azide. The SN2 gives inversion at the reaction center.',
      difficulty:3, tags:['synthesis','multi-step','radical-halogenation','SN2','azide'] },
  
    { id:'c8-syn-02', chapter:8, lesson:'8.9', topic:'Synthesis: Multi-Step',
      type:'draw-synthesis', format:'retrosynthesis',
      prompt:'Design a synthesis for the target from the given starting material. Show all steps.',
      reagents:'From: methylenecyclohexane  →  To: 1-methylcyclohexanol',
      structureImage:null,
      answerText:'methylenecyclohexane → (Br₂/hν) → (bromomethyl)cyclohexane → (KOH/HOCH₂CH₃, E2) → methylenecyclohexene → (H₂SO₄/H₂O, Markovnikov) → 1-methylcyclohexanol.',
      difficulty:4, tags:['synthesis','multi-step','radical','E2','Markovnikov','alcohol'] },
  
    { id:'c8-syn-03', chapter:8, lesson:'8.9', topic:'Synthesis: Multi-Step',
      type:'draw-synthesis', format:'retrosynthesis',
      prompt:'Design a synthesis. Show all reagents, intermediates, and stereochemistry.',
      reagents:'From: (R)-1-phenyl-1-butanol  →  To: (S)-1-phenyl-1-butanethiol',
      structureImage:null,
      answerText:'(R)-alcohol → TsCl/pyridine → (R)-tosylate → NaSH/DMF (SN2, inversion) → (S)-thiol. TsCl converts OH to a good leaving group without disturbing the stereocenter; SN2 with NaSH inverts to give S configuration.',
      difficulty:4, tags:['synthesis','inversion','tosylate','thiol','SN2','stereochemistry'] },
  
    { id:'c8-syn-04', chapter:8, lesson:'8.9', topic:'Synthesis: Multi-Step',
      type:'draw-synthesis', format:'retrosynthesis',
      prompt:'Design a multi-step synthesis for 4-octanone from acetylene and 1-propanol.',
      reagents:'acetylene + 1-propanol  →  4-octanone',
      structureImage:null,
      answerText:'1-propanol → TsCl/pyr → 1-propyl tosylate. Acetylene → NaNH₂/NH₃ → acetylide anion → + propyl tosylate → hex-1-yne. hex-1-yne → NaNH₂ → hexyne anion → + propyl tosylate → 4-octyne. 4-octyne → H₂O/H₂SO₄/HgSO₄ (Markovnikov hydration of internal alkyne) → 4-octanone.',
      difficulty:5, tags:['synthesis','multi-step','acetylide','alkyne','ketone','Markovnikov'] },
  
    // 8.12–8.13 Reaction Stereochemistry
    { id:'c8-12-01', chapter:8, lesson:'8.12', topic:'Reaction Stereochemistry',
      type:'draw-product', format:'give-reagents',
      prompt:'Draw the product(s) and predict whether the product(s) are chiral, racemic, or meso.',
      reagents:'1-methylcyclopentene  +  Br₂  +  H₂O  →',
      structureImage:null,
      answerText:'trans-2-bromo-1-methylcyclopentanol (racemic mixture of R,R and S,S enantiomers). Anti addition via bromonium ion; water attacks from opposite face.',
      difficulty:4, tags:['halohydrin','stereochemistry','racemic','anti-addition','bromonium'] },
  
    // ════════════════════════════════════════════════════════════════════
    // UNIT 3 — Alkynes
    // ════════════════════════════════════════════════════════════════════
  
    { id:'c8-alk-01', chapter:8, lesson:'8.6', topic:'Alkynes: Reduction',
      type:'draw-product', format:'give-reagents',
      prompt:'Draw all products and indicate the stereochemistry of each.',
      reagents:'4-octyne  →  a) H₂/Lindlar\'s Pd  →  b) Na/NH₃  →  c) 2H₂/Ni',
      structureImage:null,
      answerText:'a) cis-4-octene (Lindlar\'s — syn addition of H₂, cis alkene). b) trans-4-octene (dissolving metal — anti addition, trans alkene). c) octane (full reduction to alkane).',
      difficulty:3, tags:['alkyne','Lindlar','dissolving-metal','syn','anti','cis-trans'] },
  
    { id:'c8-alk-02', chapter:8, lesson:'8.6', topic:'Alkynes: Acidic Hydrogens',
      type:'short-answer', format:'explain',
      prompt:'Why is the terminal C–H of propyne more acidic than that of propene or propane? What base can deprotonate a terminal alkyne? What is the approximate pKa?',
      reagents:'H–C≡C–CH₃  (propyne)',
      structureImage:null,
      answerText:'The sp orbital has more s-character (50%) than sp² (33%) or sp³ (25%), so electrons are held closer to the nucleus → more acidic. pKa ≈ 26. NaNH₂ (NaAmide) is strong enough to deprotonate terminal alkynes (pKa of NH₃ ≈ 38 > 26).',
      difficulty:2, tags:['alkyne','acidity','pKa','sp-orbital','NaNH2','terminal-alkyne'] },
  
    { id:'c8-alk-03', chapter:8, lesson:'8.6', topic:'Alkynes: Synthesis',
      type:'draw-product', format:'give-reagents',
      prompt:'Draw the product of each step and give the final product.',
      reagents:'H–C≡C–H  →  1) NaNH₂/NH₃  →  2) CH₃CH₂Br  →  3) NaNH₂/NH₃  →  4) CH₃CH₂Br  →  H₂/Lindlar\'s Pd  →  Br₂/CHCl₃',
      structureImage:null,
      answerText:'Step 1–2: HC≡C–CH₂CH₃ (but-1-yne). Step 3–4: CH₃CH₂C≡CCH₂CH₃ (hex-3-yne). Lindlar: cis-hex-3-ene. Br₂/CHCl₃: (3R,4S)- and (3S,4R)-3,4-dibromohexane (meso compound + racemic).',
      difficulty:5, tags:['alkyne-synthesis','acetylide','Lindlar','halogenation','meso','multi-step'] },
  
    { id:'c8-alk-04', chapter:8, lesson:'8.6', topic:'Alkynes: Hydration',
      type:'draw-product', format:'give-reagents',
      prompt:'Draw the major product of each reaction and explain the regiochemistry.',
      reagents:'a) propyne + H₂O + H₂SO₄ + HgSO₄  →  b) propyne + 1) BH₃·THF, 2) H₂O₂/NaOH',
      structureImage:null,
      answerText:'a) acetone (CH₃COCH₃) — Markovnikov hydration of internal/terminal alkyne gives ketone. b) propanal (CH₃CH₂CHO) — anti-Markovnikov hydroboration gives aldehyde via vinyl borane.',
      difficulty:3, tags:['alkyne-hydration','Markovnikov','anti-Markovnikov','ketone','aldehyde','HgSO4'] },
  ];
  