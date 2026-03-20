// ─── Textbook Structure ───────────────────────────────────────────────────────
// Mirrors the BYU-Idaho CHEM 351 textbook chapter/lesson layout.
// Each lesson lists the topic strings that match questionBank entries.

export interface Lesson {
    id: string;
    title: string;
    topics: string[];
  }
  
  export interface Chapter {
    id: number;
    title: string;
    lessons: Lesson[];
  }
  
  export const textbookData: Chapter[] = [
    { id:6, title:"Ch. 6: An Overview of Organic Reactions", lessons:[
      { id:'6.1', title:"6.1 Kinds of Organic Reactions",             topics:["Kinds of Organic Reactions"] },
      { id:'6.2', title:"6.2 How Organic Reactions Occur: Mechanisms", topics:["Reaction Mechanisms"] },
      { id:'6.3', title:"6.3 Polar Reactions",                         topics:["Polar Reactions"] },
      { id:'6.4', title:"6.4 Addition of HBr to Ethylene",            topics:["Addition of HBr to Alkenes"] },
      { id:'6.5', title:"6.5 Using Curved Arrows in Mechanisms",       topics:["Curved Arrows in Mechanisms"] },
      { id:'6.6', title:"6.6 Radical Reactions",                       topics:["Radical Reactions"] },
      { id:'6.7', title:"6.7 Equilibria, Rates, and Energy Changes",   topics:["Reaction Equilibria and Rates"] },
      { id:'6.8', title:"6.8 Bond Dissociation Energies",              topics:["Bond Dissociation Energies"] },
      { id:'6.9', title:"6.9 Energy Diagrams and Transition States",   topics:["Energy Diagrams"] },
      { id:'6.10',title:"6.10 Describing a Reaction: Intermediates",   topics:["Reaction Intermediates"] },
    ]},
    { id:7, title:"Ch. 7: Alkenes — Structure and Reactivity", lessons:[
      { id:'7.1', title:"7.1 Industrial Preparation of Alkenes",       topics:["Preparing Alkenes: Industrial"] },
      { id:'7.2', title:"7.2 Calculating Degree of Unsaturation",      topics:["Degree of Unsaturation"] },
      { id:'7.3', title:"7.3 Naming Alkenes",                          topics:["Naming Alkenes"] },
      { id:'7.4', title:"7.4 Cis–Trans Isomerism in Alkenes",          topics:["Cis-Trans Isomerism"] },
      { id:'7.5', title:"7.5 Alkene Stereochemistry: E,Z",             topics:["E,Z Designation of Alkenes"] },
      { id:'7.6', title:"7.6 Stability of Alkenes",                    topics:["Stability of Alkenes"] },
      { id:'7.7', title:"7.7 Electrophilic Addition Reactions",        topics:["Electrophilic Addition Reactions"] },
      { id:'7.8', title:"7.8 Markovnikov's Rule",                      topics:["Markovnikov's Rule"] },
      { id:'7.9', title:"7.9 Carbocation Structure and Stability",     topics:["Carbocation Structure and Stability"] },
      { id:'7.10',title:"7.10 The Hammond Postulate",                  topics:["Hammond Postulate"] },
      { id:'7.11',title:"7.11 Carbocation Rearrangements",             topics:["Carbocation Rearrangements"] },
    ]},
    { id:8, title:"Ch. 8: Alkenes — Reactions and Synthesis", lessons:[
      { id:'8.1', title:"8.1 Preparing Alkenes: Elimination",          topics:["Preparing Alkenes: Elimination"] },
      { id:'8.2', title:"8.2 Halogenation of Alkenes: Addition of X₂", topics:["Halogenation of Alkenes"] },
      { id:'8.3', title:"8.3 Halohydrins from Alkenes: Addition of HO-X", topics:["Halohydrin Formation"] },
      { id:'8.4', title:"8.4 Hydration by Oxymercuration",             topics:["Hydration by Oxymercuration"] },
      { id:'8.5', title:"8.5 Hydration by Hydroboration",              topics:["Hydration by Hydroboration"] },
      { id:'8.6', title:"8.6 Reduction: Hydrogenation & Alkynes",      topics:["Reduction: Hydrogenation","Alkynes: Reduction","Alkynes: Acidic Hydrogens","Alkynes: Synthesis","Alkynes: Hydration"] },
      { id:'8.7', title:"8.7 Oxidation: Epoxidation & Hydroxylation",  topics:["Epoxidation and Hydroxylation"] },
      { id:'8.8', title:"8.8 Oxidation: Alkene Cleavage (Ozonolysis)", topics:["Alkene Cleavage: Ozonolysis"] },
      { id:'8.9', title:"8.9 Multi-Step Synthesis",                    topics:["Synthesis: Multi-Step"] },
      { id:'8.12',title:"8.12 Reaction Stereochemistry",               topics:["Reaction Stereochemistry"] },
    ]},
  ];
  