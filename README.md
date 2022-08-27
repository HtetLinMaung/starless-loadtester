# Starless Load Tester

Command line load tester.

## Installation

```
npm install starless-loadtester
```

## Sample json

```json
{
  "domain": "http://localhost:3000",
  "endpoints": {
    "signin": {
      "path": "/iam/v1/auth/signin",
      "method": "post",
      "body": {
        "appId": "authservice",
        "userId": "admin",
        "password": "User@123"
      },
      "headers": {},
      "t": 1000
    }
  }
}
```
