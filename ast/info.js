

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
module.exports = { getSystemInfo };

