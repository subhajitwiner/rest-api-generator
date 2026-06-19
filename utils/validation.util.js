/**
   * Validates the name of a file to be created
   * @method validateRequiredName
   * @param {string} name - The name of the file to be created
   * @param {string} type - The type of the file to be created
   * @returns {void}
   */
  function validateRequiredName(name, type) {
    if (!name) {
      console.log(`❌ Please provide a ${type} name`);
      process.exit(1);
    }
  }
  module.exports = { validateRequiredName }