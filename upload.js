/**
 * Usage:
 *
 * node ./upload.js sources sourceZip dataSet1 solutionFileForDataSet1 dataSet2 solutionFileForDataSet2 ...
 *
 * sources is required. At least one data set is required. Valid data set names can be found in the dataSet const.
 *
 * If no args is present, the script attemps to upload all data sets using files named ${dataSet}.in.out.txt and
 * takes the highest named file name present in ./.builds for the sources.
 */

const path = require('path')
const _ = require('lodash')
const debug = require('debug')('upload')
const fs = require('fs')
const joi = require('joi')
const request = require('request-promise')

const {HASH_CODE_JUDGE_AUTH_TOKEN: authToken} = process.env
if (authToken) {
  debug('token', shorten(authToken))
} else {
  console.error('HASH_CODE_JUDGE_AUTH_TOKEN not defined. Set it with your auth token to the Judge system.')
  process.exit()
}

const createUrlUri = 'https://hashcode-judge.appspot.com/_ah/api/judge/v1/upload/createUrl'
const submitUri = 'https://hashcode-judge.appspot.com/_ah/api/judge/v1/submissions'
const authorizationHeader = {'Authorization': `Bearer ${authToken}`}
const dataSets = {
  kittens: 4881867933220864,
  me_at_the_zoo: 5570727000408064,
  trending_today: 4919276561498112,
  videos_worth_spreading: 6412425163177984
}

const solutionSchema = joi.object().min(2)
    .keys(_.mapValues(dataSets, () => joi.string()))
    .keys({sources: joi.string().required()})

function* submitSolution (solution) {
  solution = joi.attempt(solution, solutionSchema, 'invalid solution parameters')

  const blobKeys = yield _.mapValues(solution, upload)
  const solutionBlobKeys = _.omit(blobKeys, 'sources')
  return yield _.mapValues(solutionBlobKeys, function (blobKey, dataSetName) {
    debug(`submitting data set ${dataSetName} (key: ${shorten(blobKey)}`)
    return submit(dataSets[dataSetName], blobKey, blobKeys.sources)
  })
}

function* upload (filePath) {
  const uploadUri = yield createUploadUri()
  debug(`uploading ${filePath} to ${shorten(uploadUri)}`)
  const formData = {file: fs.createReadStream(filePath)}
  const responseBody = yield request({
    method: 'POST',
    uri: uploadUri,
    formData,
    json: true})
  const blobKey = responseBody.file[0]
  debug(`uploaded ${filePath} (key: ${shorten(blobKey)})`)
  return blobKey
}

function* createUploadUri () {
  const response = yield request({
    method: 'GET',
    uri: createUrlUri,
    headers: authorizationHeader,
    json: true})
  return response.value
}

function* submit (dataSet, submissionBlobKey, sourcesBlobKey) {
  const queryParameters = {dataSet, submissionBlobKey, sourcesBlobKey}
  return yield request({
    method: 'POST',
    uri: submitUri,
    headers: authorizationHeader,
    qs: queryParameters
  })
}

function shorten (str) {
  return _(str).slice(0, 20).join('') + '...'
}

if (module === require.main) {
  if (_.isEmpty(dataSets)) {
    console.log('data set ids not initialized!')
    process.exit(1)
  }
  const co = require('co')
  const explode = err => process.nextTick(() => { throw err })
  let solution = _(process.argv).drop(2).chunk(2).fromPairs().value()
  if (_.isEmpty(solution)) {
    solution = _.mapValues(dataSets, (id, name) => `${name}.in.out.txt`)
    solution.sources = path.join(__dirname, '.builds', _.last(fs.readdirSync(path.join(__dirname, '.builds')).sort()))
  }
  debug('solution', solution)
  co(submitSolution(solution)).catch(explode)
}
