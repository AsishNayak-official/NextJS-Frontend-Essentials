import { store } from "@/app/redux/store";
import { ApplicantFilter } from "@/app/types/interfaces";
import axios from "./index";

export function createRequisition(
  band: string,
  grade: string,
  title: string,
  jobDescriptionFileKey: { key?: string; type?: string },
  skills: string[],
  businessUnit: string,
  panelists: string[],
  interviewRounds: string[],
  location: string[],
  maxExperience: number,
  minExperience: number,
  hiringManager: string | null
) {
  const requestBody: Record<string, any> = {
    band,
    grade,
    title,
    skills,
    businessUnit,
    panelists,
    interviewRounds,
    location,
    jobDescriptionFileKey,
    maxExperience,
    minExperience,
  };
  if (hiringManager) requestBody["hiringManager"] = hiringManager;
  return axios.post("/requisition", requestBody, {
    headers: {
      Authorization: store.getState()?.auth?.accessToken ?? "",
    },
  });
}

export function getSkills() {
  return axios.get("/master/skills");
}

export function getHR_Recruiters() {
  return axios.get("/master/users/HR_RECRUITER");
}
export function getHiringManager() {
  return axios.get("/master/users/HIRING_MANAGER");
}

export function deleteRequisition(requisitionID: string) {
  return axios.delete(`/requisition/${requisitionID}`);
}

export function getJobDetails() {
  return axios.get("/master/jobDetails");
}

export function getBusinessUnit() {
  return axios.get("/master/businessUnits");
}

export function getLocations() {
  return axios.get("/master/locations");
}
export interface IRequisitionStatusUpdate {
  status: string;
  message?: string;
}
export function updateRequisitionStatus(
  requisitionID: string | number,
  requisitionDetails: IRequisitionStatusUpdate
) {
  return axios.patch(`requisition/${requisitionID}`, { ...requisitionDetails });
}

export function getRequisitions(page: number, pageSize: number) {
  return axios.get(`/requisitions?page=${page}&pageSize=${pageSize}`);
}
export function assignHRRecruiter(
  requisitionID: number | string,
  hrRecruiters: string[]
) {
  return axios.patch(`/requisition/${requisitionID}/hr-assignments`, {
    hrRecruiters,
  });
}
export function downloadJobDescription(requisitionID: number | string) {
  return axios.get(`/requisition/${requisitionID}/jobDescription`);
}

export function getAllRequisitions() {
  return axios.get("/requisitions");
}
export function getRequisitionApplicants(
  requisitionID: number | string,
  page: number,
  pageSize: number,
  filterOptions: ApplicantFilter
) {
  return axios.get(
    `/applications?requisitionID=${requisitionID}&status=${filterOptions.status}&minExperience=${filterOptions?.minimumExperience ?? ''}&maxExperience=${filterOptions?.maximumExperience ?? ''}&noticePeriod=${filterOptions?.noticePeriod ?? ''}&page=${page}&pageSize=${pageSize}`
  );
}

export function getRequisitionProfile(requisitionID: number | string) {
  return axios.get(`/requisition/${requisitionID}`);
}

export function getAllRequisitionsOnlyName() {
  return axios.get(`/requisitions/all`);
}
