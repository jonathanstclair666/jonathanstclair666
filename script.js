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
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// =============== SEARCH FUNCTION ===============
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('keyup', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    document.querySelectorAll('.item').forEach(item => {
        const title = item.getAttribute('data-title') || '';
        if (title.toLowerCase().includes(searchTerm)) {
            item.parentElement.style.display = 'block';
        } else {
            item.parentElement.style.display = 'none';
        }
    });
});

// =============== UPLOAD & SAVE FUNCTION ===============
const fileInput = document.getElementById('fileInput');
const gallery = document.getElementById('gallery');

document.addEventListener('DOMContentLoaded', loadImages);

fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if(files.length === 0) return;
    
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(event) {
            saveImageToStorage(event.target.result);
            addImageToGallery(event.target.result, 'My Uploaded Photo');
        }
        reader.readAsDataURL(file);
    });
    
    alert('✅ Photos saved successfully!');
    fileInput.value = '';
});

function saveImageToStorage(imageData) {
    let images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    images.push(imageData);
    localStorage.setItem('galleryImages', JSON.stringify(images));
}

function loadImages() {
    let images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    images.forEach((imgData, index) => {
        addImageToGallery(imgData, 'My Photo ' + (index + 1));
    });
}

function addImageToGallery(imageData, title) {
    const newItem = document.createElement('div');
    newItem.classList.add('item-wrapper');
    
    const link = document.createElement('a');
    link.href = imageData;
    link.setAttribute('data-lightbox', 'gallery');
    link.setAttribute('data-title', title);
    link.classList.add('item', 'nature');
    
    const img = document.createElement('img');
    img.src = imageData;
    img.alt = title;
    
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

function removeImageFromStorage(imageData) {
    let images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    images = images.filter(img => img !== imageData);
    localStorage.setItem('galleryImages', JSON.stringify(images));
}

console.log('✅ Gallery Ready!');
