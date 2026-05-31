/**
 *  @description
 *  This module provides utility functions for converting strings to different naming conventions such as PascalCase, kebab-case, camelCase, and Title Case. These functions are useful for generating consistent file names, class names, and variable names in a codebase.
 *  @author
 *  Subhajit Majumder
 *  @version
 *  1.0.0
 */

/***
 * @description Converts a string to PascalCase.
 * @param {string} str - The input string.
 * @returns {string} - The string in PascalCase.
 */
function toPascalCase(str) {
  return str.split(/[\s-_]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

/**
 * @description Converts a string to kebab-case.
 * @param {string} str - The input string.
 * @returns {string} - The string in kebab-case.
 */
function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

/**
 * @description Converts a string to camelCase.
 * @param {string} str - The input string.
 * @returns {string} - The string in camelCase.
 */
function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
/**
 * @description Converts a string to Title Case.
 * @param {string} str - The input string.
 * @returns {string} - The string in Title Case.
 */
function toTitleCase(str) {
  return str
    .split(/[\s-_]+/) // handle space, dash, underscore
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

module.exports = { toPascalCase, toKebabCase, toCamelCase, toTitleCase };