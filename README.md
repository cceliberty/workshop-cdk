# 🏗️ Workshop CDK

> From zero to up and running a CDK project

# 🏎️ Machine Setup

Ensure installed on system:

- [node](https://nodejs.org/en/download/current): Test with `node --version`
- [AWS CLI](https://aws.amazon.com/cli/): Test with `aws --version` > `2.10.x`
- [CDK CLI](https://docs.aws.amazon.com/cdk/v2/guide/cli.html): Test with `cdk --version` > `2.100.x`
- [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html#install-sam-cli-instructions): Test with `sam --version` > `1.98.x`
- [TypeScript](https://typestrong.org/ts-node/docs/installation/): Test with `tsc --version` > `5.x.x`
- [VSCode](https://code.visualstudio.com/)

Recommended VSCode plugins to install:

- ESLint
- Jest
- Jest Runner
- AWS Toolkit
- Path Intellisense
- Prettier
- Pretty TypeScript Errors

Usefull VSCode shortcuts (Settings > Keyboard Shortcuts):

- Trigger Suggest
- Toggle terminal

# 🔐 AWS Configuration

## AWS Credential Configuration:

The file in `~/.aws/credentials` should contain AWS credentials.

```toml
# ~/.aws/credentials

# CENTRAL_ACCOUNT_PROFILE_NAME is the name of the profile you use to connect to your company. It can be any string

[CENTRAL_ACCOUNT_PROFILE_NAME]
aws_access_key_id = AAAAAAAAAAAAAAAAAAAA
aws_secret_access_key = zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
```

> [!Note]
> To test if your credentials are set correctly run on terminal: `$ aws s3 ls --profile CENTRAL_ACCOUNT_PROFILE_NAME` to see the S3 Buckets on the company account.

## AWS Profile Configuration:

The file in `~/.aws/config` should specify a profile `TARGET_ACCOUNT_PROFILE_NAME` that assumes the role `OrganizationAccountAccessRole` in the account `TARGET_ACCOUNT_ID` using your company's credentials.
Replace `CENTRAL_ACCOUNT_PROFILE_NAME` with the same value used above.

```toml
# ~/.aws/config

[profile CENTRAL_ACCOUNT_PROFILE_NAME]
region = eu-west-1
cli_pager =

# TARGET_ACCOUNT_ID is the account ID you want to connect to
# TARGET_ACCOUNT_PROFILE_NAME can be any string
[profile TARGET_ACCOUNT_PROFILE_NAME]
region = eu-west-1
role_arn = arn:aws:iam::TARGET_ACCOUNT_ID:role/OrganizationAccountAccessRole
source_profile = CENTRAL_ACCOUNT_PROFILE_NAME
```

> [!Note]
> To test if your credentials are set correctly run on terminal: `$ aws s3 ls --profile TARGET_ACCOUNT_PROFILE_NAME` to see the S3 Buckets on the `TARGET_ACCOUNT_PROFILE_NAME` account.

# ⚗️ Project
