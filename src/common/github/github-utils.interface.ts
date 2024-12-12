// import { IDeployment } from "../../deployment/model/deployment.validator";

export interface GithubAuth {
    oauthToken?: string;
    installationId?: string;
    accessId?: string;
    accessToken?: string;
}

// export interface GitHubInputsActions {
//     key: string;
//     value?: string;
// }

// export enum EventParametersKind {
//     DeploymentEvent = 'DeploymentEvent',
//     DestroyEvent = 'DestroyEvent'
// }

// export interface EventParameters {
//     body?: IDeployment;
//     contentType?: string;
//     kind?: EventParametersKind;
// }

// export interface BaseParamsnNotification {
//     [key: string]: any;
//     id?: string;
//     country?: string;
//     costCenter?: string;
//     customer?: string;
//     requester?: string;
//     approver?: string;
//     repositorySourceName?: string;
//     repositoryTargetBranchRef?: string;
// }