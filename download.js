const _ = require("lodash");
const debug = require("debug")("download");
const fs = require("fs");
const request = require("request");
const requestPromise = require("request-promise");

const authToken = process.env.HASH_CODE_JUDGE_AUTH_TOKEN;
if (!authToken) {
  console.error(
    "HASH_CODE_JUDGE_AUTH_TOKEN not defined. Set it with your auth token to the Judge system."
  );
  process.exit();
}
const authHeader = { Authorization: `Bearer ${authToken}` };

const downloadBlob = blobKey => {
  const uri = `https://hashcodejudge.withgoogle.com/download/${blobKey}`;
  return request({ uri, headers: authHeader });
};

const downloadRoundsInfo = async () => {
  const uri = "https://hashcode-judge.appspot.com/api/judge/v1/rounds";
  const roundsInfo = await requestPromise({
    uri,
    json: true,
    headers: authHeader
  });
  return roundsInfo;
};

const downloadProblemStatement = round => {
  return downloadBlob(round.problemBlobKey);
};

const downloadInputs = round => {
  return round.dataSets.map(({ id, name, inputBlobKey }) => ({
    id,
    name,
    stream: downloadBlob(inputBlobKey)
  }));
};

const download = async () => {
  const roundsInfo = await downloadRoundsInfo();
  const activeRound = roundsInfo.items.filter(round => round.active)[0];
  const statementFile = "statement.pdf";
  downloadProblemStatement(activeRound)
    .pipe(fs.createWriteStream(statementFile))
    .on("close", () => debug(`written ${statementFile}`));
  downloadInputs(activeRound).forEach(({ name, stream }) => {
    const sanitizedName = _.kebabCase(name)
    const inputFile = `${sanitizedName}.in.txt`;
    stream
      .pipe(fs.createWriteStream(inputFile))
      .on("close", () => debug(`written ${inputFile}`));
  });
};

if (module === require.main) {
  download();
}
