import React, {
  useState, useEffect, useRef, useCallback,
  forwardRef, useImperativeHandle,
} from 'react';

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────
const Ico = ({ d, size=16, sw=2, fill='none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ display:'inline-block', verticalAlign:'middle', flexShrink:0 }}>
    {Array.isArray(d) ? d.map((p,i) => <path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);
const IBeaker  = () => <Ico size={22} d={["M9 3h6l1 7H8L9 3z","M8 10l-4 10h16L16 10"]} />;
const IBook    = ({size=14}) => <Ico size={size} d={["M2 3h9v18H2z","M13 3h9v18h-9z"]} />;
const IChevD   = ({size=13}) => <Ico size={size} sw={2.5} d="M6 9l6 6 6-6" />;
const IChevR   = ({size=13}) => <Ico size={size} sw={2.5} d="M9 18l6-6-6-6" />;
const IPlay    = ({size=12}) => <Ico size={size} fill="currentColor" stroke="none" d="M5 3l14 9-14 9V3z" />;
const IBookTxt = ({size=12}) => <Ico size={size} d={["M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z","M8 7h8","M8 11h8","M8 15h5"]} />;
const IUndo    = ({size=16}) => <Ico size={size} sw={2.5} d={["M3 7v6h6","M3 13C5 7 10 4 16 6a9 9 0 0 1 5 8"]} />;
const IRedo    = ({size=16}) => <Ico size={size} sw={2.5} d={["M21 7v6h-6","M21 13C19 7 14 4 8 6a9 9 0 0 0-5 8"]} />;
const ITrash   = ({size=16}) => <Ico size={size} d={["M3 6h18","M19 6l-1 14H6L5 6","M9 6V4h6v2","M10 11v6","M14 11v6"]} />;
const IDl      = ({size=14}) => <Ico size={size} sw={2.5} d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"]} />;
const IRotate  = ({size=12}) => <Ico size={size} d={["M21 2v6h-6","M21 13a9 9 0 1 1-3-7.7L21 8"]} />;
const IFlip    = ({size=12}) => <Ico size={size} d={["M3 7l9-5 9 5","M3 17l9 5 9-5","M12 2v20"]} />;
const IType    = ({size=13}) => <Ico size={size} d={["M4 7V4h16v3","M9 20h6","M12 4v16"]} />;
const IPlus    = ({size=14}) => <Ico size={size} sw={2.5} d="M12 5v14M5 12h14" />;
const IX       = ({size=14,sw=2}) => <Ico size={size} sw={sw} d="M18 6L6 18M6 6l12 12" />;
const IPtr     = ({size=13}) => <Ico size={size} d="M4 2l16 9-7 1-4 7z" />;
const ICheck   = ({size=14,sw=2.5}) => <Ico size={size} sw={sw} d="M20 6L9 17l-5-5" />;
const IArrow   = ({size=15}) => <Ico size={size} sw={2.5} d={["M5 12h14","M15 8l4 4-4 4"]} />;
const IEquil   = ({size=15}) => <Ico size={size} sw={2.5} d={["M4 9h16M18 7l2 2-2 2","M20 15H4M6 13l-2 2 2 2"]} />;
const ICurve   = ({size=15}) => <Ico size={size} sw={2.5} d="M5 18c0-5 4-9 9-9s9 4 9 9" fill="none" />;
const IText    = ({size=15}) => <Ico size={size} d={["M4 6h16","M4 12h10","M4 18h12","M17 14l4 4-4 4"]} />;
const IMol     = ({size=15}) => <Ico size={size} d={["M12 2l4 7h5l-4 5 2 7-7-4-7 4 2-7-4-5h5z"]} />;
const IEye     = ({size=15}) => <Ico size={size} d={["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"]} />;

// ─── QUESTION BANK ───────────────────────────────────────────────────────────
// Sourced from: BYU-Idaho CHEM 351 — Units 2 & 3 practice/exam/review materials
// Answer images should live at /public/answers/<id>.png
// Structure images at /public/structures/<id>.png
// Where no image exists yet, answerText provides a text fallback.

const questionBank = [

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
  // UNIT 3 — Alkynes (Ch 8 continuation / Unit 3 material)
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

// ─── Question Generator ───────────────────────────────────────────────────────
function weightByPerformance(pool, topicStats) {
  const weighted = [];
  pool.forEach(q => {
    const stats = topicStats[q.topic] ?? { mastered:0, needsWork:0 };
    const attempts = stats.mastered + stats.needsWork;
    const errorRate = attempts === 0 ? 0.5 : stats.needsWork / attempts;
    const weight = Math.max(1, Math.round(1 + errorRate * 3));
    for (let i = 0; i < weight; i++) weighted.push(q);
  });
  return weighted;
}

function generateQuestion(filter, topicStats, lastId, mode = 'smart') {
  let pool = questionBank.filter(q => {
    if (!filter) return true;
    if (filter.type === 'chapter') return q.chapter === filter.id;
    if (filter.type === 'lesson')  return q.lesson  === filter.id;
    if (filter.type === 'topic')   return q.topic   === filter.topic;
    return true;
  });
  if (pool.length === 0) return null;
  // Avoid repeating the same question twice in a row
  if (pool.length > 1) pool = pool.filter(q => q.id !== lastId);
  if (mode === 'smart') pool = weightByPerformance(pool, topicStats);
  return pool[Math.floor(Math.random() * pool.length)];
}

const TYPE_HEADERS = {
  'draw-product':   'Draw the major product of the following reaction.',
  'draw-mechanism': 'Show the complete mechanism using curved arrows.',
  'draw-structure': 'Draw the structure of the following compound.',
  'draw-synthesis': 'Design a multi-step synthesis.',
  'name-compound':  'Provide the IUPAC name (with all stereodescriptors) for this compound.',
  'identify':       'Identify/classify the following.',
  'short-answer':   'Answer the following question.',
  'rank':           'Rank the following compounds as directed.',
};

// ─── Grid snapping ────────────────────────────────────────────────────────────
const GW = 86.6025, GH = 50;
const snapToGrid = (cx, cy, panX, panY) => {
  const rx = cx - panX, ry = cy - panY;
  const col = Math.round(rx / GW), row = Math.round(ry / GH);
  let best = null, bestD = Infinity;
  for (let dc = -2; dc <= 2; dc++) {
    for (let dr = -3; dr <= 3; dr++) {
      const c = col+dc, r = row+dr;
      const gx = c*GW + (((r%2)+2)%2)*GW/2;
      const gy = r*GH;
      const d = Math.hypot(rx-gx, ry-gy);
      if (d < bestD) { bestD=d; best={x:gx,y:gy}; }
    }
  }
  return best;
};

// ─── Constants ────────────────────────────────────────────────────────────────
const BOND_LEN=50, SNAP_DIST=15, BOND_OFFSET=4;
const generateId = () => Math.random().toString(36).substring(2,9);
const labelRadius = (label) => { if (!label||label==='C') return 0; return label.length>1?22:14; };
const ELEMENT_COLORS = { O:'#ef4444',N:'#3b82f6',S:'#eab308',F:'#22c55e',Cl:'#22c55e',Br:'#a16207',P:'#f97316',I:'#8b5cf6' };

const makeInitialPage = (name) => {
  const firstNode={id:generateId(),x:0,y:0,label:'C'};
  const baseState={nodes:[firstNode],edges:[],activeId:firstNode.id,gridOrientation:'vertical',annotations:[]};
  return {id:generateId(),name,...baseState,prevActiveId:null,lastAngle:120,history:[baseState],historyIdx:0};
};

function arrowHead(ctx,x1,y1,x2,y2,size=10) {
  const angle=Math.atan2(y2-y1,x2-x1);
  ctx.beginPath(); ctx.moveTo(x2,y2);
  ctx.lineTo(x2-size*Math.cos(angle-0.4),y2-size*Math.sin(angle-0.4));
  ctx.lineTo(x2-size*Math.cos(angle+0.4),y2-size*Math.sin(angle+0.4));
  ctx.closePath(); ctx.fill();
}
function drawCurvedArrow(ctx,x1,y1,x2,y2,cpx,cpy,color='#1e293b') {
  ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(x1,y1);ctx.quadraticCurveTo(cpx,cpy,x2,y2);ctx.stroke();
  const tx=x2-cpx,ty=y2-cpy,len=Math.hypot(tx,ty),ux=tx/len,uy=ty/len,hs=10;
  ctx.beginPath();ctx.moveTo(x2,y2);
  ctx.lineTo(x2-hs*(ux-0.4*(-uy)),y2-hs*(uy-0.4*ux));
  ctx.lineTo(x2-hs*(ux+0.4*(-uy)),y2-hs*(uy+0.4*ux));
  ctx.closePath();ctx.fill();
}

// ─── SkeletonCanvas ───────────────────────────────────────────────────────────
const SkeletonCanvas = forwardRef(({onInteract,activeTool,setActiveTool},ref) => {
  const containerRef=useRef(null), canvasRef=useRef(null), annoRef=useRef(null);
  const [pages,setPages]=useState(()=>[makeInitialPage('Page 1')]);
  const [activePageIdx,setActivePageIdx]=useState(0);
  const activePage=pages[activePageIdx]??pages[0];
  const {nodes,edges,activeId,prevActiveId,gridOrientation,lastAngle,history,historyIdx,annotations}=activePage;
  const [pan,setPan]=useState({x:0,y:0});
  const [mouseDown,setMouseDown]=useState(null);
  const [isPanning,setIsPanning]=useState(false);
  const [dimensions,setDimensions]=useState({width:800,height:600});
  const [isEditingLabel,setIsEditingLabel]=useState(false);
  const [editValue,setEditValue]=useState('');
  const [annoStart,setAnnoStart]=useState(null);
  const [annoPreview,setAnnoPreview]=useState(null);
  const [pendingTextPos,setPendingTextPos]=useState(null);
  const [annoTextValue,setAnnoTextValue]=useState('');

  useEffect(()=>{ if(!containerRef.current)return; const w=containerRef.current.clientWidth,h=containerRef.current.clientHeight; setDimensions({width:w,height:h}); setPan({x:w/2,y:h/2}); },[]);
  useEffect(()=>{ const fn=()=>{if(containerRef.current)setDimensions({width:containerRef.current.clientWidth,height:containerRef.current.clientHeight});}; window.addEventListener('resize',fn); return ()=>window.removeEventListener('resize',fn); },[]);

  const updateGraph=useCallback((nN,nE,nAId,oLA,oGO,oPА,nAnno)=>{
    setPages(prev=>{
      const np=[...prev]; const pg=np[activePageIdx];
      const nLA=oLA!==undefined?oLA:pg.lastAngle;
      const nGO=oGO!==undefined?oGO:pg.gridOrientation;
      const nPA=oPА!==undefined?oPА:pg.prevActiveId;
      const nAn=nAnno!==undefined?nAnno:pg.annotations;
      const snap={nodes:nN,edges:nE,activeId:nAId,gridOrientation:nGO,annotations:nAn};
      const nH=[...pg.history.slice(0,pg.historyIdx+1),snap];
      np[activePageIdx]={...pg,nodes:nN,edges:nE,activeId:nAId,lastAngle:nLA,gridOrientation:nGO,prevActiveId:nPA,history:nH,historyIdx:nH.length-1,annotations:nAn};
      return np;
    });
  },[activePageIdx]);

  const addPage=()=>{const p=makeInitialPage(`Page ${pages.length+1}`);setPages(prev=>[...prev,p]);setActivePageIdx(pages.length);};
  const deletePage=(e,idx)=>{e.stopPropagation();if(pages.length<=1)return;setPages(prev=>prev.filter((_,i)=>i!==idx));setActivePageIdx(prev=>prev>=pages.length-1?pages.length-2:prev>idx?prev-1:prev);};
  const addFragment=useCallback(()=>{const j=()=>Math.random()*40-20,nId=generateId();updateGraph([...nodes,{id:nId,x:-pan.x+dimensions.width/2+j(),y:-pan.y+dimensions.height/2+j(),label:'C'}],edges,nId);},[nodes,edges,pan,dimensions,updateGraph]);

  const undo=useCallback(()=>{setPages(prev=>{const pg=prev[activePageIdx];if(pg.historyIdx<=0)return prev;const st=pg.history[pg.historyIdx-1];const np=[...prev];np[activePageIdx]={...pg,...st,gridOrientation:st.gridOrientation??'vertical',annotations:st.annotations??[],historyIdx:pg.historyIdx-1};return np;});},[activePageIdx]);
  const redo=useCallback(()=>{setPages(prev=>{const pg=prev[activePageIdx];if(pg.historyIdx>=pg.history.length-1)return prev;const st=pg.history[pg.historyIdx+1];const np=[...prev];np[activePageIdx]={...pg,...st,gridOrientation:st.gridOrientation??'vertical',annotations:st.annotations??[],historyIdx:pg.historyIdx+1};return np;});},[activePageIdx]);
  const clearCanvas=useCallback(()=>{const fn={id:generateId(),x:0,y:0,label:'C'};updateGraph([fn],[],fn.id,gridOrientation==='horizontal'?30:120,gridOrientation,null,[]);},[gridOrientation,updateGraph]);
  useImperativeHandle(ref,()=>({clear:clearCanvas,undo,redo}));

  const deleteLastLine=useCallback(()=>{if(!activeId)return;const bI=(()=>{if(prevActiveId!==null){const i=edges.findIndex(e=>(e.n1===activeId&&e.n2===prevActiveId)||(e.n2===activeId&&e.n1===prevActiveId));if(i!==-1)return i;}for(let i=edges.length-1;i>=0;i--)if(edges[i].n1===activeId||edges[i].n2===activeId)return i;return -1;})();if(bI===-1){if(nodes.length<=1)clearCanvas();return;}const rE=edges[bI];const nE=edges.filter((_,i)=>i!==bI);const rId=rE.n1===activeId?rE.n2:rE.n1;const tip=!nE.some(e=>e.n1===activeId||e.n2===activeId);const nN=tip?nodes.filter(n=>n.id!==activeId):nodes;if(nN.length===0){clearCanvas();return;}const nAId=nN.some(n=>n.id===rId)?rId:nN[nN.length-1].id;const pOR=edges.filter((e,i)=>i!==bI&&(e.n1===rId||e.n2===rId)).map(e=>e.n1===rId?e.n2:e.n1).find(id=>nN.some(n=>n.id===id))??null;updateGraph(nN,nE,nAId,undefined,undefined,pOR);},[activeId,prevActiveId,nodes,edges,clearCanvas,updateGraph]);
  const BOND_CYCLE=[1,2,3,'wedge','dash'];
  const cycleBond=useCallback(()=>{if(!activeId)return;const fE=(a,b)=>edges.findIndex(e=>(e.n1===a&&e.n2===b)||(e.n2===a&&e.n1===b));let idx=prevActiveId!==null?fE(activeId,prevActiveId):-1;if(idx===-1)for(let i=edges.length-1;i>=0;i--){if(edges[i].n1===activeId||edges[i].n2===activeId){idx=i;break;}}if(idx===-1)return;const cur=edges[idx].order;const nxt=BOND_CYCLE[(BOND_CYCLE.indexOf(cur)+1)%BOND_CYCLE.length];updateGraph(nodes,edges.map((e,i)=>i===idx?{...e,order:nxt}:e),activeId);},[activeId,prevActiveId,edges,nodes,updateGraph]);
  const setAtomLabel=useCallback((label)=>{if(!activeId)return;updateGraph(nodes.map(n=>n.id===activeId?{...n,label}:n),edges,activeId);},[activeId,nodes,edges,updateGraph]);
  const rotateEverything=useCallback(()=>{const xs=nodes.map(n=>n.x),ys=nodes.map(n=>n.y);const cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;updateGraph(nodes.map(n=>({...n,x:cx-(n.y-cy),y:cy+(n.x-cx)})),edges,activeId,(lastAngle+90)%360,gridOrientation==='horizontal'?'vertical':'horizontal');},[nodes,edges,activeId,lastAngle,gridOrientation,updateGraph]);
  const flipMolecule=useCallback(()=>{if(!activeId)return;const cI=new Set();const q=[activeId];while(q.length){const c=q.pop();if(cI.has(c))continue;cI.add(c);edges.forEach(e=>{if(e.n1===c&&!cI.has(e.n2))q.push(e.n2);if(e.n2===c&&!cI.has(e.n1))q.push(e.n1);});}const cN=nodes.filter(n=>cI.has(n.id));const xs=cN.map(n=>n.x);const cx=(Math.min(...xs)+Math.max(...xs))/2;updateGraph(nodes.map(n=>cI.has(n.id)?{...n,x:2*cx-n.x}:n),edges,activeId);},[activeId,nodes,edges,updateGraph]);
  const navigateTo=useCallback((tA)=>{if(!activeId)return;const ac=nodes.find(n=>n.id===activeId);if(!ac)return;const nIds=edges.filter(e=>e.n1===activeId||e.n2===activeId).map(e=>e.n1===activeId?e.n2:e.n1);let bN=null,bD=Infinity;nodes.filter(n=>nIds.includes(n.id)).forEach(n=>{const aD=(Math.atan2(ac.y-n.y,n.x-ac.x)*180/Math.PI+360)%360;let d=Math.abs(aD-tA);if(d>180)d=360-d;if(d<bD){bD=d;bN=n;}});if(bN&&bD<=90)updateGraph(nodes,edges,bN.id,tA,gridOrientation,activeId);},[activeId,nodes,edges,gridOrientation,updateGraph]);
  const drawTo=useCallback((aD)=>{if(!activeId)return;const ac=nodes.find(n=>n.id===activeId);if(!ac)return;const rad=aD*Math.PI/180;const tx=ac.x+BOND_LEN*Math.cos(rad),ty=ac.y-BOND_LEN*Math.sin(rad);const sn=nodes.find(n=>n.id!==activeId&&Math.hypot(n.x-tx,n.y-ty)<SNAP_DIST);const tg=sn??{id:generateId(),x:tx,y:ty,label:'C'};const nN=sn?nodes:[...nodes,tg];const aB=edges.some(e=>(e.n1===activeId&&e.n2===tg.id)||(e.n2===activeId&&e.n1===tg.id));const nE=aB?edges:[...edges,{id:generateId(),n1:activeId,n2:tg.id,order:1}];updateGraph(nN,nE,tg.id,aD,gridOrientation,activeId);},[activeId,nodes,edges,gridOrientation,updateGraph]);

  const handleKeyDown=useCallback((e)=>{onInteract?.();const tn=document.activeElement.tagName;if(!isEditingLabel&&(tn==='INPUT'||tn==='TEXTAREA'))return;if(isEditingLabel){if(e.key==='Enter'){setAtomLabel(editValue.trim()||'C');setIsEditingLabel(false);e.preventDefault();}if(e.key==='Escape'){setIsEditingLabel(false);e.preventDefault();}return;}if(activeTool!=='molecule')return;if(e.ctrlKey||e.metaKey){if(e.key==='z'){e.shiftKey?redo():undo();e.preventDefault();}return;}const nA={'9':30,'8':90,'7':150,'6':0,'4':180,'3':330,'2':270,'1':210};if(nA[e.key]!==undefined){e.preventDefault();e.shiftKey?navigateTo(nA[e.key]):drawTo(nA[e.key]);return;}switch(e.key){case ' ':cycleBond();e.preventDefault();break;case 'Enter':{const an=nodes.find(n=>n.id===activeId);setEditValue(an?.label==='C'?'':(an?.label??''));setIsEditingLabel(true);e.preventDefault();break;}case 'Backspace':case 'Delete':deleteLastLine();e.preventDefault();break;case 'c':case 'C':setAtomLabel('C');break;case 'o':case 'O':setAtomLabel('O');break;case 'n':case 'N':setAtomLabel('N');break;case 'f':case 'F':setAtomLabel('F');break;case 'p':case 'P':setAtomLabel('P');break;case 's':case 'S':setAtomLabel('S');break;case 'b':case 'B':setAtomLabel('B');break;case 'i':case 'I':setAtomLabel('I');break;case 'h':case 'H':setAtomLabel('H');break;default:break;}},[isEditingLabel,editValue,drawTo,navigateTo,cycleBond,deleteLastLine,setAtomLabel,undo,redo,nodes,activeId,activeTool]);

  const getCC=useCallback((e)=>{const r=canvasRef.current.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};},[]);
  const DRAG_THRESHOLD=6;
  const handleMouseDown=useCallback((e)=>{onInteract?.();if(!canvasRef.current)return;const{x:cx,y:cy}=getCC(e);const mx=cx-pan.x,my=cy-pan.y;if(activeTool==='molecule'){const sN=nodes.find(n=>Math.hypot(n.x-mx,n.y-my)<SNAP_DIST*1.5);if(sN){updateGraph(nodes,edges,sN.id,undefined,undefined,activeId);}else{const sg=snapToGrid(cx,cy,pan.x,pan.y);setMouseDown({x:e.clientX,y:e.clientY,canvasX:sg.x,canvasY:sg.y});}}else if(activeTool==='text'){setPendingTextPos({x:cx,y:cy});setAnnoTextValue('');}else{setAnnoStart({x:cx,y:cy});setAnnoPreview({x:cx,y:cy});}},[pan,nodes,edges,activeId,updateGraph,onInteract,activeTool,getCC]);
  const handleMouseMove=useCallback((e)=>{if(activeTool==='molecule'){if(mouseDown&&!isPanning&&Math.hypot(e.clientX-mouseDown.x,e.clientY-mouseDown.y)>DRAG_THRESHOLD){setIsPanning(true);setMouseDown(null);}if(isPanning)setPan(p=>({x:p.x+e.movementX,y:p.y+e.movementY}));}else if(annoStart){const{x:cx,y:cy}=getCC(e);setAnnoPreview({x:cx,y:cy});}},[mouseDown,isPanning,activeTool,annoStart,getCC]);
  const handleMouseUp=useCallback((e)=>{if(activeTool==='molecule'){if(mouseDown){const nId=generateId();updateGraph([...nodes,{id:nId,x:mouseDown.canvasX,y:mouseDown.canvasY,label:'C'}],edges,nId,undefined,undefined,null);}setMouseDown(null);setIsPanning(false);}else if(activeTool!=='text'&&annoStart){const{x:cx,y:cy}=getCC(e);if(Math.hypot(cx-annoStart.x,cy-annoStart.y)<5){setAnnoStart(null);setAnnoPreview(null);return;}const nA={id:generateId(),type:activeTool,x1:annoStart.x,y1:annoStart.y,x2:cx,y2:cy};if(activeTool==='curved'){const mX=(annoStart.x+cx)/2,mY=(annoStart.y+cy)/2;const dx=cx-annoStart.x,dy=cy-annoStart.y,len=Math.hypot(dx,dy);nA.cpx=mX-dy/len*50;nA.cpy=mY+dx/len*50;}updateGraph(nodes,edges,activeId,undefined,undefined,undefined,[...annotations,nA]);setAnnoStart(null);setAnnoPreview(null);}},[activeTool,mouseDown,annoStart,nodes,edges,activeId,annotations,updateGraph,getCC]);

  // Molecule canvas render
  useEffect(()=>{const cv=canvasRef.current;if(!cv)return;const dpr=window.devicePixelRatio||1;cv.width=dimensions.width*dpr;cv.height=dimensions.height*dpr;cv.style.width=`${dimensions.width}px`;cv.style.height=`${dimensions.height}px`;const ctx=cv.getContext('2d');ctx.scale(dpr,dpr);ctx.clearRect(0,0,dimensions.width,dimensions.height);ctx.lineCap='round';ctx.lineJoin='round';
    const cE=(n1,n2)=>{const th=Math.atan2(n2.y-n1.y,n2.x-n1.x);return{x1:n1.x+pan.x+Math.cos(th)*labelRadius(n1.label),y1:n1.y+pan.y+Math.sin(th)*labelRadius(n1.label),x2:n2.x+pan.x-Math.cos(th)*labelRadius(n2.label),y2:n2.y+pan.y-Math.sin(th)*labelRadius(n2.label),theta:th};};
    edges.forEach(edge=>{const n1=nodes.find(n=>n.id===edge.n1),n2=nodes.find(n=>n.id===edge.n2);if(!n1||!n2)return;const{x1,y1,x2,y2,theta:th}=cE(n1,n2);const ox=-Math.sin(th)*BOND_OFFSET,oy=Math.cos(th)*BOND_OFFSET;ctx.strokeStyle='#1e293b';ctx.lineWidth=2.5;if(edge.order===1){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}else if(edge.order===2){ctx.beginPath();ctx.moveTo(x1+ox,y1+oy);ctx.lineTo(x2+ox,y2+oy);ctx.moveTo(x1-ox,y1-oy);ctx.lineTo(x2-ox,y2-oy);ctx.stroke();}else if(edge.order===3){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.moveTo(x1+ox*1.8,y1+oy*1.8);ctx.lineTo(x2+ox*1.8,y2+oy*1.8);ctx.moveTo(x1-ox*1.8,y1-oy*1.8);ctx.lineTo(x2-ox*1.8,y2-oy*1.8);ctx.stroke();}else if(edge.order==='wedge'){const hw=5.5,px=-Math.sin(th),py=Math.cos(th);ctx.fillStyle='#1e293b';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2+px*hw,y2+py*hw);ctx.lineTo(x2-px*hw,y2-py*hw);ctx.closePath();ctx.fill();}else if(edge.order==='dash'){const px=-Math.sin(th),py=Math.cos(th);ctx.lineWidth=1.8;ctx.beginPath();for(let d=0;d<=6;d++){const t=d/6,bx=x1+(x2-x1)*t,by=y1+(y2-y1)*t,half=5.5*t;ctx.moveTo(bx+px*half,by+py*half);ctx.lineTo(bx-px*half,by-py*half);}ctx.stroke();}});
    nodes.forEach(n=>{const x=n.x+pan.x,y=n.y+pan.y;if(n.id===activeId){const hR=n.label==='C'?18:n.label.length>1?26:20;ctx.fillStyle='rgba(59,130,246,0.12)';ctx.strokeStyle='#3b82f6';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,hR,0,Math.PI*2);ctx.fill();ctx.stroke();}if(n.label==='C')return;const color=ELEMENT_COLORS[n.label[0]]??'#1e293b';ctx.font='bold 18px Georgia, serif';const fw=ctx.measureText(n.label).width;ctx.fillStyle='#f8fafc';ctx.beginPath();ctx.ellipse(x,y,fw/2+4,13,0,0,Math.PI*2);ctx.fill();let cx2=x-fw/2;n.label.split(/(\d+)/).forEach(part=>{if(!part)return;const isD=/^\d+$/.test(part);ctx.font=isD?'bold 12px Georgia, serif':'bold 18px Georgia, serif';ctx.fillStyle=color;ctx.textAlign='left';ctx.textBaseline=isD?'alphabetic':'middle';const tw=ctx.measureText(part).width;ctx.fillText(part,cx2,isD?y+7:y+1);cx2+=tw;});});},[nodes,edges,activeId,pan,dimensions]);

  // Annotation canvas render
  useEffect(()=>{const cv=annoRef.current;if(!cv)return;const dpr=window.devicePixelRatio||1;cv.width=dimensions.width*dpr;cv.height=dimensions.height*dpr;cv.style.width=`${dimensions.width}px`;cv.style.height=`${dimensions.height}px`;const ctx=cv.getContext('2d');ctx.scale(dpr,dpr);ctx.clearRect(0,0,dimensions.width,dimensions.height);
    const all=[...annotations];
    if(annoStart&&annoPreview&&activeTool!=='molecule'&&activeTool!=='text'){const dx=annoPreview.x-annoStart.x,dy=annoPreview.y-annoStart.y,len=Math.hypot(dx,dy)+0.001;all.push({id:'__prev__',type:activeTool,x1:annoStart.x,y1:annoStart.y,x2:annoPreview.x,y2:annoPreview.y,cpx:activeTool==='curved'?(annoStart.x+annoPreview.x)/2-dy/len*50:undefined,cpy:activeTool==='curved'?(annoStart.y+annoPreview.y)/2+dx/len*50:undefined,preview:true});}
    all.forEach(a=>{const color=a.preview?'#94a3b8':'#1e293b';ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=2.5;ctx.lineCap='round';if(a.type==='straight'){ctx.beginPath();ctx.moveTo(a.x1,a.y1);ctx.lineTo(a.x2,a.y2);ctx.stroke();arrowHead(ctx,a.x1,a.y1,a.x2,a.y2,11);}else if(a.type==='equilibrium'){const th=Math.atan2(a.y2-a.y1,a.x2-a.x1);const px=-Math.sin(th)*4,py=Math.cos(th)*4;ctx.beginPath();ctx.moveTo(a.x1+px,a.y1+py);ctx.lineTo(a.x2+px,a.y2+py);ctx.stroke();arrowHead(ctx,a.x1+px,a.y1+py,a.x2+px,a.y2+py,10);ctx.beginPath();ctx.moveTo(a.x2-px,a.y2-py);ctx.lineTo(a.x1-px,a.y1-py);ctx.stroke();arrowHead(ctx,a.x2-px,a.y2-py,a.x1-px,a.y1-py,10);}else if(a.type==='curved'){drawCurvedArrow(ctx,a.x1,a.y1,a.x2,a.y2,a.cpx,a.cpy,color);}else if(a.type==='text'&&a.text){ctx.font='bold 16px Georgia, serif';ctx.fillStyle=color;ctx.textAlign='left';ctx.textBaseline='top';ctx.fillText(a.text,a.x,a.y);}});},[annotations,annoStart,annoPreview,activeTool,dimensions]);

  const exportPNG=useCallback(()=>{const cv=canvasRef.current;if(!cv)return;const dpr=window.devicePixelRatio||1;const off=document.createElement('canvas');off.width=cv.width;off.height=cv.height;const ctx=off.getContext('2d');ctx.scale(dpr,dpr);ctx.fillStyle='#f8fafc';ctx.fillRect(0,0,dimensions.width,dimensions.height);ctx.drawImage(cv,0,0,dimensions.width,dimensions.height);if(annoRef.current)ctx.drawImage(annoRef.current,0,0,dimensions.width,dimensions.height);const link=document.createElement('a');link.download='molecule.png';link.href=off.toDataURL('image/png');link.click();},[dimensions]);
  const commitText=()=>{if(!pendingTextPos||!annoTextValue.trim())return;updateGraph(nodes,edges,activeId,undefined,undefined,undefined,[...annotations,{id:generateId(),type:'text',x:pendingTextPos.x,y:pendingTextPos.y,text:annoTextValue.trim()}]);setPendingTextPos(null);setAnnoTextValue('');};
  const deleteLastAnnotation=()=>{if(annotations.length===0)return;updateGraph(nodes,edges,activeId,undefined,undefined,undefined,annotations.slice(0,-1));};

  const S={
    root:{display:'flex',width:'100%',height:'100%',background:'#f8fafc',overflow:'hidden'},
    sidebar:{width:214,background:'#fff',borderRight:'1px solid #e2e8f0',display:'flex',flexDirection:'column',flexShrink:0},
    sideHead:{padding:'12px 14px',borderBottom:'1px solid #f1f5f9'},
    sideBody:{padding:10,display:'flex',flexDirection:'column',gap:10,overflowY:'auto',flex:1},
    card:{background:'#f8fafc',borderRadius:8,padding:10,border:'1px solid #e2e8f0'},
    cardTitle:{fontSize:11,fontWeight:600,color:'#64748b',marginBottom:6,display:'flex',alignItems:'center',gap:4},
    kbd:{background:'#fff',border:'1px solid #e2e8f0',borderRadius:3,padding:'0 4px',fontFamily:'monospace',fontSize:10},
    btn:(extra={})=>({padding:'7px 0',background:'#fff',border:'1px solid #e2e8f0',borderRadius:6,fontSize:11,fontWeight:500,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:4,...extra}),
    toolBtn:(active)=>({padding:'8px 0',background:active?'#4A0E0E':'#fff',border:active?'1.5px solid #4A0E0E':'1px solid #e2e8f0',borderRadius:7,fontSize:11,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:5,color:active?'#fff':'#475569',transition:'all 0.15s'}),
    drawing:{flex:1,display:'flex',flexDirection:'column',outline:'none'},
    tabs:{display:'flex',background:'rgba(226,232,240,0.5)',borderBottom:'1px solid #cbd5e1',paddingTop:6,paddingLeft:8,gap:4,overflowX:'auto',flexShrink:0},
  };
  const toolsData=[{id:'molecule',label:'Molecule',icon:<IMol size={13}/>},{id:'straight',label:'Arrow →',icon:<IArrow size={13}/>},{id:'equilibrium',label:'Equil. ⇌',icon:<IEquil size={13}/>},{id:'curved',label:'Curved ↷',icon:<ICurve size={13}/>},{id:'text',label:'Text',icon:<IText size={13}/>}];

  return (
    <div style={S.root}>
      <div style={S.sidebar}>
        <div style={S.sideHead}><div style={{fontWeight:700,fontSize:13,color:'#334155'}}>Drawing Tools</div><div style={{fontSize:11,color:'#94a3b8',marginTop:2}}>Molecule + Annotations</div></div>
        <div style={S.sideBody}>
          <div style={S.card}>
            <div style={S.cardTitle}>Active Tool</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5}}>
              {toolsData.map(t=>(<button key={t.id} onClick={()=>setActiveTool(t.id)} style={S.toolBtn(activeTool===t.id)}>{t.icon} {t.label}</button>))}
            </div>
          </div>
          {activeTool==='molecule'&&(<div style={S.card}><div style={S.cardTitle}><IType size={12}/> Groups</div><div style={{display:'flex',flexWrap:'wrap',gap:4}}>{['OH','HO','NH2','COOH','CH3','Ph','Cl','Br','NO2','CHO'].map(g=>(<button key={g} onClick={()=>setAtomLabel(g)} style={{padding:'2px 7px',background:'#fff',border:'1px solid #e2e8f0',borderRadius:4,fontSize:11,fontWeight:500,cursor:'pointer'}}>{g}</button>))}</div></div>)}
          {activeTool==='molecule'&&(<div style={S.card}><div style={S.cardTitle}><IPtr size={12}/> Shortcuts</div>{[['Draw bond','1–9'],['Navigate','Shift+Num'],['Cycle bond','Space'],['Label','Enter'],['Delete','Del'],['Undo/Redo','Ctrl+Z/⇧Z']].map(([l,k])=>(<div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5,fontSize:11,color:'#64748b'}}><span>{l}</span><kbd style={{...S.kbd,padding:'1px 5px',color:'#94a3b8',whiteSpace:'nowrap'}}>{k}</kbd></div>))}<div style={{borderTop:'1px solid #e2e8f0',marginTop:8,paddingTop:8}}><div style={{fontSize:10,color:'#94a3b8',marginBottom:5}}>Bond cycle</div><div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{[['─','Single'],['═','Double'],['≡','Triple'],['▶','Wedge'],['┅▶','Dash']].map(([s,d])=>(<div key={d} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}><span style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:3,padding:'1px 5px',fontSize:12,fontFamily:'monospace'}}>{s}</span><span style={{fontSize:9,color:'#94a3b8'}}>{d}</span></div>))}</div></div></div>)}
          {activeTool!=='molecule'&&(<div style={S.card}><div style={S.cardTitle}>How to use</div>{activeTool==='text'&&<div style={{fontSize:11,color:'#64748b'}}>Click anywhere to place a text label.</div>}{activeTool==='straight'&&<div style={{fontSize:11,color:'#64748b'}}>Click and drag to draw a reaction arrow →</div>}{activeTool==='equilibrium'&&<div style={{fontSize:11,color:'#64748b'}}>Click and drag to draw an equilibrium arrow ⇌</div>}{activeTool==='curved'&&<div style={{fontSize:11,color:'#64748b'}}>Click and drag to draw a curved electron-pushing arrow.</div>}<button onClick={deleteLastAnnotation} style={{...S.btn({color:'#ef4444',marginTop:8}),width:'100%'}}><ITrash size={12}/> Remove Last</button></div>)}
          <div style={{marginTop:'auto',display:'flex',flexDirection:'column',gap:6}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}><button onClick={undo} disabled={historyIdx===0} style={S.btn({opacity:historyIdx===0?0.4:1})}><IUndo size={12}/> Undo</button><button onClick={redo} disabled={historyIdx===history.length-1} style={S.btn({opacity:historyIdx===history.length-1?0.4:1})}><IRedo size={12}/> Redo</button></div>
            {activeTool==='molecule'&&(<div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:5}}><button onClick={addFragment} style={S.btn({background:'#eef2ff',color:'#4f46e5',border:'1px solid #e0e7ff'})}><IPlus size={11}/> Frag.</button><button onClick={rotateEverything} style={S.btn()}><IRotate size={11}/> Rotate</button><button onClick={flipMolecule} style={S.btn()}><IFlip size={11}/> Flip</button></div>)}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}><button onClick={exportPNG} style={S.btn({background:'#f1f5f9'})}><IDl size={12}/> Export</button><button onClick={clearCanvas} style={S.btn({color:'#ef4444'})}><ITrash size={12}/> Clear All</button></div>
          </div>
        </div>
      </div>

      <div style={S.drawing} tabIndex={0} onKeyDown={handleKeyDown}>
        <div style={S.tabs}>
          {pages.map((p,idx)=>(<div key={p.id} onClick={()=>setActivePageIdx(idx)} style={{position:'relative',padding:'5px 12px',fontSize:12,fontWeight:500,border:'1px solid',borderBottom:'none',borderRadius:'6px 6px 0 0',display:'flex',alignItems:'center',gap:6,cursor:'pointer',borderColor:idx===activePageIdx?'#cbd5e1':'transparent',background:idx===activePageIdx?'#f8fafc':'rgba(241,245,249,0.5)',color:idx===activePageIdx?'#2563eb':'#64748b'}}>{p.name}{pages.length>1&&(<button onClick={e=>deletePage(e,idx)} style={{background:'none',border:'none',cursor:'pointer',padding:2,color:'#94a3b8',display:'flex',borderRadius:'50%'}}><IX size={9} sw={2.5}/></button>)}</div>))}
          <button onClick={addPage} style={{marginBottom:4,marginLeft:4,padding:'4px 8px',background:'none',border:'none',cursor:'pointer',color:'#94a3b8',display:'flex',alignItems:'center'}}><IPlus size={13}/></button>
        </div>
        <div ref={containerRef} style={{flex:1,position:'relative',overflow:'hidden',cursor:activeTool==='molecule'?'crosshair':activeTool==='text'?'text':'crosshair',background:'#f8fafc',backgroundImage:`url("data:image/svg+xml,%3Csvg width='86.6025' height='150' viewBox='0 0 86.6025 150' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='43.3013' cy='0' r='2' fill='%23cbd5e1'/%3E%3Ccircle cx='0' cy='25' r='2' fill='%23cbd5e1'/%3E%3Ccircle cx='86.6025' cy='25' r='2' fill='%23cbd5e1'/%3E%3Ccircle cx='0' cy='75' r='2' fill='%23cbd5e1'/%3E%3Ccircle cx='86.6025' cy='75' r='2' fill='%23cbd5e1'/%3E%3Ccircle cx='43.3013' cy='100' r='2' fill='%23cbd5e1'/%3E%3Ccircle cx='43.3013' cy='150' r='2' fill='%23cbd5e1'/%3E%3C/svg%3E")`,backgroundPosition:`${pan.x}px ${pan.y-25}px`}}>
          <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={()=>{setMouseDown(null);setIsPanning(false);setAnnoStart(null);setAnnoPreview(null);}} style={{position:'absolute',inset:0,zIndex:1,touchAction:'none'}}/>
          <canvas ref={annoRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={()=>{setMouseDown(null);setIsPanning(false);setAnnoStart(null);setAnnoPreview(null);}} style={{position:'absolute',inset:0,zIndex:2,touchAction:'none',pointerEvents:activeTool==='molecule'?'none':'auto'}}/>
          {isEditingLabel&&(()=>{const an=nodes.find(n=>n.id===activeId);if(!an)return null;return(<div style={{position:'absolute',zIndex:40,background:'#fff',padding:8,borderRadius:8,boxShadow:'0 4px 20px rgba(0,0,0,0.15)',border:'1px solid #3b82f6',left:an.x+pan.x,top:an.y+pan.y-52,transform:'translateX(-50%)'}}><input autoFocus value={editValue} onChange={e=>setEditValue(e.target.value)} placeholder="Label" style={{background:'#f8fafc',padding:'6px 12px',border:'1px solid #e2e8f0',borderRadius:6,outline:'none',fontWeight:700,fontSize:16,width:80,textAlign:'center'}} onKeyDown={e=>{if(e.key==='Enter'){setAtomLabel(editValue.trim()||'C');setIsEditingLabel(false);}if(e.key==='Escape'){setIsEditingLabel(false);}e.stopPropagation();}}/><div style={{fontSize:10,color:'#94a3b8',marginTop:4,textAlign:'center'}}>Enter to save · Esc to cancel</div></div>);})()}
          {pendingTextPos&&(<div style={{position:'absolute',zIndex:40,background:'#fff',padding:6,borderRadius:8,boxShadow:'0 4px 20px rgba(0,0,0,0.18)',border:'1px solid #E6B325',left:pendingTextPos.x,top:pendingTextPos.y-40,transform:'translateX(-50%)'}}><input autoFocus value={annoTextValue} onChange={e=>setAnnoTextValue(e.target.value)} placeholder="Type label…" style={{background:'#f8fafc',padding:'6px 10px',border:'1px solid #e2e8f0',borderRadius:6,outline:'none',fontWeight:600,fontSize:14,width:150,textAlign:'left'}} onKeyDown={e=>{if(e.key==='Enter'){commitText();}if(e.key==='Escape'){setPendingTextPos(null);}e.stopPropagation();}}/><div style={{fontSize:10,color:'#94a3b8',marginTop:4,textAlign:'center'}}>Enter to place · Esc to cancel</div></div>)}
        </div>
      </div>
    </div>
  );
});

// ─── Textbook Structure ───────────────────────────────────────────────────────
const textbookData = [
  { id:6, title:"Ch. 6: An Overview of Organic Reactions", lessons:[
    { id:'6.1', title:"6.1 Kinds of Organic Reactions",           topics:["Kinds of Organic Reactions"] },
    { id:'6.2', title:"6.2 How Organic Reactions Occur: Mechanisms", topics:["Reaction Mechanisms"] },
    { id:'6.3', title:"6.3 Polar Reactions",                       topics:["Polar Reactions"] },
    { id:'6.4', title:"6.4 Addition of HBr to Ethylene",          topics:["Addition of HBr to Alkenes"] },
    { id:'6.5', title:"6.5 Using Curved Arrows in Mechanisms",     topics:["Curved Arrows in Mechanisms"] },
    { id:'6.6', title:"6.6 Radical Reactions",                     topics:["Radical Reactions"] },
    { id:'6.7', title:"6.7 Equilibria, Rates, and Energy Changes", topics:["Reaction Equilibria and Rates"] },
    { id:'6.8', title:"6.8 Bond Dissociation Energies",            topics:["Bond Dissociation Energies"] },
    { id:'6.9', title:"6.9 Energy Diagrams and Transition States", topics:["Energy Diagrams"] },
    { id:'6.10',title:"6.10 Describing a Reaction: Intermediates", topics:["Reaction Intermediates"] },
  ]},
  { id:7, title:"Ch. 7: Alkenes — Structure and Reactivity", lessons:[
    { id:'7.1', title:"7.1 Industrial Preparation of Alkenes",     topics:["Preparing Alkenes: Industrial"] },
    { id:'7.2', title:"7.2 Calculating Degree of Unsaturation",    topics:["Degree of Unsaturation"] },
    { id:'7.3', title:"7.3 Naming Alkenes",                        topics:["Naming Alkenes"] },
    { id:'7.4', title:"7.4 Cis–Trans Isomerism in Alkenes",        topics:["Cis-Trans Isomerism"] },
    { id:'7.5', title:"7.5 Alkene Stereochemistry: E,Z",           topics:["E,Z Designation of Alkenes"] },
    { id:'7.6', title:"7.6 Stability of Alkenes",                  topics:["Stability of Alkenes"] },
    { id:'7.7', title:"7.7 Electrophilic Addition Reactions",      topics:["Electrophilic Addition Reactions"] },
    { id:'7.8', title:"7.8 Markovnikov's Rule",                    topics:["Markovnikov's Rule"] },
    { id:'7.9', title:"7.9 Carbocation Structure and Stability",   topics:["Carbocation Structure and Stability"] },
    { id:'7.10',title:"7.10 The Hammond Postulate",                topics:["Hammond Postulate"] },
    { id:'7.11',title:"7.11 Carbocation Rearrangements",           topics:["Carbocation Rearrangements"] },
  ]},
  { id:8, title:"Ch. 8: Alkenes — Reactions and Synthesis", lessons:[
    { id:'8.1', title:"8.1 Preparing Alkenes: Elimination",        topics:["Preparing Alkenes: Elimination"] },
    { id:'8.2', title:"8.2 Halogenation of Alkenes: Addition of X₂", topics:["Halogenation of Alkenes"] },
    { id:'8.3', title:"8.3 Halohydrins from Alkenes: Addition of HO-X", topics:["Halohydrin Formation"] },
    { id:'8.4', title:"8.4 Hydration by Oxymercuration",           topics:["Hydration by Oxymercuration"] },
    { id:'8.5', title:"8.5 Hydration by Hydroboration",            topics:["Hydration by Hydroboration"] },
    { id:'8.6', title:"8.6 Reduction: Hydrogenation & Alkynes",    topics:["Reduction: Hydrogenation","Alkynes: Reduction","Alkynes: Acidic Hydrogens","Alkynes: Synthesis","Alkynes: Hydration"] },
    { id:'8.7', title:"8.7 Oxidation: Epoxidation & Hydroxylation", topics:["Epoxidation and Hydroxylation"] },
    { id:'8.8', title:"8.8 Oxidation: Alkene Cleavage (Ozonolysis)", topics:["Alkene Cleavage: Ozonolysis"] },
    { id:'8.9', title:"8.9 Multi-Step Synthesis",                   topics:["Synthesis: Multi-Step"] },
    { id:'8.12',title:"8.12 Reaction Stereochemistry",              topics:["Reaction Stereochemistry"] },
  ]},
];

// ─── Main Application ─────────────────────────────────────────────────────────
export default function App() {
  const [expandedChapters, setExpandedChapters] = useState(new Set());
  const [selectedFilter, setSelectedFilter]     = useState(null); // {type:'chapter'|'lesson'|'topic', id, topic?}
  const [currentQuestion, setCurrentQuestion]   = useState(null);
  const [lastQuestionId, setLastQuestionId]     = useState(null);
  const [openDropdown, setOpenDropdown]         = useState(null);
  const [showAnswer, setShowAnswer]             = useState(false);
  const [isCorrect, setIsCorrect]               = useState(false);
  const [topicStats, setTopicStats]             = useState({});
  const [activeTool, setActiveTool]             = useState('molecule');
  const canvasRef = useRef(null);

  // Derive topic list for current filter
  const getTopicsForFilter = (filter = selectedFilter) => {
    if (!filter) return [...new Set(questionBank.map(q => q.topic))];
    if (filter.type === 'chapter') {
      const ch = textbookData.find(c => c.id === filter.id);
      return ch ? [...new Set(ch.lessons.flatMap(l => l.topics))] : [];
    }
    if (filter.type === 'lesson') {
      for (const ch of textbookData) {
        const ls = ch.lessons.find(l => l.id === filter.id);
        if (ls) return ls.topics;
      }
    }
    return [];
  };

  const pickNextQuestion = useCallback((filter = selectedFilter) => {
    const q = generateQuestion(filter, topicStats, lastQuestionId, 'smart');
    if (!q) return;
    setCurrentQuestion(q);
    setLastQuestionId(q.id);
    setShowAnswer(false);
    setIsCorrect(false);
    setTimeout(() => canvasRef.current?.clear(), 100);
  }, [selectedFilter, topicStats, lastQuestionId]);

  const handleGradeToggle = () => {
    if (!currentQuestion) return;
    const nextCorrect = !isCorrect;
    setIsCorrect(nextCorrect);
    const topic = currentQuestion.topic;
    setTopicStats(prev => {
      const ex = prev[topic] ?? { mastered:0, needsWork:0 };
      return { ...prev, [topic]: nextCorrect
        ? { mastered:ex.mastered+1, needsWork:Math.max(0,ex.needsWork-1) }
        : { mastered:Math.max(0,ex.mastered-1), needsWork:ex.needsWork+1 } };
    });
  };

  const handleSelectChapter = (chapter) => {
    const filter = { type:'chapter', id:chapter.id, title:chapter.title };
    setSelectedFilter(filter);
    setOpenDropdown(null);
    pickNextQuestion(filter);
  };

  const handleSelectLesson = (lesson) => {
    const filter = { type:'lesson', id:lesson.id, title:lesson.title };
    setSelectedFilter(filter);
    setOpenDropdown(null);
    pickNextQuestion(filter);
  };

  const handleSelectTopic = (topic) => {
    const filter = { type:'topic', topic, title:topic };
    setSelectedFilter(filter);
    setOpenDropdown(null);
    pickNextQuestion(filter);
  };

  const toggleChapter = (id) => {
    const s = new Set(expandedChapters);
    s.has(id) ? s.delete(id) : s.add(id);
    setExpandedChapters(s);
  };

  const masteredTopics  = Object.entries(topicStats).filter(([,s])=>s.mastered>0).sort((a,b)=>b[1].mastered-a[1].mastered);
  const needsWorkTopics = Object.entries(topicStats).filter(([,s])=>s.needsWork>0).sort((a,b)=>b[1].needsWork-a[1].needsWork);

  const dropPanel = { position:'absolute',top:56,left:0,minWidth:260,background:'#fff',border:'1px solid #e2e8f0',boxShadow:'0 8px 24px rgba(0,0,0,0.12)',borderRadius:'0 0 12px 12px',zIndex:50,overflow:'hidden' };
  const hdrBtn = (active,ac='#E6B325',ab='#f8fafc') => ({ height:'100%',padding:'0 14px',background:active?ab:'none',border:'none',borderBottom:active?`2px solid ${ac}`:'2px solid transparent',fontWeight:700,fontSize:13,color:active?'#4A0E0E':'#64748b',cursor:'pointer',display:'flex',alignItems:'center',gap:6 });

  // Question type label
  const qTypeLabel = currentQuestion ? (TYPE_HEADERS[currentQuestion.type] ?? currentQuestion.prompt) : '';

  return (
    <div style={{display:'flex',height:'100vh',width:'100vw',background:'#FDFCF0',fontFamily:'sans-serif',color:'#1e293b',overflow:'hidden'}} onClick={()=>setOpenDropdown(null)}>

      {/* ── Left Sidebar ── */}
      <div style={{width:248,background:'#4A0E0E',color:'#fff',display:'flex',flexDirection:'column',boxShadow:'4px 0 16px rgba(0,0,0,0.2)',flexShrink:0,zIndex:20}}>
        <div style={{padding:'16px 18px',borderBottom:'1px solid rgba(255,255,255,0.08)',background:'#3D0B0B'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}><IBeaker/><span style={{fontWeight:900,fontSize:17}}>ChemQuiz</span></div>
          <div style={{fontSize:10,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:2}}>CHEM 351 · BYU-Idaho</div>
        </div>

        <div style={{flex:1,overflowY:'auto',padding:'10px 0'}}>
          <div style={{padding:'0 16px 6px',fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.25)',textTransform:'uppercase',letterSpacing:2}}>Textbook Chapters</div>
          {textbookData.map(chapter => {
            const isExpanded = expandedChapters.has(chapter.id);
            const isSelected = selectedFilter?.type==='chapter' && selectedFilter?.id===chapter.id;
            return (
              <div key={chapter.id} style={{marginBottom:2}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'4px 10px',background:isSelected?'rgba(255,255,255,0.1)':'transparent'}}>
                  <button onClick={()=>toggleChapter(chapter.id)} style={{flex:1,display:'flex',alignItems:'center',gap:7,background:'none',border:'none',color:'#fff',cursor:'pointer',padding:'5px 0',textAlign:'left'}}>
                    <span style={{fontSize:14,color:'rgba(255,255,255,0.5)',transform:isExpanded?'rotate(90deg)':'none',display:'inline-block',transition:'transform 0.15s',lineHeight:1}}>▶</span>
                    <IBook size={13}/>
                    <span style={{fontSize:12,fontWeight:isSelected?700:500,color:isSelected?'#E6B325':'rgba(255,255,255,0.85)',lineHeight:1.3}}>{chapter.title}</span>
                  </button>
                  <button onClick={e=>{e.stopPropagation();handleSelectChapter(chapter);}}
                    title="Practice this chapter"
                    style={{background:isSelected?'rgba(230,179,37,0.2)':'none',border:'none',cursor:'pointer',padding:'4px 6px',borderRadius:5,color:isSelected?'#E6B325':'rgba(255,255,255,0.3)',display:'flex',flexShrink:0}}>
                    <IPlay size={11}/>
                  </button>
                </div>
                {isExpanded && (
                  <div style={{paddingLeft:36,paddingRight:10,paddingBottom:4,borderLeft:'2px solid rgba(255,255,255,0.08)',marginLeft:18}}>
                    {chapter.lessons.map(lesson => {
                      const isSel = selectedFilter?.type==='lesson' && selectedFilter?.id===lesson.id;
                      return (
                        <div key={lesson.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'2px 0'}}>
                          <button onClick={()=>handleSelectLesson(lesson)} style={{flex:1,display:'flex',alignItems:'center',gap:5,background:'none',border:'none',cursor:'pointer',padding:'4px 0',textAlign:'left'}}>
                            <IBookTxt size={11}/>
                            <span style={{fontSize:11,color:isSel?'#E6B325':'rgba(255,255,255,0.65)',fontWeight:isSel?700:400,lineHeight:1.3}}>{lesson.title}</span>
                          </button>
                          <button onClick={e=>{e.stopPropagation();handleSelectLesson(lesson);}}
                            style={{background:'none',border:'none',cursor:'pointer',padding:'2px 4px',color:'rgba(255,255,255,0.25)',display:'flex',flexShrink:0}}>
                            <IPlay size={10}/>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right Column ── */}
      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>

        {/* Header */}
        <div style={{height:56,background:'#fff',borderBottom:'1px solid #e2e8f0',display:'flex',alignItems:'center',paddingLeft:12,paddingRight:16,gap:0,boxShadow:'0 1px 4px rgba(0,0,0,0.05)',zIndex:30,flexShrink:0}} onClick={e=>e.stopPropagation()}>

          {/* Topics */}
          <div style={{position:'relative',height:'100%',display:'flex',alignItems:'center'}}>
            <button onClick={()=>setOpenDropdown(openDropdown==='topics'?null:'topics')} style={hdrBtn(openDropdown==='topics')}>
              Topics <IChevD size={12}/>
            </button>
            {openDropdown==='topics' && (
              <div style={dropPanel}>
                <div style={{padding:'10px 16px',borderBottom:'1px solid #f1f5f9',background:'#f8fafc'}}>
                  <div style={{fontSize:10,color:'#94a3b8',fontWeight:700,textTransform:'uppercase',letterSpacing:1}}>Current Focus</div>
                  <div style={{fontSize:13,fontWeight:700,color:'#4A0E0E',marginTop:2}}>{selectedFilter?.title ?? 'All Topics'}</div>
                </div>
                <div style={{maxHeight:240,overflowY:'auto'}}>
                  {getTopicsForFilter().map((topic,idx) => {
                    const isActive = selectedFilter?.type==='topic' && selectedFilter?.topic===topic;
                    return (
                      <button key={idx} onClick={()=>handleSelectTopic(topic)}
                        style={{width:'100%',textAlign:'left',padding:'9px 16px',fontSize:13,background:isActive?'rgba(230,179,37,0.12)':'#fff',color:isActive?'#4A0E0E':'#475569',fontWeight:isActive?700:400,border:'none',borderLeft:isActive?'2px solid #E6B325':'2px solid transparent',cursor:'pointer',display:'block'}}>
                        {topic}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Mastered */}
          <div style={{position:'relative',height:'100%',display:'flex',alignItems:'center'}}>
            <button onClick={()=>setOpenDropdown(openDropdown==='mastered'?null:'mastered')} style={hdrBtn(openDropdown==='mastered','#22c55e','#f0fdf4')}>
              <ICheck size={12} sw={3}/> Mastered
              {masteredTopics.length>0 && <span style={{background:'#22c55e',color:'#fff',fontSize:10,fontWeight:900,borderRadius:999,padding:'1px 6px'}}>{masteredTopics.length}</span>}
              <IChevD size={12}/>
            </button>
            {openDropdown==='mastered' && (
              <div style={dropPanel}>
                <div style={{padding:'10px 16px',borderBottom:'1px solid #f1f5f9',background:'#f0fdf4'}}><div style={{fontSize:10,color:'#16a34a',fontWeight:700,textTransform:'uppercase',letterSpacing:1}}>Topics You've Mastered</div></div>
                {masteredTopics.length===0 ? <div style={{padding:'12px 16px',fontSize:13,color:'#94a3b8',fontStyle:'italic'}}>Grade some questions to populate this list.</div>
                  : <div style={{maxHeight:240,overflowY:'auto'}}>{masteredTopics.map(([topic,stats])=>(
                    <button key={topic} onClick={()=>handleSelectTopic(topic)} style={{width:'100%',textAlign:'left',padding:'9px 16px',fontSize:13,background:'#fff',color:'#334155',fontWeight:500,border:'none',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span>{topic}</span>
                      <span style={{background:'#dcfce7',color:'#16a34a',fontSize:11,fontWeight:700,borderRadius:999,padding:'2px 8px',display:'flex',alignItems:'center',gap:3}}><ICheck size={10} sw={3}/> {stats.mastered}</span>
                    </button>))}
                  </div>}
              </div>
            )}
          </div>

          {/* Needs Work */}
          <div style={{position:'relative',height:'100%',display:'flex',alignItems:'center'}}>
            <button onClick={()=>setOpenDropdown(openDropdown==='needswork'?null:'needswork')} style={hdrBtn(openDropdown==='needswork','#E6B325','#fefce8')}>
              <IX size={12} sw={3}/> Needs Work
              {needsWorkTopics.length>0 && <span style={{background:'#E6B325',color:'#4A0E0E',fontSize:10,fontWeight:900,borderRadius:999,padding:'1px 6px'}}>{needsWorkTopics.length}</span>}
              <IChevD size={12}/>
            </button>
            {openDropdown==='needswork' && (
              <div style={dropPanel}>
                <div style={{padding:'10px 16px',borderBottom:'1px solid #f1f5f9',background:'#fefce8'}}><div style={{fontSize:10,color:'#a16207',fontWeight:700,textTransform:'uppercase',letterSpacing:1}}>Needs More Practice</div></div>
                {needsWorkTopics.length===0 ? <div style={{padding:'12px 16px',fontSize:13,color:'#94a3b8',fontStyle:'italic'}}>No flagged topics yet.</div>
                  : <div style={{maxHeight:240,overflowY:'auto'}}>{needsWorkTopics.map(([topic,stats])=>(
                    <button key={topic} onClick={()=>handleSelectTopic(topic)} style={{width:'100%',textAlign:'left',padding:'9px 16px',fontSize:13,background:'#fff',color:'#334155',fontWeight:500,border:'none',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span>{topic}</span>
                      <span style={{background:'rgba(230,179,37,0.25)',color:'#4A0E0E',fontSize:11,fontWeight:700,borderRadius:999,padding:'2px 8px',display:'flex',alignItems:'center',gap:3}}><IX size={10} sw={3}/> {stats.needsWork}</span>
                    </button>))}
                  </div>}
              </div>
            )}
          </div>

          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:4}}>
            <button onClick={()=>canvasRef.current?.undo()} title="Undo" style={{padding:7,background:'none',border:'none',cursor:'pointer',color:'#94a3b8',borderRadius:6,display:'flex'}}><IUndo size={15}/></button>
            <button onClick={()=>canvasRef.current?.redo()} title="Redo" style={{padding:7,background:'none',border:'none',cursor:'pointer',color:'#94a3b8',borderRadius:6,display:'flex'}}><IRedo size={15}/></button>
            <div style={{width:1,height:20,background:'#e2e8f0',margin:'0 4px'}}/>
            <button onClick={()=>canvasRef.current?.clear()} title="Clear" style={{padding:7,background:'none',border:'none',cursor:'pointer',color:'#94a3b8',borderRadius:6,display:'flex'}}><ITrash size={15}/></button>
          </div>
        </div>

        {/* Canvas Workspace */}
        <div style={{flex:1,position:'relative',overflow:'hidden',zIndex:10,minHeight:0}} onClick={()=>setOpenDropdown(null)}>
          <SkeletonCanvas ref={canvasRef} onInteract={()=>setOpenDropdown(null)} activeTool={activeTool} setActiveTool={setActiveTool}/>
        </div>

        {/* ── Bottom Question Panel ── */}
        <div style={{background:'#fff',borderTop:'1px solid #e2e8f0',flexShrink:0,zIndex:20,boxShadow:'0 -4px 20px rgba(0,0,0,0.04)'}}>

          {/* Answer reveal panel */}
          {showAnswer && currentQuestion && (
            <div style={{padding:'14px 20px',borderBottom:'1px solid #f0fdf4',background:'#f0fdf4',display:'flex',alignItems:'flex-start',gap:14}}>
              <div style={{width:38,height:38,background:'#22c55e',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <IEye size={18}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:11,fontWeight:700,color:'#16a34a',textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>Answer</div>
                {currentQuestion.structureImage && (
                  <img src={`/answers/${currentQuestion.id}.png`} alt="answer structure"
                    style={{maxHeight:160,maxWidth:'100%',border:'1px solid #e2e8f0',borderRadius:8,marginBottom:8,background:'#fff',padding:8}}
                    onError={e=>{e.target.style.display='none';}}/>
                )}
                <div style={{fontSize:14,color:'#1e293b',lineHeight:1.6,fontFamily:'Georgia, serif'}}>
                  {currentQuestion.answerText}
                </div>
              </div>
            </div>
          )}

          {/* Question + controls row */}
          <div style={{padding:'14px 20px',display:'flex',alignItems:'flex-start',gap:16,minHeight:120}}>
            <div style={{width:42,height:42,background:'#E6B325',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',color:'#4A0E0E',flexShrink:0,boxShadow:'0 4px 12px rgba(230,179,37,0.35)'}}>
              <span style={{fontWeight:900,fontSize:19}}>Q</span>
            </div>

            {currentQuestion ? (
              <div style={{flex:1,overflowY:'auto'}}>
                {/* Breadcrumb */}
                <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:5,flexWrap:'wrap'}}>
                  {selectedFilter && <span style={{fontSize:10,fontWeight:700,color:'#4A0E0E',opacity:0.5,textTransform:'uppercase',letterSpacing:1}}>{selectedFilter.title}</span>}
                  {selectedFilter && <IChevR size={10}/>}
                  <span style={{fontSize:10,fontWeight:700,color:'#E6B325',textTransform:'uppercase',letterSpacing:1}}>{currentQuestion.topic}</span>
                  <span style={{fontSize:10,color:'#94a3b8',marginLeft:4}}>
                    {'★'.repeat(currentQuestion.difficulty) + '☆'.repeat(5-currentQuestion.difficulty)}
                  </span>
                </div>
                {/* Type header */}
                <div style={{fontSize:12,fontWeight:700,color:'#64748b',marginBottom:4}}>{qTypeLabel}</div>
                {/* Specific prompt */}
                {currentQuestion.prompt !== qTypeLabel && (
                  <div style={{fontSize:13,color:'#475569',marginBottom:6,fontStyle:'italic'}}>{currentQuestion.prompt}</div>
                )}
                {/* Reagents display */}
                {currentQuestion.reagents && (
                  <div style={{fontSize:16,fontFamily:'Georgia, serif',color:'#1e293b',background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:8,padding:'8px 14px',display:'inline-block',marginTop:4}}>
                    {currentQuestion.reagents}
                  </div>
                )}
              </div>
            ) : (
              <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:'#94a3b8',fontStyle:'italic',fontSize:14,minHeight:80}}>
                Select a chapter or lesson in the sidebar, or click a topic below to begin.
              </div>
            )}

            {/* Action buttons */}
            <div style={{display:'flex',flexDirection:'column',gap:6,flexShrink:0,width:152}}>
              <div style={{fontSize:10,textTransform:'uppercase',letterSpacing:1,color:'#94a3b8',fontWeight:700,textAlign:'center'}}>Action</div>

              <button onClick={()=>pickNextQuestion()}
                style={{width:'100%',padding:'8px 0',background:'#f1f5f9',color:'#334155',border:'1px solid #e2e8f0',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer'}}>
                Next Question
              </button>

              <button onClick={()=>setShowAnswer(true)} disabled={showAnswer}
                style={{width:'100%',padding:'7px 0',background:showAnswer?'#22c55e':'#4A0E0E',color:'#fff',border:'none',borderRadius:8,fontSize:12,fontWeight:700,cursor:showAnswer?'not-allowed':'pointer',opacity:currentQuestion?1:0.4,display:'flex',alignItems:'center',justifyContent:'center',gap:6,transition:'background 0.2s'}}>
                <IEye size={14}/> {showAnswer ? 'Answer Shown' : 'Show Answer'}
              </button>

              {/* Correct / Incorrect toggle — only after answer shown */}
              <button onClick={handleGradeToggle}
                style={{width:'100%',padding:'8px 0',borderRadius:8,fontSize:13,fontWeight:700,cursor:showAnswer?'pointer':'default',border:isCorrect?'2px solid #16a34a':'2px solid #c99a1a',background:isCorrect?'#22c55e':'#E6B325',color:isCorrect?'#fff':'#4A0E0E',display:'flex',alignItems:'center',justifyContent:'center',gap:6,opacity:showAnswer?1:0,pointerEvents:showAnswer?'auto':'none',boxShadow:isCorrect?'0 2px 10px rgba(34,197,94,0.35)':'0 2px 10px rgba(230,179,37,0.35)',transition:'opacity 0.2s,background 0.2s'}}>
                {isCorrect?<><ICheck size={14} sw={3}/> Correct</>:<><IX size={14} sw={2.5}/> Incorrect</>}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
