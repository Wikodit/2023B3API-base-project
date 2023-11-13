import { ApiProperty } from '@nestjs/swagger';

export class ProjectReponsePartialDto {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty({ type: String })
  name: string;
  @ApiProperty({ type: String })
  referringEmployeeId: string;
  constructor(id: string, name: string, referringEmployeeId: string) {
    this.id = id;
    this.name = name;
    this.referringEmployeeId = referringEmployeeId;
  }
}
