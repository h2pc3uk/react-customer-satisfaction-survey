export default function question({question, handleChoiceChange, handleOtherTextChange}) {
    if (question.question_text === '縣市' || question.question_text === '行業') {
        console.log(`Input field should be displayed for: ${question.question_text}`);
    }

    return(
        <div>
            <label>
            {console.log(console.log("Current question object:", question))}
                {question.question_text}
                {question.choices.map((choice, idx) => (
                    <div key={idx} className="form-check">
                        <input
                            type={question.allowMultiple ? "checkbox" : "radio"}
                            name={`question_${question.question_id}`}
                            value={choice.choice_id}
                            onChange={() => handleChoiceChange(question.question_id, choice.choice_id, choice.choice_text)}
                            className="form-check-input"
                        />
                        <label className="form-check-label">
                            {choice.choice_text}
                        </label>

                        {(choice.choice_text === '其他') && (
                            <input 
                                type="text" 
                                placeholder="請說明" 
                                className="form-control" 
                                onChange={
                                    e => handleOtherTextChange(question.question_id, e.target.value)
                                } 
                            />
                        )}
                    </div>
                ))}

                {(question.question_text === '縣市' || question.question_text === '行業') && (
                    <input 
                        type="text" 
                        placeholder="請說明" 
                        className="form-control" 
                        onChange={
                            e => handleOtherTextChange(question.question_id, e.target.value)
                        } 
                    />
                )}
            </label>
        </div>
    )
}