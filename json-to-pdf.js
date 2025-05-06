const { jsPDF } = require("jspdf");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require("fs");

// URL of the JSON file
const jsonUrl = "https://raw.githubusercontent.com/colleenpridemore/Emojicode_Hello-_Universe/main/pi-user-history.json";

// Fetch and generate PDF
fetch(jsonUrl) // Use fetch from node-fetch
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        const doc = new jsPDF();

        // Add title to the PDF
        doc.setFontSize(16);
        doc.text("Feelings Knowledge Base - AI", 10, 10);

        // Add JSON data
        let y = 20;
        data.user_data.messages.forEach((message, index) => {
            doc.setFontSize(12);
            doc.text(`Message #${index + 1}:`, 10, y);
            y += 10;
            doc.setFontSize(10);
            doc.text(`Text: ${message.text}`, 10, y);
            y += 10;
            doc.text(`Sender: ${message.sender}`, 10, y);
            y += 10;
            doc.text(`Channel: ${message.channel}`, 10, y);
            y += 10;
            doc.text(`Sent At: ${message.sent_at}`, 10, y);
            y += 20;

            if (y > 270) { // Add a new page if content exceeds height
                doc.addPage();
                y = 10;
            }
        });

        // Save the PDF locally
        const pdfPath = "feelings-knowledge-base.pdf";
        fs.writeFileSync(pdfPath, Buffer.from(doc.output("arraybuffer")));
        console.log(`PDF generated successfully: ${pdfPath}`);
    })
    .catch((error) => {
        console.error("Error:", error.message);
    });