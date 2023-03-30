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
    // {
    //   type: "ActionSet",
    //   actions: [
    //     {
    //       type: "Action.Submit",
    //       title: "Meeting History",
    //       data: {
    //         msteams: {
    //           type: "invoke",
    //           value: {
    //             type: "tab/tabInfoAction",
    //             tabInfo: {
    //               contentUrl: process.env.BaseUrl + "/index.html#/stageView",
    //               websiteUrl: process.env.BaseUrl + "/index.html#/stageView",
    //               name: "Stage view",
    //               entityId: "entityId",
    //             },
    //           },
    //         },
    //       },
    //     },
    //   ],
    // },
  ],
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

const adaptiveCardForSalary = () => ({
  type: "AdaptiveCard",
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  version: "1.5",
  body: [
    {
      type: "TextBlock",
      text: "Disabled Execute Button",
      wrap: true,
      color: "Good",
    },
  ],
  actions: [
    {
      type: "Action.Execute",
      title: "Enabled",
      isEnabled: true,
    },
    {
      type: "Action.Execute",
      title: "Disabled",
      isEnabled: false,
    },
  ],
});
module.exports = {
  adaptiveCardForMeetingStart,
  adaptiveCardForMeetingEnd,
  adaptiveCardForMeetingJoin,
  adaptiveCardForSalary,
};
