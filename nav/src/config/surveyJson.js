export const surveyJson = {
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "rating",
          name: "satisfaction",
          title: "How satisfied are you with our answers and the conversation?",
          scaleColorMode: "colored",
          rateType: "smileys",
          description: "",
          rateCount: 5,
          rateMax: 5,
          isRequired: true,
        },
        {
          type: "boolean",
          name: "isResolved",
          title: "Did the assistant resolve your query?",
          swapOrder: true,
          isRequired: true,
        },
        {
          type: "rating",
          name: "isHappy",
          title: "How satisfied are you with our answers?",
          rateType: "smileys",
          scaleColorMode: "colored",
          rateCount: 5,
          rateMax: 5,
          isRequired: true,
          displayMode: "buttons",
        },
        {
          type: "comment",
          name: "comment",
          title: "Any other comments?",
          width: "100%",
          minWidth: "256px",
          placeholder: "Type here...",
          autoGrow: true,
          allowResize: false,
        },
      ],
    },
  ],
  showQuestionNumbers: "off",
};
