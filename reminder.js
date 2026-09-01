document.addEventListener("DOMContentLoaded", () => {
  requestNotificationPermission();
  loadSchedules();

  document.getElementById("medForm").addEventListener("submit", handleAddMedication);

  // 1. ATTACH LISTENERS FOR THE FILE INPUT
  const fileInput = document.getElementById("prescriptionFile");
  if (fileInput) {
    fileInput.addEventListener("change", parsePrescriptionImage);
  }
});

// ... [Keep your existing requestNotificationPermission, handleAddMedication, applyEyeDropBuffer, loadSchedules, and scheduleBrowserNotification functions here] ...

// 2. ADD THE OCR FUNCTION AT THE BOTTOM OF SCRIPT.JS
async function parsePrescriptionImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const medNameInput = document.getElementById("medName");
  const originalPlaceholder = medNameInput.placeholder;
  medNameInput.placeholder = "Scanning prescription...";

  try {
    const result = await Tesseract.recognize(file, 'eng');
    const extractedText = result.data.text.toLowerCase();
    
    console.log("Extracted Text:", extractedText);

    // Auto-detect medication type
    if (extractedText.includes("drop") || extractedText.includes("eye")) {
      document.getElementById("medType").value = "eye_drop";
    } else if (extractedText.includes("tab") || extractedText.includes("pill") || extractedText.includes("capsule")) {
      document.getElementById("medType").value = "pill";
    }

    // Attempt to extract medication name (first non-empty line of text)
    const lines = extractedText.split("\n").map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length > 0) {
      medNameInput.value = lines[0]; // Auto-fills the top detected line into Name
    }
  } catch (error) {
    console.error("OCR Error:", error);
    alert("Could not scan label. Please enter details manually.");
  } finally {
    medNameInput.placeholder = originalPlaceholder;
  }
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}