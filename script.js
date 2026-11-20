// Digital Saathi: simple interactions for beginners.
let currentFontSize = 18;
const body = document.body;
let currentLanguage = "en";

// Text-size controls: keep text within a comfortable range.
document.getElementById("largerText").addEventListener("click", () => {
  currentFontSize = Math.min(currentFontSize + 2, 28);
  body.style.fontSize = currentFontSize + "px";
});
document.getElementById("smallerText").addEventListener("click", () => {
  currentFontSize = Math.max(currentFontSize - 2, 14);
  body.style.fontSize = currentFontSize + "px";
});

// Read-aloud uses the selected language where the browser has a matching voice.
function speakText(text) {
  if (!("speechSynthesis" in window)) {
    alert("Read aloud is not supported in this browser. Try an updated version of Chrome, Edge, or Safari.");
    return;
  }
  window.speechSynthesis.cancel();
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = currentLanguage === "hi" ? "hi-IN" : "en-IN";
  speech.rate = 0.82;
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang.toLowerCase() === speech.lang.toLowerCase()) ||
    voices.find(v => v.lang.toLowerCase().startsWith(currentLanguage === "hi" ? "hi" : "en-in"));
  if (voice) speech.voice = voice;
  window.speechSynthesis.speak(speech);
}

document.getElementById("readWelcome").addEventListener("click", () => {
  speakText(currentLanguage === "hi"
    ? "डिजिटल साथी में आपका स्वागत है। अपने फोन का उपयोग करना, इंटरनेट चलाना और ऑनलाइन सुरक्षित रहना सीखें।"
    : "Welcome to Digital Saathi. Learn to use your phone, explore the internet, and stay safe online.");
});

// English and Hindi interface text. Add more entries here when expanding the site.
const interfaceTranslations = {
  "Lessons": "पाठ", "Online Safety": "ऑनलाइन सुरक्षा", "Quiz": "प्रश्नोत्तरी", "Get Help": "मदद लें",
  "🔊 Read": "🔊 सुनें", "Open lesson": "पाठ खोलें", "🔊 Read this lesson aloud": "🔊 यह पाठ सुनें",
  "✕ Close": "✕ बंद करें", "LEARN AT YOUR OWN PACE": "अपनी गति से सीखें", "LEARNING CORNER": "सीखने का कोना",
  "STAY SAFE ONLINE": "ऑनलाइन सुरक्षित रहें", "PRACTICE TIME": "अभ्यास का समय", "WE ARE HERE TO HELP": "हम मदद के लिए हैं",
  "Smartphone Basics": "स्मार्टफोन की बुनियादी बातें", "Using the Internet": "इंटरनेट का उपयोग", "Email Basics": "ईमेल की बुनियादी बातें",
  "Digital Payments": "डिजिटल भुगतान", "Spotting Fake Messages": "नकली संदेश पहचानें"
};

document.getElementById("languageToggle").addEventListener("click", function () {
  currentLanguage = currentLanguage === "en" ? "hi" : "en";
  document.documentElement.lang = currentLanguage;
  this.textContent = currentLanguage === "en" ? "हिन्दी" : "English";
  document.querySelectorAll("[data-en][data-hi]").forEach(el => {
    el.textContent = el.dataset[currentLanguage];
  });
  document.querySelectorAll("nav a, .lesson-button, #readWelcome, #readLesson, #closeLesson, .eyebrow").forEach(el => {
    if (!el.dataset.originalText) el.dataset.originalText = el.textContent;
    const original = el.dataset.originalText;
    el.textContent = currentLanguage === "hi" ? (interfaceTranslations[original] || original) : original;
  });
  document.querySelectorAll(".lesson-card h3").forEach(el => {
    const original = el.dataset.originalText || el.textContent;
    el.dataset.originalText = original;
    el.textContent = currentLanguage === "hi" ? (interfaceTranslations[original] || original) : original;
  });
  renderQuestion();
  if (!lessonDetail.hidden && activeLessonKey) showLesson(activeLessonKey);
});

// Lesson content in both languages.
const lessons = {
  phone: {
    title: { en: "Smartphone Basics", hi: "स्मार्टफोन की बुनियादी बातें" },
    steps: {
      en: ["Open the Contacts app on your phone.", "Tap Add Contact, enter the person's name and phone number, then tap Save.", "Open your messaging app, type a message such as “Hello!”, and tap Send.", "Open a trusted video-calling app and tap the video-call button to call someone."],
      hi: ["अपने फोन में Contacts ऐप खोलें।", "Add Contact दबाएँ, व्यक्ति का नाम और फोन नंबर लिखें, फिर Save दबाएँ।", "मैसेज ऐप खोलें, “Hello!” जैसा संदेश लिखें और Send दबाएँ।", "किसी को वीडियो कॉल करने के लिए भरोसेमंद ऐप खोलें और वीडियो कॉल बटन दबाएँ।"]
    },
    images: ["images/phone-contacts.jpg", "images/phone-save-contact.jpg", "images/phone-message.jpg", "images/phone-video-call.jpg"]
  },
  internet: {
    title: { en: "Using the Internet", hi: "इंटरनेट का उपयोग" },
    steps: {
      en: ["Open a web browser such as Chrome.", "Tap the Google search box and type what you want to find.", "Check the website address before opening it; the example shown is a government website.", "Read online-safety guidance and protect your personal details while browsing."],
      hi: ["Chrome जैसा वेब ब्राउज़र खोलें।", "Google खोज बॉक्स में वह जानकारी लिखें जिसे आप ढूँढ़ना चाहते हैं।", "वेबसाइट खोलने से पहले उसका पता जाँचें; चित्र में सरकारी वेबसाइट का उदाहरण है।", "इंटरनेट सुरक्षा के सुझाव पढ़ें और ब्राउज़ करते समय अपनी निजी जानकारी सुरक्षित रखें।"]
    },
    images: ["images/internet-browser.jpg", "images/internet-search.jpg", "images/internet-website-check.jpg", "images/internet-safety.jpg"]
  },
  email: {
    title: { en: "Email Basics", hi: "ईमेल की बुनियादी बातें" },
    steps: {
      en: ["Open your email app, such as Gmail.", "Tap Compose to start a new email.", "Enter the recipient's email address and add a subject.", "Use the paperclip button to attach a file; only open attachments you trust."],
      hi: ["Gmail जैसे ईमेल ऐप को खोलें।", "नया ईमेल लिखने के लिए Compose दबाएँ।", "प्राप्तकर्ता का ईमेल पता लिखें और विषय जोड़ें।", "फ़ाइल जोड़ने के लिए पेपरक्लिप बटन दबाएँ; केवल भरोसेमंद अटैचमेंट खोलें।"]
    },
    images: ["images/email-open.jpg", "images/email-compose.jpg", "images/email-recipient.jpg", "images/email-attachment-safety.jpg"]
  },
  payments: {
    title: { en: "Digital Payments", hi: "डिजिटल भुगतान" },
    steps: {
      en: ["Open a trusted UPI payment app, such as BHIM.", "Scan the recipient's QR code using the payment app.", "Enter the amount, check it carefully, and tap Pay.", "Enter your UPI PIN privately to authorize the payment; never tell it to anyone."],
      hi: ["BHIM जैसे भरोसेमंद UPI भुगतान ऐप को खोलें।", "भुगतान ऐप से प्राप्तकर्ता का QR कोड स्कैन करें।", "राशि लिखें, उसे ध्यान से जाँचें और Pay दबाएँ।", "भुगतान की पुष्टि के लिए अपना UPI PIN निजी रूप से दर्ज करें; इसे किसी को न बताएँ।"]
    },
    images: ["images/upi-open-app.jpg", "images/upi-check-recipient.jpg", "images/upi-payment-pin-safety.jpg", "images/upi-never-share-pin.jpg"]
  },
  scams: {
    title: { en: "Spotting Fake Messages", hi: "नकली संदेश पहचानें" },
    steps: {
      en: ["Be cautious of unexpected prize messages that urge you to click a link.", "Check the sender carefully; be wary of messages from unknown numbers.", "Never share an OTP, even if a message asks you to send it.", "Use the Report option for suspicious messages instead of replying or clicking."],
      hi: ["अचानक मिलने वाले इनाम के संदेशों से सावधान रहें जो लिंक पर क्लिक करने को कहते हैं।", "भेजने वाले की जानकारी ध्यान से जाँचें; अनजान नंबरों से आए संदेशों से सावधान रहें।", "कोई संदेश माँगे तब भी अपना OTP कभी साझा न करें।", "संदिग्ध संदेश का जवाब देने या लिंक खोलने के बजाय Report विकल्प चुनें।"]
    },
    images: ["images/scam-urgent-message.jpg", "images/scam-fake-link.jpg", "images/scam-fake-number.jpg", "images/scam-verify-contact.jpg"]
  }
};
const lessonDetail = document.getElementById("lessonDetail");
const lessonTitle = document.getElementById("lessonTitle");
const lessonSteps = document.getElementById("lessonSteps");
let activeLessonKey = "";
let activeLessonText = "";
function showLesson(key) {
  const lesson = lessons[key];
  activeLessonKey = key;
  lessonTitle.textContent = lesson.title[currentLanguage];
  lessonSteps.replaceChildren();
  lesson.steps[currentLanguage].forEach((step, index) => {
    const li = document.createElement("li");
    li.className = "lesson-step";
    const text = document.createElement("p");
    text.textContent = step;
    li.appendChild(text);
    const image = document.createElement("img");
    image.className = "lesson-step-image";
    image.src = lesson.images[index];
    image.alt = `${lesson.title.en}, step ${index + 1}: ${step}`;
    image.loading = "lazy";
    image.onerror = () => { image.hidden = true; };
    li.appendChild(image);
    lessonSteps.appendChild(li);
  });
  activeLessonText = lesson.title[currentLanguage] + ". " + lesson.steps[currentLanguage].join(" ");
  lessonDetail.hidden = false;
  lessonDetail.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
document.querySelectorAll(".lesson-button").forEach(button => button.addEventListener("click", () => showLesson(button.dataset.lesson)));
document.getElementById("closeLesson").addEventListener("click", () => { lessonDetail.hidden = true; });
document.getElementById("readLesson").addEventListener("click", () => { if (activeLessonText) speakText(activeLessonText); });

// Five-question online-safety quiz. Score only increases once per question.
const questions = [
  { question: { en: "A caller says they are from your bank and asks for your OTP. What should you do?", hi: "बैंक का नाम बताकर कोई आपसे OTP माँगे, तो क्या करें?" }, options: [{en:"Share the OTP",hi:"OTP साझा करें"},{en:"Do not share it",hi:"OTP साझा न करें"},{en:"Send it by message",hi:"संदेश में भेजें"}], answer: 1, explanation: {en:"Never share an OTP, PIN, or password with anyone.",hi:"किसी के साथ OTP, PIN या पासवर्ड साझा न करें।"} },
  { question: { en: "You receive an unexpected message with a suspicious link. What is safest?", hi: "अचानक संदिग्ध लिंक वाला संदेश आए, तो सबसे सुरक्षित कदम क्या है?" }, options: [{en:"Click it quickly",hi:"जल्दी से खोलें"},{en:"Forward it to everyone",hi:"सबको भेज दें"},{en:"Do not click; verify it first",hi:"क्लिक न करें; पहले जाँचें"}], answer: 2, explanation: {en:"Avoid suspicious links and verify through a trusted contact method.",hi:"संदिग्ध लिंक से बचें और भरोसेमंद संपर्क से जाँचें।"} },
  { question: { en: "A stranger asks you to install a remote-access app to fix your bank account. What should you do?", hi: "बैंक खाता ठीक करने के नाम पर कोई अनजान व्यक्ति ऐप इंस्टॉल करने को कहे, तो क्या करें?" }, options: [{en:"Install it immediately",hi:"तुरंत इंस्टॉल करें"},{en:"Refuse and verify with the bank",hi:"मना करें और बैंक से जाँचें"},{en:"Share your password too",hi:"पासवर्ड भी साझा करें"}], answer: 1, explanation: {en:"Do not install apps or give device access because a stranger asks you to.",hi:"किसी अनजान व्यक्ति के कहने पर ऐप इंस्टॉल न करें और फोन का नियंत्रण न दें।"} },
  { question: { en: "Which detail should you check before sending money with a payment app?", hi: "भुगतान ऐप से पैसे भेजने से पहले क्या जाँचना चाहिए?" }, options: [{en:"Recipient's name and amount",hi:"प्राप्तकर्ता का नाम और राशि"},{en:"The phone wallpaper",hi:"फोन का वॉलपेपर"},{en:"The message font",hi:"संदेश का फ़ॉन्ट"}], answer: 0, explanation: {en:"Check the recipient and amount carefully before confirming a payment.",hi:"भुगतान की पुष्टि से पहले प्राप्तकर्ता और राशि ध्यान से जाँचें।"} },
  { question: { en: "Someone says you must tell them your UPI PIN to receive money. What should you do?", hi: "कोई कहे कि पैसे पाने के लिए UPI PIN बताना होगा, तो क्या करें?" }, options: [{en:"Tell them the PIN",hi:"PIN बता दें"},{en:"Share it only on a call",hi:"सिर्फ कॉल पर बताएँ"},{en:"Never share it",hi:"कभी साझा न करें"}], answer: 2, explanation: {en:"You do not need to share your UPI PIN to receive money.",hi:"पैसे प्राप्त करने के लिए UPI PIN साझा करने की आवश्यकता नहीं होती।"} }
];
let questionIndex = 0, score = 0, answered = false, quizFinished = false;
const questionCount = document.getElementById("questionCount"), questionText = document.getElementById("questionText"), answerOptions = document.getElementById("answerOptions"), quizFeedback = document.getElementById("quizFeedback"), scoreText = document.getElementById("scoreText"), nextQuestion = document.getElementById("nextQuestion");
function renderQuestion() {
  quizFinished = false;
  const q = questions[questionIndex];
  questionCount.textContent = currentLanguage === "hi" ? `प्रश्न ${questionIndex + 1} / ${questions.length}` : `Question ${questionIndex + 1} of ${questions.length}`;
  questionText.textContent = q.question[currentLanguage];
  quizFeedback.textContent = ""; quizFeedback.className = "quiz-feedback";
  nextQuestion.disabled = true;
  nextQuestion.textContent = questionIndex === questions.length - 1 ? (currentLanguage === "hi" ? "परिणाम देखें" : "See final result") : (currentLanguage === "hi" ? "अगला प्रश्न" : "Next question");
  answered = false; answerOptions.replaceChildren();
  q.options.forEach((option, index) => {
    const button = document.createElement("button"); button.type = "button"; button.className = "answer-button"; button.textContent = option[currentLanguage];
    button.addEventListener("click", () => {
      if (answered) return; answered = true;
      const correct = index === q.answer;
      if (correct) { score++; quizFeedback.textContent = q.explanation[currentLanguage]; quizFeedback.classList.add("good"); button.classList.add("correct"); }
      else { quizFeedback.textContent = (currentLanguage === "hi" ? "यह सही उत्तर नहीं है। " : "Not quite. ") + q.explanation[currentLanguage]; quizFeedback.classList.add("bad"); button.classList.add("incorrect"); answerOptions.children[q.answer].classList.add("correct"); }
      Array.from(answerOptions.children).forEach(b => b.disabled = true);
      scoreText.textContent = (currentLanguage === "hi" ? "अंक: " : "Score: ") + score;
      nextQuestion.disabled = false;
    });
    answerOptions.appendChild(button);
  });
}
nextQuestion.addEventListener("click", () => {
  if (quizFinished) { questionIndex = 0; score = 0; scoreText.textContent = currentLanguage === "hi" ? "अंक: 0" : "Score: 0"; renderQuestion(); return; }
  if (!answered) return;
  if (questionIndex < questions.length - 1) { questionIndex++; renderQuestion(); }
  else {
    quizFinished = true;
    questionCount.textContent = currentLanguage === "hi" ? "प्रश्नोत्तरी पूरी हुई" : "Quiz complete";
    questionText.textContent = currentLanguage === "hi" ? `आपके ${questions.length} में से ${score} अंक हैं।` : `You scored ${score} out of ${questions.length}.`;
    answerOptions.replaceChildren();
    quizFeedback.textContent = currentLanguage === "hi" ? (score === questions.length ? "बहुत अच्छा! इन सुरक्षा आदतों को जारी रखें।" : "अच्छा प्रयास! सुझाव पढ़ें और फिर कोशिश करें।") : (score === questions.length ? "Excellent! Keep following these safety habits." : "Good effort! Review the tips and try again.");
    quizFeedback.className = "quiz-feedback good";
    nextQuestion.textContent = currentLanguage === "hi" ? "फिर से प्रयास करें" : "Try again"; nextQuestion.disabled = false;
  }
});
renderQuestion();


