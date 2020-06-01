const util = require('util');
const exec = util.promisify(require('child_process').exec);
const latestSemver = require('latest-semver');
const semver = require('semver');
const semverSort = require('semver-sort');

async function getInfo(id) {
  try {
    const {
      stdout,
    } = await exec(`yarn info ${id} --json`);
    return JSON.parse(stdout)
  } catch (e) {
    console.error(e);
  }
}

function bytesToSize(bytes) {
  if (bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return 'n/a'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
    if (i === 0) return `${bytes} ${sizes[i]})`
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
  } else {
    return 0;
  }
}

async function getGzipped(url) {
  try {
    const {
      stdout,
    } = await exec(`curl -so /dev/null ${url} -w '%{size_download}'`);
    return stdout
  } catch (e) {
    console.error(e);
  }
}

async function getVersions(versionsArray, latest) {
  let array = [];
  array.push(latest);
  versionsArray.pop();
  let latest_1 = latestSemver(versionsArray);
  array.push(latest_1);
  versionsArray.pop();
  let latest_2 = latestSemver(versionsArray);
  array.push(latest_2);
  versionsArray.pop();
  let major_latest = semver.maxSatisfying(versionsArray, `${latest.split(".")[0]-1}`);
  array.push(major_latest);
  return array
}

var express = require('express');
var router = express.Router();

router.get('/:id', async (req, res, next) => {
  try {
    const resp = await getInfo(req.params.id)
    const versions = await getVersions(semverSort.asc(resp.data.versions), resp.data.version)
    const gzipped = await getGzipped(resp.data.dist.tarball)
    const resp1 = await getInfo(`${req.params.id}@${versions[1]}`)
    const gzipped1 = await getGzipped(resp1.data.dist.tarball)
    const resp2 = await getInfo(`${req.params.id}@${versions[2]}`)
    const gzipped2 = await getGzipped(resp1.data.dist.tarball)
    const resp3 = await getInfo(`${req.params.id}@${versions[3]}`)
    const gzipped3 = await getGzipped(resp1.data.dist.tarball)
    res.status(200).send([{
      'name': resp.data.name,
      'version': resp.data.version,
      'sizes': {
        'bundle': bytesToSize(resp.data.dist.unpackedSize),
        'gzipped': bytesToSize(gzipped)
      },
    }, {
      'name': resp1.data.name,
      'version': resp1.data.version,
      'sizes': {
        'bundle': bytesToSize(resp1.data.dist.unpackedSize),
        'gzipped': bytesToSize(gzipped1)
      },
    }, {
      'name': resp2.data.name,
      'version': resp2.data.version,
      'sizes': {
        'bundle': bytesToSize(resp2.data.dist.unpackedSize),
        'gzipped': bytesToSize(gzipped2)
      },
    }, {
      'name': resp3.data.name,
      'version': resp3.data.version,
      'sizes': {
        'bundle': bytesToSize(resp3.data.dist.unpackedSize),
        'gzipped': bytesToSize(gzipped3)
      },
    }]);
  } catch (e) {
    res.status(404).send("Error to get info of " + req.params.id);
  }
})


module.exports = router;