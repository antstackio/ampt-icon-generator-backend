import { CognitoJwtVerifier } from "aws-jwt-verify";
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { params } from "@ampt/sdk";

const cognitoIdentityServiceProvider = new CognitoIdentityProviderClient({
  region: params("region"),
});

const verifyToken = async (token) => {
  const verifier = CognitoJwtVerifier.create({
    userPoolId: params("userPoolId"),
    tokenUse: "access",
    clientId: params("userPoolClientId"),
  });

  try {
    const payload = await verifier.verify(token);
    return true;
  } catch {
    console.log("Token not valid!");
    return false;
  }
};

const getCognitoUser = async (jwtToken) => {
  const params = {
    AccessToken: jwtToken,
  };

  const command = new GetUserCommand(params);
  const response = await cognitoIdentityServiceProvider.send(command);

  const email = response.UserAttributes[3];
  return email.Value;
};

let auth = async (req, res, next) => {
  const token = req.headers.authorization;
  const jwtToken = token.replace("Bearer ", "");

  verifyToken(jwtToken)
    .then((valid) => {
      if (valid) {
        getCognitoUser(jwtToken).then((email) => {
          req.user = { email };
          next();
        });
      } else {
        return res.statusCode(401).send({
          success: false,
          message: "Unauthorized Access",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
      return;
    });
};

export default { auth };
