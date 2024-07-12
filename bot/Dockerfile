FROM python:3.12-slim

ENV PYTHONUNBUFFERED True

ENV APP_HOME /app

ENV PORT 5000

ENV OPENAI_API_KEY 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

ENV FIREBASE_ADMIN_CREDS umassdnavigator-firebase-adminsdk.json

WORKDIR $APP_HOME

COPY . ./

RUN pip install --no-cache-dir -r requirements.txt

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 server:app
