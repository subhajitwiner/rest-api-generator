const { execSync } = require("child_process");

/**
 * @function getSystemInfo
 * @description Retrieves unique system identifier
 * @returns {Promise<Systeminformation.UuidData>} A promise resolving to the system's unique identifier
 */
const si = require("systeminformation");
async function getSystemInfo() {
    let uuid = await si.uuid();
    let cpubrand = (await si.cpu()).brand;
    let systemtype = (await si.chassis()).type;
    return {
        hardware: uuid.hardware,
        os: uuid.os,
        macs: uuid.macs,
        cpu: cpubrand,
        chassis: systemtype
    };
}
function getLatestVersions(packages) {
    const result = {};
    for (const packageName of packages) {
        // console.log(`Checking ${packageName}...`);
        const version = execSync(
            `npm view ${packageName} version`,
            { encoding: "utf8" }
        ).trim();
        result[packageName] = `^${version}`;
    }
    return result;
}
module.exports = { getSystemInfo, getLatestVersions };

