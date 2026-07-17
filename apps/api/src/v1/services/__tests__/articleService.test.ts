import { jest } from '@jest/globals';
import crypto from 'node:crypto';
import { AppError } from '../../../errors/AppError.js';

// Mock dependencies
jest.unstable_mockModule('../../repositories/articleRepository.js', () => ({
  default: {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    findPublished: jest.fn(),
  },
}));

jest.unstable_mockModule('../../repositories/articleReviewRepository.js', () => ({
  default: {
    findLatestByArticleId: jest.fn(),
  },
}));

jest.unstable_mockModule('../../repositories/articleAttachmentRepository.js', () => ({
  default: {
    create: jest.fn(),
  },
}));

jest.unstable_mockModule('../../lib/b2Client.js', () => ({
  default: {
    uploadFile: jest.fn(),
  },
}));

const { default: ArticleService } = await import('../articleService.js');
const { default: ArticleRepository } = await import('../../repositories/articleRepository.js');
const { default: ArticleAttachmentRepository } = await import('../../repositories/articleAttachmentRepository.js');
const { default: ArticleReviewRepository } = await import('../../repositories/articleReviewRepository.js');
const { default: b2Client } = await import('../../lib/b2Client.js');

describe('ArticleService.createArticle', () => {
  const authorId = 'user-123';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.B2_BUCKET_NAME = 'test-bucket';
  });

  afterEach(() => {
    delete process.env.B2_BUCKET_NAME;
  });

  describe('Validation', () => {
    it('should throw AppError if more than 10 images are provided', async () => {
      const input = { title: 'Test Title', body: { type: 'doc' } };
      const images = Array.from({ length: 11 }).map(() => ({}) as Express.Multer.File);

      await expect(ArticleService.createArticle(input, authorId, images))
        .rejects.toThrow(new AppError('Maximum 10 images per article', 400));
    });

    it('should throw AppError if an image exceeds 5MB', async () => {
      const input = { title: 'Test Title', body: { type: 'doc' } };
      const images = [{ size: 6 * 1024 * 1024, mimetype: 'image/jpeg' } as Express.Multer.File];

      await expect(ArticleService.createArticle(input, authorId, images))
        .rejects.toThrow(new AppError('Image size cannot exceed 5MB', 400));
    });

    it('should throw AppError if an image has invalid mimetype', async () => {
      const input = { title: 'Test Title', body: { type: 'doc' } };
      const images = [{ size: 1024, mimetype: 'application/pdf' } as Express.Multer.File];

      await expect(ArticleService.createArticle(input, authorId, images))
        .rejects.toThrow(new AppError('Only jpeg, png, webp, and gif images are allowed', 400));
    });

    it('should throw AppError if title is missing or empty', async () => {
      const input = { title: '   ', body: { type: 'doc' } };
      await expect(ArticleService.createArticle(input, authorId))
        .rejects.toThrow(new AppError('Title is required and cannot be empty', 400));
    });

    it('should throw AppError if title exceeds 500 characters', async () => {
      const input = { title: 'a'.repeat(501), body: { type: 'doc' } };
      await expect(ArticleService.createArticle(input, authorId))
        .rejects.toThrow(new AppError('Title cannot exceed 500 characters', 400));
    });

    it('should throw AppError if body is a string', async () => {
      const input = { title: 'Valid Title', body: '<p>HTML body</p>' as any };
      await expect(ArticleService.createArticle(input, authorId))
        .rejects.toThrow(new AppError('Body must be valid JSONContent, raw HTML is not allowed', 400));
    });

    it('should throw AppError if body is an array', async () => {
      const input = { title: 'Valid Title', body: [] as any };
      await expect(ArticleService.createArticle(input, authorId))
        .rejects.toThrow(new AppError('Body must be a valid JSON object', 400));
    });

    it('should throw AppError if body is not empty and lacks a "type" field', async () => {
      const input = { title: 'Valid Title', body: { content: 'hello' } as any };
      await expect(ArticleService.createArticle(input, authorId))
        .rejects.toThrow(new AppError('Body must have a "type" field', 400));
    });
  });

  describe('Creation', () => {
    it('should successfully create an article without images', async () => {
      const input = { title: 'Valid Title', body: { type: 'doc' }, tags: ['test'] };
      const createdArticle = { id: 'article-123', ...input, authorId };

      (ArticleRepository.create as jest.Mock<any>).mockResolvedValue(createdArticle);

      const result = await ArticleService.createArticle(input, authorId);

      expect(ArticleRepository.create).toHaveBeenCalledWith({
        title: 'Valid Title',
        body: { type: 'doc' },
        tags: ['test'],
        authorId,
      });
      expect(result).toEqual({ ...createdArticle, attachments: [] });
    });

    it('should successfully create an article and upload valid images', async () => {
      const input = { title: 'Valid Title', body: { type: 'doc' } };
      const images = [{
        originalname: 'test image.png',
        mimetype: 'image/png',
        size: 1024,
        buffer: Buffer.from('test'),
      } as Express.Multer.File];

      const createdArticle = { id: 'article-123', ...input, authorId };
      const uploadedFile = { fileId: 'file-123', fileUrl: 'http://example.com/file' };
      const createdAttachment = { id: 'attachment-123', fileName: 'test image.png' };

      (ArticleRepository.create as jest.Mock<any>).mockResolvedValue(createdArticle);
      (b2Client.uploadFile as jest.Mock<any>).mockResolvedValue(uploadedFile);
      (ArticleAttachmentRepository.create as jest.Mock<any>).mockResolvedValue(createdAttachment);

      const result = await ArticleService.createArticle(input, authorId, images);

      expect(ArticleRepository.create).toHaveBeenCalled();
      expect(b2Client.uploadFile).toHaveBeenCalledWith(
        expect.stringMatching(/^articles\/article-123\/[a-f0-9\-]+-test_image\.png$/),
        images[0].buffer,
        images[0].mimetype
      );
      expect(ArticleAttachmentRepository.create).toHaveBeenCalledWith({
        articleId: 'article-123',
        uploadedBy: authorId,
        fileName: 'test image.png',
        b2FileKey: expect.any(String),
        b2FileId: 'file-123',
        b2BucketName: 'test-bucket',
        fileUrl: 'http://example.com/file',
        mimeType: 'image/png',
        sizeBytes: 1024,
      });

      expect(result).toEqual({
        ...createdArticle,
        attachments: [createdAttachment],
      });
      expect(result.warnings).toBeUndefined();
    });

    it('should return warnings if image upload fails', async () => {
      const input = { title: 'Valid Title', body: { type: 'doc' } };
      const images = [{
        originalname: 'fail.png',
        mimetype: 'image/png',
        size: 1024,
        buffer: Buffer.from('test'),
      } as Express.Multer.File];

      const createdArticle = { id: 'article-123', ...input, authorId };

      (ArticleRepository.create as jest.Mock<any>).mockResolvedValue(createdArticle);
      (b2Client.uploadFile as jest.Mock<any>).mockRejectedValue(new Error('Upload failed'));

      const result = await ArticleService.createArticle(input, authorId, images);

      expect(result).toEqual({
        ...createdArticle,
        attachments: [],
        warnings: ['Failed to upload fail.png: Upload failed'],
      });
    });
  });
});

describe('ArticleService.updateArticle', () => {
  const authorId = 'user-123';
  const articleId = 'article-123';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.B2_BUCKET_NAME = 'test-bucket';
  });

  afterEach(() => {
    delete process.env.B2_BUCKET_NAME;
  });

  it('should throw AppError if article is not found', async () => {
    (ArticleRepository.findById as jest.Mock<any>).mockResolvedValue(null);

    await expect(ArticleService.updateArticle(articleId, {}, authorId))
      .rejects.toThrow(new AppError('Article not found', 404));
  });

  it('should throw AppError if user is not the author', async () => {
    (ArticleRepository.findById as jest.Mock<any>).mockResolvedValue({ authorId: 'other-user' });

    await expect(ArticleService.updateArticle(articleId, {}, authorId))
      .rejects.toThrow(new AppError('Only the author can edit this article', 403));
  });

  it('should throw AppError if article is not Draft or Rejected', async () => {
    (ArticleRepository.findById as jest.Mock<any>).mockResolvedValue({ authorId, status: 'Published' });
    (ArticleReviewRepository.findLatestByArticleId as jest.Mock<any>).mockResolvedValue({ reviewStatus: 'Approved' });

    await expect(ArticleService.updateArticle(articleId, {}, authorId))
      .rejects.toThrow(new AppError('Only Draft or Rejected articles can be edited', 400));
  });

  it('should allow editing if article is Draft', async () => {
    const existingArticle = { id: articleId, authorId, status: 'Draft', title: 'Old Title' };
    (ArticleRepository.findById as jest.Mock<any>).mockResolvedValue(existingArticle);
    
    const updatedArticle = { ...existingArticle, title: 'New Title' };
    (ArticleRepository.update as jest.Mock<any>).mockResolvedValue(updatedArticle);

    const result = await ArticleService.updateArticle(articleId, { title: 'New Title' }, authorId);

    expect(ArticleRepository.update).toHaveBeenCalledWith(articleId, { title: 'New Title' });
    expect(result).toEqual(updatedArticle);
  });

  it('should reset status to Draft if article was Rejected', async () => {
    const existingArticle = { id: articleId, authorId, status: 'In Review' };
    (ArticleRepository.findById as jest.Mock<any>).mockResolvedValue(existingArticle);
    (ArticleReviewRepository.findLatestByArticleId as jest.Mock<any>).mockResolvedValue({ reviewStatus: 'Rejected' });
    
    const updatedArticle = { ...existingArticle, status: 'Draft', title: 'New Title' };
    (ArticleRepository.update as jest.Mock<any>).mockResolvedValue(updatedArticle);

    const result = await ArticleService.updateArticle(articleId, { title: 'New Title' }, authorId);

    expect(ArticleRepository.update).toHaveBeenCalledWith(articleId, { title: 'New Title', status: 'Draft' });
    expect(result).toEqual(updatedArticle);
  });

  it('should return existing article if no updates and no images provided', async () => {
    const existingArticle = { id: articleId, authorId, status: 'Draft', title: 'Old Title' };
    (ArticleRepository.findById as jest.Mock<any>).mockResolvedValue(existingArticle);

    const result = await ArticleService.updateArticle(articleId, {}, authorId);

    expect(ArticleRepository.update).not.toHaveBeenCalled();
    expect(result).toEqual(existingArticle);
  });

  it('should successfully upload new images', async () => {
    const existingArticle = { id: articleId, authorId, status: 'Draft', title: 'Old Title' };
    (ArticleRepository.findById as jest.Mock<any>).mockResolvedValue(existingArticle);

    const images = [{
      originalname: 'test.png',
      mimetype: 'image/png',
      size: 1024,
      buffer: Buffer.from('test'),
    } as Express.Multer.File];

    const uploadedFile = { fileId: 'file-123', fileUrl: 'http://example.com/file' };
    const createdAttachment = { id: 'attachment-123', fileName: 'test.png' };

    (b2Client.uploadFile as jest.Mock<any>).mockResolvedValue(uploadedFile);
    (ArticleAttachmentRepository.create as jest.Mock<any>).mockResolvedValue(createdAttachment);

    const result = await ArticleService.updateArticle(articleId, {}, authorId, images);

    expect(ArticleRepository.update).not.toHaveBeenCalled();
    expect(result).toEqual({
      ...existingArticle,
      attachments: [createdAttachment],
    });
  });
});

describe('ArticleService.listPublished', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return mapped published articles and total count', async () => {
    const mockArticles = [
      {
        id: '1',
        title: 'Title 1',
        authorId: 'user1',
        tags: ['test'],
        status: 'Published',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
        _count: { likes: 5, comments: 2 },
      },
      {
        id: '2',
        title: 'Title 2',
        authorId: 'user2',
        tags: [],
        status: 'Published',
        createdAt: new Date('2023-01-02'),
        updatedAt: new Date('2023-01-02'),
        _count: { likes: 0, comments: 0 },
      }
    ];

    (ArticleRepository.findPublished as jest.Mock<any>).mockResolvedValue({ articles: mockArticles, total: 2 });

    const result = await ArticleService.listPublished(1, 10);

    expect(ArticleRepository.findPublished).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual({
      articles: [
        {
          id: '1',
          title: 'Title 1',
          authorId: 'user1',
          tags: ['test'],
          status: 'Published',
          createdAt: mockArticles[0].createdAt,
          updatedAt: mockArticles[0].updatedAt,
          likeCount: 5,
          commentCount: 2,
        },
        {
          id: '2',
          title: 'Title 2',
          authorId: 'user2',
          tags: [],
          status: 'Published',
          createdAt: mockArticles[1].createdAt,
          updatedAt: mockArticles[1].updatedAt,
          likeCount: 0,
          commentCount: 0,
        }
      ],
      total: 2,
      page: 1,
      limit: 10,
    });
  });

  it('should handle undefined _count gracefully', async () => {
    const mockArticles = [
      {
        id: '1',
        title: 'Title 1',
        authorId: 'user1',
        tags: [],
        status: 'Published',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    (ArticleRepository.findPublished as jest.Mock<any>).mockResolvedValue({ articles: mockArticles, total: 1 });

    const result = await ArticleService.listPublished(1, 10);

    expect(result.articles[0].likeCount).toBe(0);
    expect(result.articles[0].commentCount).toBe(0);
  });
});

