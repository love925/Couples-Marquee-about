// // Slider Example (static images)
// const slider = document.getElementById('slider');
// const images = ['images/gallery1.jpg', 'images/gallery2.jpg', 'images/gallery3.jpg'];
// let currentIndex = 0;

// function showSliderImage(index) {
//     slider.innerHTML = `<img src="${images[index]}" alt="Gallery Image">`;
// }
// showSliderImage(currentIndex);

// document.getElementById('prevBtn').addEventListener('click', () => {
//     currentIndex = (currentIndex - 1 + images.length) % images.length;
//     showSliderImage(currentIndex);
// });

// document.getElementById('nextBtn').addEventListener('click', () => {
//     currentIndex = (currentIndex + 1) % images.length;
//     showSliderImage(currentIndex);
// });

// // Modal Gallery Elements
// const openGalleryBtn = document.getElementById('openGalleryBtn');
// const modal = document.getElementById('galleryModal');
// const closeModal = document.querySelector('.close');
// const foldersContainer = document.getElementById('foldersContainer');
// const imagesContainer = document.getElementById('imagesContainer');
// const previewImg = document.getElementById('previewImg');

// const BASE_URL = 'http://127.0.0.1:8000';

// // Open modal & fetch folders
// openGalleryBtn.addEventListener('click', () => {
//     modal.style.display = 'block';
//     fetchFolders();
// });

// // Close modal
// closeModal.addEventListener('click', () => {
//     modal.style.display = 'none';
//     foldersContainer.innerHTML = '';
//     imagesContainer.innerHTML = '';
//     previewImg.src = '';
// });

// window.addEventListener('click', (e) => {
//     if (e.target === modal) modal.style.display = 'none';
// });

// // Fetch folders (only names)
// function fetchFolders() {
//     foldersContainer.innerHTML = 'Loading folders...';
//     fetch(`${BASE_URL}/api/decor/images/folders`)
//         .then(res => res.json())
//         .then(data => {
//             foldersContainer.innerHTML = '';
//             if (data && data.length > 0) {
//                 data.forEach(folder => {
//                     const div = document.createElement('div');
//                     div.textContent = folder.folder_name;
//                     div.style.padding = '10px 15px';
//                     div.style.background = '#ffe6f0';
//                     div.style.cursor = 'pointer';
//                     div.style.borderRadius = '5px';
//                     div.style.marginBottom = '8px';
//                     div.addEventListener('click', () => fetchImages(folder.folder_name));
//                     foldersContainer.appendChild(div);
//                 });
//             } else {
//                 foldersContainer.innerHTML = 'No folders found.';
//             }
//         })
//         .catch(err => {
//             console.error(err);
//             foldersContainer.innerHTML = 'Failed to load folders';
//         });
// }

// // Fetch images for a folder by name
// function fetchImages(folderName) {
//     imagesContainer.innerHTML = 'Loading images...';
//     fetch(`${BASE_URL}/api/decor/images/folders/?name=${folderName}`)
//         .then(res => res.json())
//         .then(data => {
//             imagesContainer.innerHTML = '';
//             if (data.images && data.images.length > 0) {
//                 data.images.forEach(imgPath => {
//                     const image = document.createElement('img');
//                     image.src = `${BASE_URL}${imgPath}`;  // <--- fix: prepend server URL
//                     image.alt = folderName;
//                     image.style.width = '150px';
//                     image.style.margin = '10px';
//                     image.style.borderRadius = '5px';
//                     image.style.cursor = 'pointer';
//                     image.addEventListener('click', () => previewImg.src = `${BASE_URL}${imgPath}`);
//                     imagesContainer.appendChild(image);
//                 });
//             } else {
//                 imagesContainer.innerHTML = 'No images found in this folder.';
//             }
//         })
//         .catch(err => {
//             console.error(err);
//             imagesContainer.innerHTML = 'Failed to load images';
//         });
// }



// ================== SLIDER (STATIC IMAGES) ==================
const slider = document.getElementById('slider');
const images = ['images/gallery1.jpg', 'images/gallery2.jpg', 'images/gallery3.jpg'];
let currentIndex = 0;

function showSliderImage(index) {
    slider.innerHTML = `<img src="${images[index]}" alt="Gallery Image">`;
}
showSliderImage(currentIndex);

document.getElementById('prevBtn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showSliderImage(currentIndex);
});

document.getElementById('nextBtn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    showSliderImage(currentIndex);
});

// ================== GALLERY MODAL ==================
const openGalleryBtn = document.getElementById('openGalleryBtn');
const modal = document.getElementById('galleryModal');
const closeModal = document.querySelector('.close');
const foldersContainer = document.getElementById('foldersContainer');
const imagesContainer = document.getElementById('imagesContainer');
const previewImg = document.getElementById('previewImg');

const BASE_URL = 'http://127.0.0.1:8000';

// Open modal & fetch folders
openGalleryBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    fetchFolders();
});

// Close modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    foldersContainer.innerHTML = '';
    imagesContainer.innerHTML = '';
    previewImg.src = '';
});

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// ================== FETCH FOLDERS ==================
function fetchFolders() {
    foldersContainer.innerHTML = 'Loading folders...';
    fetch(`${BASE_URL}/api/decor/images/folders`)
        .then(res => res.json())
        .then(data => {
            foldersContainer.innerHTML = '';
            if (data && data.length > 0) {
                data.forEach(folder => {
                    const div = document.createElement('div');
                    div.textContent = folder.folder_name;
                    div.style.padding = '10px 15px';
                    div.style.background = '#ffe6f0';
                    div.style.cursor = 'pointer';
                    div.style.borderRadius = '5px';
                    div.style.marginBottom = '8px';
                    div.addEventListener('click', () => fetchImages(folder.folder_name));
                    foldersContainer.appendChild(div);
                });
            } else {
                foldersContainer.innerHTML = 'No folders found.';
            }
        })
        
        .catch(err => {
            console.error(err);
            foldersContainer.innerHTML = 'Failed to load folders';
        });
        
}

// ================== FETCH IMAGES FOR SELECTED FOLDER ==================
function fetchImages(folderName) {
    imagesContainer.innerHTML = 'Loading images...';
    fetch(`${BASE_URL}/api/decor/images/folders/?name=${folderName}`)
        .then(res => res.json())
        .then(data => {
            imagesContainer.innerHTML = '';
            if (data.images && data.images.length > 0) {
                data.images.forEach(imgPath => {
                    const image = document.createElement('img');
                    image.src = `${BASE_URL}${imgPath}`;
                    image.alt = folderName;
                    image.style.width = '150px';
                    image.style.margin = '10px';
                    image.style.borderRadius = '5px';
                    image.style.cursor = 'pointer';

                    // ======= SET PREVIEW AND SCROLL INLINE =======
                    image.setAttribute('onclick', `
                        document.getElementById('previewImg').src='${BASE_URL}${imgPath}';
                        document.getElementById('imagePreview').scrollIntoView({behavior:'smooth', block:'center'});
                    `);
                    // =================================================

                    imagesContainer.appendChild(image);
                });
            } else {
                imagesContainer.innerHTML = 'No images found in this folder.';
            }
        })
        .catch(err => {
            console.error(err);
            imagesContainer.innerHTML = 'Failed to load images';
        });
}

