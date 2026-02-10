export async function saveImage(photo) {
    try {
        const url = photo.urls.full || photo.urls.regular;
        const filename = `unsplash-${photo.id}.jpg`;

        const response = await fetch(url);
        const blob = await response.blob();

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        alert(`✅ Zdjęcie zapisane jako ${filename}`);
    } catch (err) {
        console.error('Błąd zapisu:', err);
        alert('Nie udało się zapisać zdjęcia.');
    }
}