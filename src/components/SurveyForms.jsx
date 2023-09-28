import React, { useEffect, useState } from "react";
import axios from "axios";
import "/node_modules/bootstrap/dist/css/bootstrap.min.css";

function SurveyForms() {
    const [questions, setQuestions] = useState([]);
    const [userResponses, setUserResponses] = useState([]);

    const handleSubmit = async(event) => {
        event.preventDefault();

        const randomUserId = generateRandomUserId(1, 10000);

        const payload = userResponses.map(response => ({
            ...response,
            user_id: randomUserId
        }));

        console.log("Payload:", payload);

        try {
            const response = await axios.post("http://localhost:5010/api/Survey/responses", payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(response.status === 200) {
                console.log("data after submit: ", response.data);
            }
        }
        catch(error) {
            if(error.response) {
                console.error("Server responded with an error:", error.response.data);
            } else if(error.request) {
                console.error("No response received: ", error.request);
            } else {
                console.error("error", error.message);
            }
        }
    }

    const handleChoiceChange = (questionId, choiceId, choiceText) => {
        const updatedResponses = [...userResponses];

        const existingResponseIndex = userResponses.findIndex(
            r => r.question_id === questionId
        );

        if(existingResponseIndex !== -1) {
            updatedResponses[existingResponseIndex].choice_id = choiceId;
            if(choiceText === '其他') {
                updatedResponses[existingResponseIndex].other_text = '';
            }
        } else {
            const newResponse = { question_id: questionId, choice_id: choiceId };
            if(choiceText === '其他') {
                newResponse.other_text = '';
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
            r => r.question_id == questionId
        );

        if(existingResponseIndex !== -1) {
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
        const surveyId = 1;
        async function fetchQuestionsAndChoies() {
            try {
                const questionResponse = await axios.get(`http://localhost:5010/api/Survey/questions?surveyId=${surveyId}`);
                const questions = questionResponse.data;

                for(const question of questions) {
                    const choiceResponse = await axios.get(`http://localhost:5010/api/Survey/choices?questionId=${question.question_id}`);
                    question.choices = choiceResponse.data.map(ch => ({
                        choice_id: ch.choice_id, choice_text: ch.choice_text
                    }));
                }
                setQuestions(questions);
            } catch(error) {
                console.error("An error occurred while fetching questions and choices: ", error);
            }
        }

        fetchQuestionsAndChoies();
    }, []);

    return(
        <div className="">
            <h2>臨櫃服務滿意度調查</h2>
            <form onSubmit={handleSubmit}>
                {questions.map((question, index) => (
                    <div key={questions.question_id || index}>
                        <label>
                            {question.question_text}
                            {question.choices.map((choice, idx) => (
                                <div key={idx} className="form-check">
                                    <input 
                                        type={question.allowMultiple ? "checkbox" : "radio"} 
                                        name={`question_${question.question_id}`} 
                                        value={choice.choice_id} 
                                        onChange={() => handleChoiceChange(question.question_id, choice.choice_id, question.allowMultiple, choice.choice_text)}
                                        className="form-check-input"
                                    />
                                    <label className="form-check-label">
                                        {choice.choice_text}
                                    </label>
                                    
                                    {/* {choice.choiceId === -1 && <input type="text" placeholder="Specify other" />} */}
                                    {choice.choice_text === '其他' && (
                                        <input type="text" placeholder="請說明" className="form-control" onChange={e => handleOtherTextChange(question.question_id, e.target.value )} />
                                    )}
                                </div>
                            ))}
                        </label>
                    </div>
                ))}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end pt-3">
                    <button type="submit" className="btn btn-primary">送出</button>
                </div>
            </form>
        </div>
    );
}

export default SurveyForms;