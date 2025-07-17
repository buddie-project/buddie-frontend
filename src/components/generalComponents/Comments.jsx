import React, { useState, useEffect } from "react";
import api from "../../services/api.js";
import { useUserContext } from "../../services/UserContext.jsx";
import { toast } from 'react-toastify';
import "../../style/Comments.css";

/**
 * @typedef {object} CommentsProps
 * @property {string|number} courseId - O ID do curso ao qual os comentários estão associados.
 */

/**
 * Componente Comments para exibir e adicionar comentários a um curso.
 *
 * @param {CommentsProps} props - As propriedades passadas para o componente.
 * @returns {JSX.Element} O componente Comments.
 */
function Comments({ courseId }) {
    /**
     * Estado para armazenar a lista de comentários.
     * @type {Array<object>}
     */
    const [comments, setComments] = useState([]);
    /**
     * Estado para o texto do novo comentário a ser submetido.
     * @type {string}
     */
    const [newCommentText, setNewCommentText] = useState("");
    /**
     * Estado para controlar a visibilidade da secção de comentários.
     * @type {boolean}
     */
    const [showComments, setShowComments] = useState(false);
    /**
     * Estado para controlar o número de comentários visíveis.
     * @type {number}
     */
    const [visibleComments, setVisibleComments] = useState(5);

    /**
     * Obtém o utilizador logado do contexto.
     * @type {{user: object|null}}
     */
    const { user } = useUserContext();
    /**
     * O ID do utilizador logado, ou null se não estiver autenticado.
     * @type {string|number|null}
     */
    const userId = user ? user.id : null;

    /**
     * Efeito para carregar os comentários do curso.
     * Ativado quando o `courseId` muda.
     */
    useEffect(() => {
        if (!courseId) {
            setComments([]);
            return;
        }

        api.get(`/api/courses/${courseId}/comments`)
            .then((res) => {
                setComments(res.data);
            })
            .catch((err) => {
                console.error("Erro ao carregar comentários:", err);
                toast.error("Erro ao carregar comentários.", { theme: "colored" });
                setComments([]);
            });
    }, [courseId]);

    /**
     * Lida com a submissão de um novo comentário.
     * Valida o texto do comentário e a autenticação do utilizador antes de enviar para o backend.
     * @param {Event} e - O evento de submissão do formulário.
     */
    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!newCommentText.trim()) {
            toast.warn("O comentário não pode estar vazio.", { theme: "colored" });
            return;
        }

        if (!userId) {
            toast.error("É necessário fazer login para comentar.", { theme: "colored" });
            return;
        }

        if (!courseId) {
            toast.error("Não é possível adicionar comentário, ID do curso inválido.", { theme: "colored" });
            return;
        }

        try {
            const response = await api.post(`/api/courses/${courseId}/comments`, null, {
                params: { commentText: newCommentText }
            });
            setComments(prevComments => [response.data, ...prevComments]);
            setNewCommentText("");
            toast.success("Comentário adicionado com sucesso!", { theme: "colored" });
        } catch (err) {
            console.error("Erro ao adicionar comentário:", err);
            toast.error("Erro ao adicionar comentário. Por favor, tente novamente.", { theme: "colored" });
        }
    };

    /**
     * Formata uma string de data para exibição localizada.
     * @param {string} dateString - A string de data a ser formatada.
     * @returns {string} A data formatada ou "Data Inválida" se o formato for inválido.
     */
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-PT', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch (e) {
            console.error("Erro ao formatar data:", dateString, e);
            return "Data Inválida";
        }
    };

    /**
     * Alterna a visibilidade da secção de comentários.
     */
    const toggleComments = () => {
        setShowComments(prev => !prev);
    };

    /**
     * Aumenta o número de comentários visíveis em 5.
     */
    const handleSeeMore = () => {
        setVisibleComments(prev => prev + 5);
    };

    /**
     * Lida com a ação de "gostar" (like) de um comentário.
     * Envia um pedido para adicionar o like e atualiza a contagem localmente.
     * @param {number|string} commentId - O ID do comentário ao qual o like será adicionado.
     */
    const handleLike = async (commentId) => {
        if (!userId) {
            toast.info("É necessário fazer login para dar like.", { theme: "colored" });
            return;
        }
        try {
            await api.post(`/api/comments/${commentId}/like`);
            toast.success("Like adicionado!", { theme: "colored" });

            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.id === commentId
                        ? { ...comment, totalLikes: comment.totalLikes + 1 }
                        : comment
                )
            );
        } catch (error) {
            console.error("Erro ao dar like:", error);
            toast.error("Erro ao dar like. Tenta novamente.", { theme: "colored" });
        }
    };

    /**
     * Lida com a ação de adicionar "gosto" (like) a um comentário.
     * Verifica a autenticação do utilizador, envia o pedido para a API
     * e atualiza a contagem de likes no estado localmente para otimização.
     * @param {number|string} commentId - O ID do comentário a receber o like.
     */
    const handleAddLike = async (commentId) => {
        if (!userId) {
            toast.info("É necessário fazer login para dar like.", { theme: "colored" });
            return;
        }
        try {
            await api.post(`/api/comments/${commentId}/like`);
            toast.success("Like adicionado!", { theme: "colored" });

            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.id === commentId
                        ? { ...comment, totalLikes: comment.totalLikes + 1 }
                        : comment
                )
            );

        } catch (err) {
            console.error("Erro ao adicionar like:", err);
            toast.error("Erro ao adicionar like. Tente novamente.", { theme: "colored" });
        }
    };

    return (
        <div className="comments-section">
            <div className="comments-dropdown-header" onClick={toggleComments}>
                <h2>Comentários</h2>
                {showComments ? (
                    <i className="icon-up-arrow" aria-hidden="true"/>
                ) : (
                    <i className="icon-down-arrow" aria-hidden="true"/>
                )}
            </div>

            {showComments && (
                <>
                    <div className="comment-input">
                        <textarea
                            placeholder="Adicionar comentário"
                            value={newCommentText}
                            onChange={e => setNewCommentText(e.target.value)}
                            rows="4"
                        />
                        <button className="submit-button" onClick={handleCommentSubmit}>
                            <i className="icon-send" aria-label="Enviar comentário"/>
                        </button>
                    </div>

                    {comments.length > 0 ? (
                        comments.slice(0, visibleComments).map((comment) => (
                            <div className="comment-card" key={comment.id}>
                                <div className="comment-header">
                                    <span className="username">@{comment.username || "Utilizador Desconhecido"}</span>
                                    <span className="date">{formatDate(comment.commentDate)}</span>
                                    <span
                                        className="like-icon"
                                        onClick={() => handleLike(comment.id)}
                                    >
                                    <i
                                        className={comment.likes?.includes(userId) ? "icon-heart-filled" : "icon-heart"}
                                        title="like"
                                    />
                                        <span className="like-count">{comment.likes?.length || 0}</span>
                                 </span>
                                </div>
                                <p className="comment-text">{comment.commentText}</p>
                            </div>
                        ))
                    ) : (
                        !newCommentText.trim() &&
                        <p className="no-comments-message">Ainda não há comentários. Seja o primeiro a comentar!</p>
                    )}

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