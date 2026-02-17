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



  /* ---------- PID-5-BF ---------- */
  const PID5BF = {
    id: "pid5bf", name: "PID-5-BF", fullName: "Personality Inventory for DSM-5 Brief Form",
    description: "Please rate how well the following statements describe you in general.",
    category: "Personality Traits",
    options: [
      { value: 0, label: "Very False or Often False" },
      { value: 1, label: "Sometimes or Somewhat False" },
      { value: 2, label: "Sometimes or Somewhat True" },
      { value: 3, label: "Very True or Often True" }
    ],
    questions: [
      "People would describe me as reckless.",
      "I feel like I act totally on impulse.",
      "Even though I know better, I can't stop making rash decisions.",
      "I often feel like nothing I do really matters.",
      "Others see me as irresponsible.",
      "I'm not good at planning ahead.",
      "My thoughts often don't make sense to others.",
      "I worry about almost everything.",
      "I get emotional easily, often for very little reason.",
      "I fear being alone in life more than anything else.",
      "I get stuck on one way of doing things, even when it's clear it won't work.",
      "I have seen things that weren't really there.",
      "I steer clear of romantic relationships.",
      "I'm not interested in making friends.",
      "I get irritated easily by all sorts of things.",
      "I don't like to get too close to people.",
      "It's no big deal if I hurt other people's feelings.",
      "I rarely get enthusiastic about anything.",
      "I crave attention.",
      "I often have to deal with people who are less important than me.",
      "I often have thoughts that make sense to me but that other people say are strange.",
      "I use people to get what I want.",
      "I often feel just miserable.",
      "I keep my distance from people.",
      "I often space out and then suddenly come to and find that a lot of time has passed."
    ],
    // Domains: Negative Affectivity (8,9,10,15,23), Detachment (4,13,14,16,18),
    // Antagonism (17,19,20,22,25-mapped), Disinhibition (1,2,3,5,6), Psychoticism (7,12,21,25,11)
    // Using 0-indexed: NegAff: 7,8,9,14,22; Detach: 3,12,13,15,17; Antag: 16,18,19,21,24; Disinhib: 0,1,2,4,5; Psychot: 6,11,20,23,10
    domains: {
      "Negative Affectivity": [7,8,9,14,22],
      "Detachment": [3,12,13,15,17],
      "Antagonism": [16,18,19,21,24],
      "Disinhibition": [0,1,2,4,5],
      "Psychoticism": [6,10,11,20,23]
    },
    custom: true,
    score: function (answers) {
      var total = answers.reduce(function (s, v) { return s + v; }, 0);
      var domains = this.domains;
      var domainScores = {};
      var domainFlags = [];
      Object.keys(domains).forEach(function (name) {
        var items = domains[name];
        var sum = 0;
        items.forEach(function (i) { sum += answers[i]; });
        var avg = sum / items.length;
        domainScores[name] = { sum: sum, avg: Math.round(avg * 100) / 100 };
        if (avg >= 2) domainFlags.push(name);
      });
      var severity = domainFlags.length === 0 ? "No Clinically Significant Traits" :
        domainFlags.length <= 2 ? "Some Elevated Traits" : "Multiple Elevated Traits";
      return { total: total, max: 75, severity: severity, domainScores: domainScores, domainFlags: domainFlags };
    }
  };

  /* ---------- MSI-BPD ---------- */
  const MSIBPD = {
    id: "msibpd", name: "MSI-BPD", fullName: "McLean Screening Instrument for Borderline Personality Disorder",
    description: "Have you ever experienced any of the following? Please answer Yes or No.",
    category: "Borderline Personality",
    options: YESNO,
    questions: [
      "Have any of your closest relationships been troubled by a lot of arguments or repeated breakups?",
      "Have you deliberately hurt yourself physically (e.g., punched yourself, cut yourself, burned yourself)? How about made a suicide attempt?",
      "Have you had at least two other problems with impulsivity (e.g., eating binges, spending sprees, drinking too much, risky sexual behavior)?",
      "Have you been extremely moody?",
      "Have you felt very angry a lot of the time? How about often acted in an angry or sarcastic manner?",
      "Have you often been distrustful of other people?",
      "Have you frequently felt unreal or as if things around you were unreal?",
      "Have you chronically felt empty?",
      "Have you often felt that you had no idea of who you are or that you have no identity?",
      "Have you made desperate efforts to avoid feeling abandoned or being abandoned (e.g., repeatedly called someone to reassure yourself that he or she still cared, begged them not to leave you, clung to them physically)?"
    ],
    score: function (answers) {
      var total = answers.reduce(function (s, v) { return s + v; }, 0);
      var severity = total >= 7 ? "Positive (suggests BPD)" : "Negative";
      return { total: total, max: 10, severity: severity, positive: total >= 7 };
    }
  };

  /* ---------- LPFS-BF ---------- */
  const LPFSBF = {
    id: "lpfsbf", name: "LPFS-BF", fullName: "Level of Personality Functioning Scale — Brief Form 2.0",
    description: "Please indicate how well the following statements describe you.",
    category: "Personality Functioning",
    options: [
      { value: 1, label: "Totally False" },
      { value: 2, label: "Somewhat False" },
      { value: 3, label: "Somewhat True" },
      { value: 4, label: "Totally True" }
    ],
    questions: [
      "I often don’t know who I really am.",
      "I often think of myself as a failure.",
      "My emotions change without me having a grip on them.",
      "I have no clear idea of what I want to do in my life.",
      "I often don’t understand my own thoughts and feelings.",
      "I often make unreasonable demands on others.",
      "I frequently have difficulty understanding other people’s experiences and motivations.",
      "I generally don’t get along with people very well.",
      "I often feel that other people don’t care about me as much as I care about them.",
      "I often can’t find the right balance between my needs and those of others.",
      "I don’t really know what I want from a relationship.",
      "I often don’t feel like a unique, autonomous person but like a part of others or objects."
    ],
    subscales: {
      "Identity": [0,1,2],
      "Self-direction": [3,4,5],
      "Empathy": [6,7,8],
      "Intimacy": [9,10,11]
    },
    custom: true,
    score: function (answers) {
      var total = answers.reduce(function (s, v) { return s + v; }, 0);
      var subscales = this.subscales;
      var subscaleScores = {};
      Object.keys(subscales).forEach(function (name) {
        var sum = 0;
        subscales[name].forEach(function (i) { sum += answers[i]; });
        subscaleScores[name] = sum;
      });
      var severity;
      if (total < 24) severity = "Low Impairment";
      else if (total < 36) severity = "Moderate Impairment";
      else severity = "Significant Impairment";
      return { total: total, max: 48, severity: severity, subscaleScores: subscaleScores };
    }
  };

  /* ---------- AQ-10 ---------- */
  const AQ10 = {
    id: "aq10", name: "AQ-10", fullName: "Autism Spectrum Quotient-10",
    description: "Please indicate how strongly you agree or disagree with each statement.",
    category: "Autism Screening",
    custom: true,
    questions: [
      { text: "I often notice small sounds when others do not.", score: "agree", options: [
        { value: 0, label: "Definitely Agree" }, { value: 1, label: "Slightly Agree" },
        { value: 2, label: "Slightly Disagree" }, { value: 3, label: "Definitely Disagree" }
      ]},
      { text: "I usually concentrate more on the whole picture, rather than the small details.", score: "disagree", options: [
        { value: 0, label: "Definitely Agree" }, { value: 1, label: "Slightly Agree" },
        { value: 2, label: "Slightly Disagree" }, { value: 3, label: "Definitely Disagree" }
      ]},
      { text: "I find it easy to do more than one thing at once.", score: "disagree", options: [
        { value: 0, label: "Definitely Agree" }, { value: 1, label: "Slightly Agree" },
        { value: 2, label: "Slightly Disagree" }, { value: 3, label: "Definitely Disagree" }
      ]},
      { text: "If there is an interruption, I can switch back to what I was doing very quickly.", score: "disagree", options: [
        { value: 0, label: "Definitely Agree" }, { value: 1, label: "Slightly Agree" },
        { value: 2, label: "Slightly Disagree" }, { value: 3, label: "Definitely Disagree" }
      ]},
      { text: "I find it easy to ‘read between the lines’ when someone is talking to me.", score: "disagree", options: [
        { value: 0, label: "Definitely Agree" }, { value: 1, label: "Slightly Agree" },
        { value: 2, label: "Slightly Disagree" }, { value: 3, label: "Definitely Disagree" }
      ]},
      { text: "I know how to tell if someone listening to me is getting bored.", score: "disagree", options: [
        { value: 0, label: "Definitely Agree" }, { value: 1, label: "Slightly Agree" },
        { value: 2, label: "Slightly Disagree" }, { value: 3, label: "Definitely Disagree" }
      ]},
      { text: "When I’m reading a story, I find it difficult to work out the characters’ intentions.", score: "agree", options: [
        { value: 0, label: "Definitely Agree" }, { value: 1, label: "Slightly Agree" },
        { value: 2, label: "Slightly Disagree" }, { value: 3, label: "Definitely Disagree" }
      ]},
      { text: "I like to collect information about categories of things.", score: "agree", options: [
        { value: 0, label: "Definitely Agree" }, { value: 1, label: "Slightly Agree" },
        { value: 2, label: "Slightly Disagree" }, { value: 3, label: "Definitely Disagree" }
      ]},
      { text: "I find it easy to work out what someone is thinking or feeling just by looking at their face.", score: "disagree", options: [
        { value: 0, label: "Definitely Agree" }, { value: 1, label: "Slightly Agree" },
        { value: 2, label: "Slightly Disagree" }, { value: 3, label: "Definitely Disagree" }
      ]},
      { text: "I find it difficult to work out people’s intentions.", score: "agree", options: [
        { value: 0, label: "Definitely Agree" }, { value: 1, label: "Slightly Agree" },
        { value: 2, label: "Slightly Disagree" }, { value: 3, label: "Definitely Disagree" }
      ]}
    ],
    // Scoring: "agree" items score 1 if Def Agree or Slightly Agree (value 0 or 1)
    // "disagree" items score 1 if Slightly Disagree or Def Disagree (value 2 or 3)
    agreeItems: [0,6,7,9],
    disagreeItems: [1,2,3,4,5,8],
    score: function (answers) {
      var total = 0;
      var agreeItems = this.agreeItems;
      var disagreeItems = this.disagreeItems;
      for (var i = 0; i < answers.length; i++) {
        if (agreeItems.indexOf(i) !== -1) {
          if (answers[i] <= 1) total++;
        } else {
          if (answers[i] >= 2) total++;
        }
      }
      var severity = total >= 6 ? "Referral Indicated" : "Below Threshold";
      return { total: total, max: 10, severity: severity };
    }
  };

  /* ---------- RAADS-14 ---------- */
  const RAADS14 = {
    id: "raads14", name: "RAADS-14", fullName: "Ritvo Autism Asperger Diagnostic Scale-14",
    description: "Choose the response that best describes how each statement applies to you.",
    category: "Autism Screening",
    options: [
      { value: 0, label: "Never true" },
      { value: 1, label: "True only when I was younger than 16" },
      { value: 2, label: "True only now" },
      { value: 3, label: "True now and when I was young" }
    ],
    questions: [
      "It is difficult for me to understand how other people are feeling when we are talking.",
      "Some ordinary textures that do not bother others feel very offensive when they touch my skin.",
      "It is very difficult for me to work and function in groups.",
      "It is difficult to figure out what other people expect of me.",
      "I often don’t know how to act in social situations.",
      "I can chat and make small talk with people.",
      "When I feel overwhelmed by my senses, I have to isolate myself to shut them down.",
      "How to make friends and socialize is a mystery to me.",
      "When talking to someone, I have a hard time telling when it is my turn to talk or to listen.",
      "Sometimes I have to cover my ears to block out painful noises.",
      "It can be very hard to read someone’s face, hand, and body movements when we are talking.",
      "I focus on details rather than the overall idea.",
      "I take things too literally, so I often miss what people are trying to say.",
      "I get extremely upset when the way I like to do things is suddenly changed."
    ],
    // Item 6 (index 5) is reverse scored: 3->0, 2->1, 1->2, 0->3
    reverseItems: [5],
    score: function (answers) {
      var scored = answers.slice();
      this.reverseItems.forEach(function (i) { scored[i] = 3 - scored[i]; });
      var total = scored.reduce(function (s, v) { return s + v; }, 0);
      var severity = total >= 14 ? "Autism Spectrum Likely" : "Below Threshold";
      return { total: total, max: 42, severity: severity };
    }
  };

  /* ---------- CAT-Q ---------- */
  const CATQ = {
    id: "catq", name: "CAT-Q", fullName: "Camouflaging Autistic Traits Questionnaire",
    description: "Please indicate how much you agree or disagree with each statement.",
    category: "Autistic Camouflaging",
    options: [
      { value: 1, label: "Strongly Disagree" },
      { value: 2, label: "Disagree" },
      { value: 3, label: "Somewhat Disagree" },
      { value: 4, label: "Neither Agree nor Disagree" },
      { value: 5, label: "Somewhat Agree" },
      { value: 6, label: "Agree" },
      { value: 7, label: "Strongly Agree" }
    ],
    questions: [
      "When I am interacting with someone, I deliberately copy their body language or facial expressions.",
      "I monitor my body language or facial expressions so that I appear relaxed.",
      "I rarely feel the need to put on an act in order to get through a social situation.",
      "I have developed a script to follow in social situations.",
      "I will repeat phrases that I have heard others say in the exact same way that I first heard them.",
      "I always think about the impression I make on other people.",
      "I need the support of other people in order to socialize.",
      "I practice my facial expressions and body language to make sure they look natural.",
      "I don’t feel the need to make eye contact with other people if I don’t want to.",
      "I have learned to mimic other people’s social behaviour to disguise the fact that I am struggling.",
      "I adjust my body language or facial expressions so that I appear interested by the person I am interacting with.",
      "I have researched the rules of social interactions to improve my own social skills.",
      "I am always aware of the impression I make on other people.",
      "In social situations, I feel like I’m performing rather than being myself.",
      "I try to be as similar as possible to the people around me.",
      "In my own home I often feel free to be myself.",
      "When in social situations, I try to find ways to avoid interacting with others.",
      "I can only relax when I am alone.",
      "I have to force myself to interact with people.",
      "I have spent time learning social skills from television or films and try to use these in my interactions.",
      "In social interactions, I do not pay attention to what my face or body are doing.",
      "I always feel that I am pretending to be normal.",
      "I need to rest or be alone after social situations to ‘recharge’.",
      "I watch and study other people to learn how to do social interactions more naturally.",
      "I use social media to practice and plan my social interactions."
    ],
    // Reverse scored items (0-indexed): 2, 8, 15, 20
    reverseItems: [2, 8, 15, 20],
    subscales: {
      "Compensation": [0,3,4,7,9,11,19,23,24],
      "Masking": [1,5,6,10,12,13,14,20,21],
      "Assimilation": [2,8,15,16,17,18,22]
    },
    custom: true,
    score: function (answers) {
      var scored = answers.slice();
      this.reverseItems.forEach(function (i) { scored[i] = 8 - scored[i]; });
      var total = scored.reduce(function (s, v) { return s + v; }, 0);
      var subscales = this.subscales;
      var subscaleScores = {};
      Object.keys(subscales).forEach(function (name) {
        var sum = 0;
        subscales[name].forEach(function (i) { sum += scored[i]; });
        subscaleScores[name] = sum;
      });
      var severity;
      if (total < 100) severity = "Below Average Camouflaging";
      else if (total < 125) severity = "Moderate Camouflaging";
      else severity = "High Camouflaging";
      return { total: total, max: 175, severity: severity, subscaleScores: subscaleScores };
    }
  };

  /* ---------- OCI-R ---------- */
  const OCIR = {
    id: "ocir", name: "OCI-R", fullName: "Obsessive-Compulsive Inventory — Revised",
    description: "The following statements refer to experiences that many people have in their everyday lives. Rate how much each experience has distressed or bothered you during the past month.",
    category: "OCD Screening",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "A little" },
      { value: 2, label: "Moderately" },
      { value: 3, label: "A lot" },
      { value: 4, label: "Extremely" }
    ],
    questions: [
      "I have saved up so many things that they get in the way.",
      "I check things more often than necessary.",
      "I get upset if objects are not arranged properly.",
      "I feel compelled to count while I am doing things.",
      "I find it difficult to touch an object when I know it has been touched by strangers or certain people.",
      "I find it difficult to control my own thoughts.",
      "I collect things I don’t need.",
      "I repeatedly check doors, windows, drawers, etc.",
      "I get upset if others change the way I have arranged things.",
      "I feel I have to repeat certain numbers.",
      "I sometimes have to wash or clean myself simply because I feel contaminated.",
      "I am upset by unpleasant thoughts that come into my mind against my will.",
      "I avoid throwing things away because I am afraid I might need them later.",
      "I repeatedly check gas and water taps and light switches after turning them off.",
      "I need things to be arranged in a particular order.",
      "I feel that there are good and bad numbers.",
      "I wash my hands more often and longer than necessary.",
      "I frequently get nasty thoughts and have difficulty in getting rid of them."
    ],
    score: function (answers) {
      var total = answers.reduce(function (s, v) { return s + v; }, 0);
      var severity;
      if (total < 21) severity = "Below Clinical Threshold";
      else if (total < 30) severity = "Mild-Moderate OCD Symptoms";
      else severity = "Significant OCD Symptoms";
      return { total: total, max: 72, severity: severity, positive: total >= 21 };
    }
  };

  /* ---------- LSAS ---------- */
  const LSAS = {
    id: "lsas", name: "LSAS", fullName: "Liebowitz Social Anxiety Scale",
    description: "For each situation, rate your FEAR/ANXIETY level and how often you AVOID it.",
    category: "Social Anxiety",
    custom: true,
    situations: [
      "Telephoning in public",
      "Participating in small groups",
      "Eating in public places",
      "Drinking with others in public places",
      "Talking to people in authority",
      "Acting, performing, or giving a talk in front of an audience",
      "Going to a party",
      "Working while being observed",
      "Writing while being observed",
      "Calling someone you don’t know very well",
      "Talking with people you don’t know very well",
      "Meeting strangers",
      "Urinating in a public bathroom",
      "Entering a room when others are already seated",
      "Being the center of attention",
      "Speaking up at a meeting",
      "Taking a written test",
      "Expressing appropriate disagreement or disapproval to people you don’t know very well",
      "Looking at people you don’t know very well in the eyes",
      "Giving a report to a group",
      "Trying to pick up someone",
      "Returning goods to a store",
      "Giving an average party",
      "Resisting a high pressure salesperson"
    ],
    fearOptions: [
      { value: 0, label: "None" },
      { value: 1, label: "Mild" },
      { value: 2, label: "Moderate" },
      { value: 3, label: "Severe" }
    ],
    avoidOptions: [
      { value: 0, label: "Never (0%)" },
      { value: 1, label: "Occasionally (1–33%)" },
      { value: 2, label: "Often (33–67%)" },
      { value: 3, label: "Usually (67–100%)" }
    ],
    questions: [],
    score: function (answers) {
      // answers: [fear0, avoid0, fear1, avoid1, ...]
      var fearTotal = 0, avoidTotal = 0;
      for (var i = 0; i < 48; i += 2) {
        fearTotal += answers[i] || 0;
        avoidTotal += answers[i + 1] || 0;
      }
      var total = fearTotal + avoidTotal;
      var severity;
      if (total < 30) severity = "Not Significant";
      else if (total < 50) severity = "Moderate Social Anxiety";
      else if (total < 65) severity = "Marked Social Anxiety";
      else if (total < 80) severity = "Severe Social Anxiety";
      else severity = "Very Severe Social Anxiety";
      return { total: total, max: 144, severity: severity, fearTotal: fearTotal, avoidTotal: avoidTotal };
    }
  };

  /* ---------- DES-II ---------- */
  const DESII = {
    id: "desii", name: "DES-II", fullName: "Dissociative Experiences Scale-II",
    description: "For each item, indicate what percentage of the time the experience happens to you (0% = Never, 100% = Always). Use the scale to select your answer.",
    category: "Dissociation",
    options: [
      { value: 0, label: "0% — Never" },
      { value: 1, label: "10%" },
      { value: 2, label: "20%" },
      { value: 3, label: "30%" },
      { value: 4, label: "40%" },
      { value: 5, label: "50%" },
      { value: 6, label: "60%" },
      { value: 7, label: "70%" },
      { value: 8, label: "80%" },
      { value: 9, label: "90%" },
      { value: 10, label: "100% — Always" }
    ],
    custom: true,
    questions: [
      "Some people have the experience of driving or riding in a car or bus or subway and suddenly realizing that they don’t remember what has happened during all or part of the trip.",
      "Some people find that sometimes they are listening to someone talk and they suddenly realize that they did not hear part or all of what was said.",
      "Some people have the experience of finding themselves in a place and having no idea how they got there.",
      "Some people have the experience of finding themselves dressed in clothes that they don’t remember putting on.",
      "Some people have the experience of finding new things among their belongings that they do not remember buying.",
      "Some people sometimes find that they are approached by people that they do not know who call them by another name or insist that they have met them before.",
      "Some people sometimes have the experience of feeling as though they are standing next to themselves or watching themselves do something and they actually see themselves as if they were looking at another person.",
      "Some people are told that they sometimes do not recognize friends or family members.",
      "Some people find that they have no memory for some important events in their lives (for example, a wedding or graduation).",
      "Some people have the experience of being accused of lying when they do not think that they have lied.",
      "Some people have the experience of looking in a mirror and not recognizing themselves.",
      "Some people have the experience of feeling that other people, objects, and the world around them are not real.",
      "Some people have the experience of feeling that their body does not seem to belong to them.",
      "Some people have the experience of sometimes remembering a past event so vividly that they feel as if they were reliving that event.",
      "Some people have the experience of not being sure whether things that they remember happening really did happen or whether they just dreamed them.",
      "Some people have the experience of being in a familiar place but finding it strange and unfamiliar.",
      "Some people find that when they are watching television or a movie they become so absorbed in the story that they are unaware of other events happening around them.",
      "Some people find that they become so involved in a fantasy or daydream that it feels as though it were really happening to them.",
      "Some people find that they sometimes are able to ignore pain.",
      "Some people find that they sometimes sit staring off into space, thinking of nothing, and are not aware of the passage of time.",
      "Some people sometimes find that when they are alone they talk out loud to themselves.",
      "Some people find that in one situation they may act so differently compared with another situation that they feel almost as if they were two different people.",
      "Some people sometimes find that in certain situations they are able to do things with amazing ease and spontaneity that would usually be difficult for them.",
      "Some people sometimes find that they cannot remember whether they have done something or have just thought about doing that thing.",
      "Some people find evidence that they have done things that they do not remember doing.",
      "Some people sometimes find writings, drawings, or notes among their belongings that they must have done but cannot remember doing.",
      "Some people sometimes find that they hear voices inside their head that tell them to do things or comment on things that they are doing.",
      "Some people sometimes feel as if they are looking at the world through a fog so that people and objects appear far away or unclear."
    ],
    score: function (answers) {
      var sum = answers.reduce(function (s, v) { return s + v; }, 0);
      var avg = Math.round((sum / answers.length) * 10) / 10; // mapped to 0-100 scale (each unit = 10%)
      var avgPct = Math.round(avg * 10);
      var severity;
      if (avgPct < 15) severity = "Normal Range";
      else if (avgPct < 30) severity = "Mild Dissociation";
      else severity = "Significant Dissociation";
      return { total: avgPct, max: 100, severity: severity, averageScore: avgPct, unit: "%" };
    }
  };

  /* ---------- IES-R ---------- */
  const IESR = {
    id: "iesr", name: "IES-R", fullName: "Impact of Event Scale — Revised",
    description: "Below is a list of difficulties people sometimes have after stressful life events. Please read each item and indicate how distressing each difficulty has been for you during the past 7 days.",
    category: "Trauma / PTSD",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "A little bit" },
      { value: 2, label: "Moderately" },
      { value: 3, label: "Quite a bit" },
      { value: 4, label: "Extremely" }
    ],
    questions: [
      "Any reminder brought back feelings about it.",
      "I had trouble staying asleep.",
      "Other things kept making me think about it.",
      "I felt irritable and angry.",
      "I avoided letting myself get upset when I thought about it or was reminded of it.",
      "I thought about it when I didn’t mean to.",
      "I felt as if it hadn’t happened or wasn’t real.",
      "I stayed away from reminders of it.",
      "Pictures about it popped into my mind.",
      "I was jumpy and easily startled.",
      "I tried not to think about it.",
      "I was aware that I still had a lot of feelings about it, but I didn’t deal with them.",
      "My feelings about it were kind of numb.",
      "I found myself acting or feeling like I was back at that time.",
      "I had trouble falling asleep.",
      "I had waves of strong feelings about it.",
      "I tried to remove it from my memory.",
      "I had trouble concentrating.",
      "Reminders of it caused me to have physical reactions, such as sweating, trouble breathing, nausea, or a pounding heart.",
      "I had dreams about it.",
      "I felt watchful and on-guard.",
      "I tried not to talk about it."
    ],
    subscales: {
      "Intrusion": [0,2,5,8,13,15,19],
      "Avoidance": [4,6,7,10,11,12,16,21],
      "Hyperarousal": [1,3,9,14,17,18,20]
    },
    custom: true,
    score: function (answers) {
      var total = answers.reduce(function (s, v) { return s + v; }, 0);
      var subscales = this.subscales;
      var subscaleScores = {};
      Object.keys(subscales).forEach(function (name) {
        var sum = 0;
        subscales[name].forEach(function (i) { sum += answers[i]; });
        subscaleScores[name] = sum;
      });
      var severity;
      if (total < 24) severity = "Normal Range";
      else if (total < 33) severity = "Mild Distress";
      else if (total < 37) severity = "Moderate — PTSD Concern";
      else severity = "Severe — PTSD Likely";
      return { total: total, max: 88, severity: severity, subscaleScores: subscaleScores, positive: total >= 33 };
    }
  };

  /* ---------- CAPE-42 ---------- */
  const CAPE42 = {
    id: "cape42", name: "CAPE-42", fullName: "Community Assessment of Psychic Experiences",
    description: "Please indicate how often you have had each experience AND, if you have had it, how distressed it made you.",
    category: "Psychotic-like Experiences",
    custom: true,
    frequencyOptions: [
      { value: 0, label: "Never" },
      { value: 1, label: "Sometimes" },
      { value: 2, label: "Often" },
      { value: 3, label: "Nearly Always" }
    ],
    distressOptions: [
      { value: 1, label: "Not distressed" },
      { value: 2, label: "A bit distressed" },
      { value: 3, label: "Quite distressed" },
      { value: 4, label: "Very distressed" }
    ],
    items: [
      "Do you ever feel sad?",
      "Do you ever feel as if people seem to drop hints about you or say things with a double meaning?",
      "Do you ever feel that you are not a very animated person?",
      "Do you ever feel that you are not much of a talker, and that other people are talking about you?",
      "Do you ever feel as if things in magazines or on TV were written especially for you?",
      "Do you ever feel that some people are not what they seem to be?",
      "Do you ever feel that you are being persecuted in some way?",
      "Do you ever feel that you experience few or no emotions at important events?",
      "Do you ever feel pessimistic about everything?",
      "Do you ever feel as if there is a conspiracy against you?",
      "Do you ever feel as if you are destined to be someone very important?",
      "Do you ever feel as if there is no future for you?",
      "Do you ever feel that you are a very special or unusual person?",
      "Do you ever feel as if you do not want to live anymore?",
      "Do you ever think that people can communicate telepathically?",
      "Do you ever feel that you have no interest to be with other people?",
      "Do you ever feel as if electrical devices such as computers can influence the way you think?",
      "Do you ever feel that you are lacking in motivation to do things?",
      "Do you ever cry about nothing?",
      "Do you believe in the power of witchcraft, voodoo or the occult?",
      "Do you ever feel that you are lacking in energy?",
      "Do you ever feel that people look at you oddly because of your appearance?",
      "Do you ever feel that your mind is empty?",
      "Do you ever feel as if the thoughts in your head are being taken away from you?",
      "Do you ever feel that you are spending all your days doing nothing?",
      "Do you ever feel as if the thoughts in your head are not your own?",
      "Do you ever feel that your feelings are lacking in intensity?",
      "Have your thoughts ever been so vivid that you were worried other people would hear them?",
      "Do you ever feel that you lack spontaneity?",
      "Do you ever hear your own thoughts being echoed back to you?",
      "Do you ever feel as if you are under the control of some force or power other than yourself?",
      "Do you ever feel that your emotions are blunted?",
      "Do you ever hear voices when you are alone?",
      "Do you ever hear voices talking to each other when you are alone?",
      "Do you ever feel that you are neglecting your appearance or personal hygiene?",
      "Do you ever feel as if there are odd sounds or music that only you can hear?",
      "Do you ever feel as if you are being followed?",
      "Do you ever feel that you have never been able to achieve anything?",
      "Do you ever feel as if a double has taken the place of a family member, friend, or acquaintance?",
      "Do you ever see objects, people, or animals that other people cannot see?",
      "Do you ever feel that you have no desire to do things?",
      "Do you ever feel that you cannot carry out everyday activities?"
    ],
    dimensions: {
      "Positive": [1,3,4,5,6,9,10,12,14,16,19,21,23,25,27,29,30,32,33,35,36,38,39],
      "Negative": [2,7,15,17,20,22,24,26,28,31,34,40,41],
      "Depressive": [0,8,11,13,18,37]
    },
    questions: [], // handled via custom rendering
    score: function (answers) {
      // answers: [freq0, distress0, freq1, distress1, ...] — 84 values
      var dimensions = this.dimensions;
      var dimScores = {};
      var totalFreq = 0;
      Object.keys(dimensions).forEach(function (dim) {
        var freqSum = 0, distressSum = 0, distressCount = 0;
        dimensions[dim].forEach(function (i) {
          var f = answers[i * 2] || 0;
          freqSum += f;
          totalFreq += f;
          if (f > 0) {
            distressSum += answers[i * 2 + 1] || 0;
            distressCount++;
          }
        });
        dimScores[dim] = {
          frequency: freqSum,
          distress: distressSum,
          avgDistress: distressCount > 0 ? Math.round((distressSum / distressCount) * 10) / 10 : 0
        };
      });
      var severity;
      if (totalFreq < 42) severity = "Low Frequency";
      else if (totalFreq < 84) severity = "Moderate Frequency";
      else severity = "High Frequency";
      return { total: totalFreq, max: 126, severity: severity, dimensionScores: dimScores };
    }
  };

  /* ---------- SCOFF ---------- */
  const SCOFF = {
    id: "scoff", name: "SCOFF", fullName: "SCOFF Eating Disorder Screening Questionnaire",
    description: "Please answer the following questions honestly.",
    category: "Eating Disorder Screening",
    options: YESNO,
    questions: [
      "Do you make yourself Sick because you feel uncomfortably full?",
      "Do you worry you have lost Control over how much you eat?",
      "Have you recently lost more than One stone (14 lbs / 6.5 kg) in a 3-month period?",
      "Do you believe yourself to be Fat when others say you are too thin?",
      "Would you say that Food dominates your life?"
    ],
    score: function (answers) {
      var total = answers.reduce(function (s, v) { return s + v; }, 0);
      var severity = total >= 2 ? "Possible Eating Disorder" : "Below Threshold";
      return { total: total, max: 5, severity: severity, positive: total >= 2 };
    }
  };

  /* ---------- WHO-5 ---------- */
  const WHO5 = {
    id: "who5", name: "WHO-5", fullName: "WHO-5 Well-Being Index",
    description: "Please indicate for each of the five statements which is closest to how you have been feeling over the last two weeks.",
    category: "Well-Being",
    options: [
      { value: 5, label: "All of the time" },
      { value: 4, label: "Most of the time" },
      { value: 3, label: "More than half of the time" },
      { value: 2, label: "Less than half of the time" },
      { value: 1, label: "Some of the time" },
      { value: 0, label: "At no time" }
    ],
    questions: [
      "I have felt cheerful and in good spirits.",
      "I have felt calm and relaxed.",
      "I have felt active and vigorous.",
      "I woke up feeling fresh and rested.",
      "My daily life has been filled with things that interest me."
    ],
    score: function (answers) {
      var raw = answers.reduce(function (s, v) { return s + v; }, 0);
      var pct = raw * 4;
      var severity;
      if (pct >= 50) severity = "Good Well-Being";
      else if (pct >= 28) severity = "Poor Well-Being";
      else severity = "Likely Depression";
      return { total: raw, max: 25, severity: severity, percentage: pct };
    }
  };

  /* ============================================================
     ALL INSTRUMENTS IN ORDER
     ============================================================ */
  const INSTRUMENTS = [PHQ9, GAD7, PCL5, MDQ, AUDIT, ASRS, ISI, PHQ15, PSS10, CSSRS, PID5BF, MSIBPD, LPFSBF, AQ10, RAADS14, CATQ, OCIR, LSAS, DESII, IESR, CAPE42, SCOFF, WHO5];
  /* ============================================================
     TRIAGE / SCREENING QUESTIONS
     ============================================================ */
  const TRIAGE_QUESTIONS = [
    { text: "Have you been feeling down, depressed, or hopeless?", instruments: ["phq9"] },
    { text: "Do you often feel nervous, anxious, or on edge?", instruments: ["gad7"] },
    { text: "Have you experienced or witnessed a traumatic event that still affects you?", instruments: ["pcl5", "iesr"] },
    { text: "Do you have periods of unusually high energy, decreased need for sleep, or racing thoughts?", instruments: ["mdq"] },
    { text: "Do you drink alcohol regularly or feel you should cut down?", instruments: ["audit"] },
    { text: "Do you have trouble focusing, staying organized, or sitting still?", instruments: ["asrs"] },
    { text: "Do you have difficulty falling asleep, staying asleep, or wake up too early?", instruments: ["isi"] },
    { text: "Do you frequently experience physical symptoms like headaches, stomach pain, or dizziness?", instruments: ["phq15"] },
    { text: "Do you feel overwhelmed by stress in your daily life?", instruments: ["pss10"] },
    { text: "Do you have difficulty understanding social cues or prefer routines and patterns?", instruments: ["aq10", "raads14"] },
    { text: "Do you feel like you mask or hide your true self in social situations?", instruments: ["catq"] },
    { text: "Do you have unwanted repetitive thoughts or feel compelled to perform certain rituals?", instruments: ["ocir"] },
    { text: "Do you feel intense fear or avoidance in social situations?", instruments: ["lsas"] },
    { text: "Do you sometimes feel detached from yourself, your surroundings, or have gaps in memory?", instruments: ["des2", "desii"] },
    { text: "Do you have concerns about your eating habits, weight, or body image?", instruments: ["scoff"] },
    { text: "Do you have patterns of unstable relationships, intense emotions, or fear of abandonment?", instruments: ["msibpd", "lpfsbf", "pid5bf"] },
  ];

  // These instruments are ALWAYS included regardless of triage answers
  const ALWAYS_INCLUDE = ["cssrs", "who5"];

  // Active (filtered) instruments list — starts as all, updated after triage
  var activeInstruments = INSTRUMENTS.slice();
  var triageAnswers = new Array(TRIAGE_QUESTIONS.length).fill(false);
  var triageSelectAll = false;


  /* ============================================================
     STATE
     ============================================================ */
  var currentStep = 0; // 0 = patient info, 1 = triage, 2+ = instruments, last = review
  var totalSteps = INSTRUMENTS.length + 3; // patient info + triage + instruments + review
  var answers = {}; // keyed by instrument id
  var patientInfo = {};

  // Clear state on fresh start
  if (window.location.search.indexOf("fresh=1") !== -1) {
    sessionStorage.removeItem("mindprint_state");
    window.history.replaceState({}, "", "assess.html");
  }

  // Restore from sessionStorage
  try {
    var saved = sessionStorage.getItem("mindprint_state");
    if (saved) {
      var parsed = JSON.parse(saved);
      currentStep = parsed.currentStep || 0;
      answers = parsed.answers || {};
      patientInfo = parsed.patientInfo || {};
      if (parsed.triageAnswers) triageAnswers = parsed.triageAnswers;
      if (parsed.triageSelectAll) triageSelectAll = parsed.triageSelectAll;
      if (parsed.activeInstrumentIds) {
        activeInstruments = parsed.activeInstrumentIds.map(function(id) {
          return INSTRUMENTS.find(function(inst) { return inst.id === id; });
        }).filter(Boolean);
      }
      totalSteps = activeInstruments.length + 3;
    }
  } catch (e) { /* ignore */ }

  function saveState() {
    try {
      sessionStorage.setItem("mindprint_state", JSON.stringify({
        currentStep: currentStep, answers: answers, patientInfo: patientInfo,
        triageAnswers: triageAnswers, triageSelectAll: triageSelectAll,
        activeInstrumentIds: activeInstruments.map(function(inst) { return inst.id; })
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
    else if (currentStep === 1) stepLabel.textContent = "Screening Questions";
    else if (currentStep <= activeInstruments.length + 1) stepLabel.textContent = activeInstruments[currentStep - 2].name + " \u2014 " + activeInstruments[currentStep - 2].category;
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
    else if (currentStep === 1) renderTriage();
    else if (currentStep <= activeInstruments.length + 1) renderInstrument(activeInstruments[currentStep - 2]);
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


  /* --- Triage / Screening --- */
  function renderTriage() {
    var selectedCount = countSelectedInstruments();
    var html = '<div class="assess-step active"><div class="container-narrow">';
    html += '<h2>What brings you here today?</h2>';
    html += '<p class="step-desc">Select any areas of concern. This helps us focus your assessment. You can also choose to take all screenings.</p>';

    // Select All checkbox
    html += '<div class="question-card" style="background:var(--blue-50,#eff6ff);border:1px solid var(--blue-200,#bfdbfe);">';
    html += '<label style="display:flex;align-items:center;gap:12px;cursor:pointer;font-weight:600;font-size:1rem;">';
    html += '<input type="checkbox" id="triage-select-all" style="width:20px;height:20px;accent-color:var(--blue-600,#2563eb);"' + (triageSelectAll ? ' checked' : '') + '>';
    html += 'Select All Assessments</label>';
    html += '</div>';

    // Count display
    html += '<p id="triage-count" style="text-align:center;color:var(--gray-500);font-size:.9rem;margin:12px 0 20px;">' + selectedCount + ' of ' + INSTRUMENTS.length + ' assessments selected</p>';

    // Questions
    TRIAGE_QUESTIONS.forEach(function (tq, idx) {
      html += '<div class="question-card" style="padding:14px 20px;">';
      html += '<label style="display:flex;align-items:flex-start;gap:12px;cursor:pointer;">';
      html += '<input type="checkbox" class="triage-check" data-idx="' + idx + '" style="width:20px;height:20px;min-width:20px;margin-top:2px;accent-color:var(--blue-600,#2563eb);"' + (triageAnswers[idx] || triageSelectAll ? ' checked' : '') + '>';
      html += '<span style="font-size:.95rem;">' + esc(tq.text) + '</span>';
      html += '</label></div>';
    });

    html += '<div class="assess-nav">';
    html += '<button class="btn btn-secondary" id="btn-back">\u2190 Back</button>';
    html += '<button class="btn btn-primary" id="btn-next">Next \u2192</button>';
    html += '</div></div></div>';
    main.innerHTML = html;

    function updateCount() {
      var count = countSelectedInstruments();
      var el = document.getElementById("triage-count");
      if (el) el.textContent = count + " of " + INSTRUMENTS.length + " assessments selected";
    }

    document.getElementById("triage-select-all").addEventListener("change", function () {
      triageSelectAll = this.checked;
      main.querySelectorAll(".triage-check").forEach(function (cb) { cb.checked = triageSelectAll || triageAnswers[parseInt(cb.dataset.idx)]; });
      updateCount();
    });

    main.querySelectorAll(".triage-check").forEach(function (cb) {
      cb.addEventListener("change", function () {
        triageAnswers[parseInt(this.dataset.idx)] = this.checked;
        // If unchecking, also uncheck select all
        if (!this.checked) {
          triageSelectAll = false;
          document.getElementById("triage-select-all").checked = false;
        }
        updateCount();
      });
    });

    document.getElementById("btn-back").addEventListener("click", function () {
      currentStep = 0;
      saveState();
      renderStep();
    });

    document.getElementById("btn-next").addEventListener("click", function () {
      buildActiveInstruments();
      currentStep = 2;
      saveState();
      renderStep();
    });
  }

  function countSelectedInstruments() {
    if (triageSelectAll) return INSTRUMENTS.length;
    var ids = {};
    ALWAYS_INCLUDE.forEach(function (id) { ids[id] = true; });
    TRIAGE_QUESTIONS.forEach(function (tq, idx) {
      if (triageAnswers[idx]) {
        tq.instruments.forEach(function (id) { ids[id] = true; });
      }
    });
    // Count how many INSTRUMENTS match
    var count = 0;
    INSTRUMENTS.forEach(function (inst) { if (ids[inst.id]) count++; });
    return count;
  }

  function buildActiveInstruments() {
    if (triageSelectAll) {
      activeInstruments = INSTRUMENTS.slice();
    } else {
      var ids = {};
      ALWAYS_INCLUDE.forEach(function (id) { ids[id] = true; });
      TRIAGE_QUESTIONS.forEach(function (tq, idx) {
        if (triageAnswers[idx]) {
          tq.instruments.forEach(function (id) { ids[id] = true; });
        }
      });
      activeInstruments = INSTRUMENTS.filter(function (inst) { return ids[inst.id]; });
    }
    totalSteps = activeInstruments.length + 3; // patient info + triage + instruments + review
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
    } else if (inst.id === "lsas") {
      // Dual-rating: Fear + Avoidance per situation
      inst.situations.forEach(function (sit, si) {
        var fearSaved = saved[si * 2];
        var avoidSaved = saved[si * 2 + 1];
        html += '<div class="question-card">';
        html += '<div class="q-num">Situation ' + (si + 1) + '</div>';
        html += '<div class="q-text">' + esc(sit) + '</div>';
        html += '<p style="font-weight:600;margin:8px 0 4px;font-size:.85rem;">Fear / Anxiety:</p>';
        html += '<div class="radio-group">';
        inst.fearOptions.forEach(function (o) {
          var sel = fearSaved !== undefined && fearSaved === o.value;
          html += '<div class="radio-option' + (sel ? ' selected' : '') + '"><input type="radio" name="' + inst.id + '_' + (si * 2) + '" value="' + o.value + '"' + (sel ? ' checked' : '') + '><label>' + esc(o.label) + '</label></div>';
        });
        html += '</div>';
        html += '<p style="font-weight:600;margin:8px 0 4px;font-size:.85rem;">Avoidance:</p>';
        html += '<div class="radio-group">';
        inst.avoidOptions.forEach(function (o) {
          var sel = avoidSaved !== undefined && avoidSaved === o.value;
          html += '<div class="radio-option' + (sel ? ' selected' : '') + '"><input type="radio" name="' + inst.id + '_' + (si * 2 + 1) + '" value="' + o.value + '"' + (sel ? ' checked' : '') + '><label>' + esc(o.label) + '</label></div>';
        });
        html += '</div></div>';
      });
    } else if (inst.id === "cape42") {
      // Frequency + conditional distress
      inst.items.forEach(function (item, ii) {
        var freqSaved = saved[ii * 2];
        var distSaved = saved[ii * 2 + 1];
        html += '<div class="question-card">';
        html += '<div class="q-num">Item ' + (ii + 1) + '</div>';
        html += '<div class="q-text">' + esc(item) + '</div>';
        html += '<p style="font-weight:600;margin:8px 0 4px;font-size:.85rem;">Frequency:</p>';
        html += '<div class="radio-group">';
        inst.frequencyOptions.forEach(function (o) {
          var sel = freqSaved !== undefined && freqSaved === o.value;
          html += '<div class="radio-option' + (sel ? ' selected' : '') + '"><input type="radio" name="' + inst.id + '_' + (ii * 2) + '" value="' + o.value + '"' + (sel ? ' checked' : '') + '><label>' + esc(o.label) + '</label></div>';
        });
        html += '</div>';
        html += '<p style="font-weight:600;margin:8px 0 4px;font-size:.85rem;">Distress (if experienced):</p>';
        html += '<div class="radio-group">';
        inst.distressOptions.forEach(function (o) {
          var sel = distSaved !== undefined && distSaved === o.value;
          html += '<div class="radio-option' + (sel ? ' selected' : '') + '"><input type="radio" name="' + inst.id + '_' + (ii * 2 + 1) + '" value="' + o.value + '"' + (sel ? ' checked' : '') + '><label>' + esc(o.label) + '</label></div>';
        });
        html += '</div></div>';
      });
    } else if (inst.id === "aq10") {
      // Per-question custom options
      inst.questions.forEach(function (q, qi) {
        html += renderQuestionCard(qi + 1, q.text, q.options, saved[qi], inst.id + "_" + qi);
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
      qCount = 15;
    } else if (inst.id === "lsas") {
      qCount = inst.situations.length * 2; // fear + avoidance per situation
    } else if (inst.id === "cape42") {
      qCount = inst.items.length * 2; // frequency + distress per item
    } else {
      qCount = inst.questions.length;
    }
    var collected = [];
    for (var i = 0; i < qCount; i++) {
      var checked = main.querySelector('input[name="' + inst.id + '_' + i + '"]:checked');
      if (!checked) {
        // For CAPE-42, distress items (odd indices) are optional if frequency is 0
        if (inst.id === "cape42" && i % 2 === 1) {
          var freqVal = collected[i - 1];
          if (freqVal === 0) { collected.push(0); continue; }
        }
        return false;
      }
      collected.push(parseInt(checked.value, 10));
    }
    answers[inst.id] = collected;
    return true;
  }

  /* --- Review & Generate --- */
  function renderReview() {
    var html = '<div class="assess-step active"><div class="container-narrow">';
    html += '<h2>Review & Generate Report</h2>';
    html += '<p class="step-desc">You\u2019ve completed all selected assessments. Review your information below, then generate your report.</p>';

    html += '<div style="background:var(--green-50);border:1px solid var(--green-500);border-radius:var(--radius-sm);padding:20px;margin-bottom:24px;">';
    html += '<strong style="color:var(--green-700);">\u2705 All ' + activeInstruments.length + ' assessments complete</strong>';
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
    activeInstruments.forEach(function (inst) {
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
        window.generateReport(patientInfo, answers, activeInstruments);
      }
    });
  }

  /* Expose for report.js */
  window._mindprint = { instruments: INSTRUMENTS, activeInstruments: function() { return activeInstruments; }, getAnswers: function () { return answers; }, getPatientInfo: function () { return patientInfo; } };

  /* ============================================================
     INIT
     ============================================================ */
  renderStep();

})();
