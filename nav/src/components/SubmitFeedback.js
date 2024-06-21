import React from "react";
import { db } from "../firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/authContext";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import { surveyJson } from "../config/surveyJson";

const SubmitFeedback = ({ convId, feedbackEnabler }) => {
  const { currentUser } = useAuth();
  const survey = new Model(surveyJson);
  survey.onComplete.add((sender, options) => {
    // Push data to the feedback collection
    const feedbackRef = collection(db, "feedback");
    addDoc(feedbackRef, {
      convId,
      uid: currentUser.uid,
      feedback: sender.data,
      timestamp: serverTimestamp(),
    }).catch((err) => {
      alert("There was an error sending your feedback, Sorry! :(");
      console.error(err);
    });

    feedbackEnabler(false);
  });
  return <Survey model={survey} />;
};

export default SubmitFeedback;
