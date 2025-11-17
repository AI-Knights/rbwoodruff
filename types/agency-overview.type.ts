export interface TrainingKPI {
  totalAssignedUsers: number;

  inProgress: {
    count: number;
  };

  completed: {
    count: number;
    statusNote: string;
  };

  nonCompliant: {
    count: number;
    statusNote: string;
  };
}
