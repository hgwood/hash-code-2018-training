const _ = require('lodash')
const fs = require('fs')
const debug = require('debug')('write')

module.exports = function write (path, solution) {
  writeLines(path, unparse(solution))
}

function writeLines (path, lines) {
  fs.writeFileSync(path, lines.join('\n'))
  debug(`wrote ${lines.length} lines to ${path}`)
}

// Solution model :
// solution = [
//   {
//     id: 1,
//     videos: [1, 2, 3, 4]
//   },
//   ...
// ]

function unparse (solution) {
  const cacheServers = _.filter(solution, cacheServer => !_.isEmpty(cacheServer.videos)) // Filter empty servers
  return [
    `${cacheServers.length}`,
    ..._.map(
      cacheServers,
      cacheServer => `${cacheServer.id} ${_.join(cacheServer.videos, ' ')}`
    )
  ]
}

module.exports.unparse = unparse
