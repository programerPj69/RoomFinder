const { execSync } = require("child_process")

console.log("Deploying Firestore security rules...")
try {
  execSync("firebase deploy --only firestore:rules", { stdio: "inherit" })
  console.log("✅ Firestore rules deployed successfully!")
} catch (error) {
  console.error("❌ Failed to deploy Firestore rules:", error)
}

console.log("\nDeploying Storage security rules...")
try {
  execSync("firebase deploy --only storage:rules", { stdio: "inherit" })
  console.log("✅ Storage rules deployed successfully!")
} catch (error) {
  console.error("❌ Failed to deploy Storage rules:", error)
}

console.log("\nAll security rules have been deployed!")
