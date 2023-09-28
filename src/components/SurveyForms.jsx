/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Question from "./Question";
import "/node_modules/bootstrap/dist/css/bootstrap.min.css";

function SurveyForms() {
    const [questions, setQuestions] = useState([]);
    const [userResponses, setUserResponses] = useState([]);
    const [surveyName, setSurveyName] = useState("");
    const { surveyId } = useParams();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const randomUserId = generateRandomUserId(1, 10000);

        const payload = userResponses.map((response) => ({
            ...response,
            user_id: randomUserId,
        }));

        console.log("Payload:", payload);

        try {
            const response = await axios.post(
                "http://localhost:5010/api/Survey/responses",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                console.log("data after submit: ", response.data);
            }
        } catch (error) {
            if (error.response) {
                console.error(
                    "Server responded with an error:",
                    error.response.data
                );
            } else if (error.request) {
                console.error("No response received: ", error.request);
            } else {
                console.error("error", error.message);
            }
        }
    };

    const handleChoiceChange = (questionId, choiceId, choiceText) => {
        const updatedResponses = [...userResponses];

        const existingResponseIndex = userResponses.findIndex(
            (r) => r.question_id === questionId
        );

        if (existingResponseIndex !== -1) {
            updatedResponses[existingResponseIndex].choice_id = choiceId;
            if (choiceText === "其他") {
                updatedResponses[existingResponseIndex].other_text = "";
            }
        } else {
            const newResponse = {
                question_id: questionId,
                choice_id: choiceId,
            };
            if (choiceText === "其他") {
                newResponse.other_text = "";
            }
            updatedResponses.push(newResponse);
            // updatedResponses.push({ question_id: questionId, choice_id: choiceId, })
        }

        setUserResponses(updatedResponses);
        console.log("Updated responses:", updatedResponses);
    };

    const handleOtherTextChange = (questionId, otherText) => {
        const updatedResponses = [...userResponses];
        const existingResponseIndex = updatedResponses.findIndex(
            (r) => r.question_id == questionId
        );

        if (existingResponseIndex !== -1) {
            updatedResponses[existingResponseIndex].other_text = otherText;
        } else {
            updatedResponses.push({
                question_id: questionId,
                other_text: otherText,
            });
        }

        setUserResponses(updatedResponses);
    };

    const generateRandomUserId = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    useEffect(() => {
        async function fetchQuestionsAndChoies() {
            try {
                const surveyResponse = await axios.get(
                    `http://localhost:5010/api/Survey/info?surveyId=${surveyId}`
                );
                setSurveyName(surveyResponse.data.survey_name);

                const questionResponse = await axios.get(
                    `http://localhost:5010/api/Survey/questions?surveyId=${surveyId}`
                );
                const questions = questionResponse.data;
                for (const question of questions) {
                    const choiceResponse = await axios.get(
                        `http://localhost:5010/api/Survey/choices?questionId=${question.question_id}`
                    );
                    question.choices = choiceResponse.data.map((ch) => ({
                        choice_id: ch.choice_id,
                        choice_text: ch.choice_text,
                    }));
                }
                setQuestions(questions);
            } catch (error) {
                console.error(
                    "An error occurred while fetching questions and choices: ",
                    error
                );
            }
        }

        fetchQuestionsAndChoies();
    }, [surveyId]);

    return (
        <div className="container-md">
            <div className="col-md-6 mx-auto">
                <h2>{surveyName || "Loading..."}</h2>

                <form onSubmit={handleSubmit}>
                    {questions.map((question, index) => (
                        <Question
                            key={question.question_id || index}
                            question={question}
                            handleChoiceChange={handleChoiceChange}
                            handleOtherTextChange={handleOtherTextChange}
                        />
                    ))}
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end pt-3">
                        <button type="submit" className="btn btn-primary">
                            送出
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SurveyForms;
