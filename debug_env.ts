import dotenv from "dotenv";
dotenv.config();

console.log("--- ENV DEBUG ---");
const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
console.log(`Key type: ${typeof key}`);
if (key) {
    console.log(`Key length: ${key.length}`);
    console.log(`Key starts with: ${key.substring(0, 20)}`);
    console.log(`Key ends with: ${key.substring(key.length - 20)}`);
    try {
        const parsed = JSON.parse(key);
        console.log("JSON Parse: SUCCESS");
        console.log(`Project ID from key: ${parsed.project_id}`);
    } catch (e: any) {
        console.log(`JSON Parse: FAILED - ${e.message}`);
    }
} else {
    console.log("Key: UNDEFINED");
}
console.log("--- ENV DEBUG END ---");
