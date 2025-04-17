# HappyRobot Assignment

This is a Node.js/Express service for handling truck loads and FMCSA data.

## Prerequisites

- Docker
- Node.js (for local development)
- Google Cloud SDK (for Cloud Run)

## Local Testing

1. Create a `.env` file in the project root with your FMCSA API key:

   ```env
   FMCSA_API_KEY=your_api_key_here
   ```

2. Build the Docker image:

   ```bash
   docker build -t happyrobot-assignment .
   ```

3. Run the container, injecting env vars from `.env` without baking them into the image:

   ```bash
   docker run --rm -p 8080:8080 --env-file .env happyrobot-assignment
   ```

4. Verify endpoints:

   ```bash
   curl http://localhost:8080/health
   curl http://localhost:8080/loads?origin=NY
   ```

## Deploy to Cloud Run

1. Configure project and region:

   ```bash
   gcloud config set project YOUR_PROJECT_ID
   gcloud config set run/region YOUR_REGION
   ```

2. Build and submit image:

   ```bash
   gcloud builds submit --tag gcr.io/$PROJECT_ID/happyrobot-assignment
   ```

3. Deploy with FMCSA_API_KEY injected at runtime:

   ```bash
   gcloud run deploy happyrobot-assignment \
     --image gcr.io/$PROJECT_ID/happyrobot-assignment \
     --platform managed \
     --set-env-vars FMCSA_API_KEY=$FMCSA_API_KEY
   ```

### Using Secret Manager (optional)

1. Create a secret in Secret Manager:

   ```bash
   echo -n "$FMCSA_API_KEY" | gcloud secrets create FMCSA_API_KEY --data-file=-
   ```

2. Deploy with secret injection:

   ```bash
   gcloud run deploy happyrobot-assignment \
     --image gcr.io/$PROJECT_ID/happyrobot-assignment \
     --platform managed \
     --set-secrets FMCSA_API_KEY=FMCSA_API_KEY:latest
   ```