# HappyRobot Assignment

This is a Node.js/Express service for handling truck loads and FMCSA data.

## Prerequisites

- Docker
- Node.js (for local development)

## Local Setup

1. Create a `.env` file in the project root with your API keys:

   ```env
   FMCSA_API_KEY=your_fmcsa_api_key_here
   API_KEY=your_api_key_here
   ```

   Note: The `API_KEY` is used for authentication. All API requests must include this key in the `X-API-KEY` header.

2. Build the Docker image:

   ```bash
   docker build -t happyrobot-assignment .
   ```

3. Run the container locally:

   ```bash
   docker run --rm -p 8080:8080 --env-file .env happyrobot-assignment
   ```

4. Verify the health endpoint:

   ```bash
   curl http://localhost:8080/health
   ```

5. Test protected endpoints (using your API key):

   ```bash
   curl -H "X-API-KEY: your_api_key_here" http://localhost:8080/loads/REF09460
   ```

   Or you can omit the REF prefix:

   ```bash
   curl -H "X-API-KEY: your_api_key_here" http://localhost:8080/loads/09460
   ```

## Cloud Deployment

For deploying to Google Cloud Run, follow the official guide:
[Deploy a Node.js service to Cloud Run](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service)

Remember to configure both environment variables (`FMCSA_API_KEY` and `API_KEY`) when deploying to Cloud Run.

Alternatively, you can use Google Cloud Secret Manager for more secure API key management:

```bash
# Create secrets
echo -n "your_fmcsa_api_key" | gcloud secrets create FMCSA_API_KEY --data-file=-
echo -n "your_api_key" | gcloud secrets create API_KEY --data-file=-

# Deploy with secrets
gcloud run deploy happyrobot-assignment \
  --image [YOUR-IMAGE-URL] \
  --set-secrets FMCSA_API_KEY=FMCSA_API_KEY:latest,API_KEY=API_KEY:latest
```

This approach is more secure as it avoids exposing sensitive values in your deployment history.