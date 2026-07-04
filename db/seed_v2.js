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
    question_text: 'A 52-year-old administrative assistant presents with a 6-week history of lateral elbow pain rated 7/10. Pain is reproduced with resisted wrist extension and gripping. She reports no trauma. Finkelstein\'s test is negative. Which structure is most likely involved?',
    option_a: 'Flexor carpi ulnaris tendon',
    option_b: 'Extensor carpi radialis brevis (ECRB) tendon',
    option_c: 'Lateral ulnar collateral ligament',
    option_d: 'Posterior interosseous nerve',
    correct_option_index: 1,
    rationale: 'Lateral epicondylalgia (tennis elbow) most commonly involves tendinopathy of the ECRB at its insertion on the lateral epicondyle. Pain with resisted wrist extension and gripping in the absence of trauma is the classic presentation. Finkelstein\'s tests the first dorsal compartment, which is negative here.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A 28-year-old soccer player reports acute knee pain after a non-contact pivot. She felt a "pop" and her knee swelled within 2 hours. Lachman test: positive with soft end-feel at 20° flexion. McMurray: negative. Valgus/varus stress: negative. What is the most likely diagnosis?',
    option_a: 'Medial collateral ligament sprain',
    option_b: 'Medial meniscus tear',
    option_c: 'Anterior cruciate ligament tear',
    option_d: 'Posterior cruciate ligament tear',
    correct_option_index: 2,
    rationale: 'ACL tears classically occur with a non-contact pivot or cutting mechanism. A felt "pop," acute hemarthrosis within 2 hours, and positive Lachman test (anterior tibial translation with soft end-feel at 20–30° flexion) are the hallmarks. The Lachman test has >85% sensitivity for ACL tears.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A 67-year-old retired teacher presents with bilateral knee pain worsened by stairs and prolonged standing. X-ray shows medial joint space narrowing with osteophytes. Which physical therapy intervention has the STRONGEST evidence to reduce pain and improve function?',
    option_a: 'Ultrasound therapy applied to the medial compartment',
    option_b: 'Quadriceps and hip strengthening combined with aerobic exercise',
    option_c: 'Taping alone to the patella',
    option_d: 'Passive joint mobilization only',
    correct_option_index: 1,
    rationale: 'Clinical practice guidelines (CPG) for knee osteoarthritis (OARSI, APTA) provide strong evidence for quadriceps and hip strengthening combined with aerobic exercise. These reduce pain, improve function, and are recommended as first-line therapy. Ultrasound and passive treatment alone lack sufficient evidence.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A 45-year-old male construction worker has had right shoulder pain for 3 months. He reports painful arc from 70–120° of abduction. Neer and Hawkins-Kennedy tests are positive. Strength testing is 4/5 for shoulder abduction with pain. Empty can test causes pain but no significant weakness. What is the most likely diagnosis?',
    option_a: 'Full-thickness supraspinatus tear',
    option_b: 'Glenohumeral instability',
    option_c: 'Subacromial impingement syndrome',
    option_d: 'Adhesive capsulitis',
    correct_option_index: 2,
    rationale: 'Positive impingement signs (Neer, Hawkins-Kennedy), painful arc (70–120°), and preserved strength with pain (not weakness) point to subacromial impingement syndrome. A full-thickness rotator cuff tear would present with significant weakness. Adhesive capsulitis presents with loss of passive ROM in all planes (capsular pattern).'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A 35-year-old recreational runner reports insidious onset of lateral knee pain that begins after 20 minutes of running and resolves with rest. There is tenderness at the lateral femoral epicondyle at approximately 30° of knee flexion. Noble compression test is positive. What is the most likely diagnosis?',
    option_a: 'Lateral meniscus tear',
    option_b: 'Iliotibial band syndrome',
    option_c: 'Biceps femoris tendinopathy',
    option_d: 'Lateral collateral ligament sprain',
    correct_option_index: 1,
    rationale: 'Iliotibial band syndrome (ITBS) is the most common cause of lateral knee pain in runners. It presents with pain at the lateral femoral epicondyle, onset after a consistent running distance, and a positive Noble compression test (pain at 30° of knee flexion at the ITB insertion).'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A 72-year-old woman with osteoporosis falls and sustains a Colles\' fracture treated by cast immobilization for 6 weeks. She now presents with stiffness, diffuse hand swelling, allodynia, and a shiny, mottled skin appearance. She refuses to use her hand due to pain. What condition should the PT suspect?',
    option_a: 'Post-fracture edema only',
    option_b: 'Complex regional pain syndrome (CRPS) Type I',
    option_c: 'Deep vein thrombosis',
    option_d: 'Refracture at the original site',
    correct_option_index: 1,
    rationale: 'CRPS Type I (formerly reflex sympathetic dystrophy) develops after injury without nerve damage. Key features include disproportionate pain, allodynia, autonomic changes (skin color/temperature/sweating changes), trophic changes (shiny skin, swelling), and movement avoidance. The Budapest Criteria are used for diagnosis.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A 55-year-old female presents with a 5-month history of insidious right shoulder pain with difficulty reaching overhead or behind her back. Passive ROM assessment reveals: flexion 110°, abduction 85°, external rotation 30°, internal rotation 25°. Active ROM matches passive. Which diagnosis does this pattern suggest?',
    option_a: 'Supraspinatus tear',
    option_b: 'Biceps tendinopathy',
    option_c: 'Adhesive capsulitis (frozen shoulder)',
    option_d: 'Subacromial impingement',
    correct_option_index: 2,
    rationale: 'Adhesive capsulitis presents with a capsular pattern of restriction at the glenohumeral joint: external rotation > abduction > internal rotation. The pattern here (ER most restricted, then abduction) combined with equal active and passive ROM loss in an insidious-onset middle-aged female is classic for frozen shoulder.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A 40-year-old male presents with acute onset low back pain radiating down the right leg to below the knee, positive right SLR at 45°, and diminished right Achilles reflex. Weakness of right plantar flexion is noted. Which nerve root is most likely affected?',
    option_a: 'L3',
    option_b: 'L4',
    option_c: 'L5',
    option_d: 'S1',
    correct_option_index: 3,
    rationale: 'The S1 dermatome covers the lateral foot and small toe. S1 radiculopathy classically presents with: diminished Achilles reflex (S1-S2), weakness of plantar flexion (gastrocnemius/soleus), and positive SLR. L5 would affect dorsiflexion and great toe extension; L4 would affect the patellar reflex and knee extension.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'Which Maitland grade of joint mobilization is MOST appropriate to treat stiffness at end range in a patient with subacute lateral ankle sprain who tolerates movement well?',
    option_a: 'Grade I (small amplitude at beginning of range)',
    option_b: 'Grade II (large amplitude, not reaching end range)',
    option_c: 'Grade III (large amplitude, reaching end range)',
    option_d: 'Grade V (manipulation/HVLA)',
    correct_option_index: 2,
    rationale: 'Grade III mobilizations are large-amplitude oscillations that reach end range, making them appropriate for addressing stiffness when the patient tolerates movement. Grade I–II are for pain modulation. Grade IV is small amplitude at end range for stiffness. Grade V (HVLA) requires specific training and screening.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A 25-year-old female presents with anterior knee pain worsened by prolonged sitting, stair descent, and squatting. Clarke\'s test is positive. Patellar tilt test reveals tightness laterally. There is no joint effusion. What is the most likely diagnosis?',
    option_a: 'Patellar tendinopathy',
    option_b: 'Patellofemoral pain syndrome (PFPS)',
    option_c: 'Pes anserine bursitis',
    option_d: 'Medial meniscus tear',
    correct_option_index: 1,
    rationale: 'PFPS (runner\'s knee) typically affects young females with pain aggravated by increased patellofemoral loading (stairs, squatting, prolonged sitting = "theatre sign"). Positive Clarke\'s test, lateral patellar tilt, and absence of effusion or instability differentiate it from structural pathology.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A 17-year-old male basketball player presents with inferior patellar pain that is worse during and after jumping. Tenderness is localized to the inferior pole of the patella. There is no swelling. What is the BEST initial physiotherapy management?',
    option_a: 'Complete rest for 8 weeks and patellar taping',
    option_b: 'Eccentric decline squat exercises (heavy slow resistance program)',
    option_c: 'Corticosteroid injection and orthotics',
    option_d: 'Surgical referral for debridement',
    correct_option_index: 1,
    rationale: 'Patellar tendinopathy is best managed with heavy slow resistance (HSR) or eccentric loading using decline squats, which isolate the patellar tendon eccentrically. Level I evidence supports HSR over rest. Complete rest is contraindicated as tendons require progressive loading for adaptation.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'During examination of a patient with C5-C6 disc herniation, the MOST likely myotomal finding is weakness in:',
    option_a: 'Wrist flexion and intrinsic hand muscles',
    option_b: 'Shoulder abduction (deltoid) and elbow flexion (biceps)',
    option_c: 'Finger extension and wrist extension',
    option_d: 'Elbow extension (triceps) and wrist extension',
    correct_option_index: 1,
    rationale: 'C5 myotome: shoulder abduction (deltoid). C6 myotome: elbow flexion (biceps), wrist extension. A C5-C6 disc herniation affecting these nerve roots causes combined weakness of shoulder abduction and elbow flexion. C7 affects triceps and wrist flexion; C8/T1 affects hand intrinsics.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A 78-year-old male with bilateral knee OA and new hip replacement (posterior approach, 8 weeks post-op) ambulates with a Trendelenburg gait pattern on the right. The MOST appropriate exercise to address this is:',
    option_a: 'Supine hip flexor stretching',
    option_b: 'Side-lying hip abduction and clamshell exercises progressing to weight-bearing hip abductor strengthening',
    option_c: 'Seated knee extension strengthening',
    option_d: 'Aquatic therapy only',
    correct_option_index: 1,
    rationale: 'Trendelenburg gait indicates gluteus medius (hip abductor) weakness on the stance limb. At 8 weeks post-posterior THA, hip precautions must still be observed (no adduction, IR >90° flexion). Side-lying hip abduction and progression to standing abductor exercises are appropriate and remain within precaution parameters.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'The McKenzie Method classification for a patient with low back pain that centralizes (pain moves from leg toward spine) with lumbar extension exercises would be classified as:',
    option_a: 'Lateral shift derangement requiring side glide correction',
    option_b: 'Derangement syndrome responding to extension principle',
    option_c: 'Dysfunction syndrome requiring stretching into pain',
    option_d: 'Postural syndrome requiring postural correction only',
    correct_option_index: 1,
    rationale: 'In the McKenzie Method, centralization (pain moving from distal to proximal) with a specific direction of movement identifies a Derangement syndrome. Centralization with extension indicates an extension principle (posterior derangement). This is a clinically important prognostic sign for disc-related pain with good outcomes with directional preference treatment.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A patient undergoes Total Knee Arthroplasty (TKA). According to accelerated rehabilitation protocols, what is the PRIMARY goal within the first 24-48 hours?',
    option_a: 'Achieve 120° of knee flexion',
    option_b: 'Full weight-bearing ambulation and quadriceps activation',
    option_c: 'Begin cycling on an exercise bike',
    option_d: 'Apply ice continuously for 48 hours and remain in bed',
    correct_option_index: 1,
    rationale: 'Enhanced recovery protocols for TKA emphasize early mobilization (within 4–24 hours), weight-bearing as tolerated, and quadriceps activation (quad sets, SLR). Early mobilization reduces VTE risk, reduces length of stay, and improves functional outcomes. 120° flexion is a later goal.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A 32-year-old female office worker reports wrist and hand pain, nocturnal paresthesias in her thumb, index, and middle fingers, and a positive Phalen\'s test at 45 seconds. Tinel\'s sign is positive at the carpal tunnel. What is the most likely diagnosis?',
    option_a: 'Cubital tunnel syndrome (ulnar nerve)',
    option_b: 'De Quervain\'s tenosynovitis',
    option_c: 'Carpal tunnel syndrome (median nerve)',
    option_d: 'Cervical radiculopathy at C6',
    correct_option_index: 2,
    rationale: 'Carpal tunnel syndrome compresses the median nerve under the transverse carpal ligament. Hallmarks: nocturnal paresthesias (thumb, index, middle finger, and radial ring finger), positive Phalen\'s test (sustained wrist flexion reproduces symptoms) and Tinel\'s sign over the carpal tunnel. Ulnar nerve affects ring and small fingers.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'During gait analysis, a patient is observed to demonstrate excessive forward trunk lean throughout the stance phase. This compensatory strategy is MOST likely due to:',
    option_a: 'Hip flexor weakness',
    option_b: 'Ankle plantarflexor weakness (gluteus maximus substitution strategy)',
    option_c: 'Ankle plantarflexor contracture',
    option_d: 'Hip extensor weakness causing forward trunk lean to shift GRF anterior to hip',
    correct_option_index: 3,
    rationale: 'Hip extensor weakness (gluteus maximus) causes forward trunk lean as a compensation to shift the ground reaction force (GRF) anterior to the hip joint, creating an extension moment without muscle effort. This is distinguished from other causes by the specific association with terminal stance loading response.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A patient presents with pain in the groin and anterior thigh, positive FABER test, and limited hip internal rotation. X-ray shows reduced joint space and osteophytes at the superior acetabular rim. What diagnosis is MOST consistent with these findings?',
    option_a: 'Femoral neck stress fracture',
    option_b: 'Hip osteoarthritis',
    option_c: 'Iliopsoas tendinopathy',
    option_d: 'Labral tear without OA',
    correct_option_index: 1,
    rationale: 'Hip OA classically presents with groin/anterior thigh pain, reduced hip internal rotation (capsular pattern: IR > flexion > abduction), positive FABER test, and radiographic findings of joint space narrowing and osteophytes. The groin as the primary pain location and X-ray findings confirm the diagnosis.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'Which special test is MOST sensitive for detecting a SLAP (superior labrum anterior to posterior) lesion of the shoulder?',
    option_a: 'Apprehension test',
    option_b: 'O\'Brien\'s (Active Compression) test',
    option_c: 'Sulcus sign',
    option_d: 'Gerber\'s lift-off test',
    correct_option_index: 1,
    rationale: 'O\'Brien\'s (Active Compression) test has reasonable sensitivity for SLAP tears. It is performed in 90° flexion, 10° adduction, with full internal rotation (pain) vs. external rotation (pain reduced). A positive test (pain with IR, reduced with ER) suggests SLAP pathology. However, no single test is pathognomonic and cluster testing improves accuracy.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A 60-year-old female presents with bilateral buttock pain that worsens with walking and improves when leaning forward over a shopping cart. She has no pain at rest. This presentation is MOST consistent with:',
    option_a: 'Piriformis syndrome',
    option_b: 'Lumbar spinal stenosis (neurogenic claudication)',
    option_c: 'Vascular (arterial) claudication',
    option_d: 'Sacroiliac joint dysfunction',
    correct_option_index: 1,
    rationale: 'Neurogenic claudication from lumbar spinal stenosis: bilateral leg/buttock pain with walking, relieved by forward flexion (which opens the neural canal). Leaning on a shopping cart (flexed posture) is a classic presentation. Vascular claudication does not improve with forward lean and worsens with uphill walking, not level ground.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'What percentage of total shoulder abduction (0–180°) occurs at the scapulothoracic joint?',
    option_a: '20° (approximately 11%)',
    option_b: '30° (approximately 17%)',
    option_c: '60° (approximately 33%)',
    option_d: '90° (approximately 50%)',
    correct_option_index: 2,
    rationale: 'Scapulohumeral rhythm is 2:1 (GH:ST). Over 180° of total shoulder abduction, approximately 120° occurs at the glenohumeral joint and 60° at the scapulothoracic joint (upward rotation). The first 30° of abduction may be predominantly glenohumeral before consistent scapular rotation begins.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A 48-year-old male with ankylosing spondylitis presents with thoracolumbar stiffness, reduced chest expansion (<2.5 cm), and a positive Schober test (expansion <5 cm). Which exercise approach is MOST evidence-based?',
    option_a: 'Flexion-based exercises only',
    option_b: 'Spinal extension, rotation, and respiratory exercises with aerobic conditioning',
    option_c: 'Complete rest during active disease phases',
    option_d: 'Lumbar stabilization only',
    correct_option_index: 1,
    rationale: 'For ankylosing spondylitis, exercise guidelines recommend: extension and rotation exercises (to counteract the kyphotic tendency), chest expansion exercises, and aerobic conditioning. Flexion exercises may worsen kyphosis. Exercise is recommended even during active disease phases; rest promotes stiffness and deformity.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A patient reports that their pain is reproduced by palpation of the greater trochanter and with hip external rotation and abduction in the sidelying position. Which structure is most likely involved?',
    option_a: 'Piriformis muscle',
    option_b: 'Gluteus medius/minimus tendinopathy (greater trochanteric pain syndrome)',
    option_c: 'IT band distal to the trochanter',
    option_d: 'Femoral nerve',
    correct_option_index: 1,
    rationale: 'Greater trochanteric pain syndrome (GTPS) involves tendinopathy of the gluteus medius and/or minimus at their insertions on the greater trochanter. Point tenderness at the greater trochanter with pain on compression (sidelying) and with resisted abduction/ER is characteristic. Previously misclassified as trochanteric bursitis.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A 16-year-old male presents with anterior knee pain over the tibial tuberosity that worsens with activity and running. The tibial tuberosity is enlarged and very tender. Quadriceps flexibility is limited. What is the MOST likely diagnosis?',
    option_a: 'Sinding-Larsen-Johansson disease',
    option_b: 'Osgood-Schlatter disease',
    option_c: 'Patellar tendinopathy',
    option_d: 'Tibial stress fracture',
    correct_option_index: 1,
    rationale: 'Osgood-Schlatter disease is apophysitis of the tibial tuberosity in adolescents during rapid growth. Characteristic features: enlarged/tender tibial tuberosity, activity-related pain, tight quadriceps, and age (typically 10–15 in girls, 12–17 in boys). SLJ disease affects the inferior patellar pole apophysis.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'When applying the PRICE principle within the first 48 hours of an acute ankle sprain, what does the "C" represent and what is its purpose?',
    option_a: 'Cooling (ice) — reduces metabolic rate to decrease secondary hypoxic injury',
    option_b: 'Compression — reduces edema by increasing tissue pressure and limiting swelling',
    option_c: 'Casting — immobilizes the joint for healing',
    option_d: 'Careful mobilization — restores early movement',
    correct_option_index: 1,
    rationale: 'In PRICE (Protection, Rest, Ice, Compression, Elevation), Compression applies external pressure to control edema by reducing the pressure gradient driving fluid into the interstitium. Elastic bandaging or compression wraps applied distal to proximal are used. Note: Current evidence suggests "PEACE & LOVE" replaces PRICE as a more complete framework.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A 70-year-old woman complains of neck pain radiating to her right arm with paresthesias in her ring and small fingers. Spurling\'s test is positive to the right. Which cervical level is MOST likely involved?',
    option_a: 'C4-C5',
    option_b: 'C5-C6',
    option_c: 'C6-C7',
    option_d: 'C7-T1',
    correct_option_index: 3,
    rationale: 'The C8 nerve root (exiting at C7-T1) innervates the ring and small fingers (medial hand) and the medial forearm. Paresthesias in these digits with a positive Spurling\'s test (compression + lateral flexion reproducing radicular symptoms) indicates C7-T1 level pathology.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'According to current evidence, which of the following has the BEST outcomes for chronic non-specific low back pain?',
    option_a: 'Passive modalities (ultrasound, TENS) as the sole treatment',
    option_b: 'Lumbar surgery for disc bulge without neurological deficit',
    option_c: 'Multimodal approach: exercise, education (pain neuroscience), and psychological support',
    option_d: 'Complete bed rest until pain resolves',
    correct_option_index: 2,
    rationale: 'Strong Level I evidence supports a biopsychosocial, multimodal approach for chronic non-specific LBP: exercise (any type), pain neuroscience education (PNE), cognitive-behavioral therapy, and graded activity. Passive treatments, surgery (without red flags/radiculopathy), and bed rest have poor evidence for this presentation.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'A physical therapist evaluates a patient after a tibial plateau fracture treated with open reduction internal fixation (ORIF). The surgeon has written "non-weight-bearing for 8 weeks." Rehabilitation at 2 weeks post-surgery should focus primarily on:',
    option_a: 'Progressive weight-bearing and closed-chain strengthening',
    option_b: 'Gait training and return to sport',
    option_c: 'Edema management, ROM (knee/ankle), quad sets, and NWB ambulation training',
    option_d: 'Cycling on a stationary bike with resistance',
    correct_option_index: 2,
    rationale: 'With a strict NWB order, early post-ORIF tibial plateau rehabilitation focuses on: reducing edema (elevation, cryo), maintaining/restoring knee and ankle ROM, quad sets and SLR to maintain quadriceps, and safe NWB ambulation training with appropriate assistive device. Weight-bearing is contraindicated until cleared by the surgeon.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'The Outerbridge classification is used to grade:',
    option_a: 'Severity of rotator cuff tears',
    option_b: 'Articular cartilage damage at the knee',
    option_c: 'Degree of ankle ligament sprain',
    option_d: 'Stages of pressure ulcers',
    correct_option_index: 1,
    rationale: 'The Outerbridge classification grades articular cartilage lesions: Grade I (softening/swelling), Grade II (fragmentation <0.5 inch), Grade III (fragmentation >0.5 inch without subchondral bone exposure), Grade IV (erosion to subchondral bone). Used for patellofemoral and tibial/femoral cartilage assessment.'
  },
  {
    domain: 'Musculoskeletal', template_id: 1,
    question_text: 'Which criterion is MOST important when deciding whether to apply spinal manipulation in a patient with acute low back pain?',
    option_a: 'The patient\'s insurance coverage',
    option_b: 'Ruling out red flags and contraindications (e.g., fracture, malignancy, cauda equina)',
    option_c: 'Duration of pain being less than 2 weeks',
    option_d: 'Patient age being under 40 years',
    correct_option_index: 1,
    rationale: 'Before any spinal manipulation, contraindications must be excluded: fracture, malignancy (metastatic disease), infection, cauda equina syndrome, severe osteoporosis, vascular compromise (vertebral artery). The Flynn CPR (for thrust manipulation) is also used for patient selection. Age and insurance are not clinical criteria.'
  },

  // ===== NEUROMUSCULAR (20) =====

  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'A 68-year-old male is admitted to rehabilitation 5 days following a right middle cerebral artery stroke. He demonstrates left hemiplegia, left hemispatial neglect, and flat affect. His wife reports he seems unaware of his deficits. This lack of awareness is called:',
    option_a: 'Agnosia',
    option_b: 'Anosognosia',
    option_c: 'Apraxia',
    option_d: 'Aphasia',
    correct_option_index: 1,
    rationale: 'Anosognosia is impaired awareness of one\'s own neurological deficits, most commonly associated with right hemisphere strokes and left hemispatial neglect. It is distinct from denial (a psychological response) and significantly impacts rehabilitation engagement and safety. Apraxia is impaired motor planning; agnosia is impaired object recognition.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'A 58-year-old female 6 months post left-hemisphere stroke has right hemiplegia. Her Fugl-Meyer UE score is 28/66. She can extend her wrist to neutral but has limited finger extension. According to CIMT criteria, is she a candidate?',
    option_a: 'Yes — she meets the minimum motor criteria (≥10° wrist extension, ≥10° thumb abduction)',
    option_b: 'No — CIMT requires full hand function',
    option_c: 'No — CIMT is only for acute stroke (within 3 months)',
    option_d: 'Yes — any amount of UE movement qualifies',
    correct_option_index: 0,
    rationale: 'Modified CIMT criteria: ≥10° active wrist extension and ≥10° thumb abduction/extension in the affected hand (some protocols also require ≥10° of finger extension at 2 fingers). This patient has wrist extension to neutral (meets criterion) and would need finger/thumb assessment. CIMT can be applied beyond 3 months post-stroke.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'A 23-year-old patient sustains a T6 complete SCI. During a PT session, the patient suddenly complains of a pounding headache and blurred vision. BP is 195/110. Heart rate is 54 bpm. His foley catheter bag is full. What is the FIRST action the PT should take?',
    option_a: 'Call a code blue immediately',
    option_b: 'Sit the patient upright and empty the catheter bag',
    option_c: 'Lay the patient supine and elevate the legs',
    option_d: 'Administer nitroglycerin sublingually',
    correct_option_index: 1,
    rationale: 'This is autonomic dysreflexia (AD), a potentially life-threatening emergency in SCI at T6 and above. First steps: sit the patient upright (lowers BP via gravity), then identify and remove the noxious stimulus — most commonly a full bladder (check foley, remove kink, empty). Laying supine raises BP further. Only call for medications if repositioning and stimulus removal fail.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'A 74-year-old patient with Parkinson\'s disease has difficulty initiating gait from a standing position. He takes multiple small shuffling steps before getting started. This phenomenon is called:',
    option_a: 'Festination',
    option_b: 'Start hesitation (freezing of gait)',
    option_c: 'Bradykinesia',
    option_d: 'Dyskinesia',
    correct_option_index: 1,
    rationale: 'Freezing of gait (FOG) in Parkinson\'s disease is an episodic inability to initiate or continue walking. Start hesitation is a form of FOG that occurs at gait initiation. Festination refers to progressively accelerating, short steps once walking is occurring. Both result from basal ganglia dysfunction affecting internal rhythm generation.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'A 45-year-old female with relapsing-remitting multiple sclerosis reports that her spasticity and fatigue worsen significantly after a hot bath. This heat sensitivity is called:',
    option_a: 'Lhermitte\'s sign',
    option_b: 'Uhthoff\'s phenomenon',
    option_c: 'Euthermal response',
    option_d: 'Dysautonomia',
    correct_option_index: 1,
    rationale: 'Uhthoff\'s phenomenon is a temporary worsening of MS symptoms (particularly vision and motor symptoms) with increased body temperature (heat, exercise, fever). It occurs because demyelinated axons have impaired conduction at elevated temperatures. Cooling strategies can help manage this during PT. Lhermitte\'s sign is an electric shock with neck flexion.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'A C4 complete SCI patient requires a power wheelchair. Which control interface is MOST appropriate?',
    option_a: 'Joystick controlled by the hand',
    option_b: 'Sip-and-puff or head array control',
    option_c: 'Wrist extension-driven mechanical system',
    option_d: 'Standard manual wheelchair',
    correct_option_index: 1,
    rationale: 'C4 complete SCI: motor function is limited to neck flexors/extensors and trapezius with no voluntary upper extremity function. Sip-and-puff (using breath pressure) or head array (head position-controlled) interfaces are appropriate power wheelchair controls at this level. A joystick requires distal hand function (typically C6+).'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'Which type of tremor is MOST characteristic of essential tremor?',
    option_a: 'Resting tremor that disappears with intentional movement',
    option_b: 'Action tremor (postural and kinetic) that improves with alcohol',
    option_c: 'Intention tremor that worsens approaching a target',
    option_d: 'Rubral tremor present at rest, posture, and with intention',
    correct_option_index: 1,
    rationale: 'Essential tremor is a postural and kinetic (action) tremor, most commonly affecting the hands and head. It is characteristically absent or reduced at rest, increases with sustained postures, and often has a positive family history. Temporary improvement with small amounts of alcohol is a distinguishing feature. Resting tremor is the hallmark of Parkinson\'s disease.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'During cerebellar assessment, a patient demonstrates rapid alternating movements (RAM) of the hand that are irregular in rhythm and amplitude. This is called:',
    option_a: 'Dysmetria',
    option_b: 'Dysdiadochokinesia',
    option_c: 'Athetosis',
    option_d: 'Astasia',
    correct_option_index: 1,
    rationale: 'Dysdiadochokinesia (DDK) is the inability to perform rapid alternating movements smoothly, resulting in irregular rhythm and amplitude. It reflects impaired timing and sequencing function of the ipsilateral cerebellum. Dysmetria is inaccuracy in reaching a target. Athetosis is slow writhing movement associated with basal ganglia pathology.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'A 30-year-old male presents with ascending weakness beginning in his feet 2 weeks after a GI illness. Deep tendon reflexes are absent bilaterally. CSF shows albuminocytologic dissociation (high protein, normal cells). What is the most likely diagnosis?',
    option_a: 'Multiple sclerosis',
    option_b: 'Myasthenia gravis',
    option_c: 'Guillain-Barré syndrome',
    option_d: 'Amyotrophic lateral sclerosis',
    correct_option_index: 2,
    rationale: 'Guillain-Barré syndrome (GBS) is an acute inflammatory demyelinating polyneuropathy typically triggered by infection. Key features: ascending symmetrical weakness, areflexia, and CSF albuminocytologic dissociation (elevated protein without pleocytosis) 1–2 weeks after onset. Respiratory monitoring is critical due to ascending paralysis.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'According to the Rancho Los Amigos Levels of Cognitive Functioning, a TBI patient who is confused, agitated, and responding inconsistently to stimuli is MOST likely at level:',
    option_a: 'Level II (Generalized Response)',
    option_b: 'Level IV (Confused-Agitated)',
    option_c: 'Level VI (Confused-Appropriate)',
    option_d: 'Level VIII (Purposeful-Appropriate)',
    correct_option_index: 1,
    rationale: 'Rancho Level IV (Confused-Agitated): the patient is highly aroused but confused, demonstrates agitated behavior (pulling at restraints, combative), and has limited ability to focus attention. They respond inconsistently to external stimuli. PT management at this stage focuses on agitation reduction and sensory modulation.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'A post-stroke patient on the neurorehabilitation unit demonstrates difficulty swallowing (dysphagia) during a meal. Which is the MOST appropriate FIRST action by the physiotherapist?',
    option_a: 'Continue the meal and observe',
    option_b: 'Stop the meal, assist the patient upright, and notify the nursing team/SLP immediately',
    option_c: 'Provide thick liquids and continue',
    option_d: 'Perform a bedside swallowing assessment independently',
    correct_option_index: 1,
    rationale: 'Dysphagia post-stroke carries significant aspiration pneumonia risk. The PT should immediately stop the meal, ensure the patient is fully upright, and alert nursing/SLP for formal swallowing assessment. PT does not independently manage dysphagia without SLP involvement. Continuing without assessment risks aspiration.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'In the Fugl-Meyer Assessment (FMA), the maximum score for the upper extremity section is:',
    option_a: '66 points',
    option_b: '34 points',
    option_c: '100 points',
    option_d: '56 points',
    correct_option_index: 0,
    rationale: 'The Fugl-Meyer Assessment UE section scores 33 items on a 0–2 scale (0=cannot perform, 1=partial, 2=full), totalling 66 points. The full FMA includes UE (66), LE (34), balance (14), sensation (24), and joint ROM/pain (44), for a total of 226. The UE section is the most frequently used standalone measure in stroke rehabilitation.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'A patient with a right cerebellar lesion would MOST likely demonstrate ataxia:',
    option_a: 'On the left side of the body (contralateral)',
    option_b: 'On the right side of the body (ipsilateral)',
    option_c: 'Bilaterally, affecting both sides equally',
    option_d: 'Only in the lower extremities, not upper',
    correct_option_index: 1,
    rationale: 'Unlike the cerebral cortex, the cerebellum has ipsilateral control — each hemisphere coordinates movements of the same side of the body. A right cerebellar lesion causes right-sided ataxia, dysmetria, and intention tremor. This is due to double decussation of cerebellar pathways.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'A patient with L2 complete SCI has intact hip flexors. What is the MOST functional ambulation outcome expected?',
    option_a: 'Community ambulation without assistive devices',
    option_b: 'Non-functional or exercise ambulation only with KAFOs and forearm crutches',
    option_c: 'Household ambulation with AFOs',
    option_d: 'Full independent community ambulation with AFOs only',
    correct_option_index: 1,
    rationale: 'At L2 complete SCI (preserved hip flexion), functional ambulation is limited. Energy cost is extremely high. Patients can typically perform exercise or therapeutic ambulation using KAFOs (knee-ankle-foot orthoses) and forearm crutches or a walker, but primarily use a wheelchair for community mobility. Community ambulation generally requires L3 or below.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'The Mini-BESTest (Balance Evaluation Systems Test) is designed to assess:',
    option_a: 'Only static balance in the elderly',
    option_b: 'Four balance systems: anticipatory postural adjustments, reactive postural control, sensory orientation, and stability in gait',
    option_c: 'Balance in patients with cerebellar lesions only',
    option_d: 'Fall history and medication use',
    correct_option_index: 1,
    rationale: 'The Mini-BESTest (14 items) assesses four balance systems: anticipatory postural adjustments, reactive postural control, sensory orientation (mCTSIB), and dynamic gait. It is sensitive to balance deficits across neurological conditions (Parkinson\'s, stroke, vestibular) and superior to the Berg in detecting balance system-specific impairments.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'A stroke patient demonstrates a push into the weaker side during sitting and standing tasks, and resists being moved toward the stronger side. They perceive themselves as upright when actually leaning toward the affected side. This is called:',
    option_a: 'Pusher syndrome (contraversive pushing)',
    option_b: 'Hemispatial neglect',
    option_c: 'Ipsilateral pushing due to cerebellar ataxia',
    option_d: 'Anosognosia',
    correct_option_index: 0,
    rationale: 'Pusher syndrome (contraversive pushing) is seen in some stroke patients — they actively push away from the non-paretic side, lean toward the paretic side, and resist correction toward vertical. It is associated with lesions in the posterior thalamus/corona radiata and correlates with distorted perception of body orientation in relation to gravity.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'Which intervention has LEVEL I evidence for improving balance and reducing falls in people with Parkinson\'s disease?',
    option_a: 'Stretching and passive range of motion',
    option_b: 'Tai Chi and task-specific balance training',
    option_c: 'Cognitive training alone',
    option_d: 'TENS to the lower extremities',
    correct_option_index: 1,
    rationale: 'Tai Chi has Level I RCT evidence for reducing falls in Parkinson\'s disease. Task-specific balance training (perturbation training, dual-task training) also has strong evidence. Tai Chi improves anticipatory postural adjustments, reactive balance, and gait. Passive interventions like TENS and stretching lack robust fall-reduction evidence in PD.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'A 55-year-old male with ALS (amyotrophic lateral sclerosis) presents with both UMN and LMN signs including fasciculations, hyperreflexia, and bulbar symptoms. What is the PRIMARY goal of physiotherapy for this patient?',
    option_a: 'Restore lost motor function through intensive strengthening',
    option_b: 'Maintain function, quality of life, and prevent secondary complications while supporting palliative goals',
    option_c: 'Prioritize aggressive aerobic exercise to slow disease progression',
    option_d: 'Focus solely on assistive technology prescription',
    correct_option_index: 1,
    rationale: 'ALS is a progressive, terminal neurodegenerative disease with no cure. PT goals are palliative: maintaining functional independence as long as possible, preventing secondary complications (contractures, respiratory compromise, pressure injuries), and optimizing QoL. Moderate exercise (avoiding overwork weakness) is beneficial; aggressive high-intensity training can be harmful.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'A patient with chronic stroke (18 months post) has a spastic plantarflexion pattern at the ankle preventing heel strike. Which orthotic device would MOST effectively address this during gait?',
    option_a: 'Knee-ankle-foot orthosis (KAFO)',
    option_b: 'Hinged ankle-foot orthosis (AFO) with plantarflexion stop',
    option_c: 'Soft neoprene ankle brace',
    option_d: 'Arch support only',
    correct_option_index: 1,
    rationale: 'A hinged AFO with a plantarflexion stop blocks excessive plantarflexion (equinus) while still allowing some dorsiflexion (push-off), improving foot clearance during swing and heel strike in chronic stroke with spastic equinus. A solid AFO can work but blocks natural dorsiflexion during terminal stance, which is less optimal for gait quality.'
  },
  {
    domain: 'Neuromuscular', template_id: 1,
    question_text: 'The ASIA Impairment Scale (AIS) classifies SCI severity. A patient with no motor or sensory function below the level of injury, including the sacral segments S4-S5, is classified as:',
    option_a: 'AIS A (Complete)',
    option_b: 'AIS B (Incomplete — sensory only preserved)',
    option_c: 'AIS C (Incomplete — motor preserved, non-functional)',
    option_d: 'AIS D (Incomplete — motor functional)',
    correct_option_index: 0,
    rationale: 'ASIA Impairment Scale: AIS A = complete — no motor or sensory function preserved in sacral segments S4-S5. AIS B = sensory function preserved but no motor below the NLI, including S4-S5. AIS C/D = motor function preserved (C: most key muscles grade <3; D: most key muscles ≥grade 3). AIS E = normal function.'
  },

  // ===== CARDIOPULMONARY (15) =====

  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'A 64-year-old male 3 days post-myocardial infarction begins Phase I cardiac rehabilitation. During ambulation at a comfortable pace, his heart rate increases from 68 to 90 bpm, his BP goes from 118/76 to 142/84 mmHg, and he reports an RPE of 12. He has no chest pain or dyspnea. What should the PT do?',
    option_a: 'Stop exercise immediately due to the heart rate increase',
    option_b: 'Continue at this level — the responses are appropriate for Phase I',
    option_c: 'Increase the intensity to achieve RPE of 17',
    option_d: 'Reduce intensity because systolic BP has risen',
    correct_option_index: 1,
    rationale: 'Phase I CR target: RPE 11–13, HR increase <20-30 bpm from rest, SBP rise <10-40 mmHg is normal, no symptoms. This patient\'s responses (HR +22 bpm, SBP +24 mmHg, RPE 12, no symptoms) are all appropriate. Stopping for these responses would be overcautious. An SBP drop or increase >40 mmHg, arrhythmia, or angina would prompt stopping.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'A 58-year-old female with moderate COPD (FEV1/FVC ratio 0.68, FEV1 55% predicted) has severe exercise intolerance. In pulmonary rehabilitation, which intervention provides the GREATEST functional benefit?',
    option_a: 'Oxygen therapy during rest only',
    option_b: 'Lower extremity aerobic training at moderate-to-high intensity',
    option_c: 'Breathing retraining alone (diaphragmatic and pursed-lip)',
    option_d: 'Inspiratory muscle training alone',
    correct_option_index: 1,
    rationale: 'The cornerstone of pulmonary rehabilitation is exercise training, particularly lower extremity aerobic training at moderate-to-high intensity. It provides the greatest improvements in exercise capacity, dyspnea, and quality of life in COPD patients. It does not reverse lung function decline but addresses peripheral muscle deconditioning which contributes significantly to exercise limitation.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'A 72-year-old male with heart failure (EF 30%) is referred to cardiac rehabilitation. His current medications include an ACE inhibitor, beta-blocker, and diuretic. His resting heart rate is 58 bpm due to beta-blockade. What is the MOST appropriate method to set his exercise intensity?',
    option_a: 'Calculate target HR using 220 minus age (age-predicted maximum HR formula)',
    option_b: 'Use RPE (12-14 on Borg scale) and symptom response instead of heart rate targets',
    option_c: 'Target 85% of age-predicted maximum HR',
    option_d: 'Exercise at the highest possible intensity to maximize cardiac remodeling',
    correct_option_index: 1,
    rationale: 'Beta-blockers blunt the heart rate response, making age-predicted HR targets invalid in this population. RPE (12–14, "somewhat hard") and symptom monitoring (dyspnea, fatigue) are the preferred intensity guides for heart failure patients on beta-blockers. A cardiopulmonary exercise test (CPET) with HR reserve method is the gold standard if available.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'Which of the following findings during a patient\'s exercise session is an ABSOLUTE indication to immediately stop exercise?',
    option_a: 'SpO2 drops from 98% to 93%',
    option_b: 'Heart rate increases from 70 to 110 bpm with moderate walking',
    option_c: 'Patient reports new onset chest pain and ST depression on monitor',
    option_d: 'Systolic BP increases from 120 to 148 mmHg with exercise',
    correct_option_index: 2,
    rationale: 'ACSM absolute contraindications to exercise session continuation include: angina (chest pain), ischemic ST changes (>2 mm), dangerous arrhythmias, pallor/cyanosis, ataxia, and request to stop. A SpO2 of 93% with monitoring, proportional HR increase, or normal SBP rise do not warrant immediate cessation without other symptoms.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'A post-thoracotomy patient (right lobectomy for lung cancer, post-op day 3) is reluctant to deep breathe due to pain. The MOST important risk if early pulmonary physiotherapy is not initiated is:',
    option_a: 'Muscle atrophy',
    option_b: 'Postoperative pneumonia and atelectasis',
    option_c: 'Hypertension',
    option_d: 'Wound dehiscence',
    correct_option_index: 1,
    rationale: 'Postoperative atelectasis and pneumonia are the primary risks after thoracic surgery if effective airway clearance and deep breathing are not initiated early. Pain-limited shallow breathing leads to microatelectasis, mucus pooling, and infection. Early deep breathing exercises, incentive spirometry, and ambulation are critical post-thoracotomy.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'Which of the following auscultation findings is MOST consistent with pulmonary edema?',
    option_a: 'Decreased breath sounds bilaterally at the bases',
    option_b: 'Bilateral fine crackles at the bases that do NOT clear with coughing',
    option_c: 'Expiratory wheeze throughout both lung fields',
    option_d: 'Absent breath sounds on the left side only',
    correct_option_index: 1,
    rationale: 'Pulmonary edema produces bilateral fine (Velcro-like) crackles at the lung bases due to alveolar fluid. These are late inspiratory crackles that do not clear with coughing (unlike mucus plugging). Expiratory wheeze suggests bronchospasm (COPD/asthma). Absent breath sounds suggest pneumothorax or pleural effusion.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'A 70-year-old with COPD and cor pulmonale is prescribed 2 L/min of supplemental oxygen. The physiotherapist should be aware that high-flow oxygen in some COPD patients may:',
    option_a: 'Cause immediate bronchospasm',
    option_b: 'Suppress the hypoxic ventilatory drive and cause CO2 retention (hypercapnia)',
    option_c: 'Cause oxygen toxicity within 10 minutes',
    option_d: 'Have no significant effects in COPD patients',
    correct_option_index: 1,
    rationale: 'In chronic CO2-retaining COPD patients, the hypoxic drive (rather than hypercapnic drive) may maintain respiration. Excessive oxygen supplementation can suppress this drive, leading to CO2 retention and respiratory acidosis. SpO2 targets in COPD exacerbations are typically 88–92% rather than the standard 95+% used in most patients.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'A patient with cystic fibrosis is admitted for a pulmonary exacerbation. Which airway clearance technique is MOST evidence-based and preferred for this population?',
    option_a: 'Standard postural drainage with clapping only',
    option_b: 'Autogenic drainage (AD) or active cycle of breathing technique (ACBT) combined with airway clearance devices',
    option_c: 'Pursed-lip breathing only',
    option_d: 'Incentive spirometry only',
    correct_option_index: 1,
    rationale: 'For cystic fibrosis, multiple airway clearance techniques have evidence: autogenic drainage, ACBT, positive expiratory pressure (PEP) devices, high-frequency chest wall oscillation (HFCWO), and exercise. Guidelines recommend self-administered techniques (AD, ACBT, PEP) as the preferred approach for independence. Traditional postural drainage is still used but is patient-position dependent.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'During a 6-Minute Walk Test, at which point should the test be immediately stopped?',
    option_a: 'The patient\'s walking speed decreases',
    option_b: 'SpO2 drops to 85% despite reducing pace, or patient develops chest pain or severe dyspnea',
    option_c: 'The patient requests to stop due to mild leg fatigue',
    option_d: 'Heart rate reaches 75% of age-predicted maximum',
    correct_option_index: 1,
    rationale: 'Absolute indications to stop the 6MWT: SpO2 ≤85%, angina, severe dyspnea, leg cramps, staggering, diaphoresis, or pallor. Mild leg fatigue alone is not a reason to stop — patients can rest and resume within the 6-minute period. Decreasing speed is allowed (walk as far as possible, not as fast).'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'The MCID (Minimal Clinically Important Difference) for the 6-Minute Walk Test in patients with COPD is approximately:',
    option_a: '10 metres',
    option_b: '25 metres',
    option_c: '54 metres',
    option_d: '100 metres',
    correct_option_index: 2,
    rationale: 'The MCID for the 6MWT in COPD is approximately 54 metres (range 35–80 m reported in literature). This means a treatment must produce at least a ~54-metre improvement to be considered clinically meaningful beyond measurement error. This is an important concept when interpreting pulmonary rehabilitation outcomes.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'A 48-year-old male undergoes coronary artery bypass graft (CABG) via median sternotomy. At 4 weeks post-op, which activity should still be AVOIDED?',
    option_a: 'Walking on flat ground for 20 minutes',
    option_b: 'Stair climbing',
    option_c: 'Lifting a 15 kg grocery bag with both hands',
    option_d: 'Light upper extremity ROM exercises',
    correct_option_index: 2,
    rationale: 'Standard sternal precautions post-CABG (median sternotomy): no lifting >4.5–9 kg (10–20 lbs) for 6–8 weeks, no pushing/pulling heavy objects, no asymmetric arm movements. Lifting 15 kg (~33 lbs) would stress the healing sternum at 4 weeks and risks non-union. Walking, stair climbing, and light ROM are typically encouraged.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'Inspiratory muscle training (IMT) is MOST beneficial for which patient population?',
    option_a: 'Patients with mild COPD and no ventilatory limitation',
    option_b: 'Patients with significant inspiratory muscle weakness (PImax < 60% predicted) from COPD, heart failure, or post-ICU',
    option_c: 'Healthy competitive athletes for performance enhancement only',
    option_d: 'Patients with purely obstructive airway disease without muscle weakness',
    correct_option_index: 1,
    rationale: 'IMT is indicated when there is documented inspiratory muscle weakness (PImax <60% predicted). It has strongest evidence in: COPD with inspiratory muscle weakness, heart failure, post-ICU weakness, and post-cardiac surgery. IMT using a threshold loading device (e.g., Threshold IMT, POWERbreathe) at 30–60% PImax is standard protocol.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'Which Phase of cardiac rehabilitation involves a medically supervised, ECG-monitored exercise program immediately following hospitalization for cardiac event?',
    option_a: 'Phase I (inpatient)',
    option_b: 'Phase II (outpatient, supervised)',
    option_c: 'Phase III (community, less supervision)',
    option_d: 'Phase IV (independent maintenance)',
    correct_option_index: 1,
    rationale: 'Phase II cardiac rehabilitation is the outpatient medically supervised program with ECG monitoring (telemetry) beginning 1–2 weeks after hospital discharge and lasting 3–6 months (approximately 36 sessions in Canada/USA). Phase I is the brief inpatient program. Phase III/IV involve progressive independence with community-based exercise.'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'A patient with left-sided heart failure has orthopnea. What is orthopnea and what causes it?',
    option_a: 'Dyspnea with exercise — caused by reduced cardiac output during exertion',
    option_b: 'Dyspnea when supine — caused by redistribution of fluid increasing venous return and pulmonary congestion',
    option_c: 'Dyspnea at night — caused by nocturnal hypoventilation',
    option_d: 'Dyspnea only when bending forward — caused by gastric pressure on the diaphragm',
    correct_option_index: 1,
    rationale: 'Orthopnea is dyspnea when lying flat, relieved by sitting up. In left heart failure, the supine position redistributes lower extremity fluid centrally, increasing venous return and pulmonary capillary wedge pressure, worsening pulmonary edema. Patients often sleep on multiple pillows (the number of pillows = the orthopnea grade).'
  },
  {
    domain: 'Cardiopulmonary', template_id: 1,
    question_text: 'A physical therapist is performing chest physiotherapy on a patient with pneumonia affecting the left lower lobe (posterior basal segment). The CORRECT postural drainage position is:',
    option_a: 'Sitting upright and leaning forward',
    option_b: 'Prone with the foot of the bed elevated approximately 18 inches',
    option_c: 'Right side-lying with hips elevated',
    option_d: 'Supine in a flat position',
    correct_option_index: 1,
    rationale: 'The posterior basal segments of the lower lobes are drained in the prone position with the foot of the bed elevated (head-down tilt ~ 18–20 inches), allowing gravity to assist drainage toward the mainstem bronchi. For the left posterior basal specifically, prone positioning is correct. Right side-lying drains the medial basal segment of the right lower lobe.'
  },

  // ===== INTEGUMENTARY (10) =====

  {
    domain: 'Integumentary', template_id: 1,
    question_text: 'A 75-year-old nursing home resident with limited mobility has a wound over her sacrum measuring 4 cm × 3 cm with full-thickness skin and subcutaneous tissue loss. The wound bed shows yellow slough but no exposed bone or tendon. What is the correct pressure injury classification?',
    option_a: 'Stage II',
    option_b: 'Stage III',
    option_c: 'Stage IV',
    option_d: 'Unstageable',
    correct_option_index: 1,
    rationale: 'NPIAP Stage III: full-thickness skin loss with visible subcutaneous fat/slough, but without exposed bone, tendon, or muscle. Slough is present but does not obscure the depth (which would make it Unstageable). Stage II involves partial thickness (dermis). Stage IV requires bone/tendon/muscle exposure.'
  },
  {
    domain: 'Integumentary', template_id: 1,
    question_text: 'A patient with a Type 2 diabetic foot ulcer (Wagner Grade 1) on the plantar surface of the first metatarsal head has adequate peripheral circulation (ABI 0.9) and no infection. The GOLD STANDARD offloading device is:',
    option_a: 'Removable cast walker boot',
    option_b: 'Total contact cast (TCC)',
    option_c: 'Extra-depth footwear with custom insole',
    option_d: 'Crutches for full non-weight-bearing',
    correct_option_index: 1,
    rationale: 'Total contact casting (TCC) is the gold standard for plantar diabetic foot ulcers because it cannot be removed by the patient, ensuring continuous 24/7 offloading. RCTs show TCC heals more ulcers faster than removable devices. Removable cast walkers are second-line due to lower compliance (patients often remove them at home).'
  },
  {
    domain: 'Integumentary', template_id: 1,
    question_text: 'A 30-year-old male sustained a flame burn to his anterior trunk and both anterior lower limbs. Using the Rule of Nines, what is the approximate total body surface area (TBSA) burned?',
    option_a: '27%',
    option_b: '36%',
    option_c: '45%',
    option_d: '18%',
    correct_option_index: 1,
    rationale: 'Rule of Nines: anterior trunk = 18%, each anterior lower limb = 9% (half of the 18% for each full leg). Total: 18% (anterior trunk) + 9% (right anterior LE) + 9% (left anterior LE) = 36% TBSA.'
  },
  {
    domain: 'Integumentary', template_id: 1,
    question_text: 'A burn wound to the hand appears leathery, waxy white, painless, and dry with no blisters. Sensation to pin prick is absent. What depth of burn is this MOST consistent with?',
    option_a: 'Superficial (first-degree) burn',
    option_b: 'Superficial partial-thickness burn',
    option_c: 'Deep partial-thickness burn',
    option_d: 'Full-thickness (third-degree) burn',
    correct_option_index: 3,
    rationale: 'Full-thickness (third-degree) burns destroy all layers of skin, including nerve endings. Characteristics: leathery or waxy appearance, white/tan/brown/black coloring, painless (no sensation due to nerve destruction), dry, and unable to heal without skin grafting. Blisters occur in partial-thickness burns (sensation intact = painful).'
  },
  {
    domain: 'Integumentary', template_id: 1,
    question_text: 'For a patient with a moderately exuding, non-infected partial-thickness wound, which dressing choice BEST supports moist wound healing while managing exudate?',
    option_a: 'Dry gauze dressing (wet-to-dry)',
    option_b: 'Hydrocolloid dressing',
    option_c: 'Transparent film dressing',
    option_d: 'Calcium alginate dressing',
    correct_option_index: 1,
    rationale: 'Hydrocolloid dressings absorb moderate exudate, maintain a moist wound environment, provide a physical barrier, are self-adherent, and can be left in place for several days. Transparent films are for minimal exudate wounds. Calcium alginates are for heavy exudate. Wet-to-dry gauze is non-selective, damaging to granulation tissue, and no longer recommended.'
  },
  {
    domain: 'Integumentary', template_id: 1,
    question_text: 'Following a skin graft procedure for a hand burn, early active ROM is typically initiated:',
    option_a: 'Immediately on post-op day 1',
    option_b: 'After 3-5 days once the graft has begun to adhere',
    option_c: '6 weeks post-grafting to ensure complete vascularization',
    option_d: 'ROM is contraindicated after skin grafting',
    correct_option_index: 1,
    rationale: 'Post-skin grafting, the graft begins adherence (fibrinous adhesion) within 24-48 hours. Gentle active ROM is typically initiated at 3–5 days (some protocols 5–7 days) once the surgeon confirms initial graft take. Early ROM prevents joint contracture while being timed to avoid shear stress that would disrupt the new graft.'
  },
  {
    domain: 'Integumentary', template_id: 1,
    question_text: 'A patient with a venous leg ulcer presents with a periwound area that is hyperpigmented, edematous, and has a brownish skin discoloration from hemosiderin deposition. These chronic skin changes are called:',
    option_a: 'Erythema',
    option_b: 'Lipodermatosclerosis (atrophie blanche)',
    option_c: 'Venous stasis dermatitis (stasis eczema)',
    option_d: 'Cellulitis',
    correct_option_index: 2,
    rationale: 'Venous stasis dermatitis is a chronic inflammatory condition of the lower legs from venous insufficiency. Hemosiderin deposition from red cell breakdown causes brownish hyperpigmentation, combined with edema, itching, and weeping skin. Lipodermatosclerosis is fibrosis of dermis and subcutaneous tissue (inverted champagne bottle deformity).'
  },
  {
    domain: 'Integumentary', template_id: 1,
    question_text: 'A 65-year-old diabetic patient has absent monofilament sensation (10-g Semmes-Weinstein monofilament) at several sites on the plantar foot. What does this indicate?',
    option_a: 'Normal sensory function for age',
    option_b: 'Loss of protective sensation, significantly increasing ulceration risk',
    option_c: 'Vascular insufficiency only',
    option_d: 'Superficial nerve damage only, not clinically significant',
    correct_option_index: 1,
    rationale: 'The 10-g Semmes-Weinstein monofilament test assesses protective sensation. Inability to feel the 10-g filament at two or more plantar sites indicates loss of protective sensation (LOPS), the strongest clinical predictor of diabetic foot ulceration risk. It identifies patients requiring intensive foot care education, offloading, and regular inspection.'
  },
  {
    domain: 'Integumentary', template_id: 1,
    question_text: 'Negative pressure wound therapy (NPWT/wound VAC) promotes wound healing by:',
    option_a: 'Delivering oxygen directly to wound cells',
    option_b: 'Removing exudate, reducing edema, stimulating granulation tissue, and improving perfusion',
    option_c: 'Providing antimicrobial protection through suction pressure',
    option_d: 'Debriding necrotic tissue through mechanical suction',
    correct_option_index: 1,
    rationale: 'NPWT (typically -75 to -125 mmHg) promotes healing through: removal of excess exudate and bacteria, reduction of periwound edema, mechanical stimulation of granulation tissue (microdeformation), macrodeformation approximating wound edges, and improved perfusion through angiogenesis. It does not directly deliver oxygen or debride necrotic tissue.'
  },
  {
    domain: 'Integumentary', template_id: 1,
    question_text: 'Which of the following characteristics distinguishes a full-thickness burn from a deep partial-thickness burn during physical assessment?',
    option_a: 'Presence of blisters — only full-thickness burns blister',
    option_b: 'Full-thickness burns are painless to pin prick; deep partial-thickness burns retain some pain sensation',
    option_c: 'Full-thickness burns are always red; deep partial-thickness burns are white',
    option_d: 'Deep partial-thickness burns are always infected',
    correct_option_index: 1,
    rationale: 'Pain sensation distinguishes burn depth: Full-thickness burns destroy all sensory nerves = painless to pin prick. Deep partial-thickness burns retain some pain (sensation in deeper dermis). Both may appear white/pale, but full-thickness burns are leathery/dry/non-blanching, while deep partial-thickness may be mottled, wet, and blanch slightly.'
  },

  // ===== OTHER SYSTEMS (15) =====

  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'A 6-year-old child is referred to PT with a diagnosis of spastic diplegic cerebral palsy (GMFCS Level II). Which of the following BEST describes this child\'s expected functional mobility?',
    option_a: 'Uses wheeled mobility for most activities indoors and outdoors',
    option_b: 'Walks in most settings but has limitations on uneven terrain; may use a handheld device outdoors',
    option_c: 'Walks without limitations in all environments',
    option_d: 'Requires total assistance for all mobility',
    correct_option_index: 1,
    rationale: 'GMFCS Level II: walks in most settings but has limitations outdoors and on uneven terrain. Children at this level may use handheld mobility aids (walkers, crutches) outdoors or for long distances, and may use wheeled mobility for community distances. Level I has no limitations; Level III uses assistive devices indoors.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'A 55-year-old female presents with episodic vertigo lasting seconds, triggered by rolling over in bed. Dix-Hallpike to the right reproduces vertigo with upbeat-torsional nystagmus. What is the MOST appropriate treatment?',
    option_a: 'Vestibular adaptation exercises (gaze stabilization)',
    option_b: 'Right Epley maneuver (canalith repositioning)',
    option_c: 'Semont maneuver to the left',
    option_d: 'Brandt-Daroff habituation exercises',
    correct_option_index: 1,
    rationale: 'Positive right Dix-Hallpike with upbeat-torsional nystagmus indicates right posterior canal BPPV. The Epley maneuver (canalith repositioning procedure) for the right posterior canal is the first-line treatment with Level I evidence (~80–90% success in one session). It repositions displaced otoconia from the posterior canal back into the utricle.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'A 4-year-old has not yet begun walking independently. Using developmental milestone expectations, this would be considered:',
    option_a: 'Normal — walking by 4 years is within normal range',
    option_b: 'Delayed — independent walking is expected by 15–18 months; PT referral is indicated',
    option_c: 'Only mildly delayed — walking begins as late as 3 years normally',
    option_d: 'Only relevant if there is a family history of late walkers',
    correct_option_index: 1,
    rationale: 'Typical independent walking onset: 12–15 months (up to 18 months is within normal limits). A 4-year-old not walking independently is significantly delayed (30+ months past the expected milestone) and warrants urgent evaluation for underlying conditions (CP, muscular dystrophy, genetic syndromes, developmental delay).'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'A cancer patient undergoing taxane-based chemotherapy reports bilateral numbness, tingling in the feet, and difficulty with balance on uneven surfaces. Which fall prevention strategy is MOST important?',
    option_a: 'Avoiding all exercise until chemotherapy is complete',
    option_b: 'Task-specific balance training, home hazard modification, and proper footwear',
    option_c: 'Referral to a neurologist only',
    option_d: 'Strengthening the upper extremities only',
    correct_option_index: 1,
    rationale: 'Chemotherapy-induced peripheral neuropathy (CIPN) impairs somatosensory balance and increases fall risk. Evidence-based PT management: balance training (proprioceptive, visual reliance strategies), home hazard assessment and modification, appropriate footwear (firm sole, closed toe), and education. Exercise is safe and beneficial; avoidance worsens deconditioning.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'An 80-year-old patient has a Timed Up and Go (TUG) test result of 18 seconds. What does this indicate?',
    option_a: 'Normal for age',
    option_b: 'High fall risk — further assessment and fall prevention intervention are indicated',
    option_c: 'Only mildly impaired; no intervention needed',
    option_d: 'The test is invalid for patients over 75',
    correct_option_index: 1,
    rationale: 'TUG cut-off scores for fall risk in community-dwelling older adults: >12 seconds indicates fall risk. 18 seconds places this patient well above the threshold, indicating significant fall risk requiring intervention (balance training, environmental modification, medication review, vision check, etc.).'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'A 35-year-old female breast cancer survivor 2 years post-mastectomy develops left arm swelling and heaviness following recent travel. Limb volume difference is 250 mL compared to the right arm. What condition is MOST likely?',
    option_a: 'Deep vein thrombosis of the left arm',
    option_b: 'Secondary lymphedema following axillary lymph node dissection',
    option_c: 'Venous insufficiency from IV placement',
    option_d: 'Muscle hypertrophy from dominant arm use',
    correct_option_index: 1,
    rationale: 'Secondary lymphedema is a common long-term complication following breast cancer treatment involving axillary lymph node dissection and/or radiation. Triggers include travel (prolonged sitting, altitude changes), infection, or trauma. Limb volume difference >200 mL or >10% is clinically significant. Management: complete decongestive therapy (CDT).'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'Which phase of complete decongestive therapy (CDT) for lymphedema involves intensive daily manual lymphatic drainage and multilayer bandaging?',
    option_a: 'Phase II (maintenance)',
    option_b: 'Phase I (intensive/reductive)',
    option_c: 'Phase III (prevention)',
    option_d: 'Phase 0 (pre-clinical)',
    correct_option_index: 1,
    rationale: 'CDT Phase I (Intensive/Reductive): Daily manual lymphatic drainage (MLD) followed by multilayer compression bandaging (MLCB) applied for 23 hours/day, skin care, and decongestive exercise. Duration: 2–4 weeks. Phase II (Maintenance): compression garments (worn daily), self-MLD, skin care, and exercise to maintain gains from Phase I.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'A 72-year-old male is assessed with the Fried Frailty Phenotype. He has unintentional weight loss of 5 kg in the past year, grip strength in the lowest quintile for his age, and reports exhaustion on 2-3 days per week. Activity level is low. Gait speed is 0.7 m/s. How is he classified?',
    option_a: 'Robust (no frailty)',
    option_b: 'Pre-frail (1-2 criteria)',
    option_c: 'Frail (3-5 criteria)',
    option_d: 'Severely frail (all 5 criteria)',
    correct_option_index: 2,
    rationale: 'Fried Frailty Phenotype criteria (5 total): 1) weight loss, 2) exhaustion, 3) weakness (grip strength), 4) slow gait speed (<0.8 m/s), 5) low physical activity. This patient meets 5/5 criteria: weight loss, weakness, exhaustion, low activity, and slow gait speed. 3–5 criteria = frail, associated with significantly increased mortality and disability.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'During cervical cancer treatment involving pelvic radiation, a 45-year-old female develops pelvic floor weakness. The MOST appropriate physiotherapy referral would be to:',
    option_a: 'Cardiac rehabilitation',
    option_b: 'Women\'s health / pelvic floor physiotherapy',
    option_c: 'Pulmonary rehabilitation',
    option_d: 'Orthopedic PT for lower extremity strengthening',
    correct_option_index: 1,
    rationale: 'Pelvic radiation can cause pelvic floor dysfunction (weakness, fibrosis, bowel/bladder dysfunction, sexual dysfunction). Pelvic floor physiotherapy (women\'s health PT) specializes in this area, offering: pelvic floor muscle rehabilitation, manual therapy for pelvic fibrosis, patient education, and strategies for bowel/bladder management.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'A 7-year-old with Down syndrome (Trisomy 21) is referred for PT. Which precaution is MOST important during cervical spine assessment and treatment?',
    option_a: 'Avoidance of weight-bearing exercises',
    option_b: 'Atlantoaxial instability (AAI) — screen before cervical manipulation or high-risk activities',
    option_c: 'Risk of scoliosis — avoid lateral trunk flexion',
    option_d: 'Hypersensitivity to cold therapy',
    correct_option_index: 1,
    rationale: 'Approximately 15% of people with Down syndrome have atlantoaxial instability (increased atlantodens interval >5 mm) due to ligamentous laxity. This creates risk of spinal cord compression with forced cervical flexion or extension. Screening (clinical neurological exam, radiological screening for high-risk activities like gymnastics, Special Olympics) is essential before cervical PT.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'An 8-year-old male is referred with Duchenne muscular dystrophy (DMD). He currently walks independently but demonstrates a Gowers\' sign when rising from the floor. What does Gowers\' sign indicate?',
    option_a: 'Lower limb spasticity causing difficulty with floor transfers',
    option_b: 'Proximal lower limb and trunk weakness requiring the child to use arms to "walk up" the thighs when rising',
    option_c: 'Cerebellar ataxia affecting balance during rising',
    option_d: 'Hip flexor contracture preventing normal hip extension',
    correct_option_index: 1,
    rationale: 'Gowers\' sign is a classic clinical finding in DMD and other proximal myopathies: the child uses both hands to push on the thighs (walking their hands up the legs) to rise from the floor, compensating for weak hip extensors and trunk extensors. It indicates proximal muscle weakness and is a key physical finding in DMD diagnosis and monitoring.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'A 68-year-old male post-prostate cancer treatment (radiation and androgen deprivation therapy) is referred for osteoporosis management. Which type of exercise has the STRONGEST evidence for improving bone mineral density?',
    option_a: 'Swimming and aquatic exercise only',
    option_b: 'Progressive high-intensity resistance training combined with weight-bearing impact exercise',
    option_c: 'Stretching and flexibility exercises',
    option_d: 'Low-intensity walking only',
    correct_option_index: 1,
    rationale: 'Androgen deprivation therapy (ADT) significantly reduces bone mineral density. Progressive high-intensity resistance training (targeting large muscle groups) combined with impact weight-bearing exercise (jumping, vigorous walking) provides the greatest osteogenic stimulus. Aquatic exercise lacks the gravitational loading required for bone remodeling.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'A patient is referred with horizontal canal BPPV (lateral canal BPPV). Which maneuver is MOST appropriate for this condition?',
    option_a: 'Epley maneuver',
    option_b: 'Barbeque roll (Lempert maneuver) or Gufoni maneuver',
    option_c: 'Semont maneuver',
    option_d: 'Brandt-Daroff habituation exercises',
    correct_option_index: 1,
    rationale: 'Horizontal (lateral) canal BPPV is identified by direction-changing horizontal nystagmus on the supine roll test. The Barbeque roll (Lempert maneuver) — rolling the patient 360° toward the unaffected ear — or the Gufoni maneuver are used to reposition otoconia from the horizontal canal. The Epley maneuver treats posterior canal BPPV.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'A 5-year-old presents with delayed motor development, hypotonia, and waddling gait. Serum creatine kinase (CK) is markedly elevated. Genetic testing confirms a frameshift mutation in the dystrophin gene. What is the diagnosis?',
    option_a: 'Spinal muscular atrophy type II',
    option_b: 'Duchenne muscular dystrophy (DMD)',
    option_c: 'Becker muscular dystrophy',
    option_d: 'Cerebral palsy',
    correct_option_index: 1,
    rationale: 'DMD is an X-linked recessive myopathy caused by frameshift mutations in the dystrophin gene leading to complete absence of dystrophin. Presentation: hypotonia, proximal weakness, markedly elevated CK (10,000–100,000 U/L), Gowers\' sign, calf pseudohypertrophy. Average age of diagnosis is 4–5 years. BMD (Becker) has milder course due to partial dystrophin.'
  },
  {
    domain: 'Other Systems', template_id: 1,
    question_text: 'A 78-year-old female with Alzheimer\'s dementia (mild stage) is referred to PT for fall prevention. Which strategy is MOST effective for this patient population?',
    option_a: 'Complex dual-task training at high cognitive load',
    option_b: 'Tailored balance and gait training with caregiver education and simplified home exercises',
    option_c: 'Restraint use to prevent falls in the home',
    option_d: 'Aerobic only exercise with no balance component',
    correct_option_index: 1,
    rationale: 'For mild dementia, evidence supports: tailored fall prevention exercise (balance, gait, strength) adapted to cognitive ability, caregiver education and involvement, home hazard modification, and simplified exercise programs to support adherence. Restraints are a safety risk and human rights concern. Complex dual-task demands should be graded to cognitive capacity.'
  },

  // ===== NON-SYSTEMS (10) =====

  {
    domain: 'Non-Systems', template_id: 1,
    question_text: 'A physical therapist is seeing a 14-year-old patient for knee rehabilitation. During the session, the teenager discloses that their parent is physically abusing them and asks the PT to keep it confidential. The PT\'s MOST appropriate response is:',
    option_a: 'Maintain confidentiality as the patient has requested',
    option_b: 'Advise the patient to speak with a counsellor and take no further action',
    option_c: 'Report the suspected abuse to the appropriate child protection authority and inform the patient that you are required to report',
    option_d: 'Contact the parent to discuss the allegation first',
    correct_option_index: 2,
    rationale: 'Physical therapists are mandatory reporters of suspected child abuse in all Canadian provinces and territories. This duty supersedes patient confidentiality. The PT must report to the child protection authority (e.g., Children\'s Aid Society), inform the patient openly about this obligation, and document the disclosure and actions taken. Contacting the parent could endanger the child.'
  },
  {
    domain: 'Non-Systems', template_id: 1,
    question_text: 'A patient refuses a treatment that the PT believes is clinically necessary. The patient has been fully informed of the risks, benefits, and alternatives. What is the MOST ethical course of action?',
    option_a: 'Override the patient\'s decision and proceed — clinical judgment supersedes patient preference',
    option_b: 'Respect the patient\'s decision, document the informed refusal, and offer alternative options',
    option_c: 'Contact the patient\'s family to convince the patient to comply',
    option_d: 'Discharge the patient immediately for non-compliance',
    correct_option_index: 1,
    rationale: 'Patient autonomy is a foundational bioethical principle. A competent patient who has received adequate information has the legal and ethical right to refuse treatment. The PT must: respect the decision, document informed refusal (including that risks were explained), offer acceptable alternatives, and continue providing appropriate care. Coercing or contacting family without consent violates autonomy.'
  },
  {
    domain: 'Non-Systems', template_id: 1,
    question_text: 'In evidence-based practice (EBP), the concept of clinical expertise refers to:',
    option_a: 'The number of years of practice only',
    option_b: 'The clinician\'s ability to integrate best research evidence with patient values, context, and clinical experience',
    option_c: 'Only the ability to perform skilled manual procedures',
    option_d: 'Following clinical guidelines exactly without modification',
    correct_option_index: 1,
    rationale: 'The Sackett model of EBP integrates three pillars: (1) best available research evidence, (2) clinical expertise (experience, judgment, and skill), and (3) patient values and preferences. Clinical expertise is not simply years of experience — it includes the clinician\'s ability to apply evidence appropriately within the unique clinical context and patient circumstances.'
  },
  {
    domain: 'Non-Systems', template_id: 1,
    question_text: 'A PT receives a gift of $200 from a grateful patient upon discharge. The MOST appropriate action is to:',
    option_a: 'Accept the gift graciously — it is a normal part of the therapeutic relationship',
    option_b: 'Accept the gift only if it is given after discharge',
    option_c: 'Decline the gift and explain that professional codes of ethics restrict accepting gifts to prevent real or perceived conflicts of interest',
    option_d: 'Accept the gift and donate it to charity',
    correct_option_index: 2,
    rationale: 'Most physiotherapy regulatory colleges prohibit or restrict accepting gifts from patients to prevent conflicts of interest, maintain professional boundaries, and preserve the objectivity of clinical decision-making. A $200 gift exceeds incidental gift value thresholds in most jurisdictions. The PT should decline graciously and explain the professional boundary, which itself maintains the therapeutic relationship.'
  },
  {
    domain: 'Non-Systems', template_id: 1,
    question_text: 'A systematic review evaluating exercise for chronic knee pain finds a pooled effect size (SMD) of 0.45. How would you interpret this effect size?',
    option_a: 'Very large clinical effect, routine use is strongly indicated',
    option_b: 'Small to moderate effect — clinically meaningful but modest in magnitude',
    option_c: 'No clinical effect',
    option_d: 'A large effect size, equivalent to complete pain elimination',
    correct_option_index: 1,
    rationale: 'Cohen\'s conventions for Standardized Mean Difference (SMD): small = 0.2, medium = 0.5, large = 0.8. An SMD of 0.45 represents a small-to-moderate effect, indicating a statistically meaningful but modest magnitude of benefit. Clinical significance also requires consideration of NNT, MCID, and patient-reported importance — statistical significance ≠ clinical importance.'
  },
  {
    domain: 'Non-Systems', template_id: 1,
    question_text: 'A physical therapist working in a private clinic is asked by an employer to bill for modalities that were NOT provided to patients. The MOST appropriate action is to:',
    option_a: 'Comply with the employer\'s request to maintain employment',
    option_b: 'Comply only for one-time claims to avoid conflict',
    option_c: 'Refuse, as this constitutes fraud, and report the request through appropriate channels (regulatory college, employer policy)',
    option_d: 'Simply document the modalities as provided without delivering them',
    correct_option_index: 2,
    rationale: 'Fraudulent billing violates the law, professional codes of conduct, and regulatory college standards. The PT has an obligation to refuse, regardless of employment consequences. Appropriate actions: document the request in writing, report through employer escalation channels, consult the provincial regulatory college, and if needed, report to the appropriate fraud reporting authority.'
  },
  {
    domain: 'Non-Systems', template_id: 1,
    question_text: 'A PT is evaluating a patient referred for "back pain." During the assessment, the PT finds no musculoskeletal cause but suspects the patient may have an abdominal aortic aneurysm based on pulsatile abdominal mass and severe unremitting back pain. The BEST action is:',
    option_a: 'Continue PT treatment and reassess in 2 weeks',
    option_b: 'Immediately refer the patient to emergency services (call 911/112)',
    option_c: 'Refer back to the family physician for a routine appointment',
    option_d: 'Perform abdominal auscultation to confirm the diagnosis',
    correct_option_index: 1,
    rationale: 'An abdominal aortic aneurysm (AAA) with a pulsatile abdominal mass is a vascular emergency that can rupture with fatal consequence. This is a Red Flag requiring immediate emergency services activation (911). The PT serves as a primary contact practitioner and must recognize medical emergencies beyond PT scope and act decisively. A routine referral is dangerously inadequate.'
  },
  {
    domain: 'Non-Systems', template_id: 1,
    question_text: 'When interpreting a diagnostic test, a test with HIGH SENSITIVITY is BEST used to:',
    option_a: 'Confirm a diagnosis when the test is positive (rule in)',
    option_b: 'Rule OUT a diagnosis when the test is negative (SnNout)',
    option_c: 'Replace gold-standard diagnostic imaging',
    option_d: 'Identify patients who definitely have the disease',
    correct_option_index: 1,
    rationale: 'The mnemonic SnNout: a test with high Sensitivity, when Negative, rules Out the disease. A highly sensitive test has few false negatives, so a negative result strongly suggests the patient does NOT have the disease. SpPin: high Specificity, Positive result, rules In the disease. Both concepts are critical for interpreting clinical examination tests in physiotherapy.'
  },
  {
    domain: 'Non-Systems', template_id: 1,
    question_text: 'A physical therapist in Canada provides telehealth services to a patient located in another province. Which of the following BEST describes the regulatory requirement?',
    option_a: 'No additional licensure is required — national credentials are sufficient',
    option_b: 'The PT must hold licensure in the province where the PATIENT is located',
    option_c: 'The PT only needs licensure in their home province',
    option_d: 'Telehealth services are exempt from provincial licensure requirements',
    correct_option_index: 1,
    rationale: 'In Canada, physical therapy is regulated provincially/territorially. For telehealth, the general principle is that practice occurs where the patient is located. Therefore, the PT must be licensed in the province where the patient resides when providing services across provincial boundaries. Some provinces are implementing reciprocal licensing through the Pan-Canadian Labour Mobility Agreement, but jurisdiction-specific rules apply.'
  },
  {
    domain: 'Non-Systems', template_id: 1,
    question_text: 'A PT documents in the assessment section of a SOAP note: "Patient unable to perform functional squat due to pain-limited knee flexion ROM of 85°, resulting in inability to perform ADLs including sit-to-stand independently." This statement is an example of:',
    option_a: 'An objective measurement only',
    option_b: 'A clinical judgment linking impairment to functional limitation/activity restriction',
    option_c: 'A subjective patient report',
    option_d: 'A treatment plan',
    correct_option_index: 1,
    rationale: 'In SOAP documentation, the Assessment (A) section contains the PT\'s clinical judgment, including: physiotherapy diagnosis, identification of impairments, functional limitations, and how they relate to the patient\'s participation restrictions. This statement correctly links the impairment (reduced ROM) to a functional limitation (inability to perform sit-to-stand), which is the hallmark of an Assessment statement.'
  }

];

async function seed() {
  console.log('Deleting existing questions for template 1...');
  const { error: deleteError } = await supabase
    .from('questions')
    .delete()
    .eq('template_id', 1);

  if (deleteError) {
    console.error('Error deleting questions:', deleteError.message);
    process.exit(1);
  }

  console.log(`Seeding ${questions.length} questions...`);
  const { error } = await supabase.from('questions').insert(questions);

  if (error) {
    console.error('Error inserting questions:', error.message);
    process.exit(1);
  }

  console.log(`Successfully inserted ${questions.length} questions!\n`);

  const domains = {};
  questions.forEach(q => { domains[q.domain] = (domains[q.domain] || 0) + 1; });
  console.log('Question counts by domain:');
  Object.entries(domains).forEach(([d, c]) => console.log(`  ${d}: ${c}`));
}

seed();
