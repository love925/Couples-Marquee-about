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

// // Modal Gallery
// const openGalleryBtn = document.getElementById('openGalleryBtn');
// const modal = document.getElementById('galleryModal');
// const closeModal = document.querySelector('.close');
// const foldersContainer = document.getElementById('foldersContainer');
// const imagesContainer = document.getElementById('imagesContainer');
// const previewImg = document.getElementById('previewImg');

// openGalleryBtn.addEventListener('click', () => {
//     modal.style.display = 'block';
//     fetchFolders();
// });

// closeModal.addEventListener('click', () => {
//     modal.style.display = 'none';
//     foldersContainer.innerHTML = '';
//     imagesContainer.innerHTML = '';
//     previewImg.src = '';
// });

// window.addEventListener('click', (e) => {
//     if(e.target == modal) modal.style.display = 'none';
// });

// // Fetch folders (API call example)
// function fetchFolders() {
//     foldersContainer.innerHTML = 'Loading folders...';
//     // Example API call
//     const apiURL = `http://127.0.0.1:8000/api/decor/images/folders`;
//     fetch(apiURL) // Replace with your API
//         .then(res => res.json())
//         .then(data => {
//             foldersContainer.innerHTML = '';
//             data.folders.forEach(folder => {
//                 const div = document.createElement('div');
//                 div.textContent = folder.name;
//                 div.style.padding = '10px 15px';
//                 div.style.background = '#eee';
//                 div.addEventListener('click', () => fetchImages(folder.id));
//                 foldersContainer.appendChild(div);
//             });
//         })
//         .catch(err => foldersContainer.innerHTML = 'Failed to load folders');
// }

// // Fetch images inside folder
// function fetchImages(folderId) {
//     imagesContainer.innerHTML = 'Loading images...';
//     fetch( `http://127.0.0.1:8000/api/decor/images/folders/?name=${wedding_stage}`) // Replace with your API
//         .then(res => res.json())
//         .then(data => {
//             imagesContainer.innerHTML = '';
//             data.images.forEach(img => {
//                 const image = document.createElement('img');
//                 image.src = img.url;
//                 image.addEventListener('click', () => previewImg.src = img.url);
//                 imagesContainer.appendChild(image);
//             });
//         })
//         .catch(err => imagesContainer.innerHTML = 'Failed to load images');
// }



    // Slider Example (static images)

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
// // Modal Gallery Elements
const openGalleryBtn = document.getElementById('openGalleryBtn');
const modal = document.getElementById('galleryModal');
const closeModal = document.querySelector('.close');
const foldersContainer = document.getElementById('foldersContainer');
const imagesContainer = document.getElementById('imagesContainer');
const previewImg = document.getElementById('previewImg');

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

window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// Fetch folders (only names)
function fetchFolders() {
    foldersContainer.innerHTML = 'Loading folders...';
    fetch('http://127.0.0.1:8000/api/decor/images/folders')
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
                    div.addEventListener('click', () => fetchImages(folder.folder_name));
                    foldersContainer.appendChild(div);
                });
            } else {
                foldersContainer.innerHTML = 'No folders found.';
            }
        })
        .catch(err => foldersContainer.innerHTML = 'Failed to load folders');
}

// Fetch images for a folder by name
function fetchImages(folderName) {
    imagesContainer.innerHTML = 'Loading images...';
    fetch(`http://127.0.0.1:8000/api/decor/images/folders/?name=${folderName}`)
        .then(res => res.json())
        .then(data => {
            imagesContainer.innerHTML = '';
            if (data.images && data.images.length > 0) {
                data.images.forEach(imgUrl => {
                    const image = document.createElement('img');
                    image.src = imgUrl;
                    image.style.width = '150px';
                    image.style.margin = '10px';
                    image.style.borderRadius = '5px';
                    image.style.cursor = 'pointer';
                    image.addEventListener('click', () => previewImg.src = imgUrl);
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

