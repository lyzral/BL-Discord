const fs = require("fs");
const path = require("path");

const ownersPath = path.join(__dirname, "..", "storage", "owners.json");

function readOwners() {
  try {
    const raw = fs.readFileSync(ownersPath, "utf8");
    const json = JSON.parse(raw);
    return Array.isArray(json.ownerIds) ? json.ownerIds : [];
  } catch {
    return [];
  }
}

function isAllowed(userId, sysId) {
  if (userId === sysId) return true;
  const owners = readOwners();
  return owners.includes(userId);
}

module.exports = { readOwners, isAllowed, ownersPath };
