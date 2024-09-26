import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from './author.service';
import { AuthorRepository } from './author.repository';
import { CreateAuthorDto } from '../../../dtos/author/create-author.dto';
import { UpdateAuthorDto } from '../../../dtos/author/update-author.dto';
import { FilterAuthorDto } from 'src/dtos/author/filter-author.dto';
import { AuthorEntity } from '../../../entities/author.entity';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

describe('AuthorService', () => {
  let service: AuthorService;
  let repository: AuthorRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        {
          provide: AuthorRepository,
          useValue: {
            create: jest.fn(),
            findMany: jest.fn(),
            countAuthor: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
    repository = module.get<AuthorRepository>(AuthorRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an author', async () => {
      const createAuthorDto: CreateAuthorDto = { name: 'Test Author', createdAt: new Date(), updatedAt: new Date() };
      const author = { id: '1', ...createAuthorDto, isActive: true };
      jest.spyOn(repository, 'create').mockResolvedValue(author);

      const result = await service.create(createAuthorDto);
      expect(result).toEqual(author);
      expect(repository.create).toHaveBeenCalledWith({ data: createAuthorDto });
    });
  })

  describe('findOne', () => {
    it('should return a single author', async () => {
      const author: AuthorEntity = { id: '1', name: 'Test Author', isActive: true, createdAt: new Date(), updatedAt: new Date() };
      jest.spyOn(repository, 'findOne').mockResolvedValue(author);

      const result = await service.findOne('1');
      expect(result).toEqual(plainToInstance(AuthorEntity, author));
      expect(repository.findOne).toHaveBeenCalledWith({ id: '1' });
    });

    it('should return null if author is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.findOne('1');
      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ id: '1' });
    });
  });

  describe('remove', () => {
    it('should deactivate an author', async () => {
      const author = { id: '1', name: 'Test Author', description: 'Test Description', isActive: false, createdAt: new Date(), updatedAt: new Date() };
      jest.spyOn(repository, 'update').mockResolvedValue(author);

      const result = await service.remove('1');
      expect(result).toEqual(plainToInstance(AuthorEntity, author));
      expect(repository.update).toHaveBeenCalledWith({ id: { id: '1' }, data: { isActive: false } });
    });
  });

  describe('active', () => {
    it('should activate an author', async () => {
      const author = { id: '1', name: 'Test Author', description: 'Test Description', isActive: true, createdAt: new Date(), updatedAt: new Date() };
      jest.spyOn(repository, 'update').mockResolvedValue(author);

      const result = await service.active('1');
      expect(result).toEqual(plainToInstance(AuthorEntity, author));
      expect(repository.update).toHaveBeenCalledWith({ id: { id: '1' }, data: { isActive: true } });
    });
  });

  describe('update', () => {
    it('should update and return an author', async () => {
      const updateAuthorDto: UpdateAuthorDto = { name: 'Updated Author', updatedAt: new Date() };
      const author = { id: '1', ...updateAuthorDto, isActive: true, createdAt: new Date(), updatedAt: new Date() };
      jest.spyOn(repository, 'update').mockResolvedValue(author);

      const result = await service.update('1', updateAuthorDto);
      expect(result).toEqual(plainToInstance(AuthorEntity, author));
      expect(repository.update).toHaveBeenCalledWith({ id: { id: '1' }, data: updateAuthorDto });
    });
  });

  describe('findAll', () => {
    it('should return an array of authors with pagination data', async () => {
      const filter: FilterAuthorDto = { limit: 2, page: 1, name: 'Test' };
      const authors: AuthorEntity[] = [{ id: '1', name: 'Test Author', isActive: true, createdAt: new Date(), updatedAt: new Date() }];
      jest.spyOn(repository, 'findMany').mockResolvedValue(authors);
      jest.spyOn(repository, 'countAuthor').mockResolvedValue(1);

      const result = await service.findAll(filter);
      expect(result.data).toEqual(plainToInstance(AuthorEntity, authors));
      expect(result.totalItem).toEqual(1);
      expect(result.totalPages).toEqual(1);
      expect(result.currentPage).toEqual(1);
      expect(result.limit).toEqual(2);
      expect(repository.findMany).toHaveBeenCalled();
      expect(repository.countAuthor).toHaveBeenCalled();
    });
  });
});
