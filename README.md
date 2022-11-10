# Starless Load Tester

Command line load tester.

## Installation

Install globally as root:

```
npm install -g starless-loadtester
```

## Basic Usage

Create `test.json` file. You can use any filename.

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
      "t": 1000,
      "n": 1000
    }
  }
}
```

Run test by running following command:

```
starless-loadtester test.json --out=json
```

This will generate two files:

- test_summary.json
- signin_results.json

> Note: All durations are calculated in seconds
