import { jest } from '@jest/globals';
import crypto from 'node:crypto';
import { AppError } from '../../../errors/AppError.js';
import type { ArticleRepository } from '../../repositories/articleRepository.js';

// Side-effect dependencies that aren't injected — still mock via module system
jest.unstable_mockModule('../../repositories/articleReviewRepository.js', () => {
  const mockFindLatest = jest.fn();
  return {
    default: { findLatestByArticleId: mockFindLatest },
    ArticleReviewRepository: jest.fn().mockImplementation(() => ({ findLatestByArticleId: mockFindLatest })),
  };
});

jest.unstable_mockModule('../../repositories/articleAttachmentRepository.js', () => {
  const mockCreate = jest.fn();
  return {
    default: { create: mockCreate },
    ArticleAttachmentRepository: jest.fn().mockImplementation(() => ({ create: mockCreate })),
  };
});

jest.unstable_mockModule('../../lib/b2Client.js', () => ({
  default: {
    uploadFile: jest.fn(),
  },
}));

const { ArticleService } = await import('../articleService.js');
const { default: ArticleAttachmentRepository } = await import('../../repositories/articleAttachmentRepository.js');
const { default: ArticleReviewRepository } = await import('../../repositories/articleReviewRepository.js');
const { default: b2Client } = await import('../../lib/b2Client.js');

// Build a typed mock repository object — injected directly into the service.
const makeRepo = (): jest.Mocked<Pick<ArticleRepository, 'create' | 'findById' | 'update' | 'updateStatus' | 'findPublished'>> => ({
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  updateStatus: jest.fn(),
  findPublished: jest.fn(),
});

describe('ArticleService.createArticle', () => {
  const authorId = 'user-123';
  let mockRepo: ReturnType<typeof makeRepo>;
  let service: InstanceType<typeof ArticleService>;

  beforeEach(() => {
    mockRepo = makeRepo();
    service = new ArticleService(
      mockRepo as unknown as ArticleRepository,
      ArticleReviewRepository as any,
      ArticleAttachmentRepository as any
    );
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

      await expect(service.createArticle(input, authorId, images))
        .rejects.toThrow(new AppError('Maximum 10 images per article', 400));
    });

    it('should throw AppError if an image exceeds 5MB', async () => {
      const input = { title: 'Test Title', body: { type: 'doc' } };
      const images = [{ size: 6 * 1024 * 1024, mimetype: 'image/jpeg' } as Express.Multer.File];

      await expect(service.createArticle(input, authorId, images))
        .rejects.toThrow(new AppError('Image size cannot exceed 5MB', 400));
    });

    it('should throw AppError if an image has invalid mimetype', async () => {
      const input = { title: 'Test Title', body: { type: 'doc' } };
      const images = [{ size: 1024, mimetype: 'application/pdf' } as Express.Multer.File];

      await expect(service.createArticle(input, authorId, images))
        .rejects.toThrow(new AppError('Only jpeg, png, webp, and gif images are allowed', 400));
    });

    it('should throw AppError if title is missing or empty', async () => {
      const input = { title: '   ', body: { type: 'doc' } };
      await expect(service.createArticle(input, authorId))
        .rejects.toThrow(new AppError('Title is required and cannot be empty', 400));
    });

    it('should throw AppError if title exceeds 500 characters', async () => {
      const input = { title: 'a'.repeat(501), body: { type: 'doc' } };
      await expect(service.createArticle(input, authorId))
        .rejects.toThrow(new AppError('Title cannot exceed 500 characters', 400));
    });

    it('should throw AppError if body is a string', async () => {
      const input = { title: 'Valid Title', body: '<p>HTML body</p>' as unknown as never };
      await expect(service.createArticle(input, authorId))
        .rejects.toThrow(new AppError('Body must be valid JSONContent, raw HTML is not allowed', 400));
    });

    it('should throw AppError if body is an array', async () => {
      const input = { title: 'Valid Title', body: [] as unknown as never };
      await expect(service.createArticle(input, authorId))
        .rejects.toThrow(new AppError('Body must be a valid JSON object', 400));
    });

    it('should throw AppError if body is not empty and lacks a "type" field', async () => {
      const input = { title: 'Valid Title', body: { content: 'hello' } as unknown as never };
      await expect(service.createArticle(input, authorId))
        .rejects.toThrow(new AppError('Body must have a "type" field', 400));
    });
  });

  describe('Creation', () => {
    it('should successfully create an article without images', async () => {
      const input = { title: 'Valid Title', body: { type: 'doc' }, tags: ['test'] };
      const createdArticle = { id: 'article-123', ...input, authorId };

      mockRepo.create.mockResolvedValue(createdArticle as never);

      const result = await service.createArticle(input, authorId);

      expect(mockRepo.create).toHaveBeenCalledWith({
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

      mockRepo.create.mockResolvedValue(createdArticle as never);
      (b2Client.uploadFile as jest.Mock<any>).mockResolvedValue(uploadedFile);
      (ArticleAttachmentRepository.create as jest.Mock<any>).mockResolvedValue(createdAttachment);

      const result = await service.createArticle(input, authorId, images);

      expect(mockRepo.create).toHaveBeenCalled();
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

      mockRepo.create.mockResolvedValue(createdArticle as never);
      (b2Client.uploadFile as jest.Mock<any>).mockRejectedValue(new Error('Upload failed'));

      const result = await service.createArticle(input, authorId, images);

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
  let mockRepo: ReturnType<typeof makeRepo>;
  let service: InstanceType<typeof ArticleService>;

  beforeEach(() => {
    mockRepo = makeRepo();
    service = new ArticleService(
      mockRepo as unknown as ArticleRepository,
      ArticleReviewRepository as any,
      ArticleAttachmentRepository as any
    );
    jest.clearAllMocks();
    process.env.B2_BUCKET_NAME = 'test-bucket';
  });

  afterEach(() => {
    delete process.env.B2_BUCKET_NAME;
  });

  it('should throw AppError if article is not found', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(service.updateArticle(articleId, {}, authorId))
      .rejects.toThrow(new AppError('Article not found', 404));
  });

  it('should throw AppError if user is not the author', async () => {
    mockRepo.findById.mockResolvedValue({ authorId: 'other-user' } as never);

    await expect(service.updateArticle(articleId, {}, authorId))
      .rejects.toThrow(new AppError('Only the author can edit this article', 403));
  });

  it('should throw AppError if article is not Draft or Rejected', async () => {
    mockRepo.findById.mockResolvedValue({ authorId, status: 'Published' } as never);
    (ArticleReviewRepository.findLatestByArticleId as jest.Mock<any>).mockResolvedValue({ reviewStatus: 'Approved' });

    await expect(service.updateArticle(articleId, {}, authorId))
      .rejects.toThrow(new AppError('Only Draft or Rejected articles can be edited', 400));
  });

  it('should allow editing if article is Draft', async () => {
    const existingArticle = { id: articleId, authorId, status: 'Draft', title: 'Old Title' };
    mockRepo.findById.mockResolvedValue(existingArticle as never);

    const updatedArticle = { ...existingArticle, title: 'New Title' };
    mockRepo.update.mockResolvedValue(updatedArticle as never);

    const result = await service.updateArticle(articleId, { title: 'New Title' }, authorId);

    expect(mockRepo.update).toHaveBeenCalledWith(articleId, { title: 'New Title' });
    expect(result).toEqual(updatedArticle);
  });

  it('should reset status to Draft if article was Rejected', async () => {
    const existingArticle = { id: articleId, authorId, status: 'In Review' };
    mockRepo.findById.mockResolvedValue(existingArticle as never);
    (ArticleReviewRepository.findLatestByArticleId as jest.Mock<any>).mockResolvedValue({ reviewStatus: 'Rejected' });

    const updatedArticle = { ...existingArticle, status: 'Draft', title: 'New Title' };
    mockRepo.update.mockResolvedValue(updatedArticle as never);

    const result = await service.updateArticle(articleId, { title: 'New Title' }, authorId);

    expect(mockRepo.update).toHaveBeenCalledWith(articleId, { title: 'New Title', status: 'Draft' });
    expect(result).toEqual(updatedArticle);
  });

  it('should return existing article if no updates and no images provided', async () => {
    const existingArticle = { id: articleId, authorId, status: 'Draft', title: 'Old Title' };
    mockRepo.findById.mockResolvedValue(existingArticle as never);

    const result = await service.updateArticle(articleId, {}, authorId);

    expect(mockRepo.update).not.toHaveBeenCalled();
    expect(result).toEqual(existingArticle);
  });

  it('should successfully upload new images', async () => {
    const existingArticle = { id: articleId, authorId, status: 'Draft', title: 'Old Title' };
    mockRepo.findById.mockResolvedValue(existingArticle as never);

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

    const result = await service.updateArticle(articleId, {}, authorId, images);

    expect(mockRepo.update).not.toHaveBeenCalled();
    expect(result).toEqual({
      ...existingArticle,
      attachments: [createdAttachment],
    });
  });
});

describe('ArticleService.submitForReview', () => {
  const authorId = 'user-123';
  const articleId = 'article-123';
  let mockRepo: ReturnType<typeof makeRepo>;
  let service: InstanceType<typeof ArticleService>;

  beforeEach(() => {
    mockRepo = makeRepo();
    service = new ArticleService(
      mockRepo as unknown as ArticleRepository,
      ArticleReviewRepository as any,
      ArticleAttachmentRepository as any
    );
    jest.clearAllMocks();
  });

  it('should throw AppError if article is not found', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(service.submitForReview(articleId, authorId))
      .rejects.toThrow(new AppError('Article not found', 404));
  });

  it('should throw AppError if user is not the author', async () => {
    mockRepo.findById.mockResolvedValue({ authorId: 'other-user' } as never);

    await expect(service.submitForReview(articleId, authorId))
      .rejects.toThrow(new AppError('Only the author can edit this article', 403));
  });

  it('should throw AppError if article status is not Draft', async () => {
    mockRepo.findById.mockResolvedValue({ authorId, status: 'Pending' } as never);

    await expect(service.submitForReview(articleId, authorId))
      .rejects.toThrow(new AppError('Cannot transition from Pending to Pending', 400));
  });

  it('should submit article for review successfully', async () => {
    const existingArticle = { id: articleId, authorId, status: 'Draft' };
    const updatedArticle = { ...existingArticle, status: 'Pending' };

    mockRepo.findById.mockResolvedValue(existingArticle as never);
    mockRepo.updateStatus.mockResolvedValue(updatedArticle as never);

    const result = await service.submitForReview(articleId, authorId);

    expect(mockRepo.updateStatus).toHaveBeenCalledWith(articleId, 'Pending');
    expect(result).toEqual(updatedArticle);
  });
});

describe('ArticleService.listPublished', () => {
  let mockRepo: ReturnType<typeof makeRepo>;
  let service: InstanceType<typeof ArticleService>;

  beforeEach(() => {
    mockRepo = makeRepo();
    service = new ArticleService(
      mockRepo as unknown as ArticleRepository,
      ArticleReviewRepository as any,
      ArticleAttachmentRepository as any
    );
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

    mockRepo.findPublished.mockResolvedValue({ articles: mockArticles, total: 2 } as never);

    const result = await service.listPublished(1, 10);

    expect(mockRepo.findPublished).toHaveBeenCalledWith(1, 10);
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

    mockRepo.findPublished.mockResolvedValue({ articles: mockArticles, total: 1 } as never);

    const result = await service.listPublished(1, 10);

    expect(result.articles[0].likeCount).toBe(0);
    expect(result.articles[0].commentCount).toBe(0);
  });
});

describe('ArticleService.getPublishedById', () => {
  const articleId = 'article-123';
  let mockRepo: ReturnType<typeof makeRepo>;
  let service: InstanceType<typeof ArticleService>;

  beforeEach(() => {
    mockRepo = makeRepo();
    service = new ArticleService(
      mockRepo as unknown as ArticleRepository,
      ArticleReviewRepository as any,
      ArticleAttachmentRepository as any
    );
    jest.clearAllMocks();
  });

  it('should return the article when it exists and is Published', async () => {
    const article = { id: articleId, status: 'Published', title: 'My Article', authorId: 'user-1' };
    mockRepo.findById.mockResolvedValue(article as never);

    const result = await service.getPublishedById(articleId);

    expect(mockRepo.findById).toHaveBeenCalledWith(articleId);
    expect(result).toEqual(article);
  });

  it('should throw 404 if article does not exist', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(service.getPublishedById(articleId))
      .rejects.toThrow(new AppError('Article not found', 404));
  });

  it('should throw 403 if article is Draft', async () => {
    mockRepo.findById.mockResolvedValue({ id: articleId, status: 'Draft' } as never);

    await expect(service.getPublishedById(articleId))
      .rejects.toThrow(new AppError('Article not available', 403));
  });

  it('should throw 403 if article is Pending', async () => {
    mockRepo.findById.mockResolvedValue({ id: articleId, status: 'Pending' } as never);

    await expect(service.getPublishedById(articleId))
      .rejects.toThrow(new AppError('Article not available', 403));
  });

  it('should throw 403 if article is Unpublished', async () => {
    mockRepo.findById.mockResolvedValue({ id: articleId, status: 'Unpublished' } as never);

    await expect(service.getPublishedById(articleId))
      .rejects.toThrow(new AppError('Article not available', 403));
  });
});


