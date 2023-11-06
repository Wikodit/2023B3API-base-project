export class ProjectUsersResponseDto {
  id: string;
  startDate: Date;
  endDate: Date;
  userId: string;
  projectId: string;
  constructor(
    id: string,
    startDate: Date,
    endDate: Date,
    userId: string,
    projectId: string,
  ) {
    this.id = id;
    this.startDate = startDate;
    this.endDate = endDate;
    this.userId = userId;
    this.projectId = projectId;
  }
}
