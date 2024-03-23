import { JwtPayload } from "jwt-decode";

export interface ApplicantDetails {
  requisitionID: number;
  name: string;
  email: string;
  phone: {
    countryCode: string;
    number: string;
  };
  currentCTC: number;
  expectedCTC: number;
  experience: number;
  noticePeriod: number;
  resumeFileKey: { key?: string; type?: string };
  location: string;
  skills: string[];
}

export interface IFeedback {
  questionAsked?: string;
  answers?: string;
  skillScores: {
    [skill: string]: number;
  };
}

export interface CustomJWTPayload extends JwtPayload {
  name?: string;
  role?: string;
  imageURL?: string;
  email?: string;
}

export interface IIndividualInterview {
  roundNumber: number;
  roundName: string;
  date: string;
  interviewers: string[];
  feedbackStatus: string;
  interviewStartTime: string;
  interviewEndTime: string;
  interviewLink: string;
  dataValues: any;
}

export interface InterviewInfo {
  requisitionID?: number;
  applicationID?: number;
  roundName?: string | undefined;
  roundNumber?: number;
  startTime: string | undefined;
  endTime: string | undefined;
  date: string | undefined;
  interviewLink: string | undefined;
  panelists: string[];
}

export interface UpdateInterviewInfo extends InterviewInfo {
  interviewID?: number;
}

export interface RequisitionProfileAttributes {
  title: string;
  jobDescription: string;
  skills: string[];
  band: string;
  experience?: number;
  grade: string;
  interviewRounds?: string[];
  location: string[];
  panelists: string[];
  minExperience: number;
  maxExperience: number;
  requisitionID: number | string;
  requisitionStatus?: string;
  hrApprovalStatus?: string;
  buApprovalStatus?: string;
  financeApprovalStatus?: string;
  rejectionMessage?: Record<string, string>;
}

export interface ApplicantFilter {
  status: string;
  minimumExperience: number | null;
  maximumExperience: number | null;
  noticePeriod: number | null;
}

export interface IFeedbackSchema {
  interviewID: number;
  applicationID: number;
  roundName: string;
  roundNumber: number;
  feedback: IFeedback;
  overallRemarks: string;
  feedbackStatus: string;
  createdBy: string;
  feedbackID: number;
}
export interface IResume {
  key: string;
  type: string;
}

export interface IIndividualApplicant {
  applicationID: number;
  name: string;
  experience: string;
  grade: string;
  resume: IResume;
  screeningStatus?: React.ReactNode;
  applicationStatus: string;
  noticePeriod: string;
  report?: string;
}
