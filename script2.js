// ================== SLIDER (STATIC IMAGES) ==================
const slider = document.getElementById('slider');
const images = ['images/gallery1.jpg', 'images/gallery2.jpg', 'images/gallery3.jpg'];
let currentIndex = 0;

function showSliderImage(index) {
    if (!slider) return;
    slider.innerHTML = `<img src="${images[index]}" alt="Gallery Image">`;
}

showSliderImage(currentIndex);

document.getElementById('prevBtn')?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showSliderImage(currentIndex);
});

document.getElementById('nextBtn')?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    showSliderImage(currentIndex);
});

// ================== GALLERY MODAL ==================
const openGalleryBtn = document.getElementById('openGalleryBtn');
const modal = document.getElementById('galleryModal');
const closeModalBtn = document.querySelector('.close');
const foldersContainer = document.getElementById('foldersContainer');
const imagesContainer = document.getElementById('imagesContainer');
const previewImg = document.getElementById('previewImg');

const BASE_URL = 'https://rvngvlisjjwjxngufyok.supabase.co';
const FOLDERS_ENDPOINT = `${BASE_URL}/functions/v1/gallery-folders`;
const FOLDER_IMAGES_ENDPOINT = `${BASE_URL}/functions/v1/gallery-folder-images`;

// Open modal & fetch folders
openGalleryBtn?.addEventListener('click', () => {
    if (!modal) return;
    modal.style.display = 'block';
    fetchFolders();
});

// Close modal
closeModalBtn?.addEventListener('click', closeGalleryModal);

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeGalleryModal();
    }
});

function closeGalleryModal() {
    if (modal) modal.style.display = 'none';
    if (foldersContainer) foldersContainer.innerHTML = '';
    if (imagesContainer) imagesContainer.innerHTML = '';
    if (previewImg) previewImg.src = '';
}

// ================== FETCH FOLDERS ==================
async function fetchFolders() {
    if (!foldersContainer) return;

    foldersContainer.innerHTML = 'Loading folders...';

    try {
        const response = await fetch(FOLDERS_ENDPOINT);

        if (!response.ok) {
            throw new Error(`Failed to fetch folders. Status: ${response.status}`);
        }

        const data = await response.json();
        foldersContainer.innerHTML = '';

        if (data.folders && data.folders.length > 0) {
            data.folders.forEach((folder) => {
                const div = document.createElement('div');
                div.textContent = `${folder.name} (${folder.image_count})`;
                div.style.padding = '10px 15px';
                div.style.background = '#ffe6f0';
                div.style.cursor = 'pointer';
                div.style.borderRadius = '5px';
                div.style.marginBottom = '8px';

                div.addEventListener('click', () => {
                    fetchImages(folder.id, folder.name);
                    imagesContainer?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                });

                foldersContainer.appendChild(div);
            });
        } else {
            foldersContainer.innerHTML = 'No folders found.';
        }
    } catch (err) {
        console.error(err);
        foldersContainer.innerHTML = 'Failed to load folders';
    }
}

// ================== FETCH IMAGES FOR SELECTED FOLDER ==================
async function fetchImages(folderId, folderName = '') {
    if (!imagesContainer) return;

    imagesContainer.innerHTML = 'Loading images...';

    try {
        const response = await fetch(
            `${FOLDER_IMAGES_ENDPOINT}?folderId=${encodeURIComponent(folderId)}`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch images. Status: ${response.status}`);
        }

        const data = await response.json();
        imagesContainer.innerHTML = '';

        if (data.images && data.images.length > 0) {
            data.images.forEach((img) => {
                const image = document.createElement('img');
                image.src = img.url;
                image.alt = img.filename || folderName || 'Gallery Image';
                image.style.width = '150px';
                image.style.margin = '10px';
                image.style.borderRadius = '5px';
                image.style.cursor = 'pointer';

                image.addEventListener('click', () => {
                    if (previewImg) {
                        previewImg.src = img.url;
                    }

                    document.getElementById('imagePreview')?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                });

                imagesContainer.appendChild(image);
            });
        } else {
            imagesContainer.innerHTML = 'No images found in this folder.';
        }
    } catch (err) {
        console.error(err);
        imagesContainer.innerHTML = 'Failed to load images';
    }
}