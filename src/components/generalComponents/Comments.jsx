import "../../style/Comments.css";
import {useEffect, useState} from "react";
import api from "../../services/api.js";
import {useParams} from "react-router-dom";

function Comments() {

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const { id } = useParams();

    useEffect(() => {
        api.get(`/api/courses/${id}/comments`).then(res => {
            setComments(res.data);
        }).catch(err => {
            console.error("Erro ao encontrar comentários", err);
        })

    }, [id]);

    const handleSubmit = () => {
        if(newComment.trim() === " ") return;
        api.post(`/api/courses/${id}/comments`, null, {
            params: { commentText: newComment }
        })
            .then(res => {
                setComments(prev => [res.data, ...prev]);
                setNewComment("");
            })
            .catch(err => console.error(err));
    };

    return(
        <div className="comments-section">
            <h2>Comentários</h2>

            <div className="comment-input">
                <input type="text"
                       placeholder="Adicionar comentário"
                       value={newComment}
                       onChange={e => setNewComment(e.target.value)}
                />
                <button className="submit-button" onClick={handleSubmit}><i className="icon-send" aria-label="true"/>
                </button>
            </div>
            {comments.map((comment) => (<div className="comment-card" key={comment.id}>
                <div className="comment-header">
                    <span className="username">@{comment.user?.username || "utilizador"}</span>
                    <span className="date">{new Date(comment.commentDate).toLocaleDateString()}</span>
                </div>
                <p className="comment-text">{comment.commentText}</p>
            </div>
            ))}

            <div className="see-more">ver mais</div>
        </div>
    )
}

export default Comments;