import express from 'express';
//import deploymentRoutes from './routes/deployment.route';
import resourceRoutes from './routes/resource.route';
import { authenticateSecretCode } from './middleware/basic-auth.middleware';
import cors from 'cors'

const app = express();
const port = 3000;
app.use(cors());

app.use(function (req, res, next) {
    authenticateSecretCode(req, res, next);
});

app.use(express.json());
//app.use('/api/provisioning/deployment', deploymentRoutes);
app.use('/api/provisioning/resource', resourceRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;