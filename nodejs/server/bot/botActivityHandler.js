// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {
  TeamsActivityHandler,
  CardFactory,
  MessageFactory,
  TurnContext,
  TeamsInfo,
  ActivityHandler,
  BotFrameworkAdapter,
  ActionTypes,
} = require("botbuilder");
const adaptiveCards = require("../models/adaptiveCard");
const conversationReferences = {};
const conversationDataReferences = {};
const fetch = require("../api/fetch");

// The accessor name for the conversation data property accessor.
const MEETING_DATA_PROPERTY = "meetingData";

var meetingId = "",
  meetingStartTime = "",
  chatId = "";
  estimatedSalary = false;
  annualSalary = false;

class BotActivityHandler extends TeamsActivityHandler {
  constructor(conversationState) {
    super();
    // Create the state property accessor for the conversation data.
    this.conversationDataAccessor = conversationState.createProperty(
      MEETING_DATA_PROPERTY
    );

    // The state management object for the conversation state.
    this.conversationState = conversationState;

    // Called when the bot is added to a team.
    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      for (let cnt = 0; cnt < membersAdded.length; cnt++) {
        if (membersAdded[cnt].id !== context.activity.recipient.id) {
          var welcomeText = "Hello and welcome!";
          await context.sendActivity(MessageFactory.text(welcomeText));
        }
      }

      // Calling method to set conversation reference.
      this.addConversationReference(context.activity);

      // Calling method to set conversation data reference that has roster information.
      this.addConversationDataReference(context);
      await next();
    });

    // Activity called when there's a message in channel
    this.onMessage(async (context, next) => {
      console.log("onMessage", context);
      var replyText = context.activity.text;
      await context.sendActivity(
        MessageFactory.text(`You sent '${replyText}'`)
      );
      await next();
    });

    this.onTurn(async (context, next) => {
      console.log("onTurn=>", "context");
      await next();
    });

    this.onEvent(async (context, next) => {
      console.log("onEvent=>", "context");
      await next();
    });

    this.onUnrecognizedActivityType(async (context, next) => {
      console.log("onUnrecognizedActivityType=>", "context");
      await next();
    });

    this.onConversationUpdate(async (context, next) => {
      console.log("onConversationUpdate=>", "context");
      await next();
    });

    // this.onTeamsMembersAdded(async (membersAdded, teamInfo, context, next) => {
    // code for handling
    // console.log('membersAdded', membersAdded, 'teamInfo', teamInfo, 'context', context)
    // await next();
    //  });

    //   this.onTeamsMembersAddedEvent(async (membersAdded, teamInfo, turnContext, next) => {
    //     console.log('onTeamsMembersAddedEvent', membersAdded, 'teamInfo', teamInfo, 'context', turnContext);
    //     let newMembers = '';
    //     console.log(JSON.stringify(membersAdded));
    //     membersAdded.forEach((account) => {
    //         newMembers += account.id + ' ';
    //     });
    //     const name = !teamInfo ? 'not in team' : teamInfo.name;
    //     const card = CardFactory.heroCard('Account Added', `${newMembers} joined ${name}.`);
    //     const message = MessageFactory.attachment(card);
    //     // Sends a message activity to the sender of the incoming activity.
    //     await turnContext.sendActivity(message);
    //     await next();
    // });

    this.onMembersAddedActivity(async (context, next) => {
      console.log("onMembersAddedActivity");
      await Promise.all(
        (context.activity.membersAdded || []).map(async (member) => {
          if (
            member.id !== context.activity.recipient.id &&
            context.activity.conversation.conversationType !== "personal"
          ) {
            await context.sendActivity(
              `Welcome to the team ${member.givenName} ${member.surname}`
            );
          }
        })
      );

      await next();
    });
  }

  // async onMessageActivity(context) {
  //   console.log('onMessageActivity=========>', "context");
  // }

  // async onUnrecognizedActivity(context) {
  //   console.log('onUnrecognizedActivity=========>', "context");
  // }

  // async onConversationUpdateActivity(context) {
  //   console.log('onConversationUpdateActivity=========>', "context");
  // }

  // async onEventActivity(context) {
  //   console.log('onEventActivity=========>', "context");
  // }

  // async onInvokeActivity(context) {
  //   console.log('onInvokeActivity=========>', "context");
  // }

  // async onSignInInvoke(context) {
  //   console.log('onSignInInvoke=========>', "context");
  // }

  // async onEndOfConversationActivity(context) {
  //   console.log('onEndOfConversationActivity=========>', "context");
  // }

  // async onTypingActivity(context) {
  //   console.log('onTypingActivity=========>', "context");
  // }

  // async onInstallationUpdateActivity(context) {
  //   console.log('onInstallationUpdateActivity=========>', "context");
  // }

  // async onCommandActivity(context) {
  //   console.log('onCommandActivity=========>', "context");
  // }

  // async onCommandResultActivity(context) {
  //   console.log('onCommandResultActivity=========>', "context");
  // }

  // async dispatchInstallationUpdateActivity(context) {
  //   console.log('dispatchInstallationUpdateActivity=========>', "context");
  // }

  // async onInstallationUpdateAddActivity(context) {
  //   console.log('onInstallationUpdateAddActivity=========>', "context");
  // }

  // async onInstallationUpdateRemoveActivity(context) {
  //   console.log('onInstallationUpdateRemoveActivity=========>', "context");
  // }

  // async dispatchConversationUpdateActivity(context) {
  //   console.log('dispatchConversationUpdateActivity=========>', "context");
  // }

  // async onMessageReactionActivity(context) {
  //   console.log('onMessageReactionActivity=========>', "context");
  // }

  // async onReactionsAddedActivity(context) {
  //   console.log('onReactionsAddedActivity=========>', "context");
  // }

  // async onReactionsRemovedActivity(context) {
  //   console.log('onReactionsRemovedActivity=========>', "context");
  // }

  // async dispatchMessageReactionActivity(context) {
  //   console.log('dispatchMessageReactionActivity=========>', "context");
  // }

  // async dispatchEventActivity(context) {
  //   console.log('dispatchEventActivity=========>', "context");
  // }

  // async defaultNextEvent(context) {
  //   console.log('defaultNextEvent=========>', "context");
  // }

  async onTurnActivity(context) {
    // console.log('context.activity', context.activity);

    // Get the state properties from the turn context.
    const conversationData = await this.conversationDataAccessor.get(context, {
      startTime: "",
      meetingId: "",
      chatId: "",
    });

    // if (context.activity.type === 'installationUpdate') {
    //   console.log('installationUpdate=========>', 'on bot added');
    // }

    if (
      context.activity.type === "event" &&
      context.activity.name === "application/vnd.microsoft.meetingStart"
    ) {
      console.log('called')
      var meetingObject = context.activity.value;
      // conversationData.startTime = meetingObject.StartTime;
      // conversationData.chatId = context.activity.conversation.id;
      chatId = context.activity.conversation.id;
      meetingStartTime = meetingObject.StartTime;
      // meetingId = context.activity.value.Id;
      await context.sendActivity({
        attachments: [
          CardFactory.adaptiveCard(
            adaptiveCards.adaptiveCardForMeetingStart(meetingObject)
          ),
        ],
      });

      // Save any state changes. The load happened during the execution of the Dialog.
      // await this.conversationState.saveChanges(context, false);

      var members = await TeamsInfo.getMembers(context);

      // call api to store in db
      let body = {
        // chatId: context.activity.conversation.id,
        chatId: chatId,
        title: meetingObject.Title,
        startTime: meetingObject.StartTime,
        meetingId: meetingObject.Id,
        joinUrl: meetingObject.JoinUrl,
        meetingType: meetingObject.MeetingType,
        dateTime: new Date(),
      };
      await fetch
        .callApi(`http://localhost:3001/botApi/add-meeting`, "post", "", body)
        .then((res) => {
          meetingId = res.result.recordset[0].lastInsertId;
          // conversationData.meetingId = res.lastMeetingId.recordset[0].lastInsertId;
        });
    }
    if (
      context.activity.type === "event" &&
      context.activity.name === "application/vnd.microsoft.meetingEnd"
    ) {
      var meetingObject = context.activity.value;
      // var startTime = conversationData.startTime;

      var startTime = meetingStartTime;
      var timeDuration = new Date(meetingObject.EndTime) - new Date(startTime);
      var minutes = Math.floor(timeDuration / 60000);
      var seconds = ((timeDuration % 60000) / 1000).toFixed(0);
      var meetingDurationText =
        minutes >= 1 ? minutes + "min " + seconds + "s" : seconds + "s";

      await context.sendActivity({
        attachments: [
          CardFactory.adaptiveCard(
            adaptiveCards.adaptiveCardForMeetingEnd(
              meetingObject,
              meetingDurationText
            )
          ),
        ],
      });

      // call api to store in db
      let body = {
        endTime: meetingObject.EndTime,
        meetingId: meetingId + "",
        chatId: chatId,
        // meetingId: conversationData.meetingId + '',
        duration: meetingDurationText,
      };
      // console.log('body=>', body);
      const res = await fetch.callApi(
        `http://localhost:3001/botApi/update-meeting`,
        "post",
        "",
        body
      );
      // console.log('res meetingEnd=>', res);
    }

    if (context.activity.type === "conversationUpdate") {
      // member added to meeting
      if (context.activity.membersAdded) {
        const membersAdded = context.activity.membersAdded;
        for (let cnt = 0; cnt < membersAdded.length; cnt++) {
          var members = await TeamsInfo.getMembers(context);
          //  console.log( 'members=>',members);
          const filteredMember = members.filter(
            (member) => member.id === membersAdded[cnt].id
          );

          let addedMember =
            filteredMember && filteredMember.length > 0
              ? filteredMember[0].name
              : "";
          if (membersAdded[cnt].id !== context.activity.recipient.id) {
            var welcomeText = `Hello and welcome ${addedMember}!`;
            await context.sendActivity(MessageFactory.text(welcomeText));

            // const chatId = context.activity.conversation.id;
            // call api to store in db

            let body = {
              // memberId: membersAdded[cnt].id,
              memberId: membersAdded[cnt].aadObjectId,
              startTime: context.activity.timestamp, //2023-01-05T05:56:44.046Z
              chatId: chatId,
              meetingId: meetingId + "",
              // meetingId: conversationData.meetingId + '',
              name: addedMember,
            };
            // console.log('membersAdded=>', membersAdded[cnt]);
            // console.log('body=> ininnnnnnn', body);
            await fetch.callApi(
              `http://localhost:3001/botApi/add-meeting-member`,
              "post",
              "",
              body
            ).then((res)=>{
              console.log('res got')
            })

            // create new conversation

            // const message = MessageFactory.text(
            //   `Hello ${ filteredMember[0].givenName } ${ filteredMember[0].surname }. I'm a Teams conversation bot.`
            // );
              console.log(filteredMember[0], 'filteredMember')
            this.createNewConversation(context, welcomeText, filteredMember[0]);
          }
        }
      }

      if (context.activity.membersRemoved) {
        const membersRemoved = context.activity.membersRemoved;
        // console.log('removed activity', context.activity);
        for (let cnt = 0; cnt < membersRemoved.length; cnt++) {
          if (membersRemoved[cnt].id !== context.activity.recipient.id) {
            var welcomeText = "Hello and bye!";
            await context.sendActivity(MessageFactory.text(welcomeText));
            // const chatId = context.activity.conversation.id;
            // call api to store in db
            let body = {
              memberId: membersRemoved[cnt].id,
              endTime: context.activity.timestamp, //2023-01-05T05:56:44.046Z
              chatId: chatId,
              meetingId: meetingId + "",
              // meetingId: conversationData.meetingId + '',
            };
            const res = await fetch.callApi(
              `http://localhost:3001/botApi/update-meeting-member`,
              "post",
              "",
              body
            );
            // console.log('res memberRemoved=>', res);
          }
        }
      }
      /*
      // Loop through all members that were just added to the team
      for (var i = 0; i < members.length; i++) {

          // See if the member added was our bot
          if (!members[i].id.includes("7279c8ee-8e0d-429e-b99d-db7ab406ac1b")) {
              //var botmessage = new builder.Message()
              //    .address(msg.address)
              //    .text('Hello World!');

              //bot.send(botmessage, function(err) {});
              var replyText = "Hello";
              await context.sendActivity(MessageFactory.text(`You sent '${replyText}'`));
          }
      }
      */
    }

    if (context.activity.type === "message") {

      const text = context.activity.text.trim().toLocaleLowerCase();
      var members = await TeamsInfo.getMembers(context);
      console.log(members,'members')

      let cardAnnualSalaryActions = await this.getSalaryCardSelectionOptions();
      let cardEstimatedSalaryActions = await this.getCardSelectionOptions();
      let cardActions = await this.getQuestionCardOptions();

      // if (text.includes("start")) {
      //   await this.sendSelectionOptionCard(context, cardActions);
      // } else if (text.includes("reset")) {
      //   await this.sendSelectionOptionCard(context, cardActions);
      // } 
      if (text.includes("start")) {
        await this.createNewConversation(context,'Hello',members[0])
        // await this.sendQuestionCard(context, cardActions);
      } else if (text.includes("reset")) {
        await this.sendQuestionCard(context, cardActions);
      }else if(text === 'yes'){
        annualSalary = true;
        estimatedSalary = false;
        await this.sendSelectionOptionCard(context, cardAnnualSalaryActions);
      }else if(text === 'no'){
        estimatedSalary = true;
        annualSalary = false;
        await this.sendRangeSelectionOptionCard(context, cardEstimatedSalaryActions);
      }else if(text === 'questions'){
        console.log('Start')
        await this.sendQuestionCard(context, cardActions);
      }
      else{
        let selection = text;
        if(estimatedSalary == true){
          let lowervalue = context.activity.text.split('To')[0];
          let highervalue = context.activity.text.split('To')[1];
  
          if (selection) {
            await this.cardActivityResultAsync(context, selection);
            await this.storeMemberCost(context, context.activity.text.split('To')[0],context.activity.text.split('To')[1]);
          } else {
            await this.cardActivityAsync(context);
          }
        }else{
          if (selection) {
            await this.cardActivityResultAsync(context, selection);
            await this.storeMemberCost(context,null,null, context.activity.text);
          } else {
            await this.cardActivityAsync(context);
          }
        }
        console.log('estimatedSalary',estimatedSalary,annualSalary,selection)
      }
      // else {
      //   console.log("selection", text);
        // let selection = text;

        //   // let selection = parseInt(text , 10);
        // 
    }
  }

  // Method to set conversation reference.
  addConversationReference(activity) {
    const conversationReference =
      TurnContext.getConversationReference(activity);
    conversationReferences[conversationReference.conversation.id] =
      conversationReference;
  }

  // Method to set conversation data reference that has roster information.
  async addConversationDataReference(context) {
    var members = await TeamsInfo.getMembers(context);
    conversationDataReferences["members"] = members;
  }

  async createNewConversation(context, message, member) {
    // const convoParams = {
    //     members: [{
    //       id: member.id
    //     }],
    //     tenantId: context.activity.channelData.tenant.id,
    //     activity: context.activity
    // };

    // await context.adapter.createConversationAsync(
    //     process.env.MicrosoftAppId,
    //     context.activity.channelId,
    //     context.activity.serviceUrl,
    //     null,
    //     convoParams,
    //     async (context) => {
    //         const ref = TurnContext.getConversationReference(context.activity);

    //         await context.adapter.continueConversationAsync(
    //             process.env.MicrosoftAppId,
    //             ref,
    //             async (context) => {
    //                 await context.sendActivity(message);
    //             });
    //     });

    // const ref = TurnContext.getConversationReference(context.activity);
    // await context.adapter.createConversation(
    //     ref,
    //     convoParams,
    //     async (context) => {
    //       await context.sendActivity(message);
    //     });

    // const mention = {
    //   mentioned: member,
    //   text: `<at>${new TextEncoder().encode(context.activity.from.name)}</at>`,
    //   type: "mention"
    // };
    // const replyActivity = MessageFactory.text(`Hi ${mention.text} from a one to one personal chat.`);
    // replyActivity.entities = [mention];
    // await context.sendActivity(replyActivity);

    // var address =
    // {
    //     channelId: 'msteams',
    //     user: { id: member.id },
    //     channelData: {
    //         tenant: {
    //             id: process.env.MicrosoftAppTenantId
    //         }
    //     },
    //     bot:
    //     {
    //         id: process.env.MicrosoftAppId,
    //         name: 'appName'
    //     },
    //     serviceUrl: context.activity.serviceUrl,
    //     useAuth: true
    // }

    // var msg = new builder.Message().address(address);
    // msg.text('Hello, this is a notification');
    // bot.send(msg);

    // const adapter = new BotFrameworkAdapter({
    //   appId: process.env.MicrosoftAppId,
    //   appPassword: process.env.MicrosoftAppPassword
    // });
    // const conversationParameters = {
    //   isGroup: true,
    //   channelData: {
    //     channel: {
    //       id: context.activity.channelId
    //     },
    //     tenant: {
    //       id: process.env.MicrosoftAppTenantId
    //     }
    //   },
    //   activity: 'OneOnOne',
    //   members: [
    //     {
    //       id: member.id
    //     }
    //   ]
    // };

    // const connectorClient = adapter.createConnectorClient(
    //   context.activity.serviceUrl
    // );
    // const conversationResourceResponse = await connectorClient.conversations.createConversation(
    //   conversationParameters
    // );

    // const conversationReference = TurnContext.getConversationReference(
    //   context.activity
    // );
    // console.log(conversationResourceResponse.id, conversationResourceResponse);
    // conversationReference.conversation.id = conversationResourceResponse.id;
    // return [conversationReference, conversationResourceResponse.activityId];

    // const msBotAdapter = new BotFrameworkAdapter({
    //   appId: process.env.MicrosoftAppId,
    //   appPassword: process.env.MicrosoftAppPassword
    // });

    // const conversationReference = {
    //   bot : {
    //       id : context.activity.MicrosoftAppId,
    //   },
    //   conversation : {
    //        id: context.activity.channelId
    //   },
    //   serviceUrl : context.activity.serviceUrl
    // }

    // await msBotAdapter.createConversation(
    //   conversationReference,
    //   async turnContext => {
    //     await turnContext.sendActivity('Test Message');
    //   }
    // );

    var conversationReference = TurnContext.getConversationReference(
      context.activity
    );
    // var connectorClient = await context.adapter.createConnectorClient(context)

    // let channelDt = await context.getTeamsChannelData();
    // console.log(channelDt);

    // var conversationParameters = {
    //   isGroup: true,
    //   bot: conversationReference.bot,
    //   channelData: (await context.getTeamsChannelData()),
    //   tenantId: context.tenant.id,
    //   activity: MessageFactory.text("Queue Summary Placeholder"),
    //   members: [
    //         {
    //           id: member.id
    //         }
    //       ]
    // }

    // await connectorClient.conversations.createConversation(conversationParameters)

    // await context.adapter.continueConversation(
    //   conversationReference,
    //   async (context) => {
    //       await context.sendActivity(message);
    //   });

    console.log('member',member)
    const conversationParameters = {
      isGroup: false,
      channelData: {
        channel: {
          id: context.activity.channelId,
        },
        tenant: {
          id: process.env.MicrosoftAppTenantId,
          // id: '6403ff52-7fe4-4f52-8a19-250c9d8736ab'
          // id: '8d6cd862-aca1-490d-9dde-c5aa72052b0b'
        },
      },
      //activity: 'OneOnOne',
      members: [
        {
           id: member.id,
          // id: '29:1ob-DgrdvJ1DlwTN4nr1X5jSkpedv-TuwZEsshE4NUMl53QyqnAwmbQYCFy3wok1t1HRv3WKTsewiLbu3OBiDnw'
          //// id: '29:196RuDBUPNu4ny94vA6sBErFUYzVzKufiW_fMbQYPqjltCRN_vEzVsxhu32st2-HoEUcGTI-YMm6OXfW-B1hCeQ'
          // id: '29:1tY7xZsfREdyhXEV3nj0vlWjyZ5s9h_4W4HNEgGSsfkSQuZ__DrPJuXKO22vmZMaN44nKqPhS4MJaMZS9IPUgLw'
          // id: '29:1USoEjWsaKJYRwO2hSvPP93OZMDLgF_YCp_6sbc9DV84LQagrJWCm4WFFHDg-6zdgPqqT_6BZxdAx2KpTahYvWw'
          // id: '29:1ob-DgrdvJ1DlwTN4nr1X5jSkpedv-TuwZEsshE4NUMl53QyqnAwmbQYCFy3wok1t1HRv3WKTsewiLbu3OBiDnw'
        },
      ],
      tenantId: "6403ff52-7fe4-4f52-8a19-250c9d8736ab",
      topicName: "OneOnOne Conversation",
      // bot: context.activity.recipient
    };

    // await context.adapter.createConversation(
    //   conversationReference,
    //   conversationParameters,
    //   async (context) => {
    //     // await context.sendActivity(message + ` test msg`);
    //     let title = `Welcome to Teams !`;
    //     await context.sendActivity({
    //       attachments: [
    //         CardFactory.adaptiveCard(
    //           adaptiveCards.adaptiveCardForMeetingJoin(title, message)
    //         ),
    //       ],
    //     });
    //     await this.cardActivityAsync(context);
    //   }
    // );

    // var members = await TeamsInfo.getMembers(context);
    //       //  console.log( 'members=>',members);
    //       // const filteredMember = members.filter(
    //       //   (member) => member.id === membersAdded[cnt].id
    //       // );
    //   console.log(members['name'])
    await context.adapter.createConversation(
      conversationReference,
      conversationParameters,
      async (context) => {
        // await context.sendActivity(message + ` test msg`);
        let title = `Bilions Teams welcomes you,` + context.activity.from.name + '!';
        await context.sendActivity({
          attachments: [
            CardFactory.adaptiveCard(
              adaptiveCards.adaptiveCardForMeetingJoin(title, message)
            ),
          ],
        });
  
        // await this.sendWelcomeCard(context, cardActions);
        // await this.cardActivityAsync(context);
      }
    );
  }

  cardActivityAsync = async (context) => {
    const cardActions = [
      {
        type: ActionTypes.MessageBack,
        title: "Start earning.",
        value: null,
        text: "Start",
      },
      // {
      //   type: ActionTypes.MessageBack,
      //     title: 'Want to change settings.',
      //     value: null,
      //     text: 'Reset'
      // }
    ];

    await this.sendWelcomeCard(context, cardActions);
  };

  sendWelcomeCard = async (context, cardActions) => {
    const card = CardFactory.heroCard(
      "Welcome to Bilions Teams!",
      'Click Button or Type "Start" to get started.',
      null,
      cardActions
    );
    await context.sendActivity(MessageFactory.attachment(card));
  };

  sendSelectionOptionCard = async (context, cardActions) => {
    const card = CardFactory.heroCard(
      "Please select your annual salary",
      "",
      null,
      cardActions
    );
    await context.sendActivity(MessageFactory.attachment(card));
    // await context.sendActivity({
    //   attachments: [
    //     CardFactory.adaptiveCard(
    //       adaptiveCards.adaptiveCardForSalary()
    //     ),
    //   ],
    // });
  };

  sendRangeSelectionOptionCard = async (context, cardActions) => {
    const card = CardFactory.heroCard(
      "Please select your estimated annual salary",
      "",
      null,
      cardActions
    );
    await context.sendActivity(MessageFactory.attachment(card));
    // await context.sendActivity({
    //   attachments: [
    //     CardFactory.adaptiveCard(
    //       adaptiveCards.adaptiveCardForSalary()
    //     ),
    //   ],
    // });
  };

  sendQuestionCard = async (context, cardActions) => {
    const card = CardFactory.heroCard(
      "Would you like to disclose your annual salary?",
      "",
      null,
      cardActions
    );
    await context.sendActivity(MessageFactory.attachment(card));
  };

  cardActivityResultAsync = async (context, selection) => {
    const card = CardFactory.heroCard(
      `Thank you for your feedback!`,
      "",
      null,
      null
    );
    await context.sendActivity(MessageFactory.attachment(card));
  };

  getCardSelectionOptions = async () => {
    const cardActionsOptions = [
      {
        type: ActionTypes.MessageBack,
        title: "$20K - 60K",
        value: 20,
        text: "20To60",
      },
      {
        type: ActionTypes.MessageBack,
        title: "$60K- 100K",
        value: null,
        text: "60To100",
      },
      {
        type: ActionTypes.MessageBack,
        title: "$100K-$160K",
        value: null,
        text: "100To160",
      },
      {
        type: ActionTypes.MessageBack,
        title: "$160K- $220K",
        value: null,
        text: "160To220",
      },
      {
        type: ActionTypes.MessageBack,
        title: "$220K-$350K",
        value: null,
        text: "220To350",
      },
      {
        type: ActionTypes.MessageBack,
        title: "$350K-$500K",
        value: null,
        text: "350To500",
      },
    ];
    return cardActionsOptions;
  };

  getQuestionCardOptions = async () => {
    const cardActionsOptions = [
      {
        type: ActionTypes.MessageBack,
        title: "No",
        value: 0,
        text: "No",
      },
      {
        type: ActionTypes.MessageBack,
        title: "Yes",
        value: 1,
        text: "Yes",
      }
    ];
    return cardActionsOptions;
  };


  getSalaryCardSelectionOptions = async () => {
    const cardActionsOptions = [
      {
        type: ActionTypes.MessageBack,
        title: "$20K",
        value: 20,
        text: "20",
      },
      {
        type: ActionTypes.MessageBack,
        title: "$30K",
        value: 30,
        text: "30",
      },
      {
        type: ActionTypes.MessageBack,
        title: "$40K",
        value: 40,
        text: "40",
      },
      {
        type: ActionTypes.MessageBack,
        title: "$50",
        value: 50,
        text: "50",
      },
      {
        type: ActionTypes.MessageBack,
        title: "$60k",
        value: 60,
        text: "60",
      },{
        type: ActionTypes.MessageBack,
        title: "$70k",
        value: 70,
        text: "70",
      },{
        type: ActionTypes.MessageBack,
        title: "$80k",
        value: 80,
        text: "80",
      },{
        type: ActionTypes.MessageBack,
        title: "$90k",
        value: 90,
        text: "90",
      },{
        type: ActionTypes.MessageBack,
        title: "$100k",
        value: 100,
        text: "100",
      },{
        type: ActionTypes.MessageBack,
        title: "$110k",
        value: 110,
        text: "110",
      },{
        type: ActionTypes.MessageBack,
        title: "$120k",
        value: 120,
        text: "120",
      },{
        type: ActionTypes.MessageBack,
        title: "$130k",
        value: 130,
        text: "130",
      },{
        type: ActionTypes.MessageBack,
        title: "$140k",
        value: 140,
        text: "140",
      },{
        type: ActionTypes.MessageBack,
        title: "$150k",
        value: 150,
        text: "150",
      },{
        type: ActionTypes.MessageBack,
        title: "$175k",
        value: 175,
        text: "175",
      },{
        type: ActionTypes.MessageBack,
        title: "$200k",
        value: 200,
        text: "200",
      },{
        type: ActionTypes.MessageBack,
        title: "$225k",
        value: 225,
        text: "225",
      },{
        type: ActionTypes.MessageBack,
        title: "$250k",
        value: 250,
        text: "250",
      },{
        type: ActionTypes.MessageBack,
        title: "$275k",
        value: 275,
        text: "275",
      },{
        type: ActionTypes.MessageBack,
        title: "$300k",
        value: 300,
        text: "300",
      },{
        type: ActionTypes.MessageBack,
        title: "$350k",
        value: 350,
        text: "350",
      },{
        type: ActionTypes.MessageBack,
        title: "$400k",
        value: 400,
        text: "400",
      },{
        type: ActionTypes.MessageBack,
        title: "$450k",
        value: 450,
        text: "450",
      },{
        type: ActionTypes.MessageBack,
        title: "$500k",
        value: 500,
        text: "500",
      },{
        type: ActionTypes.MessageBack,
        title: "$600k",
        value: 600,
        text: "600",
      },{
        type: ActionTypes.MessageBack,
        title: "$700k",
        value: 700,
        text: "700",
      },{
        type: ActionTypes.MessageBack,
        title: "$800k",
        value: 800,
        text: "800",
      },{
        type: ActionTypes.MessageBack,
        title: "$900k",
        value: 900,
        text: "900",
      },{
        type: ActionTypes.MessageBack,
        title: "$1M",
        value: 1,
        text: "1",
      },{
        type: ActionTypes.MessageBack,
        title: "$1.5M",
        value: 1.5,
        text: "1.5",
      },{
        type: ActionTypes.MessageBack,
        title: "$2M",
        value: 2,
        text: "2",
      },{
        type: ActionTypes.MessageBack,
        title: "$2.5M",
        value: 2.5,
        text: "2.5",
      },{
        type: ActionTypes.MessageBack,
        title: "$3M",
        value: 3,
        text: "3",
      },{
        type: ActionTypes.MessageBack,
        title: "$3.5M",
        value: 3.5,
        text: "3.5",
      },{
        type: ActionTypes.MessageBack,
        title: "$4M",
        value: 4,
        text: "4",
      },{
        type: ActionTypes.MessageBack,
        title: "$4.5M",
        value: 4.5,
        text: "4.5",
      }
    ];
    return cardActionsOptions;
  };

  storeMemberCost = async (context, lowervalue, highervalue,annualSalary) => {
    // call api to store in db

    let body = {
      memberId: context.activity.from.aadObjectId,
      // meetingId: meetingId + '',
      meetingId: meetingId + "",
      chatId: chatId,
      endSalary: highervalue,
      startSalary: lowervalue,
      annualSalary: annualSalary
    };

    const res = await fetch.callApi(
      `http://localhost:3001/botApi/add-meeting-member-cost`,
      "post",
      "",
      body
    );
  };
}

module.exports.BotActivityHandler = BotActivityHandler;

// Exporting conversationReferences to be used for proactive messaging
exports.ConversationRef = conversationReferences;

// Exporting conversationDataReferences to use roster information.
exports.ConversationDataRef = conversationDataReferences;
