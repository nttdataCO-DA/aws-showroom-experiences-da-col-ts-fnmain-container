import { GithubAuth } from "./github-utils.interface";
import { generateToken } from "./jwt-utils..service";

import simpleGit from 'simple-git';
import * as path from 'path';
import * as fs from 'fs';
import _sodium from 'libsodium-wrappers';
import { config } from '../config/default';

class GitHubUtils {

    private githubOrganization: string;
    private githubOrganizationTemplate: string;
   // private localPathSource: string;
   // private localPathTemplate: string;
    private githubUseEnterpriseSecrets: boolean;
    private githubActionsAreDisabled: boolean;

    constructor() {
        this.githubOrganization = config.GITHUB_ORGANIZATION;
        this.githubOrganizationTemplate = config.GITHUB_REPOSITORY_TEMPLATE;
        this.githubUseEnterpriseSecrets = config.GITHUB_USE_ENTERPSISE_SECRETS;
        this.githubActionsAreDisabled = config.GITHUB_ACTIONS_ARE_DISABLED;
       // this.localPathSource = path.join(__dirname, 'temp-source');
       // this.localPathTemplate = path.join(__dirname, 'temp-template');
    }

    private async getRepoPublicKey(name: string) {
        const publicKeyEndpoint = `https://api.github.com/repos/${this.githubOrganization}/${name}/actions/secrets/public-key`;
        const githubCreds: GithubAuth = await generateToken();
        const response = await fetch(publicKeyEndpoint, {
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": "Bearer " + githubCreds.accessToken,
                "X-GitHub-Api-Version": "2022-11-28"
            }
        });
        if (!response.ok) {
            console.error(await response.json());
            throw new Error("Error getting public key to secrets");
        }
        return await response.json();
    }

    private async initializeSodium(keyID: string, key: string) {
        const keyValuePairs: { [key: string]: string } = {
            AWS_ACCESS_KEY_ID: config.AWS_ACCESS_KEY_ID,
            AWS_SECRET_ACCESS_KEY: config.AWS_SECRET_ACCESS_KEY,
            AWS_REGION: config.AWS_DEFAULT_REGION
        };
        await _sodium.ready;
        const sodium = _sodium;
        const binkey = sodium.from_base64(key, sodium.base64_variants.ORIGINAL);
        for (const keyItem in keyValuePairs) {
            const valueItem = keyValuePairs[keyItem];
            const binsec = sodium.from_string(valueItem);
            const encBytes = sodium.crypto_box_seal(binsec, binkey);
            const output = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);
            keyValuePairs[keyItem] = output;
        }
        return keyValuePairs;
    }

    private async enableActionsForGithubRepository(repositoryId: string) {
        const actionsRepoURL = `https://api.github.com/orgs/${this.githubOrganization}/actions/permissions/repositories/${repositoryId}`;
        const githubCreds: GithubAuth = await generateToken();
        const response = await fetch(actionsRepoURL, {
            method: "PUT",
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": "Bearer " + githubCreds.accessToken,
                "X-GitHub-Api-Version": "2022-11-28"
            }
        });
        return response.ok;
    }

//     async deleteRepository(name: string) {
//         const deleteRepoURL = `https://api.github.com/repos/${this.githubOrganization}/${name}`;
//         const githubCreds: GithubAuth = await generateToken();
//         const response = await fetch(deleteRepoURL, {
//             method: "DELETE",
//             headers: {
//                 "Accept": "application/vnd.github+json",
//                 "Authorization": "Bearer " + githubCreds.accessToken,
//                 "X-GitHub-Api-Version": "2022-11-28"
//             }
//         });
//         if (!response.ok) {
//             console.error(await response.json());
//             throw new Error("Error deleting repository");
//         }
//     }

    private async createSecrets(name: string) {
        const secretEndpoint = `https://api.github.com/repos/${this.githubOrganization}/${name}/actions/secrets/`;
        const githubCreds: GithubAuth = await generateToken();
        const { key_id, key } = await this.getRepoPublicKey(name);
        const keyValuePairs = await this.initializeSodium(key_id, key);
        for (const key in keyValuePairs) {
            const value = keyValuePairs[key];
            const response = await fetch(secretEndpoint + key, {
                method: "PUT",
                headers: {
                    "Accept": "application/vnd.github+json",
                    "Authorization": "Bearer " + githubCreds.accessToken,
                    "X-GitHub-Api-Version": "2022-11-28"
                },
                body: JSON.stringify({
                    encrypted_value: value,
                    key_id: key_id
                })
            });
            if (!response.ok) {
                console.error(await response.json());
                throw new Error("Error creating secrets");
            }
        }
    }

//     async callGitHubAction(name: string, branch: string, inputs: string, workflow: string) {
//         const workflowUrl = `https://api.github.com/repos/${this.githubOrganization}/${name}/actions/workflows/${workflow}/dispatches`;
//         const githubCreds: GithubAuth = await generateToken();
//         const response = await fetch(workflowUrl, {
//             method: "POST",
//             headers: {
//                 "Accept": "application/vnd.github+json",
//                 "Authorization": "Bearer " + githubCreds.accessToken,
//                 "X-GitHub-Api-Version": "2022-11-28"
//             },
//             body: JSON.stringify({
//                 "ref": branch,
//                 "inputs": {
//                     "values": inputs
//                 }
//             })
//         });
//         if (!response.ok) {
//             console.error(await response.json());
//             throw new Error("Error calling GitHub action");
//         }
//         return response;
//     }

//     async createGitHubBranch(repositorySourceName: string, branchName: string, collaborator?: string) {
//         try {
//             const githubCreds: GithubAuth = await generateToken();
//             const sourceRepoUrl = `https://${githubCreds.accessId}:${githubCreds.accessToken}@github.com/${this.githubOrganization}/${repositorySourceName}.git`;
//             this.checkPathExists(this.localPathSource);
//             const sourceGit = simpleGit(this.localPathSource);
//             await sourceGit.clone(sourceRepoUrl, this.localPathSource);
//             await sourceGit.checkoutBranch(branchName, 'main');
//             await sourceGit.push('origin', branchName);
//             if (collaborator) {
//                 const addCollaboratorResponse = await this.addGitHubCollaborator(githubCreds, repositorySourceName, collaborator);
//                 if (!addCollaboratorResponse.ok) {
//                     throw new Error("Error adding collaborator");
//                 }
//             }
//         } catch (error: any) {
//             console.error(error);
//             if (error.message === "Error adding collaborator") {
//                 throw error;
//             }
//             throw new Error("Error generating the branch based on the repository");
//         }
//     }

async createGitHubDirectoryBasedOnTemplate(name: string, description: string, tecnologias: string[]) {
    try {
        const githubCreds: GithubAuth = await generateToken();
        const newDirectoryPath = await this.createDirectory(name, description, githubCreds);
        console.log(`new directory path: ${JSON.stringify(newDirectoryPath)}`);
        await this.fetchTemplateRepository(githubCreds, newDirectoryPath, tecnologias);

        // if (collaborator) {
        //     const addCollaboratorResponse = await this.addGitHubCollaborator(githubCreds, "nombre-del-repositorio-existente", collaborator);
        //     if (!addCollaboratorResponse.ok) {
        //         throw new Error("Error adding collaborator");
        //     }
        // }

        return {
            message: "Directorio creado y archivos copiados exitosamente",
            error: []
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}
    private async addGitHubCollaborator(githubCreds: GithubAuth, name: string, collaborator: string) {
        const url = `https://api.github.com/repos/${this.githubOrganization}/${name}/collaborators/${collaborator}`;
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${githubCreds.accessToken}`,
                "X-GitHub-Api-Version": "2022-11-28"
            },
            body: JSON.stringify({
                "permission": config.GITHUB_COLLABORATOR_ROLE
            })
        });
        return response;
    }

    private checkPathExists(path: string) {
        if (fs.existsSync(path)) {
            fs.rmSync(path, { recursive: true, force: true });
        }
        fs.mkdirSync(path, { recursive: true });
    }

    private async fetchTemplateRepository(githubCreds: GithubAuth, newDirectoryPath: string, tecnologias: string[]) {
        console.log(`inicia fetchTemplateRepository`);
        const localTemplatePath = path.join(__dirname, 'temp-template');
        const templateSandboxPath = path.join(localTemplatePath, 'experiences-da-col-template-sandbox-iac');
        const terraformModulesPath = path.join(localTemplatePath, 'poc-occidente');
        const awsTfPath = path.join(newDirectoryPath, 'experiences-da-col-template-sandbox-iac', 'roles', 'terraform_template', 'files', 'aws-tf');

        this.checkPathExists(localTemplatePath);
        const templateRepoURL = `https://${githubCreds.accessId}:${githubCreds.accessToken}@github.com/${this.githubOrganization}/${this.githubOrganizationTemplate}.git`;
        console.log(`Cloning from URL: ${templateRepoURL}`);
        const templateGit = simpleGit(localTemplatePath);
        try {
            await templateGit.clone(templateRepoURL, localTemplatePath);
        } catch (error) {
            console.error('Error cloning repository:', error);
            throw error;
        }

    fs.cpSync(templateSandboxPath, path.join(newDirectoryPath, 'experiences-da-col-template-sandbox-iac'), { recursive: true });
    fs.mkdirSync(awsTfPath, { recursive: true });

    tecnologias.forEach(tecnologia => {
        const modulePath = path.join(terraformModulesPath, tecnologia);
        if (fs.existsSync(modulePath)) {
            const destinationPath = path.join(awsTfPath, tecnologia);
            fs.cpSync(modulePath, destinationPath, { recursive: true });
        } else {
            console.warn(`El módulo ${tecnologia} no existe en poc-occidente`);
        }
    });
    
        const repoGit = simpleGit(path.join(__dirname, 'temp-repo'));
        await repoGit.add('.');
        await repoGit.commit('Add new template directory');
        await repoGit.push('origin', 'main');
    }

    private async createDirectory(name: string, description: string, githubCreds: GithubAuth): Promise<string> {
        const repoName = "aws-experiences-da-col-plantillas-main"; 
        const localRepoPath = path.join(__dirname, 'temp-repo');
        
    
        // Clonar el repositorio existente
        this.checkPathExists(localRepoPath);
        const repoUrl = `https://${githubCreds.accessId}:${githubCreds.accessToken}@github.com/${this.githubOrganization}/${repoName}.git`;
        const repoGit = simpleGit(localRepoPath);
        await repoGit.clone(repoUrl, localRepoPath);
    
        // Crear un nuevo directorio en el repositorio clonado
        const newDirectoryPath = path.join(localRepoPath, name);
        if (!fs.existsSync(newDirectoryPath)) {
            fs.mkdirSync(newDirectoryPath);
        }
    
        // Validar que el directorio fue creado
        if (!fs.existsSync(newDirectoryPath)) {
            throw new Error(`Error creating directory: ${newDirectoryPath}`);
        }
    
        return newDirectoryPath;
    }
}

export default GitHubUtils;