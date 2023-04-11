// Adaptive Card for meeting start event
const adaptiveCardForMeetingStart = (meetingObject) => ({
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  body: [
    {
      type: "TextBlock",
      size: "Medium",
      weight: "Bolder",
      text: meetingObject.Title + "- started",
    },
    {
      type: "ColumnSet",
      spacing: "medium",
      columns: [
        {
          type: "Column",
          width: 1,
          items: [
            {
              type: "TextBlock",
              size: "Medium",
              weight: "Bolder",
              text: "Start Time : ",
            },
          ],
        },
        {
          type: "Column",
          width: 3,
          items: [
            {
              type: "TextBlock",
              size: "Medium",
              text: new Date(meetingObject.StartTime).toString(),
            },
          ],
        },
      ],
    },
    {
      type: "ActionSet",
      actions: [
        {
          type: "Action.OpenUrl",
          title: "Join meeting",
          url: meetingObject.JoinUrl,
        },
      ],
    },
  ],
  type: "AdaptiveCard",
  version: "1.4",
});

// Adaptive Card for meeting end event
const adaptiveCardForMeetingEnd = (meetingObject, meetingDurationText) => ({
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  body: [
    {
      type: "TextBlock",
      size: "Medium",
      weight: "Bolder",
      text: meetingObject.Title + "- ended",
    },
    {
      type: "ColumnSet",
      spacing: "medium",
      columns: [
        {
          type: "Column",
          width: 1,
          items: [
            {
              type: "TextBlock",
              size: "Medium",
              weight: "Bolder",
              text: "End Time : ",
            },
            {
              type: "TextBlock",
              size: "Medium",
              weight: "Bolder",
              text: "Total Duration : ",
            },
          ],
        },
        {
          type: "Column",
          width: 3,
          items: [
            {
              type: "TextBlock",
              size: "Medium",
              text: new Date(meetingObject.EndTime).toString(),
            },
            {
              type: "TextBlock",
              size: "Medium",
              text: meetingDurationText,
            },
          ],
        },
      ],
    },
    {
      type: "ActionSet",
      actions: [
        {
          type: "Action.OpenUrl",
          title: "Join meeting",
          url: meetingObject.JoinUrl,
        },
      ],
    },
    {
      type: "ActionSet",
      actions: [
        {
          type: "Action.Submit",
          title: "Meeting History",
          data: {
            msteams: {
              type: "invoke",
              value: {
                type: "tab/tabInfoAction",
                tabInfo: {
                  contentUrl: process.env.BaseUrl + "/index.html#/stageView",
                  websiteUrl: process.env.BaseUrl + "/index.html#/stageView",
                  name: "Stage view",
                  entityId: "entityId",
                },
              },
            },
          },
        },
      ],
    },
  ],
});

const traileCardForMeet = () =>({
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    attachmentLayout: "carousel",
  attachments:[
       {
      contentType: "application/vnd.microsoft.card.adaptive",
         content: {
           type: "AdaptiveCard",
           version: "1.2",
           body: [
                {
                  type: "Column",
                  width: 1,
                  items: [
                    {
                      type: "TextBlock",
                      text: "- Lorem ipsum dummy text",
                      wrap: true,
                    },
                    {
                      type: "TextBlock",
                      text: "- Lorem ipsum dummy text",
                      wrap: true,
                    },
                  ],
                },
              ],
           actions: [
             {
               type: "Action.Submit",
               title: "Let's get started"
             }
           ]
         }
       },
     ]
});

const adaptiveCardForMeetingJoin = (title, message) => ({
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  body: [
    {
      type: "Image",
      url: "https://www.in.gov/iot/images/microsoftteams-rz_.png",
      altText: "Cat",
      width: "584px",
      height: "243px",
    },
    {
      type: "TextBlock",
      size: "Medium",
      weight: "Bolder",
      text: title,
    },
    {
      type: "ColumnSet",
      spacing: "medium",
      columns: [
        // {
        //   type: "Column",
        //   width: 1,
        //   items: [
        //     {
        //       type: "TextBlock",
        //       size: "Medium",
        //       weight: "Bolder",
        //       text: "Message : ",
        //     },
        //   ],
        // },
        // {
        //   type: "Column",
        //   width: 3,
        //   items: [
        //     {
        //       type: "TextBlock",
        //       size: "Medium",
        //       text: message,
        //     },
        //   ],
        // },
        {
          type: "Column",
          width: 1,
          items: [
            {
              type: "TextBlock",
              text: "- Lorem ipsum dummy text",
              wrap: true,
            },
            {
              type: "TextBlock",
              text: "- Lorem ipsum dummy text",
              wrap: true,
            },
          ],
        },
      ],
    },
    {
      type: "TextBlock",
      size: "small",
      text: "Ready to start earning? Simply click the button or type **Start**",
    },
  ],
  actions: [
    {
      type: "Action.Submit",
      title: "Start Earning",
      data: {
        msteams: {
            type: "messageBack",
            text: "Questions",
        }
      }
    }
  ],
  type: "AdaptiveCard",
  version: "1.4",
});

const adaptiveCardForSalary = () => (
  {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.0",
    "body": [
        {
            "type": "TextBlock",
            "text": "You have been assigned to ticket: T238989392",
            "weight": "Bolder",
            "size": "Medium"
        },
        {
            "type": "ColumnSet",
            "columns": [
                {
                    "type": "Column",
                    "width": "auto",
                    "items": [
                        {
                            "type": "Image",
                            "url": "https://pbs.twimg.com/profile_images/3647943215/d7f12830b3c17a5a9e4afcc370e3a37e_400x400.jpeg",
                            "size": "Small",
                            "style": "Person"
                        }
                    ]
                },
                {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Matt Hidinger",
                            "weight": "Bolder",
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "spacing": "None",
                            "text": "Assigned {{DATE(2017-02-14T06:08:39Z, SHORT)}}",
                            "isSubtle": true,
                            "wrap": true
                        }
                    ]
                }
            ]
        },
        {
            "type": "TextBlock",
            "text": "The ticket have been placed in your \"My Assigned\"",
            "wrap": true
        },
        {
            "type": "FactSet",
            "facts": [
                {
                    "title": "Title",
                    "value": "title value"
                },
                {
                    "title": "Priority",
                    "value": "priority value"
                },
                {
                    "title": "Case category",
                    "value": "category value"
                },
                {
                    "title": "Case type",
                    "value": "Case value"
                },
                {
                    "title": "Due date:",
                    "value": "Due date value"
                }
            ]
        },
        {
            "type": "ActionSet",
            "actions": [
                {
                    "type": "Action.ShowCard",
                    "title": "Show description",
                    "card": {
                        "type": "AdaptiveCard",
                        "body": [
                            {
                                "type": "TextBlock",
                                "text": "Hello World",
                                "wrap": true
                            }
                        ],
                        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
                    }
                }
            ]
        }
    ]
});
module.exports = {
  adaptiveCardForMeetingStart,
  adaptiveCardForMeetingEnd,
  adaptiveCardForMeetingJoin,
  adaptiveCardForSalary,
  traileCardForMeet
};
