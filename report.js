/* MindPrint — Report Generator */
(function () {
  "use strict";

  var INTERPRETATIONS = {
    phq9: {
      "Minimal": "Your responses suggest minimal or no symptoms of depression. This is within the normal range.",
      "Mild": "Your responses suggest mild depressive symptoms. These may be worth monitoring and discussing with your provider.",
      "Moderate": "Your responses suggest moderate depressive symptoms. Clinical evaluation is recommended.",
      "Moderately Severe": "Your responses suggest moderately severe depressive symptoms. Active treatment with medication and/or therapy is typically recommended.",
      "Severe": "Your responses suggest severe depressive symptoms. Immediate clinical evaluation and treatment is strongly recommended."
    },
    gad7: {
      "Minimal": "Your responses suggest minimal anxiety symptoms. This is within the normal range.",
      "Mild": "Your responses suggest mild anxiety. Monitor symptoms and consider discussing with your provider.",
      "Moderate": "Your responses suggest moderate anxiety. Clinical evaluation is recommended.",
      "Severe": "Your responses suggest severe anxiety. Professional evaluation and treatment is strongly recommended."
    },
    pcl5: {
      "Negative": "Your total score is below the clinical threshold for PTSD. However, if you are experiencing distress related to trauma, discuss this with your provider.",
      "Positive (suggests PTSD)": "Your total score meets or exceeds the clinical threshold (31+) suggestive of PTSD. A comprehensive clinical evaluation is strongly recommended."
    },
    mdq: {
      "Negative": "Your responses do not meet the threshold for a positive bipolar disorder screen.",
      "Positive": "Your responses meet criteria for a positive bipolar disorder screen (7+ symptoms occurring together and causing moderate-to-serious problems). A comprehensive mood evaluation by a qualified professional is recommended."
    },
    audit: {
      "Low Risk": "Your responses suggest low-risk alcohol use.",
      "Hazardous": "Your responses suggest hazardous alcohol use patterns. Consider reducing intake and discuss with your provider.",
      "Harmful": "Your responses suggest harmful alcohol use. Professional guidance for reducing or stopping alcohol use is recommended.",
      "Possible Dependence": "Your responses suggest possible alcohol dependence. Professional evaluation and treatment is strongly recommended."
    },
    asrs: {
      "Negative": "Your responses do not meet the threshold for a positive ADHD screen based on Part A of the ASRS.",
      "Positive": "Your responses are consistent with a positive ADHD screen (4+ items in the clinically significant range). A comprehensive ADHD evaluation is recommended."
    },
    isi: {
      "None": "Your responses suggest no clinically significant insomnia.",
      "Subthreshold": "Your responses suggest subthreshold insomnia symptoms. Monitor and discuss with your provider if sleep continues to be a concern.",
      "Moderate": "Your responses suggest moderate clinical insomnia. Evaluation and treatment (such as CBT-I) is recommended.",
      "Severe": "Your responses suggest severe clinical insomnia. Professional treatment is strongly recommended."
    },
    phq15: {
      "Minimal": "Your responses suggest minimal somatic symptom severity.",
      "Low": "Your responses suggest low somatic symptom severity. Monitor and discuss persistent symptoms with your provider.",
      "Medium": "Your responses suggest medium somatic symptom severity. Clinical evaluation is recommended.",
      "High": "Your responses suggest high somatic symptom severity. Comprehensive medical and psychological evaluation is recommended."
    },
    pss10: {
      "Low": "Your perceived stress level is in the low range.",
      "Moderate": "Your perceived stress level is moderate. Consider stress management strategies and discuss with your provider.",
      "High": "Your perceived stress level is high. Professional support for stress management is recommended."
    },
    cssrs: {
      "None": "No suicidal ideation or behavior was endorsed on this screening.",
      "Flag": "One or more items related to suicidal ideation or behavior were endorsed. IMMEDIATE professional consultation is strongly recommended. If you are in crisis, call 988 (Suicide & Crisis Lifeline) or go to your nearest emergency room."
    }
  };

  function severityClass(severity) {
    return "severity-" + severity.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[()]/g, "")
      .replace(/suggests-ptsd/, "positive");
  }

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s || "";
    return d.innerHTML;
  }

  window.generateReport = function (patientInfo, answers, instruments) {
    var results = [];
    var riskFlags = [];
    var discussionPoints = [];

    instruments.forEach(function (inst) {
      var result = inst.score.call(inst, answers[inst.id]);
      result.id = inst.id;
      result.name = inst.name;
      result.fullName = inst.fullName;
      result.category = inst.category;
      result.interpretation = (INTERPRETATIONS[inst.id] || {})[result.severity] || "";
      results.push(result);

      // Risk flags
      if (inst.id === "cssrs" && result.flag) {
        riskFlags.push("SUICIDE RISK: One or more items endorsed on the C-SSRS screener. Immediate professional consultation is critical.");
      }
      if (inst.id === "audit" && (result.severity === "Harmful" || result.severity === "Possible Dependence")) {
        riskFlags.push("SUBSTANCE USE CONCERN: AUDIT score indicates " + result.severity.toLowerCase() + " alcohol use patterns.");
      }
      if (inst.id === "phq9" && result.total >= 15) {
        discussionPoints.push("PHQ-9 score suggests " + result.severity.toLowerCase() + " depression \u2014 discuss treatment options including medication and therapy.");
      }
      if (inst.id === "gad7" && result.total >= 10) {
        discussionPoints.push("GAD-7 score suggests " + result.severity.toLowerCase() + " anxiety \u2014 discuss evaluation and treatment.");
      }
      if (inst.id === "pcl5" && result.positive) {
        discussionPoints.push("PCL-5 score exceeds clinical threshold \u2014 discuss comprehensive PTSD evaluation and trauma-focused therapy.");
      }
      if (inst.id === "mdq" && result.positive) {
        discussionPoints.push("MDQ screen is positive \u2014 discuss comprehensive mood evaluation for bipolar spectrum disorders.");
      }
      if (inst.id === "asrs" && result.positive) {
        discussionPoints.push("ASRS Part A screen is positive \u2014 discuss comprehensive ADHD evaluation.");
      }
      if (inst.id === "isi" && result.total >= 15) {
        discussionPoints.push("ISI score suggests " + result.severity.toLowerCase() + " insomnia \u2014 discuss sleep hygiene and CBT-I.");
      }
      if (inst.id === "pss10" && result.total >= 27) {
        discussionPoints.push("PSS-10 indicates high perceived stress \u2014 discuss stress management and coping strategies.");
      }
      if (inst.id === "msibpd" && result.positive) {
        discussionPoints.push("MSI-BPD screen is positive \u2014 discuss comprehensive personality disorder evaluation.");
      }
      if (inst.id === "ocir" && result.positive) {
        discussionPoints.push("OCI-R score suggests possible OCD \u2014 discuss evaluation and evidence-based treatment (CBT/ERP).");
      }
      if (inst.id === "iesr" && result.positive) {
        discussionPoints.push("IES-R score suggests possible PTSD \u2014 discuss comprehensive trauma evaluation and trauma-focused therapy.");
      }
      if (inst.id === "scoff" && result.positive) {
        discussionPoints.push("SCOFF screen is positive \u2014 discuss evaluation for possible eating disorder.");
      }
      if (inst.id === "who5" && result.percentage < 50) {
        discussionPoints.push("WHO-5 indicates poor well-being (score: " + result.percentage + "%) \u2014 discuss contributing factors and support.");
      }
      if (inst.id === "aq10" && result.total >= 6) {
        discussionPoints.push("AQ-10 score suggests referral for comprehensive autism spectrum assessment.");
      }
      if (inst.id === "lsas" && result.total >= 50) {
        discussionPoints.push("LSAS indicates " + result.severity.toLowerCase() + " \u2014 discuss evaluation and treatment for social anxiety.");
      }
      if (inst.id === "desii" && result.averageScore >= 30) {
        discussionPoints.push("DES-II average score suggests significant dissociation \u2014 discuss comprehensive dissociative disorder evaluation.");
      }
    });

    // If no discussion points, add a generic one
    if (discussionPoints.length === 0) {
      discussionPoints.push("All screening scores are within normal or low-risk ranges. Continue monitoring your mental health and follow up as needed.");
    }

    // Build HTML
    var now = new Date();
    var dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    var html = '<div class="report-wrap"><div class="container-narrow">';

    // Header
    html += '<div class="report-header">';
    html += '<h1>MindPrint Screening Report</h1>';
    html += '<p class="report-date">Generated ' + esc(dateStr) + '</p>';
    html += '</div>';

    // Crisis banner if flagged
    if (riskFlags.some(function (f) { return f.indexOf("SUICIDE") !== -1; })) {
      html += '<div class="crisis-banner crisis-banner-report" style="margin-bottom:24px">';
      html += '<p><strong>\u26A0\uFE0F Immediate Attention Needed</strong></p>';
      html += '<p>This screening identified responses indicating potential suicide risk. Please contact a mental health professional immediately.</p>';
      html += '<p style="margin-top:8px;"><strong>988 Suicide & Crisis Lifeline:</strong> Call or text <a href="tel:988">988</a> | Text HOME to <a href="sms:741741">741741</a></p>';
      html += '</div>';
    }

    // Patient info
    html += '<div class="patient-info-box">';
    html += '<div class="info-item"><label>Name</label><span>' + esc(patientInfo.name || "Not provided") + '</span></div>';
    html += '<div class="info-item"><label>Age</label><span>' + esc(patientInfo.age || "N/A") + '</span></div>';
    html += '<div class="info-item"><label>Gender</label><span>' + esc(patientInfo.gender || "N/A") + '</span></div>';
    html += '<div class="info-item"><label>Date</label><span>' + esc(dateStr) + '</span></div>';
    if (patientInfo.diagnoses) html += '<div class="info-item info-full"><label>Current Diagnoses</label><span>' + esc(patientInfo.diagnoses) + '</span></div>';
    if (patientInfo.medications) html += '<div class="info-item info-full"><label>Current Medications</label><span>' + esc(patientInfo.medications) + '</span></div>';
    if (patientInfo.history) html += '<div class="info-item info-full"><label>Brief History</label><span>' + esc(patientInfo.history) + '</span></div>';
    html += '</div>';

    // Risk flags
    if (riskFlags.length > 0) {
      html += '<div class="risk-flags">';
      html += '<h3>\u26A0\uFE0F Risk Flags</h3><ul>';
      riskFlags.forEach(function (f) { html += '<li>' + esc(f) + '</li>'; });
      html += '</ul></div>';
    }

    // Score cards
    html += '<h2 style="margin:32px 0 16px;font-size:1.3rem;">Assessment Results</h2>';
    results.forEach(function (r) {
      var cls = severityClass(r.severity);
      html += '<div class="score-card ' + cls + '">';
      html += '<div class="score-card-header">';
      html += '<h3>' + esc(r.name) + ' <span style="font-weight:400;color:var(--gray-400);">\u2014 ' + esc(r.category) + '</span></h3>';
      html += '<span class="score-badge">' + esc(r.severity) + '</span>';
      html += '</div>';
      html += '<div class="score-num">Score: ' + r.total + ' / ' + r.max + (r.percentage !== undefined ? ' (' + r.percentage + '%)' : '') + (r.unit ? ' ' + r.unit : '') + '</div>';
      // Domain scores (PID-5-BF)
      if (r.domainScores) {
        html += '<div class="subscale-scores" style="margin:8px 0;font-size:.85rem;">';
        Object.keys(r.domainScores).forEach(function (d) {
          var ds = r.domainScores[d];
          var flag = ds.avg >= 2 ? ' \u26A0\uFE0F' : '';
          html += '<div style="display:flex;justify-content:space-between;padding:2px 0;"><span>' + esc(d) + flag + '</span><span>' + ds.avg + ' avg (' + ds.sum + '/15)</span></div>';
        });
        html += '</div>';
      }
      // Subscale scores (LPFS-BF, CAT-Q, IES-R)
      if (r.subscaleScores) {
        html += '<div class="subscale-scores" style="margin:8px 0;font-size:.85rem;">';
        Object.keys(r.subscaleScores).forEach(function (s) {
          html += '<div style="display:flex;justify-content:space-between;padding:2px 0;"><span>' + esc(s) + '</span><span>' + r.subscaleScores[s] + '</span></div>';
        });
        html += '</div>';
      }
      // Dimension scores (CAPE-42)
      if (r.dimensionScores) {
        html += '<div class="subscale-scores" style="margin:8px 0;font-size:.85rem;">';
        Object.keys(r.dimensionScores).forEach(function (dim) {
          var ds = r.dimensionScores[dim];
          html += '<div style="display:flex;justify-content:space-between;padding:2px 0;"><span>' + esc(dim) + '</span><span>Freq: ' + ds.frequency + ' | Distress avg: ' + ds.avgDistress + '</span></div>';
        });
        html += '</div>';
      }
      // LSAS fear/avoidance breakdown
      if (r.fearTotal !== undefined) {
        html += '<div style="font-size:.85rem;margin:4px 0;">Fear: ' + r.fearTotal + '/72 | Avoidance: ' + r.avoidTotal + '/72</div>';
      }
      html += '<div class="interpretation">' + esc(r.interpretation) + '</div>';
      html += '</div>';
    });

    // Discussion points
    html += '<div class="discussion-points">';
    html += '<h3>\uD83D\uDCCB Discussion Points for Your Provider</h3><ul>';
    discussionPoints.forEach(function (d) { html += '<li>' + esc(d) + '</li>'; });
    html += '</ul></div>';

    // Disclaimers
    html += '<div class="disclaimer-banner">';
    html += '<h4>\u26A0\uFE0F Important Disclaimers</h4>';
    html += '<ul>';
    html += '<li>This is a <strong>screening tool</strong>, not a clinical diagnosis.</li>';
    html += '<li>Results should be reviewed with a <strong>licensed healthcare professional</strong>.</li>';
    html += '<li>Screening instruments have known limitations including false positives and false negatives.</li>';
    html += '<li>No data was stored or transmitted \u2014 all processing occurred locally in your browser.</li>';
    html += '</ul></div>';

    // Actions
    html += '<div class="report-actions">';
    html += '<button class="btn btn-primary btn-lg" onclick="window.print()">\uD83D\uDDA8\uFE0F Download / Print PDF</button>';
    html += '<button class="btn btn-secondary" onclick="if(confirm(\'Start over? All responses will be cleared.\')){sessionStorage.clear();location.href=\'assess.html\';}">\uD83D\uDD04 Start Over</button>';
    html += '<a href="index.html" class="btn btn-secondary">Return Home</a>';
    html += '</div>';

    html += '</div></div>';

    // Replace page content
    document.getElementById("assess-main").style.display = "none";
    document.querySelector(".progress-bar-wrap").style.display = "none";
    var output = document.getElementById("report-output");
    output.innerHTML = html;
    output.style.display = "block";

    // Clear session storage
    try { sessionStorage.removeItem("mindprint_state"); } catch (e) { /* ignore */ }
  };

})();
