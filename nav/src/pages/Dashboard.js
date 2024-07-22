import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { db } from "../firebase/firebase";
import {
  collection,
  doc,
  getAggregateFromServer,
  getDoc,
  sum,
  count,
  average,
} from "firebase/firestore";

const Dashboard = () => {
  const { userLoggedIn } = useAuth();
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [userMetrics, setUserMetrics] = useState({});
  const [feedbackMetrics, setFeedbackMetrics] = useState({
    avg_satisfaction: "Not Found",
    avg_happy: "Not Found",
  });
  const [studentCnt, setStudentCnt] = useState(0);
  const [facultyCnt, setFacultyCnt] = useState(0);
  const [prospStudentCnt, setProspStudentCnt] = useState(0);
  const [prospParentCnt, setProsParentCnt] = useState(0);
  const [parentCnt, setParentCnt] = useState(0);
  const [otherCnt, setOtherCnt] = useState(0);

  useEffect(() => {
    if (userLoggedIn) {
      const userRef = doc(db, "users", currentUser.uid);
      getDoc(userRef)
        .then((doc) => {
          const data = doc.data();
          return "is_admin" in data ? data["is_admin"] : false;
        })
        .then((is_admin) => {
          if (!is_admin) navigate("/account");
          setIsAdmin(is_admin);
        });
    }
    setIsAdmin(false);

    const categoryRef1 = doc(db, "category_counts", "Student");
    getDoc(categoryRef1).then((snap) => {
      setStudentCnt(snap.data().count);
    });
    const categoryRef2 = doc(db, "category_counts", "Faculty");
    getDoc(categoryRef2).then((snap) => {
      setFacultyCnt(snap.data().count);
    });

    const categoryRef3 = doc(db, "category_counts", "Prospective student");
    getDoc(categoryRef3).then((snap) => {
      setProspStudentCnt(snap.data().count);
    });

    const categoryRef4 = doc(db, "category_counts", "Parent of a Student");
    getDoc(categoryRef4).then((snap) => {
      setParentCnt(snap.data().count);
    });
    const categoryRef5 = doc(
      db,
      "category_counts",
      "Parent of a prospective student"
    );
    getDoc(categoryRef5).then((snap) => {
      setProsParentCnt(snap.data().count);
    });
    const categoryRef6 = doc(db, "category_counts", "Other");
    getDoc(categoryRef6).then((snap) => {
      setOtherCnt(snap.data().count);
    });
    const usersRef = collection(db, "users");
    getAggregateFromServer(usersRef, {
      user_count: count(),
      num_convs: sum("latest_conversation_id"),
    }).then((snap) => {
      const user_count = snap.data() ? snap.data().user_count : 0;
      const convs_count = snap.data() ? snap.data().num_convs : 0;
      setUserMetrics({ ...userMetrics, user_count, convs_count });
    });

    const feedbacksRef = collection(db, "feedback");
    getAggregateFromServer(feedbacksRef, {
      total_feedback_convs: count(),
      num_resolved: sum("feedback.isResolved"),
      avg_satisfaction: average("feedback.satisfaction"),
      avg_happy: average("feedback.howHappy"),
    }).then((snap) => {
      const feedback_convs = snap.data() ? snap.data().total_feedback_convs : 0;
      const nums_convs_resolved = snap.data() ? snap.data().num_resolved : 0;
      const avg_satisfaction = snap.data()
        ? snap.data().avg_satisfaction.toFixed(2)
        : "Not found";
      const avg_happy = snap.data()
        ? snap.data().avg_happy.toFixed(2)
        : "Not found";

      setFeedbackMetrics({
        ...feedbackMetrics,
        feedback_convs,
        nums_convs_resolved,
        avg_satisfaction,
        avg_happy,
      });
    });
  }, []);
  return (
    <div className="text-white">
      Dashboard
      <div>{`User Count: ${userMetrics.user_count}`}</div>
      <div>{`Conversations Answered Count: ${userMetrics.convs_count}`}</div>
      <div>{`Number of conversations with feedback: ${feedbackMetrics.feedback_convs}`}</div>
      <div>{`Number of conversations without feedback: ${
        userMetrics.convs_count - feedbackMetrics.feedback_convs
      }`}</div>
      <div>{`Number of conversations resolved: ${feedbackMetrics.nums_convs_resolved}`}</div>
      <div>{`Number of conversations Unresolved: ${
        feedbackMetrics.feedback_convs - feedbackMetrics.nums_convs_resolved
      }`}</div>
      <div>{`Average satisfaction of users: ${feedbackMetrics.avg_satisfaction}`}</div>
      <div>{`Average happiness of users: ${feedbackMetrics.avg_happy}`}</div>
      <div>Number of users based on category</div>
      <div>{`Student: ${studentCnt}`}</div>
      <div>{`Parent: ${parentCnt}`}</div>
      <div>{`Faculty: ${facultyCnt}`}</div>
      <div>{`Parent of Student: ${parentCnt}`}</div>
      <div>{`Parent of prospective Student: ${prospParentCnt}`}</div>
      <div>{`Other: ${otherCnt}`}</div>
    </div>
  );
};

export default Dashboard;
