import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Project } from '../entity/project.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class ProjectService {

  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>
  ) {}

  
}