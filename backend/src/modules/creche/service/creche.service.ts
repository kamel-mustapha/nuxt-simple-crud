import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Creche } from '../creche.entity';
import { Repository } from 'typeorm';
import { CRUDService } from 'src/common/base-crud.service';
import { KidService } from 'src/modules/kid/service/kid.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class CrecheService extends CRUDService {
  constructor(
    @InjectRepository(Creche) private crecheRepository: Repository<Creche>,
    private kidService: KidService,
    private readonly mailerService: MailerService,
  ) {
    super(crecheRepository);
  }

  async findById(userId: number, id: number) {
    const entry = await this.crecheRepository.findOne({
      where: { id: id },
      relations: { kids: true },
    });

    if (!entry) throw new NotFoundException();

    if (entry.userId !== userId)
      throw new ForbiddenException('You cannot access to this resource');

    return entry;
  }

  async findCrecheChildrens(userId: number, id: number) {
    const creche = await this.crecheRepository.findOne({
      where: { id },
      relations: { kids: true },
    });

    if (!creche) throw new NotFoundException();

    if (creche.userId !== userId)
      throw new ForbiddenException('You cannot access to this resource');

    return [...creche.kids];
  }

  async deleteChildFromCreche(
    userId: number,
    crecheId: number,
    childId: number,
  ) {
    // we fetch creche to see if it exists and it's created by the user who made the request
    const creche = await this.crecheRepository.findOne({
      where: { id: crecheId },
      relations: { kids: true },
    });

    if (!creche) throw new NotFoundException();

    if (creche.userId !== userId)
      throw new ForbiddenException('You cannot access to this resource');

    // we fetch child to see if it exists and it's created by the user who made the request
    const child = await this.kidService.findKidById(childId);

    if (!child) throw new NotFoundException();

    if (child.userId !== userId)
      throw new ForbiddenException('You cannot access to this resource');

    // we check if the association kid > creche exist
    if (!creche.kids.map((kid) => kid.id).includes(childId))
      throw new NotFoundException('Association not found');

    // we delete the association
    creche.kids = creche.kids.filter((kid) => kid.id !== childId);

    await this.crecheRepository.save(creche);

    // delete the child if there's no more associations
    if (child.creches.length === 1) await this.kidService.deleteKid(child);

    return creche;
  }

  async delete(userId: number, id: number) {
    const creche = await this.crecheRepository.findOne({
      where: { id },
      relations: { kids: true },
    });
    if (!creche) throw new NotFoundException();
    if (creche.userId !== userId)
      throw new ForbiddenException('You cannot access to this resource');

    let crecheKids = creche.kids;

    // we filter the user who deleted the creche
    crecheKids = crecheKids.filter((kid) => kid.userId !== userId);

    const usersWithRelatedKidsEmails = [
      ...new Set(crecheKids.map((kid) => kid.user.email)),
    ];

    await this.crecheRepository.remove(creche);

    this.informStructureDeletion(usersWithRelatedKidsEmails);

    return;
  }

  async informStructureDeletion(userEmails: string[]): Promise<void> {
    for (let i = 0; i < userEmails.length; i++) {
      // wait between 1 and 7 seconds
      const secondsToWait = Math.trunc(Math.random() * 7) + 1;
      // send only by 3
      if (i % 3 === 0)
        await new Promise((r) => setTimeout(r, secondsToWait * 1000));
      this.sendEmail(userEmails[i]);
    }
  }

  async sendEmail(email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Action requise',
      text: 'Une action est requise dans votre compte',
    });
  }
}
