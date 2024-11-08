import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class CRUDService {
  constructor(private repository: any) {}

  async create(body: any) {
    const entry = await this.repository.save(body);
    return entry;
  }

  findAll(userId: number): Promise<any[]> {
    return this.repository.find({
      where: {
        userId,
      },
    });
  }

  async findById(userId: number, id: number) {
    const entry = await this.repository.findOneBy({ id: id });

    if (!entry) throw new NotFoundException();

    if (entry.userId !== userId)
      throw new ForbiddenException('You cannot access to this resource');

    return entry;
  }

  async update(userId: number, id: number, updateDto: any) {
    const entry = await this.repository.findOneBy({ id });

    if (!entry) throw new NotFoundException();

    if (entry.userId !== userId)
      throw new ForbiddenException('You cannot access to this resource');

    return this.repository.update(id, updateDto);
  }

  async delete(userId: number, id: number) {
    const entry = await this.repository.findOneBy({ id });

    if (!entry) throw new NotFoundException();

    if (entry.userId !== userId)
      throw new ForbiddenException('You cannot access to this resource');

    await this.repository.remove(entry);

    return;
  }
}
