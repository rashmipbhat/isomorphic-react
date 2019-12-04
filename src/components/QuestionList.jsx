import React from 'react';
import TagsList from './TagsList'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

import { fetchQuestionsRequest } from "../module/question/questionReducer";

const QuestionListItem = ({tags,answer_count,title,views,question_id})=>(
    <div className="mb-3">
        <h3>
            {title}
        </h3>
        <div className="mb-2">
            <TagsList tags={tags}/>
        </div>
        <div>
            <Link to={`/questions/${question_id}`}>
                <button>More Info</button>
            </Link>
        </div>
    </div>
);

const QuestionList = ({questions})=>(
    <div>
        { questions ?
            <div>
                {questions.map(question=><QuestionListItem key={question.question_id} {...question}/>)}
            </div> :
            <div>
                Loading questions...
            </div>
        }
    </div>
);

const mapStateToProps = ({questions})=>({
    questions
});

const component = connect(mapStateToProps)(QuestionList);

// SOMEHOW NEED GET THE DATA DFOR THIS COMPONENT LIEK THIS USING THE SHARED ROUTES
const loadData = store => store.dispatch(fetchQuestionsRequest());

export default {
  component,
  loadData
};
