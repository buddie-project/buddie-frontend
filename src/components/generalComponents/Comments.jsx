import React, { useState, useEffect } from "react";
import api from "../../services/api.js";
import { useUserContext } from "../../services/UserContext.jsx"; // Importar useUserContext
import { toast } from 'react-toastify'; // Importar toast para notificações ao utilizador
import "../../style/Comments.css";

/**
 * Componente Comments para exibir e adicionar comentários a um curso.
 * Recebe o ID do curso como uma prop do componente pai (CourseDetails).
 *
 * @param {object} props - As propriedades passadas para o componente.
 * @param {string|number} props.courseId - O ID do curso ao qual os comentários estão associados.
 */
function Comments({ courseId }) { // Recebe courseId como prop de CourseDetails
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState(""); // Renomeado para clareza e consistência
    const [showComments, setShowComments] = useState(false);
    const [visibleComments, setVisibleComments] = useState(5);

    // Obter o utilizador logado e o seu ID do contexto
    const { user } = useUserContext();
    const userId = user ? user.id : null; // userId é usado para validação e lógica no frontend, não enviado diretamente para este endpoint POST

    /**
     * Efeito para carregar os comentários do curso.
     * Ativado quando o `courseId` muda.
     */
    useEffect(() => {
        // Apenas tenta carregar comentários se um courseId válido for fornecido
        if (!courseId) {
            setComments([]); // Limpar comentários se não houver ID de curso válido
            return;
        }

        // Endpoint de GET para comentários, alinhado com o backend CommentsController
        api.get(`/api/courses/${courseId}/comments`)
            .then((res) => {
                setComments(res.data);
            })
            .catch((err) => {
                console.error("Erro ao carregar comentários:", err);
                toast.error("Erro ao carregar comentários.", { theme: "colored" });
                setComments([]);
            });
    }, [courseId]); // Dependência no courseId

    /**
     * Função para lidar com a submissão de um novo comentário.
     * Alinhado com o endpoint POST do CommentsController do backend.
     */
    const handleCommentSubmit = async (e) => {
        e.preventDefault(); // Prevenir o comportamento padrão do formulário (recarregar a página)

        // Validação básica do comentário: não pode estar vazio (após remover espaços em branco)
        if (!newCommentText.trim()) { // Correção da lógica de validação de string vazia
            toast.warn("O comentário não pode estar vazio.", { theme: "colored" });
            return;
        }

        // Validação se o utilizador está logado antes de permitir comentar
        if (!userId) {
            toast.error("É necessário fazer login para comentar.", { theme: "colored" });
            return;
        }

        // Validação se o ID do curso é válido
        if (!courseId) {
            toast.error("Não é possível adicionar comentário, ID do curso inválido.", { theme: "colored" });
            return;
        }

        try {
            // Endpoint POST para comentários, alinhado com o backend CommentsController
            // O backend espera 'commentText' como @RequestParam, por isso é enviado em 'params'.
            // O 'userId' NÃO é enviado explicitamente do frontend para este endpoint,
            // pois o backend deve obtê-lo do contexto de segurança da sessão.
            const response = await api.post(`/api/courses/${courseId}/comments`, null, {
                params: { commentText: newCommentText }
            });
            // Adicionar o novo comentário ao início da lista (assumindo que a API retorna o comentário completo após guardar)
            setComments(prevComments => [response.data, ...prevComments]);
            setNewCommentText(""); // Limpar o campo de texto após submissão
            toast.success("Comentário adicionado com sucesso!", { theme: "colored" });
        } catch (err) {
            console.error("Erro ao adicionar comentário:", err);
            // Mensagens de erro mais específicas podem ser adicionadas com base no 'err.response.data'
            toast.error("Erro ao adicionar comentário. Por favor, tente novamente.", { theme: "colored" });
        }
    };

    /**
     * Função auxiliar para formatar a data de um comentário para exibição.
     * Inclui tratamento de erros para datas inválidas.
     */
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            // Formato completo: DD/MM/AAAA HH:MM:SS
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
            return "Data Inválida"; // Retorna uma string genérica em caso de erro na data
        }
    };

    const toggleComments = () => {
        setShowComments(prev => !prev);
    };

    const handleSeeMore = () => {
        setVisibleComments(prev => prev + 5);
    };

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
                            value={newCommentText}
                            onChange={e => setNewCommentText(e.target.value)}
                            rows="4" // Aumentar as linhas para melhor experiência de escrita
                        />
                        <button className="submit-button" onClick={handleCommentSubmit}>
                            <i className="icon-send" aria-label="Enviar comentário" />
                        </button>
                    </div>

                    {comments.length > 0 ? (
                        comments.slice(0, visibleComments).map((comment) => (
                            <div className="comment-card" key={comment.id}> {/* 'key' é crucial para listas no React */}
                                <div className="comment-header">
                                    {/* Acesso seguro a 'user.username' e formatação da data */}
                                    <span className="username">@{comment.user?.username || "Utilizador Desconhecido"}</span>
                                    <span className="date">{formatDate(comment.commentDate)}</span>
                                </div>
                                <p className="comment-text">{comment.commentText}</p>
                                {/* Exemplo de funcionalidade de Likes (se implementada) */}
                                {/* <div className="comment-actions">
                                    <i className="icon-like"></i> {comment.likes?.length || 0}
                                </div> */}
                            </div>
                        ))
                    ) : (
                        // Mensagem quando não há comentários e não há mais para carregar
                        !newCommentText.trim() && <p className="no-comments-message">Ainda não há comentários. Seja o primeiro a comentar!</p>
                    )}

                    {/* Botão "ver mais" só aparece se houver mais comentários para mostrar */}
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