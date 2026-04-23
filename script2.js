// ================== SLIDER (STATIC IMAGES) ==================
const slider = document.getElementById('slider');
const sliderImages = ['images/gallery1.webp', 'images/gallery2.webp', 'images/gallery3.webp'];
let currentIndex = 0;

// preload slider images
sliderImages.forEach((src) => {
    const img = new Image();
    img.src = src;
});

let sliderImgEl = null;

if (slider) {
    sliderImgEl = document.createElement('img');
    sliderImgEl.alt = 'Gallery Image';
    sliderImgEl.loading = 'eager';
    sliderImgEl.decoding = 'async';
    slider.appendChild(sliderImgEl);
}

function showSliderImage(index) {
    if (!sliderImgEl) return;

    sliderImgEl.style.opacity = '0.85';
    sliderImgEl.src = sliderImages[index];

    sliderImgEl.onload = () => {
        sliderImgEl.style.opacity = '1';
    };
}

showSliderImage(currentIndex);

document.getElementById('prevBtn')?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + sliderImages.length) % sliderImages.length;
    showSliderImage(currentIndex);
});

document.getElementById('nextBtn')?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % sliderImages.length;
    showSliderImage(currentIndex);
});

// ================== GALLERY MODAL ==================
const openGalleryBtn = document.getElementById('openGalleryBtn');
const modal = document.getElementById('galleryModal');
const closeModalBtn = document.querySelector('.close');
const foldersContainer = document.getElementById('foldersContainer');
const imagesContainer = document.getElementById('imagesContainer');
const gallerySection = document.querySelector('.gallery-section');

const fullImageModal = document.getElementById('fullImageModal');
const fullImageView = document.getElementById('fullImageView');
const fullImageClose = document.getElementById('fullImageClose');

const BASE_URL = 'https://rvngvlisjjwjxngufyok.supabase.co';
const FOLDERS_ENDPOINT = `${BASE_URL}/functions/v1/gallery-folders`;
const FOLDER_IMAGES_ENDPOINT = `${BASE_URL}/functions/v1/gallery-folder-images`;

let foldersCache = null;
const imagesCache = new Map();

// Open modal after smooth scroll to gallery section
openGalleryBtn?.addEventListener('click', async () => {
    if (!modal) return;

    gallerySection?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

    setTimeout(async () => {
        modal.style.display = 'block';

        if (!foldersCache) {
            await fetchFolders();
        } else {
            renderFolders(foldersCache);
        }
    }, 500);
});

// Close gallery modal
closeModalBtn?.addEventListener('click', closeGalleryModal);

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeGalleryModal();
    }
});

function closeGalleryModal() {
    if (modal) modal.style.display = 'none';
    if (imagesContainer) imagesContainer.innerHTML = '';
}

// ================== FULL SCREEN IMAGE ==================
function openFullImage(src, alt = 'Gallery Image') {
    if (!fullImageModal || !fullImageView) return;

    fullImageView.src = src;
    fullImageView.alt = alt;
    fullImageModal.classList.add('active');
}

function closeFullImage() {
    if (!fullImageModal || !fullImageView) return;

    fullImageModal.classList.remove('active');
    fullImageView.src = '';
}

fullImageClose?.addEventListener('click', closeFullImage);

fullImageModal?.addEventListener('click', (e) => {
    if (e.target === fullImageModal) {
        closeFullImage();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeFullImage();
    }
});

// ================== FETCH FOLDERS ==================
async function fetchFolders() {
    if (!foldersContainer) return;

    foldersContainer.innerHTML = 'Loading folders...';

    try {
        const response = await fetch(FOLDERS_ENDPOINT, { cache: 'force-cache' });

        if (!response.ok) {
            throw new Error(`Failed to fetch folders. Status: ${response.status}`);
        }

        const data = await response.json();
        foldersCache = data.folders || [];
        renderFolders(foldersCache);
    } catch (err) {
        console.error(err);
        foldersContainer.innerHTML = 'Failed to load folders';
    }
}

function renderFolders(folders) {
    if (!foldersContainer) return;

    foldersContainer.innerHTML = '';

    if (!folders || folders.length === 0) {
        foldersContainer.innerHTML = 'No folders found.';
        return;
    }

    folders.forEach((folder) => {
        const div = document.createElement('div');
        div.textContent = `${folder.name} (${folder.image_count})`;
        div.style.padding = '10px 15px';
        div.style.background = '#ffe6f0';
        div.style.cursor = 'pointer';
        div.style.borderRadius = '5px';
        div.style.marginBottom = '8px';

        div.addEventListener('click', async () => {
            await fetchImages(folder.id, folder.name);
        });

        foldersContainer.appendChild(div);
    });
}

// ================== FETCH IMAGES FOR SELECTED FOLDER ==================
async function fetchImages(folderId, folderName = '') {
    if (!imagesContainer) return;

    imagesContainer.innerHTML = 'Loading images...';

    try {
        let images = [];

        if (imagesCache.has(folderId)) {
            images = imagesCache.get(folderId);
        } else {
            const response = await fetch(
                `${FOLDER_IMAGES_ENDPOINT}?folderId=${encodeURIComponent(folderId)}`,
                { cache: 'force-cache' }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch images. Status: ${response.status}`);
            }

            const data = await response.json();
            images = data.images || [];
            imagesCache.set(folderId, images);
        }

        renderImages(images, folderName);
    } catch (err) {
        console.error(err);
        imagesContainer.innerHTML = 'Failed to load images';
    }
}

function renderImages(images, folderName = '') {
    if (!imagesContainer) return;

    imagesContainer.innerHTML = '';

    if (!images || images.length === 0) {
        imagesContainer.innerHTML = 'No images found in this folder.';
        return;
    }

    const fragment = document.createDocumentFragment();

    images.forEach((img) => {
        const image = document.createElement('img');
        image.src = img.url;
        image.alt = img.filename || folderName || 'Gallery Image';
        image.loading = 'lazy';
        image.decoding = 'async';
        image.width = 150;
        image.height = 150;
        image.style.width = '150px';
        image.style.height = '150px';
        image.style.margin = '10px';
        image.style.borderRadius = '5px';
        image.style.cursor = 'pointer';
        image.style.objectFit = 'cover';

        image.addEventListener('click', () => {
            openFullImage(img.url, image.alt);
        });

        fragment.appendChild(image);
    });

    imagesContainer.appendChild(fragment);
}