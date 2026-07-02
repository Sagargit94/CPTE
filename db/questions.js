const QUESTIONS = [
  // ── MUSCULOSKELETAL (30) ──────────────────────────────────────────────────
  {
    domain: "Musculoskeletal",
    question_text: "A patient presents with pain and tenderness over the lateral epicondyle of the humerus that worsens with resisted wrist extension. Which structure is most likely involved?",
    option_a: "Flexor carpi radialis",
    option_b: "Extensor carpi radialis brevis",
    option_c: "Pronator teres",
    option_d: "Brachioradialis",
    correct_option_index: 1,
    rationale: "Lateral epicondylitis (tennis elbow) most commonly involves the extensor carpi radialis brevis (ECRB), which originates at the lateral epicondyle. Resisted wrist extension reproduces symptoms."
  },
  {
    domain: "Musculoskeletal",
    question_text: "Which special test is used to assess for an anterior cruciate ligament (ACL) tear by applying an anterior tibial force on a flexed knee?",
    option_a: "McMurray test",
    option_b: "Valgus stress test",
    option_c: "Lachman test",
    option_d: "Pivot shift test",
    correct_option_index: 2,
    rationale: "The Lachman test is performed with the knee at 20–30° of flexion and an anterior force applied to the tibia. It has the highest sensitivity for ACL tears (~85%)."
  },
  {
    domain: "Musculoskeletal",
    question_text: "A patient has a positive FABER test. Which condition is most likely?",
    option_a: "Patellar tendinopathy",
    option_b: "Hip labral tear",
    option_c: "Lumbar disc herniation",
    option_d: "Sacroiliac joint dysfunction",
    correct_option_index: 3,
    rationale: "FABER (Flexion, ABduction, External Rotation) stresses the sacroiliac joint and hip. A positive test (pain reproduction) most commonly indicates sacroiliac joint dysfunction."
  },
  {
    domain: "Musculoskeletal",
    question_text: "Which nerve is compressed in carpal tunnel syndrome?",
    option_a: "Ulnar nerve",
    option_b: "Radial nerve",
    option_c: "Median nerve",
    option_d: "Musculocutaneous nerve",
    correct_option_index: 2,
    rationale: "Carpal tunnel syndrome results from compression of the median nerve as it passes through the carpal tunnel under the flexor retinaculum."
  },
  {
    domain: "Musculoskeletal",
    question_text: "A therapist performs a McMurray test and elicits a click with the knee in external rotation. Which structure is most likely damaged?",
    option_a: "Lateral meniscus",
    option_b: "Medial collateral ligament",
    option_c: "Medial meniscus",
    option_d: "Anterior cruciate ligament",
    correct_option_index: 2,
    rationale: "The McMurray test with external tibial rotation stresses the medial meniscus. A palpable or audible click with pain indicates medial meniscal pathology."
  },
  {
    domain: "Musculoskeletal",
    question_text: "Which muscle is responsible for initiating shoulder abduction from 0–15°?",
    option_a: "Deltoid",
    option_b: "Supraspinatus",
    option_c: "Infraspinatus",
    option_d: "Trapezius",
    correct_option_index: 1,
    rationale: "The supraspinatus initiates shoulder abduction from 0–15°. The deltoid then takes over for the remaining arc. Both muscles share the load throughout the range."
  },
  {
    domain: "Musculoskeletal",
    question_text: "A patient presents with 'drop wrist' after a humeral shaft fracture. Which nerve is injured?",
    option_a: "Median nerve",
    option_b: "Ulnar nerve",
    option_c: "Axillary nerve",
    option_d: "Radial nerve",
    correct_option_index: 3,
    rationale: "The radial nerve winds around the posterior aspect of the humeral shaft and is vulnerable to injury with mid-shaft fractures. Injury results in wrist drop due to loss of wrist and finger extensor function."
  },
  {
    domain: "Musculoskeletal",
    question_text: "Ober's test assesses tightness of which structure?",
    option_a: "Hip flexors",
    option_b: "Iliotibial band",
    option_c: "Hamstrings",
    option_d: "Piriformis",
    correct_option_index: 1,
    rationale: "Ober's test is used to assess iliotibial band (ITB) and tensor fascia latae (TFL) tightness. A positive test is indicated when the thigh cannot adduct past neutral in the side-lying position."
  },
  {
    domain: "Musculoskeletal",
    question_text: "Which type of muscle contraction produces the greatest force?",
    option_a: "Concentric",
    option_b: "Isometric",
    option_c: "Eccentric",
    option_d: "Isokinetic",
    correct_option_index: 2,
    rationale: "Eccentric contractions produce the greatest force, often 20–50% greater than concentric contractions. The muscle lengthens while producing tension, allowing greater cross-bridge engagement."
  },
  {
    domain: "Musculoskeletal",
    question_text: "A patient with a C6 radiculopathy will most likely have decreased sensation in which area?",
    option_a: "Little finger",
    option_b: "Thumb and index finger",
    option_c: "Middle finger",
    option_d: "Ring and little finger",
    correct_option_index: 1,
    rationale: "C6 dermatomal distribution covers the thumb, index finger, and the lateral forearm. C6 also affects the biceps reflex and wrist extension strength."
  },
  {
    domain: "Musculoskeletal",
    question_text: "Which bony landmark is used to palpate the greater trochanter of the femur?",
    option_a: "Lateral thigh, 10 cm distal to the iliac crest",
    option_b: "Posterior thigh at the gluteal fold",
    option_c: "Medial thigh below the inguinal ligament",
    option_d: "Anterosuperior aspect of the hip",
    correct_option_index: 0,
    rationale: "The greater trochanter is palpable on the lateral thigh, approximately 10 cm distal to the iliac crest. It is the attachment site for the hip abductors and external rotators."
  },
  {
    domain: "Musculoskeletal",
    question_text: "Thomas test assesses for tightness of which muscle group?",
    option_a: "Hip extensors",
    option_b: "Hip abductors",
    option_c: "Hip flexors",
    option_d: "Hip adductors",
    correct_option_index: 2,
    rationale: "The Thomas test assesses for hip flexor (primarily iliopsoas and rectus femoris) tightness. A positive result is a thigh that rises off the table when the opposite hip is fully flexed."
  },
  {
    domain: "Musculoskeletal",
    question_text: "Osteoporosis is defined by a bone mineral density T-score of:",
    option_a: "Between -1.0 and -2.5",
    option_b: "Above -1.0",
    option_c: "-2.5 or below",
    option_d: "Below -3.0 only",
    correct_option_index: 2,
    rationale: "WHO criteria: T-score above -1.0 = normal; -1.0 to -2.5 = osteopenia; -2.5 or below = osteoporosis. T-score compares BMD to a young adult reference standard."
  },
  {
    domain: "Musculoskeletal",
    question_text: "A patient reports pain with resisted shoulder external rotation and a positive infraspinatus test. Which rotator cuff muscle is involved?",
    option_a: "Supraspinatus",
    option_b: "Subscapularis",
    option_c: "Teres minor",
    option_d: "Infraspinatus",
    correct_option_index: 3,
    rationale: "The infraspinatus is the primary shoulder external rotator, originating from the infraspinous fossa of the scapula. Weakness or pain with resisted external rotation indicates infraspinatus involvement."
  },
  {
    domain: "Musculoskeletal",
    question_text: "The scapulohumeral rhythm during shoulder abduction is approximately:",
    option_a: "1:1 (equal glenohumeral and scapulothoracic motion)",
    option_b: "2:1 (2° glenohumeral for every 1° scapulothoracic)",
    option_c: "3:1 (3° glenohumeral for every 1° scapulothoracic)",
    option_d: "4:1 (4° glenohumeral for every 1° scapulothoracic)",
    correct_option_index: 1,
    rationale: "Normal scapulohumeral rhythm is 2:1 — for every 3° of shoulder abduction, 2° occur at the glenohumeral joint and 1° at the scapulothoracic joint. Total 180° = 120° GH + 60° ST."
  },
  {
    domain: "Musculoskeletal",
    question_text: "Which type of fracture is most common in children and involves one side of the cortex buckling?",
    option_a: "Greenstick fracture",
    option_b: "Torus (buckle) fracture",
    option_c: "Salter-Harris Type I fracture",
    option_d: "Comminuted fracture",
    correct_option_index: 1,
    rationale: "A torus (buckle) fracture occurs when one side of the cortex buckles under compressive force, common in the distal radius of children. A greenstick fracture involves one cortex breaking while the other bends."
  },
  {
    domain: "Musculoskeletal",
    question_text: "Genu valgum is defined as:",
    option_a: "Lateral bowing of the knee (bow-legged)",
    option_b: "Medial collapse of the knee (knock-kneed)",
    option_c: "Hyperextension of the knee",
    option_d: "Fixed knee flexion deformity",
    correct_option_index: 1,
    rationale: "Genu valgum ('knock-knee') describes medial angulation of the tibia relative to the femur. Genu varum ('bow-leg') is the opposite, with lateral bowing."
  },
  {
    domain: "Musculoskeletal",
    question_text: "Which muscle group is most responsible for preventing knee valgus collapse during single-leg stance?",
    option_a: "Knee extensors (quadriceps)",
    option_b: "Hip abductors (gluteus medius)",
    option_c: "Plantarflexors (gastrocnemius)",
    option_d: "Hip adductors",
    correct_option_index: 1,
    rationale: "The gluteus medius controls contralateral pelvic drop (Trendelenburg) and prevents ipsilateral knee valgus during single-leg activities. Weakness is a key factor in patellofemoral syndrome and ACL injury risk."
  },
  {
    domain: "Musculoskeletal",
    question_text: "A patient presents with pain at the posterior heel at the Achilles insertion. The most likely diagnosis is:",
    option_a: "Plantar fasciitis",
    option_b: "Haglund's deformity / insertional Achilles tendinopathy",
    option_c: "Tarsal tunnel syndrome",
    option_d: "Retrocalcaneal bursitis alone",
    correct_option_index: 1,
    rationale: "Insertional Achilles tendinopathy (often associated with Haglund's deformity — a bony prominence on the posterior superior calcaneus) presents as posterior heel pain directly at the tendon insertion."
  },
  {
    domain: "Musculoskeletal",
    question_text: "The empty can (Jobe) test specifically assesses the integrity of which muscle?",
    option_a: "Infraspinatus",
    option_b: "Subscapularis",
    option_c: "Supraspinatus",
    option_d: "Teres minor",
    correct_option_index: 2,
    rationale: "The empty can test positions the arm in 90° abduction and 30° horizontal adduction (scapular plane) with internal rotation (thumb down). Resisted elevation in this position isolates the supraspinatus."
  },
  {
    domain: "Musculoskeletal",
    question_text: "Tight hip flexors in the supine patient will produce which postural deviation at the lumbar spine?",
    option_a: "Lumbar kyphosis",
    option_b: "Increased lumbar lordosis (anterior pelvic tilt)",
    option_c: "Lateral lumbar shift",
    option_d: "Lumbar scoliosis",
    correct_option_index: 1,
    rationale: "Tight hip flexors (iliopsoas, rectus femoris) pull the pelvis into anterior tilt, increasing lumbar lordosis. This is a common finding in sedentary individuals who sit for prolonged periods."
  },
  {
    domain: "Musculoskeletal",
    question_text: "Boutonnière deformity of the finger is characterized by:",
    option_a: "Hyperextension of the PIP joint and flexion of the DIP joint",
    option_b: "Flexion of the PIP joint and hyperextension of the DIP joint",
    option_c: "Flexion of the MCP joint and extension of the PIP and DIP joints",
    option_d: "Extension of all finger joints",
    correct_option_index: 1,
    rationale: "Boutonnière deformity involves PIP flexion and DIP hyperextension, caused by disruption of the central slip of the extensor mechanism. The lateral bands migrate anteriorly, becoming flexors of the PIP."
  },
  {
    domain: "Musculoskeletal",
    question_text: "During the Apley scratch test, a patient is unable to reach the opposite scapula behind the back. This primarily assesses which motion?",
    option_a: "Shoulder flexion",
    option_b: "Shoulder external rotation and abduction",
    option_c: "Shoulder internal rotation and adduction",
    option_d: "Shoulder horizontal abduction",
    correct_option_index: 2,
    rationale: "The Apley scratch test reaching behind the back assesses internal rotation and adduction. The overhead portion assesses external rotation and abduction. Together they provide a quick screen of shoulder mobility."
  },
  {
    domain: "Musculoskeletal",
    question_text: "Which grade of Manual Muscle Testing (MMT) indicates a muscle can move through full range of motion against gravity only?",
    option_a: "Grade 3",
    option_b: "Grade 4",
    option_c: "Grade 2",
    option_d: "Grade 5",
    correct_option_index: 0,
    rationale: "MMT Grade 3 (Fair) = full ROM against gravity, no additional resistance. Grade 4 (Good) = full ROM against gravity with some resistance. Grade 5 (Normal) = full ROM against gravity with full resistance."
  },
  {
    domain: "Musculoskeletal",
    question_text: "A patient has winging of the scapula when pushing against a wall. Which nerve is most likely injured?",
    option_a: "Axillary nerve",
    option_b: "Long thoracic nerve",
    option_c: "Suprascapular nerve",
    option_d: "Spinal accessory nerve (CN XI)",
    correct_option_index: 1,
    rationale: "The long thoracic nerve innervates the serratus anterior. Injury causes medial winging of the scapula (vertebral border lifts), most obvious with a push-up or wall push test."
  },
  {
    domain: "Musculoskeletal",
    question_text: "The capsular pattern of the glenohumeral joint in adhesive capsulitis is:",
    option_a: "Limitation of flexion > abduction > external rotation",
    option_b: "Limitation of external rotation > abduction > internal rotation",
    option_c: "Limitation of abduction only",
    option_d: "Equal limitation in all directions",
    correct_option_index: 1,
    rationale: "The capsular pattern of the GH joint is external rotation most limited, then abduction, then internal rotation. This pattern is the hallmark of adhesive capsulitis (frozen shoulder)."
  },
  {
    domain: "Musculoskeletal",
    question_text: "Phalen's test reproduces carpal tunnel syndrome symptoms by:",
    option_a: "Tapping over the carpal tunnel",
    option_b: "Applying direct pressure over the carpal tunnel",
    option_c: "Sustaining maximal wrist flexion for 60 seconds",
    option_d: "Sustaining maximal wrist extension for 60 seconds",
    correct_option_index: 2,
    rationale: "Phalen's test involves holding both wrists in full flexion (back to back) for 60 seconds. This increases pressure in the carpal tunnel and reproduces median nerve symptoms (tingling in the thumb, index, and middle fingers)."
  },
  {
    domain: "Musculoskeletal",
    question_text: "Which ligament is most commonly injured in a lateral ankle sprain?",
    option_a: "Deltoid ligament",
    option_b: "Calcaneofibular ligament",
    option_c: "Posterior talofibular ligament",
    option_d: "Anterior talofibular ligament",
    correct_option_index: 3,
    rationale: "The anterior talofibular ligament (ATFL) is the weakest and most frequently injured ligament in lateral ankle sprains (inversion + plantarflexion mechanism). The calcaneofibular ligament (CFL) is the second most commonly injured."
  },
  {
    domain: "Musculoskeletal",
    question_text: "A patient with De Quervain's tenosynovitis will have a positive:",
    option_a: "Phalen's test",
    option_b: "Finkelstein test",
    option_c: "Allen test",
    option_d: "Tinel's sign at the wrist",
    correct_option_index: 1,
    rationale: "Finkelstein's test (making a fist over the thumb then ulnar-deviating the wrist) provokes pain over the radial styloid in De Quervain's tenosynovitis, which affects the APL and EPB tendons."
  },
  {
    domain: "Musculoskeletal",
    question_text: "Which structure is tested with the anterior drawer test of the ankle?",
    option_a: "Calcaneofibular ligament",
    option_b: "Posterior talofibular ligament",
    option_c: "Deltoid ligament",
    option_d: "Anterior talofibular ligament",
    correct_option_index: 3,
    rationale: "The anterior drawer test of the ankle assesses the integrity of the anterior talofibular ligament (ATFL). A positive test (excessive anterior translation of the talus) indicates ATFL laxity."
  },

  // ── NEUROMUSCULAR (20) ────────────────────────────────────────────────────
  {
    domain: "Neuromuscular",
    question_text: "A patient with a complete T6 spinal cord injury will retain which function?",
    option_a: "Voluntary bladder control",
    option_b: "Independent ambulation without assistive device",
    option_c: "Full upper extremity function",
    option_d: "Voluntary lower extremity movement",
    correct_option_index: 2,
    rationale: "T6 complete SCI preserves full upper extremity function (innervated by C5–T1) and respiratory function. The patient will have paraplegia (loss of motor and sensory function below T6) but intact arms, shoulders, and hands."
  },
  {
    domain: "Neuromuscular",
    question_text: "Romberg's test assesses which sensory system?",
    option_a: "Vestibular only",
    option_b: "Visual only",
    option_c: "Proprioception (dorsal column integrity)",
    option_d: "Cerebellar coordination",
    correct_option_index: 2,
    rationale: "Romberg's test compares balance with eyes open vs. eyes closed. Increased sway with eyes closed (positive Romberg) indicates reliance on vision to compensate for proprioceptive deficits — a sign of dorsal column dysfunction."
  },
  {
    domain: "Neuromuscular",
    question_text: "A patient with Parkinson's disease demonstrates festination. This refers to:",
    option_a: "Resting tremor of the hands",
    option_b: "Involuntary acceleration of gait with progressively shorter steps",
    option_c: "Cogwheel rigidity of the extremities",
    option_d: "Freezing of gait at doorways",
    correct_option_index: 1,
    rationale: "Festination is the progressive acceleration of gait with shortening steps, as if the patient is trying to catch up with their center of gravity. It is a hallmark of Parkinson's disease gait dysfunction."
  },
  {
    domain: "Neuromuscular",
    question_text: "Following a right middle cerebral artery (MCA) stroke, a patient is most likely to present with:",
    option_a: "Left hemiplegia and left hemispatial neglect",
    option_b: "Right hemiplegia and aphasia",
    option_c: "Bilateral leg weakness",
    option_d: "Cerebellar ataxia",
    correct_option_index: 0,
    rationale: "Right MCA stroke causes left-sided hemiplegia (motor cortex) and left hemispatial neglect (right parietal cortex). Left MCA stroke causes right hemiplegia and aphasia (dominant language hemisphere)."
  },
  {
    domain: "Neuromuscular",
    question_text: "Which reflex level is tested with the biceps reflex?",
    option_a: "C4–C5",
    option_b: "C5–C6",
    option_c: "C7–C8",
    option_d: "L3–L4",
    correct_option_index: 1,
    rationale: "The biceps reflex is mediated via C5–C6. The brachioradialis reflex is also C5–C6. The triceps reflex is C7–C8. Knowing reflex levels helps localize the level of spinal cord or nerve root pathology."
  },
  {
    domain: "Neuromuscular",
    question_text: "A patient with multiple sclerosis demonstrates Lhermitte's sign. This is described as:",
    option_a: "Visual blurring with eye movement",
    option_b: "Electric shock sensation down the spine with neck flexion",
    option_c: "Spasticity triggered by tactile stimulation",
    option_d: "Intermittent facial pain",
    correct_option_index: 1,
    rationale: "Lhermitte's sign is an electric shock sensation radiating down the spine or into limbs with cervical flexion, caused by demyelination of the posterior columns of the cervical spinal cord. It is common in MS but not specific to it."
  },
  {
    domain: "Neuromuscular",
    question_text: "Which balance system compensates most effectively when both vision and somatosensation are impaired?",
    option_a: "Proprioceptive system",
    option_b: "Visual system",
    option_c: "Vestibular system",
    option_d: "Auditory system",
    correct_option_index: 2,
    rationale: "The vestibular system detects head acceleration and position relative to gravity. When vision and somatosensation are both compromised, the vestibular system becomes the primary source of balance information."
  },
  {
    domain: "Neuromuscular",
    question_text: "Upper motor neuron (UMN) lesions are characterized by:",
    option_a: "Flaccidity, hyporeflexia, and muscle atrophy",
    option_b: "Spasticity, hyperreflexia, and Babinski sign",
    option_c: "Fasciculations and reduced tone",
    option_d: "Loss of DTRs and muscle wasting",
    correct_option_index: 1,
    rationale: "UMN lesions (brain or spinal cord above anterior horn) present with spasticity, hyperreflexia, clonus, and a positive Babinski sign. LMN lesions present with flaccidity, hyporeflexia, and fasciculations."
  },
  {
    domain: "Neuromuscular",
    question_text: "The Fugl-Meyer Assessment is used primarily to evaluate:",
    option_a: "Cognitive function after TBI",
    option_b: "Motor function and recovery after stroke",
    option_c: "Gait velocity in Parkinson's disease",
    option_d: "Balance in vestibular disorders",
    correct_option_index: 1,
    rationale: "The Fugl-Meyer Assessment (FMA) evaluates motor impairment, balance, sensation, and joint function after stroke. It is one of the most widely used and validated outcome measures for post-stroke motor recovery."
  },
  {
    domain: "Neuromuscular",
    question_text: "Which gait deviation is most commonly associated with weak hip abductors (gluteus medius)?",
    option_a: "Foot drop",
    option_b: "Trendelenburg gait (contralateral pelvic drop)",
    option_c: "Antalgic gait",
    option_d: "Scissor gait",
    correct_option_index: 1,
    rationale: "Trendelenburg gait results from weak ipsilateral hip abductors failing to stabilize the pelvis during single-leg stance, causing the contralateral pelvis to drop. A compensated Trendelenburg involves lateral trunk lean toward the weak side."
  },
  {
    domain: "Neuromuscular",
    question_text: "Guillain-Barré syndrome is characterized by:",
    option_a: "Ascending spastic paralysis with hyperreflexia",
    option_b: "Ascending flaccid paralysis with areflexia",
    option_c: "Descending paralysis starting with cranial nerves",
    option_d: "Unilateral motor deficit with sensory sparing",
    correct_option_index: 1,
    rationale: "GBS is an acute autoimmune demyelinating polyneuropathy presenting with ascending flaccid paralysis (beginning in the feet) and areflexia. Sensory symptoms are common but motor deficits dominate. Respiratory muscle involvement can be life-threatening."
  },
  {
    domain: "Neuromuscular",
    question_text: "A patient with cerebellar ataxia will most likely demonstrate:",
    option_a: "Spastic gait with circumduction",
    option_b: "Steppage gait with foot drop",
    option_c: "Wide-based gait with dysmetria and intention tremor",
    option_d: "Shuffling gait with decreased arm swing",
    correct_option_index: 2,
    rationale: "Cerebellar ataxia produces wide-based, staggering gait with dysmetria (past-pointing), intention tremor (worsens with target-directed movement), and dysdiadochokinesia (impaired rapid alternating movements)."
  },
  {
    domain: "Neuromuscular",
    question_text: "In the ASIA Impairment Scale, an ASIA B classification indicates:",
    option_a: "Normal motor and sensory function",
    option_b: "Sensory incomplete — sensory preserved but no motor function below the neurological level",
    option_c: "Motor incomplete — more than half of muscles below NLI have MMT < 3",
    option_d: "Motor incomplete — at least half of muscles below NLI have MMT ≥ 3",
    correct_option_index: 1,
    rationale: "ASIA B = sensory incomplete: sensory but not motor function is preserved below the neurological level, including S4–S5. ASIA C and D are motor incomplete, differing in whether key muscles below NLI are ≥ grade 3."
  },
  {
    domain: "Neuromuscular",
    question_text: "Spinal cord injury at C4 would most likely result in which functional ability?",
    option_a: "Independent ambulation with AFOs",
    option_b: "Independent manual wheelchair propulsion",
    option_c: "Power wheelchair independence with head/chin control",
    option_d: "Driving with hand controls",
    correct_option_index: 2,
    rationale: "C4 SCI preserves head, neck, and upper trapezius function but no reliable arm function. These patients typically use a power wheelchair with head or chin control. Independent manual propulsion requires at least C6 function."
  },
  {
    domain: "Neuromuscular",
    question_text: "Which outcome measure is most appropriate for assessing balance in community-dwelling older adults at risk for falls?",
    option_a: "Berg Balance Scale",
    option_b: "Glasgow Coma Scale",
    option_c: "ASIA Impairment Scale",
    option_d: "Modified Ashworth Scale",
    correct_option_index: 0,
    rationale: "The Berg Balance Scale (BBS) is a 14-item, 56-point scale widely used to assess static and dynamic balance in older adults. A score below 45 indicates increased fall risk. The GCS assesses consciousness; MAS assesses spasticity."
  },
  {
    domain: "Neuromuscular",
    question_text: "The Timed Up and Go (TUG) test measures:",
    option_a: "Maximal gait speed over 10 meters",
    option_b: "The time to stand from a chair, walk 3 meters, return, and sit",
    option_c: "Single-leg stance time",
    option_d: "Stair climbing speed",
    correct_option_index: 1,
    rationale: "The TUG test times a patient rising from a standard chair, walking 3 meters, turning, returning, and sitting. A time > 12 seconds indicates increased fall risk in community-dwelling older adults."
  },
  {
    domain: "Neuromuscular",
    question_text: "A patient post-stroke exhibits spasticity rated as 3 on the Modified Ashworth Scale. This indicates:",
    option_a: "No increase in muscle tone",
    option_b: "Slight increase with a catch at end range",
    option_c: "Considerable increase in tone, passive movement is difficult",
    option_d: "Limb is rigid in flexion or extension",
    correct_option_index: 2,
    rationale: "Modified Ashworth Scale: 0=normal, 1=slight catch at end, 1+=catch in first half, 2=marked increase but passive movement easy, 3=considerable increase, passive movement difficult, 4=rigid."
  },
  {
    domain: "Neuromuscular",
    question_text: "During the Brunnstrom stages of stroke recovery, stage 3 is characterized by:",
    option_a: "Flaccidity with no voluntary movement",
    option_b: "Spasticity peaks; voluntary movement only within synergy patterns",
    option_c: "Voluntary movement out of synergy begins",
    option_d: "Near-normal coordination",
    correct_option_index: 1,
    rationale: "Brunnstrom Stage 3: spasticity is at its peak and voluntary movements are only possible as components of flexor or extensor synergy patterns. Stage 1 is flaccid, Stage 4 is when out-of-synergy movements begin."
  },
  {
    domain: "Neuromuscular",
    question_text: "Proprioceptive Neuromuscular Facilitation (PNF) D1 flexion pattern for the upper extremity involves:",
    option_a: "Shoulder flexion, abduction, internal rotation with wrist extension",
    option_b: "Shoulder flexion, adduction, external rotation with wrist extension",
    option_c: "Shoulder extension, abduction, external rotation",
    option_d: "Shoulder extension, adduction, internal rotation",
    correct_option_index: 1,
    rationale: "PNF D1 flexion (UE): shoulder flexion + adduction + external rotation; elbow may flex or extend; forearm supination; wrist flexion to radial deviation; finger flexion/adduction; thumb adduction."
  },
  {
    domain: "Neuromuscular",
    question_text: "In a patient with Bell's palsy, which intervention is CONTRAINDICATED?",
    option_a: "Gentle facial massage",
    option_b: "Mirror biofeedback exercises",
    option_c: "Electrical stimulation to denervated facial muscles in the acute phase",
    option_d: "Eye protection and lubrication",
    correct_option_index: 2,
    rationale: "Electrical stimulation of acutely denervated facial muscles in Bell's palsy is generally contraindicated as it may promote synkinesis (abnormal co-contraction of facial muscles) and interfere with normal reinnervation. Conservative management is preferred in the acute phase."
  },

  // ── CARDIOPULMONARY (15) ──────────────────────────────────────────────────
  {
    domain: "Cardiopulmonary",
    question_text: "Using the Karvonen formula, what is the target heart rate at 60% intensity for a patient with a resting HR of 70 bpm and an age-predicted max HR of 170 bpm?",
    option_a: "102 bpm",
    option_b: "130 bpm",
    option_c: "140 bpm",
    option_d: "120 bpm",
    correct_option_index: 1,
    rationale: "Karvonen: THR = [(HRmax - HRrest) × intensity] + HRrest = [(170 - 70) × 0.60] + 70 = [100 × 0.60] + 70 = 60 + 70 = 130 bpm."
  },
  {
    domain: "Cardiopulmonary",
    question_text: "Which clinical sign indicates left-sided heart failure?",
    option_a: "Peripheral pitting edema",
    option_b: "Jugular venous distension",
    option_c: "Pulmonary crackles (rales)",
    option_d: "Hepatomegaly",
    correct_option_index: 2,
    rationale: "Left-sided heart failure causes fluid backup into the pulmonary circulation, producing pulmonary congestion and crackles (rales). Right-sided failure causes systemic venous congestion: JVD, peripheral edema, and hepatomegaly."
  },
  {
    domain: "Cardiopulmonary",
    question_text: "The primary muscle of inspiration is the:",
    option_a: "External intercostals",
    option_b: "Sternocleidomastoid",
    option_c: "Diaphragm",
    option_d: "Scalenes",
    correct_option_index: 2,
    rationale: "The diaphragm is responsible for ~70–80% of tidal volume during quiet breathing. It contracts and descends during inspiration, increasing thoracic volume and decreasing intrathoracic pressure."
  },
  {
    domain: "Cardiopulmonary",
    question_text: "A patient with COPD in a pulmonary rehab program should be monitored for exercise termination if SpO₂ drops below:",
    option_a: "98%",
    option_b: "95%",
    option_c: "90%",
    option_d: "85%",
    correct_option_index: 2,
    rationale: "Exercise should be stopped if SpO₂ drops below 90% (or by > 4% from baseline per ACSM guidelines). This indicates significant oxygen desaturation that could be harmful to cardiac and cerebral tissue."
  },
  {
    domain: "Cardiopulmonary",
    question_text: "Pursed-lip breathing is beneficial for patients with COPD primarily because it:",
    option_a: "Increases the respiratory rate",
    option_b: "Creates back-pressure to prevent airway collapse and prolongs exhalation",
    option_c: "Strengthens the diaphragm",
    option_d: "Reduces FRC (functional residual capacity)",
    correct_option_index: 1,
    rationale: "Pursed-lip breathing creates positive back-pressure in the airways during exhalation, preventing dynamic airway collapse (air trapping). It slows respiratory rate, reduces dyspnea, and improves gas exchange in COPD."
  },
  {
    domain: "Cardiopulmonary",
    question_text: "Which position is MOST recommended for a patient with unilateral pneumonia to optimize oxygenation?",
    option_a: "Side-lying with the affected lung down",
    option_b: "Supine with HOB elevated 30°",
    option_c: "Side-lying with the good lung down",
    option_d: "Prone",
    correct_option_index: 2,
    rationale: "For unilateral lung disease, the 'good lung down' position (healthy lung dependent) optimizes V/Q matching because perfusion is gravity-dependent. More blood flows to the healthy lung, which can participate in gas exchange."
  },
  {
    domain: "Cardiopulmonary",
    question_text: "The Borg Rate of Perceived Exertion (RPE) scale ranges from 6 to 20. A moderate exercise intensity corresponds to approximately:",
    option_a: "8–10",
    option_b: "11–13",
    option_c: "14–16",
    option_d: "17–19",
    correct_option_index: 1,
    rationale: "On the Borg 6–20 scale, 11–13 (light to somewhat hard) corresponds to moderate intensity. The scale roughly correlates with HR ÷ 10, so RPE 12 ≈ HR 120 bpm. Cardiac rehab typically targets RPE 11–14."
  },
  {
    domain: "Cardiopulmonary",
    question_text: "Orthostatic hypotension is defined as a drop in systolic BP of at least __ mmHg within 3 minutes of standing:",
    option_a: "10 mmHg",
    option_b: "20 mmHg",
    option_c: "30 mmHg",
    option_d: "5 mmHg",
    correct_option_index: 1,
    rationale: "Orthostatic hypotension is defined as a drop of ≥ 20 mmHg systolic (or ≥ 10 mmHg diastolic) within 3 minutes of standing from supine. Symptoms include lightheadedness, dizziness, and syncope."
  },
  {
    domain: "Cardiopulmonary",
    question_text: "In postural drainage for a patient with secretions in the right lower lobe (posterior basal segment), the patient should be positioned:",
    option_a: "Sitting upright",
    option_b: "Side-lying on the left with HOB elevated",
    option_c: "Prone with the foot of the bed elevated",
    option_d: "Supine with legs elevated",
    correct_option_index: 2,
    rationale: "The posterior basal segments of the lower lobes drain in a prone position with the foot of the bed elevated (Trendelenburg tilt), using gravity to move secretions toward the central airways."
  },
  {
    domain: "Cardiopulmonary",
    question_text: "Which vital sign abnormality is an ABSOLUTE CONTRAINDICATION to initiating exercise?",
    option_a: "Resting HR of 95 bpm",
    option_b: "Resting systolic BP of 145 mmHg",
    option_c: "Resting systolic BP > 200 mmHg or diastolic BP > 110 mmHg",
    option_d: "SpO₂ of 93%",
    correct_option_index: 2,
    rationale: "Per ACSM guidelines, resting systolic BP > 200 mmHg or diastolic > 110 mmHg is an absolute contraindication to exercise. Exercise significantly increases cardiac output and BP, posing unacceptable cardiovascular risk."
  },
  {
    domain: "Cardiopulmonary",
    question_text: "Forced expiratory volume in 1 second (FEV₁) / FVC ratio < 0.70 is diagnostic of:",
    option_a: "Restrictive lung disease",
    option_b: "Obstructive lung disease",
    option_c: "Normal pulmonary function",
    option_d: "Pulmonary fibrosis",
    correct_option_index: 1,
    rationale: "An FEV₁/FVC ratio < 0.70 (post-bronchodilator) indicates airflow obstruction (obstructive pattern), characteristic of COPD, asthma, or bronchiectasis. Restrictive disease has a reduced FVC with a normal or elevated FEV₁/FVC ratio."
  },
  {
    domain: "Cardiopulmonary",
    question_text: "Phase I cardiac rehabilitation is conducted:",
    option_a: "Outpatient, 3–6 months post-MI",
    option_b: "In a monitored gym setting",
    option_c: "In the acute care hospital, beginning as soon as the patient is stable",
    option_d: "At home with a remote monitoring device",
    correct_option_index: 2,
    rationale: "Phase I is the in-hospital, acute phase of cardiac rehab, starting within 24–48 hours of a cardiac event if the patient is hemodynamically stable. Goals include early mobilization, patient education, and discharge planning."
  },
  {
    domain: "Cardiopulmonary",
    question_text: "Auscultation reveals a wheeze during exhalation. This is most consistent with:",
    option_a: "Pneumonia with consolidation",
    option_b: "Pleural effusion",
    option_c: "Bronchospasm or airway narrowing (asthma/COPD)",
    option_d: "Pulmonary fibrosis",
    correct_option_index: 2,
    rationale: "Expiratory wheeze is a high-pitched musical sound caused by airway narrowing (bronchospasm, mucus). It is a hallmark of asthma and COPD exacerbations. Crackles indicate fluid; absent sounds indicate effusion or consolidation."
  },
  {
    domain: "Cardiopulmonary",
    question_text: "A patient with heart failure is prescribed a MET level of 3–4 METs for activity. Which activity falls within this range?",
    option_a: "Walking at 2 mph on a level surface",
    option_b: "Light housework (vacuuming)",
    option_c: "Jogging at 5 mph",
    option_d: "Climbing two flights of stairs quickly",
    correct_option_index: 1,
    rationale: "Light housework such as vacuuming is approximately 3–4 METs. Walking at 2 mph is ~2.5 METs. Jogging at 5 mph is ~8 METs. Climbing stairs rapidly is 6–8 METs. MET prescription guides safe activity selection."
  },
  {
    domain: "Cardiopulmonary",
    question_text: "Which intervention is most appropriate for a patient with ineffective cough due to diaphragmatic weakness post-SCI?",
    option_a: "Incentive spirometry alone",
    option_b: "Manually assisted cough (quad cough)",
    option_c: "Postural drainage in supine",
    option_d: "Pursed-lip breathing",
    correct_option_index: 1,
    rationale: "Manual assisted cough (quad cough) involves the therapist applying manual pressure to the upper abdomen during the expulsive phase of coughing, augmenting expiratory force in patients with weak abdominals (e.g., cervical/thoracic SCI)."
  },

  // ── INTEGUMENTARY (10) ────────────────────────────────────────────────────
  {
    domain: "Integumentary",
    question_text: "A pressure injury with full-thickness skin loss exposing subcutaneous fat but not fascia, muscle, or bone is classified as:",
    option_a: "Stage 1",
    option_b: "Stage 2",
    option_c: "Stage 3",
    option_d: "Stage 4",
    correct_option_index: 2,
    rationale: "Stage 3 pressure injury: full-thickness skin loss. Subcutaneous fat may be visible but bone, tendon, and muscle are not exposed. Depth varies by anatomical location. Stage 2 involves partial-thickness skin loss."
  },
  {
    domain: "Integumentary",
    question_text: "The rule of nines estimates burn surface area. What percentage does the entire right arm represent?",
    option_a: "18%",
    option_b: "4.5%",
    option_c: "9%",
    option_d: "1%",
    correct_option_index: 2,
    rationale: "In the rule of nines, each arm = 9%, the head = 9%, each leg = 18%, the trunk (front) = 18%, the trunk (back) = 18%, and the perineum = 1%, totaling 100%."
  },
  {
    domain: "Integumentary",
    question_text: "Hypertrophic scar formation is best prevented after a burn by:",
    option_a: "Keeping the wound moist with saline dressings only",
    option_b: "Early application of compression garments once the wound is closed",
    option_c: "Avoiding all stretching for 6 months",
    option_d: "Massage with petroleum jelly only",
    correct_option_index: 1,
    rationale: "Custom compression garments (20–25 mmHg) applied once the wound is closed (or >15 days post-burn) are the standard of care for hypertrophic scar prevention. They flatten and soften scars by reducing collagen overproduction."
  },
  {
    domain: "Integumentary",
    question_text: "Which wound characteristic indicates the presence of infection?",
    option_a: "Granulation tissue formation",
    option_b: "Serosanguineous drainage",
    option_c: "Purulent drainage with increased pain and periwound erythema",
    option_d: "Wound contraction",
    correct_option_index: 2,
    rationale: "Signs of wound infection include purulent (pus-like) exudate, increased periwound erythema/warmth, increased pain, malodor, and failure to progress. Granulation tissue and wound contraction are signs of normal healing."
  },
  {
    domain: "Integumentary",
    question_text: "Which debridement method is most selective for necrotic tissue only (removes necrotic without harming viable tissue)?",
    option_a: "Sharp/surgical debridement",
    option_b: "Wet-to-dry dressing",
    option_c: "Enzymatic debridement",
    option_d: "Autolytic debridement",
    correct_option_index: 3,
    rationale: "Autolytic debridement uses moisture-retentive dressings to allow the body's own enzymes (proteases, macrophages) to selectively liquefy necrotic tissue while leaving viable tissue intact. It is the most selective method but the slowest."
  },
  {
    domain: "Integumentary",
    question_text: "Which position should a patient with a heel pressure ulcer avoid to protect the wound?",
    option_a: "Supine with heel elevated off the mattress",
    option_b: "Supine with heel in contact with the mattress",
    option_c: "Side-lying at 30° tilt",
    option_d: "Sitting with legs elevated",
    correct_option_index: 1,
    rationale: "Direct contact of a heel ulcer with the mattress maintains pressure on the wound and impedes healing. Heels should be elevated ('floated') using a pillow or heel-offloading device. The 30° side-lying position avoids trochanteric pressure."
  },
  {
    domain: "Integumentary",
    question_text: "A moist wound environment promotes healing primarily by:",
    option_a: "Preventing all bacterial growth",
    option_b: "Facilitating cell migration and maintaining growth factors at the wound surface",
    option_c: "Increasing tensile strength of scar tissue",
    option_d: "Reducing blood flow to the wound",
    correct_option_index: 1,
    rationale: "Moist wound healing accelerates epithelialization and cell migration, maintains bioactive growth factors at the wound surface, reduces pain, and decreases scar formation compared to dry healing."
  },
  {
    domain: "Integumentary",
    question_text: "Which finding in a diabetic foot wound warrants immediate medical referral?",
    option_a: "Callus formation around the wound",
    option_b: "Shallow wound with serous drainage and granulation tissue",
    option_c: "Exposed bone, joint, or tendon at the wound base",
    option_d: "Wound measuring 2×2 cm",
    correct_option_index: 2,
    rationale: "Exposed bone, joint, or tendon indicates a full-thickness wound with potential for osteomyelitis (bone infection). This requires urgent medical/surgical referral. Bone probe test (direct probing to bone) is highly predictive of osteomyelitis."
  },
  {
    domain: "Integumentary",
    question_text: "Venous insufficiency ulcers are typically located:",
    option_a: "On the plantar surface of the foot (pressure points)",
    option_b: "At the tips of the toes",
    option_c: "On the gaiter area (medial malleolus and lower leg)",
    option_d: "On the posterior heel",
    correct_option_index: 2,
    rationale: "Venous ulcers typically occur in the 'gaiter area' (lower medial leg around the medial malleolus) due to venous hypertension and chronic venous insufficiency. They have irregular edges, shallow depth, and heavy drainage."
  },
  {
    domain: "Integumentary",
    question_text: "Ankle-brachial index (ABI) of 0.5 indicates:",
    option_a: "Normal arterial perfusion",
    option_b: "Mild arterial insufficiency",
    option_c: "Moderate to severe arterial disease — compression therapy contraindicated",
    option_d: "Venous disease only",
    correct_option_index: 2,
    rationale: "ABI 0.9–1.3 = normal. ABI 0.7–0.89 = mild PAD. ABI 0.5–0.69 = moderate PAD. ABI < 0.5 = severe PAD. Compression bandaging is contraindicated when ABI < 0.8 (or < 0.6 by some guidelines) due to risk of ischemia."
  },

  // ── OTHER SYSTEMS (15) ────────────────────────────────────────────────────
  {
    domain: "Other Systems",
    question_text: "A patient with Type 1 diabetes reports feeling shaky and sweaty during exercise. Blood glucose is confirmed at 60 mg/dL. The FIRST action should be:",
    option_a: "Administer insulin",
    option_b: "Have the patient consume 15–20 g of fast-acting carbohydrates",
    option_c: "Call 911 immediately",
    option_d: "Have the patient continue exercising at a lower intensity",
    correct_option_index: 1,
    rationale: "For mild hypoglycemia (BG 54–70 mg/dL with symptoms), the 15-15 rule applies: give 15 g of fast-acting carbs (4 oz juice, glucose tablets), wait 15 minutes, recheck. Continue exercise only once BG > 100 mg/dL."
  },
  {
    domain: "Other Systems",
    question_text: "Which laboratory value, if elevated, suggests active systemic inflammation or infection?",
    option_a: "Hemoglobin A1c (HbA1c)",
    option_b: "Serum creatinine",
    option_c: "C-reactive protein (CRP)",
    option_d: "Albumin",
    correct_option_index: 2,
    rationale: "CRP is an acute-phase protein produced by the liver in response to inflammation. Elevated CRP indicates active infection, inflammatory disease (RA, IBD), or tissue injury. It is a non-specific but sensitive marker."
  },
  {
    domain: "Other Systems",
    question_text: "A patient with rheumatoid arthritis should avoid prolonged positioning in which joint position?",
    option_a: "Neutral wrist with fingers extended",
    option_b: "Full elbow extension",
    option_c: "Ulnar deviation of the wrist and MCP flexion",
    option_d: "Hip abduction in neutral rotation",
    correct_option_index: 2,
    rationale: "Ulnar drift (deviation) and MCP flexion are the pathological deformity directions in RA. Patients should avoid prolonged positioning that encourages ulnar deviation and MCP flexion to prevent deformity progression."
  },
  {
    domain: "Other Systems",
    question_text: "During pregnancy, which exercise position should be avoided after the first trimester due to potential compression of the inferior vena cava?",
    option_a: "Side-lying on the left",
    option_b: "Standing",
    option_c: "Supine",
    option_d: "Sitting upright",
    correct_option_index: 2,
    rationale: "After the first trimester, the gravid uterus can compress the inferior vena cava in supine position, reducing venous return and causing supine hypotensive syndrome. Left side-lying is the preferred position as it relieves IVC compression."
  },
  {
    domain: "Other Systems",
    question_text: "Which lymphedema treatment component is considered the foundation of Complete Decongestive Therapy (CDT)?",
    option_a: "Diuretics",
    option_b: "Manual lymphatic drainage (MLD) combined with compression bandaging, exercise, and skin care",
    option_c: "Elevation alone",
    option_d: "Sequential pneumatic compression pump only",
    correct_option_index: 1,
    rationale: "CDT (Complete Decongestive Therapy) consists of 4 components: Manual Lymphatic Drainage (MLD), multilayer compression bandaging, remedial exercises, and meticulous skin/nail care. It is the gold-standard treatment for lymphedema."
  },
  {
    domain: "Other Systems",
    question_text: "A patient with cancer is undergoing chemotherapy. Which finding is a CONTRAINDICATION to vigorous exercise?",
    option_a: "Platelet count of 150,000/μL",
    option_b: "Hemoglobin of 12 g/dL",
    option_c: "Platelet count < 50,000/μL",
    option_d: "Resting HR of 80 bpm",
    correct_option_index: 2,
    rationale: "Platelet count < 50,000/μL indicates significant thrombocytopenia, posing a major bleeding risk with vigorous exercise. Exercise should be modified to low-intensity, non-contact activities. Below 25,000/μL, no exercise is recommended."
  },
  {
    domain: "Other Systems",
    question_text: "The primary goal of pelvic floor physical therapy for stress urinary incontinence is:",
    option_a: "Bladder retraining to increase voiding intervals",
    option_b: "Strengthening pelvic floor muscles to improve urethral closure during increased abdominal pressure",
    option_c: "Reducing bladder urgency with behavioral techniques",
    option_d: "Stretching pelvic floor muscles to reduce tension",
    correct_option_index: 1,
    rationale: "Stress UI occurs with increased intra-abdominal pressure (coughing, sneezing, exercise). Treatment focuses on pelvic floor muscle (Kegel) strengthening to improve urethral closure pressure. Bladder retraining targets urgency UI."
  },
  {
    domain: "Other Systems",
    question_text: "Fibromyalgia is characterized by which primary diagnostic criterion?",
    option_a: "Joint swelling and elevated inflammatory markers",
    option_b: "Widespread musculoskeletal pain for ≥ 3 months with fatigue and cognitive symptoms",
    option_c: "Point tenderness at 11 of 18 specific trigger points (2010 criteria)",
    option_d: "Bony erosions visible on X-ray",
    correct_option_index: 1,
    rationale: "2016 ACR criteria for fibromyalgia: widespread pain index ≥ 7 + symptom severity score ≥ 5 (or WPI 4–6 + SSS ≥ 9), symptoms present ≥ 3 months, and no other condition explaining the pain. The older 18-tender-point criteria is no longer primary."
  },
  {
    domain: "Other Systems",
    question_text: "Which is the preferred first-line exercise for patients with osteoarthritis of the knee?",
    option_a: "Running on concrete",
    option_b: "Low-impact aerobic exercise and quadriceps strengthening",
    option_c: "Prolonged static stretching only",
    option_d: "Bed rest with analgesics",
    correct_option_index: 1,
    rationale: "Evidence strongly supports low-impact aerobic exercise (walking, cycling, aquatic therapy) combined with quadriceps strengthening for knee OA. Strong quads reduce joint load. Exercise is recommended over inactivity regardless of pain level."
  },
  {
    domain: "Other Systems",
    question_text: "A patient with ankylosing spondylitis will most likely present with:",
    option_a: "Low back pain that worsens with activity and improves with rest",
    option_b: "Low back pain that improves with activity and worsens with prolonged inactivity/morning stiffness",
    option_c: "Cervical radiculopathy as the primary complaint",
    option_d: "Symmetric joint destruction in the hands",
    correct_option_index: 1,
    rationale: "Ankylosing spondylitis is a seronegative spondyloarthropathy with inflammatory back pain: worse with inactivity (prolonged sitting, morning), better with movement and exercise. This distinguishes it from mechanical low back pain."
  },
  {
    domain: "Other Systems",
    question_text: "Which laboratory finding would prompt a physical therapist to modify or postpone an exercise session for a patient with cancer?",
    option_a: "WBC of 7,000/μL",
    option_b: "Hemoglobin of 8 g/dL",
    option_c: "Platelet count of 200,000/μL",
    option_d: "Albumin of 3.8 g/dL",
    correct_option_index: 1,
    rationale: "Hemoglobin < 8 g/dL (severe anemia) significantly impairs oxygen-carrying capacity and can cause dangerous cardiovascular stress during exercise. Exercise should be modified to minimal intensity or postponed."
  },
  {
    domain: "Other Systems",
    question_text: "Gout most commonly affects which joint in the initial presentation?",
    option_a: "Knee",
    option_b: "Ankle",
    option_c: "First metatarsophalangeal (MTP) joint",
    option_d: "Wrist",
    correct_option_index: 2,
    rationale: "Gout (podagra) classically presents with acute, severe inflammation of the first MTP joint. Uric acid crystals deposit in cooler peripheral joints. During an acute flare, the joint is red, hot, swollen, and exquisitely tender."
  },
  {
    domain: "Other Systems",
    question_text: "The primary purpose of using compression stockings in a patient with chronic venous insufficiency is to:",
    option_a: "Reduce arterial blood flow to the extremity",
    option_b: "Increase venous return by reducing superficial venous pressure",
    option_c: "Prevent blood clots in deep veins",
    option_d: "Reduce lymphedema drainage",
    correct_option_index: 1,
    rationale: "Compression stockings apply graduated external pressure (highest at ankle, decreasing proximally) to reduce superficial venous pressure, decrease reflux, and improve venous return in chronic venous insufficiency."
  },
  {
    domain: "Other Systems",
    question_text: "Which exercise guideline recommendation applies to pregnant women without contraindications?",
    option_a: "Avoid all exercise throughout pregnancy",
    option_b: "Limit exercise to 10 minutes per day",
    option_c: "Aim for ≥ 150 minutes per week of moderate-intensity aerobic activity",
    option_d: "Exercise only in the first trimester",
    correct_option_index: 2,
    rationale: "ACOG (2020) recommends ≥ 150 min/week of moderate-intensity aerobic activity during pregnancy for women without contraindications, distributed over most days. Benefits include reduced gestational diabetes, hypertension, and excessive weight gain."
  },
  {
    domain: "Other Systems",
    question_text: "A patient has a positive straight leg raise (SLR) test at 40° of hip flexion. This most likely indicates:",
    option_a: "Hip flexor tightness",
    option_b: "Sciatic nerve tension or lumbar disc herniation at L4–S1",
    option_c: "Hamstring tightness only",
    option_d: "Sacroiliac joint dysfunction",
    correct_option_index: 1,
    rationale: "A positive SLR (symptom reproduction below 70° with pain radiating below the knee) suggests lumbar disc herniation compressing a lumbar nerve root (L4, L5, or S1), causing sciatic nerve tension. Symptoms below 40° are highly specific."
  },

  // ── NON-SYSTEMS (10) ─────────────────────────────────────────────────────
  {
    domain: "Non-Systems",
    question_text: "A physical therapist suspects elder abuse during a home visit. What is the FIRST appropriate action?",
    option_a: "Confront the suspected abuser directly",
    option_b: "Document observations and report to the appropriate adult protective services agency",
    option_c: "Discharge the patient from PT services",
    option_d: "Contact the patient's insurance company",
    correct_option_index: 1,
    rationale: "Physical therapists are mandatory reporters in most jurisdictions. The first action is to document objective findings (injuries, patient statements) and report to Adult Protective Services (APS). Do not confront the abuser as it may endanger the patient."
  },
  {
    domain: "Non-Systems",
    question_text: "Which evidence level is considered the highest quality in the evidence-based practice hierarchy?",
    option_a: "Expert opinion and case reports",
    option_b: "Randomized controlled trial (RCT)",
    option_c: "Systematic review or meta-analysis of RCTs",
    option_d: "Cohort study",
    correct_option_index: 2,
    rationale: "The evidence hierarchy (highest to lowest): systematic review/meta-analysis of RCTs > individual RCTs > cohort studies > case-control studies > case series/reports > expert opinion. Systematic reviews synthesize multiple RCTs for the strongest evidence."
  },
  {
    domain: "Non-Systems",
    question_text: "A patient refuses a recommended physical therapy intervention. The therapist should FIRST:",
    option_a: "Proceed with the intervention regardless",
    option_b: "Discharge the patient from care",
    option_c: "Respect the patient's autonomy and explore their concerns, then provide education about the risks of refusal",
    option_d: "Contact the physician to override the patient's decision",
    correct_option_index: 2,
    rationale: "Patient autonomy is a foundational ethical principle. The therapist must respect the right to refuse, explore the patient's concerns, provide informed information about risks of refusal, and document the conversation. Proceeding without consent is battery."
  },
  {
    domain: "Non-Systems",
    question_text: "Under HIPAA, protected health information (PHI) can be shared WITHOUT patient authorization in which situation?",
    option_a: "Sharing with the patient's employer at their request",
    option_b: "For treatment, payment, and healthcare operations purposes",
    option_c: "For marketing a pharmaceutical product",
    option_d: "Sharing with family members without the patient's knowledge",
    correct_option_index: 1,
    rationale: "HIPAA allows disclosure of PHI without authorization for: Treatment (sharing with other providers), Payment (billing insurers), and Healthcare Operations (quality review, training). Marketing, employer disclosure, and family disclosure generally require authorization."
  },
  {
    domain: "Non-Systems",
    question_text: "Which documentation should a physical therapist complete to support medical necessity for continued skilled PT services?",
    option_a: "Initial evaluation only",
    option_b: "Progress notes demonstrating objective functional improvement tied to skilled interventions",
    option_c: "Discharge summary",
    option_d: "Referral from the physician",
    correct_option_index: 1,
    rationale: "Medical necessity requires documentation that skilled PT services are required (not services a non-skilled person could perform), that the patient is making functional progress, and that the goals are realistic and time-limited. Progress notes quantify improvement."
  },
  {
    domain: "Non-Systems",
    question_text: "The standard of care for a physical therapist is defined by:",
    option_a: "What the individual therapist personally believes is appropriate",
    option_b: "What a reasonably competent therapist with similar training would do in the same circumstances",
    option_c: "The highest possible level of care available anywhere",
    option_d: "Only what insurance companies reimburse",
    correct_option_index: 1,
    rationale: "Standard of care is the care that a reasonably competent, similarly trained clinician would provide in the same clinical circumstances. Deviation from this standard in a way that causes harm constitutes negligence (malpractice)."
  },
  {
    domain: "Non-Systems",
    question_text: "A physical therapist aide may perform which of the following tasks under appropriate supervision?",
    option_a: "Performing an initial evaluation",
    option_b: "Modifying a plan of care",
    option_c: "Applying a hot pack to a patient as directed by the supervising PT",
    option_d: "Making independent clinical decisions about treatment",
    correct_option_index: 2,
    rationale: "PT aides are non-licensed support personnel who may perform non-clinical tasks and routine support duties (e.g., applying hot/cold packs, setting up equipment) under direct supervision of a PT. They may NOT evaluate, modify plans, or make clinical decisions."
  },
  {
    domain: "Non-Systems",
    question_text: "Sensitivity of a clinical test refers to:",
    option_a: "The probability that a test is positive when the disease is absent",
    option_b: "The probability that a test is positive when the disease is present (true positive rate)",
    option_c: "The probability that a test is negative when the disease is absent",
    option_d: "The overall accuracy of the test",
    correct_option_index: 1,
    rationale: "Sensitivity = TP / (TP + FN) — the ability of a test to correctly identify those WITH the condition. A highly sensitive test has few false negatives; a negative result on a sensitive test rules out the disease (SnNout)."
  },
  {
    domain: "Non-Systems",
    question_text: "Which outcome measure is considered a patient-reported outcome measure (PROM) for low back pain?",
    option_a: "Numeric Pain Rating Scale (NPRS) and Oswestry Disability Index (ODI)",
    option_b: "Lumbar active ROM measurements",
    option_c: "Prone hip extension test",
    option_d: "Modified Schober test",
    correct_option_index: 0,
    rationale: "PROMs capture the patient's perspective on their condition. The NPRS (pain intensity) and ODI (disability) are widely validated PROMs for low back pain. ROM, Schober test, and hip extension test are clinician-administered measures."
  },
  {
    domain: "Non-Systems",
    question_text: "Informed consent for a physical therapy procedure requires that the patient be given information about:",
    option_a: "The cost of the procedure only",
    option_b: "The nature of the procedure, expected benefits, risks, alternatives, and the right to refuse",
    option_c: "Only the expected benefits",
    option_d: "The therapist's professional credentials",
    correct_option_index: 1,
    rationale: "Informed consent requires disclosure of: (1) the nature of the proposed intervention, (2) expected benefits, (3) material risks, (4) reasonable alternatives, and (5) the right to refuse or withdraw. This allows autonomous, informed decision-making."
  }
];

module.exports = { QUESTIONS };
