import "../../style/Comments.css";

function Comments() {

    return(
        <div className="comments-section">
            <h2>Comentários</h2>

            <div className="comment-input">
                <input type="text" placeholder="Adicionar comentário" />
                <button className="submit-button">➤</button>
            </div>
            <div className="comment-card">
                <div className="comment-header">
                    <div className="avatar">@</div>
                    <span className="username">@username_a</span>
                    <span className="date">3d</span>
                </div>
                <p className="comment-text">isto é um comentário...</p>
            </div>

            <div className="comment-card">
                <div className="comment-header">
                    <div className="avatar">@</div>
                    <span className="username">@username_b</span>
                    <span className="date">4d</span>
                </div>
                <p className="comment-text">este é outro comentário...</p>
            </div>

            <div className="see-more">ver mais</div>
        </div>
    )
}

export default Comments;