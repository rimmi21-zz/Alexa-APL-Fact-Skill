/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const myDocument = require('main.json');

const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  handle(handlerInput) {
    const factArr = data;
    const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];
    const speechOutput = GET_FACT_MESSAGE + randomFact;
    
   // const responseBuilder = handlerInput.responseBuilder;
    if(supportsAPL(handlerInput))
    {
         return handlerInput.responseBuilder
      .speak(speechOutput)
      .addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        version: '1.0',
        document: myDocument,
        datasources: {
          response: {
            text: randomFact,
            title: "Monkey Fact :",
            url:"https://monkeyfacts.s3.ap-south-1.amazonaws.com/monkey.jpg",
            logo:"https://monkeyfacts.s3.ap-south-1.amazonaws.com/icon_512_A2Z.png"
          },
        },
      })
      .getResponse();
    }
    else
    {
        return handlerInput.responseBuilder.withSimpleCard(SKILL_NAME.randomFact).speak(speechOutput).getResponse();
    }
   
  },
};
function supportsAPL(handlerInput) {
  const supportedInterfaces = handlerInput.requestEnvelope.context
    .System.device.supportedInterfaces;
  const aplInterface = supportedInterfaces['Alexa.Presentation.APL'];
  return aplInterface != null && aplInterface !== undefined;
}
const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};



const SKILL_NAME = 'Monkey Facts';
const GET_FACT_MESSAGE = 'Here\'s your monkey fact: ';
const HELP_MESSAGE = 'You can say tell me a monkey fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const data = [
  'There are currently 264 known monkey species.',
  'Apes are not monkeys.',
  'Some monkeys live on the ground, while others live in trees.',
  'Most monkeys have tails.',
  'Mandrill is the largest type of monkey, weighing up to 35 kg.',
  'Spider monkeys get their name because of their long tail.',
  'Raw and cooked brain of dead monkey is widely consumed.',
];

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetNewFactHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
