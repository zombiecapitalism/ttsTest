const speakButton = document.getElementById("speak-btn");
const stopButton = document.getElementById("stop-btn");
const prevButton = document.getElementById("prev-btn");
const pauseButton = document.getElementById("pause-btn");
const resumeButton = document.getElementById("resume-btn");
const nextButton = document.getElementById("next-btn");
const textInput = document.getElementById("text-input");
const displayTextElement = document.getElementById("display-text");

const synth = window.speechSynthesis;

let currentSentenceIndex = 0;

let currentSentencelength = 0;

function detectLanguage(text) {
  const koreanRegex = /[\u3131-\uD79D]/;
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/;
  const chineseRegex = /[\u4e00-\u9fa5]/;

  if (koreanRegex.test(text)) {
    return "ko-KR";
  } else if (japaneseRegex.test(text)) {
    return "ja-JP";
  } else if (chineseRegex.test(text)) {
    return "zh-CN";
  } else {
    return "en-US";
  }
}

function updateDisplayText(sentences, currentIndex) {
  let newText = "";

  sentences.forEach((sentence, index) => {
    if (index === currentIndex) {
      newText += `<mark>${sentence}</mark>`;
    } else {
      newText += sentence;
    }
  });

  displayTextElement.innerHTML = newText;
}

function speakText(startIndex) {
  const text = textInput.value;
  if (!text) return;
  
  const sentences = text.match(/[^.!?]+(?:[.!?]+(?:\s|$)|\s+$|$)/g) || [text];

  currentSentencelength = sentences.length;

  for (let i = startIndex; i < currentSentencelength; i++) {
    const sentence = sentences[i];
    const language = detectLanguage(sentence);
    let utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = language;
    utterance.onstart = function () {
      updateDisplayText(sentences, i);
    };


    if (i === sentences.length - 1) {
      utterance.onend = function () {
        currentSentenceIndex = 0;
      };
    } else {
      utterance.onend = function () {
        currentSentenceIndex = i + 1;
      };
    }

    synth.speak(utterance);
  }
}

function stopText() {
  currentSentenceIndex = 0;
  synth.cancel();
}

function pauseText() {
  synth.pause();
}

function resumeText() {
  synth.resume();
}

function prevText() {
  synth.cancel();
  currentSentenceIndex = Math.max(0, currentSentenceIndex - 1);
  speakText(currentSentenceIndex);
}

function nextText() {
  synth.cancel();
  currentSentenceIndex = Math.min(currentSentencelength - 1, currentSentenceIndex + 1);
  speakText(currentSentenceIndex);
}

speakButton.addEventListener("click", function() {speakText(0)});
stopButton.addEventListener("click", function() {stopText()});
pauseButton.addEventListener("click", function() {pauseText()});
resumeButton.addEventListener("click", function() {resumeText()});
prevButton.addEventListener("click", function() {prevText()});
nextButton.addEventListener("click", function() {nextText()});