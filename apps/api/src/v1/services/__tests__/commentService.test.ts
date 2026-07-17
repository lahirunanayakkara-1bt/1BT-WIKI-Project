import { jest } from '@jest/globals';
import { AppError } from '../../../errors/AppError.js';

jest.unstable_mockModule('../../repositories/articleRepository.js', () => ({
  default: {
    findById: jest.fn(),
  },
}));

jest.unstable_mockModule('../../repositories/commentRepository.js', () => ({
  default: {
    create: jest.fn(),
  },
}));

jest.unstable_mockModule('../notificationService.js', () => ({
  default: {
    send: jest.fn(),
  },
}));

const { default: CommentService } = await import('../commentService.js');
const { default: ArticleRepository } = await import('../../repositories/articleRepository.js');
const { default: CommentRepository } = await import('../../repositories/commentRepository.js');
const { default: NotificationService } = await import('../notificationService.js');

describe('CommentService.addComment', () => {
  const articleId = 'article-123';
  const authorId = 'user-123';

  beforeEach(() => {
    jest.clearAllMocks();
    (NotificationService.send as jest.Mock<any>).mockResolvedValue(undefined);
  });

  it('should throw AppError if body is missing or empty', async () => {
    await expect(CommentService.addComment(articleId, authorId, '   '))
      .rejects.toThrow(new AppError('Comment body is required and cannot be empty', 400));
  });

  it('should throw AppError if body exceeds 5000 characters', async () => {
    const body = 'a'.repeat(5001);
    await expect(CommentService.addComment(articleId, authorId, body))
      .rejects.toThrow(new AppError('Comment cannot exceed 5000 characters', 400));
  });

  it('should throw AppError if article is not found', async () => {
    (ArticleRepository.findById as jest.Mock<any>).mockResolvedValue(null);

    await expect(CommentService.addComment(articleId, authorId, 'Nice article'))
      .rejects.toThrow(new AppError('Article not found', 404));
  });

  it.each(['Draft', 'Pending', 'Rejected', 'Unpublished'])(
    'should throw AppError if article status is %s',
    async (status) => {
      (ArticleRepository.findById as jest.Mock<any>).mockResolvedValue({
        id: articleId,
        authorId: 'other-user',
        title: 'Test Article',
        status,
      });

      await expect(CommentService.addComment(articleId, authorId, 'Nice article'))
        .rejects.toThrow(new AppError('Cannot comment on this article', 403));
    }
  );

  it('should create the comment and notify the article author', async () => {
    const article = { id: articleId, authorId: 'other-user', title: 'Test Article', status: 'Published' };
    const createdComment = {
      id: 'comment-123',
      articleId,
      createdBy: authorId,
      body: 'Nice article',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (ArticleRepository.findById as jest.Mock<any>).mockResolvedValue(article);
    (CommentRepository.create as jest.Mock<any>).mockResolvedValue(createdComment);

    const result = await CommentService.addComment(articleId, authorId, '  Nice article  ');

    expect(CommentRepository.create).toHaveBeenCalledWith({
      articleId,
      createdBy: authorId,
      body: 'Nice article',
    });
    expect(NotificationService.send).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientId: 'other-user',
        notificationReferenceType: 'comment',
        referenceId: 'comment-123',
      })
    );
    expect(result).toEqual(createdComment);
  });

  it('should not send a notification when the author comments on their own article', async () => {
    const article = { id: articleId, authorId, title: 'Test Article', status: 'Published' };
    const createdComment = {
      id: 'comment-123',
      articleId,
      createdBy: authorId,
      body: 'Nice article',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (ArticleRepository.findById as jest.Mock<any>).mockResolvedValue(article);
    (CommentRepository.create as jest.Mock<any>).mockResolvedValue(createdComment);

    await CommentService.addComment(articleId, authorId, 'Nice article');

    expect(NotificationService.send).not.toHaveBeenCalled();
  });
});
