// =============== LIGHTBOX SETTINGS ===============
lightbox.option({
    'resizeDuration': 200,
    'wrapAround': true,
    'alwaysShowNavOnTouchDevices': true
});

// =============== THEME TOGGLE ===============
const toggleSwitch = document.querySelector('.toggle-switch');
const body = document.body;

if(localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    body.classList.remove('dark-mode');
} else {
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
}

toggleSwitch.addEventListener('click', () => {
    if(body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    }
});

// =============== CATEGORY FILTER ===============
const filterButtons = document.querySelectorAll('.category-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        document.querySelectorAll('.item').forEach(item => {
            if (filterValue === 'all' || item.classList.contains(filterValue)) {
                item.parentElement.style.display = 'block';
            } else {
                item.parentElement.style.display = 'none';
            }
        });
    });
});

// =============== SEARCH FUNCTION ===============
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('keyup', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    document.querySelectorAll('.item').forEach(item => {
        const title = item.getAttribute('alt') || '';
        if (title.toLowerCase().includes(searchTerm)) {
            item.parentElement.style.display = 'block';
        } else {
            item.parentElement.style.display = 'none';
        }
    });
});

// =============== UPLOAD TO PUBLIC GALLERY ===============
const fileInput = document.getElementById('fileInput');
const gallery = document.getElementById('gallery');

// Load existing images
document.addEventListener('DOMContentLoaded', loadImages);

fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if(files.length === 0) return;
    
    Array.from(files).forEach(file => {
        uploadImageToImgur(file);
    });
});

// Upload to Imgur
function uploadImageToImgur(file) {
    const formData = new FormData();
    formData.append('image', file);

    fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
            'Authorization': 'Client-ID 85a78887993c44c'
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            const imageUrl = data.data.link;
            saveImageUrl(imageUrl);
            addImageToGallery(imageUrl, 'User Upload');
            alert('✅ Picture uploaded successfully! Everyone can see it now!');
        } else {
            alert('❌ Upload failed. Try again.');
        }
    })
    .catch(error => {
        alert('❌ Error uploading.');
        console.error(error);
    });
}

// Save URL to localStorage so it stays
function saveImageUrl(url) {
    let images = JSON.parse(localStorage.getItem('publicGallery') || '[]');
    images.push(url);
    localStorage.setItem('publicGallery', JSON.stringify(images));
}

// Load images
function loadImages() {
    let images = JSON.parse(localStorage.getItem('publicGallery') || '[]');
    images.forEach(url => {
        addImageToGallery(url, 'Shared Photo');
    });
}

// Add image to page
function addImageToGallery(imageData, title) {
    const newItem = document.createElement('div');
    newItem.classList.add('item-wrapper');
    
    const link = document.createElement('a');
    link.href = imageData;
    link.setAttribute('data-lightbox', 'gallery');
    link.setAttribute('data-title', title);
    
    const img = document.createElement('img');
    img.src = imageData;
    img.alt = title;
    img.classList.add('item', 'nature');
    
    link.appendChild(img);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.onclick = function() {
        if(confirm('Delete this photo?')) {
            removeImageFromStorage(imageData);
            newItem.remove();
        }
    };
    
    newItem.appendChild(link);
    newItem.appendChild(deleteBtn);
    gallery.appendChild(newItem);
}

function removeImageFromStorage(url) {
    let images = JSON.parse(localStorage.getItem('publicGallery') || '[]');
    images = images.filter(img => img !== url);
    localStorage.setItem('publicGallery', JSON.stringify(images));
}

console.log('🌍 PUBLIC GALLERY READY!');
