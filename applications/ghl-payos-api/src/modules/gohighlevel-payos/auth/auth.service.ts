import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PPayOS_DB } from 'src/config';
import { AppsEntity } from 'src/shared/entities/payos/app.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GoHighLevelPayOSAuthenticationService {
  constructor(
    @InjectRepository(AppsEntity, PPayOS_DB)
    private appsRepository: Repository<AppsEntity>,
  ) {}
}
