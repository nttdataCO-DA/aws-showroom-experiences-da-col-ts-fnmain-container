export const config = {
  // BASE CONFIGURATION
  PORT: process.env.PORT ?? 3000,
  SECRET_CODE: process.env.SECRET_CODE ?? "< secret code >",
  AUTH_ENABLE: (process.env.AUTH_ENABLE ?? "false") === "true",
  
  // COSMOS DB CONFIGURATION
  COSMOS_DATABASE: process.env.COSMOS_DATABASE ?? "<cosmos database>",
  COSMOS_CONTAINER_RESOURCE: process.env.COSMOS_CONTAINER_RESOURCE ?? "<cosmos container>",
  COSMOS_CONTAINER_DEPLOYMENT: process.env.COSMOS_CONTAINER_DEPLOYMENT ?? "<cosmos container>",
  COSMOS_ENDPOINT: process.env.COSMOS_ENDPOINT ?? "<cosmos endpoint>",
  COSMOS_KEY: process.env.COSMOS_KEY ?? "<cosmos key>",
  
  // SENDGRID CONFIGURATION
  SEND_GRID_API_KEY: process.env.SEND_GRID_API_KEY ?? "< sendgrid private key >",
  SEND_GRID_SENDER_EMAIL: process.env.SEND_GRID_SENDER_EMAIL ?? "< sendgrid private sender >",
  SEND_GRID_TEMPLATE_ID: process.env.SEND_GRID_TEMPLATE_ID ?? "< sendgrid template id >",
  SEND_GRID_ENABLE: (process.env.SEND_GRID_ENABLE ?? "false") === "true",
  
  // GITHUB CONFIGURATION
  GITHUB_APP_CLIENT_ID: process.env.GITHUB_APP_CLIENT_ID ?? "< github client id >",
  GITHUB_APP_PRIVATE_KEY_PATH: process.env.GITHUB_APP_PRIVATE_KEY_PATH ?? "< github path for private key >",
  GITHUB_ORGANIZATION: process.env.GITHUB_ORGANIZATION ?? "< github organization >",
  GITHUB_REPOSITORY_TEMPLATE: process.env.GITHUB_REPOSITORY_TEMPLATE ?? "< github repository template >",
  GITHUB_USE_ENTERPSISE_SECRETS: (process.env.GITHUB_USE_ENTERPSISE_SECRETS ?? "false") === "true",
  GITHUB_ACTIONS_ARE_DISABLED: (process.env.GITHUB_ACTIONS_ARE_DISABLED ?? "false") === "true",
  GITHUB_COLLABORATOR_ROLE: process.env.GITHUB_COLLABORATOR_ROLE ?? "push", // pull, triage, push, maintain, admin
  GITHUB_REPOSITORY_NAME_PREFIX: process.env.GITHUB_REPOSITORY_NAME_PREFIX ?? "iac-portal-",

  // PROVISION PORTAL CONFIGURATION TO CREATE AS SECRETS OF REPOSITORY 
  PROVISION_PORTAL_PARAM_CODE: process.env.SECRET_CODE ?? "< code for notifications >",
  PROVISION_PORTAL_NOTIFICATION_URL: process.env.PROVISION_PORTAL_NOTIFICATION_URL ?? "< notification url >",
  PROVISION_PORTAL_ARM_CLIENT_ID: process.env.PROVISION_PORTAL_ARM_CLIENT_ID ?? "< arm client id >",
  PROVISION_PORTAL_ARM_CLIENT_SECRET: process.env.PROVISION_PORTAL_ARM_CLIENT_SECRET ?? "< arm client secret >",
  PROVISION_PORTAL_ARM_SUBSCRIPTION_ID: process.env.PROVISION_PORTAL_ARM_SUBSCRIPTION_ID ?? "< arm subscription id >",
  PROVISION_PORTAL_ARM_TENANT_ID: process.env.PROVISION_PORTAL_ARM_TENANT_ID ?? "< arm tenant id >",
  
  // SERVICE BUS CONFIGURATION TO SCHEDULIF OF DEPLOYMENTS
  SERVICE_BUS_CONNECTION_STRING: process.env.SERVICE_BUS_CONNECTION_STRING ?? "< service bus connection string >",
  SERVICE_BUS_CONNECTION_QUEUE_NAME: process.env.SERVICE_BUS_CONNECTION_QUEUE_NAME ?? "< service bus queue name >",

};
