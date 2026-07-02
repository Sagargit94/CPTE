require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const questions = [
  // ===== MUSCULOSKELETAL (30) =====
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A patient presents with pain at the lateral epicondyle that worsens with resisted wrist extension. Which structure is most likely involved?',
    option_a: 'Flexor carpi radialis', option_b: 'Extensor carpi radialis brevis', option_c: 'Pronator teres', option_d: 'Brachioradialis',
    correct_option_index: 1,
    rationale: 'Lateral epicondylitis (tennis elbow) most commonly involves the extensor carpi radialis brevis (ECRB) tendon, which attaches to the lateral epicondyle and is stressed during resisted wrist extension.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'Which special test is most specific for a supraspinatus tear?',
    option_a: 'Neer impingement test', option_b: 'Hawkins-Kennedy test', option_c: 'Empty can (Jobe) test', option_d: 'Speed\'s test',
    correct_option_index: 2,
    rationale: 'The empty can (Jobe) test isolates the supraspinatus by having the patient abduct to 90°, horizontally adduct 30°, and internally rotate (thumb down). It has good specificity for supraspinatus pathology.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A patient with anterior cruciate ligament (ACL) tear will most likely demonstrate a positive:',
    option_a: 'McMurray test', option_b: 'Lachman test', option_c: 'Valgus stress test', option_d: 'Ober test',
    correct_option_index: 1,
    rationale: 'The Lachman test is the most sensitive and specific clinical test for ACL tears. It is performed at 20-30° knee flexion and assesses anterior tibial translation relative to the femur.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'Which muscle is the primary internal rotator of the hip?',
    option_a: 'Gluteus maximus', option_b: 'Piriformis', option_c: 'Gluteus medius (anterior fibers)', option_d: 'Obturator externus',
    correct_option_index: 2,
    rationale: 'The anterior fibers of the gluteus medius, along with the tensor fascia latae and gluteus minimus, are the primary internal rotators of the hip. The gluteus maximus and piriformis are external rotators.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A patient presents with a dropped wrist and weakness of finger extension after a humeral shaft fracture. Which nerve is most likely injured?',
    option_a: 'Median nerve', option_b: 'Ulnar nerve', option_c: 'Radial nerve', option_d: 'Axillary nerve',
    correct_option_index: 2,
    rationale: 'The radial nerve winds around the posterior humerus in the spiral groove and is commonly injured with humeral shaft fractures, leading to wrist drop and loss of finger/thumb extension.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'Which structure is tested with the McMurray test?',
    option_a: 'Anterior cruciate ligament', option_b: 'Posterior cruciate ligament', option_c: 'Meniscus', option_d: 'Medial collateral ligament',
    correct_option_index: 2,
    rationale: 'The McMurray test assesses for meniscal tears. Internal rotation with valgus stress tests the lateral meniscus; external rotation with varus stress tests the medial meniscus. A palpable or audible click is a positive sign.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'According to the APTA clinical practice guidelines, which intervention has the strongest evidence for acute low back pain?',
    option_a: 'Lumbar stabilization exercises', option_b: 'Manipulation and staying active', option_c: 'McKenzie extension exercises only', option_d: 'Passive modalities and bed rest',
    correct_option_index: 1,
    rationale: 'Strong evidence supports spinal manipulation and advice to stay active for acute low back pain. Bed rest is discouraged. Stabilization exercises are more appropriate for subacute or chronic stages.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'Which type of muscle contraction produces the most force?',
    option_a: 'Concentric', option_b: 'Isometric', option_c: 'Eccentric', option_d: 'Isokinetic',
    correct_option_index: 2,
    rationale: 'Eccentric contractions generate the greatest force because cross-bridge cycling is assisted by passive elastic components of the muscle and titin. This is why eccentric exercises are used in tendon rehabilitation.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A patient presents with pain and weakness in the C6 dermatome and myotome. Which reflex would most likely be diminished?',
    option_a: 'Triceps reflex', option_b: 'Biceps reflex', option_c: 'Patellar reflex', option_d: 'Achilles reflex',
    correct_option_index: 1,
    rationale: 'The biceps reflex (and brachioradialis reflex) is mediated by the C5-C6 nerve roots. C6 radiculopathy classically presents with diminished biceps reflex, weakness of wrist extension, and sensory loss in the thumb and index finger.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'During the stance phase of gait, which hip muscle prevents the pelvis from dropping on the contralateral side (Trendelenburg gait)?',
    option_a: 'Hip flexors', option_b: 'Gluteus maximus', option_c: 'Gluteus medius', option_d: 'Adductor magnus',
    correct_option_index: 2,
    rationale: 'The gluteus medius on the stance limb side prevents contralateral pelvic drop (Trendelenburg sign) during single-limb support. Weakness results in the trunk lurching toward the weak side (compensated Trendelenburg).'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'Which manual therapy technique is most appropriate for a patient with a C5-C6 facet joint restriction causing cervical rotation limitation to the right?',
    option_a: 'Distraction traction in flexion', option_b: 'High-velocity low-amplitude (HVLA) rotation to the right', option_c: 'Soft tissue mobilization of the left upper trapezius', option_d: 'Passive range of motion in extension',
    correct_option_index: 1,
    rationale: 'For a unilateral facet joint restriction limiting rotation to the same side, HVLA manipulation directed toward the restricted joint is indicated. Rotating toward the restriction gaps the ipsilateral facet and can restore motion.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A patient with osteoarthritis of the right knee has a varus deformity. Which structure is most stressed?',
    option_a: 'Lateral compartment and lateral collateral ligament', option_b: 'Medial compartment and medial collateral ligament', option_c: 'Patellofemoral joint', option_d: 'Posterior cruciate ligament',
    correct_option_index: 1,
    rationale: 'Varus alignment (bow-legged) increases compressive load on the medial knee compartment and places the medial collateral ligament under tension. This is the most common pattern in knee osteoarthritis.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'Which grade of joint mobilization is most appropriate for pain relief in an acutely inflamed joint with significant muscle guarding?',
    option_a: 'Grade I', option_b: 'Grade III', option_c: 'Grade IV', option_d: 'Grade V',
    correct_option_index: 0,
    rationale: 'Grade I mobilizations are small-amplitude oscillations at the beginning of range, used primarily for pain modulation through stimulation of mechanoreceptors without stressing irritated structures.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'The scapulohumeral rhythm ratio during shoulder abduction is approximately:',
    option_a: '1:1 (scapula:humerus)', option_b: '2:1 (humerus:scapula)', option_c: '3:1 (humerus:scapula)', option_d: '1:2 (humerus:scapula)',
    correct_option_index: 1,
    rationale: 'Scapulohumeral rhythm is approximately 2:1, meaning for every 3° of shoulder abduction, 2° occurs at the glenohumeral joint and 1° at the scapulothoracic joint. Total: 120° GH + 60° ST = 180°.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A patient has a positive FABER (Patrick) test. Which condition is most likely?',
    option_a: 'Piriformis syndrome', option_b: 'Sacroiliac joint dysfunction or hip pathology', option_c: 'Lumbar disc herniation at L4-L5', option_d: 'Greater trochanteric bursitis',
    correct_option_index: 1,
    rationale: 'The FABER test (Flexion, ABduction, External Rotation) stresses the sacroiliac joint and hip joint. A positive test (pain or limited motion) suggests SI joint dysfunction, hip joint pathology, or iliopsoas tightness.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'Which stage of fracture healing involves woven bone formation by osteoblasts?',
    option_a: 'Inflammatory phase', option_b: 'Soft callus phase', option_c: 'Hard callus (bony callus) phase', option_d: 'Remodeling phase',
    correct_option_index: 2,
    rationale: 'In the hard callus phase, osteoblasts replace the cartilaginous soft callus with woven bone. This occurs approximately 3-6 weeks after fracture. Remodeling then converts woven bone to lamellar bone.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'Which nerve provides sensation to the "anatomical snuffbox" area of the hand?',
    option_a: 'Ulnar nerve', option_b: 'Median nerve', option_c: 'Radial nerve (superficial branch)', option_d: 'Anterior interosseous nerve',
    correct_option_index: 2,
    rationale: 'The superficial branch of the radial nerve provides sensation to the dorsal aspect of the thumb, index finger, and the anatomical snuffbox region (dorsal radial wrist area).'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A patient has a positive Ober test. This suggests tightness of the:',
    option_a: 'Hip flexors', option_b: 'Iliotibial band and tensor fascia latae', option_c: 'Hamstrings', option_d: 'Adductors',
    correct_option_index: 1,
    rationale: 'The Ober test assesses tightness of the IT band and TFL. The patient is sidelying, the hip is abducted/extended, and the leg is allowed to adduct. Inability to adduct past horizontal indicates IT band tightness.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'During closed kinetic chain exercises, the tibia moves over a fixed foot. When the knee flexes, the tibia:',
    option_a: 'Internally rotates', option_b: 'Externally rotates', option_c: 'Remains stationary', option_d: 'Translates anteriorly',
    correct_option_index: 0,
    rationale: 'In closed chain, the foot is fixed. When the knee flexes, the tibia internally rotates (screw-home mechanism reversal). This is opposite of open chain where the femur externally rotates during knee extension.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'Which test assesses for thoracic outlet syndrome?',
    option_a: 'Adson\'s test', option_b: 'Allen test', option_c: 'Phalen\'s test', option_d: 'Tinel\'s sign at the wrist',
    correct_option_index: 0,
    rationale: 'Adson\'s test (turn head to ipsilateral side and hold breath) assesses for compression of the subclavian artery and brachial plexus between the anterior and middle scalenes—thoracic outlet syndrome.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'The capsular pattern for the glenohumeral joint is:',
    option_a: 'Flexion > abduction > external rotation limitation', option_b: 'External rotation > abduction > internal rotation limitation', option_c: 'Abduction > external rotation > flexion limitation', option_d: 'Internal rotation > flexion > abduction limitation',
    correct_option_index: 1,
    rationale: 'The glenohumeral capsular pattern (Cyriax) is greatest limitation in external rotation, followed by abduction, then internal rotation. This pattern occurs in adhesive capsulitis (frozen shoulder).'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A patient presents with inability to oppose the thumb and loss of sensation on the palmar surface of the thumb, index, and middle fingers. Which nerve is involved?',
    option_a: 'Ulnar nerve', option_b: 'Radial nerve', option_c: 'Median nerve', option_d: 'Musculocutaneous nerve',
    correct_option_index: 2,
    rationale: 'The median nerve innervates the thenar muscles (including opponens pollicis) and provides sensation to the palmar surface of the thumb, index, middle finger, and radial half of the ring finger.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'What is the recommended knee angle for quadriceps strengthening to minimize patellofemoral joint stress?',
    option_a: '0-30° flexion (open chain)', option_b: '60-90° flexion (open chain)', option_c: '0-60° flexion (closed chain)', option_d: '90-120° flexion (closed chain)',
    correct_option_index: 0,
    rationale: 'For patellofemoral conditions, open-chain knee extension from 0-30° minimizes patellofemoral contact forces. In closed chain, squats from 0-60° are preferred. Deeper flexion increases compressive forces on the patella.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A patient has Achilles tendinopathy. Which exercise has the strongest evidence for treatment?',
    option_a: 'Concentric calf raises', option_b: 'Eccentric calf raises (Alfredson protocol)', option_c: 'Stretching and ice', option_d: 'Ultrasound and massage',
    correct_option_index: 1,
    rationale: 'The Alfredson eccentric loading protocol (3 sets of 15 eccentric calf raises, twice daily, for 12 weeks) has the strongest Level I evidence for mid-portion Achilles tendinopathy and is the gold standard intervention.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'Which type of hip precautions are standard after posterior total hip arthroplasty?',
    option_a: 'Avoid hip extension, external rotation, and abduction', option_b: 'Avoid hip flexion beyond 90°, adduction, and internal rotation', option_c: 'Avoid hip flexion beyond 90°, abduction, and external rotation', option_d: 'Avoid hip flexion beyond 60°, adduction, and external rotation',
    correct_option_index: 1,
    rationale: 'Posterior hip arthroplasty precautions: avoid hip flexion >90°, adduction past midline, and internal rotation to prevent posterior dislocation. These protect the posterior capsule and external rotators that were divided.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'Which gait deviation is characteristic of a patient with hip flexion contracture?',
    option_a: 'Foot drop', option_b: 'Increased lumbar lordosis during stance', option_c: 'Trendelenburg gait', option_d: 'Scissor gait',
    correct_option_index: 1,
    rationale: 'Hip flexion contracture prevents full hip extension during stance, so the pelvis anteriorly tilts and lumbar lordosis increases to compensate. This allows forward progression despite the contracture.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A 70-year-old with osteoporosis has a T-score of -2.7. Which activity should the physical therapist AVOID recommending?',
    option_a: 'Weight-bearing walking', option_b: 'High-impact plyometric jumping', option_c: 'Resistance training with light weights', option_d: 'Balance training',
    correct_option_index: 1,
    rationale: 'Patients with osteoporosis (T-score ≤ -2.5) should avoid high-impact plyometrics due to fracture risk. Weight-bearing, resistance training, and balance exercises are beneficial and evidence-based for this population.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'The Thomas test is used to assess tightness of the:',
    option_a: 'Hamstrings', option_b: 'Hip flexors (iliopsoas and rectus femoris)', option_c: 'Adductors', option_d: 'Piriformis',
    correct_option_index: 1,
    rationale: 'The Thomas test detects hip flexor tightness. With one hip held in full flexion, if the opposite thigh rises off the table, the iliopsoas is tight. If the knee extends, the rectus femoris component is tight.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'Which grade of muscle strength (Manual Muscle Testing) indicates that a patient can move against gravity through full range of motion?',
    option_a: 'Grade 2', option_b: 'Grade 3', option_c: 'Grade 4', option_d: 'Grade 5',
    correct_option_index: 1,
    rationale: 'MMT Grade 3 (Fair): the muscle moves the limb through full range of motion against gravity with no external resistance. Grade 4 moves against some resistance; Grade 5 moves against full resistance.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'Boutonniere deformity of the finger involves:',
    option_a: 'DIP hyperextension and PIP flexion', option_b: 'PIP flexion and DIP hyperextension', option_c: 'MCP hyperextension and PIP/DIP flexion', option_d: 'PIP hyperextension and DIP flexion',
    correct_option_index: 1,
    rationale: 'Boutonnière deformity: PIP joint flexion and DIP joint hyperextension, caused by rupture of the central slip of the extensor tendon. Swan-neck deformity is the opposite: PIP hyperextension and DIP flexion.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'Which condition is associated with de Quervain\'s tenosynovitis?',
    option_a: 'Inflammation of the extensor pollicis longus tendon', option_b: 'Inflammation of the abductor pollicis longus and extensor pollicis brevis tendons', option_c: 'Inflammation of the flexor pollicis longus tendon', option_d: 'Carpal tunnel syndrome affecting the thumb',
    correct_option_index: 1,
    rationale: 'De Quervain\'s tenosynovitis affects the first dorsal compartment containing the abductor pollicis longus (APL) and extensor pollicis brevis (EPB). Finkelstein\'s test (ulnar deviation with thumb tucked) is the diagnostic test.'
  },

  // ===== NEUROMUSCULAR (20) =====
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'A patient with a left middle cerebral artery (MCA) stroke presents with right hemiplegia and aphasia. Which type of aphasia is most likely if the anterior MCA territory is affected?',
    option_a: 'Wernicke\'s (receptive) aphasia', option_b: 'Broca\'s (expressive) aphasia', option_c: 'Global aphasia', option_d: 'Anomic aphasia',
    correct_option_index: 1,
    rationale: 'Broca\'s area is in the posterior inferior frontal lobe (anterior MCA territory). Damage here causes Broca\'s (expressive) aphasia: non-fluent speech with intact comprehension. Wernicke\'s area is in the posterior temporal lobe (posterior MCA).'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'A C6 complete SCI patient has intact wrist extension but no finger flexion or extension. What is the expected functional outcome regarding hand function?',
    option_a: 'No functional hand use', option_b: 'Tenodesis grasp using passive wrist extension', option_c: 'Full functional grasp with adaptive equipment only', option_d: 'Normal pinch strength',
    correct_option_index: 1,
    rationale: 'C6 SCI patients have wrist extensors (ECRL/ECRB) but no finger flexors or extensors. They can use tenodesis: wrist extension causes passive finger flexion, creating a functional grasp. This is the key adaptive mechanism at this level.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'Which scale is most commonly used to measure spasticity in neurological conditions?',
    option_a: 'Ashworth Scale (Modified)', option_b: 'Berg Balance Scale', option_c: 'Fugl-Meyer Assessment', option_d: 'FIM Scale',
    correct_option_index: 0,
    rationale: 'The Modified Ashworth Scale (MAS) grades spasticity from 0-4 based on resistance felt during passive ROM. It is the most widely used clinical tool for measuring spasticity in stroke, SCI, and other neurological conditions.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'A patient with Parkinson\'s disease demonstrates festinating gait. This is best described as:',
    option_a: 'Wide-based gait with lateral trunk sway', option_b: 'Progressively accelerating short shuffling steps', option_c: 'Circumduction of the lower extremity', option_d: 'Step-to pattern with decreased stride length',
    correct_option_index: 1,
    rationale: 'Festinating gait in Parkinson\'s is characterized by progressively increasing cadence with decreasing step length, as if the patient is chasing their center of mass forward to prevent falling. The trunk leans forward (propulsive posture).'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'A patient with multiple sclerosis experiences Lhermitte\'s sign. This is characterized by:',
    option_a: 'Visual blurring that worsens with heat', option_b: 'Electric shock sensation down the spine with neck flexion', option_c: 'Sudden loss of balance with head turning', option_d: 'Bilateral hand tremor at rest',
    correct_option_index: 1,
    rationale: 'Lhermitte\'s sign: flexion of the cervical spine produces an electric shock-like sensation radiating down the spine and into the extremities. It indicates posterior column demyelination in the cervical cord, common in MS.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'The Berg Balance Scale scores patients on a scale of:',
    option_a: '0-28 points', option_b: '0-56 points', option_c: '0-100 points', option_d: '0-36 points',
    correct_option_index: 1,
    rationale: 'The Berg Balance Scale consists of 14 items each scored 0-4, for a maximum of 56 points. Scores below 45 are associated with increased fall risk. It is widely used in stroke and geriatric populations.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'A patient with a T4 complete spinal cord injury develops a sudden pounding headache and blood pressure of 210/120 during bladder catheterization. What is the most appropriate immediate action?',
    option_a: 'Administer oral antihypertensive medication', option_b: 'Sit the patient upright and identify/remove the noxious stimulus', option_c: 'Place the patient supine and call a physician', option_d: 'Continue catheterization quickly to relieve the stimulus',
    correct_option_index: 1,
    rationale: 'This is autonomic dysreflexia (AD), a medical emergency in SCI at T6 and above. Immediate action: sit the patient upright (this lowers BP via orthostatic response) and identify/remove the noxious stimulus (often a full bladder).'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'Which cerebral lobe is primarily responsible for voluntary motor control?',
    option_a: 'Parietal lobe', option_b: 'Temporal lobe', option_c: 'Frontal lobe', option_d: 'Occipital lobe',
    correct_option_index: 2,
    rationale: 'The frontal lobe contains the primary motor cortex (precentral gyrus, Brodmann area 4) which controls voluntary movement. The premotor cortex and supplementary motor area are also in the frontal lobe.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'Which functional mobility level on the Functional Independence Measure (FIM) indicates the patient requires supervision but no physical assistance?',
    option_a: 'FIM level 2 (maximal assistance)', option_b: 'FIM level 4 (minimal contact assistance)', option_c: 'FIM level 5 (supervision)', option_d: 'FIM level 6 (modified independence)',
    correct_option_index: 2,
    rationale: 'FIM Level 5 (Supervision): the patient requires only standby supervision, cueing, or prompting without physical contact. The patient performs 100% of the effort but needs someone present for safety.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'A patient post-stroke has difficulty initiating voluntary movement despite having motor strength. This is most likely due to damage to the:',
    option_a: 'Cerebellum', option_b: 'Basal ganglia', option_c: 'Primary somatosensory cortex', option_d: 'Posterior column',
    correct_option_index: 1,
    rationale: 'The basal ganglia are essential for initiating voluntary movements and movement selection. Damage (as in Parkinson\'s or some strokes) leads to bradykinesia and difficulty initiating movement despite preserved motor strength.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'Which cerebellar sign is characterized by overshooting or undershooting during a target-directed movement?',
    option_a: 'Dysdiadochokinesia', option_b: 'Dysmetria', option_c: 'Ataxia', option_d: 'Intention tremor',
    correct_option_index: 1,
    rationale: 'Dysmetria is the inability to accurately gauge the distance and speed of a movement, resulting in overshooting (hypermetria) or undershooting (hypometria) a target. The finger-nose test reveals this cerebellar sign.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'Constraint-Induced Movement Therapy (CIMT) is most appropriate for which patient population?',
    option_a: 'Patients with flaccid paralysis post-stroke', option_b: 'Patients with at least 10° active wrist extension post-stroke', option_c: 'Patients with complete SCI', option_d: 'Patients with Parkinson\'s disease',
    correct_option_index: 1,
    rationale: 'CIMT requires at least 10° of active wrist extension and 10° of active thumb abduction/extension in the affected UE. The unaffected limb is constrained (mitt or cast) while the affected limb is intensively trained.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'A patient presents with ipsilateral facial weakness, contralateral hemiplegia, and impaired pain/temperature sensation on the contralateral body. This pattern is called:',
    option_a: 'Weber syndrome', option_b: 'Wallenberg syndrome (lateral medullary syndrome)', option_c: 'Locked-in syndrome', option_d: 'Brown-Séquard syndrome',
    correct_option_index: 0,
    rationale: 'Weber syndrome results from midbrain infarction affecting the CN III nucleus and corticospinal tract: ipsilateral CN III palsy (oculomotor) and contralateral hemiplegia. Wallenberg syndrome is characterized by crossed sensory findings.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'In Guillain-Barré syndrome (GBS), the pattern of weakness typically begins:',
    option_a: 'In the upper extremities and descends proximally', option_b: 'In the distal lower extremities and ascends proximally', option_c: 'Unilaterally affecting one side of the body', option_d: 'In the respiratory muscles first',
    correct_option_index: 1,
    rationale: 'GBS is an ascending demyelinating polyneuropathy. Weakness typically begins distally in the lower extremities (feet/ankles) and ascends upward, potentially reaching the respiratory muscles and requiring ventilatory support.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'Which intervention has the highest level of evidence for improving walking speed post-stroke?',
    option_a: 'Neurodevelopmental technique (NDT/Bobath)', option_b: 'Task-oriented training and treadmill training', option_c: 'Proprioceptive neuromuscular facilitation (PNF) only', option_d: 'Passive range of motion and positioning',
    correct_option_index: 1,
    rationale: 'Task-specific (task-oriented) training and body-weight supported treadmill training have the strongest evidence (Level I) for improving gait speed and walking ability post-stroke, based on neural plasticity principles.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'A patient with a right hemisphere stroke most commonly presents with:',
    option_a: 'Broca\'s aphasia and right hemiplegia', option_b: 'Left-sided neglect and left hemiplegia', option_c: 'Dysphagia and bilateral weakness', option_d: 'Wernicke\'s aphasia and left visual field loss',
    correct_option_index: 1,
    rationale: 'Right hemisphere strokes cause left hemiplegia (contralateral motor deficit) and often left hemispatial neglect (ignoring the left visual field and environment). Language is typically preserved (language is left-hemisphere dominant in most people).'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'Clonus, hyperreflexia, and a positive Babinski sign indicate:',
    option_a: 'Lower motor neuron lesion', option_b: 'Upper motor neuron lesion', option_c: 'Peripheral nerve lesion', option_d: 'Myopathy',
    correct_option_index: 1,
    rationale: 'Upper motor neuron (UMN) signs include spasticity, clonus, hyperreflexia, and Babinski sign (extensor plantar response). These result from loss of descending inhibition on spinal reflex arcs.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'Which assessment tool best measures the functional balance of community-dwelling older adults at risk for falls?',
    option_a: 'Romberg test', option_b: 'Functional Reach Test', option_c: 'Timed Up and Go (TUG) test', option_d: 'Single-limb stance test',
    correct_option_index: 2,
    rationale: 'The TUG test (time to rise from a chair, walk 3 meters, return, and sit) is widely validated for fall risk screening. A score >12 seconds indicates increased fall risk in older adults. It is also sensitive to change with intervention.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'A patient with Parkinson\'s disease has difficulty walking through a doorway and frequently freezes. Which cueing strategy is most evidence-based for this symptom?',
    option_a: 'Verbal counting', option_b: 'External rhythmic auditory cues (metronome)', option_c: 'Backward walking training', option_d: 'Reducing environmental complexity',
    correct_option_index: 1,
    rationale: 'External rhythmic auditory cues (metronome, rhythmic auditory stimulation/RAS) bypass the impaired basal ganglia timing circuits and have strong evidence for reducing freezing of gait and improving step length and cadence in Parkinson\'s.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'In a patient with Brown-Séquard syndrome (hemicord injury), which combination of deficits occurs ipsilateral to the lesion?',
    option_a: 'Loss of pain and temperature sensation', option_b: 'Loss of proprioception and motor function', option_c: 'Loss of all sensation and motor function', option_d: 'Preserved sensation and loss of motor function only',
    correct_option_index: 1,
    rationale: 'Brown-Séquard syndrome: ipsilateral to lesion = loss of motor function (corticospinal tract) and proprioception/vibration (posterior column). Contralateral = loss of pain and temperature sensation (spinothalamic tract crosses at lesion level).'
  },

  // ===== CARDIOPULMONARY (15) =====
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'The Borg Rate of Perceived Exertion (RPE) scale ranges from 6 to 20. What is the recommended target RPE range for moderate-intensity exercise during cardiac rehabilitation?',
    option_a: '6-8', option_b: '9-11', option_c: '12-14', option_d: '17-19',
    correct_option_index: 2,
    rationale: 'A target RPE of 12-14 (somewhat hard) corresponds to approximately 60-75% of maximum heart rate and is the recommended range for moderate-intensity exercise in cardiac rehabilitation programs.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'A patient with COPD has a forced expiratory volume in 1 second (FEV1) of 45% predicted. According to GOLD criteria, this represents:',
    option_a: 'Stage I (mild)', option_b: 'Stage II (moderate)', option_c: 'Stage III (severe)', option_d: 'Stage IV (very severe)',
    correct_option_index: 2,
    rationale: 'GOLD Stage III (Severe COPD): FEV1 30-49% predicted. Stage I: ≥80%; Stage II: 50-79%; Stage IV (Very Severe): <30%. This guides treatment intensity and prognosis.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'Which position best reduces dyspnea and accessory muscle use in a patient with COPD experiencing an acute exacerbation?',
    option_a: 'Supine with head elevated 30°', option_b: 'High Fowler\'s (90°) with arms supported on overbed table (forward lean)', option_c: 'Right side-lying', option_d: 'Prone position',
    correct_option_index: 1,
    rationale: 'Forward-lean positioning (sitting leaning forward, arms supported) fixes the shoulder girdle, allowing accessory muscles to assist breathing rather than postural support. This reduces dyspnea and increases diaphragm efficiency in COPD.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'Pursed-lip breathing in COPD helps to:',
    option_a: 'Increase respiratory rate and tidal volume', option_b: 'Prevent dynamic airway collapse and reduce air trapping', option_c: 'Recruit the diaphragm to decrease accessory muscle use', option_d: 'Improve oxygen saturation by increasing FiO2',
    correct_option_index: 1,
    rationale: 'Pursed-lip breathing creates positive pressure in the airways during exhalation, preventing premature collapse of floppy airways in COPD, reducing air trapping and functional residual capacity, and slowing respiratory rate.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'A patient in Phase I cardiac rehabilitation (inpatient) should exercise at an intensity that does not exceed how many METs?',
    option_a: '1-2 METs', option_b: '3-5 METs', option_c: '6-8 METs', option_d: '10+ METs',
    correct_option_index: 1,
    rationale: 'Phase I inpatient cardiac rehabilitation targets 3-5 METs, which corresponds to low-level ADLs and ambulation. This intensity is safe for post-MI or post-cardiac surgery patients beginning early mobilization.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'Which of the following is a contraindication to exercise in cardiac rehabilitation?',
    option_a: 'Resting heart rate of 80 bpm', option_b: 'Resting systolic blood pressure of 145 mmHg', option_c: 'Unstable angina or recent MI within 2 days', option_d: 'History of atrial fibrillation with rate controlled',
    correct_option_index: 2,
    rationale: 'Absolute contraindications to cardiac rehab exercise include: unstable angina, acute MI (within 2 days), uncontrolled arrhythmias, severe symptomatic aortic stenosis, and acute decompensated heart failure.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'Diaphragmatic breathing exercises are contraindicated in:',
    option_a: 'COPD', option_b: 'Chronic heart failure', option_c: 'Paradoxical breathing pattern in COPD patients with hyperinflation', option_d: 'Post-thoracic surgery patients',
    correct_option_index: 2,
    rationale: 'In severe hyperinflated COPD patients, the diaphragm is already flattened and at a mechanical disadvantage. Diaphragmatic breathing may actually worsen paradoxical chest wall motion and respiratory efficiency in these patients.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'A patient with right heart failure (cor pulmonale) from COPD will most likely exhibit:',
    option_a: 'Pulmonary edema and orthopnea', option_b: 'Peripheral edema, jugular venous distention, and hepatomegaly', option_c: 'Pink frothy sputum and crackles', option_d: 'Decreased cardiac output with cold extremities',
    correct_option_index: 1,
    rationale: 'Right heart failure (cor pulmonale from COPD) causes backup of blood in the systemic venous system: peripheral pitting edema (lower extremities), JVD, hepatomegaly, and ascites. Left heart failure causes pulmonary edema and orthopnea.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'The 6-Minute Walk Test (6MWT) primarily measures:',
    option_a: 'Peak aerobic capacity (VO2 max)', option_b: 'Submaximal exercise capacity and functional endurance', option_c: 'Anaerobic threshold', option_d: 'Peripheral muscle strength',
    correct_option_index: 1,
    rationale: 'The 6MWT measures the distance a patient can walk in 6 minutes, reflecting submaximal exercise capacity and functional endurance. It does not measure VO2 max (which requires graded exercise testing) but correlates well with it.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'When should the physical therapist immediately stop a graded exercise test?',
    option_a: 'The patient reaches their target heart rate', option_b: 'The patient\'s systolic BP drops >10 mmHg from resting baseline despite workload increase', option_c: 'The patient reports mild dyspnea', option_d: 'Heart rate increases proportionally with workload',
    correct_option_index: 1,
    rationale: 'ACSM absolute indications to stop exercise testing include: SBP drop >10 mmHg from resting baseline despite increasing workload (indicates cardiac pump failure), ST changes, serious arrhythmias, angina, severe dyspnea, ataxia, or pallor.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'Which airway clearance technique uses a device that creates oscillating positive expiratory pressure to mobilize secretions?',
    option_a: 'Active cycle of breathing technique (ACBT)', option_b: 'Flutter valve or Acapella device', option_c: 'Postural drainage with percussion', option_d: 'Incentive spirometry',
    correct_option_index: 1,
    rationale: 'Flutter valves and Acapella devices create oscillating positive expiratory pressure (OPEP), generating airway vibrations that loosen secretions and maintain airway patency, allowing secretions to be mobilized more effectively.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'A patient post-coronary artery bypass graft (CABG) has a sternal precaution. Which activity should be avoided?',
    option_a: 'Walking on a flat surface', option_b: 'Pushing up from a chair with both arms symmetrically', option_c: 'Lifting objects over 5-10 pounds', option_d: 'Stair climbing with a railing',
    correct_option_index: 2,
    rationale: 'Sternal precautions post-CABG (median sternotomy) include: no lifting >5-10 lbs, no pushing/pulling with arms asymmetrically, no reaching behind back. These protect the healing sternum from stress fracture.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'Normal resting oxygen saturation (SpO2) is:',
    option_a: '85-90%', option_b: '90-94%', option_c: '95-100%', option_d: '80-85%',
    correct_option_index: 2,
    rationale: 'Normal SpO2 at rest is 95-100%. Values of 90-94% indicate mild hypoxemia. SpO2 <90% is generally considered significant hypoxemia requiring intervention. Exercise should be stopped if SpO2 drops below 85-88%.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'Which position promotes drainage of the posterior basal segments of the lower lobes?',
    option_a: 'Seated upright', option_b: 'Supine with head down (Trendelenburg)', option_c: 'Prone with foot of bed elevated', option_d: 'Right side-lying',
    correct_option_index: 2,
    rationale: 'Postural drainage for the posterior basal segments requires the patient prone with the foot of the bed elevated approximately 18-20 inches, allowing gravity to assist secretion drainage from these dependent segments.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'A patient with chronic heart failure has an ejection fraction of 35%. This indicates:',
    option_a: 'Normal cardiac function', option_b: 'Mildly reduced ejection fraction', option_c: 'Severely reduced ejection fraction', option_d: 'Diastolic dysfunction only',
    correct_option_index: 2,
    rationale: 'Normal ejection fraction is 55-70%. HFrEF (heart failure with reduced ejection fraction) is defined as EF <40%. An EF of 35% represents severely reduced systolic function, indicating significant pump impairment.'
  },

  // ===== INTEGUMENTARY (10) =====
  {
    domain: 'Integumentary', template_id: 1,
    question_text: 'A pressure ulcer with full-thickness skin loss involving subcutaneous tissue but not extending to fascia is classified as:',
    option_a: 'Stage I', option_b: 'Stage II', option_c: 'Stage III', option_d: 'Stage IV',
    correct_option_index: 2,
    rationale: 'NPUAP/EPUAP Stage III: full-thickness skin loss with subcutaneous tissue visible, but bone, tendon, or muscle are not exposed. Stage II: partial thickness (dermis). Stage IV: bone, tendon, or muscle exposed.'
  },
  {
    domain: 'Integumentary', template_id: 1,
    question_text: 'Which wound dressing is most appropriate for a heavily exudating wound with no signs of infection?',
    option_a: 'Dry gauze dressing', option_b: 'Transparent film dressing', option_c: 'Calcium alginate dressing', option_d: 'Hydrocolloid dressing',
    correct_option_index: 2,
    rationale: 'Calcium alginate dressings are highly absorbent (can absorb 15-20x their weight in exudate), making them ideal for heavily exudating wounds. They form a gel on contact with wound fluid, maintaining moist wound healing.'
  },
  {
    domain: 'Integumentary', template_id: 1,
    question_text: 'A burn involving the epidermis and partial dermis with blistering and extreme pain is classified as:',
    option_a: 'Superficial (first-degree) burn', option_b: 'Superficial partial-thickness (second-degree) burn', option_c: 'Deep partial-thickness burn', option_d: 'Full-thickness (third-degree) burn',
    correct_option_index: 1,
    rationale: 'Superficial partial-thickness (superficial second-degree) burns involve the epidermis and superficial dermis. They present with blisters, are extremely painful (intact sensory nerves), blanch with pressure, and typically heal in 14-21 days.'
  },
  {
    domain: 'Integumentary', template_id: 1,
    question_text: 'The rule of nines assigns what percentage of total body surface area (TBSA) to one entire upper extremity?',
    option_a: '4.5%', option_b: '9%', option_c: '18%', option_d: '1%',
    correct_option_index: 1,
    rationale: 'By the rule of nines: each upper extremity = 9% TBSA; each lower extremity = 18%; anterior trunk = 18%; posterior trunk = 18%; head and neck = 9%; genitalia = 1%. Total = 100%.'
  },
  {
    domain: 'Integumentary', template_id: 1,
    question_text: 'Which intervention is most effective for preventing hypertrophic scar formation after a burn?',
    option_a: 'Silicone gel sheeting and compression garments', option_b: 'Frequent moist dressing changes', option_c: 'Vitamin E application', option_d: 'Avoidance of sun exposure only',
    correct_option_index: 0,
    rationale: 'Compression garments (20-25 mmHg for 23 hours/day) and silicone gel sheeting have the strongest evidence for preventing and treating hypertrophic scars. They must be worn for 12-18 months post-burn.'
  },
  {
    domain: 'Integumentary', template_id: 1,
    question_text: 'Which debridement method is most selective, removing only necrotic tissue?',
    option_a: 'Wet-to-dry dressings', option_b: 'Sharp/surgical debridement', option_c: 'Enzymatic debridement (collagenase)', option_d: 'Autolytic debridement',
    correct_option_index: 3,
    rationale: 'Autolytic debridement uses the body\'s own enzymes and moisture (via occlusive or semi-occlusive dressings) to selectively liquefy necrotic tissue. It is the most selective method because only necrotic tissue is digested.'
  },
  {
    domain: 'Integumentary', template_id: 1,
    question_text: 'Reactive hyperemia (blanching redness that resolves within 1 hour after pressure relief) at a bony prominence is classified as:',
    option_a: 'Suspected deep tissue injury', option_b: 'Stage I pressure ulcer', option_c: 'Stage II pressure ulcer', option_d: 'Normal skin response',
    correct_option_index: 3,
    rationale: 'Reactive hyperemia that blanches and resolves within 1 hour of pressure relief is a normal physiological response (increased blood flow to reestablish perfusion). Non-blanchable redness is Stage I pressure injury.'
  },
  {
    domain: 'Integumentary', template_id: 1,
    question_text: 'A diabetic patient has a Wagner Grade 2 foot ulcer. This means:',
    option_a: 'Superficial ulcer without penetrating to tendon or joint', option_b: 'Deep ulcer involving tendon, capsule, or bone', option_c: 'Partial foot gangrene', option_d: 'Localized infection with cellulitis',
    correct_option_index: 1,
    rationale: 'Wagner Grade 2: deep ulcer with penetration to tendon, bone, or capsule. Grade 1: superficial ulcer. Grade 3: deep with osteitis. Grade 4: partial foot gangrene. Grade 5: whole foot gangrene.'
  },
  {
    domain: 'Integumentary', template_id: 1,
    question_text: 'Negative pressure wound therapy (wound VAC) is contraindicated in:',
    option_a: 'Chronic pressure ulcers', option_b: 'Wounds with exposed blood vessels or organs', option_c: 'Diabetic foot ulcers with adequate perfusion', option_d: 'Dehisced surgical wounds',
    correct_option_index: 1,
    rationale: 'NPWT is absolutely contraindicated over exposed blood vessels or organs (risk of catastrophic hemorrhage or injury), untreated osteomyelitis, malignant wounds, and wounds with dry eschar. It is appropriate for chronic wounds with adequate perfusion.'
  },
  {
    domain: 'Integumentary', template_id: 1,
    question_text: 'To offload pressure from a plantar foot ulcer in a diabetic patient, which is the gold standard intervention?',
    option_a: 'Therapeutic footwear with soft insoles', option_b: 'Total contact casting (TCC)', option_c: 'Removable cast walker/boot', option_d: 'Crutches for non-weight-bearing',
    correct_option_index: 1,
    rationale: 'Total contact casting is the gold standard for offloading plantar diabetic foot ulcers because it cannot be removed by the patient, ensuring 24-hour pressure relief. Removable devices (boots) have lower compliance and worse outcomes.'
  },

  // ===== OTHER SYSTEMS (15) =====
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'A child with cerebral palsy is classified as GMFCS Level III. This means the child:',
    option_a: 'Walks without limitations', option_b: 'Walks with assistive devices in most settings', option_c: 'Uses wheeled mobility for most activities', option_d: 'Has no functional mobility',
    correct_option_index: 1,
    rationale: 'GMFCS Level III: walks using hand-held mobility device in most indoor settings; may use wheeled mobility outdoors and in the community; can use stairs with a railing but with limitations. Level I: no limitations; Level V: severely limited.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'Which vestibular rehabilitation maneuver is most effective for posterior canal benign paroxysmal positional vertigo (BPPV)?',
    option_a: 'Brandt-Daroff exercises', option_b: 'Epley maneuver (canalith repositioning procedure)', option_c: 'Semont maneuver', option_d: 'Vestibular adaptation exercises',
    correct_option_index: 1,
    rationale: 'The Epley maneuver (canalith repositioning procedure) has the strongest Level I evidence for posterior canal BPPV. It repositions free-floating otoconia from the posterior semicircular canal back into the utricle.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'Complete decongestive therapy (CDT) for lymphedema includes all of the following EXCEPT:',
    option_a: 'Manual lymphatic drainage (MLD)', option_b: 'Compression bandaging', option_c: 'Diuretic medication', option_d: 'Skin care and exercise',
    correct_option_index: 2,
    rationale: 'CDT components: manual lymphatic drainage, multilayer compression bandaging, decongestive exercises, and meticulous skin care. Diuretics are NOT part of CDT and are generally contraindicated in lymphedema as they do not address protein-rich fluid.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'A cancer patient receiving chemotherapy reports peripheral neuropathy and balance deficits. Which precaution is most important during exercise?',
    option_a: 'Avoid all weight-bearing exercise', option_b: 'Monitor for fall risk and provide balance support', option_c: 'Limit exercise to upper extremity only', option_d: 'Restrict exercise to 5 minutes per session',
    correct_option_index: 1,
    rationale: 'Chemotherapy-induced peripheral neuropathy (CIPN) impairs proprioception and balance, increasing fall risk. Exercise is beneficial and safe, but fall prevention strategies (stable surfaces, handrails, monitoring) are critical precautions.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'According to developmental milestones, when does a typically developing child begin to walk independently?',
    option_a: '6-8 months', option_b: '9-11 months', option_c: '12-15 months', option_d: '18-24 months',
    correct_option_index: 2,
    rationale: 'Typical independent walking begins between 12-15 months. Cruising (walking with support) typically occurs around 9-12 months. Walking by 18 months is within normal limits; beyond 18 months warrants evaluation.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'The primary goal of the vestibular ocular reflex (VOR) is to:',
    option_a: 'Maintain upright posture', option_b: 'Stabilize gaze during head movements', option_c: 'Coordinate smooth pursuit eye movements', option_d: 'Control saccadic eye movements',
    correct_option_index: 1,
    rationale: 'The VOR generates compensatory eye movements in the opposite direction of head movements to stabilize visual images on the retina during head motion. VOR dysfunction causes gaze instability and oscillopsia (blurred vision with movement).'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'An older adult is considered to have sarcopenia when they exhibit:',
    option_a: 'Low muscle mass only', option_b: 'Low muscle mass plus low muscle strength and/or poor physical performance', option_c: 'Body mass index below 18.5', option_d: 'Age greater than 65 years',
    correct_option_index: 1,
    rationale: 'The updated EWGSOP2 definition of sarcopenia requires low muscle strength (primary criterion) plus low muscle quantity/quality. Poor physical performance indicates severe sarcopenia. Low mass alone is not sufficient for diagnosis.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'Which screening tool is recommended for identifying frailty in older adults in clinical settings?',
    option_a: 'Mini-Mental State Examination (MMSE)', option_b: 'FRAIL Scale or Fried Frailty Phenotype', option_c: 'Geriatric Depression Scale (GDS)', option_d: 'SLUMS test',
    correct_option_index: 1,
    rationale: 'The Fried Frailty Phenotype assesses 5 criteria: unintentional weight loss, exhaustion, weakness (grip strength), slow gait speed, and low physical activity. 3+ criteria = frailty; 1-2 = pre-frail. The FRAIL scale is a quick clinical screening version.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'Following a mastectomy, a patient develops secondary lymphedema of the ipsilateral arm. Which intervention should be AVOIDED?',
    option_a: 'Manual lymphatic drainage', option_b: 'Compression garments', option_c: 'Deep heat modalities to the affected limb', option_d: 'Exercise and elevation',
    correct_option_index: 2,
    rationale: 'Deep heat (diathermy, hot packs, ultrasound) increases blood flow and metabolic demand, worsening lymphedema by increasing capillary filtration beyond lymphatic capacity. Heat should be avoided in lymphedematous limbs.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'A pediatric patient with Duchenne muscular dystrophy (DMD) typically loses the ability to walk independently around what age?',
    option_a: '2-4 years', option_b: '5-8 years', option_c: '9-12 years', option_d: '15-20 years',
    correct_option_index: 2,
    rationale: 'Without corticosteroid treatment, boys with DMD typically lose ambulation by 9-12 years of age due to progressive proximal muscle weakness. Corticosteroids may extend ambulation by 2-3 years. The disease is uniformly progressive.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'Radiation-induced fibrosis affecting the shoulder following breast cancer treatment is best addressed with:',
    option_a: 'Complete rest and pain management only', option_b: 'Range of motion exercises and manual therapy beginning as tolerated', option_c: 'High-intensity strengthening exercises immediately', option_d: 'Avoidance of all upper extremity movement',
    correct_option_index: 1,
    rationale: 'Early and ongoing ROM exercises with manual therapy (scar mobilization, stretching) help prevent and manage radiation-induced fibrosis. Exercise is safe and beneficial during and after radiation therapy for breast cancer.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'The Apgar score is assessed at which time points after birth?',
    option_a: '1 and 2 minutes', option_b: '1 and 5 minutes', option_c: '5 and 10 minutes', option_d: '2 and 7 minutes',
    correct_option_index: 1,
    rationale: 'The Apgar score assesses newborn health at 1 and 5 minutes after birth (and at 10 minutes if scores remain low). It evaluates Appearance, Pulse, Grimace, Activity, and Respiration. Score 7-10 = normal; 4-6 = moderate concern; 0-3 = severe concern.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'An elderly patient uses 4 or more medications. This polypharmacy significantly increases the risk of:',
    option_a: 'Sarcopenia but not falls', option_b: 'Falls, cognitive impairment, and adverse drug reactions', option_c: 'Only cardiovascular events', option_d: 'Constipation only',
    correct_option_index: 1,
    rationale: 'Polypharmacy (≥4-5 medications) significantly increases risk of falls, adverse drug reactions, drug-drug interactions, cognitive impairment, and hospitalizations in older adults. PT should identify fall-risk medications (benzodiazepines, antihypertensives, diuretics).'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'Which intervention is contraindicated in a patient with active cancer undergoing chemotherapy when platelet count is below 50,000/mm³?',
    option_a: 'Walking program', option_b: 'Seated range of motion exercises', option_c: 'High-intensity resistance training and contact sports', option_d: 'Breathing exercises',
    correct_option_index: 2,
    rationale: 'Platelet count <50,000/mm³ (thrombocytopenia) contraindicates high-intensity exercise and contact activities due to bleeding risk. Low-impact activities (walking, ROM, breathing exercises) can continue with monitoring. <20,000/mm³ = bedrest typically recommended.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'A patient with rheumatoid arthritis (RA) has morning stiffness lasting more than 1 hour. This is a hallmark of RA and helps differentiate it from:',
    option_a: 'Fibromyalgia (morning stiffness lasting >2 hours)', option_b: 'Osteoarthritis (morning stiffness lasting <30 minutes)', option_c: 'Gout (no morning stiffness)', option_d: 'Ankylosing spondylitis (morning stiffness <1 hour)',
    correct_option_index: 1,
    rationale: 'RA morning stiffness lasts ≥1 hour (often longer). Osteoarthritis morning stiffness is brief (<30 minutes) and relates to mechanical deconditioning. This difference helps differentiate inflammatory from non-inflammatory arthritis clinically.'
  },

  // ===== NON-SYSTEMS (10) =====
  {
    domain: 'Non-Systems', template_id: 1,
    question_text: 'A patient declines a recommended exercise intervention after understanding the risks and benefits. The PT should:',
    option_a: 'Insist on the intervention as it is clinically indicated', option_b: 'Document the informed refusal and respect patient autonomy', option_c: 'Contact the referring physician to override the patient\'s decision', option_d: 'Discharge the patient immediately',
    correct_option_index: 1,
    rationale: 'Patient autonomy is a foundational ethical principle. A competent patient has the right to refuse treatment after being informed of risks, benefits, and alternatives. The PT must document informed refusal and continue to offer appropriate care.'
  },
  {
    domain: 'Non-Systems', template_id: 1,
    question_text: 'A physical therapist assistant (PTA) may perform which of the following without direct supervision from a PT?',
    option_a: 'Initial patient evaluation', option_b: 'Developing the plan of care', option_c: 'Intervention implementation as directed in the plan of care', option_d: 'Modifying the diagnosis',
    correct_option_index: 2,
    rationale: 'PTAs can implement selected interventions as directed in the PT\'s plan of care. PTAs CANNOT: perform initial evaluations, establish diagnoses, determine prognosis, or develop the plan of care. Supervision requirements vary by state.'
  },
  {
    domain: 'Non-Systems', template_id: 1,
    question_text: 'Which study design provides the highest level of evidence for a clinical question about treatment effectiveness?',
    option_a: 'Case report', option_b: 'Cohort study', option_c: 'Randomized controlled trial (RCT)', option_d: 'Expert opinion',
    correct_option_index: 2,
    rationale: 'Evidence hierarchy (highest to lowest): Systematic reviews/Meta-analyses of RCTs > Individual RCTs > Cohort studies > Case-control studies > Case series/reports > Expert opinion. RCTs are the gold standard for treatment effectiveness because of randomization and control groups.'
  },
  {
    domain: 'Non-Systems', template_id: 1,
    question_text: 'When documenting in a SOAP note format, where should the physical therapist record the patient\'s pain rating and chief complaint?',
    option_a: 'O (Objective)', option_b: 'A (Assessment)', option_c: 'S (Subjective)', option_d: 'P (Plan)',
    correct_option_index: 2,
    rationale: 'In SOAP notes: Subjective = patient\'s reported symptoms, chief complaint, pain ratings, and goals. Objective = measurable data (ROM, strength, vital signs). Assessment = PT\'s clinical judgment/diagnosis. Plan = treatment plan.'
  },
  {
    domain: 'Non-Systems', template_id: 1,
    question_text: 'A PT is treating a patient who discloses current domestic abuse. The PT\'s primary ethical and legal responsibility is to:',
    option_a: 'Maintain strict confidentiality and take no further action', option_b: 'Immediately contact the abuser', option_c: 'Follow mandatory reporting laws, provide resources, and document', option_d: 'Discharge the patient and refer to social work',
    correct_option_index: 2,
    rationale: 'PTs must follow mandatory reporting laws (which vary by state), provide the patient with safety resources and information, document appropriately, and make appropriate referrals. Safety takes precedence while respecting autonomy as much as legally possible.'
  },
  {
    domain: 'Non-Systems', template_id: 1,
    question_text: 'Which outcome measure has the BEST test-retest reliability for measuring shoulder function?',
    option_a: 'Choosing based on the longest questionnaire available', option_b: 'Selecting a validated, condition-specific PRO with published ICC > 0.75', option_c: 'Using a generic health status measure only', option_d: 'Using whichever measure the patient prefers',
    correct_option_index: 1,
    rationale: 'Test-retest reliability is best evaluated using the Intraclass Correlation Coefficient (ICC). An ICC >0.75 is considered good to excellent. Condition-specific, validated patient-reported outcomes (PROs) with established psychometric properties are preferred for measuring outcomes.'
  },
  {
    domain: 'Non-Systems', template_id: 1,
    question_text: 'A physical therapist moves a patient from one state to another. The PT must:',
    option_a: 'Obtain licensure in the new state before practicing there', option_b: 'Simply notify their current state board', option_c: 'Continue practicing under their current license for 90 days', option_d: 'Only obtain a certificate of good standing',
    correct_option_index: 0,
    rationale: 'Physical therapy licensure is state-specific. A PT must obtain licensure in each state where they practice. Some states participate in the PT Compact, which expedites reciprocal licensure, but a new license is still required before practicing.'
  },
  {
    domain: 'Non-Systems', template_id: 1,
    question_text: 'Number Needed to Treat (NNT) is calculated as:',
    option_a: '1 / Relative Risk Reduction', option_b: '1 / Absolute Risk Reduction', option_c: 'Relative Risk Reduction / 100', option_d: 'Control Event Rate - Experimental Event Rate',
    correct_option_index: 1,
    rationale: 'NNT = 1 / Absolute Risk Reduction (ARR). ARR = Control Event Rate - Experimental Event Rate. A lower NNT indicates a more effective treatment (NNT=1 means every patient benefits; NNT=10 means 10 patients must be treated for 1 to benefit).'
  },
  {
    domain: 'Non-Systems', template_id: 1,
    question_text: 'A physical therapist suspects a patient has a condition outside the scope of PT practice. The BEST action is to:',
    option_a: 'Continue PT treatment and monitor the condition', option_b: 'Immediately discharge the patient from PT care', option_c: 'Refer the patient to the appropriate healthcare provider and document', option_d: 'Attempt to diagnose and treat the condition',
    correct_option_index: 2,
    rationale: 'PTs must recognize conditions outside their scope of practice and make timely referrals to appropriate healthcare providers. This upholds ethical standards, protects patients, and reflects the PT\'s role as a primary contact practitioner.'
  },
  {
    domain: 'Non-Systems', template_id: 1,
    question_text: 'Which of the following best defines "sensitivity" of a clinical test?',
    option_a: 'The ability of a test to correctly identify those WITHOUT the condition (true negative rate)', option_b: 'The ability of a test to correctly identify those WITH the condition (true positive rate)', option_c: 'The probability that a positive test result indicates disease', option_d: 'The probability that a negative test result rules out disease',
    correct_option_index: 1,
    rationale: 'Sensitivity = True Positives / (True Positives + False Negatives) — the test\'s ability to correctly identify patients who HAVE the condition. High sensitivity = few false negatives. "SnNout": Sensitive test, Negative result = rules OUT condition.'
  }
];

async function seed() {
  console.log(`Seeding ${questions.length} questions into the database...`);

  const { error } = await supabase
    .from('questions')
    .insert(questions);

  if (error) {
    console.error('Error inserting questions:', error.message);
    process.exit(1);
  }

  console.log(`Successfully inserted ${questions.length} questions!`);

  // Verify counts by domain
  const domains = {};
  questions.forEach(q => {
    domains[q.domain] = (domains[q.domain] || 0) + 1;
  });
  console.log('\nQuestion counts by domain:');
  Object.entries(domains).forEach(([domain, count]) => {
    console.log(`  ${domain}: ${count}`);
  });
}

seed();
