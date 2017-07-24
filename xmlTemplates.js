module.exports = {
    speak: (sentence) => {
        return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
   <SpeakSentence voice="Elaine">
      ${sentence}
   </SpeakSentence>
</Response>`
    },
    speakThenRedirect: (sentence, reqUrl) => {
        return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
   <SpeakSentence voice="Elaine">
      ${sentence}
   </SpeakSentence>
   <Redirect requestUrl="${reqUrl}"/>
</Response>`
    },
    speakThenRedirectWithTag: (params) => {
        return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
   <SpeakSentence voice="Elaine">
      ${params.sentence}
   </SpeakSentence>
   <Redirect requestUrl="${params.reqUrl}" tag='${params.tag}'/>
</Response>`
    },
    playAudioSpeakRedirectTag: (params) => {
        return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
   <SpeakSentence voice="Elaine">
      ${params.sentence}
   </SpeakSentence>
   <PlayAudio>${params.playAudioUrl}</PlayAudio>
   <Redirect requestUrl="${params.reqUrl}" tag='${params.tag}'/>
</Response>`
    },
    gather: (params) => {
        return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather requestUrl="${params.reqUrl}" timeout="10000" maxDigits="${params.maxDigits}" tag='${params.tag}'>
        <SpeakSentence voice="Emily">${params.sentence}</SpeakSentence>
    </Gather>
</Response>`
    },
    defaultGather: `<?xml version="1.0" encoding="UTF-8"?>
<Response>
   <Gather requestUrl="/validate-gather" timeout="10000" terminatingDigits="#" tag="1" maxDigits="1">
      <SpeakSentence voice="Emily">Please press a digit.</SpeakSentence>
   </Gather>
</Response>`,
    speakThenTransferWithRequrl: (params) => {
        return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <SpeakSentence voice="Emily">${params.sentence}</SpeakSentence>
    <Transfer requestUrl='${params.reqUrl}'>
        <PhoneNumber requestUrl="${params.xferUrl}">${params.transferTo}</PhoneNumber>
    </Transfer>
</Response>`
    },
    playAudioSpeakTransferRequrl: (params) => {
        return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <PlayAudio>${params.playAudioUrl}</PlayAudio>
    <SpeakSentence voice="Emily">${params.sentence}</SpeakSentence>
    <Transfer requestUrl='${params.reqUrl}'>
        <PhoneNumber requestUrl="${params.xferUrl}" tag="${params.tag}">${params.transferTo}</PhoneNumber>
    </Transfer>
</Response>`
    }
}