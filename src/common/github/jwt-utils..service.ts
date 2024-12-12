import { sign, SignOptions } from 'jsonwebtoken';
import * as fs from 'fs';
import { GithubAuth } from './github-utils.interface';
import { config } from '../config/default';

const githubAppClientID: string = config.GITHUB_APP_CLIENT_ID;
const githubAppPrivateKeyPath: string = config.GITHUB_APP_PRIVATE_KEY_PATH;

export async function generateToken(): Promise<GithubAuth> {
    const githubApp: GithubAuth = generateJWT();
    const { installationId, accessId } = await getInstallationId(githubApp);
    githubApp.installationId = installationId.toString();
    githubApp.accessId = accessId.toString();
    return await fetchAccessToken(githubApp);
}

async function fetchAccessToken(githubApp: GithubAuth): Promise<GithubAuth> {
    const response = await fetch(`https://api.github.com/app/installations/${githubApp.installationId}/access_tokens`, {
        method: 'POST',
        headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${githubApp.oauthToken}`,
            "X-GitHub-Api-Version": "2022-11-28"
        }
    });
    const data = await response.json();
    return {
        ...githubApp,
        accessToken: await data.token
    };
}

async function getInstallationId(githubApp: GithubAuth): Promise<{ installationId: number, accessId: number }> {
    const response = await fetch("https://api.github.com/app/installations", {
        headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${githubApp.oauthToken}`,
            "X-GitHub-Api-Version": "2022-11-28"
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching installations: ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No installations found for the GitHub App");
    }

    return {
        installationId: data[0].id,
        accessId: data[0].account.id
    };
}

// async function getInstallationId(githubApp: GithubAuth): Promise<GithubAuth> {
//     const response = await fetch("https://api.github.com/app/installations", {
//         headers: {
//             "Accept": "application/vnd.github+json",
//             "Authorization": `Bearer ${githubApp.oauthToken}`,
//             "X-GitHub-Api-Version": "2022-11-28"
//         }
//     });
//     const data = await response.json();
//     return {
//         installationId: await data[0].id,
//         accessId: await data[0].account.id
//     };
// }

function generateJWT(): GithubAuth {
    const payload = {
        iss: githubAppClientID
    };
    const privateKey = fs.readFileSync(githubAppPrivateKeyPath);
    const signInOptions: SignOptions = {
        algorithm: 'RS256',
        expiresIn: '5m'
    };
    return {
        oauthToken: sign(payload, privateKey, signInOptions)
    }
}