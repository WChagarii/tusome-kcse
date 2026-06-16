// =============================================
// TUSOME KCSE — Shared App Logic
// =============================================

// --- DATA LAYER ---
const DB = {
  students: () => JSON.parse(localStorage.getItem('tk_students') || '{}'),
  parents:  () => JSON.parse(localStorage.getItem('tk_parents')  || '{}'),
  session:  () => JSON.parse(sessionStorage.getItem('tk_sess')   || 'null'),
  save: {
    students: d => localStorage.setItem('tk_students', JSON.stringify(d)),
    parents:  d => localStorage.setItem('tk_parents',  JSON.stringify(d)),
    session:  d => sessionStorage.setItem('tk_sess',   JSON.stringify(d)),
  }
};

// --- CURRENT STUDENT ---
function getStudent() {
  const sess = DB.session();
  if(!sess) return null;
  return DB.students()[sess.admKey] || null;
}
function saveStudent(s) {
  const students = DB.students();
  students[s.admKey] = s;
  DB.save.students(students);
}

// --- THEME ---
function applyTheme() {
  const t = localStorage.getItem('tk_theme') || 'light';
  document.documentElement.setAttribute('data-theme', t);
}
function toggleTheme() {
  const cur = localStorage.getItem('tk_theme') || 'light';
  const next = cur === 'light' ? 'dark' : 'light';
  localStorage.setItem('tk_theme', next);
  document.documentElement.setAttribute('data-theme', next);
  const btn = document.getElementById('themeBtn');
  if(btn) btn.textContent = next === 'dark' ? '☀' : '◑';
}

// --- TOAST ---
function toast(msg, type='info') {
  const el = document.getElementById('toast');
  if(!el) return;
  el.textContent = msg;
  el.className = `toast toast-${type} show`;
  setTimeout(() => el.classList.remove('show'), 3500);
}

// --- BOTTOM NAV ACTIVE ---
function setActiveNav(page) {
  document.querySelectorAll('.bn-item').forEach(b => b.classList.remove('active'));
  const el = document.getElementById('bn-' + page);
  if(el) el.classList.add('active');
}

// --- OFF-CANVAS ---
function openCanvas(id) {
  document.getElementById(id)?.classList.add('open');
  document.getElementById('overlay')?.classList.add('show');
}
function closeCanvas(id) {
  document.getElementById(id)?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('show');
}

// --- PWA INSTALL ---
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById('installBtn');
  if(btn) btn.style.display = 'flex';
});
function installPWA() {
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
}

// --- SERVICE WORKER ---
if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// --- DEMO QUESTIONS BANK ---
const DEMO_Q = {
  Biology: [
    {question:"Which organelle produces ATP through cellular respiration?",options:["A. Nucleus","B. Ribosome","C. Mitochondria","D. Chloroplast"],correct:2,explanation:"Mitochondria are the powerhouse of the cell — they produce ATP through cellular respiration."},
    {question:"In osmosis, water moves from a region of:",options:["A. Low to high water potential","B. High to low water potential","C. High solute to low solute","D. Low temperature to high temperature"],correct:1,explanation:"Osmosis moves water from HIGH water potential (dilute) to LOW water potential (concentrated) through a semi-permeable membrane."},
    {question:"Which process do plants use to make food using sunlight?",options:["A. Respiration","B. Transpiration","C. Photosynthesis","D. Digestion"],correct:2,explanation:"Photosynthesis converts light energy, water and CO₂ into glucose and oxygen in the chloroplasts."},
    {question:"The functional unit of the kidney is the:",options:["A. Neuron","B. Nephron","C. Villus","D. Alveolus"],correct:1,explanation:"The nephron filters blood and produces urine. Each kidney contains about one million nephrons."},
    {question:"Which blood cells fight infections?",options:["A. Red blood cells","B. Platelets","C. White blood cells","D. Plasma"],correct:2,explanation:"White blood cells (leucocytes) are part of the immune system and defend the body against pathogens."},
    {question:"The process of water loss through leaves is called:",options:["A. Osmosis","B. Transpiration","C. Respiration","D. Diffusion"],correct:1,explanation:"Transpiration is the evaporation of water from plant leaves through stomata."},
    {question:"DNA is found mainly in the:",options:["A. Ribosome","B. Mitochondria","C. Nucleus","D. Cell membrane"],correct:2,explanation:"DNA is stored in the nucleus, coiled around proteins called histones to form chromosomes."},
    {question:"Most nutrient absorption occurs in the:",options:["A. Stomach","B. Large intestine","C. Small intestine","D. Oesophagus"],correct:2,explanation:"The small intestine has villi and microvilli that greatly increase surface area for nutrient absorption."},
    {question:"Insulin is produced by the:",options:["A. Liver","B. Kidney","C. Pancreas","D. Adrenal gland"],correct:2,explanation:"Beta cells in the islets of Langerhans in the pancreas produce insulin to lower blood glucose."},
    {question:"Aerobic respiration produces:",options:["A. Lactic acid only","B. CO₂, water and ATP","C. Ethanol and CO₂","D. Oxygen and water"],correct:1,explanation:"Aerobic respiration: Glucose + Oxygen → CO₂ + Water + ATP (energy for all cell activities)."},
  ],
  Chemistry: [
    {question:"The Haber Process manufactures:",options:["A. Sulphuric acid","B. Ammonia","C. Hydrochloric acid","D. Sodium hydroxide"],correct:1,explanation:"The Haber Process reacts N₂ and H₂ at 450°C, 200 atm with an iron catalyst to produce ammonia."},
    {question:"Atomic number of Carbon is:",options:["A. 4","B. 6","C. 8","D. 12"],correct:1,explanation:"Carbon has 6 protons (atomic number = 6). Its relative atomic mass is 12."},
    {question:"At the cathode during electrolysis of brine:",options:["A. Chlorine forms","B. Oxygen forms","C. Hydrogen forms","D. Sodium forms"],correct:2,explanation:"Cathode (negative): 2H⁺ + 2e⁻ → H₂. Anode (positive): 2Cl⁻ → Cl₂ + 2e⁻."},
    {question:"Burning wood is an example of:",options:["A. Endothermic","B. Exothermic","C. Neutralisation","D. Electrolysis"],correct:1,explanation:"Exothermic reactions release heat to surroundings. Burning releases energy stored in chemical bonds."},
    {question:"pH of a neutral solution at 25°C:",options:["A. 0","B. 7","C. 14","D. 5"],correct:1,explanation:"pH 7 = neutral. Below 7 = acidic. Above 7 = alkaline. Pure water at 25°C has pH exactly 7."},
    {question:"Electrons are shared in a:",options:["A. Ionic bond","B. Metallic bond","C. Covalent bond","D. Hydrogen bond"],correct:2,explanation:"Covalent bonds form by sharing electrons. Ionic bonds transfer electrons from metal to non-metal."},
    {question:"Zinc reacts with dilute H₂SO₄ to produce:",options:["A. Oxygen","B. CO₂","C. SO₂","D. Hydrogen"],correct:3,explanation:"Zn + H₂SO₄ → ZnSO₄ + H₂↑. Metal + acid → salt + hydrogen gas. Test with burning splint — pops!"},
    {question:"Crude oil is separated by:",options:["A. Filtration","B. Distillation","C. Fractional distillation","D. Chromatography"],correct:2,explanation:"Fractional distillation separates crude oil into fractions based on different boiling points."},
    {question:"Formula of water is:",options:["A. HO","B. H₂O₂","C. H₂O","D. HO₂"],correct:2,explanation:"Water is H₂O — two hydrogen atoms bonded to one oxygen atom. H₂O₂ is hydrogen peroxide."},
    {question:"Elements in the same group have the same number of:",options:["A. Neutrons","B. Protons","C. Electrons","D. Valence electrons"],correct:3,explanation:"Same group = same valence electrons = similar chemical properties. This is the basis of the periodic table."},
  ],
  Physics: [
    {question:"Newton's First Law concerns:",options:["A. Gravity","B. Inertia","C. Friction","D. Momentum"],correct:1,explanation:"Newton's First Law = Law of Inertia. Objects resist change in motion unless an unbalanced force acts."},
    {question:"SI unit of electric current:",options:["A. Volt","B. Watt","C. Ohm","D. Ampere"],correct:3,explanation:"Ampere (A) = SI unit of current. Volt = potential difference. Ohm = resistance. Watt = power."},
    {question:"If voltage doubles and resistance is constant, current:",options:["A. Halves","B. Stays same","C. Doubles","D. Quadruples"],correct:2,explanation:"Ohm's Law: I = V/R. If V doubles and R is constant, I doubles. Direct proportional relationship."},
    {question:"Speed of light in vacuum:",options:["A. 3×10⁶ m/s","B. 3×10⁸ m/s","C. 3×10¹⁰ m/s","D. 3×10⁴ m/s"],correct:1,explanation:"Speed of light = 3×10⁸ m/s (300,000 km/s). A fundamental constant in physics."},
    {question:"Which wave does NOT need a medium?",options:["A. Sound","B. Water","C. Electromagnetic","D. Seismic"],correct:2,explanation:"Electromagnetic waves (light, radio, X-rays) travel through vacuum. Sound needs a medium."},
    {question:"Half-life is the time for:",options:["A. All atoms to decay","B. Half the atoms to decay","C. All energy to be released","D. The substance to stabilise"],correct:1,explanation:"Half-life = time for HALF the radioactive atoms to decay. After 2 half-lives, one quarter remains."},
    {question:"Unit of power:",options:["A. Joule","B. Newton","C. Watt","D. Pascal"],correct:2,explanation:"Power is measured in Watts (W). Power = Work/Time. 1 Watt = 1 Joule per second."},
    {question:"A convex lens is also called a:",options:["A. Diverging lens","B. Concave lens","C. Converging lens","D. Plane lens"],correct:2,explanation:"Convex lens converges parallel rays to a focal point. Used in cameras and magnifying glasses."},
    {question:"Acceleration due to gravity (g) is approximately:",options:["A. 9.8 m/s","B. 9.8 m/s²","C. 10 m/s","D. 10 m/s³"],correct:1,explanation:"g ≈ 9.8 m/s² (rounded to 10 m/s² in KCSE). Unit is m/s² (acceleration), not m/s (speed)."},
    {question:"Conservation of energy states energy can:",options:["A. Be created","B. Be destroyed","C. Neither be created nor destroyed","D. Be created and destroyed equally"],correct:2,explanation:"Energy cannot be created or destroyed — only converted from one form to another. A fundamental law."},
  ],
  Mathematics: [
    {question:"Solve: x² - 5x + 6 = 0",options:["A. x=2 or x=3","B. x=-2 or x=-3","C. x=1 or x=6","D. x=-1 or x=-6"],correct:0,explanation:"Factorise: (x-2)(x-3)=0. So x=2 or x=3. Verify: 4-10+6=0✓ and 9-15+6=0✓."},
    {question:"Gradient of y = 3x + 7:",options:["A. 7","B. 3","C. -3","D. 10"],correct:1,explanation:"In y=mx+c, m is the gradient and c is the y-intercept. Here gradient=3, y-intercept=7."},
    {question:"If sin θ = 0.5, then θ =",options:["A. 30°","B. 45°","C. 60°","D. 90°"],correct:0,explanation:"sin 30°=0.5. Standard angles to memorise: sin 30°=0.5, sin 45°=√2/2, sin 60°=√3/2."},
    {question:"Area of circle with radius 7cm (π=22/7):",options:["A. 22 cm²","B. 44 cm²","C. 154 cm²","D. 308 cm²"],correct:2,explanation:"Area=πr²=(22/7)×49=154 cm². Using π=22/7 with r=7 is a deliberate KCSE calculation trick."},
    {question:"Simplify 2³ × 2⁴:",options:["A. 2⁷","B. 2¹²","C. 4⁷","D. 2⁻¹"],correct:0,explanation:"Same base, ADD powers: 2³×2⁴=2⁷=128. Dividing: subtract. Power of power: multiply."},
    {question:"Mean of 5 numbers is 12. Four are 10,14,8,15. Fifth is:",options:["A. 11","B. 12","C. 13","D. 15"],correct:2,explanation:"Total=12×5=60. Sum of four=47. Fifth=60-47=13. Always find total first in mean problems."},
    {question:"log₁₀(1000) =",options:["A. 2","B. 3","C. 4","D. 10"],correct:1,explanation:"log₁₀(1000)=log₁₀(10³)=3. Key: log₁₀(10)=1, log₁₀(100)=2, log₁₀(1000)=3."},
    {question:"Line through (0,4) and (2,0) has equation:",options:["A. y=2x+4","B. y=-2x+4","C. y=2x-4","D. y=-2x-4"],correct:1,explanation:"Gradient=(0-4)/(2-0)=-2. y-intercept=4. So y=-2x+4. Check: x=0→y=4✓, x=2→y=0✓."},
    {question:"15% of 240:",options:["A. 24","B. 36","C. 48","D. 16"],correct:1,explanation:"15%×240=0.15×240=36. Shortcut: 10%=24, 5%=12, so 15%=24+12=36."},
    {question:"Triangle with angles 65° and 75°. Third angle:",options:["A. 30°","B. 40°","C. 45°","D. 50°"],correct:1,explanation:"Angles in triangle sum to 180°. Third=180-65-75=40°. Most basic geometry rule in KCSE."},
  ],
};

// Topic-aware demo question selector
function getDemoQuestions(subject, topic, count) {
  const tl = topic.toLowerCase();
  let pool = null;
  if(tl.includes('cell')||tl.includes('organelle')||tl.includes('membrane')) pool = TOPIC_Q['cell'];
  else if(tl.includes('osmosis')||tl.includes('diffusion')) pool = TOPIC_Q['osmosis'];
  else if(tl.includes('photosyn')) pool = TOPIC_Q['photosynthesis'];
  else if(tl.includes('haber')||tl.includes('ammonia')) pool = TOPIC_Q['haber'];
  else if(tl.includes('newton')||tl.includes('motion')||tl.includes('force')) pool = TOPIC_Q['newton'];
  else if(tl.includes('quadratic')||tl.includes('equation')) pool = TOPIC_Q['quadratic'];
  else pool = DEMO_Q[subject] || DEMO_Q['Biology'];
  return [...pool].sort(()=>Math.random()-.5).slice(0, count);
}

// Topic-specific questions
const TOPIC_Q = {
  cell: [
    {question:"Which organelle is the powerhouse of the cell?",options:["A. Nucleus","B. Ribosome","C. Mitochondria","D. Vacuole"],correct:2,explanation:"Mitochondria produce ATP through cellular respiration — they supply energy for all cell activities."},
    {question:"Plant cells differ from animal cells because they have:",options:["A. A nucleus","B. A cell wall and chloroplasts","C. Mitochondria","D. A cell membrane"],correct:1,explanation:"Plant cells uniquely have a cell wall (cellulose), chloroplasts for photosynthesis, and a large permanent vacuole."},
    {question:"Ribosomes are responsible for:",options:["A. Producing energy","B. Protein synthesis","C. Storing water","D. Cell division"],correct:1,explanation:"Ribosomes read mRNA and assemble amino acids into proteins — essential for all cell functions."},
    {question:"The cell membrane is described as selectively permeable because:",options:["A. It allows all substances through","B. It allows no substances through","C. It controls which substances enter and leave","D. It only allows water through"],correct:2,explanation:"Selectively permeable = controls passage of substances. Essential concept for KCSE Biology."},
    {question:"The largest organelle in most animal cells is the:",options:["A. Mitochondria","B. Ribosome","C. Nucleus","D. Lysosome"],correct:2,explanation:"The nucleus is the largest organelle — it contains DNA and controls all cell activities."},
    {question:"Which cells have no nucleus?",options:["A. Plant cells","B. Animal cells","C. Bacterial cells","D. Fungal cells"],correct:2,explanation:"Bacteria are prokaryotes — no membrane-bound nucleus. DNA floats freely in cytoplasm."},
    {question:"Chloroplasts are found in:",options:["A. Animal cells only","B. Plant cells only","C. All cells","D. Bacterial cells only"],correct:1,explanation:"Chloroplasts contain chlorophyll and are the site of photosynthesis — found only in plant cells."},
    {question:"Cells divide by mitosis to:",options:["A. Produce gametes","B. Produce two identical daughter cells","C. Reduce chromosome number","D. Produce four cells"],correct:1,explanation:"Mitosis produces two genetically identical cells for growth and repair. Meiosis produces gametes."},
    {question:"The cell wall in plants is made of:",options:["A. Protein","B. Starch","C. Cellulose","D. Fat"],correct:2,explanation:"Plant cell walls are made of cellulose — providing structural support and maintaining cell shape."},
    {question:"Lysosomes contain:",options:["A. DNA","B. Chlorophyll","C. Digestive enzymes","D. Ribosomes"],correct:2,explanation:"Lysosomes contain digestive enzymes that break down waste materials and cellular debris."},
  ],
  osmosis: [
    {question:"Osmosis is the movement of water from:",options:["A. High solute to low solute","B. High water potential to low water potential","C. Low water to high water potential","D. High temperature to low temperature"],correct:1,explanation:"Water moves from HIGH water potential (dilute) to LOW water potential (concentrated) through a semi-permeable membrane."},
    {question:"A cell in a hypertonic solution will:",options:["A. Swell and burst","B. Remain the same","C. Shrink","D. Divide"],correct:2,explanation:"Hypertonic = more concentrated than cell. Water leaves cell by osmosis. Animal cells crenate; plant cells plasmolyse."},
    {question:"Turgor pressure in plant cells is caused by:",options:["A. Water leaving the cell","B. Water entering by osmosis","C. Salt entering the cell","D. Loss of chlorophyll"],correct:1,explanation:"Water entering by osmosis pushes against the cell wall creating turgor pressure — keeps plants firm and upright."},
    {question:"An isotonic solution has:",options:["A. Higher concentration than the cell","B. Lower concentration than the cell","C. The same concentration as the cell","D. No solutes"],correct:2,explanation:"Isotonic = same water potential as the cell. No net movement of water. Red blood cells are stored in isotonic saline."},
    {question:"Plasmolysis occurs when:",options:["A. Water enters the cell","B. The cell divides","C. Water leaves the cell in hypertonic solution","D. Chlorophyll is lost"],correct:2,explanation:"Plasmolysis = cell membrane pulls away from cell wall when water leaves in hypertonic solution. Reversible with water."},
    {question:"Which molecule moves during osmosis?",options:["A. Glucose","B. Protein","C. Water","D. Salt"],correct:2,explanation:"Only water molecules move during osmosis — solutes are too large to pass through the semi-permeable membrane."},
    {question:"A wilting plant demonstrates osmosis because:",options:["A. Water enters cells from soil","B. Water leaves cells to dry soil","C. Salt enters leaf cells","D. Light stops photosynthesis"],correct:1,explanation:"When soil is drier than cell contents, water leaves cells by osmosis into the soil — causing wilting."},
    {question:"Semi-permeable membranes allow:",options:["A. All substances through","B. No substances through","C. Small molecules like water through but not large solutes","D. Only large molecules through"],correct:2,explanation:"Semi-permeable membranes have tiny pores — water and small molecules pass but larger solute molecules cannot."},
    {question:"Pure water has a water potential of:",options:["A. -1","B. 0","C. +1","D. Infinity"],correct:1,explanation:"Pure water = water potential of 0 (the highest). Adding solutes lowers water potential to negative values."},
    {question:"Osmosis requires:",options:["A. Energy (ATP)","B. A pump protein","C. A concentration gradient and semi-permeable membrane","D. Heat"],correct:2,explanation:"Osmosis is passive — no energy needed. It only requires a water potential gradient and a semi-permeable membrane."},
  ],
  photosynthesis: [
    {question:"Overall equation for photosynthesis:",options:["A. C₆H₁₂O₆+6O₂→6CO₂+6H₂O","B. 6CO₂+6H₂O→C₆H₁₂O₆+6O₂","C. 6O₂+C₆H₁₂O₆→6CO₂+6H₂O+ATP","D. CO₂+H₂O→C₆H₁₂O₆"],correct:1,explanation:"6CO₂+6H₂O+light energy→C₆H₁₂O₆+6O₂. Memorise this — it appears in every KCSE Biology paper!"},
    {question:"Photosynthesis occurs in:",options:["A. Mitochondria","B. Nucleus","C. Chloroplast","D. Ribosome"],correct:2,explanation:"Chloroplasts contain chlorophyll. The light-dependent reactions occur in thylakoid membranes; Calvin cycle in the stroma."},
    {question:"Chlorophyll absorbs mainly:",options:["A. Green light","B. Red and blue light","C. Yellow light","D. White light only"],correct:1,explanation:"Chlorophyll absorbs RED and BLUE light for photosynthesis but reflects GREEN light — which is why leaves look green!"},
    {question:"Increasing CO₂ concentration will:",options:["A. Decrease rate of photosynthesis","B. Have no effect","C. Increase rate of photosynthesis","D. Kill the plant"],correct:2,explanation:"CO₂ is a raw material. Increasing it raises the rate — until another factor (light or temperature) becomes limiting."},
    {question:"Which gas is released by photosynthesis?",options:["A. Carbon dioxide","B. Nitrogen","C. Hydrogen","D. Oxygen"],correct:3,explanation:"Oxygen is released when water is split (photolysis) during the light-dependent reactions of photosynthesis."},
    {question:"The main site of photosynthesis in a leaf is:",options:["A. Upper epidermis","B. Palisade mesophyll","C. Lower epidermis","D. Midrib"],correct:1,explanation:"Palisade mesophyll cells are packed with chloroplasts and positioned directly under the upper epidermis for maximum light absorption."},
    {question:"Stomata allow:",options:["A. Water to enter roots","B. CO₂ in and O₂ out of leaves","C. Glucose to leave leaves","D. Light to enter cells"],correct:1,explanation:"Stomata are pores that allow gas exchange: CO₂ enters for photosynthesis, O₂ exits, and water vapour is lost (transpiration)."},
    {question:"A destarched plant is placed in light. After 24 hrs the leaves:",options:["A. Show no starch","B. Test positive for starch in green parts","C. Produce no glucose","D. Die"],correct:1,explanation:"Green parts (with chlorophyll) photosynthesise and produce starch. Destarching first (darkness) ensures fair test for KCSE practicals."},
    {question:"The two stages of photosynthesis are:",options:["A. Oxidation and reduction","B. Light-dependent and light-independent reactions","C. Glycolysis and Krebs cycle","D. Respiration and transpiration"],correct:1,explanation:"Light-dependent (thylakoid): produces ATP and NADPH. Light-independent/Calvin cycle (stroma): uses CO₂ to make glucose."},
    {question:"Increasing light intensity will:",options:["A. Always increase photosynthesis indefinitely","B. Increase photosynthesis until another factor limits","C. Decrease photosynthesis","D. Have no effect"],correct:1,explanation:"Light intensity increases photosynthesis rate until CO₂ or temperature becomes the limiting factor. Classic KCSE graph question."},
  ],
  haber: [
    {question:"The Haber Process produces:",options:["A. Sulphuric acid","B. Ammonia (NH₃)","C. Nitric acid","D. Urea directly"],correct:1,explanation:"N₂+3H₂⇌2NH₃. The Haber Process combines nitrogen and hydrogen to produce ammonia — basis of fertiliser production."},
    {question:"Conditions for the Haber Process:",options:["A. 200°C, 1 atm, platinum","B. 450°C, 200 atm, iron","C. 1000°C, 500 atm, nickel","D. 25°C, 200 atm, iron"],correct:1,explanation:"450°C, 200 atmospheres, iron catalyst. These are compromise conditions — KCSE always asks WHY these specific conditions are chosen."},
    {question:"Why 450°C rather than higher temperature?",options:["A. Higher temperature is too costly","B. Compromise: higher temp increases rate but decreases yield","C. Iron catalyst only works at 450°C","D. Higher temp creates a different product"],correct:1,explanation:"This is the KEY KCSE question. Higher temp=faster rate but lower yield (equilibrium shifts left). 450°C balances rate and yield."},
    {question:"Why is high pressure used?",options:["A. Speeds up the catalyst","B. Shifts equilibrium right — more ammonia produced","C. Prevents iron from rusting","D. Lowers temperature needed"],correct:1,explanation:"N₂+3H₂→2NH₃: 4 moles gas → 2 moles gas. High pressure shifts equilibrium towards fewer moles (right) — increasing NH₃ yield."},
    {question:"The iron catalyst in the Haber Process:",options:["A. Increases yield of ammonia","B. Increases rate without being consumed","C. Decreases temperature needed","D. Prevents reverse reaction"],correct:1,explanation:"Catalyst increases RATE of both forward and reverse reactions equally. It does not change equilibrium position or yield."},
    {question:"The ⇌ symbol in N₂+3H₂⇌2NH₃ means:",options:["A. One direction only","B. The reaction is reversible","C. A catalyst is needed","D. Heat is released"],correct:1,explanation:"⇌ indicates a reversible reaction. Both forward (N₂+H₂→NH₃) and reverse (NH₃→N₂+H₂) reactions occur simultaneously at equilibrium."},
    {question:"Ammonia is mainly used to make:",options:["A. Plastics","B. Medicines","C. Nitrogenous fertilisers","D. Explosives"],correct:2,explanation:"Most ammonia → ammonium nitrate or urea fertilisers. Fertilisers like CAN (Calcium Ammonium Nitrate) come from this process."},
    {question:"Raw materials for the Haber Process:",options:["A. Hydrogen and oxygen","B. Nitrogen and hydrogen","C. Nitrogen and oxygen","D. Ammonia and oxygen"],correct:1,explanation:"Nitrogen from air (fractional distillation). Hydrogen from steam reforming of methane. Both are reacted in the Haber Process."},
    {question:"The percentage yield of ammonia at equilibrium is approximately:",options:["A. 100%","B. 80%","C. 15-25%","D. 50%"],correct:2,explanation:"Only 15-25% converts to NH₃ at equilibrium. Unreacted gases are recycled back to increase overall efficiency."},
    {question:"Decreasing pressure in the Haber Process would:",options:["A. Increase ammonia yield","B. Decrease ammonia yield","C. Have no effect","D. Speed up the reaction"],correct:1,explanation:"Lower pressure shifts equilibrium towards MORE moles of gas (left) — producing LESS ammonia. High pressure maximises yield."},
  ],
  newton: [
    {question:"Newton's First Law is also called:",options:["A. Law of gravity","B. Law of inertia","C. Law of momentum","D. Law of acceleration"],correct:1,explanation:"Newton's First Law = Law of Inertia. Objects resist change in motion unless an unbalanced external force acts on them."},
    {question:"Force = Mass × Acceleration is:",options:["A. Newton's First Law","B. Newton's Second Law","C. Newton's Third Law","D. Law of Gravitation"],correct:1,explanation:"F=ma is Newton's Second Law. The most used formula in KCSE Physics mechanics calculations."},
    {question:"A car (1000 kg) accelerates at 2 m/s². Net force:",options:["A. 500 N","B. 1000 N","C. 2000 N","D. 4000 N"],correct:2,explanation:"F=ma=1000×2=2000 N. Always write formula, substitute, then calculate for KCSE full marks."},
    {question:"Newton's Third Law states:",options:["A. Equal force same direction","B. Greater force opposite direction","C. Equal and opposite reaction","D. Smaller force any direction"],correct:2,explanation:"Action and reaction are EQUAL and OPPOSITE but act on DIFFERENT objects. Example: rocket pushes gas down, gas pushes rocket up."},
    {question:"A 50 N force on 10 kg object gives acceleration:",options:["A. 500 m/s²","B. 5 m/s²","C. 0.2 m/s²","D. 50 m/s²"],correct:1,explanation:"a=F/m=50/10=5 m/s². Rearrange F=ma to find acceleration. Check units: N÷kg=m/s²."},
    {question:"An object moving at constant velocity has:",options:["A. Net force greater than zero","B. Net force of zero","C. Increasing acceleration","D. Decreasing mass"],correct:1,explanation:"Constant velocity = zero acceleration = zero net force (Newton's First Law). The forces balance exactly."},
    {question:"Inertia depends on:",options:["A. Speed","B. Volume","C. Mass","D. Shape"],correct:2,explanation:"Inertia is directly proportional to mass. A heavier object is harder to start moving or to stop."},
    {question:"If mass triples and force is constant, acceleration:",options:["A. Triples","B. Stays same","C. Reduces to one third","D. Doubles"],correct:2,explanation:"a=F/m. If m triples and F is constant: a=F/3m = one third. Inverse relationship between mass and acceleration."},
    {question:"The SI unit of force is:",options:["A. Joule","B. Pascal","C. Newton","D. Watt"],correct:2,explanation:"Newton (N) is the SI unit of force. 1 N = 1 kg⋅m/s². Named after Sir Isaac Newton."},
    {question:"A rocket accelerates because of:",options:["A. First Law","B. Second Law","C. Third Law","D. Gravitation"],correct:2,explanation:"Rocket expels gas downward (action) → gas pushes rocket upward (reaction). Newton's Third Law in action."},
  ],
  quadratic: [
    {question:"Solve x² - 5x + 6 = 0:",options:["A. x=2 or x=3","B. x=-2 or x=-3","C. x=1 or x=6","D. x=-1 or x=6"],correct:0,explanation:"Factorise: (x-2)(x-3)=0. So x=2 or x=3. Always verify: 4-10+6=0✓ and 9-15+6=0✓."},
    {question:"The quadratic formula is:",options:["A. x=(-b±√(b²+4ac))/2a","B. x=(-b±√(b²-4ac))/2a","C. x=(b±√(b²-4ac))/2a","D. x=(-b±√(b²-4ac))/a"],correct:1,explanation:"x=(-b±√(b²-4ac))/2a. Memorise this — it solves ANY quadratic equation when factorisation fails."},
    {question:"In 2x²+3x-5=0, a, b, c are:",options:["A. a=3, b=2, c=-5","B. a=2, b=3, c=-5","C. a=2, b=-3, c=5","D. a=1, b=3, c=-5"],correct:1,explanation:"Compare to ax²+bx+c=0: a=2, b=3, c=-5. Identifying a, b, c correctly is the first step in using the formula."},
    {question:"Solve x²-9=0:",options:["A. x=3 only","B. x=-3 only","C. x=3 or x=-3","D. x=9"],correct:2,explanation:"x²=9, x=±√9=±3. Square roots always give TWO solutions (positive and negative)."},
    {question:"Discriminant b²-4ac>0 means:",options:["A. No real roots","B. One repeated root","C. Two distinct real roots","D. Complex roots"],correct:2,explanation:"b²-4ac>0: two real roots. =0: one repeated root. <0: no real roots. KCSE often asks to 'determine the nature of roots'."},
    {question:"Solve x²+4x+4=0:",options:["A. x=2 or x=-2","B. x=-2 (repeated)","C. x=4","D. x=-4"],correct:1,explanation:"(x+2)²=0, so x=-2 (repeated root). Discriminant=16-16=0 confirms one repeated root."},
    {question:"A quadratic equation has highest power:",options:["A. 1","B. 2","C. 3","D. 0"],correct:1,explanation:"Quadratic = degree 2. Highest power of x must be 2. If highest power is 1, it's linear. If 3, it's cubic."},
    {question:"Solve 2x²-8=0:",options:["A. x=2","B. x=-2","C. x=2 or x=-2","D. x=4"],correct:2,explanation:"2x²=8, x²=4, x=±2. Divide by 2 first to simplify, then take square root."},
    {question:"Sum of roots of ax²+bx+c=0:",options:["A. c/a","B. -b/a","C. b/a","D. -c/a"],correct:1,explanation:"Sum=-b/a. Product=c/a. Useful for checking answers without solving."},
    {question:"One root of x²-5x+k=0 is 2. Find k:",options:["A. k=6","B. k=-6","C. k=10","D. k=3"],correct:0,explanation:"Substitute x=2: 4-10+k=0, k=6. Substituting known root to find constants is a common KCSE technique."},
  ],
};

// API call wrapper with fallback
async function callAI(prompt, systemPrompt) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt || '',
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    return data.content?.map(c => c.text || '').join('') || null;
  } catch {
    return null;
  }
}
