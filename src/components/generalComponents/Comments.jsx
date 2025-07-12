import "../../style/Comments.css";
import {useEffect, useState} from "react";
import api from "../../services/api.js";
import {useParams} from "react-router-dom";

function Comments() {

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [showComments, setShowComments] = useState(false);
    const [visibleComments, setVisibleComments] = useState(5);

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

    const toggleComments = () => {
        setShowComments(prev => !prev);
    }

    const handleSeeMore = () => {
        setVisibleComments(prev => prev + 5);
    }

    return (
        <div className="comments-section">
            <div className="comments-dropdown-header" onClick={toggleComments}>
                <h2>Comentários</h2>
                {showComments ? (
                    <i className="icon-up-arrow" aria-hidden="true" />
                ) : (
                    <i className="icon-down-arrow" aria-hidden="true" />
                )}
            </div>





            {showComments && (
                <>
                    <div className="comment-input">
                        <textarea
                            placeholder="Adicionar comentário"
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            rows="3"
                        />
                        <button className="submit-button" onClick={handleSubmit}>
                            <i className="icon-send" aria-label="true" />
                        </button>
                    </div>

                    {comments.slice(0, visibleComments).map((comment) => (
                        <div className="comment-card" key={comment.id}>
                            <div className="comment-header">
                                <span className="username">@{comment.user?.username || "utilizador"}</span>
                                <span className="date">{new Date(comment.commentDate).toLocaleDateString()}</span>
                            </div>
                            <p className="comment-text">{comment.commentText}</p>
                        </div>
                    ))}

                    {visibleComments < comments.length && (
                        <div className="see-more" onClick={handleSeeMore}>
                            ver mais
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Comments;