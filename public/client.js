document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const startBtn = document.getElementById('startTranslation');
    const statusDiv = document.getElementById('status');
    let currentFile = null;

    fileInput.addEventListener('change', (e) => {
        currentFile = e.target.files[0];
        if (currentFile) {
            statusDiv.textContent = `File selected: ${currentFile.name}`;
            startBtn.disabled = false;
        }
    });

    startBtn.addEventListener('click', async () => {
        if (!currentFile) {
            statusDiv.textContent = 'Please select a file first.';
            return;
        }
        startBtn.disabled = true;
        statusDiv.textContent = 'Uploading and starting process...';

        try {
            const fileContent = await currentFile.text();

            // Gọi đến API của server Node.js
            const response = await fetch('/api/start-translation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: currentFile.name.replace('.txt', ''),
                    originalText: fileContent
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Server error');
            }

            const result = await response.json();
            statusDiv.textContent = `Success! Job started with ID: ${result.jobId}`;

        } catch (error) {
            statusDiv.textContent = `Error: ${error.message}`;
            startBtn.disabled = false;
        }
    });
});
