/**
 * Usage:
 *
 * node ./upload.js
 *
 * - Uses package.json config to know about data sets.
 * - Expects output files to end with .out.txt
 * - Expects to find files ordered by creation time in .builds
 */

const path = require("path");
const _ = require("lodash");
const debug = require("debug")("upload");
const fs = require("fs");
const joi = require("joi");
const request = require("request-promise");
const exec = require("child_process").execSync;
const round = require("./round.json");

const buildDir =
  process.env.BUILD_DIR || process.env.npm_package_config_buildDir || ".builds";
const solutionDir =
  process.env.SOLUTION_DIR || process.env.npm_package_config_solutionDir || "";
const gitTagEnabled =
  process.env.GIT_TAG_ENABLED !== "false" ||
  process.env.npm_package_config_gitTagEnabled !== "false";
const authToken = process.env.HASH_CODE_JUDGE_AUTH_TOKEN;
if (authToken) {
  debug("token", shorten(authToken));
} else {
  console.error(
    "HASH_CODE_JUDGE_AUTH_TOKEN not defined. Set it with your auth token to the Judge system."
  );
  process.exit();
}

const createUrlUri =
  "https://hashcode-judge.appspot.com/api/judge/v1/upload/createUrl";
const submissionsUri =
  "https://hashcode-judge.appspot.com/api/judge/v1/submissions";
const authorizationHeader = { Authorization: `Bearer ${authToken}` };
const dataSets = _.range(4).reduce((dataSets, i) => {
  const name = process.env[`npm_package_config_input${i + 1}_name`];
  if (!name) return dataSets;
  debug(`found data set '${name}' in package.json`);
  return Object.assign(dataSets, {
    [name]: process.env[`npm_package_config_input${i + 1}_id`]
  });
}, {});

const solutionSchema = joi
  .object()
  .min(2)
  .keys(_.mapValues(dataSets, () => joi.string()))
  .keys({ sources: joi.string().required() });

function* submitSolution(solution) {
  solution = joi.attempt(
    solution,
    solutionSchema,
    "invalid solution parameters"
  );

  const blobKeys = yield _.mapValues(solution, upload);
  const solutionBlobKeys = _.omit(blobKeys, "sources");
  const submissions = yield _.mapValues(solutionBlobKeys, function(
    blobKey,
    dataSetName
  ) {
    debug(`submitting ${dataSetName} (key: ${shorten(blobKey)})`);
    return submit(dataSets[dataSetName], blobKey, blobKeys.sources);
  });
  _.forEach(submissions, (submission, dataSetName) => {
    debug(`submitted ${dataSetName} (id: ${submission.id})`);
  });
  const scoredSubmissions = yield _.mapValues(
    submissions,
    (submission, dataSetName) => {
      debug(`waiting for score on ${dataSetName}`);
      return waitForScoring(submission, dataSetName);
    }
  );
  _.forEach(
    scoredSubmissions,
    ({ valid, errorMessage, best, score }, dataSetName) => {
      if (!valid) {
        debug(`error for ${dataSetName}: ${errorMessage}`);
      } else if (best) {
        debug(`NEW RECORD for ${dataSetName}: ${score}`);
      } else {
        debug(`got score for ${dataSetName}: ${score}`);
      }
    }
  );
  const overallScore = _(scoredSubmissions)
    .map(({ score }) => parseInt(score))
    .reduce(_.add);
  debug(`got overall score: ${overallScore}`);
  debug(`tagging`);

  return overallScore;
}

function* upload(filePath) {
  const uploadUri = yield createUploadUri();
  debug(`uploading ${filePath} to ${shorten(uploadUri)}`);
  const formData = { file: fs.createReadStream(filePath) };
  const responseBody = yield request({
    method: "POST",
    uri: uploadUri,
    formData,
    json: true
  });
  const blobKey = responseBody.file[0];
  debug(`uploaded ${filePath} (key: ${shorten(blobKey)})`);
  return blobKey;
}

function* createUploadUri() {
  const response = yield request({
    method: "GET",
    uri: createUrlUri,
    headers: authorizationHeader,
    json: true
  });
  return response.value;
}

function* submit(dataSet, submissionBlobKey, sourcesBlobKey) {
  const queryParameters = { dataSet, submissionBlobKey, sourcesBlobKey };
  return yield request({
    method: "POST",
    uri: submissionsUri,
    headers: authorizationHeader,
    qs: queryParameters,
    json: true
  });
}

function* waitForScoring(submission, dataSetName) {
  while (true) {
    yield new Promise(resolve => setTimeout(resolve, 1000));
    debug(`polling score for ${dataSetName}`);
    const { items: submissions } = yield request({
      method: "GET",
      uri: `${submissionsUri}/${round.id}`,
      headers: authorizationHeader,
      json: true
    });
    const scoredSubmission = _.find(submissions, {
      id: submission.id,
      scored: true
    });
    if (scoredSubmission) {
      return scoredSubmission;
    } else {
      debug(`no score yet for ${dataSetName}`);
    }
  }
}

function shorten(str) {
  return (
    _(str)
      .slice(0, 20)
      .join("") + "..."
  );
}

if (module === require.main) {
  if (_.isEmpty(dataSets)) {
    console.log(
      "data set ids not initialized! open upload.js and fill the dataSets value"
    );
    process.exit(1);
  }
  const co = require("co");
  const explode = err =>
    process.nextTick(() => {
      throw err;
    });
  const solution = Object.assign(
    _.mapValues(dataSets, (id, name) =>
      path.join(solutionDir, `${name}.out.txt`)
    ),
    {
      sources: path.join(buildDir, _.last(fs.readdirSync(buildDir).sort()))
    }
  );
  debug("files to upload", solution);
  co(submitSolution(solution))
    .catch(explode)
    .then(score => {
      if (gitTagEnabled) {
        exec(`git tag score=${score}`, {
          encoding: "utf8"
        });
      }
    });
}
