class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const commentsWithDetails = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._replyRepository.getRepliesByCommentId(comment.id);
        const likeCount = await this._likeRepository.getLikeCountByCommentId(comment.id);
        return {
          ...comment,
          likeCount,
          replies: replies.map((reply) => ({
            id: reply.id,
            content: reply.is_deleted ? '**balasan telah dihapus**' : reply.content,
            date: reply.date,
            username: reply.username,
          })),
          content: comment.is_deleted ? '**komentar telah dihapus**' : comment.content,
        };
      })
    );

    return {
      ...thread,
      comments: commentsWithDetails,
    };
  }
}

module.exports = GetThreadDetailUseCase;
