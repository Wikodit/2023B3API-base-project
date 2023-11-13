export class ProjectReponseSimpleDto {
  id: string;
  name: string;
  referringEmployeeId: string;
  constructor(id: string, name: string, referringEmployeeId: string) {
    this.id = id;
    this.name = name;
    this.referringEmployeeId = referringEmployeeId;
  }
}
