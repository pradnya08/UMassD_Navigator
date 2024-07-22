import React from "react";
import { db } from "../firebase/firebase";
import {
  addDoc,
  getDoc,
  doc,
  setDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
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
    const feedData = {
      howHappy: sender.data.isHappy,
      isResolved: sender.data.isResolved ? 1 : 0,
      satisfaction: sender.data.satisfaction,
      category: sender.data.category,
      comments: "comments" in sender.data ? sender.data.comments : "",
    };

    const feedbackRef = collection(db, "feedback");
    addDoc(feedbackRef, {
      convId,
      uid: currentUser.uid,
      feedback: feedData,
      timestamp: serverTimestamp(),
    }).catch((err) => {
      alert("There was an error sending your feedback, Sorry! :(");
      console.error(err);
    });

    const categoryRef = doc(db, "category_counts", feedData.category);
    getDoc(categoryRef).then((snap) => {
      setDoc(categoryRef, { count: snap.data().count + 1 });
    });
    feedbackEnabler(false);
  });
  return <Survey model={survey} />;
};

export default SubmitFeedback;
