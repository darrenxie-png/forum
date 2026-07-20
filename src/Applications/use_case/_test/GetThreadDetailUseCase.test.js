const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should return thread detail with comments, replies, and likeCounts', async () => {
    const mockThread = { id: 'thread-1', title: 'A Thread', body: 'Body', date: '2024-01-01', username: 'darren' };
    const mockComments = [
      { id: 'comment-1', username: 'user1', date: '2024-01-01', content: 'A comment', is_deleted: false },
      { id: 'comment-2', username: 'user2', date: '2024-01-02', content: 'Deleted comment', is_deleted: true },
    ];
    const mockReplies = [
      { id: 'reply-1', username: 'user1', date: '2024-01-01', content: 'A reply', is_deleted: false },
      { id: 'reply-2', username: 'user2', date: '2024-01-02', content: 'Deleted reply', is_deleted: true },
    ];
    const mockThreadRepository = { getThreadById: jest.fn().mockResolvedValue(mockThread) };
    const mockCommentRepository = { getCommentsByThreadId: jest.fn().mockResolvedValue(mockComments) };
    const mockReplyRepository = { getRepliesByCommentId: jest.fn().mockResolvedValue(mockReplies) };
    const mockLikeRepository = { getLikeCountByCommentId: jest.fn().mockResolvedValue(2) };
    const useCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });
    const result = await useCase.execute('thread-1');
    expect(result.id).toBe('thread-1');
    expect(result.comments).toHaveLength(2);
    expect(result.comments[0].likeCount).toBe(2);
    expect(result.comments[0].content).toBe('A comment');
    expect(result.comments[1].content).toBe('**komentar telah dihapus**');
    expect(result.comments[0].replies[0].content).toBe('A reply');
    expect(result.comments[0].replies[1].content).toBe('**balasan telah dihapus**');
  });
});
