export class ProjectResponseDto {
  id: string;
  description?: string;
  referringEmployeeId: string;
  constructor(id: string, description: string, referringEmployeeId: string) {
    this.id = id;
    this.description = description;
    this.referringEmployeeId = referringEmployeeId;
  }
}
