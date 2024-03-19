# Installation
First step is to convert all the env.example files to .env files.
Every service has it's own .env file, and the .env.example file is located in the root of the service directory.
```terminal
cp .env.example .env
```
## DOCKER

To set up the environment, you will need to first install [Docker](https://docs.docker.com/engine/install/).
Navigate to the project directory and run:
```terminal
docker compose up
```
To bring up the services. 
You will see the pino logs starting to appear.
## PROGRAMMING LANGUAGE
 - Typescript

## POSTMAN Collection
Is located in the `libs/src` directory. 

Every microservice has its own PORT & TCP PORT. 
Here they are listed
AUTH SERVICE: 3200
LOCATION SERVICE: 3350
LOGGED TIME SERVICE: 4400
TASKS SERVICE: 3400
WORKER SERVICE: 3100

Each respective service has an `api` global prefix configured in its main.ts file,

## SERVICE URLS:
AUTH SERVICE: http://localhost:3200/api
LOCATION SERVICE: http://localhost:3350/api
LOGGED TIME SERVICE: http://localhost:4400/api
TASKS SERVICE: http://localhost:3400/api
WORKER SERVICE: http://localhost:3100/api

## SWAGGER DOCS
AUTH SERVICE : http://localhost:3200/api/swagger/docs
LOCATION SERVICE : http://localhost:3350/api/swagger/docs
LOGGED TIME SERVICE : http://localhost:4400/api/swagger/docs
TASKS SERVICE : http://localhost:3400/api/swagger/docs
WORKER SERVICE : http://localhost:3100/api/swagger/docs

## MONGODB
We are using the Mongodb Data store to store and manipulate the data.
This is a global module that is accessible to every service, and this is configured within 
each service's module.ts file.

## Global PINO HTTP LOGGER
THis is configured within each service' module.ts file.

## MICROSERVICE ARTCHITECTURE & FEATURES
- microservices in a monorepo with global shared resources
- microservices communicate via TCP
- SOLID principle methodology
- using custom authentication guards for authorization & authentication
- API DESIGN Follows open api specification
- Authenticated user can transact these queries per the JwtAuthGuard

### Globally available resources:
1.  PINO HTTP LOGGER
2.  response Serializer ( can be understood by AWS Cloudwatch )
3.  Mongodb Data store
4.  Authentication Guard
5.  Response interceptor ( formats the responses into a data property, and outputs API current version )
6.  Global API prefix on API calls
7.  Swagger doc generator
8. Custom API version reader that is diplayed by the response interceptor, and swagger docs
9. Global directory aliases that allows us to write elegant paths in imports.
For example, instead of writing ; 
```typescript
import { AuthService } from '../../../auth/auth.service';
````
We can write:
```typescript
import { AuthService } from '@auth/auth.service';
````
### NICE TO HAVES (If time would have permitted ):
- Create buildspec for deploying microservices into AWS ECR repositories.
- Kubernetes deployment configurations 
- Jest Tests
- Customized logger for production, and development ( development uses pino-pretty )
- Database migration configuration

### TYPICAL PARAMETERS PASS TO THE AGGREGATED QUERIES
```terminal
locationIds:65f779ac7056875318f35df5
includeCompleted:false
workerIds:65f8a856867b4bab8ab29f88,65f9f93cc17f352415384d64,65f779ac7056875318f35dfb
```
