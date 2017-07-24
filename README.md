# MATH QUIZZER

This is a sample application for Bandwidth voice v2. It is a simple math quiz that tests all the available verbs and callbacks.

### Flow

Math quizzer makes a call to a specified number and asks them to begin.

* If the user presses `1` they begin the quiz, otherwise the call is ended
* Math quizzer asks simple addition questions.
* If the users misses 3 questions total, they are forwarded to a `MATH_EXPERT`
* After talking with the `MATH_EXPERT` the incorrect count is cleared and they start the quiz again

## Setup
Modify the `config.json` file to include:

* `OUTBOUND_TN` = The caller-id of the outbound call
* `MATH_EXPERT` = The phonenumber to transfer the outbound call
* `CALLBACK_URL` = The URL of your server.
* `BW_URL` = The URL of the sneak preview _with accountId set_.

```js
{
    "OUTBOUND_TN"  : "+17079311113",
    "MATH_EXPERT"  : "+19194443333",
    "CALLBACK_URL" : "http://your_root_url.com",
    "BW_URL"       : "http://api.ADDRESS_OF_SLINGSHOT/v2/accounts/1234/"
}
```

## Install

* Clone this repo.
* Run `npm install`
* By default listens on Port 3000
    * Set **ENVIRONMENT VARIABLE** `PORT` to change

## Run

Once installed, run the app

```$ node index.js```

## Start Math Quizzer

The app listens at endpoint `/calls` for a `POST` request to initiate the quiz.

```http
POST http://your_root_url.com/calls
Content-Type: application/json

{
    "number": "+18284443333"
}
```

The app will call the `number` specified and ask them to start math quizzer.
