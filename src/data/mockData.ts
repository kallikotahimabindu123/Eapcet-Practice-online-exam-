export const mockUser = {
  id: '1',
  email: 'student@example.com',
  name: 'Test Student',
  role: 'student' as const
};

export const mockExamMetadata = {
  title: 'EAPCET Mock Test - గణితం, భౌతిక శాస్త్రం, రసాయన శాస్త్రం',
  totalQuestions: 60,
  timeLimitMinutes: 180,
  totalMarks: 240
};

export const mockQuestions = [
  // Mathematics Questions (20 questions)
  {
    id: '1',
    text: 'If the radius of a circle is 7 cm, what is its area? | ఒక వృత్తం యొక్క వ్యాసార్థం 7 సెం.మీ అయితే, దాని వైశాల్యం ఎంత?',
    options: [
      { id: 'a', text: '154 sq.cm | 154 చ.సెం.మీ' },
      { id: 'b', text: '44 sq.cm | 44 చ.సెం.మీ' },
      { id: 'c', text: '22 sq.cm | 22 చ.సెం.మీ' },
      { id: 'd', text: '49 sq.cm | 49 చ.సెం.మీ' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'mathematics'
  },
  {
    id: '2',
    text: 'What are the roots of the equation x² - 5x + 6 = 0? | x² - 5x + 6 = 0 సమీకరణం యొక్క మూలాలు ఏవి?',
    options: [
      { id: 'a', text: '2, 3' },
      { id: 'b', text: '1, 6' },
      { id: 'c', text: '-2, -3' },
      { id: 'd', text: '5, 1' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'mathematics'
  },
  {
    id: '3',
    text: 'sin²θ + cos²θ = ? | sin²θ + cos²θ = ?',
    options: [
      { id: 'a', text: '0' },
      { id: 'b', text: '1' },
      { id: 'c', text: '2' },
      { id: 'd', text: '-1' }
    ],
    correctOptionId: 'b',
    marks: 4,
    subject: 'mathematics'
  },
  {
    id: '4',
    text: 'ఒక AP లో మొదటి పదం 3, సామాన్య భేదం 4 అయితే 10వ పదం ఎంత? | In an AP, if first term is 3 and common difference is 4, what is the 10th term?',
    options: [
      { id: 'a', text: '39' },
      { id: 'b', text: '43' },
      { id: 'c', text: '35' },
      { id: 'd', text: '47' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'mathematics'
  },
  {
    id: '5',
    text: 'log₁₀(100) = ? | log₁₀(100) = ?',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '2' },
      { id: 'c', text: '10' },
      { id: 'd', text: '100' }
    ],
    correctOptionId: 'b',
    marks: 4,
    subject: 'mathematics'
  },
  {
    id: '6',
    text: 'ఒక త్రిభుజంలో కోణాల మొత్తం ఎంత? | What is the sum of angles in a triangle?',
    options: [
      { id: 'a', text: '90°' },
      { id: 'b', text: '180°' },
      { id: 'c', text: '270°' },
      { id: 'd', text: '360°' }
    ],
    correctOptionId: 'b',
    marks: 4,
    subject: 'mathematics'
  },
  {
    id: '7',
    text: '∫x dx = ? | ∫x dx = ?',
    options: [
      { id: 'a', text: 'x²/2 + C' },
      { id: 'b', text: 'x² + C' },
      { id: 'c', text: '2x + C' },
      { id: 'd', text: 'x/2 + C' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'mathematics'
  },
  {
    id: '8',
    text: 'ఒక చతురస్రం యొక్క వైశాల్యం 64 చ.మీ అయితే దాని చుట్టుకొలత ఎంత? | If the area of a square is 64 sq.cm, what is its perimeter?',
    options: [
      { id: 'a', text: '32 సెం.మీ | 32 cm' },
      { id: 'b', text: '16 సెం.మీ | 16 cm' },
      { id: 'c', text: '8 సెం.మీ | 8 cm' },
      { id: 'd', text: '64 సెం.మీ | 64 cm' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'mathematics'
  },
  {
    id: '9',
    text: 'lim(x→0) (sin x)/x = ? | lim(x→0) (sin x)/x = ?',
    options: [
      { id: 'a', text: '0' },
      { id: 'b', text: '1' },
      { id: 'c', text: '∞' },
      { id: 'd', text: 'undefined' }
    ],
    correctOptionId: 'b',
    marks: 4,
    subject: 'mathematics'
  },
  {
    id: '10',
    text: 'ఒక వృత్తం యొక్క వ్యాసం 14 సెం.మీ అయితే దాని చుట్టుకొలత ఎంత? | If the diameter of a circle is 14 cm, what is its circumference?',
    options: [
      { id: 'a', text: '44 సెం.మీ | 44 cm' },
      { id: 'b', text: '22 సెం.మీ | 22 cm' },
      { id: 'c', text: '88 సెం.మీ | 88 cm' },
      { id: 'd', text: '14 సెం.మీ | 14 cm' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'mathematics'
  },
  {
    id: '11',
    text: 'మాట్రిక్స్ A = [1 2; 3 4] యొక్క డిటర్మినెంట్ ఎంత? | What is the determinant of matrix A = [1 2; 3 4]?',
    options: [
      { id: 'a', text: '-2' },
      { id: 'b', text: '2' },
      { id: 'c', text: '10' },
      { id: 'd', text: '-10' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'mathematics'
  },
  {
    id: '12',
    text: 'ఒక GP లో మొదటి పదం 2, సామాన్య నిష్పత్తి 3 అయితే 5వ పదం ఎంత? | In a GP, if first term is 2 and common ratio is 3, what is the 5th term?',
    options: [
      { id: 'a', text: '162' },
      { id: 'b', text: '54' },
      { id: 'c', text: '18' },
      { id: 'd', text: '486' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'mathematics'
  },
  {
    id: '13',
    text: 'tan 45° = ? | tan 45° = ?',
    options: [
      { id: 'a', text: '0' },
      { id: 'b', text: '1' },
      { id: 'c', text: '√3' },
      { id: 'd', text: '1/√3' }
    ],
    correctOptionId: 'b',
    marks: 4,
    subject: 'mathematics'
  },
  {
    id: '14',
    text: 'ఒక సమాంతర చతుర్భుజం యొక్క వైశాల్యం 48 చ.మీ, ఎత్తు 6 మీ అయితే దాని భూమి ఎంత? | If the area of a parallelogram is 48 sq.m and height is 6 m, what is its base?',
    options: [
      { id: 'a', text: '8 మీ | 8 m' },
      { id: 'b', text: '6 మీ | 6 m' },
      { id: 'c', text: '12 మీ | 12 m' },
      { id: 'd', text: '4 మీ | 4 m' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'mathematics'
  },
  {
    id: '15',
    text: 'd/dx (x³) = ? | d/dx (x³) = ?',
    options: [
      { id: 'a', text: '3x²' },
      { id: 'b', text: 'x²' },
      { id: 'c', text: '3x' },
      { id: 'd', text: 'x³/3' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'mathematics'
  },
  {
    id: '16',
    text: 'ఒక సంఖ్య యొక్క 25% = 50 అయితే ఆ సంఖ్య ఎంత? | If 25% of a number is 50, what is the number?',
    options: [
      { id: 'a', text: '200' },
      { id: 'b', text: '150' },
      { id: 'c', text: '100' },
      { id: 'd', text: '250' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'mathematics'
  },
  {
    id: '17',
    text: 'cos 60° = ? | cos 60° = ?',
    options: [
      { id: 'a', text: '1/2' },
      { id: 'b', text: '√3/2' },
      { id: 'c', text: '1' },
      { id: 'd', text: '0' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'mathematics'
  },
  {
    id: '18',
    text: 'ఒక దీర్ఘచతురస్రం యొక్క పొడవు 12 మీ, వెడల్పు 8 మీ అయితే దాని వైశాల్యం ఎంత? | If length of a rectangle is 12 m and width is 8 m, what is its area?',
    options: [
      { id: 'a', text: '96 చ.మీ | 96 sq.m' },
      { id: 'b', text: '40 చ.మీ | 40 sq.m' },
      { id: 'c', text: '20 చ.మీ | 20 sq.m' },
      { id: 'd', text: '80 చ.మీ | 80 sq.m' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'mathematics'
  },
  {
    id: '19',
    text: '√144 = ? | √144 = ?',
    options: [
      { id: 'a', text: '12' },
      { id: 'b', text: '14' },
      { id: 'c', text: '16' },
      { id: 'd', text: '10' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'mathematics'
  },
  {
    id: '20',
    text: 'ఒక త్రిభుజం యొక్క భుజాలు 3, 4, 5 అయితే దాని వైశాల్యం ఎంత? | If the sides of a triangle are 3, 4, 5, what is its area?',
    options: [
      { id: 'a', text: '6 చ.యూనిట్లు | 6 sq.units' },
      { id: 'b', text: '12 చ.యూనిట్లు | 12 sq.units' },
      { id: 'c', text: '15 చ.యూనిట్లు | 15 sq.units' },
      { id: 'd', text: '10 చ.యూనిట్లు | 10 sq.units' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'mathematics'
  },

  // Physics Questions (20 questions)
  {
    id: '21',
    text: 'What is the acceleration due to gravity on Earth? | భూమిపై గురుత్వాకర్షణ త్వరణం ఎంత?',
    options: [
      { id: 'a', text: '9.8 m/s² | 9.8 మీ/సె²' },
      { id: 'b', text: '10 m/s² | 10 మీ/సె²' },
      { id: 'c', text: '8.9 m/s² | 8.9 మీ/సె²' },
      { id: 'd', text: '11 m/s² | 11 మీ/సె²' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'physics'
  },
  {
    id: '22',
    text: 'కాంతి వేగం ఎంత? | What is the speed of light?',
    options: [
      { id: 'a', text: '3 × 10⁸ మీ/సె | 3 × 10⁸ m/s' },
      { id: 'b', text: '3 × 10⁶ మీ/సె | 3 × 10⁶ m/s' },
      { id: 'c', text: '3 × 10⁷ మీ/సె | 3 × 10⁷ m/s' },
      { id: 'd', text: '3 × 10⁹ మీ/సె | 3 × 10⁹ m/s' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'physics'
  },
  {
    id: '23',
    text: 'ఓహ్మ్ నియమం ప్రకారం V = ? | According to Ohm\'s law, V = ?',
    options: [
      { id: 'a', text: 'I/R' },
      { id: 'b', text: 'IR' },
      { id: 'c', text: 'I + R' },
      { id: 'd', text: 'I - R' }
    ],
    correctOptionId: 'b',
    marks: 4,
    subject: 'physics'
  },
  {
    id: '24',
    text: 'శక్తి యొక్క SI యూనిట్ ఏది? | What is the SI unit of energy?',
    options: [
      { id: 'a', text: 'వాట్ | Watt' },
      { id: 'b', text: 'జూల్ | Joule' },
      { id: 'c', text: 'న్యూటన్ | Newton' },
      { id: 'd', text: 'పాస్కల్ | Pascal' }
    ],
    correctOptionId: 'b',
    marks: 4,
    subject: 'physics'
  },
  {
    id: '25',
    text: 'ధ్వని గాలిలో ఎంత వేగంతో ప్రయాణిస్తుంది? | At what speed does sound travel in air?',
    options: [
      { id: 'a', text: '330 మీ/సె | 330 m/s' },
      { id: 'b', text: '340 మీ/సె | 340 m/s' },
      { id: 'c', text: '350 మీ/సె | 350 m/s' },
      { id: 'd', text: '360 మీ/సె | 360 m/s' }
    ],
    correctOptionId: 'b',
    marks: 4,
    subject: 'physics'
  },
  {
    id: '26',
    text: 'న్యూటన్ యొక్క మొదటి నియమాన్ని ఏమని అంటారు? | What is Newton\'s first law also known as?',
    options: [
      { id: 'a', text: 'జడత్వ నియమం | Law of inertia' },
      { id: 'b', text: 'త్వరణ నియమం | Law of acceleration' },
      { id: 'c', text: 'చర్య-ప్రతిచర్య నియమం | Action-reaction law' },
      { id: 'd', text: 'గురుత్వాకర్షణ నియమం | Law of gravitation' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'physics'
  },
  {
    id: '27',
    text: 'విద్యుత్ ప్రవాహం యొక్క SI యూనిట్ ఏది? | What is the SI unit of electric current?',
    options: [
      { id: 'a', text: 'వోల్ట్ | Volt' },
      { id: 'b', text: 'ఆంపియర్ | Ampere' },
      { id: 'c', text: 'ఓహ్మ్ | Ohm' },
      { id: 'd', text: 'వాట్ | Watt' }
    ],
    correctOptionId: 'b',
    marks: 4,
    subject: 'physics'
  },
  {
    id: '28',
    text: 'ఒక వస్తువు 10 మీ/సె వేగంతో 5 సెకన్లు ప్రయాణించినట్లయితే దాని దూరం ఎంత? | If an object travels at 10 m/s for 5 seconds, what is the distance?',
    options: [
      { id: 'a', text: '50 మీ | 50 m' },
      { id: 'b', text: '15 మీ | 15 m' },
      { id: 'c', text: '2 మీ | 2 m' },
      { id: 'd', text: '25 మీ | 25 m' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'physics'
  },
  {
    id: '29',
    text: 'కాంతి వక్రీభవనం ఎప్పుడు జరుగుతుంది? | When does refraction of light occur?',
    options: [
      { id: 'a', text: 'ఒకే మాధ్యమంలో | In same medium' },
      { id: 'b', text: 'వేర్వేరు మాధ్యమాల మధ్య | Between different media' },
      { id: 'c', text: 'వాక్యూమ్‌లో | In vacuum' },
      { id: 'd', text: 'అద్దంలో | In mirror' }
    ],
    correctOptionId: 'b',
    marks: 4,
    subject: 'physics'
  },
  {
    id: '30',
    text: 'ఒక వస్తువు యొక్క బరువు చంద్రునిపై భూమిపై కంటే ఎంత రెట్లు? | How many times is the weight of an object on moon compared to earth?',
    options: [
      { id: 'a', text: '1/6 రెట్లు | 1/6 times' },
      { id: 'b', text: '6 రెట్లు | 6 times' },
      { id: 'c', text: 'సమానం | Same' },
      { id: 'd', text: '1/2 రెట్లు | 1/2 times' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'physics'
  },
  {
    id: '31',
    text: 'విద్యుత్ శక్తి P = ? | Electric power P = ?',
    options: [
      { id: 'a', text: 'VI' },
      { id: 'b', text: 'V/I' },
      { id: 'c', text: 'V + I' },
      { id: 'd', text: 'V - I' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'physics'
  },
  {
    id: '32',
    text: 'ఒక లెన్స్ యొక్క ఫోకస్ దూరం 20 సెం.మీ అయితే దాని శక్తి ఎంత? | If focal length of a lens is 20 cm, what is its power?',
    options: [
      { id: 'a', text: '5 డయాప్టర్ | 5 diopter' },
      { id: 'b', text: '0.2 డయాప్టర్ | 0.2 diopter' },
      { id: 'c', text: '20 డయాప్టర్ | 20 diopter' },
      { id: 'd', text: '2 డయాప్టర్ | 2 diopter' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'physics'
  },
  {
    id: '33',
    text: 'అయస్కాంత క్షేత్రం యొక్క SI యూనిట్ ఏది? | What is the SI unit of magnetic field?',
    options: [
      { id: 'a', text: 'టెస్లా | Tesla' },
      { id: 'b', text: 'వెబర్ | Weber' },
      { id: 'c', text: 'గాస్ | Gauss' },
      { id: 'd', text: 'హెన్రీ | Henry' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'physics'
  },
  {
    id: '34',
    text: 'ఒక వస్తువు 2 మీ ఎత్తు నుండి పడిపోతే భూమిని చేరుకోవడానికి ఎంత సమయం పడుతుంది? | How much time does it take for an object to reach ground when dropped from 2m height?',
    options: [
      { id: 'a', text: '0.64 సె | 0.64 s' },
      { id: 'b', text: '1 సె | 1 s' },
      { id: 'c', text: '0.5 సె | 0.5 s' },
      { id: 'd', text: '2 సె | 2 s' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'physics'
  },
  {
    id: '35',
    text: 'కాంతి యొక్క తరంగ లక్షణాన్ని చూపించే దృగ్విషయం ఏది? | Which phenomenon shows wave nature of light?',
    options: [
      { id: 'a', text: 'వక్రీభవనం | Refraction' },
      { id: 'b', text: 'వ్యతికరణం | Interference' },
      { id: 'c', text: 'ప్రతిబింబం | Reflection' },
      { id: 'd', text: 'వికీరణం | Dispersion' }
    ],
    correctOptionId: 'b',
    marks: 4,
    subject: 'physics'
  },
  {
    id: '36',
    text: 'ఒక కార్ 60 కిమీ/గం వేగంతో ప్రయాణిస్తుంటే మీ/సె లో దాని వేగం ఎంత? | If a car travels at 60 km/hr, what is its speed in m/s?',
    options: [
      { id: 'a', text: '16.67 మీ/సె | 16.67 m/s' },
      { id: 'b', text: '60 మీ/సె | 60 m/s' },
      { id: 'c', text: '3.6 మీ/సె | 3.6 m/s' },
      { id: 'd', text: '216 మీ/సె | 216 m/s' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'physics'
  },
  {
    id: '37',
    text: 'ఒక స్ప్రింగ్‌పై 10N బలం ప్రయోగించినప్పుడు 2 సెం.మీ పొడవు పెరిగింది. స్ప్రింగ్ స్థిరాంకం ఎంత? | When 10N force is applied on a spring, it extends by 2cm. What is spring constant?',
    options: [
      { id: 'a', text: '500 N/m' },
      { id: 'b', text: '5 N/m' },
      { id: 'c', text: '20 N/m' },
      { id: 'd', text: '0.2 N/m' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'physics'
  },
  {
    id: '38',
    text: 'ఒక వస్తువు యొక్క ద్రవ్యరాశి 5 కిలోలు, త్వరణం 2 మీ/సె² అయితే దానిపై పనిచేసే బలం ఎంత? | If mass of an object is 5 kg and acceleration is 2 m/s², what is the force?',
    options: [
      { id: 'a', text: '10 N' },
      { id: 'b', text: '7 N' },
      { id: 'c', text: '3 N' },
      { id: 'd', text: '2.5 N' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'physics'
  },
  {
    id: '39',
    text: 'ఒక ట్రాన్స్‌ఫార్మర్‌లో ప్రైమరీ కాయిల్‌లో 100 చుట్టలు, సెకండరీలో 200 చుట్టలు ఉంటే వోల్టేజ్ నిష్పత్తి ఎంత? | In a transformer, primary has 100 turns and secondary has 200 turns. What is voltage ratio?',
    options: [
      { id: 'a', text: '1:2' },
      { id: 'b', text: '2:1' },
      { id: 'c', text: '1:1' },
      { id: 'd', text: '1:4' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'physics'
  },
  {
    id: '40',
    text: 'ఒక వస్తువు 20 మీ/సె ప్రారంభ వేగంతో 2 మీ/సె² త్వరణంతో 5 సెకన్లు ప్రయాణించిన దూరం ఎంత? | Distance traveled by an object with initial velocity 20 m/s, acceleration 2 m/s² for 5 seconds?',
    options: [
      { id: 'a', text: '125 మీ | 125 m' },
      { id: 'b', text: '100 మీ | 100 m' },
      { id: 'c', text: '110 మీ | 110 m' },
      { id: 'd', text: '150 మీ | 150 m' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'physics'
  },

  // Chemistry Questions (20 questions)
  {
    id: '41',
    text: 'What is the chemical formula of water? | నీటి రసాయన సూత్రం ఏది?',
    options: [
      { id: 'a', text: 'H₂O' },
      { id: 'b', text: 'CO₂' },
      { id: 'c', text: 'NH₃' },
      { id: 'd', text: 'CH₄' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'chemistry'
  },
  {
    id: '42',
    text: 'కార్బన్ యొక్క పరమాణు సంఖ్య ఎంత? | What is the atomic number of carbon?',
    options: [
      { id: 'a', text: '5' },
      { id: 'b', text: '6' },
      { id: 'c', text: '7' },
      { id: 'd', text: '8' }
    ],
    correctOptionId: 'b',
    marks: 4,
    subject: 'chemistry'
  },
  {
    id: '43',
    text: 'ఆమ్లాలు నీటిలో విడుదల చేసేవి ఏవి? | What do acids release in water?',
    options: [
      { id: 'a', text: 'OH⁻ అయాన్లు | OH⁻ ions' },
      { id: 'b', text: 'H⁺ అయాన్లు | H⁺ ions' },
      { id: 'c', text: 'Cl⁻ అయాన్లు | Cl⁻ ions' },
      { id: 'd', text: 'Na⁺ అయాన్లు | Na⁺ ions' }
    ],
    correctOptionId: 'b',
    marks: 4,
    subject: 'chemistry'
  },
  {
    id: '44',
    text: 'మెండలీవ్ ఆవర్తన పట్టికలో మూలకాలు ఏ క్రమంలో అమర్చబడ్డాయి? | In Mendeleev\'s periodic table, elements are arranged in order of?',
    options: [
      { id: 'a', text: 'పరమాణు సంఖ్య | Atomic number' },
      { id: 'b', text: 'పరమాణు ద్రవ్యరాశి | Atomic mass' },
      { id: 'c', text: 'ఎలక్ట్రాన్ సంఖ్య | Number of electrons' },
      { id: 'd', text: 'న్యూట్రాన్ సంఖ్య | Number of neutrons' }
    ],
    correctOptionId: 'b',
    marks: 4,
    subject: 'chemistry'
  },
  {
    id: '45',
    text: 'ఆక్సిజన్ వాయువు యొక్క అణు సూత్రం ఏది? | What is the molecular formula of oxygen gas?',
    options: [
      { id: 'a', text: 'O' },
      { id: 'b', text: 'O₂' },
      { id: 'c', text: 'O₃' },
      { id: 'd', text: 'O₄' }
    ],
    correctOptionId: 'b',
    marks: 4,
    subject: 'chemistry'
  },
  {
    id: '46',
    text: 'pH స్కేల్ పరిధి ఎంత? | What is the range of pH scale?',
    options: [
      { id: 'a', text: '0-10' },
      { id: 'b', text: '0-14' },
      { id: 'c', text: '1-14' },
      { id: 'd', text: '0-12' }
    ],
    correctOptionId: 'b',
    marks: 4,
    subject: 'chemistry'
  },
  {
    id: '47',
    text: 'సోడియం క్లోరైడ్ యొక్క రసాయన సూత్రం ఏది? | What is the chemical formula of sodium chloride?',
    options: [
      { id: 'a', text: 'NaCl' },
      { id: 'b', text: 'Na₂Cl' },
      { id: 'c', text: 'NaCl₂' },
      { id: 'd', text: 'Na₂Cl₂' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'chemistry'
  },
  {
    id: '48',
    text: 'ఒక మోల్ వాయువు STP వద్ద ఎంత వాల్యూమ్ ఆక్రమిస్తుంది? | What volume does one mole of gas occupy at STP?',
    options: [
      { id: 'a', text: '22.4 లీటర్లు | 22.4 liters' },
      { id: 'b', text: '11.2 లీటర్లు | 11.2 liters' },
      { id: 'c', text: '44.8 లీటర్లు | 44.8 liters' },
      { id: 'd', text: '1 లీటర్ | 1 liter' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'chemistry'
  },
  {
    id: '49',
    text: 'కాల్షియం కార్బోనేట్ యొక్క రసాయన సూత్రం ఏది? | What is the chemical formula of calcium carbonate?',
    options: [
      { id: 'a', text: 'CaCO₃' },
      { id: 'b', text: 'Ca₂CO₃' },
      { id: 'c', text: 'CaCO₂' },
      { id: 'd', text: 'Ca(CO₃)₂' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'chemistry'
  },
  {
    id: '50',
    text: 'హైడ్రోజన్ యొక్క పరమాణు ద్రవ్యరాశి ఎంత? | What is the atomic mass of hydrogen?',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '2' },
      { id: 'c', text: '0.5' },
      { id: 'd', text: '4' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'chemistry'
  },
  {
    id: '51',
    text: 'ఆమ్లాలు మరియు క్షారాలు కలిసినప్పుడు ఏమి ఏర్పడుతుంది? | What is formed when acids and bases react?',
    options: [
      { id: 'a', text: 'ఉప్పు మరియు నీరు | Salt and water' },
      { id: 'b', text: 'వాయువు | Gas' },
      { id: 'c', text: 'ఆక్సైడ్ | Oxide' },
      { id: 'd', text: 'హైడ్రైడ్ | Hydride' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'chemistry'
  },
  {
    id: '52',
    text: 'మీథేన్ యొక్క రసాయన సూత్రం ఏది? | What is the chemical formula of methane?',
    options: [
      { id: 'a', text: 'CH₄' },
      { id: 'b', text: 'C₂H₆' },
      { id: 'c', text: 'C₂H₄' },
      { id: 'd', text: 'C₂H₂' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'chemistry'
  },
  {
    id: '53',
    text: 'ఆవర్తన పట్టికలో మొదటి గ్రూప్ మూలకాలను ఏమని అంటారు? | What are the first group elements in periodic table called?',
    options: [
      { id: 'a', text: 'ఆల్కలీ లోహాలు | Alkali metals' },
      { id: 'b', text: 'ఆల్కలీన్ ఎర్త్ లోహాలు | Alkaline earth metals' },
      { id: 'c', text: 'హాలోజన్లు | Halogens' },
      { id: 'd', text: 'నోబుల్ వాయువులు | Noble gases' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'chemistry'
  },
  {
    id: '54',
    text: 'అమ్మోనియా యొక్క రసాయన సూత్రం ఏది? | What is the chemical formula of ammonia?',
    options: [
      { id: 'a', text: 'NH₃' },
      { id: 'b', text: 'NH₄' },
      { id: 'c', text: 'N₂H₄' },
      { id: 'd', text: 'NH₂' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'chemistry'
  },
  {
    id: '55',
    text: 'కార్బన్ డై ఆక్సైడ్ యొక్క రసాయన సూత్రం ఏది? | What is the chemical formula of carbon dioxide?',
    options: [
      { id: 'a', text: 'CO₂' },
      { id: 'b', text: 'CO' },
      { id: 'c', text: 'C₂O' },
      { id: 'd', text: 'C₂O₂' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'chemistry'
  },
  {
    id: '56',
    text: 'ఒక అణువులో ప్రోటాన్లు మరియు ఎలక్ట్రాన్ల సంఖ్య సమానంగా ఉంటే అది ఏమిటి? | If number of protons and electrons in an atom are equal, what is it?',
    options: [
      { id: 'a', text: 'తటస్థ అణువు | Neutral atom' },
      { id: 'b', text: 'కేషన్ | Cation' },
      { id: 'c', text: 'అనయాన్ | Anion' },
      { id: 'd', text: 'ఐసోటోప్ | Isotope' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'chemistry'
  },
  {
    id: '57',
    text: 'హైడ్రోక్లోరిక్ ఆమ్లం యొక్క రసాయన సూత్రం ఏది? | What is the chemical formula of hydrochloric acid?',
    options: [
      { id: 'a', text: 'HCl' },
      { id: 'b', text: 'H₂SO₄' },
      { id: 'c', text: 'HNO₃' },
      { id: 'd', text: 'CH₃COOH' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'chemistry'
  },
  {
    id: '58',
    text: 'ఆవర్తన పట్టికలో 18వ గ్రూప్ మూలకాలను ఏమని అంటారు? | What are the 18th group elements in periodic table called?',
    options: [
      { id: 'a', text: 'నోబుల్ వాయువులు | Noble gases' },
      { id: 'b', text: 'హాలోజన్లు | Halogens' },
      { id: 'c', text: 'ఆల్కలీ లోహాలు | Alkali metals' },
      { id: 'd', text: 'ట్రాన్జిషన్ లోహాలు | Transition metals' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'chemistry'
  },
  {
    id: '59',
    text: 'సల్ఫ్యూరిక్ ఆమ్లం యొక్క రసాయన సూత్రం ఏది? | What is the chemical formula of sulfuric acid?',
    options: [
      { id: 'a', text: 'H₂SO₄' },
      { id: 'b', text: 'HCl' },
      { id: 'c', text: 'HNO₃' },
      { id: 'd', text: 'H₃PO₄' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'chemistry'
  },
  {
    id: '60',
    text: 'ఒక మూలకం యొక్క వేలెన్సీ ఎలక్ట్రాన్లు ఎక్కడ ఉంటాయి? | Where are the valence electrons of an element located?',
    options: [
      { id: 'a', text: 'బయటి కక్ష్యలో | Outermost shell' },
      { id: 'b', text: 'లోపలి కక్ష్యలో | Inner shell' },
      { id: 'c', text: 'న్యూక్లియస్‌లో | In nucleus' },
      { id: 'd', text: 'మధ్య కక్ష్యలో | Middle shell' }
    ],
    correctOptionId: 'a',
    marks: 4,
    subject: 'chemistry'
  }
];