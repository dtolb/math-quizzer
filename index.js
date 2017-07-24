const config = require("./config.json");

/* Requirements */
const axios        = require("axios");
const bodyParser   = require("body-parser");
const express      = require("express");
const xmlTemplates = require("./xmlTemplates.js");

/* Paths */
const HANDLE_ANSWER   = "/outbound-calls";
const MATH_QUESTION   = "/math-question";
const VALIDATE_ANSWER = "/validate-answer";
const START_MATH      = "/start-math";
const TRANSFER_ANSWER = "/transfer-answered";
const START_GAME      = "/calls";

/* Constants */
const BWTN        = config.OUTBOUND_TN;
const callbackUrl = `${config.CALLBACK_URL}${HANDLE_ANSWER}`;
const expert      = config.MATH_EXPERT;
const failUrl     = "https://s3.amazonaws.com/bwdemos/failure.mp3";
const successUrl  = "https://s3.amazonaws.com/bwdemos/success.mp3";

/* Express setup */
let app = express();
app.use(bodyParser.json());
const http = require("http").Server(app);
app.set("port", process.env.PORT || 3000);

/* 'SDK' Setup */
let bandwidth = axios.create({
  baseURL: config.BW_URL,
  headers: { "Content-type": "application/json" }
});

const createCall = async params => {
  console.log(params);
  return bandwidth.post("/calls", params);
};

/* Random Math */
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

/* Entry point for the app */
app.post(START_GAME, async (req, res) => {
  const to = req.body.number;
  try {
    const call = await createCall({
      from: BWTN,
      to,
      callbackUrl
    });
    res.header("Location", call.headers.location);
    res.status(201).send("Created");
  } catch (e) {
    console.log("------<ERRRRRORRRR>-----");
    console.log(e.Error);
    console.log("-----</ERRRRRORRRR>-----");
    res.send(e);
  }
});

/* Validate the DTMF against the correct answer */
app.post(VALIDATE_ANSWER, (req, res) => {
  console.log("------<Gather!>------");
  console.log(req.body);
  console.log("------</Gather>------");
  let tag;
  try {
    tag = JSON.parse(req.body.tag);
  } catch (e) {
    console.error("CAN NOT PARSE TAG!!");
    tag = {
      sum: 0,
      incorrectCount: 0
    };
  }
  let sentence;
  let playAudirl = successUrl;
  if (tag.sum == req.body.digits) {
    sentence = "Great Job!";
  } else {
    tag.incorrectCount += 1;
    playAudioUrl = failUrl;
    sentence = `Sorry that\'s wrong, the correct answer was ${tag.sum}, you have missed ${tag.incorrectCount} questions`;
  }
  let bxml;
  if (tag.incorrectCount >= 3) {
    const params = {
      sentence: `You have missed ${tag.incorrectCount} questions, connecting you with homework hotline`,
      playAudioUrl,
      transferTo: expert,
      reqUrl: HANDLE_ANSWER,
      xferUrl: TRANSFER_ANSWER,
      tag: `User has missed ${tag.incorrectCount} Questions`,
    };
    bxml = xmlTemplates.playAudioSpeakTransferRequrl(params);
  } else {
    bxml = xmlTemplates.playAudioSpeakRedirectTag({
      playAudioUrl,
      sentence,
      reqUrl: MATH_QUESTION,
      tag: JSON.stringify(tag)
    });
  }
  console.log(bxml);
  res.send(bxml);
});

/* Generate and ask a math question */
app.post(MATH_QUESTION, (req, res) => {
  const val1 = getRandomInt(0, 9);
  const val2 = getRandomInt(0, 9);
  let runningCount;
  try {
    runningCount = JSON.parse(req.body.tag).incorrectCount;
    if (!runningCount) {
      runningCount = 0;
    }
  } catch (e) {
    console.error("CAN NOT PARSE TAG!!");
    runningCount = 0;
  }
  const tag = {
    sum: val1 + val2,
    incorrectCount: runningCount
  };
  const gatherParams = {
    sentence: `What is ${val1} plus ${val2}?`,
    maxDigits: 2,
    tag: JSON.stringify(tag),
    reqUrl: VALIDATE_ANSWER
  };
  const bxml = xmlTemplates.gather(gatherParams);
  console.log(bxml);
  res.send(bxml);
});

/* User wants to play so let's kick it off */
app.post(START_MATH, (req, res) => {
  console.log("------<Gather!>------");
  console.log(req.body);
  console.log("------</Gather>------");
  let sentence = "Sorry you don't want to play";
  let bxml;
  if (req.body.tag === req.body.digits) {
    sentence = "OK! Let's start math quizzer";
    bxml = xmlTemplates.speakThenRedirect(sentence, MATH_QUESTION);
  } else {
    bxml = xmlTemplates.speak(sentence);
  }
  console.log(bxml);
  res.send(bxml);
});

app.post(TRANSFER_ANSWER, (req, res) => {
  console.log("------<Transfer Answered!>------");
  console.log(req.body);
  console.log("------</Transfer Answered>------");
  const bxml = xmlTemplates.speak(req.body.tag);
  console.log(bxml);
  res.send(bxml);
});

/* Handle the answer event for outbound calls */
app.post(HANDLE_ANSWER, (req, res) => {
  console.log("-----<Call Answered!>---------");
  console.log(req.body);
  console.log("-----</Call Answered>---------");
  const gatherParams = {
    sentence: "Welcome to Math Quizzer! Please press 1 to continue",
    maxDigits: 1,
    tag: "1",
    reqUrl: START_MATH
  };
  const bxml = xmlTemplates.gather(gatherParams);
  console.log(bxml);
  res.send(bxml);
});

http.listen(app.get("port"), async () => {
  console.log("listening on *:" + app.get("port"));
});
