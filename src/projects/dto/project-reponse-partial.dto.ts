import { ApiProperty } from '@nestjs/swagger';
export class ProjectReponsePartialDto {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty({ type: String })
  name: string;
  @ApiProperty({ type: String })
  referringEmployeeId: string;
}
