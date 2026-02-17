/* MindPrint — Assessment Engine */
(function () {
  "use strict";

  /* ============================================================
     INSTRUMENT DEFINITIONS
     ============================================================ */

  const LIKERT_03 = [
    { value: 0, label: "Not at all" },
    { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" },
    { value: 3, label: "Nearly every day" }
  ];

  const LIKERT_04 = [
    { value: 0, label: "Not at all" },
    { value: 1, label: "A little bit" },
    { value: 2, label: "Moderately" },
    { value: 3, label: "Quite a bit" },
    { value: 4, label: "Extremely" }
  ];

  const LIKERT_04_STRESS = [
    { value: 0, label: "Never" },
    { value: 1, label: "Almost never" },
    { value: 2, label: "Sometimes" },
    { value: 3, label: "Fairly often" },
    { value: 4, label: "Very often" }
  ];

  const LIKERT_02 = [
    { value: 0, label: "Not bothered at all" },
    { value: 1, label: "Bothered a little" },
    { value: 2, label: "Bothered a lot" }
  ];

  const YESNO = [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" }
  ];

  const ASRS_SCALE = [
    { value: 0, label: "Never" },
    { value: 1, label: "Rarely" },
    { value: 2, label: "Sometimes" },
    { value: 3, label: "Often" },
    { value: 4, label: "Very often" }
  ];

  /* ---------- PHQ-9 ---------- */
  const PHQ9 = {
    id: "phq9", name: "PHQ-9", fullName: "Patient Health Questionnaire-9",
    description: "Over the last 2 weeks, how often have you been bothered by the following problems?",
    category: "Depression",
    options: LIKERT_03,
    questions: [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed, or hopeless",
      "Trouble falling or staying asleep, or sleeping too much",
      "Feeling tired or having little energy",
      "Poor appetite or overeating",
      "Feeling bad about yourself \u2014 or that you are a failure or have let yourself or your family down",
      "Trouble concentrating on things, such as reading the newspaper or watching television",
      "Moving or speaking so slowly that other people could have noticed? Or the opposite \u2014 being so fidgety or restless that you have been moving around a lot more than usual",
      "Thoughts that you would be better off dead, or of hurting yourself in some way"
    ],
    score: function (answers) {
      var total = answers.reduce(function (s, v) { return s + v; }, 0);
      var severity;
      if (total <= 4) severity = "Minimal";
      else if (total <= 9) severity = "Mild";
      else if (total <= 14) severity = "Moderate";
      else if (total <= 19) severity = "Moderately Severe";
      else severity = "Severe";
      return { total: total, max: 27, severity: severity };
    }
  };

  /* ---------- GAD-7 ---------- */
  const GAD7 = {
    id: "gad7", name: "GAD-7", fullName: "Generalized Anxiety Disorder-7",
    description: "Over the last 2 weeks, how often have you been bothered by the following problems?",
    category: "Anxiety",
    options: LIKERT_03,
    questions: [
      "Feeling nervous, anxious, or on edge",
      "Not being able to stop or control worrying",
      "Worrying too much about different things",
      "Trouble relaxing",
      "Being so restless that it is hard to sit still",
      "Becoming easily annoyed or irritable",
      "Feeling afraid, as if something awful might happen"
    ],
    score: function (answers) {
      var total = answers.reduce(function (s, v) { return s + v; }, 0);
      var severity;
      if (total <= 4) severity = "Minimal";
      else if (total <= 9) severity = "Mild";
      else if (total <= 14) severity = "Moderate";
      else severity = "Severe";
      return { total: total, max: 21, severity: severity };
    }
  };

  /* ---------- PCL-5 ---------- */
  const PCL5 = {
    id: "pcl5", name: "PCL-5", fullName: "PTSD Checklist for DSM-5",
    description: "Below is a list of problems that people sometimes have in response to a very stressful experience. In the past month, how much were you bothered by:",
    category: "PTSD",
    options: LIKERT_04,
    questions: [
      "Repeated, disturbing, and unwanted memories of the stressful experience?",
      "Repeated, disturbing dreams of the stressful experience?",
      "Suddenly feeling or acting as if the stressful experience were actually happening again (as if you were actually back there reliving it)?",
      "Feeling very upset when something reminded you of the stressful experience?",
      "Having strong physical reactions when something reminded you of the stressful experience (for example, heart pounding, trouble breathing, sweating)?",
      "Avoiding memories, thoughts, or feelings related to the stressful experience?",
      "Avoiding external reminders of the stressful experience (for example, people, places, conversations, activities, objects, or situations)?",
      "Trouble remembering important parts of the stressful experience?",
      "Having strong negative beliefs about yourself, other people, or the world (for example, having thoughts such as: I am bad, there is something seriously wrong with me, no one can be trusted, the world is completely dangerous)?",
      "Blaming yourself or someone else for the stressful experience or what happened after it?",
      "Having strong negative feelings such as fear, horror, anger, guilt, or shame?",
      "Loss of interest in activities that you used to enjoy?",
      "Feeling distant or cut off from other people?",
      "Trouble experiencing positive feelings (for example, being unable to feel happiness or have loving feelings for people close to you)?",
      "Irritable behavior, angry outbursts, or acting aggressively?",
      "Taking too many risks or doing things that could cause you harm?",
      "Being \u201Csuper-alert\u201D or watchful or on guard?",
      "Feeling jumpy or easily startled?",
      "Having difficulty concentrating?",
      "Trouble falling or staying asleep?"
    ],
    score: function (answers) {
      var total = answers.reduce(function (s, v) { return s + v; }, 0);
      var severity = total >= 31 ? "Positive (suggests PTSD)" : "Negative";
      return { total: total, max: 80, severity: severity, positive: total >= 31 };
    }
  };

  /* ---------- MDQ ---------- */
  const MDQ = {
    id: "mdq", name: "MDQ", fullName: "Mood Disorder Questionnaire",
    description: "Please answer the following questions about experiences you may have had.",
    category: "Bipolar Screening",
    custom: true,
    parts: [
      {
        intro: "Has there ever been a period of time when you were not your usual self and...",
        questions: [
          "you felt so good or so hyper that other people thought you were not your normal self, or you were so hyper that you got into trouble?",
          "you were so irritable that you shouted at people or started fights or arguments?",
          "you felt much more self-confident than usual?",
          "you got much less sleep than usual and found you didn\u2019t really miss it?",
          "you were much more talkative or spoke much faster than usual?",
          "thoughts raced through your head or you couldn\u2019t slow your mind down?",
          "you were so easily distracted by things around you that you had trouble concentrating or staying on track?",
          "you had much more energy than usual?",
          "you were much more active or did many more things than usual?",
          "you were much more social or outgoing than usual; for example, you telephoned friends in the middle of the night?",
          "you were much more interested in sex than usual?",
          "you did things that were unusual for you or that other people might have thought were excessive, foolish, or risky?",
          "spending money got you or your family into trouble?"
        ],
        options: YESNO
      },
      {
        intro: "If you checked YES to more than one of the above:",
        questions: [
          "Have several of these ever happened during the same period of time?"
        ],
        options: YESNO
      },
      {
        intro: "How much of a problem did any of these cause you?",
        questions: [
          "How much of a problem did any of these cause you \u2014 like being unable to work; having family, money, or legal troubles; getting into arguments or fights?"
        ],
        options: [
          { value: 0, label: "No problem" },
          { value: 1, label: "Minor problem" },
          { value: 2, label: "Moderate problem" },
          { value: 3, label: "Serious problem" }
        ]
      }
    ],
    score: function (answers) {
      // answers is flat: [13 yes/no, 1 same-time yes/no, 1 problem level]
      var symptomYes = 0;
      for (var i = 0; i < 13; i++) symptomYes += answers[i];
      var sameTime = answers[13];
      var problemLevel = answers[14];
      var positive = symptomYes >= 7 && sameTime === 1 && problemLevel >= 2;
      return {
        total: symptomYes,
        max: 13,
        severity: positive ? "Positive" : "Negative",
        positive: positive,
        details: { symptomYes: symptomYes, sameTime: sameTime, problemLevel: problemLevel }
      };
    }
  };

  /* ---------- AUDIT ---------- */
  const AUDIT = {
    id: "audit", name: "AUDIT", fullName: "Alcohol Use Disorders Identification Test",
    description: "Please answer the following questions about your alcohol use.",
    category: "Alcohol Use",
    custom: true,
    questions: [
      {
        text: "How often do you have a drink containing alcohol?",
        options: [
          { value: 0, label: "Never" },
          { value: 1, label: "Monthly or less" },
          { value: 2, label: "2\u20134 times a month" },
          { value: 3, label: "2\u20133 times a week" },
          { value: 4, label: "4 or more times a week" }
        ]
      },
      {
        text: "How many drinks containing alcohol do you have on a typical day when you are drinking?",
        options: [
          { value: 0, label: "1 or 2" },
          { value: 1, label: "3 or 4" },
          { value: 2, label: "5 or 6" },
          { value: 3, label: "7 to 9" },
          { value: 4, label: "10 or more" }
        ]
      },
      {
        text: "How often do you have 6 or more drinks on one occasion?",
        options: [
          { value: 0, label: "Never" },
          { value: 1, label: "Less than monthly" },
          { value: 2, label: "Monthly" },
          { value: 3, label: "Weekly" },
          { value: 4, label: "Daily or almost daily" }
        ]
      },
      {
        text: "How often during the last year have you found that you were not able to stop drinking once you had started?",
        options: [
          { value: 0, label: "Never" },
          { value: 1, label: "Less than monthly" },
          { value: 2, label: "Monthly" },
          { value: 3, label: "Weekly" },
          { value: 4, label: "Daily or almost daily" }
        ]
      },
      {
        text: "How often during the last year have you failed to do what was normally expected of you because of drinking?",
        options: [
          { value: 0, label: "Never" },
          { value: 1, label: "Less than monthly" },
          { value: 2, label: "Monthly" },
          { value: 3, label: "Weekly" },
          { value: 4, label: "Daily or almost daily" }
        ]
      },
      {
        text: "How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?",
        options: [
          { value: 0, label: "Never" },
          { value: 1, label: "Less than monthly" },
          { value: 2, label: "Monthly" },
          { value: 3, label: "Weekly" },
          { value: 4, label: "Daily or almost daily" }
        ]
      },
      {
        text: "How often during the last year have you had a feeling of guilt or remorse after drinking?",
        options: [
          { value: 0, label: "Never" },
          { value: 1, label: "Less than monthly" },
          { value: 2, label: "Monthly" },
          { value: 3, label: "Weekly" },
          { value: 4, label: "Daily or almost daily" }
        ]
      },
      {
        text: "How often during the last year have you been unable to remember what happened the night before because of your drinking?",
        options: [
          { value: 0, label: "Never" },
          { value: 1, label: "Less than monthly" },
          { value: 2, label: "Monthly" },
          { value: 3, label: "Weekly" },
          { value: 4, label: "Daily or almost daily" }
        ]
      },
      {
        text: "Have you or someone else been injured because of your drinking?",
        options: [
          { value: 0, label: "No" },
          { value: 2, label: "Yes, but not in the last year" },
          { value: 4, label: "Yes, during the last year" }
        ]
      },
      {
        text: "Has a relative, friend, doctor, or other health care worker been concerned about your drinking or suggested you cut down?",
        options: [
          { value: 0, label: "No" },
          { value: 2, label: "Yes, but not in the last year" },
          { value: 4, label: "Yes, during the last year" }
        ]
      }
    ],
    score: function (answers) {
      var total = answers.reduce(function (s, v) { return s + v; }, 0);
      var severity;
      if (total <= 7) severity = "Low Risk";
      else if (total <= 15) severity = "Hazardous";
      else if (total <= 19) severity = "Harmful";
      else severity = "Possible Dependence";
      return { total: total, max: 40, severity: severity };
    }
  };

  /* ---------- ASRS v1.1 ---------- */
  const ASRS = {
    id: "asrs", name: "ASRS v1.1", fullName: "Adult ADHD Self-Report Scale (Part A)",
    description: "Please answer the questions below about how you have felt and conducted yourself over the past 6 months.",
    category: "ADHD Screening",
    options: ASRS_SCALE,
    questions: [
      "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
      "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
      "How often do you have problems remembering appointments or obligations?",
      "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
      "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
      "How often do you feel overly active and compelled to do things, like you were driven by a motor?"
    ],
    // Shaded thresholds per question: q1-3 threshold >= 2 (Sometimes), q4-6 threshold >= 3 (Often)
    shadedThresholds: [2, 2, 2, 3, 3, 3],
    score: function (answers) {
      var shaded = 0;
      var thresholds = this.shadedThresholds;
      for (var i = 0; i < answers.length; i++) {
        if (answers[i] >= thresholds[i]) shaded++;
      }
      var total = answers.reduce(function (s, v) { return s + v; }, 0);
      var positive = shaded >= 4;
      return {
        total: total, max: 24, severity: positive ? "Positive" : "Negative",
        positive: positive, shaded: shaded
      };
    }
  };

  /* ---------- ISI ---------- */
  const ISI = {
    id: "isi", name: "ISI", fullName: "Insomnia Severity Index",
    description: "Please rate the current (i.e., last 2 weeks) severity of your insomnia problem(s).",
    category: "Insomnia",
    questions: [
      {
        text: "Difficulty falling asleep",
        options: [{ value: 0, label: "None" }, { value: 1, label: "Mild" }, { value: 2, label: "Moderate" }, { value: 3, label: "Severe" }, { value: 4, label: "Very severe" }]
      },
      {
        text: "Difficulty staying asleep",
        options: [{ value: 0, label: "None" }, { value: 1, label: "Mild" }, { value: 2, label: "Moderate" }, { value: 3, label: "Severe" }, { value: 4, label: "Very severe" }]
      },
      {
        text: "Problem waking up too early",
        options: [{ value: 0, label: "None" }, { value: 1, label: "Mild" }, { value: 2, label: "Moderate" }, { value: 3, label: "Severe" }, { value: 4, label: "Very severe" }]
      },
      {
        text: "How satisfied/dissatisfied are you with your current sleep pattern?",
        options: [{ value: 0, label: "Very satisfied" }, { value: 1, label: "Satisfied" }, { value: 2, label: "Neutral" }, { value: 3, label: "Dissatisfied" }, { value: 4, label: "Very dissatisfied" }]
      },
      {
        text: "To what extent do you consider your sleep problem to interfere with your daily functioning (e.g., daytime fatigue, ability to function at work/daily chores, concentration, memory, mood)?",
        options: [{ value: 0, label: "Not at all" }, { value: 1, label: "A little" }, { value: 2, label: "Somewhat" }, { value: 3, label: "Much" }, { value: 4, label: "Very much" }]
      },
      {
        text: "How noticeable to others do you think your sleep problem is in terms of impairing the quality of your life?",
        options: [{ value: 0, label: "Not at all" }, { value: 1, label: "A little" }, { value: 2, label: "Somewhat" }, { value: 3, label: "Much" }, { value: 4, label: "Very much" }]
      },
      {
        text: "How worried/distressed are you about your current sleep problem?",
        options: [{ value: 0, label: "Not at all" }, { value: 1, label: "A little" }, { value: 2, label: "Somewhat" }, { value: 3, label: "Much" }, { value: 4, label: "Very much" }]
      }
    ],
    custom: true,
    score: function (answers) {
      var total = answers.reduce(function (s, v) { return s + v; }, 0);
      var severity;
      if (total <= 7) severity = "None";
      else if (total <= 14) severity = "Subthreshold";
      else if (total <= 21) severity = "Moderate";
      else severity = "Severe";
      return { total: total, max: 28, severity: severity };
    }
  };

  /* ---------- PHQ-15 ---------- */
  const PHQ15 = {
    id: "phq15", name: "PHQ-15", fullName: "Patient Health Questionnaire-15 (Somatic Symptoms)",
    description: "During the last 4 weeks, how much have you been bothered by any of the following problems?",
    category: "Somatic Symptoms",
    options: LIKERT_02,
    questions: [
      "Stomach pain",
      "Back pain",
      "Pain in your arms, legs, or joints (knees, hips, etc.)",
      "Menstrual cramps or other problems with your periods (women only; mark \u201CNot bothered\u201D if not applicable)",
      "Headaches",
      "Chest pain",
      "Dizziness",
      "Fainting spells",
      "Feeling your heart pound or race",
      "Shortness of breath",
      "Pain or problems during sexual intercourse",
      "Constipation, loose bowels, or diarrhea",
      "Nausea, gas, or indigestion",
      "Feeling tired or having low energy",
      "Trouble sleeping"
    ],
    score: function (answers) {
      var total = answers.reduce(function (s, v) { return s + v; }, 0);
      var severity;
      if (total <= 4) severity = "Minimal";
      else if (total <= 9) severity = "Low";
      else if (total <= 14) severity = "Medium";
      else severity = "High";
      return { total: total, max: 30, severity: severity };
    }
  };

  /* ---------- PSS-10 ---------- */
  const PSS10 = {
    id: "pss10", name: "PSS-10", fullName: "Perceived Stress Scale-10",
    description: "In the last month, how often have you...",
    category: "Perceived Stress",
    options: LIKERT_04_STRESS,
    questions: [
      "been upset because of something that happened unexpectedly?",
      "felt that you were unable to control the important things in your life?",
      "felt nervous and stressed?",
      "felt confident about your ability to handle your personal problems?",
      "felt that things were going your way?",
      "found that you could not cope with all the things that you had to do?",
      "been able to control irritations in your life?",
      "felt that you were on top of things?",
      "been angered because of things that were outside of your control?",
      "felt difficulties were piling up so high that you could not overcome them?"
    ],
    // Items 4, 5, 7, 8 (0-indexed: 3,4,6,7) are reverse scored
    reverseItems: [3, 4, 6, 7],
    score: function (answers) {
      var scored = answers.slice();
      var rev = this.reverseItems;
      for (var i = 0; i < rev.length; i++) {
        scored[rev[i]] = 4 - scored[rev[i]];
      }
      var total = scored.reduce(function (s, v) { return s + v; }, 0);
      var severity;
      if (total <= 13) severity = "Low";
      else if (total <= 26) severity = "Moderate";
      else severity = "High";
      return { total: total, max: 40, severity: severity };
    }
  };

  /* ---------- C-SSRS Screener ---------- */
  const CSSRS = {
    id: "cssrs", name: "C-SSRS", fullName: "Columbia Suicide Severity Rating Scale (Screener)",
    description: "Please answer the following questions honestly. Your safety is important.",
    category: "Suicide Risk Screening",
    options: YESNO,
    questions: [
      "Have you wished you were dead or wished you could go to sleep and not wake up?",
      "Have you actually had any thoughts of killing yourself?",
      "Have you been thinking about how you might do this?",
      "Have you had these thoughts and had some intention of acting on them?",
      "Have you started to work out or worked out the details of how to kill yourself? Do you intend to carry out this plan?",
      "Have you ever done anything, started to do anything, or prepared to do anything to end your life?"
    ],
    score: function (answers) {
      var anyYes = answers.some(function (v) { return v === 1; });
      return {
        total: answers.reduce(function (s, v) { return s + v; }, 0),
        max: 6,
        severity: anyYes ? "Flag" : "None",
        flag: anyYes
      };
    }
  };

  /* ============================================================
     ALL INSTRUMENTS IN ORDER
     ============================================================ */
  const INSTRUMENTS = [PHQ9, GAD7, PCL5, MDQ, AUDIT, ASRS, ISI, PHQ15, PSS10, CSSRS];

  /* ============================================================
     STATE
     ============================================================ */
  var currentStep = 0; // 0 = patient info, 1-10 = instruments, 11 = review
  var totalSteps = INSTRUMENTS.length + 2; // patient info + instruments + review
  var answers = {}; // keyed by instrument id
  var patientInfo = {};

  // Restore from sessionStorage
  try {
    var saved = sessionStorage.getItem("mindprint_state");
    if (saved) {
      var parsed = JSON.parse(saved);
      currentStep = parsed.currentStep || 0;
      answers = parsed.answers || {};
      patientInfo = parsed.patientInfo || {};
    }
  } catch (e) { /* ignore */ }

  function saveState() {
    try {
      sessionStorage.setItem("mindprint_state", JSON.stringify({
        currentStep: currentStep, answers: answers, patientInfo: patientInfo
      }));
    } catch (e) { /* ignore */ }
  }

  /* ============================================================
     RENDERING
     ============================================================ */
  var main = document.getElementById("assess-main");
  var progressBar = document.getElementById("progress-bar");
  var stepLabel = document.getElementById("step-label");

  function updateProgress() {
    var pct = Math.round((currentStep / (totalSteps - 1)) * 100);
    progressBar.style.width = pct + "%";
    if (currentStep === 0) stepLabel.textContent = "Patient Information";
    else if (currentStep <= INSTRUMENTS.length) stepLabel.textContent = INSTRUMENTS[currentStep - 1].name + " \u2014 " + INSTRUMENTS[currentStep - 1].category;
    else stepLabel.textContent = "Review & Generate Report";
  }

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function renderStep() {
    main.innerHTML = "";
    updateProgress();
    window.scrollTo(0, 0);
    if (currentStep === 0) renderPatientInfo();
    else if (currentStep <= INSTRUMENTS.length) renderInstrument(INSTRUMENTS[currentStep - 1]);
    else renderReview();
  }

  /* --- Patient Info --- */
  function renderPatientInfo() {
    var p = patientInfo;
    var html = '<div class="assess-step active"><div class="container-narrow">' +
      '<h2>Patient Information</h2>' +
      '<p class="step-desc">This information will appear on your report. Nothing is transmitted or stored beyond this browser tab.</p>' +
      '<div class="form-row">' +
      '<div class="form-group"><label for="pi-name">Full Name</label><input id="pi-name" type="text" value="' + esc(p.name || '') + '" placeholder="Your name"></div>' +
      '<div class="form-group"><label for="pi-age">Age</label><input id="pi-age" type="number" min="1" max="120" value="' + esc(p.age || '') + '" placeholder="Age"></div>' +
      '</div>' +
      '<div class="form-group"><label for="pi-gender">Gender</label><select id="pi-gender">' +
      '<option value="">Select...</option>' +
      ['Male', 'Female', 'Non-binary', 'Prefer not to say', 'Other'].map(function (g) {
        return '<option value="' + g + '"' + (p.gender === g ? ' selected' : '') + '>' + g + '</option>';
      }).join('') +
      '</select></div>' +
      '<div class="form-group"><label for="pi-dx">Current Diagnoses (if any)</label><textarea id="pi-dx" placeholder="e.g., Major Depressive Disorder, PTSD...">' + esc(p.diagnoses || '') + '</textarea></div>' +
      '<div class="form-group"><label for="pi-meds">Current Medications (if any)</label><textarea id="pi-meds" placeholder="e.g., Sertraline 100mg daily...">' + esc(p.medications || '') + '</textarea></div>' +
      '<div class="form-group"><label for="pi-history">Brief History (optional)</label><textarea id="pi-history" placeholder="Anything relevant you\'d like your provider to know...">' + esc(p.history || '') + '</textarea></div>' +
      '<div class="assess-nav"><div></div><button class="btn btn-primary" id="btn-next">Next \u2192</button></div>' +
      '</div></div>';
    main.innerHTML = html;
    document.getElementById("btn-next").addEventListener("click", function () {
      patientInfo = {
        name: document.getElementById("pi-name").value.trim(),
        age: document.getElementById("pi-age").value.trim(),
        gender: document.getElementById("pi-gender").value,
        diagnoses: document.getElementById("pi-dx").value.trim(),
        medications: document.getElementById("pi-meds").value.trim(),
        history: document.getElementById("pi-history").value.trim()
      };
      currentStep = 1;
      saveState();
      renderStep();
    });
  }

  /* --- Instrument Renderer --- */
  function renderInstrument(inst) {
    var saved = answers[inst.id] || [];
    var html = '<div class="assess-step active"><div class="container-narrow">';
    html += '<h2>' + esc(inst.name) + ' <span style="font-weight:400;color:var(--gray-400);font-size:.9rem;">\u2014 ' + esc(inst.category) + '</span></h2>';
    html += '<p class="step-desc">' + esc(inst.description) + '</p>';

    // Crisis banner for C-SSRS
    if (inst.id === "cssrs") {
      html += '<div class="crisis-banner" style="margin-bottom:24px"><p><strong>If you are in crisis right now:</strong> Call <a href="tel:988">988</a> (Suicide & Crisis Lifeline) or text HOME to <a href="sms:741741">741741</a></p></div>';
    }

    if (inst.id === "mdq") {
      // Custom MDQ rendering
      var qIdx = 0;
      inst.parts.forEach(function (part, pi) {
        html += '<p style="font-weight:600;margin:24px 0 12px;">' + esc(part.intro) + '</p>';
        part.questions.forEach(function (q, qi) {
          var aKey = qIdx;
          html += renderQuestionCard(qIdx + 1, q, part.options, saved[aKey], "mdq_" + aKey, inst.id === "mdq" && pi === 2);
          qIdx++;
        });
      });
    } else if (inst.id === "audit" || inst.id === "isi") {
      // Custom per-question options
      inst.questions.forEach(function (q, qi) {
        var text = typeof q === "string" ? q : q.text;
        var opts = typeof q === "string" ? inst.options : q.options;
        html += renderQuestionCard(qi + 1, text, opts, saved[qi], inst.id + "_" + qi);
      });
    } else {
      // Standard: same options for all
      inst.questions.forEach(function (q, qi) {
        html += renderQuestionCard(qi + 1, q, inst.options, saved[qi], inst.id + "_" + qi);
      });
    }

    html += '<div class="assess-nav">';
    html += '<button class="btn btn-secondary" id="btn-back">\u2190 Back</button>';
    html += '<button class="btn btn-primary" id="btn-next">Next \u2192</button>';
    html += '</div></div></div>';
    main.innerHTML = html;

    // Wire events
    main.querySelectorAll(".radio-option").forEach(function (el) {
      el.addEventListener("click", function () {
        var name = el.querySelector("input").name;
        main.querySelectorAll('input[name="' + name + '"]').forEach(function (r) {
          r.closest(".radio-option").classList.remove("selected");
        });
        el.classList.add("selected");
        el.querySelector("input").checked = true;
      });
    });

    document.getElementById("btn-back").addEventListener("click", function () {
      collectInstrumentAnswers(inst);
      currentStep--;
      saveState();
      renderStep();
    });

    document.getElementById("btn-next").addEventListener("click", function () {
      if (!collectInstrumentAnswers(inst)) {
        alert("Please answer all questions before continuing.");
        return;
      }
      currentStep++;
      saveState();
      renderStep();
    });
  }

  function renderQuestionCard(num, text, options, savedVal, nameAttr, isSelect) {
    var h = '<div class="question-card">';
    h += '<div class="q-num">Question ' + num + '</div>';
    h += '<div class="q-text">' + esc(text) + '</div>';
    if (options.length <= 5 && !isSelect) {
      h += '<div class="radio-group">';
      options.forEach(function (o) {
        var sel = savedVal !== undefined && savedVal === o.value;
        h += '<div class="radio-option' + (sel ? ' selected' : '') + '">';
        h += '<input type="radio" name="' + nameAttr + '" value="' + o.value + '"' + (sel ? ' checked' : '') + '>';
        h += '<label>' + esc(o.label) + '</label></div>';
      });
      h += '</div>';
    } else {
      h += '<div class="radio-group">';
      options.forEach(function (o) {
        var sel = savedVal !== undefined && savedVal === o.value;
        h += '<div class="radio-option' + (sel ? ' selected' : '') + '">';
        h += '<input type="radio" name="' + nameAttr + '" value="' + o.value + '"' + (sel ? ' checked' : '') + '>';
        h += '<label>' + esc(o.label) + '</label></div>';
      });
      h += '</div>';
    }
    h += '</div>';
    return h;
  }

  function collectInstrumentAnswers(inst) {
    var qCount;
    if (inst.id === "mdq") {
      qCount = 15; // 13 + 1 + 1
    } else {
      qCount = inst.questions.length;
    }
    var collected = [];
    for (var i = 0; i < qCount; i++) {
      var checked = main.querySelector('input[name="' + inst.id + '_' + i + '"]:checked');
      if (!checked) return false;
      collected.push(parseInt(checked.value, 10));
    }
    answers[inst.id] = collected;
    return true;
  }

  /* --- Review & Generate --- */
  function renderReview() {
    var html = '<div class="assess-step active"><div class="container-narrow">';
    html += '<h2>Review & Generate Report</h2>';
    html += '<p class="step-desc">You\u2019ve completed all 10 assessments. Review your information below, then generate your report.</p>';

    html += '<div style="background:var(--green-50);border:1px solid var(--green-500);border-radius:var(--radius-sm);padding:20px;margin-bottom:24px;">';
    html += '<strong style="color:var(--green-700);">\u2705 All assessments complete</strong>';
    html += '<p style="color:var(--green-700);font-size:.9rem;margin-top:4px;">Your responses are stored only in this browser tab and will be cleared when you close it.</p>';
    html += '</div>';

    // Patient info summary
    html += '<h3 style="margin-bottom:12px;">Patient Information</h3>';
    html += '<div class="patient-info-box">';
    html += '<div class="info-item"><label>Name</label><span>' + esc(patientInfo.name || "Not provided") + '</span></div>';
    html += '<div class="info-item"><label>Age</label><span>' + esc(patientInfo.age || "N/A") + '</span></div>';
    html += '<div class="info-item"><label>Gender</label><span>' + esc(patientInfo.gender || "N/A") + '</span></div>';
    if (patientInfo.diagnoses) html += '<div class="info-item info-full"><label>Current Diagnoses</label><span>' + esc(patientInfo.diagnoses) + '</span></div>';
    if (patientInfo.medications) html += '<div class="info-item info-full"><label>Current Medications</label><span>' + esc(patientInfo.medications) + '</span></div>';
    html += '</div>';

    // Instrument summary
    html += '<h3 style="margin:24px 0 12px;">Completed Assessments</h3>';
    INSTRUMENTS.forEach(function (inst) {
      var result = inst.score.call(inst, answers[inst.id]);
      html += '<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--gray-200);font-size:.9rem;">';
      html += '<span>' + esc(inst.name) + ' \u2014 ' + esc(inst.category) + '</span>';
      html += '<span><strong>' + result.total + '/' + result.max + '</strong> (' + esc(result.severity) + ')</span>';
      html += '</div>';
    });

    html += '<div class="assess-nav">';
    html += '<button class="btn btn-secondary" id="btn-back">\u2190 Back</button>';
    html += '<button class="btn btn-success btn-lg" id="btn-generate">\u2728 Generate Report</button>';
    html += '</div></div></div>';
    main.innerHTML = html;

    document.getElementById("btn-back").addEventListener("click", function () {
      currentStep--;
      saveState();
      renderStep();
    });

    document.getElementById("btn-generate").addEventListener("click", function () {
      if (typeof window.generateReport === "function") {
        window.generateReport(patientInfo, answers, INSTRUMENTS);
      }
    });
  }

  /* Expose for report.js */
  window._mindprint = { instruments: INSTRUMENTS, getAnswers: function () { return answers; }, getPatientInfo: function () { return patientInfo; } };

  /* ============================================================
     INIT
     ============================================================ */
  renderStep();

})();
